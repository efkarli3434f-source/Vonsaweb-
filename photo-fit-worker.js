/* Local face-position detection only. No recognition, uploads, or stored photos. */
importScripts('assets/vendor/pico/pico.js');
let classifier;
async function detector(){
  if(!classifier)classifier=fetch('assets/vendor/pico/facefinder.bin').then(async r=>{
    if(!r.ok)throw Error('model');const bytes=new Int8Array(await r.arrayBuffer());
    if(bytes.length!==239632)throw Error('model size');return pico.unpack_cascade(bytes);
  });
  return classifier;
}
self.onmessage=async ({data})=>{
  const {id,width,height,pixels}=data;
  try{
    if(width<1||height<1||width>640||height>640||pixels.length!==width*height)throw Error('dimensions');
    const classify=await detector();
    const raw=pico.run_cascade({pixels,nrows:height,ncols:width,ldim:width},classify,{shiftfactor:.06,minsize:Math.max(24,Math.min(width,height)*.04),maxsize:Math.min(width,height),scalefactor:1.07});
    const candidates=pico.cluster_detections(raw,.2).filter(d=>d[3]>=35).slice(0,40);
    // A tiny isolated feature is weak evidence; small faces together can form a group.
    const reliable=candidates.filter(d=>candidates.length>1||d[2]>=Math.min(width,height)*.08);
    const faces=reliable.map(([y,x,size,score])=>({x:(x-size/2)/width,y:(y-size/2)/height,w:size/width,h:size/height,score}));
    self.postMessage({id,faces,status:faces.length?'found':'none'});
  }catch{self.postMessage({id,faces:[],status:'unavailable'});}
};
