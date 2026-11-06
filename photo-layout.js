/* EJDER Studio: private face-aware circular placement, V7.19. */
(()=>{'use strict';
let worker=null,serial=0;const jobs=new Map();
function stop(){if(worker)worker.terminate();worker=null;for(const j of jobs.values()){clearTimeout(j.timer);j.resolve({faces:[],status:'unavailable'});}jobs.clear();}
function locate(image){
  if(typeof Worker!=='function')return Promise.resolve({faces:[],status:'unavailable'});
  const c=document.createElement('canvas'),iw=image.naturalWidth,ih=image.naturalHeight,k=Math.min(1,640/Math.max(iw,ih));
  c.width=Math.max(1,Math.round(iw*k));c.height=Math.max(1,Math.round(ih*k));
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(image,0,0,c.width,c.height);
  const rgba=x.getImageData(0,0,c.width,c.height).data,pixels=new Uint8Array(c.width*c.height);let alpha=0;
  for(let i=0;i<pixels.length;i++){pixels[i]=(2*rgba[i*4]+7*rgba[i*4+1]+rgba[i*4+2])/10;if(rgba[i*4+3]<245)alpha++;}
  const width=c.width,height=c.height;c.width=c.height=1;
  const transparent=alpha>pixels.length*.02;
  return new Promise(resolve=>{
    try{
      if(!worker){worker=new Worker(new URL('photo-fit-worker.js?v=7.52',document.baseURI));worker.onmessage=({data})=>{const job=jobs.get(data.id);if(!job)return;clearTimeout(job.timer);jobs.delete(data.id);job.resolve(data);};worker.onerror=stop;}
      const id=++serial,timer=setTimeout(stop,12000);jobs.set(id,{resolve:result=>resolve(transparent?{...result,status:'transparent'}:result),timer});worker.postMessage({id,width,height,pixels},[pixels.buffer]);
    }catch{stop();resolve({faces:[],status:'unavailable'});}
  });
}
function fit(iw,ih,faces,area){
  const points=[];
  for(const f of faces){
    // Head margins protect the hairline and ears around each detected face.
    const left=Math.max(0,(f.x-f.w*.10)*iw),right=Math.min(iw,(f.x+f.w*1.10)*iw);
    const top=Math.max(0,(f.y-f.h*.25)*ih),bottom=Math.min(ih,(f.y+f.h*1.10)*ih);
    for(const x of [left,right])for(const y of [top,bottom])points.push({x,y});
  }
  if(!points.length)return null;
  let cx=(Math.min(...points.map(p=>p.x))+Math.max(...points.map(p=>p.x)))/2;
  let cy=(Math.min(...points.map(p=>p.y))+Math.max(...points.map(p=>p.y)))/2;
  const radius=(x,y)=>Math.max(...points.map(p=>Math.hypot(p.x-x,p.y-y)));
  let r=radius(cx,cy),step=Math.max(iw,ih)/4;
  for(let n=0;n<18;n++){
    let best={x:cx,y:cy,r};
    for(const dx of [-step,0,step])for(const dy of [-step,0,step]){const rr=radius(cx+dx,cy+dy);if(rr<best.r)best={x:cx+dx,y:cy+dy,r:rr};}
    cx=best.x;cy=best.y;r=best.r;step*=.5;
  }
  const scale=Math.min(Math.max(area.w/iw,area.h/ih),Math.min(area.w,area.h)*.47/Math.max(1,r));
  return {x:area.x+area.w/2-cx*scale,y:area.y+area.h/2-cy*scale,w:iw*scale,h:ih*scale,scale,points,cx,cy};
}
// Feather only the outer source edge, never the faces. The source is unchanged.
const softened=new WeakMap();
function soften(image){
  if(softened.has(image))return softened.get(image);
  const c=document.createElement('canvas');const k=Math.min(1,2048/Math.max(image.naturalWidth,image.naturalHeight));c.width=Math.round(image.naturalWidth*k);c.height=Math.round(image.naturalHeight*k);
  const x=c.getContext('2d');x.drawImage(image,0,0,c.width,c.height);x.globalCompositeOperation='destination-in';
  const edge=Math.max(1,Math.min(c.width,c.height)*.025);
  for(const vertical of [false,true]){const n=vertical?c.height:c.width,g=x.createLinearGradient(0,0,vertical?0:n,vertical?n:0);g.addColorStop(0,'transparent');g.addColorStop(edge/n,'black');g.addColorStop(1-edge/n,'black');g.addColorStop(1,'transparent');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);}
  softened.set(image,c);return c;
}
window.EJDERPhotoLayout={locate,fit,soften,stop};
})();
