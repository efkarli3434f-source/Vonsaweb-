/* EJDER Studio print files.
   1) Automatic sharpness for every uploaded photo (adapted to its resolution and blur).
   2) True-size PDF / PNG print files with bleed, crop marks and an optional mirror for
      budget sublimation, 3D vacuum sublimation and transfer printing.
   Everything runs on the device; photos are never uploaded. */
(()=>{
'use strict';
const S=()=>window.EJDERStudio;
const t=(tr,de)=>S()?.language()==='de'?de:tr;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const MM=25.4;

/* ---------- Automatic sharpness ---------- */
let worker=null,workerFailed=false,serial=0,coreReady=null;
const jobs=new Map(),timers=new WeakMap(),running=new Set();
function stopWorker(){if(worker)worker.terminate();worker=null;for(const j of jobs.values())j(null);jobs.clear();}
function loadCore(){
  if(window.EJDERSharpenCore)return Promise.resolve();
  if(!coreReady)coreReady=new Promise((ok,no)=>{const s=document.createElement('script');s.src='photo-sharpen-core.js?v=7.50';s.onload=ok;s.onerror=no;document.head.append(s);});
  return coreReady;
}
async function runSharpen(pixels,width,height,params){
  if(!workerFailed&&typeof Worker==='function'&&location.protocol!=='file:'){
    try{
      if(!worker){
        worker=new Worker(new URL('photo-sharpen-worker.js?v=7.50',document.baseURI));
        worker.onmessage=({data})=>{const done=jobs.get(data.id);if(done){jobs.delete(data.id);done(data.ok?new Uint8ClampedArray(data.buffer):null);}};
        worker.onerror=()=>{workerFailed=true;stopWorker();};
      }
      const id=++serial,copy=new Uint8ClampedArray(pixels);
      const result=await new Promise(resolve=>{jobs.set(id,resolve);worker.postMessage({id,width,height,buffer:copy.buffer,...params},[copy.buffer]);});
      if(result)return result;
    }catch{workerFailed=true;stopWorker();}
  }
  await loadCore();
  return window.EJDERSharpenCore.sharpen(pixels,width,height,params.amount,params.sigma,params.threshold);
}
// Sharpness and resolution of the decoded photo, measured once on a small copy.
function analyse(image){
  const iw=image.naturalWidth,ih=image.naturalHeight,k=Math.min(1,1024/Math.max(iw,ih));
  const c=document.createElement('canvas');c.width=Math.max(3,Math.round(iw*k));c.height=Math.max(3,Math.round(ih*k));
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(image,0,0,c.width,c.height);
  const d=x.getImageData(0,0,c.width,c.height).data,w=c.width,h=c.height,g=new Float32Array(w*h);
  for(let i=0;i<w*h;i++)g[i]=.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2];
  let sum=0,sq=0,n=0;
  for(let y=1;y<h-1;y++)for(let xx=1;xx<w-1;xx++){const i=y*w+xx,l=4*g[i]-g[i-1]-g[i+1]-g[i-w]-g[i+w];sum+=l;sq+=l*l;n++;}
  c.width=c.height=1;
  const variance=n?sq/n-(sum/n)**2:0,long=Math.max(iw,ih);
  const blur=clamp((420-variance)/360,0,1),res=clamp((2400-long)/1600,0,1);
  const auto=Math.round(clamp((variance>1500?8:16)+44*blur+26*res,0,90));
  return {variance,long,blur,res,auto};
}
function paramsFor(amount,a){
  return {amount:amount/100*1.8,sigma:.7+.8*(a?.res||0)+.4*(a?.blur||0),threshold:a&&a.blur>.5?2:4};
}
function wanted(layer,p){
  if(layer.sharpen===0)return 0;
  if(typeof layer.sharpen==='number')return clamp(Math.round(layer.sharpen),0,100);
  return p.sharpInfo?p.sharpInfo.auto:null;
}
function release(canvas){if(canvas){canvas.width=canvas.height=1;}}
async function sharpenNow(p,amount){
  const img=p.img,w=img.naturalWidth,h=img.naturalHeight;if(!w||!h)return;
  p.sharpPending=amount;running.add(p);
  try{
    const c=document.createElement('canvas');c.width=w;c.height=h;
    const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0);
    const data=x.getImageData(0,0,w,h);
    const out=await runSharpen(data.data,w,h,paramsFor(amount,p.sharpInfo));
    if(!out||p.disposed||p.sharpPending!==amount||!img.naturalWidth){release(c);return;}
    if(out!==data.data)data.data.set(out);
    x.putImageData(data,0,0);
    Object.defineProperties(c,{naturalWidth:{value:w},naturalHeight:{value:h},complete:{value:true}});
    const old=p.sharp;p.sharp=c;p.sharpAmount=amount;release(old);
    S()?.redraw();
  }finally{if(p.sharpPending===amount)p.sharpPending=undefined;running.delete(p);}
}
// Called whenever the editor draws a photo: keeps the sharpened copy in step with the layer.
function ensureSharp(layer,p){
  if(!p||p.disposed||!p.img?.naturalWidth)return;
  if(!p.sharpInfo){try{p.sharpInfo=analyse(p.img);}catch{p.sharpInfo={auto:0,blur:0,res:0};}}
  const want=wanted(layer,p);if(want===null)return;
  if(want===0){if(p.sharp){const old=p.sharp;p.sharp=null;p.sharpAmount=0;release(old);}p.sharpPending=undefined;return;}
  if(p.sharpAmount===want||p.sharpPending===want)return;
  clearTimeout(timers.get(p));p.sharpPending=want;
  timers.set(p,setTimeout(()=>{p.sharpPending=undefined;sharpenNow(p,want);},layer.sharpen===undefined||layer.sharpen==='auto'?0:220));
}
function disposeSharp(p){if(!p)return;p.disposed=true;clearTimeout(timers.get(p));const old=p.sharp;p.sharp=null;release(old);}
async function sharpIdle(){for(let i=0;i<80&&(running.size||[...(S()?.photos().values()||[])].some(p=>p.sharpPending!==undefined));i++)await new Promise(r=>setTimeout(r,120));}
function sharpLabel(layer,p){
  const want=p?wanted(layer,p):null;
  if(layer.sharpen===0)return t('Kapalı','Aus');
  if(typeof layer.sharpen==='number')return t('Elle','Manuell')+' · '+want+'%';
  return t('Otomatik','Automatisch')+(want===null?'':' · '+want+'%');
}

/* ---------- Product print sizes (mm). Every value can be changed in the dialog. ---------- */
const SPECS={
  mug:{fit:'stretch',w:100,h:90,bleed:2,note:['11 oz kupa · yüz başına yarım sarma','11-oz-Tasse · halbe Wicklung je Seite']},
  shirt:{fit:'keep',w:260,bleed:2,note:['Göğüs baskısı','Brustdruck']},
  hoodie:{fit:'keep',w:260,bleed:2,note:['Ön baskı (cep üstü)','Frontdruck (über der Tasche)']},
  tote:{fit:'keep',w:280,bleed:2,note:['Çanta ön yüzü','Vorderseite der Tasche']},
  poster:{fit:'keep',w:190,bleed:3,note:['A4 sayfaya sığar','Passt auf A4']},
  cushion:{fit:'stretch',w:400,h:400,bleed:10,note:['40 × 40 cm yastık · dikiş payı dahil','40 × 40 cm Kissen · inkl. Nahtzugabe']},
  keychain:{fit:'cover',w:50,h:50,bleed:2,note:['Yuvarlak anahtarlık (Ø 50 mm)','Runder Anhänger (Ø 50 mm)']},
  giftbox:{fit:'keep',w:150,bleed:3,note:['Kutu ön etiketi','Etikett der Boxfront']}
};
function caseSpec(id){
  const m=window.EJDERCaseCatalog?.models.find(x=>x.id===id),d=m?.deviceMm||[72,150,8];
  // Back plus side walls: 3D sublimation film wraps about 8 mm around each edge.
  return {fit:'keep',w:Math.round((d[0]+19)*2)/2,bleed:2,note:[(m?.model||'Kılıf')+' · arka + yan sarma',(m?.model||'Hülle')+' · Rückseite + Seiten']};
}
function defaults(id){return {...(id.startsWith('case')?caseSpec(id):SPECS[id]||{fit:'keep',w:150,bleed:2}),dpi:300,marks:true,copies:1,wrap:true,auto:true};}
const STORE='ejder-print-v2';
function loadAll(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch{return {};}}
function saveAll(all){try{localStorage.setItem(STORE,JSON.stringify(all));}catch{}}
function settingsFor(id){
  const all=loadAll(),base=defaults(id),own=all.products?.[id]||{};
  const mirror=typeof all.mirror==='boolean'?all.mirror:true,paper=['a4','a3','fit'].includes(all.paper)?all.paper:'a4';
  return {...base,...own,mirror,paper};
}
function remember(id,s){
  const all=loadAll();all.products=all.products||{};
  const {mirror,paper,autoScale,...rest}=s;all.products[id]=rest;all.mirror=!!mirror;all.paper=paper;saveAll(all);
}

/* ---------- Rendering ---------- */
function aspectOf(face){const a=S().printArea(face);return a.w/a.h;}
function sizeOf(s,aspect){
  const w=clamp(Number(s.w)||100,5,1500);
  if(s.fit==='keep')return {w,h:Math.round(w/aspect*10)/10};
  return {w,h:clamp(Number(s.h)||w,5,1500)};
}
function designCanvas(face,pw,ph,fit,aspect){
  // keep/stretch: draw straight into the panel; cover: draw larger, then crop the centre.
  const design={...face,printSquare:true};
  if(fit!=='cover'){const c=document.createElement('canvas');c.width=pw;c.height=ph;S().draw(c,design);return c;}
  let cw=pw,ch=ph;if(pw/ph>aspect)ch=Math.round(pw/aspect);else cw=Math.round(ph*aspect);
  const big=document.createElement('canvas');big.width=cw;big.height=ch;S().draw(big,design);
  const c=document.createElement('canvas');c.width=pw;c.height=ph;c.getContext('2d').drawImage(big,(pw-cw)/2,(ph-ch)/2);release(big);return c;
}
// One printable panel: design(s) at trim size, mirrored edge bleed, optional mirror image.
function panelsFor(faces,s,id){
  const aspect=aspectOf(faces[0]),size=sizeOf(s,aspect);
  if(id==='mug'&&faces.length===2&&s.wrap){
    const back=faces.find(f=>f.side==='back'),front=faces.find(f=>f.side==='front');
    return [{faces:[back,front],w:size.w*2,h:size.h,faceW:size.w,label:'wrap'}];
  }
  return faces.map(f=>({faces:[f],w:size.w,h:size.h,faceW:size.w,label:f.side}));
}
function renderPanel(panel,s,dpi){
  const px=dpi/MM,fw=Math.max(1,Math.round(panel.faceW*px)),ph=Math.max(1,Math.round(panel.h*px));
  const pw=fw*panel.faces.length,b=Math.min(Math.round((Number(s.bleed)||0)*px),pw,ph);
  const trim=document.createElement('canvas');trim.width=pw;trim.height=ph;const tx=trim.getContext('2d');
  panel.faces.forEach((face,i)=>{const c=designCanvas(face,fw,ph,s.fit,aspectOf(face));tx.drawImage(c,i*fw,0);release(c);});
  const out=document.createElement('canvas');out.width=pw+2*b;out.height=ph+2*b;const ox=out.getContext('2d');
  if(s.mirror){ox.translate(out.width,0);ox.scale(-1,1);}
  ox.drawImage(trim,b,b);
  if(b>0){
    const put=(sx,sy,sw,sh,dx,dy,fx,fy)=>{ox.save();ox.translate(dx+(fx<0?sw:0),dy+(fy<0?sh:0));ox.scale(fx,fy);ox.drawImage(trim,sx,sy,sw,sh,0,0,sw,sh);ox.restore();};
    put(0,0,pw,b,b,0,1,-1);put(0,ph-b,pw,b,b,ph+b,1,-1);
    put(0,0,b,ph,0,b,-1,1);put(pw-b,0,b,ph,pw+b,b,-1,1);
    put(0,0,b,b,0,0,-1,-1);put(pw-b,0,b,b,pw+b,0,-1,-1);put(0,ph-b,b,b,0,ph+b,-1,-1);put(pw-b,ph-b,b,b,pw+b,ph+b,-1,-1);
  }
  release(trim);return out;
}
// Lowest effective photo resolution in the printed size.
function photoDpi(faces,s){
  const photos=S().photos();let worst=Infinity;
  for(const face of faces){
    const area=S().printArea(face),A=area.w/area.h,size=sizeOf(s,aspectOf(face)),layers=face.layers.filter(l=>l.type==='image');
    const cover=face.fillMode!=='contain',share=layers.length>1?.6:1;
    for(const l of layers){
      const p=photos.get(l.key),img=p?.img;if(!img?.naturalWidth)continue;
      const r=img.naturalWidth/img.naturalHeight,frac=(cover?Math.max(1,r/A):Math.min(1,r/A))*Math.max(1,l.zoom||1)*share;
      worst=Math.min(worst,img.naturalWidth/(frac*size.w/MM));
    }
  }
  return Number.isFinite(worst)?Math.round(worst):null;
}

/* ---------- Page layout (mm) ---------- */
const PAPERS={a4:[210,297],a3:[297,420]};
const MARGIN=8,FOOT=11;
function itemBox(panel,s){const b=Number(s.bleed)||0,m=s.marks?6:2;return {w:panel.w+2*b+2*m,h:panel.h+2*b+2*m,m,b};}
function capacity(page,box){const cols=Math.floor((page[0]-2*MARGIN)/box.w),rows=Math.floor((page[1]-2*MARGIN-FOOT)/box.h);return cols>0&&rows>0?{cols,rows,n:cols*rows}:null;}
function choosePage(panels,s){
  const boxes=panels.map(p=>itemBox(p,s)),box={w:Math.max(...boxes.map(b=>b.w)),h:Math.max(...boxes.map(b=>b.h))};
  const need=panels.length*clamp(Math.round(s.copies)||1,1,60);
  const candidates=s.paper==='a4'?['a4']:s.paper==='a3'?['a3']:s.paper==='fit'?[]:['a4','a3'];
  for(const name of candidates){
    const [w,h]=PAPERS[name],options=[{name,size:[w,h],orient:'P'},{name,size:[h,w],orient:'L'}]
      .map(o=>({...o,cap:capacity(o.size,box)})).filter(o=>o.cap);
    if(options.length){options.sort((a,b)=>Math.min(b.cap.n,need)-Math.min(a.cap.n,need));return {...options[0],box,need};}
    if(s.paper!=='auto')return {name,size:[w,h],orient:'P',cap:null,box,need,tooBig:true};
  }
  const size=[Math.ceil(box.w+2*MARGIN),Math.ceil(box.h+2*MARGIN+FOOT)];
  return {name:'fit',size,orient:size[0]>size[1]?'L':'P',cap:{cols:1,rows:1,n:1},box,need};
}
function layout(panels,s){
  const page=choosePage(panels,s);if(!page.cap)return {page,pages:[]};
  const items=[];for(let c=0;c<page.need;c++)items.push(panels[c%panels.length]);
  const pages=[];
  for(let i=0;i<items.length;i+=page.cap.n){
    const chunk=items.slice(i,i+page.cap.n),gridW=page.cap.cols*page.box.w,gridH=page.cap.rows*page.box.h;
    const x0=(page.size[0]-gridW)/2,y0=MARGIN+Math.max(0,(page.size[1]-2*MARGIN-FOOT-gridH)/2);
    pages.push(chunk.map((panel,k)=>{const col=k%page.cap.cols,row=Math.floor(k/page.cap.cols),box=itemBox(panel,s);
      return {panel,x:x0+col*page.box.w+(page.box.w-box.w)/2+box.m,y:y0+row*page.box.h+(page.box.h-box.h)/2+box.m,b:box.b};}));
  }
  return {page,pages};
}

/* ---------- PDF (images as JPEG, vector marks, standard Helvetica) ---------- */
const CP1252={'ç':0xE7,'Ç':0xC7,'ö':0xF6,'Ö':0xD6,'ü':0xFC,'Ü':0xDC,'ä':0xE4,'Ä':0xC4,'ß':0xDF,'×':0xD7,'·':0xB7,'°':0xB0,'é':0xE9};
const PLAIN={'ş':'s','Ş':'S','ğ':'g','Ğ':'G','ı':'i','İ':'I','–':'-','—':'-','→':'>','’':"'",'“':'"','”':'"','≈':'~'};
function pdfText(str){let out='';for(const ch of String(str)){const c=PLAIN[ch]??ch,code=CP1252[c]??c.charCodeAt(0);if(code>255)continue;const s=String.fromCharCode(code);out+=s==='('||s===')'||s==='\\'?'\\'+s:s;}return out;}
function bytes(str){const b=new Uint8Array(str.length);for(let i=0;i<str.length;i++)b[i]=str.charCodeAt(i)&255;return b;}
const pt=mm=>(mm*72/MM).toFixed(3);
function buildPdf(pages,images){
  const parts=[],offsets=[];let size=0;const push=x=>{const b=typeof x==='string'?bytes(x):x;parts.push(b);size+=b.length;};
  const begin=n=>{offsets[n]=size;push(n+' 0 obj\n');};
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  const imageBase=4,pageBase=imageBase+images.length;
  begin(1);push('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  begin(2);push('<< /Type /Pages /Count '+pages.length+' /Kids ['+pages.map((_,i)=>(pageBase+2*i)+' 0 R').join(' ')+'] >>\nendobj\n');
  begin(3);push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n');
  images.forEach((im,i)=>{begin(imageBase+i);push(`<< /Type /XObject /Subtype /Image /Width ${im.w} /Height ${im.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${im.data.length} >>\nstream\n`);push(im.data);push('\nendstream\nendobj\n');});
  pages.forEach((pg,i)=>{
    const content=bytes(pg.content),xo=images.map((_,k)=>`/Im${k} ${imageBase+k} 0 R`).join(' ');
    begin(pageBase+2*i);push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pt(pg.w)} ${pt(pg.h)}] /Resources << /Font << /F1 3 0 R >> /XObject << ${xo} >> >> /Contents ${pageBase+2*i+1} 0 R >>\nendobj\n`);
    begin(pageBase+2*i+1);push(`<< /Length ${content.length} >>\nstream\n`);push(content);push('\nendstream\nendobj\n');
  });
  const count=pageBase+2*pages.length,xref=size;
  let table='xref\n0 '+count+'\n0000000000 65535 f \n';for(let n=1;n<count;n++)table+=String(offsets[n]).padStart(10,'0')+' 00000 n \n';
  push(table+'trailer\n<< /Size '+count+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n');
  return new Blob(parts,{type:'application/pdf'});
}
function pageContent(page,items,info,s,panelIndex){
  const H=page.size[1],Y=(y,h=0)=>H-y-h;let c='';
  for(const it of items){
    const p=it.panel,b=it.b,w=p.w+2*b,h=p.h+2*b;
    c+=`q ${pt(w)} 0 0 ${pt(h)} ${pt(it.x)} ${pt(Y(it.y,h))} cm /Im${panelIndex.get(p)} Do Q\n`;
    if(s.marks){
      const L=4,g=1,x0=it.x+b,y0=it.y+b,x1=x0+p.w,y1=y0+p.h,line=(ax,ay,bx,by)=>`${pt(ax)} ${pt(Y(ay))} m ${pt(bx)} ${pt(Y(by))} l S\n`;
      c+='0.25 w 0 0 0 RG\n';
      for(const [x,dir] of [[x0,-1],[x1,1]])for(const [y,v] of [[y0,-1],[y1,1]]){
        c+=line(x+dir*(b+g),y,x+dir*(b+g+L),y);c+=line(x,y+v*(b+g),x,y+v*(b+g+L));
      }
      if(p.label==='wrap'){const mid=x0+p.faceW;c+=line(mid,y0-b-g,mid,y0-b-g-L)+line(mid,y1+b+g,mid,y1+b+g+L);}
    }
  }
  // Footer: settings and a 50 mm control line to verify "actual size" printing.
  const fy=H-MARGIN-FOOT+3;
  c+=`0.4 w 0 0 0 RG ${pt(MARGIN)} ${pt(Y(fy))} m ${pt(MARGIN+50)} ${pt(Y(fy))} l S\n`;
  for(const x of [MARGIN,MARGIN+50])c+=`${pt(x)} ${pt(Y(fy-1.6))} m ${pt(x)} ${pt(Y(fy+1.6))} l S\n`;
  c+=`BT /F1 6.5 Tf ${pt(MARGIN)} ${pt(Y(fy+4.2))} Td (${pdfText(t('Kontrol çizgisi = 50 mm  ·  Yazdırırken: Gerçek boyut / %100','Kontrolllinie = 50 mm  ·  Beim Drucken: Tatsächliche Größe / 100 %'))}) Tj ET\n`;
  c+=`BT /F1 6.5 Tf ${pt(MARGIN+56)} ${pt(Y(fy+.8))} Td (${pdfText(info)}) Tj ET\n`;
  return c;
}

/* ---------- PNG with DPI metadata ---------- */
const CRC=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc(b){let c=0xffffffff;for(const x of b)c=CRC[(c^x)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
async function pngWithDpi(canvas,dpi){
  const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));if(!blob)throw Error('png');
  const b=new Uint8Array(await blob.arrayBuffer());if(String.fromCharCode(...b.slice(12,16))!=='IHDR')return blob;
  const ppm=Math.round(dpi/0.0254),chunk=new Uint8Array(21),v=new DataView(chunk.buffer);
  v.setUint32(0,9);chunk.set(bytes('pHYs'),4);v.setUint32(8,ppm);v.setUint32(12,ppm);chunk[16]=1;v.setUint32(17,crc(chunk.slice(4,17)));
  return new Blob([b.slice(0,33),chunk,b.slice(33)],{type:'image/png'});
}
function jpeg(canvas){
  const c=canvas.getContext('2d');c.save();c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='destination-over';c.fillStyle='#ffffff';c.fillRect(0,0,canvas.width,canvas.height);c.restore();
  return new Promise(r=>canvas.toBlob(r,'image/jpeg',.95));
}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);}

/* ---------- Dialog ---------- */
let dialog=null,state=null,previewTimer=null,busy=false;
const fmt=v=>(Math.round(v*10)/10).toLocaleString(S()?.language()==='de'?'de-DE':'tr-TR');
function currentFaces(){return S().faces();}
function effectiveDpi(panels,s){
  // Very large items are limited to about 36 megapixels per panel to stay within browser memory.
  let dpi=Number(s.dpi)||300;
  for(const p of panels){const px=(p.w+2*(Number(s.bleed)||0))*(p.h+2*(Number(s.bleed)||0))*(dpi/MM)**2;if(px>36e6)dpi=Math.min(dpi,Math.floor(Math.sqrt(36e6/px)*dpi/10)*10);}
  return dpi;
}
// Automatic size: the product's standard print size, reduced only as far as the chosen printer
// paper requires (A4 for budget sublimation printers). Bleed and crop marks are kept full size.
function autoSize(s){
  const base=defaults(state.id),aspect=aspectOf(state.faces[0]);
  const w0=base.h&&s.fit!=='keep'?base.w:sizeOf({...base,fit:'keep'},aspect).w;
  const h0=s.fit==='keep'?w0/aspect:(base.h||sizeOf({...base,fit:'keep'},aspect).h);
  const across=state.id==='mug'&&state.faces.length===2&&s.wrap?2:1;
  let k=1;
  if(s.paper!=='fit'){
    const [pw,ph]=PAPERS[s.paper]||PAPERS.a4,extra=2*(Number(s.bleed)||0)+2*(s.marks?6:2);
    const room=(W,H)=>Math.min((W-2*MARGIN-extra)/(w0*across),(H-2*MARGIN-FOOT-extra)/h0);
    k=Math.min(1,Math.max(room(pw,ph),room(ph,pw)));
  }
  const r=v=>Math.max(5,Math.floor(v*2)/2);
  return {...s,w:r(w0*k),h:r(h0*k),autoScale:k};
}
function cur(){return state.s.auto?autoSize(state.s):state.s;}
function readForm(target){
  const f=id=>dialog.querySelector('#'+id),manual=target&&['prW','prH'].includes(target.id);
  if(manual)state.s={...cur(),auto:false};
  state.s={...state.s,fit:f('prFit').value,w:manual?Number(f('prW').value)||state.s.w:state.s.w,h:manual?Number(f('prH').value)||state.s.h:state.s.h,bleed:clamp(Number(f('prBleed').value)||0,0,25),
    dpi:Number(f('prDpi').value)||300,mirror:f('prMirror').checked,marks:f('prMarks').checked,wrap:f('prWrap').checked,paper:f('prPaper').value,copies:clamp(Math.round(Number(f('prCopies').value)||1),1,60)};
  remember(state.id,state.s);
}
function fillForm(){
  const s=cur(),f=id=>dialog.querySelector('#'+id),size=sizeOf(s,aspectOf(state.faces[0]));
  f('prAuto').hidden=!s.auto;
  f('prFit').value=s.fit;f('prW').value=size.w;f('prH').value=size.h;f('prH').disabled=s.fit==='keep';
  f('prBleed').value=s.bleed;f('prDpi').value=String(s.dpi);f('prMirror').checked=!!s.mirror;f('prMarks').checked=!!s.marks;
  f('prWrap').checked=!!s.wrap;f('prWrapRow').hidden=!(state.id==='mug'&&state.faces.length===2);f('prPaper').value=s.paper;f('prCopies').value=s.copies;
}
function summary(){
  const s=cur(),panels=panelsFor(state.faces,s,state.id),plan=layout(panels,s),dpi=effectiveDpi(panels,s),pd=photoDpi(state.faces,s);
  const paper=plan.page.name==='fit'?t('Tasarım boyutunda sayfa','Seite in Motivgröße'):plan.page.name.toUpperCase()+' '+(plan.page.orient==='L'?t('yatay','quer'):t('dikey','hoch'));
  const one=panels[0],px=v=>Math.round(v*dpi/MM);
  const lines=[];
  if(plan.page.tooBig)lines.push('⚠ '+t('Bu boyut seçilen kâğıda sığmıyor. Kâğıdı “Otomatik” veya “Tasarım boyutunda” yap ya da ölçüyü küçült.','Diese Größe passt nicht auf das gewählte Papier. „Automatisch“ oder „In Motivgröße“ wählen oder Maß verkleinern.'));
  else lines.push(`${paper} · ${plan.pages.length} ${t('sayfa','Seite(n)')} · ${Math.min(plan.page.cap.n,plan.page.need)} ${t('baskı/sayfa','Drucke/Seite')}`);
  lines.push(`${t('Baskı','Druck')}: ${fmt(one.w)} × ${fmt(one.h)} mm + ${fmt(s.bleed)} mm ${t('taşma','Beschnitt')} · ${px(one.w+2*s.bleed)} × ${px(one.h+2*s.bleed)} px · ${dpi} DPI${dpi<s.dpi?' ('+t('bellek için düşürüldü','wegen Speicher reduziert')+')':''}`);
  if(s.auto)lines.push(s.autoScale<.995?`⚙ ${t('Otomatik','Automatisch')}: ${t('ürünün standart ölçüsü','Standardmaß des Produkts')} ${s.paper.toUpperCase()} ${t('kâğıda sığması için','zum Papier passend auf')} %${Math.round(s.autoScale*100)} ${t('ölçeklendi. Tam boy için A3 veya Büyük format seç.','skaliert. Für volle Größe A3 oder Großformat wählen.')}`:`⚙ ${t('Otomatik: ürünün standart baskı ölçüsü, tam boy.','Automatisch: Standarddruckmaß des Produkts in voller Größe.')}`);
  if(s.mirror)lines.push(t('↔ Aynalı: süblimasyon / transfer kâğıdında doğru okunur.','↔ Gespiegelt: auf Sublimations- / Transferpapier seitenrichtig.'));
  let quality='';
  if(pd!==null)quality=pd>=240?`✓ ${t('Fotoğraf kalitesi çok iyi','Fotoqualität sehr gut')} (~${pd} DPI)`:pd>=150?`✓ ${t('Fotoğraf kalitesi uygun; otomatik netlik destekliyor','Fotoqualität passend; automatische Schärfe hilft')} (~${pd} DPI)`:`⚠ ${t('Fotoğraf bu ölçü için düşük çözünürlüklü','Foto für dieses Maß gering aufgelöst')} (~${pd} DPI). ${t('Daha büyük bir fotoğraf veya küçük ölçü önerilir.','Größeres Foto oder kleineres Maß empfohlen.')}`;
  return {lines,quality,plan,panels,dpi};
}
function drawPreview(){
  const sum=summary(),cv=dialog.querySelector('#prPreview'),ctx=cv.getContext('2d');
  dialog.querySelector('#prInfo').innerHTML=sum.lines.map(l=>`<span>${l}</span>`).join('');
  const q=dialog.querySelector('#prQuality');q.textContent=sum.quality;q.className='pr-quality'+(sum.quality.startsWith('⚠')?' warn':'');
  dialog.querySelector('[data-pr=pdf]').disabled=!!sum.plan.page.tooBig;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);
  const page=sum.plan.page.size,k=Math.min((cv.width-16)/page[0],(cv.height-16)/page[1]),ox=(cv.width-page[0]*k)/2,oy=(cv.height-page[1]*k)/2;
  ctx.fillStyle='#fffdf8';ctx.shadowColor='#0008';ctx.shadowBlur=12;ctx.fillRect(ox,oy,page[0]*k,page[1]*k);ctx.shadowBlur=0;
  const first=sum.plan.pages[0]||[],cache=new Map(),thumbDpi=clamp(k*MM*1.4,8,72);
  for(const it of first){
    let img=cache.get(it.panel);if(!img){img=renderPanel(it.panel,cur(),thumbDpi);cache.set(it.panel,img);}
    const b=it.b,w=(it.panel.w+2*b)*k,h=(it.panel.h+2*b)*k;ctx.drawImage(img,ox+it.x*k,oy+it.y*k,w,h);
    ctx.strokeStyle='#c0392b';ctx.setLineDash([3,2]);ctx.lineWidth=1;ctx.strokeRect(ox+(it.x+b)*k,oy+(it.y+b)*k,it.panel.w*k,it.panel.h*k);ctx.setLineDash([]);
  }
  for(const c of cache.values())release(c);
  ctx.fillStyle='#333';ctx.fillRect(ox+MARGIN*k,oy+(page[1]-MARGIN-FOOT+3)*k,50*k,Math.max(1,.5*k));
}
function schedulePreview(){clearTimeout(previewTimer);previewTimer=setTimeout(()=>{if(dialog?.open)try{drawPreview();}catch(e){console.warn(e);}},120);}
function build(){
  dialog=document.createElement('dialog');dialog.className='pr-dialog';dialog.setAttribute('aria-labelledby','prTitle');
  dialog.innerHTML=`<form method="dialog" class="pr-card">
  <div class="pr-head"><h2 id="prTitle"></h2><button value="close" class="pr-x" type="submit" aria-label="${t('Kapat','Schließen')}">✕</button></div>
  <p class="pr-lead" id="prLead"></p>
  <div class="pr-grid">
    <div class="pr-preview"><canvas id="prPreview" width="420" height="440" aria-label="${t('Sayfa ön izlemesi','Seitenvorschau')}"></canvas><p id="prQuality" class="pr-quality" aria-live="polite"></p></div>
    <div class="pr-fields">
      <label>${t('Yerleşim','Platzierung')}<select id="prFit"><option value="keep">${t('Oranı koru (kırpmadan, boşluksuz)','Seitenverhältnis halten (ohne Beschnitt)')}</option><option value="cover">${t('Ölçüyü doldur (kenarlardan kırpar)','Maß füllen (Ränder beschnitten)')}</option><option value="stretch">${t('Ürüne sar (3D ön izlemedeki gibi)','Auf Produkt wickeln (wie 3D-Vorschau)')}</option></select></label>
      <div class="pr-row"><label>${t('Genişlik (mm)','Breite (mm)')}<input id="prW" type="number" min="5" max="1500" step="0.5" inputmode="decimal"></label><label>${t('Yükseklik (mm)','Höhe (mm)')}<input id="prH" type="number" min="5" max="1500" step="0.5" inputmode="decimal"></label></div>
      <div class="pr-row"><label>${t('Taşma payı (mm)','Beschnitt (mm)')}<input id="prBleed" type="number" min="0" max="25" step="0.5" inputmode="decimal"></label><label>${t('Çözünürlük','Auflösung')}<select id="prDpi"><option value="200">200 DPI</option><option value="300">300 DPI</option><option value="360">360 DPI</option></select></label></div>
      <div class="pr-row"><label>${t('Kâğıt','Papier')}<select id="prPaper"><option value="a4">${t('A4 · bütçe yazıcı (önerilen)','A4 · Einsteigerdrucker (empfohlen)')}</option><option value="a3">${t('A3 yazıcı','A3-Drucker')}</option><option value="fit">${t('Büyük format / tam boy','Großformat / volle Größe')}</option></select></label><label>${t('Adet','Anzahl')}<input id="prCopies" type="number" min="1" max="60" step="1" inputmode="numeric"></label></div>
      <label class="pr-check"><input type="checkbox" id="prMirror"> ${t('Ayna görüntü (süblimasyon / transfer kâğıdı)','Spiegeln (Sublimations- / Transferpapier)')}</label>
      <label class="pr-check"><input type="checkbox" id="prMarks"> ${t('Kesim işaretleri','Schnittmarken')}</label>
      <label class="pr-check" id="prWrapRow"><input type="checkbox" id="prWrap"> ${t('Kupa: ön ve arka yüzü tek sarma baskıda birleştir','Tasse: Vorder- und Rückseite als eine Wicklung')}</label>
      <button type="button" class="btn secondary tiny" data-pr="reset">⚙ ${t('Otomatik baskı ayarları','Automatische Druckeinstellungen')}</button><p class="pr-auto" id="prAuto">⚙ ${t('Otomatik: ölçü ürüne ve kâğıda göre ayarlanır. Ölçüyü elle değiştirirsen otomatik kapanır.','Automatisch: Maß nach Produkt und Papier. Bei manueller Änderung wird die Automatik beendet.')}</p>
      <p class="pr-note" id="prNote"></p>
    </div>
  </div>
  <p class="pr-info" id="prInfo" aria-live="polite"></p>
  <div class="pr-actions"><button type="button" class="btn" data-pr="pdf">⎙ ${t('PDF indir (yazdırmaya hazır)','PDF herunterladen (druckfertig)')}</button><button type="button" class="btn secondary" data-pr="png">↓ ${t('PNG indir (DPI bilgili)','PNG herunterladen (mit DPI)')}</button></div>
  <p class="pr-foot">${t('Fotoğraflar cihazında kalır. Ayarlar her ürün için bu tarayıcıda hatırlanır. İlk baskıda kontrol çizgisini cetvelle ölç; 50 mm değilse yazıcıda “Gerçek boyut / %100” seç.','Fotos bleiben auf deinem Gerät. Einstellungen werden je Produkt in diesem Browser gespeichert. Beim ersten Druck die Kontrolllinie nachmessen; ist sie nicht 50 mm, im Druckdialog „Tatsächliche Größe / 100 %“ wählen.')}</p>
  </form>`;
  document.body.append(dialog);
  dialog.addEventListener('input',e=>{if(e.target.matches('input,select')){readForm(e.target);if(cur().fit==='keep')dialog.querySelector('#prH').value=sizeOf(cur(),aspectOf(state.faces[0])).h;schedulePreview();}});
  dialog.addEventListener('change',e=>{if(e.target.matches('input,select')){readForm(e.target);fillForm();schedulePreview();}});
  dialog.addEventListener('click',e=>{
    const b=e.target.closest('[data-pr]');if(!b)return;
    if(b.dataset.pr==='reset'){state.s={...defaults(state.id),mirror:true,paper:state.s.paper};remember(state.id,state.s);fillForm();schedulePreview();}
    if(b.dataset.pr==='pdf')exportPdf();
    if(b.dataset.pr==='png')exportPng();
  });
  dialog.addEventListener('close',()=>{clearTimeout(previewTimer);});
}
async function prepare(){
  const st=S();if(!st)return null;
  if(st.pending()){st.notify(t('Fotoğraf hazırlanıyor; birkaç saniye sonra tekrar dene.','Foto wird vorbereitet; bitte gleich erneut versuchen.'));return null;}
  const faces=currentFaces();
  if(!faces.length){st.notify(t('Önce bir fotoğraf, yazı veya şablon ekle.','Füge zuerst ein Foto, Text oder eine Vorlage hinzu.'));return null;}
  if(!await st.ready(faces)){st.notify(t('Yazı tipi veya şablon yüklenemedi; tekrar dene.','Schrift oder Vorlage konnte nicht geladen werden.'));return null;}
  return faces;
}
async function open(){
  const faces=await prepare();if(!faces)return;
  const id=S().editor().product;
  if(!dialog||dialog.dataset.lang!==S().language()){dialog?.remove();build();dialog.dataset.lang=S().language();}
  state={id,faces,s:settingsFor(id)};
  dialog.querySelector('#prTitle').textContent=t('Baskıya hazırla','Druck vorbereiten')+' · '+S().productName();
  dialog.querySelector('#prLead').textContent=t('Gerçek ölçüde baskı dosyası: otomatik netlik, taşma payı, kesim işaretleri. Yazdırırken “Gerçek boyut / %100” seç.','Druckdatei in Originalgröße: automatische Schärfe, Beschnitt und Schnittmarken. Beim Drucken „Tatsächliche Größe / 100 %“ wählen.');
  const spec=state.id.startsWith('case')?caseSpec(state.id):SPECS[state.id];
  dialog.querySelector('#prNote').textContent=spec?.note?t(...spec.note)+'. '+t('Kendi boş ürününün şablonuna göre ölçüyü değiştirebilirsin.','Maß bei Bedarf an die Vorlage deines Rohlings anpassen.'):'';
  fillForm();
  if(!dialog.open)dialog.showModal();
  await sharpIdle();state.faces=currentFaces();drawPreview();
}
function fileBase(s,panel){const p=state.id.replace(/[^a-z0-9-]/g,'');return `EJDER-${p}-${String(fmt(panel.w)).replace(/[^0-9]/g,'_')}x${String(fmt(panel.h)).replace(/[^0-9]/g,'_')}mm`;}
async function withBusy(fn){
  if(busy)return;busy=true;const buttons=dialog.querySelectorAll('[data-pr=pdf],[data-pr=png]');buttons.forEach(b=>b.disabled=true);
  dialog.querySelector('#prInfo').insertAdjacentHTML('afterbegin',`<span class="pr-busy">${t('Baskı dosyası hazırlanıyor…','Druckdatei wird erstellt …')}</span>`);
  await new Promise(r=>setTimeout(r,30));
  try{await sharpIdle();state.faces=currentFaces();if(!state.faces.length)throw Error('empty');await fn();}
  catch(e){console.warn(e);S().notify(t('Baskı dosyası hazırlanamadı. Ölçüyü veya DPI değerini küçültüp tekrar dene.','Druckdatei konnte nicht erstellt werden. Maß oder DPI verkleinern und erneut versuchen.'));}
  finally{busy=false;buttons.forEach(b=>b.disabled=false);if(dialog.open)drawPreview();}
}
function exportPdf(){return withBusy(async()=>{
  const s=cur(),panels=panelsFor(state.faces,s,state.id),plan=layout(panels,s),dpi=effectiveDpi(panels,s);
  if(!plan.pages.length)throw Error('layout');
  const images=[],index=new Map();
  for(const p of panels){const c=renderPanel(p,s,dpi),blob=await jpeg(c);if(!blob)throw Error('jpeg');index.set(p,images.length);images.push({w:c.width,h:c.height,data:new Uint8Array(await blob.arrayBuffer())});release(c);}
  const info=`EJDER Studio · ${S().productName()} · ${fmt(panels[0].w)} × ${fmt(panels[0].h)} mm · ${t('taşma','Beschnitt')} ${fmt(s.bleed)} mm · ${dpi} DPI${s.mirror?' · '+t('AYNALI','GESPIEGELT'):''}${panels[0].label==='wrap'?' · '+t('Kenarlar kulp tarafı','Ränder = Henkelseite'):''}`;
  const pages=plan.pages.map(items=>({w:plan.page.size[0],h:plan.page.size[1],content:pageContent(plan.page,items,info,s,index)}));
  download(buildPdf(pages,images),fileBase(s,panels[0])+'-'+dpi+'dpi'+(s.mirror?'-ayna':'')+'.pdf');
  S().notify(t('PDF hazır. Yazdırırken “Gerçek boyut / %100” seç; ölçeklendirme kapalı olsun.','PDF bereit. Beim Drucken „Tatsächliche Größe / 100 %“ wählen, ohne Skalierung.'));
});}
function exportPng(){return withBusy(async()=>{
  const s=cur(),panels=panelsFor(state.faces,s,state.id),dpi=effectiveDpi(panels,s),files=[];
  for(const p of panels){const c=renderPanel(p,s,dpi),blob=await pngWithDpi(c,dpi);release(c);files.push({name:fileBase(s,p)+'-'+p.label+'-'+dpi+'dpi'+(s.mirror?'-ayna':'')+'.png',blob});}
  if(files.length===1)download(files[0].blob,files[0].name);
  else download(await window.EJDERDownloads.zip(files),fileBase(s,panels[0])+'-'+dpi+'dpi.zip');
  S().notify(t('PNG hazır. Dosyada baskı çözünürlüğü (DPI) kayıtlıdır.','PNG bereit. Die Druckauflösung (DPI) ist in der Datei gespeichert.'));
});}

window.EJDERPrint={open,ensureSharp,disposeSharp,sharpLabel,wanted,analyse,_test:{buildPdf,layout,panelsFor,renderPanel,sizeOf,settingsFor,defaults,pngWithDpi}};
})();
