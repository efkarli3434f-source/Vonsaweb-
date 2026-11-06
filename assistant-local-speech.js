/* EJDER local speech fallback. No text/audio is sent to another server.
   meSpeak/eSpeak is distributed unmodified with its GPLv3 license and source archive. */
(() => {
 'use strict';
 const base=new URL('assets/vendor/mespeak/',document.currentScript.src);
 let loading=null;
 const languages=new Map();
 function library(){
  if(window.meSpeak)return Promise.resolve(window.meSpeak);
  if(loading)return loading;
  loading=new Promise((resolve,reject)=>{
   const script=document.createElement('script');script.src=new URL('mespeak.js',base).href;
   const timer=setTimeout(()=>reject(new Error('local-load-timeout')),15000);
   script.onload=()=>{clearTimeout(timer);window.meSpeak?resolve(window.meSpeak):reject(new Error('local-unavailable'));};
   script.onerror=()=>{clearTimeout(timer);script.remove();reject(new Error('local-network'));};
   document.head.append(script);
  }).catch(error=>{loading=null;throw error;});
  return loading;
 }
 async function voice(lang){
  const api=await library();if(api.isVoiceLoaded(lang))return api;
  if(!languages.has(lang))languages.set(lang,new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(new Error('local-load-timeout')),15000);
   api.loadVoice(new URL('voices/'+lang+'.json',base).href,(ok)=>{clearTimeout(timer);ok?resolve(api):reject(new Error('local-voice'));});
  }).catch(error=>{languages.delete(lang);throw error;}));
  return languages.get(lang);
 }
 function create(){
  const nav=window.navigator||{};
  const mobile=!!(nav.userAgentData?.mobile||/Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent||'')||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1));
  const neural=window.EJDERNaturalTR?.create(mobile);
  let context=null,ownsContext=false,source=null,epoch=0,timer=0,rejectPending=null;
  let media=null,primed=false,cached=null,clearMedia=null;
  // The first tap opens the same media element that will play asynchronous replies.
  const silence='data:audio/wav;base64,UklGRsQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YaAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA';
  const supported=()=>!!(window.Audio||window.AudioContext||window.webkitAudioContext);
  function unlock(shared){
   if(!media&&window.Audio)try{media=new window.Audio();media.preload='auto';}catch{}
   if(media&&!primed&&!cached){
    primed=true;
    try{media.src=silence;Promise.resolve(media.play()).catch(()=>{if(media?.src===silence)primed=false;});}catch{primed=false;}
   }
   if(shared&&shared!==context){if(ownsContext&&context)void context.close().catch(()=>{});context=shared;ownsContext=false;}
   if(!supported())return;
   try{
    if(!context||context.state==='closed'){context=new (window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'});ownsContext=true;}
    if(context.state!=='running')void context.resume().catch(()=>{});
   }catch{}
  }
  function cancel(){
   neural?.cancel();epoch++;clearTimeout(timer);timer=0;
   if(clearMedia){const reject=rejectPending;clearMedia();media.pause();reject(new Error('canceled'));}
   if(source){source.onended=null;try{source.stop();}catch{}source.disconnect();source=null;}
   if(rejectPending){const reject=rejectPending;rejectPending=null;reject(new Error('canceled'));}
  }
  function releaseClip(){
   if(cached){if(cached.objectURL)URL.revokeObjectURL(cached.objectURL);cached=null;}
  }
  // Both speech engines produce mono PCM16. This path also works without a media codec.
  function clip(bytes,text,lang,engine){
   if(bytes.byteLength<46)return null;
   const wav=new DataView(bytes);
   if(wav.getUint32(0)!==0x52494646||wav.getUint32(36)!==0x64617461||
      wav.getUint16(20,true)!==1||wav.getUint16(22,true)!==1||wav.getUint16(34,true)!==16)return null;
   const size=Math.min(wav.getUint32(40,true),bytes.byteLength-44),rate=wav.getUint32(24,true);
   let peak=0;
   for(let i=44;i+1<44+size;i+=2)peak=Math.max(peak,Math.abs(wav.getInt16(i,true))/32768);
   if(!rate||peak<0.0001)throw new Error('local-empty-audio');
   return {text,lang,engine,bytes,peak,rate,frames:Math.floor(size/2),duration:size/(rate*2),objectURL:null};
  }
  function engineClipURL(item){return mobile&&item.engine==='neural'?neural?.clipURL?.(item.text):null;}
  function playMedia(item,onStart){
   return new Promise((resolve,reject)=>{
    const direct=engineClipURL(item);
    if(!direct&&!item.objectURL)item.objectURL=URL.createObjectURL(new Blob([item.bytes],{type:'audio/wav'}));
    const url=direct||item.objectURL;
    const player=media,details={engine:item.engine,duration:item.duration,peak:item.peak};
    let started=false;
    const cleanup=()=>{clearTimeout(timer);clearMedia=rejectPending=null;player.onplaying=player.onended=player.onerror=null;};
    const fail=err=>{if(clearMedia!==cleanup)return;const interrupted=started&&player.currentTime>0.2;cleanup();player.pause();reject(new Error(interrupted?'playback-interrupted':err));};
    clearMedia=cleanup;rejectPending=reject;
    player.onplaying=()=>{if(!started){started=true;onStart(details);}};
    player.onended=()=>{if(!started||player.currentTime+0.15<item.duration){fail('media-no-progress');return;}
     const elapsed=player.currentTime;cleanup();resolve({...details,elapsed});};
    player.onerror=()=>fail('media-error');
    timer=setTimeout(()=>fail('media-timeout'),item.duration*1000+4500);
    try{
     if(player.src!==url)player.src=url;else player.currentTime=0;
     Promise.resolve(player.play()).catch(error=>fail(error?.name==='NotAllowedError'?'not-allowed':'media-error'));
    }catch{fail('media-error');}
   });
  }
  async function play(text,lang,onStart=()=>{},engine='local'){
   cancel();const token=epoch;unlock();
   if(!context&&!media)throw new Error('unsupported');
   const ctx=context,current=()=>token===epoch&&ctx===context;
   const guard=()=>{if(!current())throw new Error('canceled');};
   let bytes;
   if(cached?.text!==text||cached?.lang!==lang||cached?.engine!==engine){
    releaseClip();
    if(engine==='neural'){
     bytes=await neural.render(text);guard();
    }else{
     const api=await voice(lang==='de'?'de':'tr');guard();
     bytes=await new Promise((resolve,reject)=>{
      rejectPending=reject;timer=setTimeout(()=>{rejectPending=null;reject(new Error('local-render-timeout'));},15000);
      api.speak(text,{voice:lang==='de'?'de':'tr',speed:lang==='de'?158:154,pitch:48,amplitude:100,rawdata:true},(ok,id,stream)=>{
       if(!current())return;clearTimeout(timer);rejectPending=null;
       ok&&stream?.byteLength?resolve(stream):reject(new Error('local-render'));
      });
     });guard();
    }
    cached=clip(bytes,text,lang,engine);
   }
   if(cached)bytes=cached.bytes;
   // Keep capture and replies on the same active audio route during a voice conversation.
   const sharedContext=mobile&&!!ctx&&!ownsContext&&typeof ctx.createBuffer==='function';
   if(cached&&media&&!sharedContext){
    try{return await playMedia(cached,onStart);}
    catch(error){guard();if(!ctx||error.message==='playback-interrupted')throw error;}
   }
   try{
    return await playOnContext(ctx,cached,bytes,engine,onStart,guard,current);
   }catch(error){
    guard();
    if(!sharedContext||!media||!cached||error.message==='playback-interrupted')throw error;
    return playMedia(cached,onStart);
   }
  }
  async function playOnContext(ctx,item,bytes,engine,onStart,guard,current){
   if(!ctx)throw new Error('unsupported');
   let buffer;
   if(mobile&&item&&typeof ctx.createBuffer==='function'){
    buffer=ctx.createBuffer(1,item.frames,item.rate);
    const samples=buffer.getChannelData(0),pcm=new DataView(bytes);
    for(let i=0;i<samples.length;i++)samples[i]=pcm.getInt16(44+2*i,true)/32768;
   }else{
    buffer=await ctx.decodeAudioData(bytes.slice(0));guard();
   }
   const samples=buffer.getChannelData(0);let peak=item?.peak||0;
   if(!peak)for(const sample of samples)peak=Math.max(peak,Math.abs(sample));
   if(!Number.isFinite(buffer.duration)||buffer.duration<=0||peak<0.0001)throw new Error('local-empty-audio');
   if(ctx.state!=='running'){
    await Promise.race([ctx.resume(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('not-allowed')),1500))]);guard();
   }
   if(ctx.state!=='running')throw new Error('not-allowed');
   return new Promise((resolve,reject)=>{
    rejectPending=reject;const node=ctx.createBufferSource();source=node;node.buffer=buffer;node.connect(ctx.destination);
    const started=ctx.currentTime;
    const clean=()=>{clearTimeout(timer);rejectPending=null;node.onended=null;node.disconnect();if(source===node)source=null;};
    node.onended=()=>{
     if(!current())return;const elapsed=ctx.currentTime-started;clean();
     if(elapsed+0.15<buffer.duration)reject(new Error('playback-interrupted'));
     else resolve({duration:buffer.duration,elapsed,peak,engine});
    };
    timer=setTimeout(()=>{if(!current())return;const progressed=ctx.currentTime-started>0.2;clean();try{node.stop();}catch{}reject(new Error(progressed?'playback-interrupted':'playback-timeout'));},buffer.duration*1000+6000);
    try{node.start();onStart({duration:buffer.duration,peak,engine});}catch{clean();reject(new Error('audio-hardware'));}
   });
  }
  function close(){
   cancel();neural?.close();if(media){media.pause();media.removeAttribute('src');media.load();media=null;}primed=false;releaseClip();
   if(ownsContext&&context)void context.close().catch(()=>{});context=null;ownsContext=false;
  }
  return {unlock,play,cancel,close,supported,prepareNatural:()=>neural?.prepare(),hasNeural:()=>!!neural?.supported()};
 }
 window.EJDERLocalSpeech=Object.freeze({create});
})();
