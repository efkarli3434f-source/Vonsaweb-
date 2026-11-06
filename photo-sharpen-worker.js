/* EJDER Studio: background sharpening so the editor stays responsive. Local only. */
'use strict';
importScripts('photo-sharpen-core.js');
self.onmessage=({data})=>{
  const {id,width,height,buffer,amount,sigma,threshold}=data;
  try{
    if(!(width>0&&height>0)||buffer.byteLength!==width*height*4)throw Error('dimensions');
    const pixels=new Uint8ClampedArray(buffer);
    self.EJDERSharpenCore.sharpen(pixels,width,height,amount,sigma,threshold);
    self.postMessage({id,ok:true,buffer:pixels.buffer},[pixels.buffer]);
  }catch{self.postMessage({id,ok:false});}
};
