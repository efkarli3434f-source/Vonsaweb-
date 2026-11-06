/* EJDER Studio utilities. Contextual replies use the isolated EJDER service with bounded, memory-only history; local help remains a fallback. Only an explicit click opens WhatsApp. */
(() => {
'use strict';
const phone='4915755390538';
const ui=document.getElementById('utilities');
let lang='tr', mode='', promptEvent=null, installed=false, readAloud=false, lastTrigger=null;
const pick=(tr,de)=>lang==='de'?de:tr;
const whatsapp=l=>'https://wa.me/'+phone+'?text='+encodeURIComponent(l==='de'?'Hallo, ich habe eine Frage zu EJDER Studio.':'Merhaba, EJDER Studio hakkında bir sorum var.');
const copy={
 tr:{install:'Uygulamayı yükle',assistant:'EJDER Asistanı',help:'Hızlı erişim',chat:'EJDER Studio Asistanı',placeholder:'EJDER hakkında sor…',send:'Gönder',close:'Kapat',mic:'Konuş',stop:'Dinlemeyi bitir',listening:'Dinleniyor…',voice:'Sesli yanıt',finish:'Tamam',already:'EJDER Studio bu cihazda uygulama olarak açık.',browser:'Tarayıcının menüsünden “Uygulamayı yükle” veya “Ana ekrana ekle” seçeneğini kullan. Masaüstünde adres çubuğundaki yükleme simgesine de bakabilirsin.',ios:'Safari’de Paylaş düğmesini aç, ardından “Ana Ekrana Ekle” seçeneğini seç.',file:'Bu kopya bir dosya olarak açık. Ana ekrana kurulum için EJDER Studio’yu HTTPS üzerinden yayımlanmış adresinde aç.',unavailable:'Bu cihazda Türkçe çevrimdışı ses tanıma hazır değil. Sorunu yazarak gönderebilirsin.',micError:'Mikrofon açılamadı. Tarayıcı iznini kontrol edebilir veya sorunu yazabilirsin.',empty:'Bu oturum kapatılana kadar mesajların burada kalır.',local:'Cihazında çalışır',installed:'Uygulama yüklendi.',press:'EJDER Studio’yu yüklemek için tarayıcının açtığı pencereden onay ver.',noVoice:'Bu cihazda Türkçe okuma sesi bulunamadı.',fallback:'EJDER Studio’da ürün seçme, fotoğraf ekleme, 3D ön izleme, tasarım kaydetme ve uygulamayı yükleme konularında yardımcı olabilirim. Hangisini yapmak istiyorsun?'},
 de:{install:'App installieren',assistant:'EJDER-Assistent',help:'Schnellzugriff',chat:'EJDER Studio Assistent',placeholder:'Frage zu EJDER stellen…',send:'Senden',close:'Schließen',mic:'Sprechen',stop:'Aufnahme beenden',listening:'Ich höre zu…',voice:'Vorlesen',finish:'Verstanden',already:'EJDER Studio ist auf diesem Gerät bereits als App geöffnet.',browser:'Öffne im Browsermenü „App installieren“ oder „Zum Startbildschirm hinzufügen“. Am Desktop kann das Installationssymbol auch in der Adressleiste stehen.',ios:'Öffne in Safari das Teilen-Menü und wähle „Zum Home-Bildschirm“.',file:'Du hast eine lokale Datei geöffnet. Öffne EJDER Studio unter seiner veröffentlichten HTTPS-Adresse, um die App zu installieren.',unavailable:'Die deutsche Offline-Spracherkennung ist auf diesem Gerät nicht verfügbar. Du kannst deine Frage eintippen.',micError:'Das Mikrofon ließ sich nicht starten. Prüfe die Browserberechtigung oder tippe deine Frage ein.',empty:'Nachrichten bleiben nur in dieser Sitzung.',local:'Läuft auf deinem Gerät',installed:'Die App wurde installiert.',press:'Bestätige die Installation im Dialog deines Browsers.',noVoice:'Auf diesem Gerät ist keine deutsche Stimme zum Vorlesen verfügbar.',fallback:'Ich helfe dir in EJDER Studio bei Produkten, Fotos, 3D-Vorschau, Speichern und App-Installation. Womit möchtest du beginnen?'}
};
const say=k=>copy[lang][k];
const downloadIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v3h16v-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const waIcon='<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a12.6 12.6 0 0 0-11 18.8L3.3 28.7l7.1-1.8A12.6 12.6 0 1 0 16 3zm0 2.3a10.3 10.3 0 1 1-5.4 19.1l-.4-.2-3.8 1 1-3.7-.3-.5A10.3 10.3 0 0 1 16 5.3zm-4.1 4.9c-.3 0-.6.1-.9.4-.4.5-1.3 1.4-1.3 3.1 0 1.7 1.2 3.4 1.5 3.8.2.3 2.6 4 6.2 5.3 2.9 1 3.6.6 4.2.4.7-.3 2.1-1.1 2.4-2.1.3-1 .3-1.8.2-2-.1-.2-.4-.3-.8-.5l-2.6-1.2c-.3-.1-.6-.2-.8.2l-1.2 1.5c-.2.2-.4.3-.8.1-1.9-.8-3.1-1.8-4.4-3.7-.3-.4-.1-.6.1-.8.5-.6 1-1.1 1.1-1.5.1-.3 0-.5-.1-.7l-1.1-2.7c-.3-.7-.6-.7-.9-.7z"/></svg>';
ui.innerHTML=`<nav id="quickDock" class="quick-dock"><button type="button" id="installStudio" class="quick-btn install-btn">${downloadIcon}</button><button type="button" id="askStudio" class="quick-btn ask-btn" aria-controls="utilityDialog" aria-expanded="false"><img src="assets/app-192.png" alt=""></button><a id="whatsStudio" class="quick-btn whats-btn" target="_blank" rel="noopener noreferrer">${waIcon}</a></nav><button id="restoreDock" type="button" aria-controls="quickDock" aria-expanded="false"><span aria-hidden="true">⋮</span></button>
<dialog id="utilityDialog" aria-labelledby="utilityTitle">
  <div class="utility-shell">
    <header class="utility-head">
      <div class="assistant-identity"><img src="assets/app-192.png" width="43" height="43" alt=""><div><small>EJDER STUDIO</small><h2 id="utilityTitle"></h2></div></div>
      <button type="button" class="dialog-close">×</button>
    </header>
    <div id="chatBody">
      <div class="assistant-toolbar">
        <span id="assistantMode"></span>
        <div class="assistant-toolbar-actions"><div id="assistantLanguages" role="group" aria-label="Türkçe / Deutsch"><button type="button" data-help-lang="tr" lang="tr">TR</button><button type="button" data-help-lang="de" lang="de">DE</button></div>
        <button id="clearChat" type="button" disabled>↶</button></div>
      </div>
      <div class="assistant-scene">
        <div id="writtenPane"><div id="chatLog" role="log" aria-live="polite" aria-relevant="additions"></div><div id="chatHints" hidden></div></div>
        <section id="voiceStage" hidden aria-labelledby="voiceTitle">
          <h3 id="voiceTitle"></h3>
          <div class="voice-orb" aria-hidden="true"><span class="orb-outer"></span><span class="orb-inner"></span></div>
          <p id="voiceState" role="status"></p><p id="voiceTip"></p>
          <p id="voiceLive"><i aria-hidden="true"></i><span></span></p>
        </section>
      </div>
      <div id="voiceDestination" class="voice-destination" hidden></div>
      <form id="chatForm"><label class="sr-only" for="askInput"></label><input id="askInput" maxlength="300" autocomplete="off" required><button class="btn tiny" type="submit"></button></form>
      <div class="voice-row"><button type="button" id="chatMic" class="voice-btn" aria-controls="voiceStage" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 18v3m-3 0h6"/></svg><span></span></button><button type="button" id="readReplies" class="voice-btn" aria-pressed="false"></button><button type="button" id="voiceRepair" class="voice-btn" hidden></button></div>
      <details id="ejderSound"><summary></summary><div><label for="ejderSoundChoice"></label><select id="ejderSoundChoice"></select><button id="ejderSoundTest" type="button" class="voice-btn"></button></div><p id="ejderSoundResult" aria-live="polite"></p></details>
      <p id="voiceNotice" class="voice-notice"></p>
    </div>
    <div id="installBody" hidden><img src="assets/ejder_logo.webp" alt="EJDER Studio" width="580" height="258"><p></p><button class="btn tiny" type="button"></button></div>
    <div id="utilityStatus" role="status" aria-live="polite"></div>
  </div>
</dialog>`;
const $=selector=>ui.querySelector(selector), dialog=$('dialog'), chat=$('#chatLog'), input=$('#askInput'), hints=$('#chatHints');
let turns=0,repairMode='';
const guide=window.EJDERGuide.createSession();
const conversation=window.EJDERConversation.create({getLang:()=>lang,getRoute:()=>window.EJDERPaths?.hash()||location.hash,fallback:q=>guide.answer(q,lang,window.EJDERPaths?.hash()||location.hash)});
let submitEpoch=0;
const voiceCopy={
  tr:{help:'Yardım modu',mode:'Sesli sohbet',start:'Sesli konuş',end:'Sesli sohbeti kapat',clear:'Yeni konuşma',ready:'Mikrofon hazırlanıyor',listening:'Seni dinliyorum',hearing:'Seni duyuyorum',waiting:'Yanıt hazırlanıyor',speaking:'Yanıtlıyorum',answer:'EJDER’in yanıtı',ended:'Dinleme sona erdi',unavailable:'Cihazda ses tanıma kullanılamıyor',denied:'Mikrofon izni verilmedi',error:'Mikrofon başlatılamadı',pack:'Türkçe dil paketi gerekiyor',installing:'Dil paketi hazırlanıyor',downloading:'Dil paketi indiriliyor',hint:'EJDER Studio hakkında sorunu söyle.',back:'Yazışmaya dönmek için sesli sohbeti kapat.',noRead:'Bu cihazda yerel okuma sesi yok. Yanıtı yazışmada okuyabilirsin.',deniedHint:'Tarayıcının mikrofon iznini kontrol edebilir veya yazışmaya dönebilirsin.',packHint:'Cihaz içi tanıma için tarayıcının sunduğu dil paketini yükleyebilirsin.',on:'Mikrofon açık',off:'Mikrofon kapalı',retry:'Tekrar dene',install:'Dil paketini yükle'},
  de:{help:'Hilfemodus',mode:'Sprachgespräch',start:'Sprachgespräch',end:'Sprachgespräch beenden',clear:'Neuer Chat',ready:'Mikrofon wird vorbereitet',listening:'Ich höre zu',hearing:'Ich höre dich',waiting:'Antwort wird vorbereitet',speaking:'Ich antworte',answer:'Antwort von EJDER',ended:'Aufnahme beendet',unavailable:'Lokale Spracherkennung nicht verfügbar',denied:'Mikrofonzugriff nicht erlaubt',error:'Mikrofon konnte nicht starten',pack:'Deutsches Sprachpaket erforderlich',installing:'Sprachpaket wird vorbereitet',downloading:'Sprachpaket wird geladen',hint:'Stelle deine Frage zu EJDER Studio.',back:'Beende das Sprachgespräch, um zum Textchat zurückzukehren.',noRead:'Auf diesem Gerät fehlt eine lokale Stimme. Du kannst die Antwort im Chat lesen.',deniedHint:'Prüfe die Mikrofonberechtigung im Browser oder kehre zum Chat zurück.',packHint:'Für die lokale Erkennung kannst du das Sprachpaket deines Browsers installieren.',on:'Mikrofon aktiv',off:'Mikrofon aus',retry:'Erneut versuchen',install:'Sprachpaket installieren'}
};
Object.assign(voiceCopy.tr,{timedout:'Cihazdan yanıt gelmedi',network:'Ses tanıma bağlantısı kesildi',capture:'Mikrofona erişilemedi',timedoutHint:'Bir izin penceresi açıksa yanıtla ve Tekrar dene’ye dokun. Yazışmaya da dönebilirsin.',networkHint:'Bağlantın geri geldiğinde Tekrar dene’ye dokun. Yazılı asistan çevrimdışı da çalışır.',captureHint:'Mikrofonu kullanan başka bir uygulama açıksa kapatıp tekrar dene.'});
Object.assign(voiceCopy.de,{timedout:'Das Gerät antwortet nicht',network:'Spracherkennung unterbrochen',capture:'Mikrofon nicht erreichbar',timedoutHint:'Beantworte eine offene Berechtigungsanfrage und tippe auf „Erneut versuchen“. Du kannst auch zum Chat zurückkehren.',networkHint:'Tippe auf „Erneut versuchen“, sobald die Verbindung wieder da ist. Der Textchat funktioniert auch offline.',captureHint:'Schließe gegebenenfalls eine andere App, die das Mikrofon verwendet, und versuche es erneut.'});
function setLabel(el,text){el.setAttribute('aria-label',text);el.title=text;}
function resetChat(){
  submitEpoch++;conversation.reset();guide.reset();turns=0;$('#chatForm button').disabled=false;chat.replaceChildren();hints.replaceChildren();hints.hidden=true;input.value='';$('#clearChat').disabled=true;
}
function sync(l){
  const next=l==='de'?'de':'tr',changed=lang!==next;
  lang=next;
  if(changed){$('#ejderSoundResult').textContent='';readAloud=false;if(mode==='voice')leaveVoice(false);else engine.stop();resetChat();status('');}
  $('.quick-dock').setAttribute('aria-label',say('help'));
  setLabel($('#restoreDock'),pick('Kısayolları göster','Schnellzugriff anzeigen'));
  setLabel($('#installStudio'),say('install'));setLabel($('#askStudio'),say('assistant'));setLabel($('#whatsStudio'),'WhatsApp · EJDER Studio');$('#whatsStudio').href=whatsapp(lang);
  setLabel($('.dialog-close'),mode==='voice'?voiceCopy[lang].end:say('close'));
  setLabel($('#clearChat'),voiceCopy[lang].clear);
  for(const b of ui.querySelectorAll('[data-help-lang]'))b.setAttribute('aria-pressed',String(b.dataset.helpLang===lang));
  $('#chatForm label').textContent=say('placeholder');input.placeholder=say('placeholder');$('#chatForm button').textContent=say('send');
  $('#chatMic span').textContent=voiceCopy[lang][mode==='voice'?'end':'start'];$('#chatMic').setAttribute('aria-pressed',String(mode==='voice'));
  $('#assistantMode').textContent=voiceCopy[lang][mode==='voice'?'mode':'help'];
  $('#readReplies').textContent=say('voice');$('#readReplies').setAttribute('aria-pressed',String(readAloud));
  refreshSoundChoices();
  $('#installBody button').textContent=say('finish');$('#utilityTitle').textContent=mode==='install'?say('install'):say('chat');
  $('#voiceTitle').textContent='EJDER STUDIO';
  $('#voiceNotice').textContent=pick('Yanıt için soruların ve son birkaç mesajın Supabase/Groq üzerinden işlenir. Sesli modda konuşma parçaları da iletilir; soruların ekrana yazılmaz. EJDER ses veya sohbet kaydı tutmaz.','Fragen und die letzten Nachrichten werden über Supabase/Groq verarbeitet. Im Sprachmodus werden auch Sprachabschnitte übertragen; deine Fragen erscheinen nicht als Text. EJDER speichert weder Audio noch Chatverläufe.');

}
function status(t){$('#utilityStatus').textContent=t||'';}
function row(role,message,href,label){
  const item=document.createElement('div');item.className='chat-row '+role;
  const p=document.createElement('p');p.textContent=message;item.append(p);
  if(href){
    const a=document.createElement('a');a.href='#/'+href;a.textContent=destinationLabel(href);a.addEventListener('click',()=>dialog.close());item.append(a);
  }
  return item;
}
function destinationLabel(href){
  const names={mug:['Kupa','Tasse'],shirt:['Tişört','T-Shirt'],hoodie:['Hoodie','Hoodie'],cushion:['Yastık','Kissen'],tote:['Bez çanta','Stoffbeutel'],poster:['Poster','Poster'],keychain:['Anahtarlık','Schlüsselanhänger'],giftbox:['Hediye kutusu','Geschenkbox']};
  if(href.startsWith('studio/')){const id=href.split('/')[1],label=id.startsWith('case')?pick('Telefon kılıfı','Handyhülle'):names[id]?.[lang==='de'?1:0];if(label)return pick(label+' tasarımını aç',label+' gestalten');}
  const pages={products:['Ürünleri aç','Produkte öffnen'],cases:['Telefon modellerini aç','Handymodelle öffnen'],shop:['Satış vitrinini aç','Shop öffnen'],templates:['Şablonları aç','Vorlagen öffnen'],saved:['Tasarımlarımı aç','Meine Designs öffnen'],account:['Hesabımı aç','Mein Konto öffnen'],contact:['İletişim sayfasını aç','Kontakt öffnen']};
  return pages[href]?.[lang==='de'?1:0]||pick('İlgili sayfayı aç','Seite öffnen');
}
function showVoiceDestination(reply){
  const host=$('#voiceDestination');host.replaceChildren();host.hidden=true;
  if(!/^(?:home|products|cases|templates|saved|shop|cart|account|payments|contact|privacy|studio\/[a-z0-9-]+)$/.test(reply.href||''))return;
  const a=document.createElement('a');a.href='#/'+reply.href;a.className='btn tiny';a.textContent=destinationLabel(reply.href);a.addEventListener('click',()=>dialog.close());host.append(a);host.hidden=false;
}
function audioError(detail={}){
  const code=detail.code||'';
  const message=code==='natural-unavailable'?pick('Bu tarayıcı Okur sesini çalıştıramıyor. Ses ayarlarından bir cihaz sesi seçebilirsin.','Dieser Browser kann Okur nicht wiedergeben. Wähle in den Stimmeinstellungen eine Gerätestimme.'):code==='greeting-file'?pick('Karşılama sesi yüklenemedi. Bağlantı geldiğinde Sesi tekrar çal düğmesine dokun.','Die Begrüßung konnte nicht geladen werden. Tippe bei bestehender Verbindung auf Erneut vorlesen.'):code.startsWith('natural-')?pick('Türkçe ses dosyaları yüklenemedi. Yeniden denemek için Sesi tekrar çal düğmesine dokun.','Das türkische Sprachmodell konnte nicht geladen werden. Tippe zum Wiederholen auf Erneut vorlesen.'):code.startsWith('local-')?pick('Yedek ses yüklenemedi. İnternet bağlantını kontrol edip Sesi tekrar çal düğmesine tıkla.','Die Ersatzstimme konnte nicht geladen werden. Prüfe deine Verbindung und klicke auf Erneut vorlesen.'):(['language-unavailable','voice-unavailable'].includes(code)||(detail.matchingVoices===0&&['synthesis-failed','synthesis-unavailable','start-timeout'].includes(code)))?pick('Türkçe okuma sesi yüklenemedi. Tarayıcını güncelle veya cihazının konuşma ayarlarında Türkçe sesini etkinleştir; ardından tekrar dene.','Die deutsche Stimme konnte nicht geladen werden. Aktualisiere den Browser oder aktiviere eine deutsche Stimme in den Spracheinstellungen deines Geräts. Versuche es danach erneut.'):
    code==='not-allowed'?pick('Tarayıcı sesin otomatik başlamasını engelledi. Sesi tekrar çal düğmesine tıkla.','Der Browser hat die automatische Wiedergabe blockiert. Klicke auf Erneut vorlesen.'):
    code==='unsupported'?pick('Bu tarayıcı sesli okumayı desteklemiyor. Güncel bir tarayıcıyla deneyebilir veya yazılı yardımı kullanabilirsin.','Dieser Browser unterstützt das Vorlesen nicht. Verwende einen aktuellen Browser oder den Textchat.'):
    pick('Yanıtın sesi yarıda kaldı. Aynı yanıtı dinlemek için Sesi tekrar çal düğmesine dokun.','Die Sprachausgabe wurde unterbrochen. Tippe auf Erneut vorlesen, um dieselbe Antwort noch einmal zu hören.');
  const known = /^[a-z][a-z0-9-]{0,36}$/.test(code) ? code : 'playback';
  status(message+' · 7.43 / '+known);repairMode='audio';$('#voiceRepair').hidden=false;$('#voiceRepair').textContent=voiceCopy[lang].replay;
}
async function submit(raw,fromVoice=false,provided){
  const question=String(raw||'').trim().slice(0,300);if(!question)return;if(fromVoice){$('#voiceDestination').replaceChildren();$('#voiceDestination').hidden=true;}
  // Spoken questions and replies stay out of the DOM, including after leaving voice mode.
  if(fromVoice){
    const reply=await conversation.answer(question,provided);
    if(mode==='voice'&&reply)showVoiceDestination(reply);
    return reply;
  }
  const token=++submitEpoch;
  if(turns>=20){chat.firstElementChild?.remove();chat.firstElementChild?.remove();}else turns++;
  const pending=row('assistant',pick('Seni dinledim, yanıtlıyorum…','Ich antworte dir…'));
  chat.append(row('user',question),pending);input.value='';status('');$('#chatForm button').disabled=true;
  requestAnimationFrame(()=>{if(mode==='chat')chat.scrollTop=chat.scrollHeight;});
  const reply=await conversation.answer(question);
  if(token!==submitEpoch||!reply)return;
  pending.replaceWith(row('assistant',reply.message,reply.href,reply.label));$('#chatForm button').disabled=false;
  if(hints.hidden){
    const labels=lang==='de'?['Produkte','Fotos','PNG herunterladen']:['Ürünler','Fotoğraflar','PNG indirme'];
    for(const label of labels){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>submit(label);hints.append(b);}hints.hidden=false;
  }
  $('#clearChat').disabled=false;requestAnimationFrame(()=>{if(mode==='chat')chat.scrollTop=chat.scrollHeight;});
  if(readAloud)engine.read(reply.message);return reply;
}
function voiceState(phase,live,detail){
  if(mode!=='voice')return;
  const c=voiceCopy[lang],stage=$('#voiceStage');
  stage.dataset.state=phase;stage.dataset.mic=String(live);
  $('#voiceState').textContent=c[phase==='starting'?'ready':phase]||c.ready;
  $('#voiceTip').textContent=phase==='audioerror'?c.audioHint:phase==='answer'?c.hint:detail==='noRead'?c.noRead:
    ['pack','installing','downloading'].includes(phase)?c.packHint:
    c[phase+'Hint']||(['unavailable','ended','error'].includes(phase)?c.back:c.hint);
  $('#voiceLive span').textContent=live?c.on:c.off;
  repairMode=phase==='audioerror'?'audio':phase==='pack'?'pack':['ended','error','denied','downloading','timedout','network','capture','suspended'].includes(phase)?'retry':'';
  $('#voiceRepair').hidden=!repairMode;
  $('#voiceRepair').textContent=repairMode==='audio'?c.replay:repairMode==='pack'?c.install:c.retry;
}
Object.assign(voiceCopy.tr,{unavailable:'Bu tarayıcı sesli sohbeti desteklemiyor',noRead:'Türkçe okuma sesi bulunamadı. Yanıtı burada okuyup yeni sorunu söyleyebilirsin.',networkHint:'Bağlantı yanıt vermedi. Mikrofon açık; biraz sonra sorunu tekrar söyleyebilirsin.',limited:'Ses hizmeti kısa bir süre bekliyor',limitedHint:'Kullanım sınırına ulaşıldı. Biraz sonra tekrar söyle veya yazılı yardımı kullan.',unclear:'Sözünü net anlayamadım',unclearHint:'Mikrofon açık. Sorunu biraz daha yakından tekrar söyle.',suspended:'Tarayıcı sesi duraklattı',suspendedHint:'Aynı mikrofonla devam etmek için Devam et düğmesine dokun.',retry:'Devam et'});
Object.assign(voiceCopy.de,{unavailable:'Dieser Browser unterstützt den Sprachchat nicht',noRead:'Keine deutsche Stimme gefunden. Lies die Antwort hier und stelle deine nächste Frage.',networkHint:'Die Verbindung antwortet nicht. Das Mikrofon bleibt offen; wiederhole deine Frage gleich.',limited:'Sprachdienst wartet kurz',limitedHint:'Das Nutzungslimit wurde erreicht. Versuche es später erneut oder nutze den Textchat.',unclear:'Ich habe dich nicht deutlich verstanden',unclearHint:'Das Mikrofon bleibt offen. Sprich bitte etwas näher und wiederhole die Frage.',suspended:'Der Browser hat den Ton pausiert',suspendedHint:'Tippe auf Weiter, um mit demselben Mikrofon fortzufahren.',retry:'Weiter'});
Object.assign(voiceCopy.tr,{audioerror:'Ses başlatılamadı',audioHint:'Yanıtı yeniden dinlemek için Sesi tekrar çal düğmesine dokun.',replay:'Sesi tekrar çal'});
Object.assign(voiceCopy.de,{audioerror:'Sprachausgabe konnte nicht starten',audioHint:'Tippe auf Erneut vorlesen, um dieselbe Antwort zu hören.',replay:'Erneut vorlesen'});
const engine=window.EJDERSpeech.create({getLang:()=>lang,onState:voiceState,getContext:()=>conversation.snapshot(),onQuestion:(t,reply)=>submit(t,true,reply),onExit:()=>leaveVoice(),onAudioError:audioError,onPlayback:event=>{
  if(event.event==='preparing'){$('#ejderSoundResult').textContent='';}
  if(event.event==='preparing')status(event.engine==='neural'?'Doğal Türkçe ses hazırlanıyor…':pick('Ses hazırlanıyor…','Sprachausgabe wird vorbereitet…'));
  if(event.event==='started'){
    const name=event.engine==='neural'?'EJDER Türkçe · Okur':event.engine==='local'?pick('EJDER yedek sesi','EJDER-Ersatzstimme'):(event.voice||pick('Cihaz sesi','Gerätestimme'));
    $('#ejderSoundResult').textContent=pick('Kullanılan ses · ','Verwendete Stimme · ')+name;
    repairMode='';$('#voiceRepair').hidden=true;status(mode==='voice'?'':pick('Ses oynatılıyor…','Sprachausgabe läuft…'));}
  if(event.event==='complete')status('');
}});
function refreshSoundChoices(){
  const panel=$('#ejderSound'),select=$('#ejderSoundChoice');
  panel.querySelector('summary').textContent=pick('Ses ayarları','Stimme einstellen');
  panel.querySelector('label').textContent=pick('Okuma sesi','Vorlesestimme');
  $('#ejderSoundTest').textContent=pick('Sesi dene','Stimme testen');
  const voices=engine.options?.()||[];
  const turkishModel=engine.hasNeural?.();
  const values=[{key:'',name:turkishModel?pick('Otomatik · doğal Türkçe (Okur)','Automatisch · natürliche türkische Stimme (Okur)'):pick('Otomatik','Automatisch')},...voices];
  if(turkishModel&&engine.preference?.()==='neural')values.push({key:'neural',name:'EJDER Türkçe · Okur'});
  if(engine.hasBackup?.())values.push(turkishModel?{key:'basic',name:'Temel ses (mekanik)'}:{key:'backup',name:pick('EJDER yedek sesi','EJDER-Ersatzstimme')});
  select.replaceChildren();
  for(const {key,name} of values){
    const option=document.createElement('option');option.value=key;option.textContent=name;select.append(option);
  }
  const preferred=engine.preference?.()||'';
  select.value=values.some(v=>v.key===preferred)?preferred:'';
}
$('#ejderSound').addEventListener('toggle',()=>{if($('#ejderSound').open)refreshSoundChoices();});
window.speechSynthesis?.addEventListener?.('voiceschanged',()=>{if($('#ejderSound').open)refreshSoundChoices();});
$('#ejderSoundChoice').onchange=event=>{
  engine.setPreference(event.target.value);
  status('');$('#ejderSoundResult').textContent='';repairMode='';$('#voiceRepair').hidden=true;
};
$('#ejderSoundTest').onclick=()=>{
  engine.read(pick('Merhaba, bu benim Türkçe sesim.','Hallo, so klingt meine deutsche Stimme.'),mode==='voice');
};
function setView(view){
  mode=view;dialog.dataset.view=view;$('#ejderSound').open=false;$('#ejderSoundResult').textContent='';
  const voice=view==='voice',install=view==='install';$('#voiceDestination').replaceChildren();$('#voiceDestination').hidden=true;
  $('#chatBody').hidden=install;$('#installBody').hidden=!install;$('#writtenPane').hidden=voice;$('#voiceStage').hidden=!voice;
  $('#chatForm').hidden=voice;$('#readReplies').hidden=voice;$('#voiceRepair').hidden=true;repairMode='';
  $('#askStudio').setAttribute('aria-expanded',String(!install));status('');sync(lang);
}
function leaveVoice(focus=true){
  engine.stop();conversation.cancel();setView('chat');
  chat.scrollTop=chat.scrollHeight;
  if(focus)$('#chatMic').focus({preventScroll:true});
}
function enterVoice(){
  if(mode==='voice'){leaveVoice();return;}
  submitEpoch++;conversation.cancel();$('#chatForm button').disabled=false;setView('voice');$('#chatMic').focus({preventScroll:true});engine.begin();
}
function show(view,from){
  if(!dialog.open)lastTrigger=from||document.activeElement;
  if(mode==='voice')engine.stop();
  setView(view);
  if(!dialog.open)dialog.showModal();
  (view==='install'?$('#installBody button'):$('.dialog-close')).focus({preventScroll:true});
}

function installHelp(message){
  show('install',$('#installStudio'));
  const apple=/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const installedMode=installed||matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  $('#installBody p').textContent=message||say(installedMode?'already':location.protocol==='file:'?'file':apple?'ios':'browser');
}
$('#installStudio').addEventListener('click',async()=>{
  if(!promptEvent){installHelp();return;}
  const event=promptEvent;promptEvent=null;
  try{await event.prompt();const choice=await event.userChoice;if(choice.outcome==='accepted')installHelp(say(installed?'installed':'press'));}catch{installHelp();}
});
window.addEventListener('beforeinstallprompt',ev=>{ev.preventDefault();promptEvent=ev;});
window.addEventListener('appinstalled',()=>{installed=true;promptEvent=null;if(dialog.open&&mode==='install')installHelp(say('installed'));});
$('#askStudio').onclick=()=>show('chat',$('#askStudio'));
document.addEventListener('click',event=>{
  const pref=event.target.closest('[data-dock-preference]');
  if(!pref&& !event.target.closest('#restoreDock'))return;
  const folded=!!pref&&!document.body.classList.contains('dock-folded');
  document.body.classList.toggle('dock-folded',folded);
  const button=document.querySelector('[data-dock-preference]');
  if(button)button.textContent=folded?(lang==='de'?'Schnellzugriff anzeigen':'Kısayolları göster'):(lang==='de'?'Schnellzugriff einklappen':'Kısayolları küçült');
  if(pref)document.querySelector('.menu-btn[aria-expanded="true"]')?.click();
  (folded?$('#restoreDock'):$('#installStudio'))?.focus({preventScroll:true});
});

document.addEventListener('click',ev=>{const b=ev.target.closest('[data-support-open]');if(b)show('chat',b);});
$('#chatForm').onsubmit=e=>{e.preventDefault();submit(input.value);};
$('.dialog-close').onclick=()=>mode==='voice'?leaveVoice():dialog.close();
$('#installBody button').onclick=()=>dialog.close();
dialog.addEventListener('cancel',e=>{if(mode==='voice'){e.preventDefault();leaveVoice();}});
// A stray tap on the mobile backdrop is not an instruction to end an active call.
dialog.addEventListener('click',e=>{if(e.target===dialog&&mode!=='voice')dialog.close();});
dialog.addEventListener('close',()=>{engine.stop();resetChat();mode='';status('');$('#askStudio').setAttribute('aria-expanded','false');if(lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});lastTrigger=null;});
$('#chatMic').onclick=enterVoice;
$('#voiceRepair').onclick=()=>{if(repairMode==='audio'){status('');$('#voiceRepair').hidden=true;repairMode='';engine.retrySpeech();}else if(mode==='voice'&&repairMode)engine.retry();};
$('#clearChat').onclick=()=>{if(mode==='voice')leaveVoice(false);else engine.stop();resetChat();input.focus();};
$('#assistantLanguages').onclick=e=>{
  const button=e.target.closest('[data-help-lang]');
  if(button&&button.dataset.helpLang!==lang)document.querySelector('.sitehead [data-lang="'+button.dataset.helpLang+'"]')?.click();
};
$('#readReplies').onclick=()=>{
  if(!readAloud&&!engine.hasVoice()){status(say('noVoice'));return;}
  readAloud=!readAloud;if(!readAloud){engine.cancelSpeech();$('#voiceRepair').hidden=true;repairMode='';}
  $('#readReplies').setAttribute('aria-pressed',String(readAloud));status('');if(readAloud)engine.read(pick('Sesli yanıt açık.','Vorlesen ist eingeschaltet.'));
};
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&mode==='voice'&&engine.isActive())engine.retry();});
// Internal route refreshes must never close an active voice session.
// Explicitly opening an assistant destination already closes the dialog above.
window.addEventListener('pagehide',()=>{engine.stop();resetChat();if(dialog.open)dialog.close();});
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)&&window.isSecureContext)window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).catch(()=>{});});
window.EJDERHelp={sync,whatsapp};sync(lang);
})();
