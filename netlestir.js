'use strict';
/* EJDER Studio customer clarity editor: client-side video decode, crop, repair,
   gentle enhancement. Original video is NEVER sent. No generative AI or fabricated detail.
   Only a specifically approved PNG is posted to the at-home workshop API. */
(()=>{
const $=id=>document.getElementById(id), src=document.createElement('canvas'), sx=src.getContext('2d',{willReadFrequently:true});
const stage=$('stage'),sc=stage.getContext('2d'),before=$('before'),after=$('after');
const video=$('sourceVideo'),file=$('userFile'),seek=$('frameRange'),info=$('selectInfo');
// Enable only after the workshop endpoint and retention process are deployed and verified.
const WORKSHOP_ENABLED=false;
$('sendBtn').disabled=!WORKSHOP_ENABLED;
$('email').disabled=$('consent').disabled=!WORKSHOP_ENABLED;
let lang='tr',kind=null,url=null,rect=null,patches=[],mode='crop',start=null,drag=null,ready=false,previewFresh=false,busy=false,frameTime=0,submission=false;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const txt=(tr,de)=>lang==='tr'?tr:de;
const status=(msg,type='')=>{$('status').textContent=msg;$('status').className='status '+type};
const short=(v)=>Number(v).toFixed(1);
function language(next){lang=next;document.documentElement.lang=next;document.querySelectorAll('[data-tr][data-de]').forEach(n=>{if(n.id!=='status')n.textContent=n.getAttribute('data-'+next)});
 $('langTR').classList.toggle('active',next==='tr');$('langDE').classList.toggle('active',next==='de');$('langTR').setAttribute('aria-pressed',String(next==='tr'));$('langDE').setAttribute('aria-pressed',String(next==='de'));draw();showInfo();}
$('langTR').onclick=()=>language('tr');$('langDE').onclick=()=>language('de');
function invalidate(){previewFresh=false;$('downloadBtn').disabled=true;before.getContext('2d').clearRect(0,0,before.width,before.height);after.getContext('2d').clearRect(0,0,after.width,after.height);}
function release(){submission=false;invalidate();start=null;drag=null;$('sendBtn').disabled=!WORKSHOP_ENABLED;before.getContext('2d').clearRect(0,0,before.width,before.height);after.getContext('2d').clearRect(0,0,after.width,after.height);if(url){URL.revokeObjectURL(url);url=null;}video.pause();video.removeAttribute('src');video.load();kind=null;ready=false;rect=null;patches=[];previewFresh=false;frameTime=0;src.width=src.height=0;$('videoTools').hidden=true;seek.value='0';file.value='';$('frameLabel').textContent='0.0 s';draw();showInfo();}
function setSource(w,h){if(w<50||h<50||w*h>20000000)throw Error(txt('Görsel çok büyük veya çok küçük (en fazla 20 milyon piksel).','Bild zu groß oder zu klein (maximal 20 Millionen Pixel).'));src.width=w;src.height=h;stage.width=w;stage.height=h;}
function box(a,b){return{x:Math.floor(Math.min(a.x,b.x)),y:Math.floor(Math.min(a.y,b.y)),w:Math.round(Math.abs(a.x-b.x)),h:Math.round(Math.abs(a.y-b.y))};}
function point(e){const r=stage.getBoundingClientRect();
 // canvas uses object-fit:contain with a 550px max-height. Map touch/mouse
 // to the visible image rectangle, not the letterboxed element box.
 const scale=Math.min(r.width/stage.width,r.height/stage.height),drawW=stage.width*scale,drawH=stage.height*scale;
 const left=r.left+(r.width-drawW)/2,top=r.top+(r.height-drawH)/2;
 return{x:clamp(Math.round((e.clientX-left)/drawW*stage.width),0,stage.width),y:clamp(Math.round((e.clientY-top)/drawH*stage.height),0,stage.height)};
}
function stroke(r,color,fill){sc.strokeStyle=color;sc.fillStyle=fill;sc.lineWidth=Math.max(2,Math.round(stage.width/600));sc.strokeRect(r.x+.5,r.y+.5,r.w,r.h);sc.fillRect(r.x,r.y,r.w,r.h);}
function draw(){sc.clearRect(0,0,stage.width,stage.height);if(!ready){sc.fillStyle='#130d12';sc.fillRect(0,0,stage.width,stage.height);sc.font='bold 26px system-ui';sc.textAlign='center';sc.fillStyle='#d6a66c';sc.fillText(txt('Görsel seç','Bild auswählen'),stage.width/2,stage.height/2);return;}
 sc.drawImage(src,0,0);if(rect){sc.fillStyle='rgba(8,5,7,.48)';sc.fillRect(0,0,stage.width,rect.y);sc.fillRect(0,rect.y+rect.h,stage.width,stage.height-rect.y-rect.h);sc.fillRect(0,rect.y,rect.x,rect.h);sc.fillRect(rect.x+rect.w,rect.y,stage.width-rect.x-rect.w,rect.h);stroke(rect,'#ffe19f','rgba(255,211,134,.02)');}patches.forEach(p=>stroke(p,'#ff5e62','rgba(255,40,44,.23)'));if(drag)stroke(drag,mode==='crop'?'#fff0c4':'#ff8888','rgba(237,170,80,.14)');}
function showInfo(){if(!ready){info.textContent=txt('Dosya seçildiğinde kırpma yapabilirsin.','Nach Auswahl kannst du zuschneiden.');$('quality').textContent='—';return;}
 info.textContent=txt('Kaynak: ','Quelle: ')+src.width+' × '+src.height+' px'+(kind==='video'?' · '+short(frameTime)+' s':'')+'\n'+(rect?txt('Seçim: ','Ausschnitt: ')+rect.w+' × '+rect.h+' px':txt('Sarı alanı sürükleyerek seç.','Gelben Bereich ziehen.'))+' · '+txt('Temizlik: ','Korrekturen: ')+patches.length;
 qualityEstimate();}
function qualityEstimate(){const mm=Number($('targetMM').value)||100;let msg;if(!rect){msg=txt('Baskı kalitesi için önce alanı seç.','Für die Druckqualität zuerst Bereich auswählen.');}
 else{const dpi=rect.w/(mm/25.4),q=dpi>=300?'good':dpi>=180?'review':'low';msg=txt('Kaynağın yaklaşık yatay baskı çözünürlüğü: ','Ungefähre horizontale Quellauflösung: ')+Math.round(dpi)+' DPI\n'+(q==='good'?txt('Piksel sayısı olumlu görünüyor; fiziksel prova gerekli.','Pixelzahl gut; ein Probedruck bleibt nötig.'):q==='review'?txt('Orta kalite: gerçek baskı ölçüsüyle kontrol edilecek.','Mittlere Qualität: Druckmaß prüfen.'):txt('Düşük kaynak çözünürlüğü: büyütmek yeni detay üretmez.','Niedrige Quellauflösung: Vergrößern erzeugt keine Details.'));}
 $('quality').textContent=msg;}
function setMode(next){mode=next;$('cropBtn').classList.toggle('selected',next==='crop');$('patchBtn').classList.toggle('selected',next==='patch');draw();}
$('cropBtn').onclick=()=>setMode('crop');$('patchBtn').onclick=()=>setMode('patch');
stage.addEventListener('pointerdown',e=>{if(!ready||busy)return;if(mode==='patch'&&!rect){status(txt('Önce sarı kırpma alanını çiz.','Zuerst gelben Ausschnitt festlegen.'),'error');return;}start=point(e);drag={x:start.x,y:start.y,w:0,h:0};stage.setPointerCapture(e.pointerId);draw();});
stage.addEventListener('pointermove',e=>{if(!start)return;drag=box(start,point(e));draw();});
stage.addEventListener('pointercancel',()=>{start=null;drag=null;draw()});
stage.addEventListener('pointerup',e=>{if(!start)return;let b=box(start,point(e));start=null;drag=null;if(b.w<12||b.h<12){draw();return;}if(mode==='crop'){rect=b;patches=[];}else{let x=Math.max(b.x,rect.x),y=Math.max(b.y,rect.y),ex=Math.min(b.x+b.w,rect.x+rect.w),ey=Math.min(b.y+b.h,rect.y+rect.h);if(ex-x>2&&ey-y>2){if((ex-x)*(ey-y)>rect.w*rect.h*.12)status(txt('Bu alan çok büyük. Temizlik için daha küçük bir alan seç.','Bereich zu groß. Bitte eine kleinere Stelle markieren.'),'error');else if(patches.length<8)patches.push({x,y,w:ex-x,h:ey-y});else status(txt('En fazla 8 küçük alan seçilebilir.','Maximal 8 Bereiche.'));}}invalidate();draw();showInfo();});
$('undoBtn').onclick=()=>{if(busy)return;patches.pop();invalidate();draw();showInfo()};$('resetBtn').onclick=()=>{if(busy)return;rect=null;patches=[];invalidate();draw();showInfo()};
$('trimBtn').onclick=()=>{if(!ready||busy)return;const w=200,h=Math.max(1,Math.round(200*src.height/src.width)),c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(src,0,0,w,h);let d=x.getImageData(0,0,w,h).data;const rgb=(xx,yy)=>{const i=(yy*w+xx)*4;return[d[i],d[i+1],d[i+2]]};const co=[rgb(0,0),rgb(w-1,0),rgb(0,h-1),rgb(w-1,h-1)];if(co.some(a=>co.some(b=>a.some((v,j)=>Math.abs(v-b[j])>28)))){status(txt('Kenar renkleri farklı: alanı elle seç.','Uneinheitliche Ränder: Bereich manuell wählen.'),'error');return;}
 const bg=co[0];let x0=w,y0=h,x1=-1,y1=-1;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){const px=rgb(xx,yy);if(px.some((v,j)=>Math.abs(v-bg[j])>38)){x0=Math.min(x0,xx);y0=Math.min(y0,yy);x1=Math.max(x1,xx);y1=Math.max(y1,yy);}}
 if(x1-x0<8||y1-y0<8){status(txt('Otomatik sınır bulunamadı.','Kein automatischer Rand gefunden.'),'error');return;}
 let xx=Math.floor(x0/w*src.width),yy=Math.floor(y0/h*src.height);rect={x:xx,y:yy,w:Math.min(src.width-xx,Math.ceil((x1-x0+1)/w*src.width)),h:Math.min(src.height-yy,Math.ceil((y1-y0+1)/h*src.height))};patches=[];invalidate();draw();showInfo();status(txt('Otomatik kesimi sarı çizgide kontrol et.','Automatischen Zuschnitt am gelben Rahmen überprüfen.'));};
function seekVideo(t){return new Promise((resolve,reject)=>{const time=clamp(t,0,Math.max(0,video.duration-.06));if(Math.abs(video.currentTime-time)<.018 && video.readyState>=2)return resolve();let done=false;const complete=e=>{if(done)return;done=true;clearTimeout(timer);video.removeEventListener('seeked',ok);video.removeEventListener('error',fail);e?reject(e):resolve();};const ok=()=>complete(),fail=()=>complete(Error(txt('Video açılamadı.','Video konnte nicht geladen werden.')));const timer=setTimeout(()=>complete(Error('Video seek timeout')),7000);video.addEventListener('seeked',ok);video.addEventListener('error',fail);video.currentTime=time;});}
function frameScore(){
 const c=document.createElement('canvas');c.width=Math.min(480,video.videoWidth);c.height=Math.max(3,Math.round(c.width*video.videoHeight/video.videoWidth));
 const cx=c.getContext('2d',{willReadFrequently:true});cx.drawImage(video,0,0,c.width,c.height);const d=cx.getImageData(0,0,c.width,c.height).data,w=c.width,h=c.height;
 const gray=i=>.299*d[i]+.587*d[i+1]+.114*d[i+2];let sum=0,sum2=0,n=0;
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=(y*w+x)*4,v=4*gray(i)-gray(i-4)-gray(i+4)-gray(i-w*4)-gray(i+w*4);sum+=v;sum2+=v*v;n++;}
 return n?sum2/n-(sum/n)**2:0;
}
function copyVideoFrame(){setSource(video.videoWidth,video.videoHeight);sx.drawImage(video,0,0,src.width,src.height);ready=true;rect=null;patches=[];frameTime=video.currentTime;seek.value=String(frameTime);$('frameLabel').textContent=short(frameTime)+' s / '+short(video.duration)+' s';invalidate();draw();showInfo();}
$('autoFrame').onclick=async()=>{if(kind!=='video'||busy)return;busy=true;file.disabled=true;$('autoFrame').disabled=true;try{let best=-1,bestT=0;for(let k=0;k<9;k++){let t=Math.max(0,video.duration-.12)*(k+.5)/9;await seekVideo(t);let v=frameScore();if(v>best){best=v;bestT=t;}}await seekVideo(bestT);seek.value=String(bestT);copyVideoFrame();status(txt('Örneklenen 9 kareden en net görünen seçildi. Görsel içeriğini kontrol et.','Schärfster aus 9 geprüften Frames gewählt. Bildinhalt prüfen.'));}catch(e){status(e.message,'error')}finally{busy=false;file.disabled=false;$('autoFrame').disabled=false;}};
$('pickFrame').onclick=async()=>{if(kind!=='video'||busy)return;busy=true;try{await seekVideo(Number(seek.value));copyVideoFrame()}catch(e){status(e.message,'error')}finally{busy=false;}};
seek.oninput=()=>{$('frameLabel').textContent=short(seek.value)+' s / '+short(video.duration)+' s'};
file.onchange=async()=>{if(busy)return;const f=file.files?.[0];release();if(!f)return;if(!/^image\/(png|jpeg|webp)$/.test(f.type)&&!/^video\/(mp4|webm|quicktime)$/.test(f.type))return status(txt('Desteklenmeyen biçim.','Nicht unterstütztes Format.'),'error');if(f.size>250*1024*1024)return status(txt('En fazla 250 MB dosya seçilebilir.','Datei darf höchstens 250 MB groß sein.'),'error');busy=true;file.disabled=true;url=URL.createObjectURL(f);
 try{if(f.type.startsWith('image/')){kind='image';const im=new Image();await new Promise((yes,no)=>{im.onload=yes;im.onerror=()=>no(Error('Image failed'));im.src=url});setSource(im.naturalWidth,im.naturalHeight);sx.drawImage(im,0,0);ready=true;rect={x:0,y:0,w:src.width,h:src.height};draw();showInfo();}
 else{kind='video';await new Promise((yes,no)=>{let timer;const done=()=>{clearTimeout(timer);video.removeEventListener('loadedmetadata',ok);video.removeEventListener('error',err)};const ok=()=>{done();yes()},err=()=>{done();no(Error('Video formatı desteklenmiyor'))};video.addEventListener('loadedmetadata',ok);video.addEventListener('error',err);timer=setTimeout(()=>{done();no(Error(txt('Video açılma süresi aşıldı.','Zeitüberschreitung beim Laden des Videos.')))},15000);video.src=url;video.load()});if(!Number.isFinite(video.duration)||!video.duration)throw Error('Video duration invalid');$('videoTools').hidden=false;seek.max=String(Math.max(.01,video.duration-.07));await seekVideo(Math.min(.15,Number(seek.max)));copyVideoFrame();$('frameLabel').textContent=short(video.currentTime)+' s / '+short(video.duration)+' s';}
 status(txt('Görsel hazır. Kırpma ve netlik ayarlarını seçebilirsin.','Bild bereit. Ausschnitt und Schärfe einstellen.'));}
 catch(e){status(txt('Dosya açılamadı: ','Datei konnte nicht geöffnet werden: ')+(e.message||e),'error');release();}finally{busy=false;file.disabled=false;}};
function cleanPatches(c,scale){if(!patches.length)return;const x=c.getContext('2d',{willReadFrequently:true});for(const p of patches){
 const l=clamp(Math.floor((p.x-rect.x)*scale),0,c.width-1),t=clamp(Math.floor((p.y-rect.y)*scale),0,c.height-1),r=clamp(Math.ceil((p.x+p.w-rect.x)*scale),l+1,c.width),b=clamp(Math.ceil((p.y+p.h-rect.y)*scale),t+1,c.height);
 if((r-l)*(b-t)>c.width*c.height*.12)continue;
 const top=Math.max(0,t-2),bot=Math.min(c.height-1,b+1),left=Math.max(0,l-2),right=Math.min(c.width-1,r+1);
 const block=x.getImageData(left,top,right-left+1,bot-top+1),d=block.data,original=new Uint8ClampedArray(d),sw=block.width;
 const idx=(xx,yy)=>((yy-top)*sw+(xx-left))*4;
 for(let yy=t;yy<b;yy++)for(let xx=l;xx<r;xx++){
   const u=(xx-l+.5)/Math.max(1,r-l),v=(yy-t+.5)/Math.max(1,b-t),i=idx(xx,yy),a=idx(xx,top),e=idx(xx,bot),f=idx(left,yy),g=idx(right,yy);
   for(let z=0;z<3;z++)d[i+z]=clamp(Math.round((original[a+z]*(1-v)+original[e+z]*v+original[f+z]*(1-u)+original[g+z]*u)/2),0,255);
   d[i+3]=clamp(Math.round((original[a+3]*(1-v)+original[e+3]*v+original[f+3]*(1-u)+original[g+3]*u)/2),0,255);
 }
 x.putImageData(block,left,top);
}}
/* Non-generative enhancement: mild denoise using blur blend, then unsharp mask.
   Upscaling never counted as new captured detail. */
function enhance(widthLimit=950){if(!ready||!rect)throw Error(txt('Önce resmi kırp.','Bitte zuerst zuschneiden.'));const scale=Math.min(1,widthLimit/Math.max(rect.w,rect.h));const w=Math.max(1,Math.round(rect.w*scale)),h=Math.max(1,Math.round(rect.h*scale));const raw=document.createElement('canvas');raw.width=w;raw.height=h;const rx=raw.getContext('2d',{willReadFrequently:true});rx.imageSmoothingQuality='high';rx.drawImage(src,rect.x,rect.y,rect.w,rect.h,0,0,w,h);const original=document.createElement('canvas');original.width=w;original.height=h;original.getContext('2d').drawImage(raw,0,0);cleanPatches(raw,scale);
 const output=document.createElement('canvas');output.width=w;output.height=h;const ox=output.getContext('2d',{willReadFrequently:true});const contrast=Number($('contrast').value);ox.filter=`contrast(${contrast}%) saturate(103%)`;ox.drawImage(raw,0,0);ox.filter='none';
 const noise=Number($('noise').value)/80;if(noise>0){const blurred=document.createElement('canvas');blurred.width=w;blurred.height=h;const bx=blurred.getContext('2d');bx.filter=`blur(${(.25+noise*.7).toFixed(2)}px)`;bx.drawImage(output,0,0);ox.globalAlpha=noise*.38;ox.drawImage(blurred,0,0);ox.globalAlpha=1;}
 const amount=Number($('sharp').value)/100*.9;if(amount>.01){const blur=document.createElement('canvas');blur.width=w;blur.height=h;const bx=blur.getContext('2d',{willReadFrequently:true});bx.filter='blur(1.1px)';bx.drawImage(output,0,0);const p=ox.getImageData(0,0,w,h),q=bx.getImageData(0,0,w,h),a=p.data,b=q.data;for(let i=0;i<a.length;i+=4){for(let c=0;c<3;c++){const diff=a[i+c]-b[i+c];if(Math.abs(diff)>3)a[i+c]=clamp(Math.round(a[i+c]+diff*amount),0,255);}}ox.putImageData(p,0,0);}
 return{raw:original,output,original_pixels:[rect.w,rect.h],result_pixels:[w,h]};}
function drawFit(target,image){const ctx=target.getContext('2d');target.width=image.width;target.height=image.height;ctx.clearRect(0,0,target.width,target.height);ctx.drawImage(image,0,0);}
$('improveBtn').onclick=()=>{if(busy)return;try{busy=true;const {raw,output}=enhance(1000);drawFit(before,raw);drawFit(after,output);previewFresh=true;$('downloadBtn').disabled=false;status(txt('Önce/sonra hazır. Temiz sonucu PNG olarak indirebilirsin.','Vorher/Nachher fertig. Bereinigtes Ergebnis als PNG herunterladen.'));}catch(e){status(e.message,'error')}finally{busy=false;}};
for(const id of ['sharp','noise','contrast'])$(id).addEventListener('input',()=>{$(id+'Val').textContent=$(id).value+'%';invalidate();});
$('targetMM').oninput=qualityEstimate;
$('sendBtn').onclick=async()=>{if(!WORKSHOP_ENABLED||busy||submission)return;if(!ready||!rect)return status(txt('Önce görsel seçip kırp.','Zuerst Bild auswählen und zuschneiden.'),'error');if(!$('email').checkValidity())return status(txt('Geçerli e-posta gir.','Bitte gültige E-Mail eingeben.'),'error');if(!$('consent').checked)return status(txt('Gönderim ve görsel hakkı onayını işaretle.','Bitte der Übermittlung zustimmen.'),'error');if(!previewFresh)return status(txt('Önce güncel görüntüyü netleştirip ön izlemeyi kontrol et.','Bitte zuerst die aktuelle Vorschau erzeugen und prüfen.'),'error');
 busy=true;$('sendBtn').disabled=true;file.disabled=true;try{const {output,original_pixels}=enhance(3300);const blob=await new Promise((ok,no)=>output.toBlob(b=>b?ok(b):no(Error('PNG export failed')),'image/png'));if(blob.size>8*1024*1024)throw Error(txt('PNG 8 MB sınırını aşıyor. Daha küçük bir alan seç.','PNG größer als 8 MB. Bitte kleineren Ausschnitt wählen.'));
 const form=new FormData();form.set('design',blob,'ejder-temizlenmis.png');form.set('email',$('email').value.trim());form.set('product',$('product').value);form.set('consent','yes');form.set('quality_note',`Original crop ${original_pixels.join('x')} px; approximate target width ${$('targetMM').value} mm; edits browser-local`);
 status(txt('Yalnız seçtiğin PNG gönderiliyor...','Nur das gewählte PNG wird gesendet...'));
 const res=await fetch('/api/design-requests',{method:'POST',body:form,credentials:'same-origin',cache:'no-store'});let msg;try{msg=await res.json()}catch(_){msg={};}
 if(!res.ok||!msg.ok)throw Error((msg.detail&&typeof msg.detail==='string'?msg.detail:'HTTP '+res.status));
 submission=true;status(txt('Atölyeye iletildi. Takip numaran: ','An Werkstatt gesendet. Referenz: ')+msg.request_id+'\n'+txt('Biz baskı uygunluğunu kontrol edip e-postayla dönüş yapabiliriz.','Wir können dich nach der Druckprüfung per E-Mail kontaktieren.'),'ok');
 }catch(e){status(txt('Gönderim tamamlanmadı. Atölye sunucusu bağlı olmayabilir. ','Übermittlung fehlgeschlagen. Werkstattserver ist möglicherweise nicht verbunden. ')+(e.message||e),'error');}
 finally{busy=false;file.disabled=false;$('sendBtn').disabled=!WORKSHOP_ENABLED||submission;}};
$('downloadBtn').onclick=async()=>{
 if(busy||!previewFresh)return;busy=true;file.disabled=true;$('downloadBtn').disabled=true;
 try{const {output}=enhance(3300);const blob=await new Promise((resolve,reject)=>output.toBlob(b=>b?resolve(b):reject(Error('PNG export failed')),'image/png'));
 const downloadURL=URL.createObjectURL(blob),a=document.createElement('a');a.href=downloadURL;a.download='EJDER-temiz-snapshot-'+new Date().toISOString().slice(0,10)+'.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(downloadURL),1000);
 release();status(txt('PNG indirmesi başlatıldı. Geçici video ve görsel kopyaları temizlendi.','PNG-Download gestartet. Temporäre Video- und Bildkopien entfernt.'),'ok');
 }catch(e){status(txt('PNG indirilemedi: ','PNG-Download fehlgeschlagen: ')+(e.message||e),'error');$('downloadBtn').disabled=!previewFresh;}
 finally{busy=false;file.disabled=false;}
};
$('clearFileBtn').onclick=()=>{if(busy)return;release();status(txt('Geçici video ve görsel kopyaları temizlendi.','Temporäre Video- und Bildkopien entfernt.'));};
window.addEventListener('pagehide',release);
draw();showInfo();
})();
