/* Short in-memory context only; no localStorage, database or voice transcript DOM. */
(() => {
 'use strict';
 function create({getLang,getRoute,fallback}){
  let history=[],controller=null,epoch=0;
  const snapshot=()=>({route:getRoute(),history:history.map(({role,content})=>({role,content}))});
  function cancel(){epoch++;controller?.abort();controller=null;}
  function reset(){cancel();history=[];}
  function clean(value){return value&&typeof value.message==='string'&&value.message.length>0&&value.message.length<=1000?{message:value.message,href:/^(?:home|products|cases|templates|saved|shop|cart|account|payments|contact|privacy|studio\/[a-z0-9-]+)$/.test(value.href||'')?value.href:'',label:getLang()==='de'?'Im Studio öffnen':'Sitede aç'}:null;}
  function remember(question,answer){history.push({role:'user',content:question.slice(0,300)},{role:'assistant',content:answer.message.slice(0,650)});history=history.slice(-6);}
  async function answer(question,provided){
   const local=fallback(question),token=epoch,config=window.EJDERVoiceConfig;
   let reply=clean(provided);
   if(reply){remember(question,reply);return reply;}
   if(provided?.localFallback||!navigator.onLine||!config){remember(question,local);return local;}
   // Greetings and clear off-topic questions need no remote round trip.
   const q=window.EJDERGuide.normalize(question);
   if(/^(?:slm|mrb|sa|merhaba|selam|hallo|hi|moin)(?: kanka| kankam| ejder)?$/.test(q)||/\b(?:hava durumu|wetter|bitcoin|borsa|kripto|siyaset|politik)\b/.test(q)){remember(question,local);return local;}
   controller?.abort();const request=new AbortController();controller=request;
   const timer=setTimeout(()=>request.abort(),6500);
   try{
    const response=await fetch(config.url,{method:'POST',credentials:'omit',cache:'no-store',signal:request.signal,headers:{'Content-Type':'application/json','X-EJDER-Language':getLang(),apikey:config.anonKey,Authorization:'Bearer '+config.anonKey},body:JSON.stringify({...snapshot(),question:question.slice(0,300)})});
    if(!response.ok)throw new Error('unavailable');const result=await response.json();reply=clean(result.reply);if(!reply)throw new Error('format');
   }catch{reply=local;}
   finally{clearTimeout(timer);if(controller===request)controller=null;}
   if(token!==epoch)return null;
   remember(question,reply);return reply;
  }
  return {answer,snapshot,reset,cancel};
 }
 window.EJDERConversation=Object.freeze({create});
})();
