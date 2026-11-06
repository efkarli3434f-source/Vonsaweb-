/* One getUserMedia stream per conversation. Silence, requests and speech never restart it. */
(() => {
 'use strict';
 const config=window.EJDERVoiceConfig;
 const workletURL=new URL('assistant-audio-worklet.js?v=7.15',document.currentScript.src).href;
 // Voice metadata varies between browsers. Rank only voices for the requested language.
 function rankedVoices(list, lang){
  const locale=lang==='de'?'de-de':'tr-tr';
  const normalized=v=>String(v.lang||'').toLowerCase().replace(/_/g,'-');
  function quality(v){
   const name=[v.name,v.voiceURI].filter(Boolean).join(' ');
   if(/espeak|mespeak|formant|eloquence|compact|\bbasic\b/i.test(name))return 0;
   if(/natural|neural|premium|enhanced|hochwertig|geliştirilmiş|doğal|dogal|natürlich|natuerlich|erweitert/i.test(name))return 3;
   if(/\bgoogle\b|wavenet/i.test(name))return 2;
   return 1;
  }
  return list.filter(v=>normalized(v).split('-')[0]===lang&&
    !(window.navigator?.onLine===false&&v.localService===false))
   .sort((a,b)=>quality(b)-quality(a)||Number(normalized(b)===locale)-Number(normalized(a)===locale)||
    Number(!!b.default)-Number(!!a.default)||Number(!!b.localService)-Number(!!a.localService));
 }
 const unitsTR=['','bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz'];
 const tensTR=['','on','yirmi','otuz','kırk','elli','altmış','yetmiş','seksen','doksan'];
 const modelFamilies={
  'galaxy s':'Galaksi es',s:'es',iphone:'Ayfon',xiaomi:'Şaomi',
  'xiaomi redmi note':'Şaomi Redmi Not','redmi note':'Redmi Not',
  'huawei pura':'Huavey Pura',pura:'Pura','motorola edge':'Motorola Ec',edge:'Ec',
  'google pixel':'Gugıl Piksel',pixel:'Piksel'
 };
 function integerTR(value){
  if(value===0)return 'sıfır';
  const groups=[];
  for(const scale of ['','bin','milyon','milyar']){
   const group=value%1000;
   if(group){
    const hundreds=Math.floor(group/100);
    const words=[hundreds>1?unitsTR[hundreds]:'',hundreds?'yüz':'',tensTR[Math.floor(group/10)%10],unitsTR[group%10]];
    groups.unshift(group===1&&scale==='bin'?'bin':[...words,scale].filter(Boolean).join(' '));
   }
   value=Math.floor(value/1000);
   if(!value)break;
  }
  return groups.join(' ');
 }
 function turkishModelNames(text){
  // Expand model numbers only in product names, before text reaches either voice engine.
  const models=/\b(galaxy\s+s|s|iphone|xiaomi\s+redmi\s+note|redmi\s+note|xiaomi|huawei\s+pura|pura|motorola\s+edge|edge|google\s+pixel|pixel)[\s-]*([1-9](?:\s?\d)?)(?:\s*(pro\s*max|pro|ultra|plus))?\b(?![.,]\d)(?:['’]([a-zçğıöşü]+))?/gi;
  return text.replace(models,(_,family,digits,edition,ending)=>{
   const name=modelFamilies[family.toLowerCase().replace(/\s+/g,' ')];
   let number=integerTR(Number(digits.replace(/\s/g,'')));
   const suffix=ending||'';
   if(!edition&&/^[üıiu]/i.test(suffix))number=number.replace(/dört$/,'dörd');
   const version=edition?(' '+edition.replace(/^pro\s*max$/i,'Pro Maks')):'';
   return name+' '+number+version+suffix;
  }).replace(/\b(1[67])\s*pro\s*max\b/gi,(_,digits)=>integerTR(Number(digits.replace(/\s/g,'')))+' Pro Maks')
   .replace(/\b5\s?G\b/gi,'beş ge');
 }
 const unitNames={mb:'megabayt',kb:'kilobayt',gb:'gigabayt',mm:'milimetre',cm:'santimetre',kg:'kilogram',px:'piksel',dpi:'de pe i','°':'derece'};
 function quantityTR(match,sign,digits,unit,ending){
  let normalized=digits;
  if(/^[1-9]\d{0,2}(?:\.\d{3})+(?:,\d+)?$/.test(digits))normalized=digits.replace(/\./g,'');
  const [whole,fraction='']=normalized.split(/[.,]/);
  if(whole.length>12||fraction.length>6)return match;
  let words=integerTR(Number(whole));
  const measure=(unit||sign||'').toLowerCase();
  if(['€','eur','₺','tl','try'].includes(measure)&&fraction.length<=2){
   const euro=measure==='€'||measure==='eur';
   words+=euro?' avro':' lira';
   const coins=Number(fraction.padEnd(2,'0'));
   if(coins)words+=' '+integerTR(coins)+(euro?' sent':' kuruş');
  }else{
   if(fraction){
    const leading=fraction.match(/^0*/)[0].length;
    const decimals=[...Array(leading).fill('sıfır'),Number(fraction)?integerTR(Number(fraction)):''];
    words+=' virgül '+decimals.filter(Boolean).join(' ');
   }
   if(sign==='%'||unit==='%')words='yüzde '+words;
   if(unitNames[measure])words+=' '+unitNames[measure];
  }
  if(!ending)return words;
  if(/^[ıiuü]/i.test(ending))words=words.replace(/dört$/,'dörd');
  return words+ending;
 }
 const ordinalsTR={'bir':'birinci','iki':'ikinci','üç':'üçüncü','dört':'dördüncü','beş':'beşinci','altı':'altıncı','yedi':'yedinci','sekiz':'sekizinci','dokuz':'dokuzuncu','on':'onuncu','yirmi':'yirminci','otuz':'otuzuncu','kırk':'kırkıncı','elli':'ellinci','altmış':'altmışıncı','yetmiş':'yetmişinci','seksen':'sekseninci','doksan':'doksanıncı','yüz':'yüzüncü'};
 function turkishPhrase(text){
  const terms={png:'pe ne ge',jpg:'cey peg',jpeg:'cey peg',webp:'veb pe',pdf:'pe de fe',usb:'u se be',wifi:'vay fay',bluetooth:'blutut',whatsapp:'Vatsap'};
  return turkishModelNames(text)
   .replace(/\bEJDER\s+Studio\b/gi,'Ejder Stüdyo').replace(/\bEJDER\b/gi,'Ejder')
   .replace(/\b(?:PNG|JPG|JPEG|WebP|PDF|USB|WiFi|Bluetooth|WhatsApp)\b/gi,key=>terms[key.toLowerCase()])
   .replace(/\b3D\b/gi,'üç boyutlu')
   .replace(/\b([1-9]\d{0,2})\.\s+(?=adım|sıra|aşama|bölüm|sayfa)/gi,(_,n)=>
    integerTR(Number(n)).replace(/[^ ]+$/,word=>ordinalsTR[word])+' ')
   .replace(/\bvb\.(?=\s|$)/gi,'ve benzeri').replace(/(^|\s)örn\.(?=\s)/gi,'$1örneğin')
   .replace(/(\d)\s*[×x]\s*(?=\d)/gi,'$1 çarpı ')
   .replace(/(\d)\s*[–—-]\s*(?=\d)/g,'$1 ila ')
   .replace(/(^|[^\p{L}\p{N}_])(?:([%€₺])\s*)?((?:[1-9]\d{0,2}(?:\.\d{3})+|[1-9]\d*|0)(?:[.,]\d+)?)(?:\s*(MB|KB|GB|mm|cm|kg|px|dpi|TL|TRY|EUR|[₺€°%]))?(?![\p{L}\p{N}_]|[.,]\d)(?:['’]([a-zçğıöşü]+))?/giu,
    (match,lead,sign,digits,unit,ending)=>lead+quantityTR(match.slice(lead.length),sign,digits,unit,ending))
   .replace(/\s*→\s*/g,', ardından ').replace(/;\s+/g,'. ');
 }
 function spokenText(text,lang){
  const clean=String(text||'').trim();
  if(lang==='de'){
   return clean.replace(/\s+/g,' ').replace(/\bEJDER\s+Studio\b/gi,'EJDER Studio').replace(/\bEJDER\b/g,'Ejder')
    .replace(/\bPNG\b/gi,'Pe En Ge').replace(/\b3D\b/gi,'drei D').replace(/360\s*°/g,'360 Grad')
    .replace(/(\d)\s*×\s*(?=\d)/g,'$1 mal ');
  }
  // Identifiers, links, dates and phone numbers have a different reading convention.
  const verbatim=/(https?:\/\/[^\s]+|www\.[^\s]+|[\w.+-]+@[\w.-]+\.\w+|\bv\d+(?:\.\d+)+\b|\b\d+\.\d+\.\d+(?:\.\d+)*\b|\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\+\d(?:[ ()-]*\d){7,}|\b[A-Z]{2,}-\d+(?:-\d+)*\b)/gi;
  return clean.split(verbatim).map((part,index)=>index%2?part:turkishPhrase(part))
   .join('').replace(/\s+/g,' ').trim();
 }
 // Keep short sentences together so the device can supply its own intonation.
 function speechChunks(text,lang){
  const chunks=[];
  let rest=text;
  while(rest.length>180){
   const head=rest.slice(0,180);
   const breaks=[...head.matchAll(/[.!?…;:,][”’»"']?(?=\s)/g)];
   const sentenceEnd=lang==='tr'&&breaks.filter(mark=>/^[.!?…]/.test(mark[0])).at(-1);
   const boundary=sentenceEnd||breaks.at(-1);
   let cut=boundary?boundary.index+boundary[0].length:head.lastIndexOf(' ');
   if(cut<=0)cut=180;
   chunks.push(rest.slice(0,cut).trimEnd());
   rest=rest.slice(cut).trimStart();
  }
  if(rest)chunks.push(rest);
  return chunks;
 }
 function create({getLang,onState,onQuestion,onExit,onAudioError=()=>{},onPlayback=()=>{},getContext=()=>({})}){
  const local=window.EJDERLocalSpeech?.create();const localFallback=new Map();
  const chosen=new Map();
  function preference(){
   const lang=getLang();
   if(!chosen.has(lang)){
    let value='';try{value=window.localStorage?.getItem('ejder.voice.'+lang)||'';}catch{}
    if(lang==='tr'&&local?.hasNeural?.()&&value==='backup')value='';
    chosen.set(lang,value);
   }
   return chosen.get(lang);
  }
  function setPreference(value){
   const lang=getLang();
   if(value==='backup'&&!local?.supported())return;
   if((value==='basic'||value==='neural')&&(lang!=='tr'||!local?.hasNeural?.()))return;
   if(value&&value!=='backup'&&value!=='basic'&&value!=='neural'&&!voices().some(v=>voiceKey(v)===value))return;
   cancelSpeech();localFallback.delete(lang);chosen.set(lang,value);
   try{if(value)window.localStorage?.setItem('ejder.voice.'+lang,value);else window.localStorage?.removeItem('ejder.voice.'+lang);}catch{}
   if(active&&!busy)emit(live()?'listening':'starting');
  }
  function options(){
   return voices().map(v=>({key:voiceKey(v),name:v.name,lang:v.lang}));
  }
  let generation=0,active=false,stream=null,context=null,source=null,node=null,gain=null;
  let request=null,utterance=null,speechTimer=0,startTimer=0,recoveryTimer=0,busy=false,mutedUntil=0,phase='idle';
  let pre=[],frames=[],voiced=0,quiet=0,noise=0.002,hearing=false;
  let lastSpeech='',lastSpeechInVoice=false,audioProblem=false,speechEpoch=0,speechPending=false,voiceWait=null,voiceWaitTimer=0;
  const live=()=>!!stream?.getAudioTracks().some(t=>t.readyState==='live');
  // Resume a suspended capture context after the answer, without another getUserMedia call.
  async function restoreListening(){
   if(!active)return;
   if(!live()){emit('ended');return;}
   const ctx=context;
   if(!ctx||ctx.state==='closed'){emit('suspended');return;}
   if(ctx.state==='running'){emit('listening');return;}
   if(typeof document!=='undefined'&&document.hidden){emit('suspended');return;}
   try{await ctx.resume();}catch{}
   if(active&&context===ctx)emit(!live()?'ended':ctx.state==='running'?'listening':'suspended');
  }
  const emit=(next,detail='')=>{phase=next;onState(next,live(),detail);};
  const synth=()=>window.speechSynthesis;
  const speechSupported=()=>typeof window.SpeechSynthesisUtterance==='function'&&typeof synth()?.speak==='function';
  const voices=()=>{try{return rankedVoices(synth()?.getVoices()||[],getLang());}catch{return [];}};
  const voiceKey=v=>v?JSON.stringify([v.lang,v.name,v.voiceURI]):'';
  // Voice lists may arrive asynchronously on desktop and mobile browsers.
  try{synth()?.getVoices();}catch{}
  function clearVoiceWait(){clearTimeout(voiceWaitTimer);voiceWaitTimer=0;if(voiceWait){synth()?.removeEventListener?.('voiceschanged',voiceWait);voiceWait=null;}}
  function clearAudio(){for(const f of [...pre,...frames])f.fill(0);pre=[];frames=[];voiced=quiet=0;hearing=false;}
  function cancelSpeech(){
   local?.cancel();speechEpoch++;speechPending=false;clearVoiceWait();clearTimeout(speechTimer);speechTimer=0;
   if(utterance){utterance.onstart=utterance.onend=utterance.onerror=null;utterance=null;synth()?.cancel();}
   clearAudio();mutedUntil=performance.now()+350;
  }
  function stop(){
   generation++;active=false;busy=false;clearTimeout(startTimer);clearTimeout(recoveryTimer);
   request?.abort();request=null;cancelSpeech();
   if(node){node.port.onmessage=null;node.port.close();node.disconnect();node=null;}
   source?.disconnect();source=null;gain?.disconnect();gain=null;
   if(stream){for(const track of stream.getTracks()){track.onended=track.onmute=track.onunmute=null;track.stop();}stream=null;}
   if(context){context.onstatechange=null;void context.close().catch(()=>{});context=null;}
   local?.close();clearAudio();phase='idle';lastSpeech='';audioProblem=false;
  }
  function read(text,inVoice=false,preferMedia=false){
   cancelSpeech();lastSpeech=String(text||'').trim();lastSpeechInVoice=inVoice;audioProblem=false;
   if(!lastSpeech)return false;local?.unlock();
   const fail=code=>{audioProblem=true;speechPending=false;onAudioError({code,lang:getLang(),matchingVoices:voices().length});if(inVoice&&active)emit('audioerror');};
   if(!speechSupported()&&!local?.supported()){fail('unsupported');return false;}
   const lang=getLang(),parts=speechChunks(spokenText(lastSpeech,lang),lang);
   const available=voices(),preferred=localFallback.get(lang);
   const failed=new Set(preferred&&performance.now()<preferred.until?preferred.failed:[]);
   const choice=preference(),staticGreeting=lang==='tr'&&window.EJDERNaturalTR?.greeting===lastSpeech;
   const canNeural=lang==='tr'&&(!!local?.hasNeural?.()||staticGreeting)&&!!local?.supported();
   const eligible=available.filter(v=>!failed.has(voiceKey(v)));
   const candidate=eligible.find(v=>voiceKey(v)===choice)||eligible[0];
   // Keep the recorded greeting and generated Turkish replies on the same voice.
   const stableTurkish=lang==='tr'&&!!window.EJDERNaturalTR&&(!choice||choice==='neural');
   const defaultNeural=stableTurkish&&canNeural;
   if(stableTurkish&&!canNeural){fail('natural-unavailable');return false;}
   const token=generation,epoch=speechEpoch;let index=0,retried=false,selected=candidate,useLocal=defaultNeural||((preferMedia||choice==='backup'||choice==='basic')&&!!local?.supported())||(failed.size>0&&!candidate)||!speechSupported();
   const output=canNeural&&choice!=='basic'&&choice!=='backup'?'neural':'local';
   speechPending=true;onPlayback({event:'preparing',engine:useLocal?output:'native'});
   const current=()=>token===generation&&epoch===speechEpoch&&speechPending;
   const finish=code=>{
    if(!current())return;clearTimeout(speechTimer);clearVoiceWait();utterance=null;speechPending=false;clearAudio();mutedUntil=performance.now()+450;
    if(code){fail(code);return;}
    audioProblem=false;onPlayback({event:'complete',engine:useLocal?output:'native'});
    if(inVoice&&active){
     void restoreListening();
     if(defaultNeural&&staticGreeting)local.prepareNatural?.();
    }
   };
   function playLocal(){
    if(!current())return;
    void local.play(parts[index],lang,detail=>{if(current()){
      audioProblem=false;onPlayback({event:'started',...detail});if(inVoice)emit('speaking');
    }},output).then(detail=>{
     if(!current())return;
     clearTimeout(speechTimer);speechTimer=0;
     onPlayback({event:'chunk-complete',...detail});index++;if(index<parts.length)playLocal();else finish();
    }).catch(error=>{
     if(!current())return;
     clearTimeout(speechTimer);speechTimer=0;
     finish(error.message||'local-unavailable');
    });
   }
   function play(){
    if(!current())return;if(useLocal){playLocal();return;}
    const u=new SpeechSynthesisUtterance(parts[index]);utterance=u;if(selected)u.voice=selected;
    u.lang=lang==='de'?'de-DE':'tr-TR';u.rate=lang==='de'?0.99:1.01;u.pitch=1;u.volume=1;
    let started=false,startedAt=0;
    const valid=()=>current()&&utterance===u;
    const dispose=()=>{clearTimeout(speechTimer);u.onstart=u.onend=u.onerror=null;if(utterance===u)utterance=null;};
    const error=code=>{
     if(!valid())return;
     // A mobile engine can signal start and immediately lose audio focus to capture.
     if(inVoice&&started&&performance.now()-startedAt<180){started=false;retried=true;}
     dispose();failed.add(voiceKey(selected));
     // Retry only before playback begins, once, without reopening the microphone.
     if(!started&&!retried&&!['not-allowed','invalid-argument','text-too-long','empty-playback'].includes(code)){
      retried=true;
      const again=()=>{if(!current())return;clearVoiceWait();selected=voices().find(v=>!failed.has(voiceKey(v)));play();};
      voiceWait=()=>{if(voices().length)again();};synth()?.addEventListener?.('voiceschanged',voiceWait);
      voiceWaitTimer=setTimeout(again,voices().length?180:1200);return;
     }
     if(!started&&local?.supported()&&!['invalid-argument','text-too-long'].includes(code)){
      useLocal=true;localFallback.set(lang,{failed:new Set(failed),until:performance.now()+45000});try{synth()?.cancel();}catch{}playLocal();return;
     }
     finish(code);
    };
    const timeout=()=>{if(valid()){error(started?'playback-timeout':'start-timeout');try{synth()?.cancel();}catch{}}};
    u.onstart=()=>{if(valid()){started=true;startedAt=performance.now();localFallback.delete(lang);audioProblem=false;onPlayback({event:'started',engine:'native',voice:selected?.name||''});clearTimeout(speechTimer);speechTimer=setTimeout(timeout,Math.max(10000,u.text.length*160+4000));if(inVoice)emit('speaking');}};
    u.onend=event=>{
     if(!valid())return;if(!started){error('start-timeout');return;}
     // Some engines finish an entire sentence immediately without producing speech.
     // Only replay a completion that is too short to have spoken even one word.
     if(event&&u.text.length>=12&&performance.now()-startedAt<90&&!(event.elapsedTime>=0.09)){
      started=false;error('empty-playback');return;
     }
     dispose();index++;if(index<parts.length){retried=false;play();}else finish();};
    u.onerror=e=>error(e?.error||'synthesis-failed');
    try{if(synth().paused)synth().resume();speechTimer=setTimeout(timeout,5000);synth().speak(u);}catch{error('synthesis-unavailable');}
   }
   play();return true;
  }
  function retrySpeech(){return lastSpeech?read(lastSpeech,lastSpeechInVoice,audioProblem):false;}
  function wav(chunks){
   const count=chunks.reduce((n,f)=>n+f.length,0),buffer=new ArrayBuffer(44+count*2),view=new DataView(buffer);
   const text=(offset,s)=>{for(let n=0;n<s.length;n++)view.setUint8(offset+n,s.charCodeAt(n));};
   text(0,'RIFF');view.setUint32(4,36+count*2,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);
   view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,16000,true);view.setUint32(28,32000,true);
   view.setUint16(32,2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,count*2,true);
   let offset=44;for(const f of chunks)for(const v of f){const x=Math.max(-1,Math.min(1,v));view.setInt16(offset,Math.round(x*(x<0?32768:32767)),true);offset+=2;}
   return new Uint8Array(buffer);
  }
  async function transcribe(chunks){
   const bytes=wav(chunks);for(const f of chunks)f.fill(0);
   const token=generation,controller=new AbortController();request=controller;busy=true;emit('waiting');
   const timer=setTimeout(()=>controller.abort(),11000),current=()=>active&&token===generation;
   try{
    const form=new FormData();form.append('audio',new Blob([bytes],{type:'audio/wav'}),'question.wav');form.append('context',JSON.stringify(getContext()));
    const response=await fetch(config.url,{method:'POST',mode:'cors',credentials:'omit',cache:'no-store',signal:controller.signal,
     headers:{'X-EJDER-Language':getLang(),apikey:config.anonKey,Authorization:'Bearer '+config.anonKey},body:form});
    if(!current())return;
    if(!response.ok){const error=new Error(response.status===429?'limited':'network');error.retry=Math.min(60,Math.max(5,Number(response.headers.get('Retry-After'))||5));throw error;}
    const result=await response.json();if(!current())return;
    const text=String(result.text||'').trim().slice(0,300);
    if(window.EJDERGuide.isSpeechArtifact?.(text)||(!text&&result.reason==='silence')){emit('listening');return;}
    if(!text){emit('unclear');return;}
    const q=window.EJDERGuide.normalize(text);
    if(/^(?:(?:lutfen )?(?:sesli sohbeti kapat|sesli konusmayi kapat|mikrofonu kapat|dinlemeyi bitir|yazismaya don)|(?:bitte )?(?:sprachgesprach beenden|mikrofon ausschalten|zuruck zum chat))$/.test(q)){onExit();return;}
    clearTimeout(timer);
    const reply=await onQuestion(text,result.reply||(result.guideUnavailable?{localFallback:true}:undefined));
    if(current()&&reply)read(reply.message,true);
   }catch(error){
    if(current()){
     const limited=error.message==='limited';mutedUntil=performance.now()+(limited?error.retry*1000:1500);emit(limited?'limited':'network');
     clearTimeout(recoveryTimer);recoveryTimer=setTimeout(()=>{if(current()&&!speechPending&&!busy)emit('listening');},limited?error.retry*1000:1800);
    }
   }finally{
    clearTimeout(timer);bytes.fill(0);
    if(request===controller){request=null;busy=false;clearAudio();}
   }
  }
  function receive(frame){
   if(!(frame instanceof Float32Array))return;
   if(!active||busy||speechPending||performance.now()<mutedUntil||context?.state!=='running'){frame.fill(0);return;}
   let sum=0,mean=0;for(const x of frame){sum+=x*x;mean+=x;}const rms=Math.sqrt(Math.max(0,sum/frame.length-(mean/frame.length)**2));
   const loud=rms>Math.max(0.008,Math.min(0.045,noise*3));
   if(!hearing){
    pre.push(frame);if(pre.length>12)pre.shift().fill(0);
    if(loud)voiced++;else{voiced=0;noise=noise*.98+Math.min(rms,.006)*.02;}
    if(voiced>=3){hearing=true;frames=pre;pre=[];quiet=0;emit('hearing');}return;
   }
   frames.push(frame);if(loud){voiced++;quiet=0;}else quiet++;
   if(quiet>=27||frames.length>=900){
    const take=frames;frames=[];hearing=false;const valid=voiced>=8;voiced=quiet=0;
    if(valid)void transcribe(take);else{for(const f of take)f.fill(0);emit('listening');}
   }
  }
  async function retry(){
   if(!live()){await begin();return;}
   // Resume the same track after browser suspension; no second microphone.
   try{await context.resume();if(active)emit(busy?'waiting':speechPending?'speaking':'listening');}catch{emit('suspended');}
  }
  async function begin(){
   if(active){if(live())await retry();return;}
   stop();active=true;const token=generation,current=()=>active&&token===generation;emit('starting');
   const Audio=window.AudioContext||window.webkitAudioContext;
   if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia||!Audio||!window.AudioWorkletNode||!config){active=false;emit('unavailable');return;}
   startTimer=setTimeout(()=>{if(current()){stop();emit('timedout');}},20000);
   try{
    context=new Audio({latencyHint:'interactive'});const ctx=context;
    local?.unlock(ctx);
    const capture=navigator.mediaDevices.getUserMedia({video:false,audio:{channelCount:1,echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
    void ctx.resume().catch(()=>{});
    const captured=await capture;
    if(!current()){captured.getTracks().forEach(t=>t.stop());return;}
    stream=captured;
    for(const t of stream.getAudioTracks()){
     t.onended=()=>{if(current()){stop();emit('ended');}};
     t.onmute=()=>{if(current()&&!speechPending)emit('suspended');};
     t.onunmute=()=>{if(current())emit(busy?'waiting':speechPending?'speaking':'listening');};
    }
    await ctx.audioWorklet.addModule(workletURL);if(!current())return;
    source=ctx.createMediaStreamSource(stream);node=new AudioWorkletNode(ctx,'ejder-capture',{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[1]});
    gain=ctx.createGain();gain.gain.value=0;source.connect(node);node.connect(gain);gain.connect(ctx.destination);
    node.port.onmessage=e=>{if(current())receive(e.data);};
    ctx.onstatechange=()=>{if(current()&&ctx.state!=='closed'&&!(speechPending&&ctx.state==='suspended'))
     emit(ctx.state==='running'?(busy?'waiting':speechPending?'speaking':'listening'):'suspended');};
    await ctx.resume();if(!current())return;clearTimeout(startTimer);
    emit(ctx.state==='running'?'starting':'suspended');
    // Android may switch audio routes as the mic opens. Start the greeting after that switch.
    read(getLang()==='de'?'Hallo, willkommen im Sprachchat.':(window.EJDERNaturalTR?.greeting||'Merhaba, sesli sohbete hoş geldin.'),true);
   }catch(error){if(current()){stop();emit(error?.name==='NotAllowedError'?'denied':error?.name==='NotFoundError'?'capture':'error');}}
  }
  return {begin,retry,retrySpeech,stop,read,cancelSpeech,options,preference,setPreference,hasBackup:()=>!!local?.supported(),hasNeural:()=>getLang()==='tr'&&!!local?.hasNeural?.(),hasVoice:()=>speechSupported()||!!local?.supported(),isActive:()=>active};
 }
 window.EJDERSpeech=Object.freeze({create});
})();
