/* Local photo tools: no network calls, face counting or persistent photo storage. */
(() => {
 'use strict';
 // Removes only a near-uniform edge-connected background, never guesses people.
 // Caller requires an explicit user choice and retains the original for undo.
 async function removeEdgeBackground(imageData,yieldFrame=()=>Promise.resolve()){
  const {width:w,height:h,data}=imageData,n=w*h;
  const samples=[0,w-1,(h-1)*w,n-1].map(p=>Array.from(data.slice(p*4,p*4+3)));
  const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
  const bg=samples.find(a=>samples.filter(b=>distance(a,b)<35).length>=3);
  if(!bg)throw Error('complex-background');
  const seen=new Uint8Array(n),queue=new Uint32Array(n);let tail=0,head=0;
  const push=p=>{if(seen[p])return;seen[p]=1;const j=p*4;if(data[j+3]<16||Math.hypot(data[j]-bg[0],data[j+1]-bg[1],data[j+2]-bg[2])<=46)queue[tail++]=p;};
  for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}for(let y=1;y<h-1;y++){push(y*w);push(y*w+w-1);}
  while(head<tail){const p=queue[head++],x=p%w;data[p*4+3]=0;if(x)push(p-1);if(x<w-1)push(p+1);if(p>=w)push(p-w);if(p<n-w)push(p+w);if(head%100000===0)await yieldFrame();}
  if(tail>n*.98||tail<n*.005)throw Error('no-background');
  return imageData;
 }
 const api={removeEdgeBackground};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 else window.EJDERPhotoTools=api;
})();
