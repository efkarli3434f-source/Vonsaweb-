/* EJDER Studio — a local-first product design editor. */
(() => {
'use strict';
const ROOT=document.getElementById('app');
const AS='assets/';
const W=900,H=650;
const CATEGORIES=[
 {id:'case',tr:'Telefon Kılıfı',de:'Handyhülle',shortTr:'Kendi stilini telefonuna taşı.',shortDe:'Dein Stil auf deiner Handyhülle.'},
 {id:'mug',tr:'Kupa / Bardak',de:'Tasse / Becher',shortTr:'Her yudum sana özel.',shortDe:'Jeder Schluck ein Unikat.'},
 {id:'shirt',tr:'Tişört',de:'T-Shirt',shortTr:'Tarzını üzerinde taşı.',shortDe:'Trage deinen eigenen Stil.'},
 {id:'keychain',tr:'Anahtarlık',de:'Schlüsselanhänger',shortTr:'Küçük ama çok özel.',shortDe:'Klein, aber besonders.'},
 {id:'hoodie',tr:'Hoodie / Sweatshirt',de:'Hoodie / Sweatshirt',shortTr:'Sıcak ve özgün bir stil.',shortDe:'Ein eigener Look für jeden Tag.'},
 {id:'tote',tr:'Bez Çanta',de:'Stofftasche',shortTr:'Günlük stilini kişiselleştir.',shortDe:'Gestalte deinen Alltagsbegleiter.'},
 {id:'poster',tr:'Poster / Tablo',de:'Poster / Wandbild',shortTr:'Duvarlarına özel bir dokunuş.',shortDe:'Ein besonderer Akzent für deine Wände.'},
 {id:'cushion',tr:'Dekoratif Yastık',de:'Dekokissen',shortTr:'Kendi motifinle yumuşak bir dokunuş.',shortDe:'Dein Motiv auf weichem Stoff.'},
 {id:'giftbox',tr:'Hediye Kutusu',de:'Geschenkbox',shortTr:'Kutudan önce tasarım sürprizi.',shortDe:'Deine persönliche Geschenkbox.'}
];
const CASE_MODELS=window.EJDERCaseCatalog.models.map(({id,model})=>({id,model,tr:model+' Kılıfı',de:model+' Hülle',shortTr:'Kılıf rengini ve baskını seç.',shortDe:'Wähle Hüllenfarbe und Motiv.'}));
const PRODUCTS=[...CATEGORIES,...CASE_MODELS];
const DEFAULT_CASE='case-s24';
function productLink(id){return hash(id==='case'?'cases':'studio/'+id);}
const COLLECTIONS=[
 {id:'case-mug',product:['case','mug'],tr:'Kılıf & Kupa',de:'Handyhülle & Tasse',art:'case_mug_collection.webp'},
 {id:'shirt-keychain',product:['shirt','keychain'],tr:'Tişört & Anahtarlık',de:'T-Shirt & Schlüsselanhänger',art:'shirt_keychain_collection.webp'},
 {id:'hoodie-tote',product:['hoodie','tote'],tr:'Hoodie & Bez Çanta',de:'Hoodie & Stofftasche',art:'hoodie_tote_collection.webp'},
 {id:'poster-gift',product:['poster','giftbox'],tr:'Poster & Hediye Kutusu',de:'Poster & Geschenkbox',art:'poster_gift_collection.webp'}
];
const T={
 tr:{navHome:'Ana Sayfa',navCampaigns:'İlham',navProducts:'Ürünler',navStudio:'Tasarım Stüdyosu',navTemplates:'Şablonlar',navSaved:'Tasarımlarım',navAbout:'Hakkımızda',navContact:'İletişim',search:'Ürün veya tasarım ara...',topMessage:'Kişiye özel dijital tasarımlar',topMiddle:'Hayal Et · Tasarla · Kaydet',topRight:'Türkçe & Almanca',heroKicker:'KİŞİYE ÖZEL TASARIM ATÖLYESİ',heroTitleA:'Sen Hayal Et,',heroTitleB:'Biz Tasarıma',heroTitleC:'Dönüştürelim.',heroP:'Kendi fotoğrafın, yazın ve renklerinle dokuz ürün kategorisinde özgün tasarımlar hazırla. Üstelik ön izlemeyi anında gör.',start:'Tasarıma Başla',browse:'Ürünleri Keşfet',feature1:'Kendi görselini yükle',feature2:'Yazı ve renk ekle',feature3:'Canlı ön izleme',feature4:'Tasarımını indir',categoriesKick:'KENDİNE ÖZEL BİR ŞEY YARAT',categoriesTitle:'Hayalindeki Ürünü Seç',categoriesText:'Ürünü seç, tasarla ve kendi tarzını oluştur.',design:'Tasarla',campaigns:'İlham Köşesi',campaign1:'Kendi tarzın, kendi imzan',campaign1s:'İsim ve baş harf tasarımları',campaign2:'Özel anlara özel',campaign2s:'Fotoğraf ve mesajlarla kişiselleştir',campaign3:'Sürpriz kutu deneyimi',campaign3s:'Kurdeleyi çöz, kutuyu aç',campaignNote:'Bir örnek seçip kendi yazın, fotoğrafın ve renklerinle tasarlamaya başla.',how:'Üç Kolay Adım',step1:'Ürün Seç',step1p:'Dokuz farklı kategoriden birini seç.',step2:'Kendin Tasarla',step2p:'Fotoğraf, metin, desen ve renk ekle.',step3:'Önizle & Kaydet',step3p:'Sonucu kontrol et, kaydet veya PNG indir.',giftHead:'Sürprizi Birlikte Açalım',giftDesc:'Kurdeleli kutuyu aç. EJDER koleksiyonundan üç ürün, kutunun üzerinde 3D olarak belirsin.',giftOpen:'Kurdeleyi Çöz & Kutuyu Aç',giftClose:'Kutuyu Kapat',allTemplates:'Hazır Şablonlar',allTemplatesText:'Bir tema seçerek başlayabilir veya sıfırdan kendi tasarımını oluşturabilirsin.',productChoice:'Tasarım için ürün seç',designStart:'Tasarımına Başla',collectionDesc:'Kendine ait bir tasarım üret; renkler, fotoğraflar ve yazılar tamamen senin seçimin.',templateTitle:'İlham Veren Şablonlar',templateDesc:'Her birini yazın ve renklerinle değiştirebilirsin.',studioHeading:'Kendi Tasarımını Oluştur',studioSub:'Seç • Tasarla • Önizle • Kaydet',selectProduct:'Ürün seç',upload:'Fotoğraf yükle',addText:'Yazı ekle',colors:'Renkler',templates:'Şablonlar',layers:'Katmanlar',typeText:'Üzerindeki yazı',sampleText:'Senin İsmin',chooseFont:'Yazı tipi',textColor:'Yazı rengi',productColor:'Ürün rengi',size:'Boyut',rotation:'Döndürme',editArea:'Tasarım alanı',preview:'Canlı ön izleme',front:'Ön görünüm',back:'Arka görünüm',frontOnly:'Ön yüz',productHint:'Görseldeki yazı veya fotoğrafı tutup sürükleyerek yerini değiştirebilirsin.',undo:'Geri Al',redo:'İleri Al',deleteLayer:'Katmanı Sil',save:'Tarayıcıya Kaydet',download:'PNG Ön İzlemeyi İndir',editorNote:'Ürün görünümü 900 × 650 piksel olarak indirilir. Ayrı tasarım PNG’sinin uzun kenarı 1600 pikseldir. Çıktı boyutunu baskıdan önce üreticinle kontrol et.',savedHead:'Kaydedilen Tasarımlarım',savedDesc:'Tasarımlar yalnızca bu tarayıcıda saklanır. Cihaz değişirse otomatik taşınmaz.',noSaved:'Henüz kaydedilmiş tasarım yok.',open:'Düzenle',delete:'Sil',date:'Tarih',homeBottom:'EJDER Studio',legal:'Yasal Bilgiler',privacy:'Gizlilik',terms:'Kullanım Koşulları',footerCopy:'Hayal et. Kişiselleştir. Tasarla.',footerReminder:'Kendi cihazında tasarla, kaydet ve PNG olarak indir.',aboutTitle:'Hayal Gücüne Özel Bir Stüdyo',aboutP:'EJDER Studio’da dokuz ürün kategorisinde kendi tasarımını oluşturabilirsin. Bir şablon seç, yazını veya fotoğrafını ekle ve sonucu PNG olarak cihazına indir.',contactTitle:'İletişim',contactP:'Tasarım stüdyosu hakkında asistanı açabilir veya WhatsApp üzerinden yazabilirsin.',name:'Adın',email:'E-posta',message:'Mesaj',contactDisabled:'Mesaj gönderimi henüz etkin değil',legalTitle:'Yasal / Datenschutz',legalP:'EJDER Studio ile tarayıcında tasarım oluşturabilir ve PNG dosyalarını indirebilirsin. Satış Vitrini, ürün seçimi ve sepet için hazırlanmıştır. Mağaza tarafından açıldığında ödeme alınmadan sipariş talebi gönderilebilir. Gerçek ödeme henüz etkin değildir. Fotoğrafların ve taslakların hakkında bilgi için Gizlilik bölümünü açabilirsin.',toastSaved:'Tasarım bu tarayıcıya kaydedildi.',toastDeleted:'Tasarım silindi.',toastUpload:'Fotoğraf tasarıma eklendi.',toastBadFile:'Lütfen 10 MB altı JPG, PNG veya WebP dosyası seç.',toastNoSelected:'Önce bir katman seç.',toastStorage:'Cihaz depolama sınırı nedeniyle kaydedilemedi. PNG olarak indir.',toastDownloaded:'Ön izleme PNG dosyası hazırlandı.',toastFrontOnly:'Bu ürün için şu anda ön yüz düzenlenebilir.',template_monogram:'Monogram',template_floral:'Çiçek',template_nature:'Doğa',template_pet:'Köpek',template_cat:'Tekir Kedi',template_bird:'Muhabbet Kuşu',template_heart:'Aşk & Anı',template_minimal:'Minimal',template_dragon:'Ejderha',template_night:'Gece',language:'Dil',menu:'Menüyü Aç',help:'Yardım',giftPreview:'Hediye kutusu örnek açılma efekti',shopDisabled:'Gerçek sipariş/ödeme sistemi henüz kurulmadı.',aboutCard1:'Sen tasarla',aboutCard1p:'Seçimlerini kendin yap.',aboutCard2:'Dilersen kaydet',aboutCard2p:'Ön izleme aynı cihazda kalır.',aboutCard3:'Her dilde kolay',aboutCard3p:'Türkçe ve Almanca menüler.'},
 de:{navHome:'Startseite',navCampaigns:'Inspiration',navProducts:'Produkte',navStudio:'Designstudio',navTemplates:'Vorlagen',navSaved:'Meine Entwürfe',navAbout:'Über uns',navContact:'Kontakt',search:'Produkt oder Design suchen...',topMessage:'✦ Individuelle digitale Designs',topMiddle:'◇ Vorstellen • Gestalten • Speichern',topRight:'Türkisch & Deutsch',heroKicker:'✦ DEIN PERSÖNLICHES DESIGNSTUDIO',heroTitleA:'Deine Idee.',heroTitleB:'Dein Design.',heroTitleC:'Dein Stil.',heroP:'Entwirf einzigartige Designs für neun Produktarten mit eigenen Fotos, Texten und Farben. Sieh dir sofort die Vorschau an.',start:'Jetzt gestalten',browse:'Produkte entdecken',feature1:'Eigenes Bild hochladen',feature2:'Text und Farbe hinzufügen',feature3:'Live-Vorschau',feature4:'Design herunterladen',categoriesKick:'ERSCHAFFE DEIN UNIKAT',categoriesTitle:'Wähle dein Produkt',categoriesText:'Produkt wählen, gestalten und deinen Stil zeigen.',design:'Gestalten',campaigns:'Inspiration',campaign1:'Dein eigener Stil',campaign1s:'Namen und Monogramme',campaign2:'Persönliche Momente',campaign2s:'Fotos und eigene Botschaften',campaign3:'Überraschungsbox',campaign3s:'Schleife lösen, Box öffnen',campaignNote:'Wähle eine Idee und gestalte sie mit eigenem Text, Fotos und Farben.',how:'Drei einfache Schritte',step1:'Produkt wählen',step1p:'Wähle eine von neun Kategorien.',step2:'Selbst gestalten',step2p:'Foto, Text, Muster und Farbe hinzufügen.',step3:'Vorschau & Speichern',step3p:'Prüfen, speichern oder PNG herunterladen.',giftHead:'Öffne die Überraschung',giftDesc:'Teste die Öffnungsanimation unserer Geschenkbox. Dein Design kann später einfließen.',giftOpen:'Schleife lösen & Box öffnen',giftClose:'Box schließen',allTemplates:'Designvorlagen',allTemplatesText:'Starte mit einer Vorlage oder erschaffe ein völlig eigenes Motiv.',productChoice:'Produkt zum Gestalten wählen',designStart:'Jetzt gestalten',collectionDesc:'Kreiere dein Design mit deinen eigenen Farben, Bildern und Texten.',templateTitle:'Inspirierende Vorlagen',templateDesc:'Alle Vorlagen lassen sich individuell anpassen.',studioHeading:'Erstelle dein eigenes Design',studioSub:'Wählen • Gestalten • Vorschau • Speichern',selectProduct:'Produkt wählen',upload:'Foto hochladen',addText:'Text hinzufügen',colors:'Farben',templates:'Vorlagen',layers:'Ebenen',typeText:'Dein Schriftzug',sampleText:'Dein Name',chooseFont:'Schriftart',textColor:'Textfarbe',productColor:'Produktfarbe',size:'Größe',rotation:'Drehung',editArea:'Designfläche',preview:'Live-Vorschau',front:'Vorderseite',back:'Rückseite',frontOnly:'Vorderseite',productHint:'Ziehe den Text oder das Foto, um es neu zu platzieren.',undo:'Rückgängig',redo:'Wiederholen',deleteLayer:'Ebene löschen',save:'Im Browser speichern',download:'PNG-Vorschau herunterladen',editorNote:'Das Produktbild hat 900 × 650 Pixel. Beim separaten Motiv-PNG misst die längere Seite 1600 Pixel. Stimme die Ausgabegröße vor dem Druck mit der Druckerei ab.',savedHead:'Meine gespeicherten Entwürfe',savedDesc:'Entwürfe werden nur in diesem Browser gespeichert und nicht automatisch übertragen.',noSaved:'Noch keine Entwürfe gespeichert.',open:'Bearbeiten',delete:'Löschen',date:'Datum',homeBottom:'EJDER Studio',legal:'Rechtliches',privacy:'Datenschutz',terms:'Nutzungsbedingungen',footerCopy:'Vorstellen. Personalisieren. Gestalten.',footerReminder:'Auf deinem Gerät gestalten, speichern und als PNG herunterladen.',aboutTitle:'Ein Studio für deine Ideen',aboutP:'Bei EJDER Studio gestaltest du Produkte aus neun Kategorien mit eigenen Motiven. Wähle eine Vorlage, ergänze Text oder ein Foto und lade dein Ergebnis als PNG auf dein Gerät.',contactTitle:'Kontakt',contactP:'Für Fragen zum Studio kannst du den Assistenten öffnen oder über WhatsApp schreiben.',name:'Name',email:'E-Mail',message:'Nachricht',contactDisabled:'Nachrichtenversand noch nicht aktiv',legalTitle:'Rechtliches / Datenschutz',legalP:'Mit EJDER Studio kannst du im Browser eigene Motive gestalten und PNG-Dateien herunterladen. Der Shop unterstützt Artikelauswahl und Warenkorb. Nach Freischaltung können unbezahlte Bestellanfragen gesendet werden. Echte Zahlungen sind noch nicht aktiv. Informationen zu Fotos und Entwürfen findest du unter Datenschutz.',toastSaved:'Entwurf wurde in diesem Browser gespeichert.',toastDeleted:'Entwurf gelöscht.',toastUpload:'Foto hinzugefügt.',toastBadFile:'Bitte JPG, PNG oder WebP unter 10 MB auswählen.',toastNoSelected:'Bitte zuerst eine Ebene auswählen.',toastStorage:'Browser-Speicher ist voll. Bitte als PNG herunterladen.',toastDownloaded:'PNG-Vorschau wurde vorbereitet.',toastFrontOnly:'Für dieses Produkt ist derzeit nur die Vorderseite bearbeitbar.',template_monogram:'Monogramm',template_floral:'Blumen',template_nature:'Natur',template_pet:'Hund',template_cat:'Getigerte Katze',template_bird:'Wellensittich',template_heart:'Liebe & Erinnerung',template_minimal:'Minimal',template_dragon:'Drache',template_night:'Nacht',language:'Sprache',menu:'Menü öffnen',help:'Hilfe',giftPreview:'Geschenkbox Öffnungsanimation',shopDisabled:'Ein echter Bestell-/Zahlungsprozess ist noch nicht eingerichtet.',aboutCard1:'Selbst gestalten',aboutCard1p:'Du bestimmst alle Details.',aboutCard2:'Lokal speichern',aboutCard2p:'Der Entwurf bleibt auf deinem Gerät.',aboutCard3:'Einfach in zwei Sprachen',aboutCard3p:'Türkische und deutsche Menüs.'}
};
const CORE_TEMPLATES=['monogram','floral','nature','heart','minimal','dragon','night'];
const PET_TEMPLATES=['pet','cat','bird'];
const EXTRA_MOTIFS={
 phoenix:['Alevli Anka','Feuerphönix','hoodie'],sapphire:['Safir Ejderha','Saphirdrache','case-s24'],tiger:['Gece Kaplanı','Nachttiger','shirt'],koi:['İkiz Koi','Koi-Duo','cushion'],
 astronaut:['Galaksi Astronotu','Galaxie-Astronaut','case-pixel9'],racer:['Neon Spor Araba','Neon-Sportwagen','case-redmi13'],stag:['Kutup Işığı Geyiği','Polarlicht-Hirsch','poster'],hummingbird:['Zümrüt Sinekkuşu','Smaragdkolibri','tote'],
 shore:['Sahilde El Ele','Hand in Hand am Meer','cushion'],umbrella:['Kırmızı Şemsiye','Roter Regenschirm','mug'],foreheads:['Baş Başa','Stirn an Stirn','shirt'],bicycle:['Birlikte Bisiklet','Zu zweit auf dem Rad','tote'],
 wedding:['Nikâh Portresi','Hochzeitsporträt','case-iphone16'],dance:['İlk Dans','Erster Tanz','poster'],anniversary:['Evlilik Yıl Dönümü','Hochzeitstag','cushion'],lifetime:['Bir Ömür Birlikte','Ein Leben zu zweit','mug'],
 rose:['Gül','Rose','cushion'],sunflower:['Ayçiçeği','Sonnenblume','tote'],lavender:['Lavanta','Lavendel','mug'],tulip:['Lale','Tulpen','shirt'],
 butterfly:['Kelebek','Schmetterling','case-iphone16'],fox:['Tilki','Fuchs','cushion'],horse:['At','Pferd','poster'],panda:['Panda','Panda','tote'],
 crescent:['Hilal ve yıldızlar','Mondsichel und Sterne','case-s24'],saturn:['Halkalı gezegen','Ringplanet','hoodie'],alpine:['Dağ zirvesi','Berggipfel','poster'],wave:['Okyanus dalgası','Meereswelle','mug'],
 headphones:['Kulaklık','Kopfhörer','shirt'],football:['Futbol topu','Fußball','cushion'],coupe:['Klasik araba','Oldtimer','case-redmi13'],compass:['Pusula','Kompass','case-pixel9']
};
for(const [id,[trName,deName]] of Object.entries(EXTRA_MOTIFS)){T.tr['template_'+id]=trName;T.de['template_'+id]=deName;}
const TEMPLATE_IDS=[...Object.keys(EXTRA_MOTIFS),...CORE_TEMPLATES,...PET_TEMPLATES];
const TEMPLATE_PRODUCTS={monogram:'keychain',floral:'mug',nature:'poster',pet:DEFAULT_CASE,cat:'mug',bird:'tote',heart:'giftbox',minimal:'tote',dragon:'hoodie',night:'shirt',...Object.fromEntries(Object.entries(EXTRA_MOTIFS).map(([id,m])=>[id,m[2]]))};
const MOTIF_GROUPS={
 featured:[['Öne çıkanlar','Auswahl'],['phoenix','koi','astronaut','shore','sapphire','wedding','tiger','hummingbird']],
 atelier:[['Göz alıcı baskılar','Ausdrucksstarke Motive'],['phoenix','sapphire','tiger','koi','astronaut','racer','stag','hummingbird']],
 lovers:[['Sevgililer','Verliebte'],['shore','umbrella','foreheads','bicycle']],married:[['Evlilik ve yıl dönümü','Hochzeit und Jahrestag'],['wedding','dance','anniversary','lifetime']],
 all:[['Tümü','Alle'],TEMPLATE_IDS],pets:[['Evcil hayvanlar','Haustiere'],PET_TEMPLATES],
 wildlife:[['Hayvanlar âlemi','Tierwelt'],['butterfly','fox','horse','panda']],garden:[['Çiçekler','Blüten'],['floral','rose','sunflower','lavender','tulip']],
 sky:[['Doğa ve gökyüzü','Natur und Himmel'],['nature','night','alpine','wave','crescent','saturn']],
 hobbies:[['Hobiler','Hobbys'],['headphones','football','coupe','compass']],symbols:[['Simgeler','Symbole'],['monogram','heart','minimal','dragon']]
};
let studioFilter='featured',galleryFilter='all';
const PET_WORDS={pet:'evcil hayvan köpek kopek hund golden retriever haustier',cat:'evcil hayvan kedi tekir katze katzen haustier',bird:'evcil hayvan kuş kus muhabbet kuşu vogel vögel wellensittich haustier'};
const STUDIO_STEPS=[
 {id:'photo',target:'#photoInput',badge:'↑'},
 {id:'text',target:'#textInput',badge:'Aa'},
 {id:'preview',target:'#flip3d',badge:'3D'},
 {id:'png',target:'[data-action="download"]',badge:'PNG'}
];
function themePicture(id, css='') {
 return `<img class="${css}" src="${AS}themes/${id}.webp?v=6" alt="" loading="lazy" decoding="async">`;
}
function productPicture(id, css='') {
 return `<img class="${css}" src="${AS+id}.webp?v=6" alt="" loading="lazy" decoding="async">`;
}
const FONTS={
  serif:{family:'Georgia,serif',weight:'600',label:['Klasik','Klassisch']},
  script:{family:'"EJDER Calligraphy",cursive',weight:'400',label:['Kaligrafi','Kalligrafie'],bundled:true},
  retro:{family:'"EJDER Retro",cursive',weight:'400',label:['Retro','Retro'],bundled:true},
  sans:{family:'Arial,sans-serif',weight:'600',label:['Modern','Modern']},
  typewriter:{family:'"EJDER Typewriter",monospace',weight:'400',label:['Daktilo','Schreibmaschine'],bundled:true},
  posterBold:{family:'"EJDER Poster",sans-serif',weight:'700',label:['Afiş','Plakatschrift'],bundled:true},
  bookBold:{family:'"EJDER Book",serif',weight:'700',label:['Kalın Serif','Kräftige Serifenschrift'],bundled:true},
  hand:{family:'cursive',weight:'italic',label:['El yazısı','Handschrift']}
};
const FINISHES={plain:['Düz renk','Einfarbig'],outline:['Kontur','Kontur'],foil:['Altın varak','Goldfolie']};
const fontLoads=new Map();
function fontSpec(id,size){
  const face=FONTS[id]||FONTS.serif;
  return face.weight+' '+size+'px '+face.family;
}
function loadFace(id){
  if(!FONTS[id]?.bundled)return Promise.resolve(true);
  if(!fontLoads.has(id)){
    const load=document.fonts?.load(fontSpec(id,56),'ŞĞİÜÖÇß');
    fontLoads.set(id,load?load.then(faces=>{if(faces.length)drawStudio();return !!faces.length;},()=>false):Promise.resolve(false));
  }
  return fontLoads.get(id);
}
function letteringReady(design){
  return [...new Set(design.layers.filter(l=>l.type==='text'&&l.text.trim()).map(l=>l.font))].map(loadFace);
}
const ORIGINAL='original';
const COLORS=[ORIGINAL,'#151217','#9b173c','#dcc39b','#f3aec0','#3f4568','#254e5e'];
const COLOR_NAMES=[['Orijinal renk','Originalfarbe'],['Siyah','Schwarz'],['Bordo','Bordeaux'],['Kum','Sand'],['Pembe','Rosa'],['Lacivert','Dunkelblau'],['Petrol','Petrol']];
let language=document.documentElement.lang==='de'?'de':'tr';
let editor=makeEditor('mug');
let mobileOpen=false,searchVal='',noticeTimer=null,dragging=null,undoStack=[],redoStack=[],cachedImages=new Map(), studioCanvas=null;
let activeRoute=window.EJDERPaths.hash()||'#/';
function tr(k){return T[language][k]||T.tr[k]||k}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]))}
function product(id){return PRODUCTS.find(p=>p.id===id)||PRODUCTS[0]}
function name(p){return language==='de'?p.de:p.tr}
function readStore(key,def){try{return localStorage.getItem(key)||def}catch{return def}}
function writeStore(key,s){try{localStorage.setItem(key,s);return true}catch{return false}}
function hash(path){return '#/'+path.replace(/^\/+/, '')}
function currentRoute(){
 const raw=(window.EJDERPaths.hash()||'#/').replace(/^#\/?/,'');
 return raw.split('/').filter(Boolean).map(part=>{try{return decodeURIComponent(part)}catch{return part}});
}
function pageLink(id){return `<a href="${hash(id)}">${escapeHTML(id)}</a>`}
function header(){
 const seg=currentRoute(),section=seg[0]||'home';
 const nav=[['',tr('navHome')],['campaigns',tr('navCampaigns')],['shop',words('Satış Vitrini','Shop')],['products',tr('navProducts')],['studio/'+editor.product,tr('navStudio')],['templates',tr('navTemplates')],['saved',tr('navSaved')],['account',words('Hesabım','Mein Konto')]];
 return `<div class="topline"><div class="max"><span>${tr('topMessage')}</span><span class="top-hide">${tr('topMiddle')}</span><span>${tr('topRight')}</span></div></div>
 <header class="sitehead"><div class="max head-main"><a href="#/" class="brand" aria-label="EJDER Studio"><picture><source media="(prefers-reduced-motion: reduce)" srcset="${AS}ejder_logo.webp"><img src="${AS}ejder_logo_animated.webp" alt="EJDER Studio" width="580" height="258"></picture></a>
 <nav class="mainnav" aria-label="${words('Ana menü','Hauptmenü')}">${nav.map(([url,title])=>`<a href="${hash(url)}" class="${(url.split('/')[0]||'home')===(section==='cases'?'products':section)?'active':''}">${title}</a>`).join('')}</nav>
 <div class="head-actions"><div class="searchbar"><label class="sr-only" for="headerSearch">${tr('search')}</label><input id="headerSearch" data-bind="search" type="search" placeholder="${tr('search')}" value="${escapeHTML(searchVal)}" autocomplete="off"><div id="searchResults" class="search-results" hidden></div></div>
 <div class="language" aria-label="${tr('language')}"><button data-lang="tr" class="${language==='tr'?'active':''}" aria-pressed="${language==='tr'}" lang="tr">TR</button><button data-lang="de" class="${language==='de'?'active':''}" aria-pressed="${language==='de'}" lang="de">DE</button></div><button class="icon-btn menu-btn" data-action="menu" aria-label="${tr('menu')}" aria-controls="mobileNav" aria-expanded="${mobileOpen}">☰</button></div></div>
 <nav class="mobilemenu ${mobileOpen?'open':''}" id="mobileNav" aria-label="${words('Mobil menü','Mobiles Menü')}"><div class="mobile-search searchbar"><label class="sr-only" for="mobileSearch">${tr('search')}</label><input id="mobileSearch" data-bind="search" type="search" placeholder="${tr('search')}" autocomplete="off"><div id="mobileResults" class="search-results" hidden></div></div>${nav.map(([url,title])=>`<a href="${hash(url)}">${title}</a>`).join('')}<a href="${hash('about')}">${tr('navAbout')}</a><a href="${hash('contact')}">${tr('navContact')}</a><button class="dock-preference" type="button" data-dock-preference aria-controls="quickDock">${dockPreferenceLabel()}</button></nav></header>`;
}
function dockPreferenceLabel(){
  return document.body.classList.contains('dock-folded')?words('Kısayolları göster','Schnellzugriff anzeigen'):words('Kısayolları küçült','Schnellzugriff einklappen');
}
function footer(){
 const groups=[
   [tr('navProducts'),COLLECTIONS.map(c=>['collection/'+c.id,name(c)])],
   [tr('navStudio'),[['studio/'+editor.product,tr('designStart')],['templates',tr('navTemplates')],['saved',tr('navSaved')]]],
   [words('Bilgi ve destek','Info und Hilfe'),[['shop',words('Satış Vitrini','Shop')],['cart',words('Sepet','Warenkorb')],['shop-privacy',words('Vitrin gizliliği','Shop-Datenschutz')],['account',words('Hesabım','Mein Konto')],['payments',words('Ödeme seçenekleri','Zahlungsarten')],['about',tr('navAbout')],['contact',tr('navContact')],['privacy',tr('privacy')],['legal',tr('legal')]]]
 ];
 return `<footer class="foot"><div class="max foot-inner">
   <div class="foot-brand"><a href="#/" aria-label="${words('EJDER Studio ana sayfa','EJDER Studio Startseite')}"><img src="${AS}ejder_logo.webp" width="580" height="258" alt="EJDER Studio" loading="lazy"></a><p>${tr('footerCopy')}</p><p><a class="btn secondary" href="netlestir.html">${words('Ekran kaydı · Snapshot · PNG','Aufnahme · Snapshot · PNG')}</a></p></div>
   <div class="foot-links">${groups.map(([heading,links],i)=>`<nav aria-labelledby="footGroup${i}"><h3 id="footGroup${i}">${heading}</h3><ul>${links.map(([path,label])=>`<li><a href="${hash(path)}">${escapeHTML(label)}</a></li>`).join('')}</ul></nav>`).join('')}</div>
   <div class="foot-end"><span>© 2026 EJDER Studio</span><span>${tr('footerReminder')}</span></div>
 </div></footer>`;
}
function categoryCard(p){return `<a href="${productLink(p.id)}" class="card category-card"><div class="category-picture"><img loading="lazy" src="${AS+p.id}.webp?v=6" alt="${escapeHTML(name(p))}"></div><div class="card-body"><div><h3>${escapeHTML(name(p))}</h3><small>${escapeHTML(language==='de'?p.shortDe:p.shortTr)}</small></div><span class="circle-arrow" aria-hidden="true">↗</span></div></a>`}
function categoryGrid(list=CATEGORIES){return `<div class="category-grid">${list.map(categoryCard).join('')}</div>`}
function steps(){
 const copy=[
  [words('Ürün Seç','Produkt wählen'),words('Kişiselleştirmek istediğin ürünü seç.','Wähle das Produkt, das du personalisieren möchtest.')],
  [words('Kendin Tasarla','Selbst gestalten'),words('Fotoğrafını, yazını ve renklerini ekle.','Füge dein Foto, deinen Text und deine Farben hinzu.')],
  [words('Önizle & Kaydet','Vorschau & Speichern'),words('Tasarımını incele ve PNG olarak indir.','Prüfe dein Design und lade es als PNG herunter.')]
 ];
 return `<ol class="steps visual-steps" role="list" aria-label="${tr('how')}">${copy.map(([title,description],i)=>`<li class="card step visual-step"><div class="guide-art guide-art-${i+1}" aria-hidden="true"><img src="${AS}guide-steps-v730.png" width="1920" height="819" alt="" loading="lazy" decoding="async" draggable="false"></div><div class="guide-copy"><h3>${title}</h3><p>${description}</p></div></li>`).join('')}</ol>`;
}
function themeCover(id){return `<img src="${AS}previews/${id}.webp?v=6" width="480" height="332" alt="" loading="lazy" decoding="async">`;}
function templateCard(id){return `<button type="button" data-template-go="${id}" class="card template-show"><span class="template-image">${themeCover(id)}</span><span class="template-copy"><strong>${tr('template_'+id)}</strong><small>${tr('designStart')}</small></span></button>`;}
function motifPicker(mode){
  const studio=mode==='studio',filter=studio?studioFilter:galleryFilter,ids=MOTIF_GROUPS[filter][1];
  const tabs=Object.entries(MOTIF_GROUPS).filter(([key])=>studio||key!=='featured').map(([key,[label,items]])=>`<button class="motif-tab" type="button" data-motif-filter="${key}" aria-pressed="${key===filter}">${words(...label)} <small>${items.length}</small></button>`).join('');
  return `<div class="motif-picker" data-motif-picker="${mode}"><div class="motif-tabs" role="group" aria-label="${words('Görsel kategorileri','Motivkategorien')}">${tabs}</div><div class="${studio?'editor-templates':'template-gallery'}">${ids.map(studio?editorTemplateButton:templateCard).join('')}</div></div>`;
}
function templateGrid(){return motifPicker('gallery');}
function templateHighlights(){return `<div class="template-gallery">${['phoenix','shore','koi','wedding','astronaut','rose'].map(templateCard).join('')}</div><div class="gallery-link"><a class="btn secondary" href="${hash('templates')}">${words('42 görselin tümünü keşfet','Alle 42 Motive entdecken')}</a></div>`;}

function editorTemplateButton(id){
  const active=editor.themeApplied&&editor.template===id;
  return `<button type="button" data-template="${id}" class="template-btn ${active?'active':''}" aria-pressed="${active}">${themePicture(id)}${tr('template_'+id)}</button>`;
}
function promotions(onHome=false){
 const items=[['keychain','monogram',words('Monogram','Monogramm'),'keychain'],['poster','heart',words('Fotoğraf','Fotografie'),'poster'],['giftbox','',words('Hediye kutusu','Geschenkbox'),'giftbox']];
 return `<div class="promo-grid">${items.map(([image,theme,label,target],i)=>{
   const gift=onHome&&i===2;
   return `<article class="card promo"><div class="promo-image">${productPicture(image)}</div><div class="promo-copy"><span class="eyebrow">${label}</span><h3>${tr('campaign'+(i+1))}</h3><p>${tr('campaign'+(i+1)+'s')}</p><a class="btn secondary tiny" ${gift?'data-gift-link':''} ${theme?`data-promo-theme="${theme}"`:''} href="${gift?'#gift-demo':hash('studio/'+target)}">${gift?tr('giftOpen'):tr('designStart')}</a></div></article>`;
 }).join('')}</div>`;
}
function home(){return `<main><div class="max"><section class="home-showcase" aria-labelledby="showcase-title"><div class="home-showcase-heading"><div class="eyebrow">${words('KİŞİYE ÖZEL TASARIM ATÖLYESİ','DEIN ATELIER FÜR PERSÖNLICHE DESIGNS')}</div><h1 id="showcase-title"><span>${words('Hayal Et.','Deine Idee.')}</span><span>${words('Kendine Özel Tasarla.','Dein persönliches Design.')}</span></h1><p>${words('Fotoğrafını, yazını ve renklerini seç; tasarımını anında gör.','Wähle Foto, Text und Farben – sieh dein Design sofort.')}</p></div><div class="home-showcase-art"><picture><source media="(min-width:901px)" srcset="${AS}banner-wide-v731.svg"><img src="${AS}hero-gift-showcase.webp?v=7.25" width="2172" height="724" fetchpriority="high" alt="${words('Tamamı görünen açık bordo EJDER Studio hediye kutusu; yanında kişiye özel tişört, hoodie, telefon kılıfı, kupa, anahtarlık, yastık ve poster tasarımları.','Vollständig sichtbare offene bordeauxrote EJDER Studio Geschenkbox mit personalisierten T-Shirt-, Hoodie-, Handyhüllen-, Tassen-, Schlüsselanhänger-, Kissen- und Posterdesigns.')}"></picture></div><div class="home-showcase-actions"><a class="btn" href="${hash('studio/mug')}">${words('Tasarımına Başla','Jetzt gestalten')}</a><a class="home-showcase-discover" href="${hash('products')}">${words('Ürünleri Keşfet','Produkte entdecken')} <span aria-hidden="true">→</span></a></div><div class="home-showcase-steps" aria-label="${words('Tasarım adımları','Designschritte')}"><span>${words('Ürününü seç','Produkt wählen')}</span><span>${words('Kişiselleştir','Personalisieren')}</span><span>${words('Ön izle ve kaydet','Vorschau und speichern')}</span></div></section>
 <div class="features">${STUDIO_STEPS.map((step,i)=>`<a class="feature" href="${hash('studio/mug/'+step.id)}"><span class="feature-shot"><img src="${AS}previews/step-${step.id}.webp?v=6" width="300" height="210" alt="" loading="lazy"><b aria-hidden="true">${step.badge}</b></span><span>${tr('feature'+(i+1))}</span></a>`).join('')}</div>
 ${stage3d(null,'home-stage')}
 <section class="section"><div class="eyebrow">${tr('categoriesKick')}</div><h2 class="section-title">${tr('categoriesTitle')}</h2><p class="muted">${tr('categoriesText')}</p>${categoryGrid()}</section>
 <section class="section" id="campaigns"><div class="eyebrow">EJDER STUDIO</div><h2 class="section-title">${tr('campaigns')}</h2>${promotions(true)}<div class="disclaimer">${tr('campaignNote')}</div></section>
 <section class="section"><h2 class="section-title">${tr('how')}</h2>${steps()}</section>
 <section class="gift-demo card" id="gift-demo"><div><span class="eyebrow">${words('EJDER HEDİYE ATÖLYESİ','EJDER GESCHENKATELIER')}</span><h2>${tr('giftHead')}</h2><p>${tr('giftDesc')}</p><button class="btn" data-action="gift-toggle" aria-expanded="false">${tr('giftOpen')}</button></div><div class="gift-stage photo3d" aria-label="${tr('giftPreview')}"><div class="gift-glow"></div><div class="gift-scene"><div class="gift-card gift-box-card"><img src="${AS}giftbox.webp" alt="${escapeHTML(name(product('giftbox')))}" width="480" height="332" draggable="false"></div>${['mug','keychain','case'].map((id,k)=>`<div class="gift-card gift-item" style="--k:${k}" aria-hidden="true"><img src="${AS+id}.webp?v=6" alt="" width="480" height="332" draggable="false"></div>`).join('')}</div></div></section>
 <section class="section"><div class="eyebrow">${words('EJDER TASARIM KOLEKSİYONU','EJDER DESIGNKOLLEKTION')}</div><h2 class="section-title">${tr('allTemplates')}</h2><p class="muted">${tr('allTemplatesText')}</p>${templateHighlights()}</section></div></main>`}
/* ---------- 3D layer: only REAL content (product photos, logo, the customer's own design) ---------- */
let flipY=0,flipDrag=null;
/* 3D showcase made from the site's real product photographs (showcase3d.js).
   Photos are shown exactly as they are – no placeholders, no stretching, no filters. */
function stage3d(products,extraClass=''){
  const list=(Array.isArray(products)&&products.length?products:CATEGORIES.map(p=>p.id)).filter(id=>PRODUCTS.some(p=>p.id===id));
  const many=list.length>3,first=product(list[0]);
  return `<section class="stage3d card ${extraClass}" aria-label="${words('Ürün fotoğraf galerisi','Produktfotogalerie')}">
    <div class="stage3d-view"><div class="ring-scene" id="ringScene">
      <div class="ring-floor" aria-hidden="true"></div>
      ${list.length>1?`<div class="stage3d-nav"><button type="button" data-ring="-1" aria-label="${words('Önceki ürün','Vorheriges Produkt')}">‹</button><button type="button" data-ring="1" aria-label="${words('Sonraki ürün','Nächstes Produkt')}">›</button></div>`:''}
      <div class="ring">${list.map((id,i)=>{const p=product(id);return `<a class="ring-card" data-product="${id}" style="--i:${i}" href="${productLink(id)}" aria-label="${escapeHTML(name(p))} – ${escapeHTML(tr('design'))}"><span class="ring-face"><img src="${AS+id}.webp?v=6" alt="${escapeHTML(name(p))}" width="480" height="332" draggable="false"></span><span class="ring-back" aria-hidden="true"><img src="${AS}ejder_logo.webp" alt="" width="580" height="258" draggable="false"></span></a>`}).join('')}</div>
    </div></div>
    <div class="stage3d-caption"><span class="eyebrow">EJDER · ${words('FOTOĞRAF GALERİSİ','FOTOGALERIE')}</span><b id="stageFront">${escapeHTML(name(first))}</b>
      <p id="stageText">${escapeHTML(language==='de'?first.shortDe:first.shortTr)}</p>
      <a class="btn tiny" id="stageGo" href="${productLink(first.id)}">${tr('design')} ↗</a>
      <small>${many?words('Sürükle veya oklarla döndür · Ürüne tıkla: tasarla','Ziehen oder Pfeile zum Drehen · Produkt anklicken: gestalten'):words('Fareyle 3D eğ · Ürüne tıkla: tasarla','Mit der Maus neigen · Produkt anklicken: gestalten')}</small></div>
  </section>`;
}
function mountShowcase(){
  const rs=document.getElementById('ringScene');
  if(!rs||!window.EJDERRing)return;
  window.EJDERRing.mount(rs,{onFront:id=>{
    if(!id)return;const p=product(id);
    const b=document.getElementById('stageFront'),t=document.getElementById('stageText'),a=document.getElementById('stageGo');
    if(b)b.textContent=name(p);if(t)t.textContent=language==='de'?p.shortDe:p.shortTr;if(a)a.href=productLink(id);
  }});
}
/* studio: the live 2D preview and the real product photo on the two sides of a 3D card */
function flipBack(){return Math.abs(Math.round(flipY/180))%2===1;}
function applyFlip(){
  const el=document.getElementById('flip3d');if(!el)return;
  el.style.setProperty('--fy',flipY.toFixed(1)+'deg');
  const btn=document.querySelector('[data-flip]');
  if(btn&&!flipDrag){const back=flipBack();btn.textContent=back?words('↻ Tasarımını gör','↻ Dein Design ansehen'):words('↻ Katalog örneğini gör','↻ Katalogbeispiel ansehen');btn.setAttribute('aria-pressed',String(back));}
}

function caseGallery(){
  return `<section class="section case-gallery"><div class="eyebrow">EJDER STUDIO</div><h2 class="section-title">${words('Telefon kılıfları','Handyhüllen')}</h2><p class="muted">${words('Telefon modelini seç. Kılıf rengini ve baskını tasarım alanında belirle.','Wähle dein Handymodell. Farbe und Motiv legst du im Studio fest.')}</p>${categoryGrid(CASE_MODELS)}</section>`;
}
function casesPage(){return `<main class="max"><div class="pagehead"><div class="eyebrow">EJDER STUDIO</div><h1>${words('Telefon kılıfları','Handyhüllen')}</h1><p>${words('Her kart bir telefon modeli. Modelini aç, rengini seç ve kendi tasarımını ekle.','Jede Karte zeigt ein Handymodell. Öffne dein Modell, wähle eine Farbe und ergänze dein Motiv.')}</p></div>${categoryGrid(CASE_MODELS)}</main>`;}
function productsPage(){return `<main class="max"><div class="pagehead"><div class="eyebrow">${words('EJDER ÜRÜNLERİ','EJDER PRODUKTE')}</div><h1>${tr('productChoice')}</h1><p>${tr('categoriesText')}</p></div>${stage3d()}${categoryGrid(CATEGORIES.filter(p=>p.id!=='case'))}${caseGallery()}<div class="section"><h2 class="section-title">${tr('how')}</h2>${steps()}</div></main>`}
function collectionsPage(id){const c=COLLECTIONS.find(x=>x.id===id)||COLLECTIONS[0]; const [p1,p2]=c.product.map(product);return `<main class="max"><section class="collection-head"><div><div class="eyebrow">${words('EJDER TASARIM ATÖLYESİ','EJDER DESIGNATELIER')}</div><h1>${language==='de'?c.de:c.tr}</h1><p>${tr('collectionDesc')}</p><a href="${productLink(p1.id)}" class="btn tiny">${tr('start')} ↗</a></div><div class="collection-pair" aria-hidden="true">${productPicture(p1.id)}${productPicture(p2.id)}</div></section>${stage3d(c.product)}<div class="duo-grid">${[p1,p2].map(p=>`<article class="card duo-card"><div class="duo-visual"><img src="${AS+p.id}.webp?v=6" alt="${escapeHTML(name(p))}"></div><div class="duo-text"><div><h2>${escapeHTML(name(p))}</h2><p>${escapeHTML(language==='de'?p.shortDe:p.shortTr)}</p></div><a class="btn" href="${productLink(p.id)}">${tr('designStart')} ↗</a></div></article>`).join('')}</div><div class="section"><h2 class="section-title">${tr('templateTitle')}</h2>${templateHighlights()}</div></main>`}
function campaignsPage(){return `<main class="max"><div class="pagehead"><span class="eyebrow">${words('EJDER İLHAM SERİSİ','EJDER INSPIRATION')}</span><h1>${tr('campaigns')}</h1><p>${tr('campaignNote')}</p></div>${stage3d(['mug','keychain','giftbox'])}${promotions()}<div class="section">${categoryGrid()}</div></main>`}
function templatesPage(){return `<main class="max"><div class="pagehead"><div class="eyebrow">${words('EJDER ŞABLON KOLEKSİYONU','EJDER VORLAGENKOLLEKTION')}</div><h1>${tr('allTemplates')}</h1><p>${tr('allTemplatesText')}</p></div>${stage3d()}${templateGrid()}<div class="section"><h2 class="section-title">${tr('productChoice')}</h2>${categoryGrid()}</div></main>`}
function savedPage(){const items=getSaved();return `<main class="max"><div class="pagehead"><div class="eyebrow">${words('KİŞİSEL GALERİ','PERSÖNLICHE GALERIE')}</div><h1>${tr('savedHead')}</h1><p>${tr('savedDesc')}</p></div>${stage3d(items.length?[...new Set(items.map(it=>it.product))]:null)}${items.length?`<div class="saved-grid">${items.map(it=>`<article class="card saved-item"><img src="${AS+it.product}.webp?v=6" alt="${escapeHTML(name(product(it.product)))}"><canvas hidden width="450" height="325" data-saved-preview="${escapeHTML(it.id)}" aria-label="${escapeHTML(name(product(it.product)))}"></canvas><h3>${escapeHTML(name(product(it.product)))}</h3><div class="muted small">${tr('date')}: ${escapeHTML(new Date(it.date).toLocaleDateString(language==='de'?'de-DE':'tr-TR'))}</div><div class="actions"><button class="btn tiny" data-open-project="${escapeHTML(it.id)}">${tr('open')}</button><button class="btn danger tiny" data-delete-project="${escapeHTML(it.id)}">${tr('delete')}</button></div></article>`).join('')}</div>`:`<div class="text-panel card"><p>${tr('noSaved')}</p><a class="btn" href="${hash('studio/mug')}">${tr('start')}</a></div>`}</main>`}
function infoPage(type){
 if(type==='privacy'){
   return `<main class="max"><div class="pagehead"><div class="eyebrow">EJDER STUDIO</div><h1>${tr('privacy')}</h1></div>${stage3d(['poster'])}<article class="text-panel card"><h2>${words('Cihazındaki fotoğraflar','Fotos auf deinem Gerät')}</h2><p>${words('Fotoğraflar bu cihazda küçültülür. Stüdyodan çıkınca, kaydedince, PNG indirince veya işlemi bitirince geçici kopyalar temizlenir.','Deine Fotos werden auf diesem Gerät verkleinert. Beim Verlassen des Studios, Speichern, PNG-Download oder Beenden werden die temporären Kopien entfernt.')}</p><h2>${words('Kaydedilen tasarımlar','Gespeicherte Entwürfe')}</h2><p>${words('Tarayıcı dil tercihini, seçtiğin ürünü, şablonu, renkleri ve yazıları saklayabilir. Yüklediğin fotoğraflar kaydedilen tasarıma dahil edilmez.','Der Browser kann deine Sprache, das Produkt, die Vorlage, die Farben und Texte speichern. Eigene Fotos werden nicht im gespeicherten Entwurf abgelegt.')}</p><h2>${words('Asistan ve WhatsApp','Assistent und WhatsApp')}</h2><p>${words('Asistanın yazışmaları yalnızca açık oturumda tutulur. WhatsApp düğmesi seni WhatsApp’a yönlendirir. Fotoğrafların ve asistan konuşman bu bağlantıya eklenmez.','Der Assistent behält den Chat nur in der laufenden Sitzung. Die WhatsApp-Schaltfläche öffnet WhatsApp. Fotos und Chatverlauf werden dabei nicht übertragen.')}</p><h2>${words('Sesli asistan','Sprachassistent')}</h2><p>${words('Asistan, sorunu ve son birkaç mesajı yanıt üretmek için Supabase üzerinden Groq hizmetine gönderir. Sesli konuşmayı kendin açıp mikrofon izni verdiğinde, konuşma parçaları da metne çevrilmek için gönderilir. Sesli sorular ekranda veya yazılı sohbet geçmişinde gösterilmez. EJDER ses dosyalarını veya konuşma dökümlerini veritabanına kaydetmez; konuşma belleği oturum kapanınca temizlenir. Kötüye kullanımı sınırlamak için kısa süreli, adresi açıkça göstermeyen kullanım sayaçları tutulur. Sesli okuma tarayıcının ses hizmetini kullanır; seçilen ses çevrimiçi işlenebilir. Fotoğrafların bu hizmetlere gönderilmez.','Der Assistent sendet deine Frage und wenige vorherige Nachrichten über Supabase an Groq, um eine Antwort zu erstellen. Wenn du den Sprachchat selbst startest und das Mikrofon erlaubst, werden außerdem Sprachabschnitte transkribiert. Gesprochene Fragen erscheinen weder auf dem Bildschirm noch im Textchat. EJDER speichert keine Audiodateien oder Transkripte in einer Datenbank; der Chat im Arbeitsspeicher wird nach dem Schließen der Sitzung gelöscht. Kurzlebige Nutzungszähler ohne Klartext-Adresse begrenzen Missbrauch. Das Vorlesen nutzt den Sprachdienst deines Browsers; die gewählte Stimme kann online verarbeitet werden. Deine Fotos werden nicht an diese Dienste gesendet.')}</p><h2>${words('Google ile hesap girişi','Google-Kontoanmeldung')}</h2><p>${words('Giriş hizmeti etkinleştirildiğinde, yalnızca sen başlattığında Google’a yönlendirilirsin. Temel profilin ve doğrulanmış e-postan, en fazla iki saatlik güvenli oturum için kullanılır; Google şifren alınmaz. Hesap girişi tasarım fotoğraflarını yüklemez ve bu tasarımları başka cihazlara taşımaz.','Sobald die Anmeldung freigeschaltet ist, wirst du nur auf eigenen Wunsch zu Google weitergeleitet. Basisprofil und bestätigte E-Mail werden für eine sichere Sitzung von höchstens zwei Stunden verwendet. Dein Google-Passwort wird nicht erfasst. Die Kontoanmeldung lädt keine Designfotos hoch und synchronisiert keine Entwürfe auf andere Geräte.')}</p></article></main>`;
 }
 const title=tr(type==='about'?'aboutTitle':type==='legal'?'legal':'contactTitle');
 const msg=tr(type==='about'?'aboutP':type==='legal'?'legalP':'contactP');
 return `<main class="max"><div class="pagehead"><div class="eyebrow">EJDER STUDIO</div><h1>${title}</h1></div>${stage3d(type==='contact'?['giftbox']:type==='legal'?['poster']:null)}<div class="text-panel card"><p>${type==='contact'?words('EJDER Studio hakkında bir sorun varsa asistanı açabilir veya WhatsApp üzerinden yazabilirsin.','Bei Fragen zu EJDER Studio kannst du den Assistenten öffnen oder uns per WhatsApp schreiben.'):msg}</p>${type==='contact'?`<div class="contact-actions"><button class="btn secondary" data-support-open>${words('Asistanı aç','Assistent öffnen')}</button><a class="btn" data-wa-link target="_blank" rel="noopener noreferrer" href="${window.EJDERHelp.whatsapp(language)}">WhatsApp</a></div>`:type==='about'?`<div class="steps">${[1,2,3].map(n=>`<div class="card step"><span class="stepnum">${n}</span><div><h3>${tr('aboutCard'+n)}</h3><p>${tr('aboutCard'+n+'p')}</p></div></div>`).join('')}</div>`:''}</div></main>`;
}
/* ------------------------------------------------------------
   EJDER Studio keeps design editing on the visitor's device.
   User photographs never leave the browser and are NEVER saved.
   ------------------------------------------------------------ */
const STORE_KEY = 'ejder_designs_v1';
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_SIDE = 4096;
const TARGET_IMAGE_BYTES = 2 * 1024 * 1024;
const pendingPhotos=new Set();
let imageTicket = 0, selectedBounds = [], pendingTemplate = null;
let editorRoute = null;

function words(a, b) { return language === 'de' ? b : a; }
function defaultFillMode(id){return id==='keychain'?'smart':['shirt','hoodie','tote'].includes(id)?'contain':'cover';}
function makeEditor(id) {
  return {
    product: PRODUCTS.some(p => p.id === id) ? id : 'mug',
    side:'front',faces:{back:{fillMode:defaultFillMode(id),focusX:.5,focusY:.5,printBackground:id==='keychain'?'photo':'transparent',printBackgroundColor:'#ffffff',template:'monogram',themeApplied:false,layers:[],selected:null}},mugSides:'single', template: 'monogram', themeApplied:false, productColor: ORIGINAL, layers: [], selected: null,
    fillMode:defaultFillMode(id),focusX:.5,focusY:.5,printBackground:id==='keychain'?'photo':'transparent',printBackgroundColor:'#ffffff',
    tool: 'text', projectId: null, boxOpen: false, surfaceVersion:4, fontChoice:'serif', finishChoice:'plain'
  };
}
function hasBack(design=editor){return !design.product.startsWith('case');}
function captureFace(design){return {fillMode:design.fillMode,focusX:design.focusX,focusY:design.focusY,printBackground:design.printBackground||'transparent',printBackgroundColor:design.printBackgroundColor||'#ffffff',template:design.template,themeApplied:!!design.themeApplied,layers:design.layers.map(l=>({...l})),selected:design.selected};}
function stashFace(design=editor){design.faces||={};design.faces[design.side||'front']=captureFace(design);}
function faceDesign(side,design=editor){const face=side===(design.side||'front')?captureFace(design):design.faces?.[side];
  return {...design,...(face||{template:'monogram',themeApplied:false,layers:[],selected:null}),side};}
function faceHasContent(design){return design.themeApplied||design.layers.some(l=>l.type==='image'||l.text?.trim());}
function selectFace(side){
  if(side!=='front'&&side!=='back'||side==='back'&&!hasBack()||side===editor.side)return;
  if(pendingPhotos.size){notify(words('Fotoğraf hazırlanırken yüz değiştirme. Birazdan tekrar dene.','Bitte warte kurz, bis das Foto vorbereitet ist.'));return;}
  rememberUndo();stashFace();const next=faceDesign(side);Object.assign(editor,captureFace(next),{side});inputUndoState=null;dragging=null;refreshStudio();atelier?.face(side);
}
function faceControls(){return hasBack()?`<div class="face-controls" role="group" aria-label="${words('Tasarım yüzü','Designseite')}"><button type="button" class="btn secondary tiny" data-design-side="front" aria-pressed="${editor.side==='front'}">${words('Ön yüzü tasarla','Vorderseite gestalten')}</button><button type="button" class="btn secondary tiny" data-design-side="back" aria-pressed="${editor.side==='back'}">${words('Arka yüzü tasarla','Rückseite gestalten')}</button></div><p class="face-note">${words('Ön ve arka yüzün yazı, fotoğraf ve motifleri ayrıdır.','Text, Foto und Motiv sind für jede Seite unabhängig.')}</p>`:`<p class="face-note">${words('Telefon kılıfı · Tek tasarım yüzü','Handyhülle · Eine Designseite')}</p>`;}
function getSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(x => x && typeof x.id === 'string' && PRODUCTS.some(p => p.id === x.product)).slice(0, 20) : [];
  } catch { return []; }
}
function putSaved(items) {
  return writeStore(STORE_KEY, JSON.stringify(items.slice(0,20)));
}
function newId() { return 'e' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); }
function textLayer(text = '') {

  return {id:newId(),type:'text',text:String(text).slice(0,80),font:editor.fontChoice,finish:editor.finishChoice,color:defaultInk(editor),autoColor:true,size:editor.product.startsWith('case')?60:56,angle:0,x:.5,y:.5,autoPosition:true};
}
function addText(text = '') {
  const empty=editor.layers.find(l=>l.type==='text'&&!l.text.trim());
  if(empty){editor.selected=empty.id;updateControlValues();drawStudio();return;}
  if(editor.layers.filter(l=>l.type==='text').length>=15){notify(words('En fazla 15 yazı katmanı eklenebilir.','Maximal 15 Textebenen sind möglich.'));return;}
  rememberUndo();
  const l = textLayer(text);
  editor.layers.push(l); editor.selected=l.id; editor.tool='text';
  refreshStudio();
}
function applyTemplate(id, redraw=true) {
  if (!TEMPLATE_IDS.includes(id)) id='monogram';
  rememberUndo();
  editor.template=id;
  editor.themeApplied=true;
  editor.tool='text';
  if(redraw)refreshStudio();
}
function snapshotUndo() {
  stashFace();return JSON.stringify({side:editor.side,faces:editor.faces,product:editor.product,mugSides:editor.mugSides,template:editor.template,themeApplied:editor.themeApplied,productColor:editor.productColor,layers:editor.layers,selected:editor.selected,fillMode:editor.fillMode,focusX:editor.focusX,focusY:editor.focusY,printBackground:editor.printBackground,printBackgroundColor:editor.printBackgroundColor});
}
function rememberUndo() { undoStack.push(snapshotUndo()); if (undoStack.length>22) undoStack.shift(); redoStack.length=0; }
function restoreUndo(raw) {
  try { const state=JSON.parse(raw); if (state.product!==editor.product) return;
    editor.fillMode=state.fillMode||'contain';editor.focusX=state.focusX??.5;editor.focusY=state.focusY??.5;
    editor.printBackground=state.printBackground||'transparent';editor.printBackgroundColor=state.printBackgroundColor||'#ffffff';
    editor.side=hasBack()&&state.side==='back'?'back':'front';editor.faces=state.faces||{};for(const face of Object.values(editor.faces))face.layers=face.layers.filter(l=>l.type!=='image'||cachedImages.has(l.key));
    editor.mugSides=state.mugSides==='double'?'double':'single';editor.template=state.template;editor.themeApplied=!!state.themeApplied;editor.productColor=state.productColor;
    editor.layers=state.layers.filter(l=>l.type!=='image' || cachedImages.has(l.key));
    editor.selected=editor.layers.some(l=>l.id===state.selected)?state.selected:null;
    refreshStudio();atelier?.face(editor.side);
  } catch { /* bad history is ignored */ }
}
function selectedLayer() {return editor.layers.find(l=>l.id===editor.selected) || null;}
function temporaryImagesCount(){return cachedImages.size;}
function totalTemporaryKB(){let n=0;for(const p of cachedImages.values()) n+=(p.bytes||0)+(p.cutoutBytes||0);return Math.round(n/1024);}
function disposeTemporaryPhotos(updateUI=true) {
  if(cachedImages.size)atelier?.wipe();
  imageTicket++;pendingPhotos.clear();window.EJDERPhotoLayout?.stop(); // cancel pending decodes from the previous editing session
  for (const photo of cachedImages.values()) {
    if(photo.url) URL.revokeObjectURL(photo.url);
    photo.img.onload=null;
    photo.img.onerror=null;
    photo.img.removeAttribute('src');if(photo.cutoutURL)URL.revokeObjectURL(photo.cutoutURL);photo.cutout?.removeAttribute('src');
  }
  if(cachedImages.size){
    for(const canvas of [studioCanvas,document.getElementById('studioPreview')]){
      if(canvas)canvas.getContext('2d')?.clearRect(0,0,canvas.width,canvas.height);
    }
  }
  cachedImages.clear();
  for(const face of Object.values(editor.faces||{})){face.layers=face.layers.filter(l=>l.type!=='image');if(!face.layers.some(l=>l.id===face.selected))face.selected=null;}
  editor.layers=editor.layers.filter(l=>l.type!=='image');
  if(!editor.layers.some(l=>l.id===editor.selected)) editor.selected=null;
  undoStack=[];redoStack=[];
  const input=document.getElementById('photoInput');if(input)input.value='';
  if(updateUI)refreshStudio();else{studioCanvas=null;selectedBounds=[];dragging=null;}
}
function storedTextLayers(layers){return (Array.isArray(layers)?layers:[]).filter(l=>l&&l.type==='text'&&String(l.text||'').trim()).slice(0,15).map(l=>({
      id:String(l.id),type:'text',text:String(l.text||'').slice(0,80),autoPosition:l.autoPosition===true,autoColor:l.autoColor===true,
      font:Object.hasOwn(FONTS,l.font)?l.font:'serif',finish:Object.hasOwn(FINISHES,l.finish)?l.finish:'plain',
      color:/^#[a-f\d]{6}$/i.test(l.color)?l.color:'#e8b974',
      size:Math.min(130,Math.max(22,Number(l.size)||60)),
      angle:Math.min(180,Math.max(-180,Number(l.angle)||0)),
      x:Math.min(1,Math.max(0,Number.isFinite(+l.x)?+l.x:.5)), y:Math.min(1,Math.max(0,Number.isFinite(+l.y)?+l.y:.5))
    }));}
function storedFace(design){return {fillMode:design.fillMode,focusX:design.focusX,focusY:design.focusY,printBackground:design.printBackground||'transparent',printBackgroundColor:design.printBackgroundColor||'#ffffff',template:design.template,themeApplied:!!design.themeApplied,layers:storedTextLayers(design.layers)};}
function cleanProjectForStorage(){
  const front=faceDesign('front'),back=faceDesign('back');
  return {id:editor.projectId||newId(),product:editor.product,mugSides:hasBack()&&faceHasContent(back)?'double':'single',surfaceVersion:editor.surfaceVersion,colorVersion:2,
    ...storedFace(front),faces:hasBack()?{back:storedFace(back)}:{},productColor:validProductColor(editor.productColor),snapshot:AS+editor.product+'.webp',date:new Date().toISOString()};
}
function notify(message){
  document.querySelector('.toast')?.remove();
  const n=document.createElement('div');n.className='toast';n.setAttribute('role','status');
  n.textContent=message;document.body.appendChild(n);
  clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>n.remove(),4200);
}
function validProductColor(value){return /^#[a-f0-9]{6}$/i.test(value)?value.toLowerCase():ORIGINAL;}
function defaultInk(design){
  let dark=['case','hoodie','keychain','giftbox'].includes(design.product);
  if(design.productColor!==ORIGINAL){
    const rgb=parseInt(design.productColor.slice(1),16);
    dark=((rgb>>16)*.2126+((rgb>>8)&255)*.7152+(rgb&255)*.0722)<142;
  }
  return dark?'#fff0cc':'#56182c';
}
function colorName(c){const i=COLORS.indexOf(c);return i<0?c.toUpperCase():words(...COLOR_NAMES[i]);}
function productPalette(){
  const value=editor.productColor;
  return `<fieldset class="product-palette"><legend>${tr('productColor')} · <span id="activeProductColor">${colorName(value)}</span></legend><div class="palette" role="group" aria-label="${tr('productColor')}">${COLORS.map(c=>`<button type="button" class="colorbtn ${c===ORIGINAL?'stock-swatch':''}" data-color="${c}" ${c===ORIGINAL?'':`style="--swatch:${c}"`} title="${colorName(c)}" aria-label="${colorName(c)}" aria-pressed="${c===value}"></button>`).join('')}<label class="custom-swatch"><input type="color" id="customProductColor" value="${value===ORIGINAL?'#faf0dc':value}"><span>${words('Özel renk','Eigene Farbe')}</span></label></div></fieldset>`;
}
function changeProductColor(value){
  editor.productColor=validProductColor(value);
  for(const layers of [editor.layers,...Object.values(editor.faces||{}).map(f=>f.layers)])for(const l of layers)if(l.type==='text'&&l.autoColor)l.color=defaultInk(editor);
  for(const swatch of ROOT.querySelectorAll('[data-color]'))swatch.setAttribute('aria-pressed',String(swatch.dataset.color===editor.productColor));
  document.getElementById('activeProductColor').textContent=colorName(editor.productColor);
  document.getElementById('customProductColor').value=editor.productColor===ORIGINAL?'#faf0dc':editor.productColor;
  updateControlValues();drawStudio();
}
function productOptions(){
  const option=p=>`<option value="${p.id}" ${p.id===editor.product?'selected':''}>${escapeHTML(name(p))}</option>`;
  return `<optgroup label="${words('Telefon kılıfları','Handyhüllen')}">${(editor.product==='case'?[product('case'),...CASE_MODELS]:CASE_MODELS).map(option).join('')}</optgroup>${CATEGORIES.filter(p=>p.id!=='case').map(option).join('')}`;
}
let atelier=null,atelierKey='',openingProduct='';
const atelierCopy={
 mug:['Görsel kupanın bir yarısını kaplar. Diğer yarısını bağımsız tasarlayabilirsin.','Das Motiv füllt eine Hälfte der Tasse. Die andere Hälfte kannst du unabhängig gestalten.'],
 shirt:['Baskının göğüs üzerindeki yerini ve kumaşın yanlardan nasıl döküldüğünü incele.','Betrachte den Aufdruck auf der Brust und den Fall des Stoffes von der Seite.'],
 hoodie:['Ön baskıyı, kapüşonu ve kumaş kıvrımlarını farklı açılardan incele.','Entdecke Frontmotiv, Kapuze und Stofffalten aus verschiedenen Winkeln.'],
 cushion:['Motifin yastığın dolgun yüzeyine nasıl oturduğunu her açıdan gör.','Sieh, wie dein Motiv auf der gewölbten Kissenfläche liegt.'],
 tote:['Çantayı döndürerek saplarını, yan dikişini ve ön baskıyı incele.','Drehe die Tasche und betrachte Henkel, Seitennaht und Frontdruck.'],
 poster:['Çerçeveyi çevir, ince profilini ve içindeki tasarımı yakından gör.','Drehe den Rahmen und entdecke sein Profil und dein Motiv im Detail.'],
 keychain:['Halkayı, metal kenarı ve yuvarlak baskı yüzeyini yakından incele.','Betrachte Ring, Metallkante und runde Motivfläche aus der Nähe.'],
 giftbox:['Kapağı, saten kurdeleyi ve kutunun ön yüzündeki tasarımı incele.','Entdecke Deckel, Satinband und dein Motiv auf der Vorderseite.'],
 case:['Kılıfı çevirerek kamera açıklığını, iç yüzeyi ve baskının yerini incele.','Drehe die Hülle und betrachte Kameraausschnitt, Innenseite und Motiv.']
};
function atelierMarkup(choice){
  const kind=choice.model?'case':choice.id,serial=String(CATEGORIES.findIndex(p=>p.id===kind)+1).padStart(2,'0');
  const key=(id,symbol,tr,de,extra='')=>`<button type="button" disabled data-orbit="${id}" class="at-key ${extra}" aria-label="${words(tr,de)}" title="${words(tr,de)}">${symbol}</button>`;
  return `<section class="atelier" id="atelier" data-item="${choice.id}" aria-label="${words('Atölye vitrini','Ateliervitrine')}" data-mode="loading">
   <div class="at-layout"><div class="at-view"><div class="at-stage">
    <div class="at-floor" aria-hidden="true"></div><canvas class="at-canvas" tabindex="0" aria-label="${escapeHTML(name(choice))} · ${words('Etkileşimli model','Interaktives Modell')}" aria-describedby="atStatus"></canvas><canvas class="at-fallback" width="450" height="325" hidden></canvas>
    <span class="at-engrave" aria-hidden="true">EJDER &nbsp; / &nbsp; ATELIER</span><span class="at-number" aria-hidden="true">Nº ${serial} / 09</span>
    <div class="at-readout" aria-hidden="true"><span class="at-state">—</span><span class="at-zoom">100%</span></div>
    <button class="at-skip" type="button" data-orbit="skip">${words('Atla','Überspringen')}</button></div>
    <div class="at-controls" role="group" aria-label="${words('Vitrin kontrolleri','Ansichtssteuerung')}">
    ${key('left','↶','Sola döndür','Nach links drehen')}${key('right','↷','Sağa döndür','Nach rechts drehen')}<i class="at-sep"></i>
    ${key('minus','−','Uzaklaştır','Verkleinern')}${key('plus','+','Yakınlaştır','Vergrößern')}${key('reset','<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/></svg>','İlk açıya dön','Ansicht zurücksetzen')}<i class="at-sep"></i>
    ${key('replay',words('Kutuyu aç','Box öffnen'),'Kutuyu yeniden aç','Box erneut öffnen','at-replay')}</div>
    <div class="at-status" id="atStatus" role="status">${words('Vitrin hazırlanıyor…','Vitrine wird vorbereitet …')}</div></div>
    <div class="at-info"><span class="at-kicker at-type">${words('Atölye vitrini','Ateliervitrine')}</span><h1>${escapeHTML(name(choice))}</h1>
    <p>${words(...atelierCopy[kind])}</p>
    <label class="at-label" for="atProduct">${words('Ürün ve model','Produkt und Modell')}</label><select id="atProduct">${productOptions()}</select>
    ${faceControls()}
    <div class="at-choices"><fieldset class="at-tones"><legend class="at-label">${tr('productColor')}</legend>${COLORS.map(c=>`<button type="button" data-color="${c}" style="--tone:${c===ORIGINAL?'#f2dfb9':c}" aria-label="${colorName(c)}" title="${colorName(c)}" aria-pressed="${editor.productColor===c}"></button>`).join('')}</fieldset>
    <fieldset class="at-motifs"><legend>${words('Bir motif dene','Motiv ausprobieren')}</legend>
    ${['phoenix','wedding','floral','bird'].map(id=>`<button type="button" data-template="${id}" aria-label="${tr('template_'+id)}" aria-pressed="${editor.themeApplied&&id===editor.template}"><img loading="lazy" src="${AS}themes/${id}.webp" alt=""></button>`).join('')}</fieldset></div>
    <button type="button" class="at-go" data-atelier-edit>${words('Tasarımını düzenle','Design bearbeiten')} <span aria-hidden="true">↓</span></button>
    </div></div></section>`;
}
function syncAtelier(){
  const spot=document.getElementById('atelier'),key=editor.product+'/'+language;
  if(!spot){atelier?.destroy();atelier=null;atelierKey='';openingProduct='';return;}
  if(atelier&&atelierKey===key){
    if(spot!==atelier.root)spot.replaceWith(atelier.root);
    for(const button of atelier.root.querySelectorAll('[data-design-side]'))button.setAttribute('aria-pressed',String(button.dataset.designSide===editor.side));
    for(const b of atelier.root.querySelectorAll('[data-color]'))b.setAttribute('aria-pressed',String(b.dataset.color===editor.productColor));
    for(const b of atelier.root.querySelectorAll('[data-template]'))b.setAttribute('aria-pressed',String(editor.themeApplied&&editor.template===b.dataset.template));
    return;
  }
  atelier?.destroy();atelierKey=key;
  atelier=window.EJDERAtelier?.mount(spot,{id:editor.product,words,opening:openingProduct!==editor.product,
    side:()=>editor.side,doubleSided:()=>editor.product==='mug',area:()=>printArea(),color:()=>editor.productColor,paint:(c,side)=>drawCanvasTo(c,true,false,faceDesign(side),true),flat:c=>drawCanvasTo(c,true,false)});
  openingProduct=editor.product;
}
function studioPage(){
  const choice=product(editor.product),sel=selectedLayer();
  return `<main class="max studio-page">
    ${atelierMarkup(choice)}
    <h2 class="at-edit-title" id="editTools" tabindex="-1">${tr('studioHeading')}</h2>
    <div class="privacy-banner" role="note"><div><strong>${words('Fotoğraflar cihazında kalır.','Deine Fotos bleiben auf deinem Gerät.')}</strong><br>${words('Yüklenince uzun kenarı en fazla 4096 piksele küçültülür, sıkıştırılır; sunucuya gönderilmez ve işlem bittiğinde silinir.','Beim Laden wird die lange Seite auf höchstens 4096 Pixel verkleinert und das Bild komprimiert; keine Server-Uploads, nach Abschluss gelöscht.')}</div></div>
    <div class="studio-grid">
      <aside class="card studio-side"><h2>${tr('navStudio')}</h2>
        <div class="toolmenu">
          <button type="button" data-tool="product">${productPicture(choice.id)}${tr('selectProduct')}</button>
          <button type="button" data-tool="photo">${themePicture('pet')}${tr('upload')}</button>
          <button type="button" data-tool="text">${themePicture('monogram')}${words('İsim veya yazı','Name oder Text')}</button>
          <button type="button" data-tool="colors">${productPicture('case')}${tr('colors')}</button>
          <button type="button" data-tool="templates">${themePicture('floral')}${tr('templates')}</button>
          <button type="button" data-tool="layers">${productPicture('giftbox')}${tr('layers')}</button>
        </div>
        <div class="tool-form" id="toolForm">
          <label for="productSelect">${tr('selectProduct')}</label><select id="productSelect">${productOptions()}</select>
          <label for="photoInput">${tr('upload')} <small>(JPG / PNG / WebP • ${words('en fazla 10 MB','max. 10 MB')})</small></label>
          <input id="photoInput" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="photoPrivacyInfo">
          <div class="mini-help" id="photoPrivacyInfo">${words('Fotoğraf önce küçültülür; EXIF metadata çıkarılır. Aynı anda en fazla 3 fotoğraf.','Fotos werden verkleinert, EXIF-Metadaten entfernt. Maximal 3 Fotos gleichzeitig.')}</div>
          <label for="fillMode">${words('Görsel yerleşimi','Bildplatzierung')}</label><select id="fillMode">${editor.product==='keychain'?`<option value="smart" ${editor.fillMode==='smart'?'selected':''}>${words('Doğal yuvarlak · Yüzleri koru','Natürlich rund · Gesichter erhalten')}</option>`:''}<option value="cover" ${editor.fillMode==='cover'?'selected':''}>${words('Tam kapla · Kenarlarda boşluk bırakma','Fläche füllen · Randlos')}</option><option value="contain" ${editor.fillMode==='contain'?'selected':''}>${words('Motifi kesmeden ortala','Motiv vollständig zentrieren')}</option></select>
          <p class="mini-help">${editor.fillMode==='smart'?smartFitHelp(sel):editor.fillMode==='cover'?words('Tam kaplama kenarları kırpabilir. Şeffaf desenler kumaş üzerinde şeffaf kalır.','Randloses Füllen kann Ränder beschneiden. Transparente Motive bleiben auf Stoff transparent.'):words('Fotoğrafın tamamı alana sığar. Grup fotoğrafında kişi sayısı arttığında da kenardaki kişiler kesilmez; boşluk kalabilir.','Das ganze Foto wird eingepasst. Auch bei Gruppen bleiben Personen am Rand erhalten; freie Ränder sind möglich.')}</p>
          ${editor.fillMode==='cover'?`<label for="focusX">${words('Yatay odak','Horizontaler Fokus')}</label><input id="focusX" type="range" min="0" max="1" step=".01" value="${editor.focusX??.5}"><label for="focusY">${words('Dikey odak','Vertikaler Fokus')}</label><input id="focusY" type="range" min="0" max="1" step=".01" value="${editor.focusY??.5}">`:''}
          <label for="printBackground">${words('Baskı alanının fonu','Hintergrund der Druckfläche')}</label><select id="printBackground">${editor.product==='keychain'?`<option value="photo" ${editor.printBackground==='photo'?'selected':''}>${words('Fotoğrafla yumuşak tamamla','Mit Foto weich ergänzen')}</option>`:''}<option value="transparent" ${editor.printBackground==='transparent'?'selected':''}>${words('Şeffaf · Ürün rengi görünsün','Transparent · Produktfarbe sichtbar')}</option><option value="color" ${editor.printBackground==='color'?'selected':''}>${words('Kendi rengimi seçeyim','Eigene Farbe wählen')}</option></select>
          ${editor.printBackground==='color'?`<label for="printBackgroundColor">${words('Fon rengi','Hintergrundfarbe')}</label><input id="printBackgroundColor" type="color" value="${editor.printBackgroundColor||'#ffffff'}">`:''}
          ${sel?.type==='image'?`<label for="photoBackground">${words('Seçili fotoğrafın arka planı','Hintergrund des gewählten Fotos')}</label><select id="photoBackground"><option value="keep" ${sel.background!=='remove'?'selected':''}>${words('Orijinal arka planı koru','Originalhintergrund behalten')}</option><option value="remove" ${sel.background==='remove'?'selected':''}>${words('Tek renk arka planı kaldır','Einfarbigen Hintergrund entfernen')}</option></select><p class="mini-help">${words('Kaldırma yalnız tek renk kenar fonlarında çalışır. Karmaşık fotoğraflar için önceden hazırlanmış şeffaf PNG kullan. Orijinale her zaman dönebilirsin.','Entfernen funktioniert bei einfarbigen Rändern. Für komplexe Fotos bitte ein freigestelltes PNG verwenden. Das Original bleibt wiederherstellbar.')}</p>
          <label for="photoZoom">${words('Fotoğrafı yakınlaştır','Foto vergrößern')} <output id="photoZoomOutput">${Math.round((sel.zoom||1)*100)}%</output></label><input id="photoZoom" type="range" min=".25" max="4" step=".01" value="${sel.zoom||1}">
          <label for="photoX">${words('Fotoğrafın yatay konumu','Foto horizontal verschieben')}</label><input id="photoX" type="range" min="-1" max="1" step=".01" value="${sel.panX||0}">
          <label for="photoY">${words('Fotoğrafın dikey konumu','Foto vertikal verschieben')}</label><input id="photoY" type="range" min="-1" max="1" step=".01" value="${sel.panY||0}">
          <button type="button" class="btn secondary tiny" data-action="fit-photo">${words('Herkesi sığdır ve ortala','Alle einpassen und zentrieren')}</button><p class="mini-help">${words('Elle büyütme ve kaydırma kenarları kesebilir. Yukarıdaki düğme güvenli yerleşime döndürür.','Manuelles Vergrößern und Verschieben kann Ränder abschneiden. Die Taste stellt die sichere Platzierung wieder her.')}</p>`:''}
          <p class="mini-help">${words('Baskı dosyası ürünün gerçek kalıbıyla atölyede hazırlanır. Bu görünüm fiziksel üretim onayı değildir.','Druckdateien werden in der Werkstatt mit der echten Produktschablone erstellt. Diese Ansicht ist keine Produktionsfreigabe.')}</p>
          <div class="privacy-state" id="privacyState" aria-live="polite"></div>
          <button type="button" class="btn secondary tiny" data-action="delete-photos">${words('Geçici fotoğrafları sil','Temporäre Fotos löschen')}</button>
          <div class="form-divider"></div>
          <button class="btn secondary tiny" type="button" data-action="add-text">+ ${words('Yeni yazı katmanı','Weitere Textebene')}</button>
          <label for="textColorInput">${tr('textColor')}</label><input id="textColorInput" type="color" value="${sel?.color||'#e8b974'}">
          <label for="sizeInput">${tr('size')} <output id="sizeOutput">${sel?.size||68}</output></label><input id="sizeInput" type="range" min="22" max="130" value="${sel?.size||68}">
          <label for="angleInput">${tr('rotation')} <output id="angleOutput">${sel?.angle||0}°</output></label><input id="angleInput" type="range" min="-180" max="180" value="${sel?.angle||0}">

          <div class="form-divider"></div><label>${tr('layers')}</label>
          <div class="layer-list">${editor.layers.map((l,i)=>`<button type="button" data-layer-id="${escapeHTML(l.id)}" class="layer-item ${l.id===editor.selected?'active':''}">${l.type==='image'?words('Geçici fotoğraf','Temporäres Foto'):escapeHTML(l.text||'Text')} <span>${i+1}</span></button>`).join('')}</div>
          <button type="button" class="btn secondary tiny" data-action="remove-layer">✕ ${tr('deleteLayer')}</button>
        </div>
      </aside>
      <section class="card studio-canvas-wrap">
        <div class="canvas-head"><h2>${tr('editArea')}</h2><span class="eyebrow">${escapeHTML(name(choice))}</span>${choice.model?`<a class="choose-case" href="${hash('cases')}">${words('Diğer kılıf modelleri','Weitere Hüllenmodelle')}</a>`:''}</div>
        ${faceControls()}<div class="canvas-outer"><canvas id="studioCanvas" width="${W}" height="${H}" aria-label="${tr('editArea')}"></canvas></div>
        ${productPalette()}<button type="button" class="btn secondary tiny at-return" data-atelier-return>↑ ${words('Vitrinde gör','In der Vitrine ansehen')}</button>
        <div class="name-field">
          <label for="textInput">${words('Ürüne yazılacak isim veya metin','Name oder Text auf dem Produkt')}</label>
          <input id="textInput" type="text" maxlength="80" autocomplete="off" enterkeyhint="done" aria-describedby="nameHelp" value="${escapeHTML(sel?.type==='text'?sel.text:'')}" placeholder="${words('Örn. Ayşe','Z. B. Jürgen')}">
          <div class="lettering-pickers">
            <label for="fontSelect">${words('Yazı tarzı','Schriftstil')}<select id="fontSelect">${Object.entries(FONTS).map(([id,face])=>`<option value="${id}">${words(...face.label)}</option>`).join('')}</select></label>
            <label for="finishSelect">${words('Yazı efekti','Schrifteffekt')}<select id="finishSelect">${Object.entries(FINISHES).map(([id,label])=>`<option value="${id}">${words(...label)}</option>`).join('')}</select></label>
          </div>
          <small id="nameHelp">${words('Yazdığın isim ön izlemeye ve PNG dosyana işlenir.','Dein Name erscheint in der Vorschau und in deiner PNG-Datei.')}</small>
        </div>
        <p class="studio-hint">${tr('productHint')}</p>
        <div class="canvas-foot"><button type="button" class="btn secondary tiny" data-action="undo">↶ ${tr('undo')}</button><button type="button" class="btn secondary tiny" data-action="redo">↷ ${tr('redo')}</button></div>
        <div class="editor-template-header"><h3>${tr('allTemplates')}</h3></div>
        ${motifPicker('studio')}
      </section>
      <aside class="card studio-preview"><h2>${tr('preview')}</h2>
        <div class="flip3d" id="flip3d" style="--fy:${flipY}deg"><div class="flip3d-inner"><div class="flip3d-face flip3d-front"><div class="preview-frame"><canvas id="studioPreview" width="450" height="325" aria-label="${tr('preview')}"></canvas></div></div><div class="flip3d-face flip3d-back"><img src="${AS+editor.product}.webp?v=6" alt="${escapeHTML(name(choice))}" width="480" height="332" draggable="false"></div></div></div>
        <div class="flip3d-tools"><button type="button" class="btn secondary tiny" data-flip="toggle" aria-pressed="${flipBack()}">${flipBack()?words('↻ Tasarımını gör','↻ Dein Design ansehen'):words('↻ Katalog örneğini gör','↻ Katalogbeispiel ansehen')}</button><small>${words('Kartı sürükleyerek 3D çevir','Karte ziehen, um sie in 3D zu drehen')}</small></div>
        <div class="controlgroup"><h3>${words('Seçilen ürün','Gewähltes Produkt')}</h3><canvas id="chosenSurface" width="450" height="325" class="product-preview-image" aria-label="${escapeHTML(name(choice))}"></canvas><p>${escapeHTML(name(choice))}</p></div>
        <div class="controlgroup"><h3>${words('Fotoğraf gizliliği','Foto-Datenschutz')}</h3><p>${words('Fotoğraflar hiçbir sunucuya veya kalıcı depoya yüklenmez. Tasarımı kaydedince yalnızca yazı/renk bilgileri kalır. PNG indirince fotoğraflar tarayıcı belleğinden temizlenir.','Fotos werden nicht an Server oder dauerhafte Speicher übertragen. Beim Speichern bleiben nur Text und Farben. Nach dem PNG-Download werden Fotos aus dem Browser-Speicher entfernt.')}</p></div>
        <div class="studio-panel-actions"><button class="btn secondary tiny" type="button" data-action="save">▣ ${tr('save')}</button><button class="btn tiny" type="button" data-action="download">↓ ${words('Ürün görsellerini indir','Produktbilder herunterladen')}</button><button class="btn secondary tiny" type="button" data-action="workshop-pack">${words('Atölye paketini indir','Werkstattpaket herunterladen')}</button><button class="btn secondary tiny artwork-export" type="button" data-action="download-art">↓ ${words('Tasarım dosyalarını indir','Motivdateien herunterladen')}</button></div>
        <button class="btn danger studio-finish" type="button" data-action="finish">✓ ${words('İşlemi bitir ve fotoğrafları sil','Fertig & Fotos löschen')}</button>
      </aside>
    </div>
    <div class="disclaimer">${tr('editorNote')} ${words('Arka yüz tasarımı varsa iki ayrı PNG tek ZIP içinde indirilir. Üretim ölçüleri ve çift taraflı baskı uygunluğu atölyede kontrol edilir.','Mit Rückseitendesign werden zwei separate PNGs gemeinsam als ZIP geladen. Produktionsmaße und beidseitige Druckeignung werden in der Werkstatt geprüft.')}</div>
  </main>`;
}

/* All base images and motifs come from the original EJDER collection.
   Coordinates below use its 480 × 332 product photographs. */
const PRODUCT_SURFACES={
 ...Object.fromEntries(window.EJDERCaseCatalog.models.map(m=>[m.id,{print:m.print,fullPrint:m.fullPrint}])),
 cushion:{print:[142,72,196,188]},
 case:{print:[105,147,114,141],outline:'M99 87Q99 68 119 68H210Q228 68 228 88V305Q228 324 210 324H115Q99 324 99 307Z'},
 mug:{print:[181,147,143,141],outline:'M163 118Q245 101 341 118V308Q260 335 163 311Z'},
 shirt:{print:[179,109,147,151],outline:'M213 51Q252 74 291 51L351 77 413 153 369 190 343 174 348 325 154 325 157 174 132 190 91 144 153 73Z'},
 keychain:{print:[173,177,146,146],round:true,outline:'M245 174A76 76 0 1 1 244.9 174Z'},
 hoodie:{print:[176,137,141,122],outline:'M172 84Q174 31 248 13Q314 25 317 85L364 117 401 221 402 306 381 324 351 314 337 245 338 326 157 326 160 237 127 321 92 310 99 222 133 122Z'},
 tote:{print:[179,156,143,141],outline:'M145 125L358 125 362 319Q251 333 143 319Z'},
 poster:{print:[152,83,198,224],outline:'M152 83H350V307H152Z'},
 giftbox:{print:[175,228,118,66],outline:'M96 165L398 158 399 208 390 209 389 307 308 329 99 305Z'}
};
// Leave room below the catalogue artwork for a personal name. Existing drafts use their original coordinates.
const NAME_SURFACES={
 case:[103,132,121,177],mug:[173,130,155,184],shirt:[168,102,169,205],
 hoodie:[164,121,169,180],tote:[158,143,174,172]
};
// Product-space measurements on the unprinted front, independent of screen size.
const CURRENT_PRINT={
 shirt:[168,98,168,208], mug:[174,131,156,175], hoodie:[170,123,156,110],
 tote:[162,151,178,154], keychain:[174,179,142,142], poster:[155,85,192,218],
 giftbox:[176,223,119,83]
};
let fileMediaReady;
function loadFileMedia(){
  if(!fileMediaReady)fileMediaReady=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src=AS+'editor-media.js';
    script.onload=()=>resolve(window.EJDER_FILE_IMAGES);script.onerror=reject;
    document.head.append(script);
  });
  return fileMediaReady;
}
const mediaCache=new Map(), PHOTO_SCALE=W/480, PHOTO_TOP=(H-332*PHOTO_SCALE)/2;
function studioMedia(file){
  if(!mediaCache.has(file)){
    const image=new Image();
    const media={image};
    const ready=new Promise(resolve=>{
      image.onload=async()=>{
        if(file.startsWith('themes/'))media.focus=await window.EJDERPhotoLayout?.locate(image).catch(()=>null);
        resolve(true);drawStudio();
      };
      image.onerror=()=>resolve(false);
      if(location.protocol==='file:'){loadFileMedia().then(files=>{image.src=files[file];}).catch(()=>resolve(false));}
      else image.src=AS+file+(file.startsWith('themes/')?'?v=6':'');
    });
    media.ready=ready;mediaCache.set(file,media);
  }
  return mediaCache.get(file);
}
function printArea(design=editor){
  const surface=PRODUCT_SURFACES[design.product];
  const [x,y,w,h]=(design.surfaceVersion>=4&&(design.product.startsWith('case')?surface.fullPrint||surface.print:design.product==='poster'?[152,83,198,224]:CURRENT_PRINT[design.product]))||(design.surfaceVersion===3&&CURRENT_PRINT[design.product])||(design.surfaceVersion===2&&NAME_SURFACES[design.product])||surface.print;
  return {x:x*PHOTO_SCALE,y:PHOTO_TOP+y*PHOTO_SCALE,w:w*PHOTO_SCALE,h:h*PHOTO_SCALE};
}
function surfacePath(ctx,x,y,w,h,design=editor){
  ctx.beginPath();
  if(PRODUCT_SURFACES[design.product].round){ctx.ellipse(x+w/2,y+h/2,w/2,h/2,0,0,Math.PI*2);}
  else if(design.product==='poster')ctx.rect(x,y,w,h);else ctx.roundRect(x,y,w,h,Math.min(7,w*.035));
}
function editorBase(productId){return (productId==='giftbox'?'':'blanks/')+productId+'.webp';}
function productMedia(design){
  const base=studioMedia(editorBase(design.product));
  if(design.product.startsWith('case')&&design.product!=='case')studioMedia('tints/'+design.product+'.png');
  return design.productColor===ORIGINAL||design.product==='case'?[base]:[base,studioMedia('tints/'+design.product+'.png')];
}
// Each mask holds opacity and the material's lighting. Camera glass, frames and the stage stay untouched.
const tintCache=new WeakMap();
function tintedSurface(mask,color){
  let entry=tintCache.get(mask);
  if(!entry){
    const layer=document.createElement('canvas');layer.width=mask.naturalWidth;layer.height=mask.naturalHeight;
    const ctx=layer.getContext('2d',{willReadFrequently:true});ctx.drawImage(mask,0,0);
    entry={layer,ctx,original:ctx.getImageData(0,0,layer.width,layer.height),color:null};tintCache.set(mask,entry);
  }
  if(entry.color===color)return entry.layer;
  const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
  const channels=rgb.map(c=>Uint8ClampedArray.from({length:256},(_,v)=>v<=128?c*v/128:c+(255-c)*(v-128)/127));
  const pixels=new ImageData(new Uint8ClampedArray(entry.original.data),entry.layer.width,entry.layer.height);
  for(let i=0;i<pixels.data.length;i+=4){
    if(!pixels.data[i+3])continue;
    const light=pixels.data[i];
    for(let k=0;k<3;k++)pixels.data[i+k]=channels[k][light];
  }
  entry.ctx.putImageData(pixels,0,0);entry.color=color;return entry.layer;
}
function paintProduct(ctx,design=editor){
  ctx.fillStyle='#1b080e';ctx.fillRect(0,0,W,H);
  if(design.side==='back'){const a=printArea(design);ctx.fillStyle=design.productColor===ORIGINAL?'#eee5db':design.productColor;surfacePath(ctx,a.x,a.y,a.w,a.h,design);ctx.fill();ctx.fillStyle='#e7cfa9';ctx.font='24px system-ui';ctx.textAlign='center';ctx.fillText(words('Arka yüz tasarım alanı · 360° vitrinde gör','Rückseitiges Motivfeld · In der 360°-Vitrine ansehen'),W/2,Math.min(H-24,a.y+a.h+46));return;}
  const [base,mask]=productMedia(design);
  if(!base.image.naturalWidth)return;
  ctx.save();ctx.translate(0,PHOTO_TOP);ctx.scale(PHOTO_SCALE,PHOTO_SCALE);
  ctx.drawImage(base.image,0,0,480,332);
  if(mask?.image.naturalWidth)ctx.drawImage(tintedSurface(mask.image,design.productColor),0,0,480,332);
  if(design.product==='case'&&design.productColor!==ORIGINAL){
    // Legacy three-case artwork used by existing local drafts.
    ctx.clip(new Path2D(PRODUCT_SURFACES.case.outline));ctx.fillStyle=design.productColor;
    ctx.globalCompositeOperation='color';ctx.globalAlpha=.84;ctx.fillRect(0,0,480,332);
    ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.32;ctx.fillRect(0,0,480,332);
  }
  ctx.restore();
}
const inkCache=new WeakMap();
function visibleInk(image){
  if(inkCache.has(image))return inkCache.get(image);
  const w=image.naturalWidth,h=image.naturalHeight,scale=Math.min(1,320/Math.max(w,h));
  const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*scale));c.height=Math.max(1,Math.round(h*scale));
  const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,c.width,c.height);
  const data=ctx.getImageData(0,0,c.width,c.height).data;
  let mass=0,sx=0,sy=0,left=c.width,right=0,top=c.height,bottom=0,toneMass=0,tone=[0,0,0];
  for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
    const j=(y*c.width+x)*4,alpha=data[j+3];if(alpha<8)continue;
    const color=[data[j],data[j+1],data[j+2]],weight=alpha*(.2+(Math.max(...color)-Math.min(...color))/255);
    toneMass+=weight;for(let k=0;k<3;k++)tone[k]+=color[k]*weight;
    mass+=alpha;sx+=(x+.5)*alpha;sy+=(y+.5)*alpha;
    left=Math.min(left,x);right=Math.max(right,x+1);top=Math.min(top,y);bottom=Math.max(bottom,y+1);
  }
  let ink={cx:w/2,cy:h/2,w,h,visualY:h/2,visualH:h};
  if(mass){
    const cx=sx/mass,cy=sy/mass,xx=w/c.width,yy=h/c.height;
    ink={cx:cx*xx,cy:cy*yy,w:2*Math.max(cx-left,right-cx)*xx,h:2*Math.max(cy-top,bottom-cy)*yy,visualY:(top+bottom)*yy/2,visualH:(bottom-top)*yy};
  }
  ink.opaque=mass/(c.width*c.height*255)>.97;
  ink.bounds=mass?{x:Math.max(0,Math.floor(left*w/c.width)-1),y:Math.max(0,Math.floor(top*h/c.height)-1),right:Math.min(w,Math.ceil(right*w/c.width)+1),bottom:Math.min(h,Math.ceil(bottom*h/c.height)+1)}:{x:0,y:0,right:w,bottom:h};
  // Measure the upper silhouette and diagonal extremities from the source pixels.
  // For a photo on a plain matte, measure contrast without removing its background.
  if(ink.opaque){
    // Estimate the horizontal spread of detail when the proposed crop would discard half a photo.
    const columns=new Float64Array(c.width);let total=0;
    for(let y=1;y<c.height*.72;y+=2)for(let x=1;x<c.width;x+=2){
      const j=(y*c.width+x)*4;let contrast=0;
      for(let k=0;k<3;k++)contrast+=Math.abs(data[j+k]-data[j+k-4])+Math.abs(data[j+k]-data[j+k-c.width*4]);
      const value=Math.max(0,contrast-32);columns[x]+=value;total+=value;
    }
    let left=0,right=c.width-1,lo=0,hi=0;
    while(left<right&&lo<total*.01)lo+=columns[left++];
    while(right>left&&hi<total*.01)hi+=columns[right--];
    ink.detail={x:Math.max(0,Math.min(.22,left/c.width-.035))*w,right:Math.min(1,Math.max(.78,right/c.width+.035))*w};
  }
  const corners=[0,c.width-1,(c.height-1)*c.width,c.width*c.height-1].map(i=>Array.from(data.slice(i*4,i*4+3)));
  const matte=corners[0];
  const flatMatte=ink.opaque&&corners.every(rgb=>rgb.every((v,k)=>Math.abs(v-matte[k])<24));
  if(!ink.opaque||flatMatte){
    const mask=new Uint8Array(c.width*c.height);
    let x0=c.width,x1=0,y0=c.height,y1=0,count=0,sx=0,sy=0,sxx=0,syy=0,sxy=0;
    for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
      const i=y*c.width+x,j=i*4;
      if(data[j+3]<75||(flatMatte&&Math.max(...matte.map((v,k)=>Math.abs(v-data[j+k])))<42))continue;
      mask[i]=1;x0=Math.min(x0,x);x1=Math.max(x1,x+1);y0=Math.min(y0,y);y1=Math.max(y1,y+1);
      count++;sx+=x;sy+=y;sxx+=x*x;syy+=y*y;sxy+=x*y;
    }
    if(count>20){
      const bw=x1-x0,bh=y1-y0;
      let left=x1,right=x0,tipLeft=x1,tipRight=x0;
      for(let y=y0;y<y0+bh*.33;y++)for(let x=x0;x<x1;x++)if(mask[y*c.width+x]){
        left=Math.min(left,x);right=Math.max(right,x+1);
        if(y<y0+bh*.15){tipLeft=Math.min(tipLeft,x);tipRight=Math.max(tipRight,x+1);}
      }
      const correlation=(count*sxy-sx*sy)/Math.sqrt(Math.max(1,(count*sxx-sx*sx)*(count*syy-sy*sy)));
      ink.shape={left:x0*w/c.width,right:x1*w/c.width,top:y0*h/c.height,bottom:y1*h/c.height,
        headLeft:left*w/c.width,headRight:right*w/c.width,narrowTop:(tipRight-tipLeft)<bw*.6,
        diagonal:count/(bw*bh)<.5&&Math.abs(correlation)>.52};
    }
  }
  ink.tone=toneMass?tone.map(v=>Math.round(v/toneMass)):[80,40,50];
  inkCache.set(image,ink);return ink;
}
// Full-cover artwork also supports cut-out portraits and transparent motifs.
// Work at the source resolution: no artificial upscaling of print sources.
function smartFitHelp(layer){
 const focus=layer&&cachedImages.get(layer.key)?.focus;
 if(editor.layers.filter(l=>l.type==='image').length>1)return words('Birden fazla fotoğraf birlikte kesilmeden sığdırılır. Doğal yuvarlak yerleşim tek fotoğraf içindir.','Mehrere Fotos werden vollständig eingepasst. Die natürliche Rundung ist für ein einzelnes Foto.');
 if(layer?.background==='remove'||focus?.status==='transparent')return words('Şeffaf görsel kesilmeden korunur. Doğal yuvarlak fotoğraf için orijinal arka planı koru.','Transparente Motive bleiben vollständig erhalten. Für ein natürlich rundes Foto den Originalhintergrund behalten.');
 if(focus?.faces?.length)return words(`${focus.faces.length} yüz bulundu. Yüzler korunarak fazla boşluk azaltılır; dar kenarlar seçtiğin fonla tamamlanır. Herkesin göründüğünü kontrol et.`,`${focus.faces.length} Gesichter gefunden. Freiraum wird reduziert; schmale Ränder werden mit dem gewählten Hintergrund ergänzt. Bitte alle Personen prüfen.`);
 if(focus)return words('Yüzler güvenilir biçimde bulunamadı; fotoğrafın tamamı korundu. İstersen elle yakınlaştır veya tam kaplamayı seç.','Gesichter nicht zuverlässig gefunden; das ganze Foto bleibt erhalten. Bei Bedarf manuell vergrößern oder randlos füllen.');
 return words('Yüklenen fotoğrafta yüzlerin konumu cihazında bulunur; yuvarlak yerleşim buna göre ayarlanır. Herkesin göründüğünü kontrol et.','Gesichtspositionen werden lokal ermittelt und für die Rundung verwendet. Bitte prüfen, ob alle Personen sichtbar sind.');
}
function drawSmartPhoto(ctx,area,art,design,showSelection,caption){
 const {image,layer,faces}=art,iw=image.naturalWidth,ih=image.naturalHeight;
 const hasText=design.layers.some(l=>l.type==='text'&&String(l.text||'').trim());
 const faceSide=caption?Math.max(.1,Math.min(1,(caption.top-area.y)/area.h)):1;
 const focusArea=caption?{x:area.x+area.w*(1-faceSide)/2,y:area.y,w:area.w*faceSide,h:area.h*faceSide}:hasText?{x:area.x+area.w*.14,y:area.y+area.h*.015,w:area.w*.72,h:area.h*.72}:area;
 const pos=window.EJDERPhotoLayout.fit(iw,ih,faces,focusArea);if(!pos)return;
 if(design.printBackground==='photo'){
  const scale=Math.max(area.w/iw,area.h/ih)*1.16,bw=iw*scale,bh=ih*scale;
  ctx.save();ctx.filter=`blur(${Math.max(1,area.w*.045)}px)`;
  ctx.drawImage(image,area.x+(area.w-bw)/2,area.y+(area.h-bh)/2,bw,bh);ctx.restore();
 }
 const zoom=layer.zoom||1,cx=focusArea.x+focusArea.w/2,cy=focusArea.y+focusArea.h/2;
 const x=cx+(pos.x-cx)*zoom+(layer.panX||0)*area.w/2,y=cy+(pos.y-cy)*zoom+(layer.panY||0)*area.h/2,w=pos.w*zoom,h=pos.h*zoom;
 ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate((layer.angle||0)*Math.PI/180);
 ctx.drawImage(design.printBackground==='photo'?window.EJDERPhotoLayout.soften(image):image,-w/2,-h/2,w,h);ctx.restore();
 // Selecting a smart photo must not draw a misleading rectangular frame.
 if(showSelection)selectedBounds.push({id:layer.id,x:area.x+area.w/2,y:area.y+area.h/2,w:area.w*.94,h:area.h*.94,round:true});
}
function photoImage(layer){const p=cachedImages.get(layer.key);return layer.background==='remove'&&p?.cutout?p.cutout:p?.img;}
function useCover(image,design){
  return design.fillMode==='cover'&&(design.product.startsWith('case')||visibleInk(image).opaque||
    ['poster','cushion'].includes(design.product));
}
// Keep the occupied part at full size when possible. Known faces constrain the crop together.
function placeCoverSubject(image,ink,faces,frame,frontWidth,focusX,focusY){
  const w=image.naturalWidth,h=image.naturalHeight;
  const shape=ink.shape, bounds=ink.bounds;
  const b=shape?{x:shape.left,y:shape.top,right:shape.right,bottom:shape.bottom}:bounds;
  const bw=b.right-b.x,bh=b.bottom-b.y;
  let scale=Math.max(frame.w/bw,frame.h/bh),safe=null;
  if(faces.length){
    safe={x:Math.max(0,Math.min(...faces.map(f=>f.x-f.w*.12)))*w,
      right:Math.min(1,Math.max(...faces.map(f=>f.x+f.w*1.12)))*w,
      y:Math.max(0,Math.min(...faces.map(f=>f.y-f.h*.32)))*h,
      bottom:Math.min(1,Math.max(...faces.map(f=>f.y+f.h*1.18)))*h};
    if(shape?.narrowTop){
      safe.x=Math.min(safe.x,shape.headLeft);safe.right=Math.max(safe.right,shape.headRight);
      safe.y=Math.min(safe.y,b.y);
    }
  }else if(shape?.diagonal){
    safe=b;
  }else if(shape?.narrowTop){
    safe={x:shape.headLeft,right:shape.headRight,y:b.y,bottom:b.y+bh*.42};
  }else if(!shape&&w/h>1.45){
    // Wide photos without reliable face positions can have people at opposite edges.
    safe=b;
  }else if(!shape&&ink.detail){
    safe={...ink.detail,y:0,bottom:h*.75};
  }
  if(safe)scale=Math.min(scale,frontWidth/Math.max(1,safe.right-safe.x),frame.h/Math.max(1,safe.bottom-safe.y));
  let x=frame.x+(frame.w-bw*scale)*focusX-b.x*scale;
  let y=frame.y+(frame.h-bh*scale)*focusY-b.y*scale;
  if(safe){
    const left=frame.x+(frame.w-frontWidth)/2;
    x=Math.max(left-safe.x*scale,Math.min(left+frontWidth-safe.right*scale,x));
    y=Math.max(frame.y-safe.y*scale,Math.min(frame.y+frame.h-safe.bottom*scale,y));
  }
  return {x,y,w:w*scale,h:h*scale};
}
const coverCache=new WeakMap();
function coverSource(image,design,captionRatio=null,faces=[]){
  const ink=visibleInk(image),isCase=design.product.startsWith('case');
  // Continuous backgrounds can use the original full-bleed texture. The same
  // test applies to catalog art and to decoded customer files.
  const widePhoto=image.naturalWidth/image.naturalHeight>1.45;
  const a=printArea(design);
  const severeCrop=ink.opaque&&!ink.shape&&isCase&&(a.w/a.h)/(image.naturalWidth/image.naturalHeight)<.485;
  if(ink.opaque&&!ink.shape&&!faces.length&&!widePhoto&&!severeCrop)return image;
  const chosenBackground=design.printBackground==='color';
  const color=chosenBackground?(design.printBackgroundColor||'#ffffff'):(design.productColor||ORIGINAL);let cached=coverCache.get(image);
  const textCount=design.layers.filter(l=>l.type==='text'&&String(l.text||'').trim()).length;
  const band=captionRatio??(isCase&&textCount?Math.min(.28,.14+.035*textCount):0);
  const key=[color,chosenBackground,design.product,a.w,a.h,band,captionRatio!==null,design.focusX??.5,design.focusY??.5,design.fillMode,JSON.stringify(faces)].join('|');
  if(!cached){cached=new Map();coverCache.set(image,cached);}if(cached.has(key))return cached.get(key);
  const b=ink.bounds,c=document.createElement('canvas'),edge=Math.max(image.naturalWidth,image.naturalHeight);
  const factor=edge/Math.max(a.w,a.h);
  c.width=Math.max(1,Math.round(a.w*factor));c.height=Math.max(1,Math.round(a.h*factor));
  const ctx=c.getContext('2d');
  if(color!==ORIGINAL)ctx.fillStyle=color;
  else {const g=ctx.createLinearGradient(0,0,c.width,c.height),tone=ink.tone;
    g.addColorStop(0,`rgb(${tone.map(v=>Math.round(v*.45+14)).join(',')})`);
    g.addColorStop(1,`rgb(${tone.map(v=>Math.round(v*.16+7)).join(',')})`);ctx.fillStyle=g;}
  const extendBackground=isCase||ink.opaque;
  if(extendBackground||chosenBackground)ctx.fillRect(0,0,c.width,c.height);
  const model=isCase&&window.EJDERCaseCatalog.models.find(m=>m.id===design.product);
  const cameraTop=isCase?(design.product.endsWith('promax')?.315:model?.fullPrint?(model.print[1]-model.fullPrint[1])/model.fullPrint[3]:.40):0;
  const bw=b.right-b.x,bh=b.bottom-b.y,bgScale=Math.max(c.width/bw,c.height/bh);
  if(extendBackground&&!chosenBackground){
    ctx.save();ctx.filter=`blur(${Math.max(2,c.width*.045)}px)`;ctx.globalAlpha=.55;
    ctx.drawImage(image,b.x,b.y,bw,bh,(c.width-bw*bgScale)/2,(c.height-bh*bgScale)/2,bw*bgScale,bh*bgScale);ctx.restore();
  }
  // The Xiaomi ring ends at 39.7% of this texture. Other cases use their measured camera-safe boundary.
  const shape=ink.shape;
  const protect=faces.length||shape?.narrowTop||shape?.diagonal||widePhoto||severeCrop;
  const top=(design.product==='case-xiaomi17ultra'&&protect&&!shape?.diagonal)? .397:cameraTop;
  const frame={x:0,y:c.height*top,w:c.width,h:Math.max(1,c.height*(1-top-band))};
  const frontRatio=isCase?.76:design.product==='mug'?.77:1;
  const fx=design.focusX??.5,fy=design.focusY??.5;
  if(shape?.diagonal&&!faces.length&&isCase){
    // Leave the complete diagonal silhouette on the front, including wing tips or tails.
    const width=c.width*.79,height=frame.h*(captionRatio===null?.91:1);
    const scale=Math.min(width/bw,height/bh),dw=bw*scale,dh=bh*scale;
    ctx.drawImage(image,b.x,b.y,bw,bh,(c.width-dw)*fx,frame.y+(height-dh)*(captionRatio===null?fy:Math.min(1,fy*2)),dw,dh);
  }else if(!protect&&!ink.opaque&&isCase){
    const scale=Math.max(c.width/bw,frame.h/bh),sw=c.width/scale,sh=frame.h/scale;
    ctx.drawImage(image,b.x+(bw-sw)*fx,b.y+(bh-sh)*fy,sw,sh,0,frame.y,c.width,frame.h);
  }else{
    const pos=placeCoverSubject(image,ink,faces,frame,c.width*frontRatio,fx,fy);
    ctx.save();ctx.beginPath();ctx.rect(0,frame.y,c.width,frame.h);ctx.clip();
    const spills=pos.x>0.5||pos.x+pos.w<c.width-.5||pos.y>frame.y+.5||pos.y+pos.h<frame.y+frame.h-.5;
    const source=ink.opaque&&spills?window.EJDERPhotoLayout.soften(image):image;
    ctx.drawImage(source,pos.x,pos.y,pos.w,pos.h);ctx.restore();
  }
  if(cached.size>3)cached.clear();cached.set(key,c);return c;
}
// Measure each row from its visible ink. The circular keychain uses an inscribed safe area.
function arrangeArtwork(items,area,round,compactText=false,textWidthRatio=1){
  const art=items.filter(i=>i.kind!=='text');
  const names=items.filter(i=>i.kind==='text');
  const rows=[];
  for(let i=0;i<art.length;i+=2)rows.push(art.slice(i,i+2));
  rows.push(...names.map(i=>[i]));
  if(!rows.length)return;
  const safe=round&&art.length+names.length>1?.70:.94;
  const width=area.w*safe,height=area.h*safe;
  const gap=Math.min(width*.052,height*.052,height/(rows.length*4));
  const gaps=rows.slice(1).map(row=>compactText&&row[0].kind==='text'?Math.min(gap,Math.min(width,height)*.012):gap);
  const spacing=gaps.reduce((sum,value)=>sum+value,0);
  const usable=height-spacing;
  const artRows=Math.ceil(art.length/2);
  const linesBudget=artRows?Math.min(usable*.42,usable*.22*names.length):usable;
  function fitRow(row,maxHeight){
    const rowWidth=row[0].kind==='text'?width*textWidthRatio:width;
    const cellWidth=(rowWidth-gap*(row.length-1))/row.length;
    for(const [i,item] of row.entries()){
      const layer={...item.layer,x:.5,y:.5};
      const pos=fitLayer(area,item.width,item.height,layer,round,cellWidth/(area.w*.94),maxHeight/(area.h*.94));
      pos.x=area.x+area.w/2+(i-(row.length-1)/2)*(cellWidth+gap);
      item.pos=pos;
    }
    return Math.max(...row.map(item=>item.pos.h));
  }
  const lineHeights=rows.slice(artRows).map(row=>fitRow(row,linesBudget/names.length));
  const artHeight=(usable-lineHeights.reduce((a,b)=>a+b,0))/Math.max(1,artRows);
  const heights=rows.slice(0,artRows).map(row=>fitRow(row,artHeight)).concat(lineHeights);
  const used=heights.reduce((a,b)=>a+b,0)+spacing;
  let y=area.y+(area.h-used)/2;
  for(const [i,row] of rows.entries()){
    for(const item of row)item.pos.y=y+heights[i]/2;
    y+=heights[i]+(gaps[i]||0);
  }
}
function fitLayer(area,width,height,layer,round,widthLimit=1,heightLimit=1) {
  const angle=(layer.angle||0)*Math.PI/180,cos=Math.abs(Math.cos(angle)),sin=Math.abs(Math.sin(angle));
  const rw=width*cos+height*sin,rh=width*sin+height*cos;
  const aw=area.w*.94,ah=area.h*.94;
  const scale=1/Math.max(1,rw/(aw*widthLimit),rh/(ah*heightLimit),round?Math.hypot(rw/aw,rh/ah):0);
  const w=rw*scale,h=rh*scale;
  const maxY=Math.max(0,(ah*(round?Math.sqrt(Math.max(0,1-(w/aw)**2)):1)-h)/2);
  const dy=Math.max(-maxY,Math.min(maxY,(layer.y-.5)*area.h));
  const maxX=Math.max(0,(aw*(round?Math.sqrt(Math.max(0,1-((2*Math.abs(dy)+h)/ah)**2)):1)-w)/2);
  const dx=Math.max(-maxX,Math.min(maxX,(layer.x-.5)*area.w));
  return {x:area.x+area.w/2+dx,y:area.y+area.h/2+dy,w,h,scale,angle,id:layer.id};
}
// Measure automatic captions in the same canvas coordinates used by the 3D texture and the print file.
function placeCoverCaption(lines,area,product,round){
  const isCase=product.startsWith('case'),width=area.w*(round?.58:isCase?.74:product==='mug'?.73:.94);
  const bottom=area.y+area.h*(round?.86:isCase?.936:1);
  const pad=Math.min(area.w,area.h)*.012,gap=pad*.8;
  const rowBudget=Math.max(1,(area.h*.35-2*pad-gap*(lines.length-1))/lines.length);
  const placements=lines.map(item=>fitLayer(area,item.width,item.height,{...item.layer,x:.5,y:.5},false,width/(area.w*.94),rowBudget/(area.h*.94)));
  const height=placements.reduce((sum,pos)=>sum+pos.h,0)+gap*(lines.length-1)+2*pad;
  const top=bottom-height;
  let y=top+pad;
  for(const [i,pos] of placements.entries()){
    pos.y=y+pos.h/2;lines[i].pos=pos;y+=pos.h+gap;
  }
  return {top,height,ratio:(area.y+area.h-top)/area.h};
}
function drawCanvasTo(canvas,includePhotos=true,showSelection=false,design=editor,artworkOnly=false) {
  if(!canvas) return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const area=printArea(design), round=!!PRODUCT_SURFACES[design.product].round;if(showSelection) selectedBounds=[];
  ctx.save();
  if(artworkOnly){
    ctx.scale(canvas.width/area.w,canvas.height/area.h);ctx.translate(-area.x,-area.y);
  }else{
    ctx.scale(canvas.width/W,canvas.height/H);paintProduct(ctx,design);
  }
  ctx.save();
  if(artworkOnly&&!round){ctx.beginPath();ctx.rect(area.x,area.y,area.w,area.h);}
  else surfacePath(ctx,area.x,area.y,area.w,area.h,design);
  ctx.clip();
  if(design.printBackground==='color'){ctx.fillStyle=design.printBackgroundColor||'#ffffff';ctx.fillRect(area.x,area.y,area.w,area.h);}
  const items=[];
  let backgroundArt=null;
  const imageCount=(design.themeApplied?1:0)+design.layers.filter(l=>l.type==='image').length;
  function imageItem(image,layer,kind){
    if(!image?.naturalWidth)return;
    const ink=visibleInk(image),auto=layer.autoPosition,optical=auto&&!ink.opaque,inkH=auto&&!optical?ink.visualH:ink.h;
    const focus=kind==='motif'?mediaCache.get('themes/'+design.template+'.webp')?.focus:cachedImages.get(layer.key)?.focus;
    if(design.product==='keychain'&&design.fillMode==='smart'&&imageCount===1&&ink.opaque&&layer.background!=='remove'&&focus?.faces?.length&&window.EJDERPhotoLayout){backgroundArt={image,layer,kind,smart:true,faces:focus.faces};return;}
    if(imageCount===1&&useCover(image,design)&&!backgroundArt){backgroundArt={image,layer,kind,faces:focus?.faces||[]};return;}
    const scale=kind==='motif'||(auto&&layer.autoFit)?Math.min(area.w/ink.w,area.h/inkH):
      (design.surfaceVersion>=3?area.w*(layer.size||110)/130:(layer.size||130))/ink.w;
    items.push({kind,layer,image,width:ink.w*scale,height:inkH*scale,
      imageScale:scale,offsetX:-ink.cx*scale,offsetY:-(auto&&!optical?ink.visualY:ink.cy)*scale});
  }
  if(design.themeApplied)imageItem(studioMedia('themes/'+design.template+'.webp').image,{autoPosition:true,x:.5,y:.5},'motif');
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(const layer of design.layers){
    if(layer.type==='image'){
      if(includePhotos)imageItem(photoImage(layer),layer,'photo');
      continue;
    }
    const text=String(layer.text||'').slice(0,80);if(!text.trim())continue;
    const size=layer.size||68,font=fontSpec(layer.font,size);ctx.font=font;
    const m=ctx.measureText(text);
    const left=m.actualBoundingBoxLeft??m.width/2,right=m.actualBoundingBoxRight??m.width/2;
    const top=m.actualBoundingBoxAscent??size*.7,bottom=m.actualBoundingBoxDescent??size*.3;
    const edge=layer.finish==='outline'?Math.max(2.5,size*.095):layer.finish==='foil'?Math.max(1.5,size*.052):1.2;
    const inkHeight=Math.max(1,top+bottom);
    items.push({kind:'text',layer,text,font,edge,inkHeight,width:Math.max(1,left+right)+edge+7,
      height:inkHeight+edge+7,offsetX:(left-right)/2,offsetY:(top-bottom)/2});
  }
  const textItems=items.filter(i=>i.kind==='text');
  const hasBackground=!!backgroundArt||!!design.backgroundLayout;
  const autoLines=textItems.filter(item=>item.layer.autoPosition);
  const autoCaption=autoLines.length>0&&(hasBackground||items.some(item=>item.kind!=='text'));
  if(autoCaption)for(const item of autoLines){item.width=Math.max(1,item.width-7);item.height=Math.max(1,item.height-7);}
  const caption=hasBackground&&autoCaption?placeCoverCaption(autoLines,area,design.product,round):null;
  const bandHeight=caption?.height??area.h*(round?Math.min(.42,.29+.03*textItems.length):Math.min(.28,.14+.035*textItems.length));
  if(backgroundArt?.smart){
    drawSmartPhoto(ctx,area,backgroundArt,design,showSelection,caption);
  }else if(backgroundArt){
    const {image:source,layer,kind}=backgroundArt;
    const image=coverSource(source,design,caption?.ratio??null,backgroundArt.faces),iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height;
    function paintCover(frame){
      const scale=Math.max(frame.w/iw,frame.h/ih)*(layer.zoom||1),dw=iw*scale,dh=ih*scale;
      const x=frame.x-(dw-frame.w)*(design.focusX??.5)+(layer.panX||0)*area.w/2,y=frame.y-(dh-frame.h)*(design.focusY??.5)+(layer.panY||0)*area.h/2;
      ctx.save();ctx.translate(x+dw/2,y+dh/2);ctx.rotate((layer.angle||0)*Math.PI/180);ctx.drawImage(image,-dw/2,-dh/2,dw,dh);ctx.restore();
      return {id:layer.id,x:x+dw/2,y:y+dh/2,w:dw,h:dh};
    }
    let bounds=paintCover(area);
    if(caption&&image===source){
      const frame={...area,h:caption.top-area.y};
      ctx.save();ctx.beginPath();ctx.rect(frame.x,frame.y,frame.w,frame.h);ctx.clip();bounds=paintCover(frame);ctx.restore();
    }
    if(showSelection&&kind==='photo')selectedBounds.push(bounds);
  }
  let layoutArea=hasBackground?{...area,y:caption?.top??(area.y+area.h-bandHeight),h:bandHeight}:area;
  if(!hasBackground&&imageCount>0&&design.product.startsWith('case')&&(imageCount>1||design.surfaceVersion>=4)){
    const model=window.EJDERCaseCatalog.models.find(m=>m.id===design.product);
    const top=design.product.endsWith('promax')?.315:model?.fullPrint?(model.print[1]-model.fullPrint[1])/model.fullPrint[3]:.40;
    // Separate photos stay below the camera and on the flat face, not the wrap.
    layoutArea={x:area.x+area.w*.12,y:area.y+area.h*top,w:area.w*.76,h:area.h*(.925-top)};
  }
  // A single wrap motif can span the cup. Names and group photos stay on the readable face.
  const mugMotif=design.product==='mug'&&imageCount===1&&design.fillMode==='cover';
  if(!hasBackground&&imageCount&&design.product==='mug'&&!mugMotif)layoutArea={...area,x:area.x+area.w*.115,w:area.w*.77};
  if(hasBackground&&textItems.length){
    const color=textItems[0].layer.color||'#56182c',rgb=parseInt(color.slice(1),16),light=.2126*(rgb>>16)+.7152*((rgb>>8)&255)+.0722*(rgb&255);
    ctx.fillStyle=light>145?'#21121af0':'#fff1dbf0';ctx.fillRect(area.x,layoutArea.y,area.w,bandHeight);
  }
  if(hasBackground){
    const textArea=round?{x:area.x+area.w*.21,y:area.y+area.h*.69,w:area.w*.58,h:area.h*.20}:layoutArea;
    if(!caption)arrangeArtwork(textItems,textArea,false);
    arrangeArtwork(items.filter(i=>i.kind!=='text'),{...area,h:area.h-(textItems.length?bandHeight:0)},round);
  }else arrangeArtwork(items,layoutArea,round,autoCaption,mugMotif?.77:1);
  for(const item of items){
    const {layer,image,imageScale,text,edge,inkHeight,offsetX,offsetY}=item;
    let placement=layer.autoPosition?item.pos:fitLayer(area,item.width,item.height,layer,round);
    if(item.kind==='photo'){const z=layer.zoom||1;placement={...placement,x:placement.x+(layer.panX||0)*area.w/2,y:placement.y+(layer.panY||0)*area.h/2,w:placement.w*z,h:placement.h*z,scale:placement.scale*z};}
    ctx.save();ctx.translate(placement.x,placement.y);ctx.rotate(placement.angle);ctx.scale(placement.scale,placement.scale);
    if(image)ctx.drawImage(image,offsetX,offsetY,image.naturalWidth*imageScale,image.naturalHeight*imageScale);
    else {
      ctx.font=item.font;
      const color=layer.color||'#56182c';
      ctx.lineJoin='round';ctx.lineWidth=edge;
      ctx.fillStyle=color;ctx.strokeStyle='#260b168c';
      if(layer.finish==='outline'){
        const rgb=parseInt(color.slice(1),16);
        const lightness=.2126*(rgb>>16)+.7152*((rgb>>8)&255)+.0722*(rgb&255);
        ctx.strokeStyle=lightness>145?'#3c1621':'#ffebbf';
      }else if(layer.finish==='foil'){
        const gold=ctx.createLinearGradient(0,-inkHeight/2,0,inkHeight/2);
        for(const [point,tone] of [[0,'#90521d'],[.25,'#efc770'],[.42,'#fff6cd'],[.56,'#b87930'],[.76,'#f4d58c'],[1,'#a66826']])gold.addColorStop(point,tone);
        ctx.strokeStyle=color;ctx.fillStyle=gold;
      }
      ctx.strokeText(text,offsetX,offsetY);ctx.fillText(text,offsetX,offsetY);
    }
    if(showSelection&&item.kind!=='motif')selectedBounds.push(placement);
    ctx.restore();
  }
  ctx.restore();
  // Keep camera apertures, rims and the stage untouched in the flat editor as well.
  if(!artworkOnly&&design.surfaceVersion>=4&&design.product.startsWith('case')&&design.product!=='case'){
    const mask=studioMedia('tints/'+design.product+'.png').image;
    if(mask.naturalWidth){
      const cover=document.createElement('canvas');cover.width=W;cover.height=H;const cc=cover.getContext('2d');paintProduct(cc,design);
      const m=document.createElement('canvas');m.width=W;m.height=H;const mc=m.getContext('2d');mc.drawImage(mask,0,PHOTO_TOP,W,332*PHOTO_SCALE);
      cc.globalCompositeOperation='destination-out';cc.drawImage(m,0,0);ctx.drawImage(cover,0,0);cover.width=cover.height=m.width=m.height=1;
    }
  }
  if(showSelection){
    ctx.save();ctx.strokeStyle='#e3ad6577';ctx.lineWidth=1.5;ctx.setLineDash([8,7]);surfacePath(ctx,area.x,area.y,area.w,area.h,design);ctx.stroke();ctx.restore();
    const b=selectedBounds.find(b=>b.id===design.selected);
    if(b?.round){ctx.save();ctx.strokeStyle='#ffe6a6';ctx.lineWidth=2;ctx.setLineDash([7,4]);ctx.beginPath();ctx.ellipse(b.x,b.y,b.w/2,b.h/2,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
    else if(b){ctx.save();ctx.strokeStyle='#ffe6a6';ctx.setLineDash([7,4]);ctx.lineWidth=2;ctx.strokeRect(b.x-b.w/2-7,b.y-b.h/2-7,b.w+14,b.h+14);ctx.setLineDash([]);ctx.fillStyle='#ffdc8c';for(const x of [b.x-b.w/2-7,b.x+b.w/2+7])for(const y of [b.y-b.h/2-7,b.y+b.h/2+7])ctx.fillRect(x-4,y-4,8,8);ctx.restore();}
  }
  ctx.restore();
}
function drawStudio(){
  studioCanvas=document.getElementById('studioCanvas');if(!studioCanvas)return;
  const faces=hasBack()?[faceDesign('front'),faceDesign('back')]:[faceDesign('front')];
  for(const face of faces)letteringReady(face);
  const required=productMedia(editor);
  for(const face of faces)if(face.themeApplied)required.push(studioMedia('themes/'+face.template+'.webp'));
  const busy=required.some(({image})=>!image.complete||!image.naturalWidth);
  for(const c of document.querySelectorAll('#studioCanvas,#studioPreview,#chosenSurface'))c.setAttribute('aria-busy',String(busy));
  drawCanvasTo(studioCanvas,true,true);
  const smaller=document.getElementById('studioPreview');
  if(smaller)drawCanvasTo(smaller,true,false);
  const chosen=document.getElementById('chosenSurface');
  if(chosen){const ctx=chosen.getContext('2d');ctx.save();ctx.scale(chosen.width/W,chosen.height/H);paintProduct(ctx,editor);ctx.restore();}
  atelier?.refresh();
  const privacy=document.getElementById('privacyState');
  if(privacy)privacy.textContent=temporaryImagesCount()
    ?words(`${temporaryImagesCount()} geçici fotoğraf · yaklaşık ${totalTemporaryKB()} KB`,`${temporaryImagesCount()} temporäre Fotos · ca. ${totalTemporaryKB()} KB`)
    :words('Geçici fotoğraf yok','Keine temporären Fotos');
}
function refreshStudio(){
  if(currentRoute()[0]!=='studio')return;
  const focus=document.activeElement,elId=focus?.id;
  // Rebuild only side panels when they need updated layer lists; typed text stays in place.
  ROOT.innerHTML=header()+studioPage()+footer();
  syncAtelier();
  drawStudio();
  attachCanvasPointer();
  updateControlValues();
  if(elId&&document.getElementById(elId)&&elId!=='photoInput'){
    try{document.getElementById(elId).focus({preventScroll:true})}catch{}
  }
}
function pointOnCanvas(ev){const r=studioCanvas.getBoundingClientRect();return {x:(ev.clientX-r.left)*W/r.width,y:(ev.clientY-r.top)*H/r.height};}
function attachCanvasPointer(){
  if(!studioCanvas)return;
  studioCanvas.addEventListener('pointerdown',ev=>{
    const pt=pointOnCanvas(ev),hit=[...selectedBounds].reverse().find(b=>Math.abs(b.x-pt.x)<b.w/2+18 && Math.abs(b.y-pt.y)<b.h/2+18);
    if(!hit)return;
    editor.selected=hit.id;rememberUndo();
    dragging={id:hit.id,from:pt};
    try{studioCanvas.setPointerCapture(ev.pointerId)}catch{}
    studioCanvas.classList.add('dragging');
    updateControlValues();drawStudio();
  });
  studioCanvas.addEventListener('pointermove',ev=>{
    if(!dragging)return;
    const p=pointOnCanvas(ev),area=printArea(),l=editor.layers.find(x=>x.id===dragging.id);
    if(!l)return;
    const visible=selectedBounds.find(b=>b.id===l.id);if(!visible)return;
    if(l.type==='image'){l.panX=Math.max(-1,Math.min(1,(l.panX||0)+2*(p.x-dragging.from.x)/area.w));l.panY=Math.max(-1,Math.min(1,(l.panY||0)+2*(p.y-dragging.from.y)/area.h));dragging.from=p;drawStudio();updatePhotoControls();return;}
    l.autoPosition=false;
    l.x=Math.min(1,Math.max(0,(visible.x-area.x+p.x-dragging.from.x)/area.w));
    l.y=Math.min(1,Math.max(0,(visible.y-area.y+p.y-dragging.from.y)/area.h));
    dragging.from=p;drawStudio();
  });
  for(const e of ['pointerup','pointercancel','lostpointercapture'])studioCanvas.addEventListener(e,()=>{dragging=null;studioCanvas.classList.remove('dragging')});
}
function updateControlValues(){
  const sel=selectedLayer();
  const tx=document.getElementById('textInput');if(tx)tx.value=sel?.type==='text'?sel.text:'';
  const fs=document.getElementById('fontSelect');if(fs)fs.value=sel?.font||editor.fontChoice;
  const finish=document.getElementById('finishSelect');if(finish)finish.value=sel?.finish||editor.finishChoice;
  const clr=document.getElementById('textColorInput');if(clr)clr.value=sel?.color||'#e8b974';
  const range=document.getElementById('sizeInput');if(range)range.value=sel?.size||68;
  const sz=document.getElementById('sizeOutput');if(sz)sz.textContent=sel?.size||68;
  const rot=document.getElementById('angleInput');if(rot)rot.value=sel?.angle||0;
  const rt=document.getElementById('angleOutput');if(rt)rt.textContent=(sel?.angle||0)+'°';
  updatePhotoControls();
  for(const b of ROOT.querySelectorAll('[data-layer-id]'))b.classList.toggle('active',b.dataset.layerId===editor.selected);
}
function updatePhotoControls(){const l=selectedLayer();if(l?.type!=='image')return;for(const [id,key] of [['photoZoom','zoom'],['photoX','panX'],['photoY','panY']]){const el=document.getElementById(id);if(el)el.value=l[key]??(key==='zoom'?1:0);}const out=document.getElementById('photoZoomOutput');if(out)out.textContent=Math.round((l.zoom||1)*100)+'%';}
async function setPhotoBackground(mode){
 const l=selectedLayer(),p=l&&cachedImages.get(l.key),ticket=imageTicket;if(!p)return;
 const request=p.backgroundRequest=(p.backgroundRequest||0)+1;
 if(mode==='keep'){rememberUndo();l.background='keep';refreshStudio();return;}
 if(p.cutout){rememberUndo();l.background='remove';refreshStudio();return;}
 const op=Symbol();pendingPhotos.add(op);let url=null,c=null;
 try{
  notify(words('Tek renk arka plan cihazında temizleniyor…','Einfarbiger Hintergrund wird lokal entfernt …'));
  c=document.createElement('canvas');const factor=Math.min(1,2048/Math.max(p.img.naturalWidth,p.img.naturalHeight));c.width=Math.round(p.img.naturalWidth*factor);c.height=Math.round(p.img.naturalHeight*factor);
  const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(p.img,0,0,c.width,c.height);
  ctx.putImageData(await window.EJDERPhotoTools.removeEdgeBackground(ctx.getImageData(0,0,c.width,c.height),()=>new Promise(requestAnimationFrame)),0,0);
  const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw Error('png');url=URL.createObjectURL(blob);const img=new Image();img.src=url;await img.decode();
  if(ticket!==imageTicket||!cachedImages.has(l.key)||request!==p.backgroundRequest)return;
  rememberUndo();p.cutout=img;p.cutoutURL=url;p.cutoutBytes=blob.size;url=null;l.background='remove';refreshStudio();
  notify(words('Arka plan kaldırıldı. Sonucu kontrol et; istersen orijinali geri seç.','Hintergrund entfernt. Bitte Ergebnis prüfen; das Original bleibt auswählbar.'));
 }catch{if(ticket===imageTicket)notify(words('Bu fotoğrafın fonu tek renk değil veya güvenle ayrılamadı. Orijinal korundu. Şeffaf PNG kullanabilirsin.','Dieser Hintergrund lässt sich nicht sicher als einfarbig entfernen. Original beibehalten. Ein transparentes PNG ist möglich.'));}
 finally{pendingPhotos.delete(op);if(url)URL.revokeObjectURL(url);if(c)c.width=c.height=1;if(ticket===imageTicket)refreshStudio();}
}
async function processPhotoFile(file){
  const accepted=['image/jpeg','image/png','image/webp'];
  if(!file||!accepted.includes(file.type)||file.size>MAX_FILE_BYTES||file.size===0){notify(tr('toastBadFile'));return;}
  if(cachedImages.size+pendingPhotos.size>=3){notify(words('En fazla 3 geçici fotoğraf kullanılabilir.','Maximal 3 temporäre Fotos möglich.'));return;}
  const myTicket=imageTicket,operation=Symbol();pendingPhotos.add(operation);
  let originalBitmap=null, originalImage=null, tempURL=null, resultURL=null;
  try{
    if(typeof createImageBitmap==='function'){
      originalBitmap=await createImageBitmap(file);
    }else{
      tempURL=URL.createObjectURL(file);
      originalImage=new Image();
      await new Promise((res,rej)=>{originalImage.onload=res;originalImage.onerror=rej;originalImage.src=tempURL});
    }
    const iw=originalBitmap?.width||originalImage.naturalWidth,ih=originalBitmap?.height||originalImage.naturalHeight;
    if(!iw||!ih||iw*ih>50000000)throw new Error('unsupported image size');
    const factor=Math.min(1,MAX_IMAGE_SIDE/Math.max(iw,ih));
    let w=Math.max(1,Math.round(iw*factor)),h=Math.max(1,Math.round(ih*factor));
    const work=document.createElement('canvas');work.width=w;work.height=h;
    let ctx=work.getContext('2d',{alpha:true});if(!ctx)throw new Error('Canvas unsupported');
    ctx.drawImage(originalBitmap||originalImage,0,0,w,h);
    // The canvas output contains no camera EXIF/geolocation metadata.
    let compressed=null;
    for(const q of [.96,.93,.90]){
      compressed=await new Promise(resolve=>work.toBlob(resolve,'image/webp',q));
      if(compressed?.type!=='image/webp') compressed=await new Promise(resolve=>work.toBlob(resolve,'image/png')); // Preserve alpha on browsers without WebP encoding.
      if(compressed && compressed.size<=TARGET_IMAGE_BYTES)break;
    }
    if(!compressed)throw new Error('Photo compression failed');
    if(myTicket!==imageTicket)return;
    resultURL=URL.createObjectURL(compressed);
    const small=new Image();
    await new Promise((resolve,reject)=>{small.onload=resolve;small.onerror=reject;small.src=resultURL});
    if(myTicket!==imageTicket)return;
    const key=newId();
    notify(words('Fotoğraf cihazında hazırlanıyor…','Foto wird auf deinem Gerät vorbereitet …'));
    const focus=await window.EJDERPhotoLayout?.locate(small)||{faces:[],status:'unavailable'};
    if(myTicket!==imageTicket)return;
    cachedImages.set(key,{img:small,url:resultURL,bytes:compressed.size,focus});resultURL=null;
    rememberUndo();
    const l={id:newId(),type:'image',key,autoFit:true,x:.5,y:.5,size:Math.min(130,printArea().w*.92),angle:0,autoPosition:true,zoom:1,panX:0,panY:0,background:'keep'};
    if(editor.product==='keychain')editor.fillMode='smart';
    editor.themeApplied=false;
    editor.layers.push(l);editor.selected=l.id;editor.tool='photo';
    refreshStudio();
    notify(words(`Fotoğraf ${w}×${h} piksele küçültüldü (${Math.round(compressed.size/1024)} KB). Sunucuya gönderilmedi.`,`Foto verkleinert auf ${w}×${h} Pixel (${Math.round(compressed.size/1024)} KB). Kein Upload.`));
  }catch(err){if(myTicket===imageTicket)notify(words('Fotoğraf okunamadı veya küçültülemedi.','Foto konnte nicht gelesen oder verkleinert werden.'));}
  finally{
    pendingPhotos.delete(operation);
    if(originalBitmap)originalBitmap.close();
    if(tempURL)URL.revokeObjectURL(tempURL);
    if(resultURL)URL.revokeObjectURL(resultURL);
    if(originalImage){originalImage.onload=null;originalImage.onerror=null;originalImage.removeAttribute('src');}
    const input=document.getElementById('photoInput');if(myTicket===imageTicket&&input)input.value='';
  }
}
async function downloadWorkshopPackage(){
 if(exportBusy)return;if(pendingPhotos.size){notify(words('Fotoğrafın hazırlanmasını bekle.','Bitte warte auf das Foto.'));return;}
 const owner=editor,ticket=imageTicket,state=snapshotUndo(),faces=[faceDesign('front')];if(hasBack()&&faceHasContent(faceDesign('back')))faces.push(faceDesign('back'));
 if(!faces.some(faceHasContent))return;exportBusy=true;
 try{
  const ready=await Promise.all(faces.flatMap(f=>[...letteringReady(f),...(f.themeApplied?[studioMedia('themes/'+f.template+'.webp').ready]:[])]));if(ready.some(x=>!x))throw Error('source');
  if(owner!==editor||ticket!==imageTicket||state!==snapshotUndo())return;
  const files=[],manifest={version:2,product:owner.product,productionReady:false,faces:[]};
  const add=async(c,name)=>{const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw Error('png');files.push({name,blob});c.width=c.height=1;return name;};
  for(const f of faces){
   if(!faceHasContent(f))continue;
   const sourceImages=f.layers.filter(l=>l.type==='image').map(l=>({img:photoImage(l)})).filter(x=>x.img);
   if(f.themeApplied)sourceImages.unshift({img:studioMedia('themes/'+f.template+'.webp').image});
   const meta={side:f.side,qualitySources:sourceImages.map(x=>({width:x.img.naturalWidth,height:x.img.naturalHeight,kind:'foreground'}))};
   const area=printArea(f),c=document.createElement('canvas'),factor=4096/Math.max(area.w,area.h);c.width=Math.round(area.w*factor);c.height=Math.round(area.h*factor);
   drawCanvasTo(c,true,false,f,true);meta.foreground=await add(c,f.side+'-foreground.png');meta.foregroundPlacement='canvas-exact';
   manifest.faces.push(meta);
  }
  files.push({name:'design.json',blob:new Blob([JSON.stringify(manifest,null,2)],{type:'application/json'})});
  const zip=await window.EJDERDownloads.zip(files);if(owner!==editor||ticket!==imageTicket||state!==snapshotUndo())return;
  const url=URL.createObjectURL(zip),a=document.createElement('a');a.href=url;a.download='EJDER-'+owner.product+'-atolye.zip';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);disposeTemporaryPhotos();
  notify(words('Atölye paketi hazır. Kalıp ve kaynak çözünürlüğü atölyede kontrol edilecek.','Werkstattpaket bereit. Schablone und Quellauflösung werden in der Werkstatt geprüft.'));
 }catch{notify(words('Paket hazırlanamadı; tekrar dene.','Paket konnte nicht erstellt werden.'));}finally{exportBusy=false;}
}

let exportBusy=false;
async function downloadCanvas(artworkOnly=false){
  if(exportBusy)return;
  if(pendingPhotos.size){notify(words('Fotoğraf hazırlanıyor. Ardından indirme düğmesine tekrar dokun.','Dein Foto wird vorbereitet. Tippe anschließend erneut auf Download.'));return;}
  const owner=editor,ticket=imageTicket,state=snapshotUndo(),front=faceDesign('front'),back=faceDesign('back'),paired=hasBack()&&faceHasContent(back),faces=paired?[front,back]:[front];
  if(artworkOnly&&!faces.some(faceHasContent)){notify(words('Önce bir yazı, fotoğraf veya şablon ekle.','Füge zuerst Text, ein Foto oder eine Vorlage hinzu.'));return;}
  exportBusy=true;
  try{
    const media=artworkOnly?[]:productMedia(owner);for(const face of faces)if(face.themeApplied)media.push(studioMedia('themes/'+face.template+'.webp'));
    const ready=await Promise.all([...media.map(item=>item.ready),...faces.flatMap(letteringReady)]);
    if(ready.includes(false))throw Error('media');
    if(owner!==editor||ticket!==imageTicket||currentRoute()[0]!=='studio'||state!==snapshotUndo())return;
    const files=[];
    for(const face of faces){
      const c=document.createElement('canvas'),area=printArea(face),scale=1600/Math.max(area.w,area.h);c.width=artworkOnly?Math.round(area.w*scale):W;c.height=artworkOnly?Math.round(area.h*scale):H;
      if(!artworkOnly&&paired){const model=atelier?.snapshot(face.side);if(!model)throw Error('model');const ctx=c.getContext('2d');ctx.fillStyle='#1b080e';ctx.fillRect(0,0,W,H);ctx.drawImage(model,0,0,W,H);}
      else drawCanvasTo(c,true,false,face,artworkOnly);
      const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw Error('PNG');
      files.push({name:'EJDER-'+owner.product+'-'+face.side+(artworkOnly?'-motif':'-preview')+'.png',blob});
    }
    const blob=paired?await window.EJDERDownloads.zip(files):files[0].blob;
    if(owner!==editor||ticket!==imageTicket||currentRoute()[0]!=='studio'||state!==snapshotUndo())return;
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=paired?'EJDER-'+owner.product+'-front-back-'+(artworkOnly?'motifs':'previews')+'.zip':files[0].name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
    disposeTemporaryPhotos();notify(paired?words('Ön ve arka PNG dosyaları tek ZIP içinde hazırlandı. Geçici fotoğraflar temizlendi.','Vorder- und Rückseiten-PNGs gemeinsam als ZIP erstellt. Temporäre Fotos entfernt.'):words('PNG hazırlandı. Geçici fotoğraflar temizlendi.','PNG erstellt. Temporäre Fotos entfernt.'));
  }catch{notify(words('Dosya hazırlanamadı. 360° modelin yüklenmesini bekleyip tekrar dene.','Datei konnte nicht erstellt werden. Warte, bis das 360°-Modell geladen ist, und versuche es erneut.'));}
  finally{exportBusy=false;}
}
function saveTextOnlyProject(){
  const project=cleanProjectForStorage();
  const previous=getSaved().filter(p=>p.id!==project.id);
  if(!putSaved([project,...previous])){notify(tr('toastStorage'));return;}
  editor.projectId=project.id;
  const hadPhotos=cachedImages.size>0;
  disposeTemporaryPhotos();
  notify(hadPhotos?words('Yazı ve renkler kaydedildi; fotoğraflar silindi.','Text und Farben gespeichert; Fotos gelöscht.'):tr('toastSaved'));
}
function savedDesign(p){
  const design=makeEditor(p.product);
  design.surfaceVersion=[2,3,4].includes(p.surfaceVersion)?p.surfaceVersion:1;
  design.printBackground=['color','photo'].includes(p.printBackground)?p.printBackground:'transparent';design.printBackgroundColor=/^#[a-f\d]{6}$/i.test(p.printBackgroundColor)?p.printBackgroundColor:'#ffffff';
  design.fillMode=['cover','smart'].includes(p.fillMode)?p.fillMode:'contain';design.focusX=Math.max(0,Math.min(1,p.focusX??.5));design.focusY=Math.max(0,Math.min(1,p.focusY??.5));
  design.mugSides=p.mugSides==='double'?'double':'single';design.projectId=p.id;design.template=TEMPLATE_IDS.includes(p.template)?p.template:'minimal';design.themeApplied=p.themeApplied===true;design.productColor=p.colorVersion!==2&&p.surfaceVersion!==3&&p.productColor==='#faf0dc'?ORIGINAL:validProductColor(p.productColor);
  design.layers=(Array.isArray(p.layers)?p.layers:[]).filter(l=>l&&l.type==='text').slice(0,15).map(l=>({
    ...textLayer(l.text??''),autoPosition:l.autoPosition===true,autoColor:l.autoColor===true,id:typeof l.id==='string'?l.id:newId(),
    font:l.font==='script'&&!l.finish?'hand':Object.hasOwn(FONTS,l.font)?l.font:'serif',finish:Object.hasOwn(FINISHES,l.finish)?l.finish:'plain',
    color:/^#[a-f\d]{6}$/i.test(l.color)?l.color:'#e8b974',size:Math.min(130,Math.max(22,Number(l.size)||68)),
    angle:Math.min(180,Math.max(-180,Number(l.angle)||0)),x:Math.min(1,Math.max(0,Number.isFinite(+l.x)?+l.x:.5)),y:Math.min(1,Math.max(0,Number.isFinite(+l.y)?+l.y:.5))
  }));
  design.selected=design.layers[0]?.id||null;
  if(hasBack(design)){if(p.faces?.back){const back=savedDesign({...p,...p.faces.back,faces:null,mugSides:'single'});design.faces.back=captureFace(back);}else if(p.mugSides==='double'&&p.product==='mug'){design.faces.back=captureFace(design);}}
  return design;
}
function loadSavedProject(id){
  const p=getSaved().find(p=>p.id===id);if(!p)return;
  disposeTemporaryPhotos(false);editor=savedDesign(p);
  window.EJDERPaths.go(hash('studio/'+p.product));
  if(currentRoute()[0]==='studio')refreshStudio();
}
function mountSavedPreviews(){
  const saved=new Map(getSaved().map(item=>[item.id,item]));
  for(const canvas of document.querySelectorAll('[data-saved-preview]')){
    const record=saved.get(canvas.dataset.savedPreview);if(!record)continue;
    const design=savedDesign(record);
    const images=productMedia(design);
    if(design.themeApplied)images.push(studioMedia('themes/'+design.template+'.webp'));
    Promise.all([...images.map(item=>item.ready),...letteringReady(design)]).then(loaded=>{
      if(canvas.isConnected&&loaded.every(Boolean)){
        drawCanvasTo(canvas,false,false,design);canvas.hidden=false;
        canvas.previousElementSibling.hidden=true;
      }
    });
  }
}
function render(){
  const route=currentRoute(), page=route[0]||'home';
  let main='';
  switch(page){
    case 'home':main=home();break;
    case 'shop':case 'cart':case 'shop-privacy':main=window.EJDERShop.shell(language,route);break;
    case 'products':main=productsPage();break;
    case 'cases':main=casesPage();break;
    case 'campaigns':main=campaignsPage();break;
    case 'collection':main=collectionsPage(route[1]);break;
    case 'studio': {
      const id=route[1]==='case'&&!(editor.product==='case'&&editor.projectId)?DEFAULT_CASE:(route[1]||'mug');
      if(editor.product!==id){
        disposeTemporaryPhotos(false);editor=makeEditor(id);
      }
      if(pendingTemplate){applyTemplate(pendingTemplate,false);pendingTemplate=null;}
      main=studioPage();break;}
    case 'templates':main=templatesPage();break;
    case 'saved':main=savedPage();break;
    case 'account':main=window.EJDERAccount.render(language);break;
    case 'payments':main=window.EJDERAccount.payments(language);break;
    case 'about':case 'contact':case 'legal':case 'privacy':main=infoPage(page);break;
    default:main=home();
  }
  ROOT.innerHTML=header()+main+footer();
  syncAtelier();
  document.documentElement.lang=language;document.title=(page==='home'?'EJDER Studio':(document.querySelector('main h1')?.textContent||'EJDER Studio')+' · EJDER Studio');window.EJDERHelp?.sync(language);window.EJDERSEO?.sync(language,page);
  if(page==='studio'){drawStudio();attachCanvasPointer();updateControlValues();}
  if(page==='saved')mountSavedPreviews();
  if(['shop','cart','shop-privacy'].includes(page))window.EJDERShop.mount(language,route);
  if(page==='account')window.EJDERAccount.mount(language);
  mountShowcase();
  activeRoute=window.EJDERPaths.hash()||'#/';
  if(page==='home'&&route[1]==='gift')requestAnimationFrame(()=>document.getElementById('gift-demo')?.scrollIntoView({block:'center'}));
  if(page==='templates'&&Object.hasOwn(MOTIF_GROUPS,route[1]))requestAnimationFrame(()=>document.querySelector('[data-motif-picker]')?.scrollIntoView({block:'start'}));
}

ROOT.addEventListener('click', ev=>{
  const faceButton=ev.target.closest('[data-design-side]');if(faceButton){selectFace(faceButton.dataset.designSide);return;}
  const action=ev.target.closest('[data-action]');
  const bcolor=ev.target.closest('[data-color]');
  const template=ev.target.closest('[data-template]');
  const templateGo=ev.target.closest('[data-template-go]');
  const layer=ev.target.closest('[data-layer-id]');
  const lang=ev.target.closest('[data-lang]');
  const openProject=ev.target.closest('[data-open-project]');
  const delProject=ev.target.closest('[data-delete-project]');
  const tool=ev.target.closest('[data-tool]');
  const ringBtn=ev.target.closest('[data-ring]');
  const filterButton=ev.target.closest('[data-motif-filter]');
  if(filterButton){
    const picker=filterButton.closest('[data-motif-picker]'),mode=picker.dataset.motifPicker,key=filterButton.dataset.motifFilter;
    if(mode==='studio')studioFilter=key;else galleryFilter=key;
    picker.outerHTML=motifPicker(mode);
    ROOT.querySelector(`[data-motif-picker="${mode}"] [data-motif-filter="${key}"]`)?.focus({preventScroll:true});return;
  }
  if(ev.target.closest('[data-atelier-return]')){const v=document.getElementById('atelier');v?.scrollIntoView({block:'start',behavior:'instant'});v?.querySelector('canvas')?.focus({preventScroll:true});return;}
  if(ev.target.closest('[data-atelier-edit]')){const title=document.getElementById('editTools');title?.focus({preventScroll:true});title?.scrollIntoView({block:'start',behavior:'instant'});return;}
  if(ringBtn){window.EJDERRing?.rotate(Number(ringBtn.dataset.ring)||1);return;}
  if(ev.target.closest('[data-flip]')){flipY=Math.round(flipY/180)*180+180;applyFlip();return;}
  if(!action&&ev.target.closest('.gift-stage')){document.querySelector('[data-action="gift-toggle"]')?.click();return;}
  if(lang){
    language=lang.dataset.lang==='de'?'de':'tr';writeStore('ejder_lang',language);
    window.EJDERPaths.setLanguage(language);
    render();return;
  }
  if(bcolor){if(editor.productColor!==bcolor.dataset.color){rememberUndo();changeProductColor(bcolor.dataset.color);}return;}
  if(template){applyTemplate(template.dataset.template);return;}
  if(ev.target.closest('[data-gift-link]')){ev.preventDefault();document.getElementById('gift-demo')?.scrollIntoView({block:'start'});document.querySelector('[data-action="gift-toggle"]')?.focus({preventScroll:true});return;}
 const promo=ev.target.closest('[data-promo-theme]');if(promo)pendingTemplate=promo.dataset.promoTheme;
 if(templateGo){
    if(templateGo.closest('.search-results')){searchVal='';mobileOpen=false;const list=templateGo.closest('.search-results');list.hidden=true;const field=list.parentElement.querySelector('input');if(field)field.value='';}
    pendingTemplate=templateGo.dataset.templateGo;
    if(currentRoute()[0]==='studio'){applyTemplate(pendingTemplate);pendingTemplate=null;}
    else window.EJDERPaths.go(hash('studio/'+(TEMPLATE_PRODUCTS[pendingTemplate]||'mug')));
    return;
  }
  if(layer){editor.selected=layer.dataset.layerId;refreshStudio();return;}
  if(tool){
    editor.tool=tool.dataset.tool;
    const focusId={product:'productSelect',text:'textInput',photo:'photoInput',colors:'customProductColor',templates:null,layers:null}[editor.tool];
    if(focusId)document.getElementById(focusId)?.focus();
    if(editor.tool==='photo')document.getElementById('photoInput')?.click();
    if(editor.tool==='templates')document.querySelector('[data-motif-picker=studio]')?.scrollIntoView({behavior:'smooth',block:'center'});
    if(editor.tool==='layers')document.querySelector('.layer-list')?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  if(openProject){loadSavedProject(openProject.dataset.openProject);return;}
  if(delProject){if(!putSaved(getSaved().filter(p=>p.id!==delProject.dataset.deleteProject))){notify(tr('toastStorage'));return;}render();notify(tr('toastDeleted'));return;}
  if(!action)return;
  switch(action.dataset.action){
    case 'menu':{
      mobileOpen=!mobileOpen;
      ROOT.querySelector('.mobilemenu')?.classList.toggle('open',mobileOpen);
      action.setAttribute('aria-expanded',String(mobileOpen));
      return;
    }
    case 'gift-toggle':{
      const stage=document.querySelector('.gift-stage');const opened=stage?.classList.toggle('opened');
      action.textContent=opened?tr('giftClose'):tr('giftOpen');action.setAttribute('aria-expanded',String(!!opened));return;
    }
    case 'add-text':addText();document.getElementById('textInput')?.focus();return;
    case 'fit-photo':{const l=selectedLayer();if(l?.type!=='image')return;rememberUndo();Object.assign(l,{zoom:1,panX:0,panY:0,x:.5,y:.5,angle:0,autoPosition:true,size:130});editor.fillMode='contain';refreshStudio();return;}
    case 'remove-layer':{
      if(!selectedLayer()){notify(tr('toastNoSelected'));return;}
      rememberUndo();const l=selectedLayer();editor.layers=editor.layers.filter(x=>x.id!==l.id);
      if(l.type==='image'){
        const ph=cachedImages.get(l.key);if(ph){URL.revokeObjectURL(ph.url);ph.img.removeAttribute('src');if(ph.cutoutURL)URL.revokeObjectURL(ph.cutoutURL);ph.cutout?.removeAttribute('src');cachedImages.delete(l.key);}
        undoStack=[];redoStack=[];
      }
      editor.selected=editor.layers[editor.layers.length-1]?.id||null;refreshStudio();return;
    }
    case 'delete-photos':case 'finish':{
      const count=cachedImages.size;disposeTemporaryPhotos();
      notify(count?words('Geçici fotoğraflar tamamen temizlendi.','Temporäre Fotos vollständig entfernt.'):words('Geçici fotoğraf yok.','Keine temporären Fotos.'));
      return;
    }
    case 'undo':if(undoStack.length){redoStack.push(snapshotUndo());restoreUndo(undoStack.pop());}return;
    case 'redo':if(redoStack.length){undoStack.push(snapshotUndo());restoreUndo(redoStack.pop());}return;
    case 'save':saveTextOnlyProject();return;
    case 'download':downloadCanvas();return;
    case 'download-art':downloadCanvas(true);return;
    case 'workshop-pack':downloadWorkshopPackage();return;
  }
});
let inputUndoState=null;
ROOT.addEventListener('focusin',ev=>{
  if(['textInput','fontSelect','finishSelect'].includes(ev.target.id)&&selectedLayer()?.type!=='text'){
    const existing=editor.layers.find(l=>l.type==='text');
    if(existing){editor.selected=existing.id;updateControlValues();drawStudio();}
  }
  if(['sizeInput','angleInput','textColorInput','textInput','photoZoom','photoX','photoY','focusX','focusY','printBackgroundColor'].includes(ev.target.id))inputUndoState=snapshotUndo();
});
ROOT.addEventListener('input',ev=>{
  const el=ev.target;const l=selectedLayer();
  if(el.id==='customProductColor'){if(inputUndoState===null)inputUndoState=snapshotUndo();changeProductColor(el.value);return;}
  if(el.matches('[data-bind=search]')){
    searchVal=el.value.trim().slice(0,60);const result=el.parentElement.querySelector('.search-results');
    if(result){
      const norm=t=>t.toLocaleLowerCase(language==='de'?'de':'tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
      const q=norm(searchVal),foundCases=new Set(window.EJDERCaseCatalog.search(searchVal).map(m=>m.id));
      const matches=PRODUCTS.filter(p=>p.model?foundCases.has(p.id):[p.tr,p.de].some(t=>norm(t).includes(q)));

      const themes=TEMPLATE_IDS.filter(id=>[T.tr['template_'+id],T.de['template_'+id],PET_WORDS[id]||'',...Object.entries(MOTIF_GROUPS).filter(([key,group])=>key!=='all'&&key!=='featured'&&group[1].includes(id)).flatMap(([,group])=>group[0])].some(t=>norm(t).includes(q)));
      result.innerHTML=searchVal?matches.map(p=>`<a href="${productLink(p.id)}">${escapeHTML(name(p))}</a>`).join('')+themes.map(id=>`<button type="button" data-template-go="${id}">${tr('template_'+id)} · ${tr('templates')}</button>`).join(''):'';
      if(searchVal&&!matches.length&&!themes.length)result.textContent=words('Eşleşme bulunamadı.','Keine Treffer gefunden.');
      result.hidden=!searchVal;
    }
    return;
  }
  if(el.id==='textInput'&&l?.type!=='text'&&el.value){
    if(editor.layers.filter(item=>item.type==='text').length>=15){el.value='';return;}
    rememberUndo();const fresh=textLayer(el.value);editor.layers.push(fresh);editor.selected=fresh.id;editor.tool='text';
    drawStudio();return;
  }
  if(el.id==='printBackgroundColor'){editor.printBackgroundColor=el.value;drawStudio();return;}
  if(el.id==='focusX'||el.id==='focusY'){editor[el.id]=Math.max(0,Math.min(1,Number(el.value)));drawStudio();return;}
  if(!l)return;
  if(l.type==='image'&&['photoZoom','photoX','photoY'].includes(el.id)){l[{photoZoom:'zoom',photoX:'panX',photoY:'panY'}[el.id]]=Number(el.value);updatePhotoControls();drawStudio();return;}
  if(el.id==='textInput'&&l.type==='text'){l.text=el.value.slice(0,80);drawStudio();return;}
  if(el.id==='textColorInput'&&l.type==='text'){l.autoColor=false;l.color=el.value;drawStudio();return;}
  if(el.id==='sizeInput'){if(l.type==='image')l.autoFit=false;l.size=Number(el.value);document.getElementById('sizeOutput').textContent=el.value;drawStudio();return;}
  if(el.id==='angleInput'){l.angle=Number(el.value);document.getElementById('angleOutput').textContent=el.value+'°';drawStudio();return;}
});
ROOT.addEventListener('change',ev=>{
  const el=ev.target;
  if(el.id==='customProductColor'){if(inputUndoState&&inputUndoState!==snapshotUndo()){undoStack.push(inputUndoState);if(undoStack.length>22)undoStack.shift();redoStack.length=0;}inputUndoState=null;return;}
  if(el.id==='mugSides'&&editor.product==='mug'){rememberUndo();editor.mugSides=el.value==='double'?'double':'single';drawStudio();return;}
  if(el.id==='fillMode'){rememberUndo();editor.fillMode=el.value==='smart'&&editor.product==='keychain'?'smart':el.value==='cover'?'cover':'contain';refreshStudio();return;}
  if(el.id==='printBackground'){rememberUndo();editor.printBackground=el.value==='photo'&&editor.product==='keychain'?'photo':el.value==='color'?'color':'transparent';refreshStudio();return;}
  if(el.id==='photoBackground'){setPhotoBackground(el.value);return;}
  if(el.id==='photoInput'){const file=el.files?.[0];el.value='';if(file)processPhotoFile(file);return;}
  if(el.id==='productSelect'||el.id==='atProduct'){
    const id=el.value;
    if(PRODUCTS.some(p=>p.id===id)&&id!==editor.product){
      // An explicit model change stays within the same design session.
      imageTicket++;pendingPhotos.clear();undoStack=[];redoStack=[];stashFace();if(id.startsWith('case')&&editor.side==='back'){Object.assign(editor,captureFace(faceDesign('front')),{side:'front'});}editor.product=id;
      editor.surfaceVersion=4;editor.fillMode=defaultFillMode(id);for(const face of Object.values(editor.faces||{}))face.fillMode=defaultFillMode(id);editor.projectId=null;window.EJDERPaths.go(hash('studio/'+id));
    }
    return;
  }
  if(el.id==='fontSelect'||el.id==='finishSelect'){
    const field=el.id==='fontSelect'?'font':'finish';
    if(!Object.hasOwn(field==='font'?FONTS:FINISHES,el.value))return;
    const layer=selectedLayer();
    if(layer?.type==='text'){rememberUndo();layer[field]=el.value;}
    editor[field+'Choice']=el.value;
    if(field==='font')loadFace(el.value);
    drawStudio();return;
  }
  if(['sizeInput','angleInput','textColorInput','textInput','photoZoom','photoX','photoY','focusX','focusY','printBackgroundColor'].includes(el.id)){
    if(inputUndoState&&inputUndoState!==snapshotUndo()&&undoStack.at(-1)!==inputUndoState){undoStack.push(inputUndoState);if(undoStack.length>22)undoStack.shift();redoStack.length=0;}
    inputUndoState=null;
    if(selectedLayer()){
      const box=ROOT.querySelector('.layer-list');
      if(box){box.innerHTML=editor.layers.map((item,i)=>`<button type="button" data-layer-id="${escapeHTML(item.id)}" class="layer-item ${item.id===editor.selected?'active':''}">${item.type==='image'?words('Geçici fotoğraf','Temporäres Foto'):escapeHTML(item.text||tr('addText'))}<span>${i+1}</span></button>`).join('');}
      updateControlValues();
    }
    return;
  }
});
ROOT.addEventListener('click',ev=>{
  if(mobileOpen&&ev.target.closest('.mobilemenu a')){mobileOpen=false;ROOT.querySelector('.mobilemenu')?.classList.remove('open');ROOT.querySelector('.menu-btn')?.setAttribute('aria-expanded','false');}
});
document.addEventListener('keydown',ev=>{
  if(ev.key==='Escape'&&mobileOpen){const button=ROOT.querySelector('.menu-btn');button?.click();button?.focus();}
});
ROOT.addEventListener('pointerdown',ev=>{
  const card=ev.target.closest('#flip3d');if(!card||ev.button!==0)return;
  flipDrag={x:ev.clientX,id:ev.pointerId,start:flipY,moved:0};
});
ROOT.addEventListener('pointermove',ev=>{
  const card=document.getElementById('flip3d');
  if(flipDrag&&card&&ev.pointerId===flipDrag.id){
    const dx=ev.clientX-flipDrag.x;flipDrag.moved=Math.max(flipDrag.moved,Math.abs(dx));
    if(flipDrag.moved>4){card.classList.add('dragging');try{card.setPointerCapture(ev.pointerId)}catch{}flipY=flipDrag.start+dx*.7;applyFlip();}
    return;
  }
  if(ev.pointerType!=='mouse')return;
  const hover=ev.target.closest('#flip3d,.gift-stage');
  if(hover){const r=hover.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;
    const t=hover.id==='flip3d'?hover:hover.querySelector('.gift-scene');
    if(t){t.style.setProperty('--tx',(-y*10).toFixed(2)+'deg');t.style.setProperty('--ty',(x*14).toFixed(2)+'deg');}}
});
for(const type of ['pointerup','pointercancel'])ROOT.addEventListener(type,ev=>{
  if(!flipDrag||ev.pointerId!==flipDrag.id)return;
  const card=document.getElementById('flip3d');const moved=flipDrag.moved;flipDrag=null;
  if(card)card.classList.remove('dragging');
  if(moved>4){flipY=Math.round(flipY/180)*180;applyFlip();}
});
ROOT.addEventListener('pointerout',ev=>{
  const el=ev.target.closest?.('#flip3d,.gift-stage');if(!el||el.contains(ev.relatedTarget))return;
  const t=el.id==='flip3d'?el:el.querySelector('.gift-scene');if(t){t.style.setProperty('--tx','0deg');t.style.setProperty('--ty','0deg');}
});
window.addEventListener('ejderroutechange',()=>{
  language=window.EJDERPaths.language();
  const now=currentRoute();
  if(now[0]==='templates')galleryFilter=Object.hasOwn(MOTIF_GROUPS,now[1])&&now[1]!=='featured'?now[1]:'all';
  if(now[0]==='studio'&&now[2]==='theme'&&TEMPLATE_IDS.includes(now[3]))pendingTemplate=now[3];
  if(editorRoute==='studio'&&(now[0]!=='studio'||editor.product!==(now[1]||'mug'))){
    disposeTemporaryPhotos(false);undoStack=[];redoStack=[];
  }
  editorRoute=now[0];mobileOpen=false;searchVal='';flipY=0;flipDrag=null;dragging=null;
  render();window.scrollTo({top:0,behavior:'instant'});focusStudioStep();
});
window.addEventListener('pageshow',ev=>{if(ev.persisted)render();});
window.addEventListener('pagehide',()=>disposeTemporaryPhotos(false));
window.addEventListener('beforeunload',()=>disposeTemporaryPhotos(false));
editorRoute=currentRoute()[0];
if(editorRoute==='templates'&&Object.hasOwn(MOTIF_GROUPS,currentRoute()[1])&&currentRoute()[1]!=='featured')galleryFilter=currentRoute()[1];
if(editorRoute==='studio'&&currentRoute()[2]==='theme'&&TEMPLATE_IDS.includes(currentRoute()[3]))pendingTemplate=currentRoute()[3];
render();
focusStudioStep();
function focusStudioStep(){
  const [page,,step]=currentRoute();
  if(page!=='studio')return;
  const target=step==='theme'?'.studio-canvas-wrap':STUDIO_STEPS.find(item=>item.id===step)?.target;
  if(target)requestAnimationFrame(()=>document.querySelector(target)?.scrollIntoView({block:'center'}));
}
})();
