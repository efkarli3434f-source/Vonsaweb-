/* The atelier is mounted only on product routes. Artwork is supplied by the existing editor. */
(() => {
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  let engineReady;
  function engine(){
    if(!engineReady)engineReady=new Promise((resolve,reject)=>{
      const s=document.createElement('script');s.src='atelier-render.js?v=7.12';s.onload=()=>resolve(window.EJDERAtelierEngine);s.onerror=()=>{engineReady=null;reject(Error('renderer'));};document.head.append(s);
    });
    return engineReady;
  }
  function mount(root,api){
    let canvas=root.querySelector('.at-canvas'),renderer=null,geometry=null,box=null,lib=null,frame=0,visible=true,dead=false;
    let dirtyArt=true,start=null,elapsed=0,last=0,ready=false,fast=false,settle=0;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)'),stage=root.querySelector('.at-stage'),status=root.querySelector('.at-status');
    const buttons=root.querySelectorAll('[data-orbit]'),state=root.querySelector('.at-state'),zoomText=root.querySelector('.at-zoom');
    const listeners=new AbortController(),on=(el,event,fn,opts={})=>el.addEventListener(event,fn,{...opts,signal:listeners.signal});
    const art=document.createElement('canvas'),backArt=document.createElement('canvas'),points=new Map(),defaultYaw=api.id==='mug'?-.23:api.id==='giftbox'?-.47:api.id.startsWith('case')?-.42:-.20;
    const defaultPitch=api.id==='mug'||api.id==='giftbox'?.21:.072;
    let activeSide=api.side?.()||'front';
    const sideYaw=()=>defaultYaw+(activeSide==='back'?Math.PI:0);
    const view={yaw:sideYaw(),pitch:defaultPitch,zoom:1,color:null};
    function hint(text){status.textContent=text;}
    function message(){return api.words('Sürükleyerek döndür · İki parmakla yakınlaştır','Ziehen zum Drehen · Mit zwei Fingern zoomen');}
    function fallback(){
      ready=false;root.dataset.mode='flat';canvas.hidden=true;root.querySelector('.at-fallback').hidden=false;
      root.querySelector('.at-type').textContent=api.words('Fotoğraf ön izlemesi','Fotovorschau');
      hint(api.words('Düz ürün görünümü','Flache Produktansicht'));buttons.forEach(b=>b.disabled=true);api.flat(root.querySelector('.at-fallback'));
    }
    function invalidate(){if(!frame&&!dead&&visible&&!document.hidden&&ready)frame=requestAnimationFrame(draw);}
    function setFast(){fast=true;clearTimeout(settle);settle=setTimeout(()=>{fast=false;invalidate();},140);}
    function resizeCanvas(moving){
      const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;
      const cap=root.dataset.mode==='gpu'?1.65:(moving?.78:1.35);
      const ratio=Math.min(Math.max(devicePixelRatio||1,moving?1:1.35),cap,(root.dataset.mode==='gpu'?1500:moving?480:760)/w);
      const a=Math.max(1,Math.round(w*ratio)),b=Math.max(1,Math.round(h*ratio));
      if(canvas.width!==a||canvas.height!==b){canvas.width=a;canvas.height=b;}
    }
    function updatePrint(){
      const area=api.area(),s=660/Math.max(area.w,area.h);art.width=Math.max(1,Math.round(area.w*s));art.height=Math.max(1,Math.round(area.h*s));
      backArt.width=art.width;backArt.height=art.height;api.paint(art,'front');api.paint(backArt,'back');renderer.art(art,api.doubleSided(),backArt);dirtyArt=false;
    }
    function draw(now){
      frame=0;if(!ready||!visible||document.hidden||dead)return;
      if(start!==null){elapsed+=last?Math.max(0,now-last):0;last=now;}
      const t=start===null?1:Math.min(1,elapsed/2250);
      resizeCanvas(t<1||fast);
      if(dirtyArt)updatePrint();
      view.color=api.color()==='original'?geometry.color:api.color();
      renderer.frame(lib.scene(geometry,box,view,t));
      if(t<1)invalidate();
      else if(start!==null){start=null;last=0;root.dataset.phase='view';hint(message());invalidate();}
    }
    function showProduct(){start=null;last=0;root.dataset.phase='view';hint(message());invalidate();}
    function replay(){
      if(!ready)return;
      if(reduce.matches){showProduct();return;}
      start=1;elapsed=last=0;root.dataset.phase='opening';hint(api.words('Hediye kutusu açılıyor','Geschenkbox öffnet sich'));invalidate();
    }
    function controls(){
      zoomText.textContent=Math.round(view.zoom*100)+'%';
      root.querySelector('[data-orbit="plus"]').disabled=view.zoom>=1.8;
      root.querySelector('[data-orbit="minus"]').disabled=view.zoom<=.65;
      state.textContent=Math.round(((view.yaw*180/Math.PI)%360+360)%360)+'°';
    }
    function change(action){
      if(!ready)return;
      if(action==='replay'){replay();return;}
      showProduct();
      if(action==='left'||action==='right')view.yaw+=(action==='left'?-1:1)*Math.PI/6;
      if(action==='plus'||action==='minus')view.zoom=clamp(Math.round((view.zoom+(action==='plus'?.15:-.15))*100)/100,.65,1.8);
      if(action==='reset')Object.assign(view,{yaw:sideYaw(),pitch:defaultPitch,zoom:1});
      controls();invalidate();
    }
    on(root,'click',e=>{const b=e.target.closest('[data-orbit]');if(b)change(b.dataset.orbit);});
    on(canvas,'keydown',e=>{
      const a={ArrowLeft:'left',ArrowRight:'right','+':'plus','=':'plus','-':'minus',Home:'reset',Escape:'skip'}[e.key];if(!a)return;e.preventDefault();change(a);
    });
    function distance(){const [a,b]=[...points.values()];return Math.hypot(a.x-b.x,a.y-b.y);}
    on(canvas,'pointerdown',e=>{
      if(!ready||e.button!==0)return;showProduct();points.set(e.pointerId,{x:e.clientX,y:e.clientY});try{canvas.setPointerCapture(e.pointerId);}catch{}canvas.classList.add('held');
    });
    on(canvas,'pointermove',e=>{
      const old=points.get(e.pointerId);if(!old||!ready)return;
      const d=points.size===2?distance():0,dx=e.clientX-old.x,dy=e.clientY-old.y;points.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(points.size===2&&d>1)view.zoom=clamp(view.zoom*distance()/d,.65,1.8);
      else if(points.size===1){view.yaw+=dx*2*Math.PI/Math.max(canvas.clientWidth*.77,180);view.pitch=clamp(view.pitch+dy*.009,-1.24,1.24);}
      setFast();controls();invalidate();
    });
    for(const e of ['pointerup','pointercancel','lostpointercapture'])on(canvas,e,event=>{points.delete(event.pointerId);if(!points.size)canvas.classList.remove('held');});
    on(canvas,'wheel',e=>{if(!ready)return;e.preventDefault();showProduct();view.zoom=clamp(view.zoom*Math.exp(-e.deltaY*.0015),.65,1.8);controls();setFast();invalidate();},{passive:false});
    on(document,'visibilitychange',()=>{last=0;invalidate();});
    if(reduce.addEventListener)on(reduce,'change',()=>{if(reduce.matches)showProduct();});
    const ro=window.ResizeObserver?new ResizeObserver(invalidate):null;if(ro)ro.observe(stage);else on(window,'resize',invalidate);
    const io=window.IntersectionObserver?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)begin();invalidate();},{rootMargin:'60px'}):null;if(io)io.observe(stage);else queueMicrotask(begin);
    let begun=false;
    async function begin(){
      if(begun||dead)return;begun=true;
      try{
        lib=await engine();[geometry,box]=await Promise.all([lib.loadModel(api.id==='case'?'case-s24':api.id),lib.loadModel('giftbox')]);if(dead)return;
        let gl=null;try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,preserveDrawingBuffer:false,powerPreference:'low-power'});}catch{}
        if(gl){try{renderer=lib.webgl(canvas,gl);root.dataset.mode='gpu';}catch{fallback();return;}}
        else{renderer=lib.software(canvas);root.dataset.mode='mesh';}
        on(canvas,'webglcontextlost',e=>{e.preventDefault();fallback();});
        on(canvas,'webglcontextrestored',()=>{if(dead||!gl)return;renderer=lib.webgl(canvas,gl);root.dataset.mode='gpu';canvas.hidden=false;root.querySelector('.at-fallback').hidden=true;dirtyArt=true;activate(false);});
        activate(api.opening);
      }catch{if(!dead)fallback();}
    }
    function activate(open){
      ready=true;root.querySelector('.at-type').textContent=api.words('360° ürün modeli','360°-Produktmodell');
      buttons.forEach(b=>b.disabled=false);controls();showProduct();if(open)replay();
    }
    return {
      root,
      face(side){activeSide=side==='back'?'back':'front';view.yaw=sideYaw();view.pitch=defaultPitch;showProduct();if(ready)controls();},
      snapshot(side){if(!ready||!geometry||!lib)return null;if(dirtyArt)updatePrint();const c=document.createElement('canvas');c.width=900;c.height=650;const r=lib.software(c);r.art(art,api.doubleSided(),backArt);r.frame(lib.scene(geometry,box,{...view,yaw:defaultYaw+(side==='back'?Math.PI:0),pitch:defaultPitch,zoom:1,color:api.color()==='original'?geometry.color:api.color()},1));return c;},
      refresh(){dirtyArt=true;if(root.dataset.mode==='flat')api.flat(root.querySelector('.at-fallback'));invalidate();},
      wipe(){art.width=art.height=backArt.width=backArt.height=1;if(renderer&&ready){renderer.art(art,false,backArt);resizeCanvas(false);dirtyArt=true;if(geometry){view.color=api.color()==='original'?geometry.color:api.color();renderer.frame(lib.scene(geometry,box,view,1));}}root.querySelector('.at-fallback')?.getContext('2d')?.clearRect(0,0,450,325);},
      destroy(){dead=true;listeners.abort();io?.disconnect();ro?.disconnect();clearTimeout(settle);cancelAnimationFrame(frame);art.width=art.height=backArt.width=backArt.height=1;renderer?.dispose();canvas.width=canvas.height=1;points.clear();}
    };
  }
  window.EJDERAtelier={mount};
})();
