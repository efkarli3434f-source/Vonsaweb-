/* The language model runs in a dedicated worker. Only static files from this site are requested. */
(() => {
 'use strict';
 const base=new URL('./',document.currentScript.src);
 const greeting='Merhaba, Ejder Stüdyo’ya hoş geldin. Bugün ne tasarlamak istersin?';
 const readyClip=new URL('assets/voice-tr/merhaba.wav',base);
 const workerURL=new URL('assets/vendor/okur/voice-worker.mjs',base);
 function wave(chunks){
  const gap=4800,frames=chunks.reduce((sum,chunk)=>sum+chunk.length,0)+gap*(chunks.length-1);
  if(!chunks.length||frames<=0)throw new Error('natural-render');
  const buffer=new ArrayBuffer(44+2*frames),view=new DataView(buffer);
  function tag(at,word){for(let i=0;i<word.length;i++)view.setUint8(at+i,word.charCodeAt(i));}
  tag(0,'RIFF');view.setUint32(4,buffer.byteLength-8,true);tag(8,'WAVE');tag(12,'fmt ');
  view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);
  view.setUint32(24,48000,true);view.setUint32(28,96000,true);view.setUint16(32,2,true);
  view.setUint16(34,16,true);tag(36,'data');view.setUint32(40,frames*2,true);
  let at=44;
  for(const samples of chunks){
   for(const sample of samples){view.setInt16(at,Math.round(32767*Math.max(-1,Math.min(1,sample))),true);at+=2;}
   at+=gap*2;
  }
  return buffer;
 }
 function create(){
  let worker=null,job=null,id=0;
  const supported=()=>typeof Worker==='function'&&typeof WebAssembly==='object';
  function settle(error,value){
   if(!job)return;
   const pending=job;job=null;clearTimeout(pending.timer);
   if(error)pending.reject(error);else pending.resolve(value);
  }
  function cancel(){
   if(job){
    // A busy WASM synthesis worker can ignore cancel until inference returns. Terminate it.
    const pendingWorker=worker;settle(new Error('canceled'));worker=null;pendingWorker?.terminate();
   }
  }
  function close(){cancel();worker?.terminate();worker=null;}
  function broken(){settle(new Error('natural-load'));worker?.terminate();worker=null;}
  function startWorker(){
   if(worker)return;
   const current=new Worker(workerURL,{type:'module',name:'ejder-turkce-ses'});worker=current;
   current.onerror=()=>{if(worker===current)broken();};
   current.onmessage=({data})=>{
    if(worker!==current)return;
    if(data.type==='error'&&data.id===undefined){broken();return;}
    if(!job||data.id!==job.id)return;
    if(data.type==='chunk')job.chunks.push(data.audio);
    if(data.type==='error'){broken();return;}
    if(data.type==='done'){
     try{settle(null,wave(job.chunks));}catch(error){settle(error);}
    }
   };
  }
  // Warm up only after the greeting has played and capture is already running.
  function prepare(){
   if(worker||!supported())return;
   try{startWorker();worker.postMessage({type:'load',threads:1});}catch{broken();}
  }
  async function render(text){
   cancel();
   if(text===greeting){
    try{
     const response=await fetch(readyClip);
     if(!response.ok)throw new Error('greeting-file');
     const bytes=await response.arrayBuffer();
     if(bytes.byteLength<46||new DataView(bytes).getUint32(0)!==0x52494646)throw new Error('greeting-file');
     return bytes;
    }catch{throw new Error('greeting-file');}
   }
   startWorker();const token=++id;
   return new Promise((resolve,reject)=>{
    job={id:token,resolve,reject,chunks:[],timer:setTimeout(broken,90000)};
    worker.postMessage({type:'speak',id:token,text,speed:1,seed:27,pause:1,temperature:1});
   });
  }
  return {supported,prepare,render,cancel,close,clipURL:text=>text===greeting?readyClip.href:null};
 }
 window.EJDERNaturalTR=Object.freeze({create,greeting});
})();
