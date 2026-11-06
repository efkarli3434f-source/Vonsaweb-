/* EJDER Studio. One indexed mesh and one print texture feed both rendering paths.
   The software path also uses normals, UV coordinates and a per-pixel depth buffer. */
(() => {
  'use strict';
  const clip=(x,a,b)=>Math.max(a,Math.min(b,x));
  const decode=(s,Type)=>new Type(Uint8Array.from(atob(s),c=>c.charCodeAt(0)).buffer);
  const rgb=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)/255);
  const materials={
    camera:['#151925',.7],lens:['#10213c',.9],glint:['#5a7793',.85],flash:['#e8dfc7',.65],gold:['#edbf79',.87],brass:['#aa7845',.82],wood:['#50372a',.22],cord:['#6b6258',.25],
    silk:['#e6ad63',.68],velvet:[null,.22],paper:[null,.04],fabric:[null,.03],backcloth:[null,.03],
    piping:[null,.12],inner:[null,.12],ceramic:[null,.63],glaze:[null,.70],body:[null,.24]
  };
  function surface(mat,color,opening){
    const [base,shine]=materials[mat];let c=rgb(base||(opening?'#65162c':color));
    if(mat==='inner')c=c.map(v=>v*.79);
    if(mat==='piping')c=c.map(v=>v*.87);
    return [c,shine];
  }
  const loads=new Map();window.EJDERMeshes=Object.create(null);
  function loadModel(key){
    if(!/^[a-z0-9-]+$/.test(key))return Promise.reject(Error('model'));
    if(loads.has(key))return loads.get(key);
    const ready=new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src='assets/atelier/'+key+'.js';
      script.onerror=()=>{script.remove();reject(Error('mesh'));};
      script.onload=async()=>{
        try{
          const data=window.EJDERMeshes[key];delete window.EJDERMeshes[key];
          data.parts=data.parts.map(p=>{
            const vertices=Float32Array.from(decode(p.v,Int16Array),v=>v/4096);
            return {mat:p.m,group:p.g,ink:p.ink,cloth:p.cloth,vertices,indices:decode(p.i,Uint16Array),stride:6+2*Number(p.ink)+2*Number(p.cloth)};
          });
          extendPrint(data,key);
          addBackPrint(data,key);
          if(data.texture){
            const img=new Image();img.src=data.texture;await img.decode();
            const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);
            data.fabric=c;
          }
          delete data.texture;resolve(data);
        }catch(e){reject(e);}finally{script.remove();}
      };
      document.head.append(script);
    });
    loads.set(key,ready);ready.catch(()=>loads.delete(key));return ready;
  }
  function extendPrint(model,key){
    if(key==='mug'){
      // Each independent image covers one 180-degree half of the mug.
      for(const part of model.parts)if(part.ink)for(let i=0;i<part.vertices.length;i+=part.stride)part.vertices[i+6]=.5+(part.vertices[i+6]-.5)/1.68;
      return;
    }
    if(key==='cushion'){
      // The whole fabric face is printable; old UVs left a wide unprinted border.
      for(const part of model.parts){if(!part.ink)continue;
        const v=part.vertices,s=part.stride,x=[],y=[];
        for(let i=0;i<v.length;i+=s){x.push(v[i]);y.push(v[i+1]);}
        const left=Math.min(...x),right=Math.max(...x),bottom=Math.min(...y),top=Math.max(...y);
        for(let i=0;i<v.length;i+=s){v[i+6]=(v[i]-left)/(right-left);v[i+7]=(top-v[i+1])/(top-bottom);}
      }
      return;
    }
    if(!key.startsWith('case')&&key!=='poster')return;
    for(const part of model.parts){if(!part.ink)continue;
      const v=part.vertices,s=part.stride,points=[];for(let i=0;i<v.length;i+=s)if(v[i+5]>.5)points.push(i);
      if(!points.length)continue;
      const minX=Math.min(...points.map(i=>v[i])),maxX=Math.max(...points.map(i=>v[i])),minY=Math.min(...points.map(i=>v[i+1])),maxY=Math.max(...points.map(i=>v[i+1])),z=Math.max(...points.map(i=>v[i+2]));
      const wrap=key.startsWith('case')?.12:0,w=maxX-minX+2*wrap,h=maxY-minY+2*wrap;
      for(let i=0;i<v.length;i+=s){const x=v[i],y=v[i+1],nz=v[i+5],outward=x*v[i+3]+y*v[i+4]>0;
        if(nz<-.5||nz<.5&&!outward){v[i+6]=v[i+7]=-10;continue;}
        const d=Math.min(wrap,Math.max(0,z-v[i+2]));
        const xx=x+(Math.abs(v[i+3])>.4?Math.sign(x)*d:0),yy=y+(Math.abs(v[i+4])>.4?Math.sign(y)*d:0);
        v[i+6]=(xx-minX+wrap)/w;v[i+7]=(maxY+wrap-yy)/h;
      }
    }
  }
  // Add UVs to opposite printable faces; the poster receives an outer rear paper panel.
  function addBackPrint(model,key){
    const backIndex={shirt:1,hoodie:1,cushion:1,tote:1,poster:7,keychain:1,giftbox:7}[key];
    if(backIndex===undefined)return;
    const front=model.parts.find(p=>p.ink),back=model.parts[backIndex];if(!front||!back)return;
    const regression=(axis,uv)=>{let n=0,sx=0,sy=0,sxx=0,sxy=0;
      for(let i=0;i<front.vertices.length;i+=front.stride){const v=front.vertices;if(v[i+5]<.5)continue;const x=v[i+axis],y=v[i+uv];n++;sx+=x;sy+=y;sxx+=x*x;sxy+=x*y;}
      const a=(n*sxy-sx*sy)/(n*sxx-sx*sx);return [a,(sy-a*sx)/n];};
    const [ax,bx]=regression(0,6),[ay,by]=regression(1,7);if(![ax,bx,ay,by].every(Number.isFinite))return;
    const stride=8+2*Number(back.cloth),out=new Float32Array(back.vertices.length/back.stride*stride);
    for(let i=0,j=0;i<back.vertices.length;i+=back.stride,j+=stride){out.set(back.vertices.subarray(i,i+6),j);if(key==='poster')out[j+2]=model.parts[1].vertices[2]-.001;out[j+6]=1-(ax*back.vertices[i]+bx);out[j+7]=ay*back.vertices[i+1]+by;
      if(back.cloth)out.set(back.vertices.subarray(i+6+2*Number(back.ink),i+8+2*Number(back.ink)),j+8);}
    back.vertices=out;back.stride=stride;back.ink=true;back.backInk=true;if(key==='keychain')back.mat='body';
  }
  const smooth=(a,b,t)=>{const x=clip((t-a)/(b-a),0,1);return x*x*(3-2*x);};
  function pose(yaw,pitch,scale=1,y=0,x=0,z=0,tilt=0,sx=1,sy=1,sz=1,pull=0){
    // Compose placement with the local tilt/scale. Translation is in camera space.
    const c= Math.cos(yaw),s=Math.sin(yaw),a=Math.cos(pitch),b=Math.sin(pitch),k=Math.cos(tilt),l=Math.sin(tilt);
    return {m:new Float32Array([c*k*sx*scale,(a*l+b*s*k)*sx*scale,(b*l-a*s*k)*sx*scale,-c*l*sy*scale,(a*k-b*s*l)*sy*scale,(b*k+a*s*l)*sy*scale,s*sz*scale,-b*c*sz*scale,a*c*sz*scale]),t:[x,y,z],pull};
  }
  function scene(model,gift,view,t){
    if(t>=1)return [{model,pose:pose(view.yaw,view.pitch,view.zoom),color:view.color}];
    const untie=smooth(.10,.43,t),lid=smooth(.36,.73,t),rise=smooth(.41,.94,t),away=smooth(.68,.96,t);
    const boxYaw=-.47,boxPitch=.21,boxY=-.12-2.35*away,scale=.88*(1-away*.18);
    const items=[{model:gift,color:'#711830',opening:true,group:g=>{
      if(g==='base')return away>=1?null:pose(boxYaw,boxPitch,scale,boxY);
      if(g==='lid')return away>=1?null:pose(boxYaw-.16*lid,boxPitch-.8*lid,scale,boxY+1.12*lid,-1.84*lid,-.45*lid,-.38*lid);
      if(untie>=1)return null;
      const dir=(g.endsWith('L')?-1:1),knot=g==='knot',bow=g.startsWith('bow');
      return pose(boxYaw,boxPitch,scale,boxY+(.17- .65*untie)*untie,knot?0:dir*1.02*untie,0,dir*.34*untie,knot?1-untie:1+untie*.27,1-untie*.42,1-untie*.25,bow?untie:0);
    }}];
    if(rise>0)items.push({model,color:view.color,pose:pose(view.yaw+.60*(1-rise),view.pitch,view.zoom*(.23+.77*rise),-.37*(1-rise)+.32*Math.sin(pi*rise),0,0)});
    return items;
  }
  const pi=Math.PI;
  const vertex=`attribute vec3 pos, normal;attribute vec2 inkUV, clothUV;
    uniform mat3 model;uniform vec3 shift;uniform vec2 fit;uniform float pull;
    varying vec3 n;varying float wash;varying vec2 uv, fabric;
    void main(){vec3 p=pos;p.y-=pull*.55*abs(p.x);vec3 v=model*p+shift;
      float w=1.-v.z/6.4;gl_Position=vec4(v.xy*fit,-v.z*.17,w);
      n=model*normal;wash=.976+.040*pos.y-.047*pos.x;uv=inkUV;fabric=clothUV;}`;
  const fragment=`precision mediump float;varying vec3 n;varying float wash;varying vec2 uv,fabric;uniform vec3 tint;uniform float gloss,prints,cloth,doubleMug,backFace;
    uniform sampler2D artwork,backArtwork,weave;
    void main(){vec3 N=normalize(n);float kd=.62+.32*max(0.,dot(N,vec3(-.43,.64,.64)))+.12*max(0.,dot(N,vec3(.79,.23,.57)));
      float l=(N.x+.49)*6.,r=(N.x-.66)*8.;float softbox=.22*exp(-l*l)+.09*exp(-r*r);
      float spec=gloss*(softbox*max(N.z,0.)+.35*pow(max(dot(N,vec3(-.24,.39,.889)),0.),24.)+.30*pow(1.-abs(N.z),3.));
      vec3 c=tint;if(cloth>.5)c*=.25+texture2D(weave,fabric).r*.91;
      vec2 ink=uv;
      float useBack=backFace;if(doubleMug>.5){float band=floor(ink.x);ink.x-=band;if(abs(band)>.5)useBack=1.;}
      if(prints>.5 && min(ink.x,ink.y)>=0. && max(ink.x,ink.y)<=1.){vec4 a=useBack>.5?texture2D(backArtwork,ink):texture2D(artwork,ink);c=mix(c,a.rgb,a.a);}
      gl_FragColor=vec4(c*kd*wash+spec*vec3(1.,.88,.73),1.);}`;
  function webgl(canvas,gl){
    const program=gl.createProgram();const shader=(kind,source)=>{const s=gl.createShader(kind);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('shader');gl.attachShader(program,s);gl.deleteShader(s);};
    shader(gl.VERTEX_SHADER,vertex);shader(gl.FRAGMENT_SHADER,fragment);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('program');gl.useProgram(program);
    const u=Object.fromEntries('model shift fit pull tint gloss prints cloth doubleMug backFace artwork backArtwork weave'.split(' ').map(k=>[k,gl.getUniformLocation(program,k)]));
    const a=Object.fromEntries('pos normal inkUV clothUV'.split(' ').map(k=>[k,gl.getAttribLocation(program,k)]));
    const buffers=new Map(),fabrics=new Map();
    function texture(unit){
      gl.activeTexture(gl.TEXTURE0+unit);const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
      for(const param of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,param,gl.LINEAR);
      for(const param of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,param,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255,0]));return tex;
    }
    const ink=texture(0),empty=texture(1),backInk=texture(2);gl.uniform1i(u.artwork,0);gl.uniform1i(u.weave,1);gl.uniform1i(u.backArtwork,2);
    gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
    function upload(tex,img,unit){gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);}
    return {
      art(c,doubleSided=false,back=c){gl.uniform1f(u.doubleMug,doubleSided?1:0);upload(ink,c,0);upload(backInk,back,2);},
      frame(list){
        gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        const k=Math.min(canvas.height*.344,canvas.width*.385);
        gl.uniform2f(u.fit,2*k/canvas.width,2*k/canvas.height);
        for(const item of list){
          let cloth=empty;if(item.model.fabric){cloth=fabrics.get(item.model);if(!cloth){cloth=texture(1);upload(cloth,item.model.fabric,1);fabrics.set(item.model,cloth);}}
          gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,cloth);
          for(const part of item.model.parts){
            const pose=item.group?item.group(part.group):item.pose;if(!pose)continue;
            let b=buffers.get(part);if(!b){b=[gl.createBuffer(),gl.createBuffer()];buffers.set(part,b);gl.bindBuffer(gl.ARRAY_BUFFER,b[0]);gl.bufferData(gl.ARRAY_BUFFER,part.vertices,gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,b[1]);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,part.indices,gl.STATIC_DRAW);}
            gl.bindBuffer(gl.ARRAY_BUFFER,b[0]);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,b[1]);
            for(const [attr,n,offset,active] of [[a.pos,3,0,true],[a.normal,3,3,true],[a.inkUV,2,6,part.ink],[a.clothUV,2,8,part.cloth]]){
              if(active){gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,n,gl.FLOAT,false,part.stride*4,offset*4);}
              else{gl.disableVertexAttribArray(attr);gl.vertexAttrib2f(attr,0,0);}
            }
            const [color,shine]=surface(part.mat,item.color,item.opening);
            gl.uniform3fv(u.tint,color);gl.uniform1f(u.gloss,shine);gl.uniform1f(u.prints,part.ink&&!item.opening?1:0);gl.uniform1f(u.backFace,part.backInk?1:0);gl.uniform1f(u.cloth,Number(part.cloth));
            gl.uniformMatrix3fv(u.model,false,pose.m);gl.uniform3fv(u.shift,pose.t);gl.uniform1f(u.pull,pose.pull);
            gl.drawElements(gl.TRIANGLES,part.indices.length,gl.UNSIGNED_SHORT,0);
          }
        }
      },
      dispose(){for(const pair of buffers.values())pair.forEach(b=>gl.deleteBuffer(b));for(const tex of [ink,backInk,empty,...fabrics.values()])gl.deleteTexture(tex);gl.deleteProgram(program);gl.getExtension('WEBGL_lose_context')?.loseContext();}
    };
  }
  // Hardware-independent fallback. Triangles use perspective-correct UVs and a Z buffer.
  function software(canvas){
    const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)throw Error('canvas');
    let rgba,depth,ink=null,backInk=null,doubleMug=false,screen=new Float32Array(0);const clothCache=new WeakMap();
    function pixels(c){return c.getContext('2d').getImageData(0,0,c.width,c.height);}
    return {
      art(c,doubleSided=false,back=c){ink=pixels(c);backInk=pixels(back);doubleMug=doubleSided;},
      frame(list){
        const w=canvas.width,h=canvas.height,k=Math.min(h*.344,w*.385);
        if(!rgba||rgba.width!==w||rgba.height!==h){rgba=ctx.createImageData(w,h);depth=new Float32Array(w*h);}
        const out=rgba.data;out.fill(0);depth.fill(-Infinity);
        for(const item of list){
          let cloth=null;if(item.model.fabric){cloth=clothCache.get(item.model);if(!cloth){cloth=pixels(item.model.fabric);clothCache.set(item.model,cloth);}}
          for(const part of item.model.parts){
            const pose=item.group?item.group(part.group):item.pose;if(!pose)continue;
            const [tint,shine]=surface(part.mat,item.color,item.opening);
            const m=pose.m,t=pose.t,v=part.vertices,idx=part.indices,s=part.stride,n=v.length/s;
            if(screen.length<n*9)screen=new Float32Array(n*9);
            for(let i=0,j=0;i<v.length;i+=s,j+=9){
              const x=v[i],y=v[i+1]-pose.pull*.55*Math.abs(x),z=v[i+2];
              const vx=m[0]*x+m[3]*y+m[6]*z+t[0],vy=m[1]*x+m[4]*y+m[7]*z+t[1],vz=m[2]*x+m[5]*y+m[8]*z+t[2],iw=1/(1-vz/6.4);
              let nx=m[0]*v[i+3]+m[3]*v[i+4]+m[6]*v[i+5],ny=m[1]*v[i+3]+m[4]*v[i+4]+m[7]*v[i+5],nz=m[2]*v[i+3]+m[5]*v[i+4]+m[8]*v[i+5];const l=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;nx/=l;ny/=l;nz/=l;
              screen[j]=w*.5+vx*iw*k;screen[j+1]=h*.5-vy*iw*k;screen[j+2]=iw;
              screen[j+3]=(.62+.32*Math.max(0,-.43*nx+.64*ny+.64*nz)+.12*Math.max(0,.79*nx+.23*ny+.57*nz))*(.976+.040*y-.047*x);
              const softbox=.22*Math.exp(-Math.pow((nx+.49)*6,2))+.09*Math.exp(-Math.pow((nx-.66)*8,2));
              screen[j+4]=shine*(softbox*Math.max(0,nz)+.35*Math.pow(Math.max(0,-.24*nx+.39*ny+.889*nz),24)+.30*Math.pow(1-Math.min(1,Math.abs(nz)),3))*255;
              if(part.ink){screen[j+5]=v[i+6]*iw;screen[j+6]=v[i+7]*iw;}
              if(part.cloth){screen[j+7]=v[i+8]*iw;screen[j+8]=v[i+9]*iw;}
            }
            const f=screen,R=tint[0]*255,G=tint[1]*255,B=tint[2]*255,print=part.ink&&!item.opening&&ink;
            for(let i=0;i<idx.length;i+=3){
              const a=idx[i]*9,b=idx[i+1]*9,c=idx[i+2]*9,ax=f[a],ay=f[a+1],bx=f[b],by=f[b+1],cx=f[c],cy=f[c+1];
              const det=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);if(Math.abs(det)<.012)continue;
              const lowX=Math.max(0,Math.ceil(Math.min(ax,bx,cx)-.5)),highX=Math.min(w-1,Math.floor(Math.max(ax,bx,cx)-.5));
              const lowY=Math.max(0,Math.ceil(Math.min(ay,by,cy)-.5)),highY=Math.min(h-1,Math.floor(Math.max(ay,by,cy)-.5));
              const dxA=(by-cy)/det,dxB=(cy-ay)/det,dyA=(cx-bx)/det,dyB=(ax-cx)/det;
              for(let y=lowY;y<=highY;y++){
                let A=dxA*(lowX+.5-cx)+dyA*(y+.5-cy),Bary=dxB*(lowX+.5-cx)+dyB*(y+.5-cy);
                for(let x=lowX,p=y*w+x;x<=highX;x++,p++,A+=dxA,Bary+=dxB){
                  const C=1-A-Bary;if(A<-.0001||Bary<-.0001||C<-.0001)continue;
                  const iw=A*f[a+2]+Bary*f[b+2]+C*f[c+2];if(iw<=depth[p])continue;depth[p]=iw;
                  const kd=A*f[a+3]+Bary*f[b+3]+C*f[c+3],sp=A*f[a+4]+Bary*f[b+4]+C*f[c+4];let r=R,g=G,bl=B;
                  if(part.cloth&&cloth){
                    const u=clip((A*f[a+7]+Bary*f[b+7]+C*f[c+7])/iw,0,1),v=clip((A*f[a+8]+Bary*f[b+8]+C*f[c+8])/iw,0,1);
                    const light=.25+cloth.data[((v*(cloth.height-1)|0)*cloth.width+(u*(cloth.width-1)|0))*4]/255*.91;r*=light;g*=light;bl*=light;
                  }
                  if(print){
                    let u=(A*f[a+5]+Bary*f[b+5]+C*f[c+5])/iw;
                    let texture=part.backInk?backInk:ink;if(doubleMug){const band=Math.floor(u);u-=band;if(band)texture=backInk;}
                    const v=(A*f[a+6]+Bary*f[b+6]+C*f[c+6])/iw;
                    if(texture&&u>=0&&u<=1&&v>=0&&v<=1){const j=((v*(texture.height-1)|0)*texture.width+(u*(texture.width-1)|0))*4,alpha=texture.data[j+3]/255;r+=(texture.data[j]-r)*alpha;g+=(texture.data[j+1]-g)*alpha;bl+=(texture.data[j+2]-bl)*alpha;}
                  }
                  const j=p*4;out[j]=r*kd+sp;out[j+1]=g*kd+sp*.88;out[j+2]=bl*kd+sp*.73;out[j+3]=255;
                }
              }
            }
          }
        }
        ctx.putImageData(rgba,0,0);
      },
      dispose(){ink=backInk=rgba=depth=null;screen=new Float32Array(0);ctx.clearRect(0,0,canvas.width,canvas.height);}
    };
  }
  window.EJDERAtelierEngine={loadModel,scene,webgl,software};
})();
