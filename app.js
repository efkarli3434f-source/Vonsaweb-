/* EJDER Studio – client-side prototype. No server, orders or real payment processing. */
(() => {
'use strict';
const ROOT=document.getElementById('app');
const AS='assets/';
const W=900,H=650;
const PRODUCTS=[
 {id:'case',tr:'Telefon Kılıfı',de:'Handyhülle',shortTr:'Kendi stilini telefonuna taşı.',shortDe:'Dein Stil auf deiner Handyhülle.',kind:'phone',icon:'▯'},
 {id:'mug',tr:'Kupa / Bardak',de:'Tasse / Becher',shortTr:'Her yudum sana özel.',shortDe:'Jeder Schluck ein Unikat.',kind:'mug',icon:'☕'},
 {id:'shirt',tr:'Tişört',de:'T-Shirt',shortTr:'Tarzını üzerinde taşı.',shortDe:'Trage deinen eigenen Stil.',kind:'shirt',icon:'♜'},
 {id:'keychain',tr:'Anahtarlık',de:'Schlüsselanhänger',shortTr:'Küçük ama çok özel.',shortDe:'Klein, aber besonders.',kind:'keychain',icon:'♧'},
 {id:'hoodie',tr:'Hoodie / Sweatshirt',de:'Hoodie / Sweatshirt',shortTr:'Sıcak ve özgün bir stil.',shortDe:'Ein eigener Look für jeden Tag.',kind:'hoodie',icon:'♧'},
 {id:'tote',tr:'Bez Çanta',de:'Stofftasche',shortTr:'Günlük stilini kişiselleştir.',shortDe:'Gestalte deinen Alltagsbegleiter.',kind:'tote',icon:'♙'},
 {id:'poster',tr:'Poster / Tablo',de:'Poster / Wandbild',shortTr:'Duvarlarına özel bir dokunuş.',shortDe:'Ein besonderer Akzent für deine Wände.',kind:'poster',icon:'▣'},
 {id:'giftbox',tr:'Hediye Kutusu',de:'Geschenkbox',shortTr:'Kutudan önce tasarım sürprizi.',shortDe:'Deine persönliche Geschenkbox.',kind:'giftbox',icon:'♢'}
];
const COLLECTIONS=[
 {id:'case-mug',product:['case','mug'],tr:'Kılıf & Kupa',de:'Handyhülle & Tasse',art:'case_mug_collection.webp'},
 {id:'shirt-keychain',product:['shirt','keychain'],tr:'Tişört & Anahtarlık',de:'T-Shirt & Schlüsselanhänger',art:'shirt_keychain_collection.webp'},
 {id:'hoodie-tote',product:['hoodie','tote'],tr:'Hoodie & Bez Çanta',de:'Hoodie & Stofftasche',art:'hoodie_tote_collection.webp'},
 {id:'poster-gift',product:['poster','giftbox'],tr:'Poster & Hediye Kutusu',de:'Poster & Geschenkbox',art:'poster_gift_collection.webp'}
];
const T={
 tr:{navHome:'Ana Sayfa',navCampaigns:'Kampanyalar',navProducts:'Ürünler',navStudio:'Tasarım Stüdyosu',navTemplates:'Şablonlar',navSaved:'Tasarımlarım',navAbout:'Hakkımızda',navContact:'İletişim',search:'Ürün veya tasarım ara...',topMessage:'✦ Kişiye özel dijital tasarımlar',topMiddle:'◇ Hayal Et • Tasarla • Kaydet',topRight:'Türkçe & Almanca',heroKicker:'✦ KİŞİYE ÖZEL TASARIM ATÖLYESİ',heroTitleA:'Sen Hayal Et,',heroTitleB:'Biz Tasarıma',heroTitleC:'Dönüştürelim.',heroP:'Kendi fotoğrafın, yazın ve renklerinle sekiz farklı ürün için özgün tasarımlar hazırla. Üstelik ön izlemeyi anında gör.',start:'Tasarıma Başla',browse:'Ürünleri Keşfet',feature1:'Kendi görselini yükle',feature2:'Yazı ve renk ekle',feature3:'Canlı ön izleme',feature4:'Tasarımını indir',categoriesKick:'KENDİNE ÖZEL BİR ŞEY YARAT',categoriesTitle:'Hayalindeki Ürünü Seç',categoriesText:'Ürünü seç, tasarla ve kendi tarzını oluştur.',design:'Tasarla',campaigns:'İlham Köşesi',campaign1:'Kendi tarzın, kendi imzan',campaign1s:'İsim ve baş harf tasarımları',campaign2:'Özel anlara özel',campaign2s:'Fotoğraf ve mesajlarla kişiselleştir',campaign3:'Sürpriz kutu deneyimi',campaign3s:'Kurdeleyi çöz, kutuyu aç',campaignNote:'Bölümdeki görseller ilham amaçlıdır; gerçek indirim veya satış kampanyası henüz yoktur.',how:'Üç Kolay Adım',step1:'Ürün Seç',step1p:'Sekiz farklı kategoriden birini seç.',step2:'Kendin Tasarla',step2p:'Fotoğraf, metin, desen ve renk ekle.',step3:'Önizle & Kaydet',step3p:'Sonucu kontrol et, kaydet veya PNG indir.',giftHead:'Sürprizi Birlikte Açalım',giftDesc:'Ejder’in hediye kutusunu açmayı dene. Kutunun açılış efekti, daha sonra kişisel tasarımla birleşecek.',giftOpen:'Kurdeleyi Çöz & Kutuyu Aç',giftClose:'Kutuyu Kapat',allTemplates:'Hazır Şablonlar',allTemplatesText:'Bir tema seçerek başlayabilir veya sıfırdan kendi tasarımını oluşturabilirsin.',productChoice:'Tasarım için ürün seç',designStart:'Tasarımına Başla',collectionDesc:'Kendine ait bir tasarım üret; renkler, fotoğraflar ve yazılar tamamen senin seçimin.',templateTitle:'İlham Veren Şablonlar',templateDesc:'Her birini yazın ve renklerinle değiştirebilirsin.',studioHeading:'Kendi Tasarımını Oluştur',studioSub:'Seç • Tasarla • Önizle • Kaydet',selectProduct:'Ürün seç',upload:'Fotoğraf yükle',addText:'Yazı ekle',colors:'Renkler',templates:'Şablonlar',layers:'Katmanlar',typeText:'Üzerindeki yazı',sampleText:'Senin İsmin',chooseFont:'Yazı tipi',textColor:'Yazı rengi',productColor:'Ürün rengi',size:'Boyut',rotation:'Döndürme',editArea:'Tasarım alanı',preview:'Canlı ön izleme',front:'Ön görünüm',back:'Arka görünüm',frontOnly:'Ön yüz',productHint:'Görseldeki yazı veya fotoğrafı tutup sürükleyerek yerini değiştirebilirsin.',undo:'Geri Al',redo:'İleri Al',deleteLayer:'Katmanı Sil',save:'Tarayıcıya Kaydet',download:'PNG Ön İzlemeyi İndir',editorNote:'Bu çalışan tasarım ön izlemesidir. İndirilen PNG baskıya hazır üretim dosyası değildir. Gerçek ürün ve ödeme satışı henüz etkin değil.',savedHead:'Kaydedilen Tasarımlarım',savedDesc:'Tasarımlar yalnızca bu tarayıcıda saklanır. Cihaz değişirse otomatik taşınmaz.',noSaved:'Henüz kaydedilmiş tasarım yok.',open:'Düzenle',delete:'Sil',date:'Tarih',homeBottom:'EJDER Studio',legal:'Yasal Bilgiler',privacy:'Gizlilik',terms:'Kullanım Koşulları',footerCopy:'Hayal et. Kişiselleştir. Tasarla.',footerReminder:'Demo sürüm · Satış ve ödeme işlemleri henüz aktif değildir.',aboutTitle:'Hayal Gücüne Özel Bir Stüdyo',aboutP:'EJDER Studio, müşterinin kendi fotoğrafını, yazısını ve renklerini kullanarak kişisel tasarım oluşturmasına odaklanan bir dijital stüdyo projesidir. Bu sürüm ön izleme ve tasarım deneyimini göstermek için hazırlanmıştır.',contactTitle:'İletişim',contactP:'İletişim formu, gerçek e-posta hesabı bağlanmadan gönderim yapmaz. Şimdilik sadece tasarım örneği olarak gösterilir.',name:'Adın',email:'E-posta',message:'Mesaj',contactDisabled:'Mesaj gönderimi henüz etkin değil',legalTitle:'Yasal / Datenschutz',legalP:'Gerçek ticari yayına geçmeden önce Impressum, Datenschutz, çerez bilgilendirmesi, satıcı bilgileri ve satış koşulları işletmenin gerçek kayıtlarına göre hazırlanmalıdır. Bu şablon hukuki belge yerine geçmez.',toastSaved:'Tasarım bu tarayıcıya kaydedildi.',toastDeleted:'Tasarım silindi.',toastUpload:'Fotoğraf tasarıma eklendi.',toastBadFile:'Lütfen 10 MB altı JPG, PNG veya WebP dosyası seç.',toastNoSelected:'Önce bir katman seç.',toastStorage:'Cihaz depolama sınırı nedeniyle kaydedilemedi. PNG olarak indir.',toastDownloaded:'Ön izleme PNG dosyası hazırlandı.',toastFrontOnly:'Bu ürün için şu anda ön yüz düzenlenebilir.',template_monogram:'Monogram',template_floral:'Çiçek',template_nature:'Doğa',template_pet:'Evcil Hayvan',template_heart:'Aşk & Anı',template_minimal:'Minimal',template_dragon:'Ejderha',template_night:'Gece',language:'Dil',menu:'Menüyü Aç',help:'Yardım',giftPreview:'Hediye kutusu örnek açılma efekti',shopDisabled:'Gerçek sipariş/ödeme sistemi henüz kurulmadı.',aboutCard1:'Sen tasarla',aboutCard1p:'Seçimlerini kendin yap.',aboutCard2:'Dilersen kaydet',aboutCard2p:'Ön izleme aynı cihazda kalır.',aboutCard3:'Her dilde kolay',aboutCard3p:'Türkçe ve Almanca menüler.'},
 de:{navHome:'Startseite',navCampaigns:'Aktionen',navProducts:'Produkte',navStudio:'Designstudio',navTemplates:'Vorlagen',navSaved:'Meine Entwürfe',navAbout:'Über uns',navContact:'Kontakt',search:'Produkt oder Design suchen...',topMessage:'✦ Individuelle digitale Designs',topMiddle:'◇ Vorstellen • Gestalten • Speichern',topRight:'Türkisch & Deutsch',heroKicker:'✦ DEIN PERSÖNLICHES DESIGNSTUDIO',heroTitleA:'Deine Idee.',heroTitleB:'Dein Design.',heroTitleC:'Dein Stil.',heroP:'Entwirf einzigartige Designs für acht Produktarten mit eigenen Fotos, Texten und Farben. Sieh dir sofort die Vorschau an.',start:'Jetzt gestalten',browse:'Produkte entdecken',feature1:'Eigenes Bild hochladen',feature2:'Text und Farbe hinzufügen',feature3:'Live-Vorschau',feature4:'Design herunterladen',categoriesKick:'ERSCHAFFE DEIN UNIKAT',categoriesTitle:'Wähle dein Produkt',categoriesText:'Produkt wählen, gestalten und deinen Stil zeigen.',design:'Gestalten',campaigns:'Inspiration',campaign1:'Dein eigener Stil',campaign1s:'Namen und Monogramme',campaign2:'Persönliche Momente',campaign2s:'Fotos und eigene Botschaften',campaign3:'Überraschungsbox',campaign3s:'Schleife lösen, Box öffnen',campaignNote:'Die gezeigten Motive dienen nur als Inspiration. Es gibt noch keine echten Rabattaktionen oder Verkäufe.',how:'Drei einfache Schritte',step1:'Produkt wählen',step1p:'Wähle eine von acht Kategorien.',step2:'Selbst gestalten',step2p:'Foto, Text, Muster und Farbe hinzufügen.',step3:'Vorschau & Speichern',step3p:'Prüfen, speichern oder PNG herunterladen.',giftHead:'Öffne die Überraschung',giftDesc:'Teste die Öffnungsanimation unserer Geschenkbox. Dein Design kann später einfließen.',giftOpen:'Schleife lösen & Box öffnen',giftClose:'Box schließen',allTemplates:'Designvorlagen',allTemplatesText:'Starte mit einer Vorlage oder erschaffe ein völlig eigenes Motiv.',productChoice:'Produkt zum Gestalten wählen',designStart:'Jetzt gestalten',collectionDesc:'Kreiere dein Design mit deinen eigenen Farben, Bildern und Texten.',templateTitle:'Inspirierende Vorlagen',templateDesc:'Alle Vorlagen lassen sich individuell anpassen.',studioHeading:'Erstelle dein eigenes Design',studioSub:'Wählen • Gestalten • Vorschau • Speichern',selectProduct:'Produkt wählen',upload:'Foto hochladen',addText:'Text hinzufügen',colors:'Farben',templates:'Vorlagen',layers:'Ebenen',typeText:'Dein Schriftzug',sampleText:'Dein Name',chooseFont:'Schriftart',textColor:'Textfarbe',productColor:'Produktfarbe',size:'Größe',rotation:'Drehung',editArea:'Designfläche',preview:'Live-Vorschau',front:'Vorderseite',back:'Rückseite',frontOnly:'Vorderseite',productHint:'Ziehe den Text oder das Foto, um es neu zu platzieren.',undo:'Rückgängig',redo:'Wiederholen',deleteLayer:'Ebene löschen',save:'Im Browser speichern',download:'PNG-Vorschau herunterladen',editorNote:'Diese Gestaltung ist eine Vorschau. Das PNG ist keine druckfertige Produktionsdatei. Bestellungen und Zahlungen sind noch nicht verfügbar.',savedHead:'Meine gespeicherten Entwürfe',savedDesc:'Entwürfe werden nur in diesem Browser gespeichert und nicht automatisch übertragen.',noSaved:'Noch keine Entwürfe gespeichert.',open:'Bearbeiten',delete:'Löschen',date:'Datum',homeBottom:'EJDER Studio',legal:'Rechtliches',privacy:'Datenschutz',terms:'Nutzungsbedingungen',footerCopy:'Vorstellen. Personalisieren. Gestalten.',footerReminder:'Demoversion · Bestellungen und Zahlungen sind noch nicht aktiv.',aboutTitle:'Ein Studio für deine Ideen',aboutP:'EJDER Studio ist ein Projekt für ein digitales Designstudio, in dem Kundinnen und Kunden mit eigenen Bildern, Texten und Farben persönliche Motive gestalten können. Diese Version demonstriert das Vorschau- und Design-Erlebnis.',contactTitle:'Kontakt',contactP:'Das Kontaktformular versendet ohne angebundenes Postfach keine Nachrichten. Es ist derzeit nur ein Layout-Beispiel.',name:'Name',email:'E-Mail',message:'Nachricht',contactDisabled:'Nachrichtenversand noch nicht aktiv',legalTitle:'Rechtliches / Datenschutz',legalP:'Vor einem kommerziellen Start müssen Impressum, Datenschutz, Cookie-Hinweise, Anbieterangaben und Verkaufsbedingungen mit echten Unternehmensdaten erstellt werden. Diese Vorlage ersetzt keine Rechtsberatung.',toastSaved:'Entwurf wurde in diesem Browser gespeichert.',toastDeleted:'Entwurf gelöscht.',toastUpload:'Foto hinzugefügt.',toastBadFile:'Bitte JPG, PNG oder WebP unter 10 MB auswählen.',toastNoSelected:'Bitte zuerst eine Ebene auswählen.',toastStorage:'Browser-Speicher ist voll. Bitte als PNG herunterladen.',toastDownloaded:'PNG-Vorschau wurde vorbereitet.',toastFrontOnly:'Für dieses Produkt ist derzeit nur die Vorderseite bearbeitbar.',template_monogram:'Monogramm',template_floral:'Blumen',template_nature:'Natur',template_pet:'Haustier',template_heart:'Liebe & Erinnerung',template_minimal:'Minimal',template_dragon:'Drache',template_night:'Nacht',language:'Sprache',menu:'Menü öffnen',help:'Hilfe',giftPreview:'Geschenkbox Öffnungsanimation',shopDisabled:'Ein echter Bestell-/Zahlungsprozess ist noch nicht eingerichtet.',aboutCard1:'Selbst gestalten',aboutCard1p:'Du bestimmst alle Details.',aboutCard2:'Lokal speichern',aboutCard2p:'Der Entwurf bleibt auf deinem Gerät.',aboutCard3:'Einfach in zwei Sprachen',aboutCard3p:'Türkische und deutsche Menüs.'}
};
const TEMPLATE_IDS=['monogram','floral','nature','pet','heart','minimal','dragon','night'];
const TEMPLATE_ICONS=['♛','✿','△','♧','♡','◇','🐉','☾'];
const FONTS={serif:'Georgia,serif',script:'cursive',sans:'Arial,sans-serif'};
const COLORS=['#faf0dc','#151217','#9b173c','#dcc39b','#f3aec0','#3f4568','#254e5e'];
const ED_DEFAULT={product:'mug',template:'floral',productColor:'#faf0dc',layers:[],selected:null, tool:'text',projectId:null,boxOpen:false};
let language=readStore('ejder_lang','tr')==='de'?'de':'tr';
let editor=makeEditor('mug');
let mobileOpen=false,searchVal='',noticeTimer=null,dragging=null,undoStack=[],redoStack=[],cachedImages=new Map(), studioCanvas=null;
let activeRoute=window.location.hash||'#/';
function tr(k){return T[language][k]||T.tr[k]||k}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]))}
function product(id){return PRODUCTS.find(p=>p.id===id)||PRODUCTS[0]}
function name(p){return language==='de'?p.de:p.tr}
function readStore(key,def){try{return localStorage.getItem(key)||def}catch{return def}}
function writeStore(key,s){try{localStorage.setItem(key,s);return true}catch{return false}}
function hash(path){return '#/'+path.replace(/^\/+/, '')}
function currentRoute(){let raw=decodeURIComponent((window.location.hash||'#/').replace(/^#\/?/,''));return raw.split('/').filter(Boolean)}
function pageLink(id){return `<a href="${hash(id)}">${escapeHTML(id)}</a>`}
function header(){
 const seg=currentRoute(),section=seg[0]||'home';
 const nav=[['',tr('navHome')],['campaigns',tr('navCampaigns')],['products',tr('navProducts')],['studio/'+editor.product,tr('navStudio')],['templates',tr('navTemplates')],['saved',tr('navSaved')]];
 return `<div class="topline"><div class="max"><span>${tr('topMessage')}</span><span class="top-hide">${tr('topMiddle')}</span><span>${tr('topRight')}</span></div></div>
 <header class="sitehead"><div class="max head-main"><a href="#/" class="brand" aria-label="EJDER Studio"><img src="${AS}ejder_logo_animated.webp" alt="EJDER Studio" onerror="this.src='${AS}ejder_logo.webp'"></a>
 <nav class="mainnav" aria-label="Primary">${nav.map(([url,title])=>`<a href="${hash(url)}" class="${(url.split('/')[0]||'home')===section?'active':''}">${title}</a>`).join('')}</nav>
 <div class="head-actions"><div class="searchbar"><label class="sr-only" for="headerSearch">${tr('search')}</label><input id="headerSearch" data-bind="search" type="search" placeholder="${tr('search')}" value="${escapeHTML(searchVal)}" autocomplete="off"><div id="searchResults" class="search-results" hidden></div></div>
 <div class="language" aria-label="${tr('language')}"><button data-lang="tr" class="${language==='tr'?'active':''}" aria-pressed="${language==='tr'}">🇹🇷 TR</button><button data-lang="de" class="${language==='de'?'active':''}" aria-pressed="${language==='de'}">🇩🇪 DE</button></div><button class="icon-btn menu-btn" data-action="menu" aria-label="${tr('menu')}" aria-expanded="${mobileOpen}">☰</button></div></div>
 <nav class="mobilemenu ${mobileOpen?'open':''}" aria-label="Mobile">${nav.map(([url,title])=>`<a href="${hash(url)}">${title}</a>`).join('')}<a href="${hash('about')}">${tr('navAbout')}</a><a href="${hash('contact')}">${tr('navContact')}</a></nav></header>`;
}
function footer(){return `<footer class="foot"><div class="max footer-cols"><div><h3 class="goldtext">EJDER <i>Studio</i></h3><p>${tr('footerCopy')}</p><p class="small">TR 🇹🇷 &nbsp; | &nbsp; DE 🇩🇪</p></div><div><h3>${tr('navProducts')}</h3><ul>${COLLECTIONS.map(c=>`<li><a href="${hash('collection/'+c.id)}">${language==='de'?c.de:c.tr}</a></li>`).join('')}</ul></div><div><h3>${tr('navStudio')}</h3><ul><li><a href="${hash('templates')}">${tr('navTemplates')}</a></li><li><a href="${hash('saved')}">${tr('navSaved')}</a></li><li><a href="${hash('products')}">${tr('productChoice')}</a></li></ul></div><div><h3>EJDER</h3><ul><li><a href="${hash('about')}">${tr('navAbout')}</a></li><li><a href="${hash('contact')}">${tr('navContact')}</a></li><li><a href="${hash('legal')}">${tr('legal')}</a></li><li><a href="${hash('legal')}">${tr('privacy')}</a></li></ul></div></div><div class="max foot-bottom">© 2026 EJDER Studio · ${tr('footerReminder')}</div></footer>`}
function categoryCard(p){return `<a href="${hash('studio/'+p.id)}" class="card category-card"><div class="category-picture"><img loading="lazy" src="${AS+p.id}.webp" alt="${escapeHTML(name(p))}"></div><div class="card-body"><div><h3>${escapeHTML(name(p))}</h3><small>${escapeHTML(language==='de'?p.shortDe:p.shortTr)}</small></div><span class="circle-arrow" aria-hidden="true">↗</span></div></a>`}
function categoryGrid(list=PRODUCTS){return `<div class="category-grid">${list.map(categoryCard).join('')}</div>`}
function steps(){return `<div class="steps">${[1,2,3].map(n=>`<div class="card step"><span class="stepnum">${n}</span><div><h3>${tr('step'+n)}</h3><p>${tr('step'+n+'p')}</p></div></div>`).join('')}</div>`}
function templateGrid(){return `<div class="template-gallery">${TEMPLATE_IDS.map((id,i)=>`<button data-template-go="${id}" class="card template-show"><span class="template-glyph">${TEMPLATE_ICONS[i]}</span><h3>${tr('template_'+id)}</h3><span class="small muted">${tr('designStart')} →</span></button>`).join('')}</div>`}
function home(){return `<main><div class="max"><section class="hero"><div class="hero-copy"><div class="eyebrow">${tr('heroKicker')}</div><h1>${tr('heroTitleA')}<span>${tr('heroTitleB')}</span><span>${tr('heroTitleC')}</span></h1><p>${tr('heroP')}</p><div class="hero-actions"><a class="btn" href="${hash('studio/mug')}">✦ ${tr('start')} &nbsp; ↗</a><a class="btn secondary" href="${hash('products')}">${tr('browse')}</a></div></div><div class="hero-art"><img src="${AS}hero_showcase.webp" alt="EJDER Studio ürün ve hediye tasarımları"></div><i class="spark one">✦</i><i class="spark two">✧</i><i class="spark three">✦</i></section>
 <div class="features"><div class="feature"><b>✣</b> ${tr('feature1')}</div><div class="feature"><b>✎</b> ${tr('feature2')}</div><div class="feature"><b>◉</b> ${tr('feature3')}</div><div class="feature"><b>⇩</b> ${tr('feature4')}</div></div>
 <section class="section"><div class="eyebrow">${tr('categoriesKick')}</div><h2 class="section-title">${tr('categoriesTitle')}</h2><p class="muted">${tr('categoriesText')}</p>${categoryGrid()}</section>
 <section class="section" id="campaigns"><div class="eyebrow">EJDER ✦ STUDIO</div><h2 class="section-title">${tr('campaigns')}</h2><div class="promo-grid"><div class="card promo"><div><span class="pill">✦ MONOGRAM</span><b style="display:block;margin-top:20px">${tr('campaign1')}</b><p>${tr('campaign1s')}</p></div><a class="btn secondary tiny" href="${hash('studio/case')}">${tr('design')} ↗</a></div><div class="card promo"><div><span class="pill">♥ FOTOĞRAF</span><b style="display:block;margin-top:20px">${tr('campaign2')}</b><p>${tr('campaign2s')}</p></div><a class="btn secondary tiny" href="${hash('studio/poster')}">${tr('design')} ↗</a></div><div class="card promo"><div><span class="pill">✧ 3D</span><b style="display:block;margin-top:20px">${tr('campaign3')}</b><p>${tr('campaign3s')}</p></div><a class="btn secondary tiny" href="#gift-demo">${tr('giftOpen')} ↗</a></div></div><div class="disclaimer">${tr('campaignNote')}</div></section>
 <section class="section"><h2 class="section-title">${tr('how')}</h2>${steps()}</section>
 <section class="gift-demo card" id="gift-demo"><div><span class="eyebrow">✦ EJDER GIFT EXPERIENCE</span><h2>${tr('giftHead')}</h2><p>${tr('giftDesc')}</p><button class="btn" data-action="gift-toggle" aria-expanded="false">${tr('giftOpen')}</button></div><div class="gift-stage" aria-label="${tr('giftPreview')}"><div class="gift-glow"></div><div class="gift-thing"><div class="gift-product">☕</div><div class="gift-base"></div><div class="gift-lid"></div><div class="gift-bow">🎀</div></div></div></section>
 <section class="section"><div class="eyebrow">EJDER DESIGN COLLECTION</div><h2 class="section-title">${tr('allTemplates')}</h2><p class="muted">${tr('allTemplatesText')}</p>${templateGrid()}</section></div></main>`}
function productsPage(){return `<main class="max"><div class="pagehead"><div class="eyebrow">EJDER ✦ CUSTOM</div><h1>${tr('productChoice')}</h1><p>${tr('categoriesText')}</p></div>${categoryGrid()}<div class="section"><h2 class="section-title">${tr('how')}</h2>${steps()}</div></main>`}
function collectionsPage(id){const c=COLLECTIONS.find(x=>x.id===id)||COLLECTIONS[0]; const [p1,p2]=c.product.map(product);return `<main class="max"><section class="collection-head"><div><div class="eyebrow">EJDER STUDIO • PERSONALIZE</div><h1>${language==='de'?c.de:c.tr}</h1><p>${tr('collectionDesc')}</p><a href="${hash('studio/'+p1.id)}" class="btn tiny">${tr('start')} ↗</a></div><img src="${AS+c.art}" alt="${escapeHTML(language==='de'?c.de:c.tr)}"></section><div class="duo-grid">${[p1,p2].map(p=>`<article class="card duo-card"><div class="duo-visual"><img src="${AS+p.id}.webp" alt="${escapeHTML(name(p))}"></div><div class="duo-text"><div><h2>${escapeHTML(name(p))}</h2><p>${escapeHTML(language==='de'?p.shortDe:p.shortTr)}</p></div><a class="btn" href="${hash('studio/'+p.id)}">${tr('designStart')} ↗</a></div></article>`).join('')}</div><div class="section"><h2 class="section-title">${tr('templateTitle')}</h2>${templateGrid()}</div></main>`}
function campaignsPage(){return `<main class="max"><div class="pagehead"><span class="eyebrow">EJDER CREATIVE</span><h1>${tr('campaigns')}</h1><p>${tr('campaignNote')}</p></div><div class="promo-grid"><div class="card promo"><div><span class="pill">✦</span><b style="display:block;margin-top:20px">${tr('campaign1')}</b><p>${tr('campaign1s')}</p></div><a class="btn tiny" href="${hash('studio/mug')}">${tr('start')}</a></div><div class="card promo"><div><span class="pill">♡</span><b style="display:block;margin-top:20px">${tr('campaign2')}</b><p>${tr('campaign2s')}</p></div><a class="btn tiny" href="${hash('studio/keychain')}">${tr('start')}</a></div><div class="card promo"><div><span class="pill">✧</span><b style="display:block;margin-top:20px">${tr('campaign3')}</b><p>${tr('campaign3s')}</p></div><a class="btn tiny" href="${hash('studio/giftbox')}">${tr('start')}</a></div></div><div class="section">${categoryGrid()}</div></main>`}
function templatesPage(){return `<main class="max"><div class="pagehead"><div class="eyebrow">EJDER STYLE COLLECTION</div><h1>${tr('allTemplates')}</h1><p>${tr('allTemplatesText')}</p></div>${templateGrid()}<div class="section"><h2 class="section-title">${tr('productChoice')}</h2>${categoryGrid()}</div></main>`}
function savedPage(){const items=getSaved();return `<main class="max"><div class="pagehead"><div class="eyebrow">EJDER LOCAL GALLERY</div><h1>${tr('savedHead')}</h1><p>${tr('savedDesc')}</p></div>${items.length?`<div class="saved-grid">${items.map(it=>`<article class="card saved-item"><img src="${it.snapshot}" alt="${escapeHTML(it.product)}"><h3>${escapeHTML(name(product(it.product)))}</h3><div class="muted small">${tr('date')}: ${escapeHTML(new Date(it.date).toLocaleDateString(language==='de'?'de-DE':'tr-TR'))}</div><div class="actions"><button class="btn tiny" data-open-project="${escapeHTML(it.id)}">${tr('open')}</button><button class="btn danger tiny" data-delete-project="${escapeHTML(it.id)}">${tr('delete')}</button></div></article>`).join('')}</div>`:`<div class="text-panel card"><p>${tr('noSaved')}</p><a class="btn" href="${hash('studio/mug')}">${tr('start')}</a></div>`}</main>`}
function infoPage(type){let title=tr(type==='about'?'aboutTitle':type==='legal'?'legalTitle':'contactTitle');let msg=tr(type==='about'?'aboutP':type==='legal'?'legalP':'contactP');return `<main class="max"><div class="pagehead"><div class="eyebrow">EJDER ✦ STUDIO</div><h1>${title}</h1></div><div class="text-panel card"><p>${msg}</p>${type==='contact'?`<div class="contact-form"><label>${tr('name')}<input disabled placeholder="${tr('name')}"></label><label>${tr('email')}<input disabled placeholder="${tr('email')}"></label><label>${tr('message')}<textarea disabled placeholder="${tr('message')}"></textarea></label><button class="btn" disabled>${tr('contactDisabled')}</button></div>`:type==='about'?`<div class="steps" style="margin-top:30px"><div class="card step"><span class="stepnum">1</span><div><h3>${tr('aboutCard1')}</h3><p>${tr('aboutCard1p')}</p></div></div><div class="card step"><span class="stepnum">2</span><div><h3>${tr('aboutCard2')}</h3><p>${tr('aboutCard2p')}</p></div></div><div class="card step"><span class="stepnum">3</span><div><h3>${tr('aboutCard3')}</h3><p>${tr('aboutCard3p')}</p></div></div></div>`:''}</div></main>`}

/* ------------------------------------------------------------
   EJDER Studio: complete interactive demo, deliberately local.
   User photographs never leave the browser and are NEVER saved.
   ------------------------------------------------------------ */
const STORE_KEY = 'ejder_designs_v1';
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_SIDE = 900;
const TARGET_IMAGE_BYTES = 350 * 1024;
let imageTicket = 0, selectedBounds = [], pendingTemplate = null;
let editorRoute = null;

function words(a, b) { return language === 'de' ? b : a; }
function makeEditor(id) {
  return {
    product: PRODUCTS.some(p => p.id === id) ? id : 'mug',
    template: 'monogram', productColor: '#faf0dc', layers: [], selected: null,
    tool: 'text', projectId: null, boxOpen: false
  };
}
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
function textLayer(text = tr('sampleText')) {
  return {id:newId(),type:'text',text:String(text).slice(0,80),font:'serif',color:'#e8b974',size:68,angle:0,x:.5,y:.5};
}
function addText(text = tr('sampleText')) {
  rememberUndo();
  const l = textLayer(text);
  editor.layers.push(l); editor.selected=l.id; editor.tool='text';
  refreshStudio();
}
function applyTemplate(id) {
  if (!TEMPLATE_IDS.includes(id)) id='monogram';
  rememberUndo();
  editor.template=id;
  const sample={monogram:'E',floral:'✿',nature:'△',pet:'♡',heart:'♥',minimal:'EJDER',dragon:'🐉',night:'☾'}[id];
  editor.layers=editor.layers.filter(l=>l.type==='image');
  const l=textLayer(sample);
  l.size=id==='minimal'?54:78;
  l.color=['#e6c085','#ae315d','#e3b887','#b87c45','#ad183c','#e2b37c','#d9a34c','#e2c8aa'][TEMPLATE_IDS.indexOf(id)];
  editor.layers.push(l); editor.selected=l.id; editor.tool='text';
  refreshStudio();
}
function snapshotUndo() {
  return JSON.stringify({product:editor.product,template:editor.template,productColor:editor.productColor,layers:editor.layers,selected:editor.selected});
}
function rememberUndo() { undoStack.push(snapshotUndo()); if (undoStack.length>22) undoStack.shift(); redoStack.length=0; }
function restoreUndo(raw) {
  try { const state=JSON.parse(raw); if (state.product!==editor.product) return;
    editor.template=state.template;editor.productColor=state.productColor;
    editor.layers=state.layers.filter(l=>l.type!=='image' || cachedImages.has(l.key));
    editor.selected=editor.layers.some(l=>l.id===state.selected)?state.selected:null;
    refreshStudio();
  } catch { /* bad history is ignored */ }
}
function selectedLayer() {return editor.layers.find(l=>l.id===editor.selected) || null;}
function temporaryImagesCount(){return cachedImages.size;}
function totalTemporaryKB(){let n=0;for(const p of cachedImages.values()) n+=p.bytes||0;return Math.round(n/1024);}
function disposeTemporaryPhotos(updateUI=true) {
  imageTicket++; // cancels any photo currently being processed
  for (const photo of cachedImages.values()) {
    if(photo.url) URL.revokeObjectURL(photo.url);
    photo.img.onload=null;
    photo.img.onerror=null;
    photo.img.src='';
  }
  cachedImages.clear();
  editor.layers=editor.layers.filter(l=>l.type!=='image');
  if(!editor.layers.some(l=>l.id===editor.selected)) editor.selected=null;
  undoStack=[];redoStack=[];
  const input=document.getElementById('photoInput');if(input)input.value='';
  if(updateUI)refreshStudio();
}
function cleanProjectForStorage(){
  return {
    id: editor.projectId || newId(), product: editor.product,
    template: editor.template,
    productColor: COLORS.includes(editor.productColor)?editor.productColor:'#faf0dc',
    layers: editor.layers.filter(l=>l.type==='text').slice(0,15).map(l=>({
      id:String(l.id),type:'text',text:String(l.text||'').slice(0,80),
      font:FONTS[l.font]?l.font:'serif',color:/^#[a-f\d]{6}$/i.test(l.color)?l.color:'#e8b974',
      size:Math.min(130,Math.max(22,Number(l.size)||60)),
      angle:Math.min(180,Math.max(-180,Number(l.angle)||0)),
      x:Math.min(1,Math.max(0,Number(l.x)||.5)), y:Math.min(1,Math.max(0,Number(l.y)||.5))
    })),
    snapshot:AS+editor.product+'.webp', // public stock illustration only; never the customer's photo
    date:new Date().toISOString()
  };
}
function notify(message){
  document.querySelector('.toast')?.remove();
  const n=document.createElement('div');n.className='toast';n.setAttribute('role','status');
  n.textContent=message;document.body.appendChild(n);
  clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>n.remove(),4200);
}
function studioPage(){
  const choice=product(editor.product),sel=selectedLayer();
  return `<main class="max studio-page">
    <div class="pagehead"><div class="eyebrow">✦ EJDER STUDIO • PERSONALIZE ✦</div><h1>${tr('studioHeading')}</h1><p>${tr('studioSub')}</p></div>
    <div class="privacy-banner" role="note"><span aria-hidden="true">🔒</span><div><strong>${words('Fotoğraflar cihazında kalır.','Deine Fotos bleiben auf deinem Gerät.')}</strong><br>${words('Yüklenince en fazla 900 piksele küçültülür, sıkıştırılır; sunucuya gönderilmez ve işlem bittiğinde silinir.','Beim Laden auf höchstens 900 Pixel verkleinert und komprimiert; keine Server-Uploads, nach Abschluss gelöscht.')}</div></div>
    <div class="studio-grid">
      <aside class="card studio-side"><h2>✎ ${tr('navStudio')}</h2>
        <div class="toolmenu">
          <button type="button" data-tool="product"><span class="symbol">♢</span>${tr('selectProduct')}</button>
          <button type="button" data-tool="photo"><span class="symbol">▧</span>${tr('upload')}</button>
          <button type="button" data-action="add-text"><span class="symbol">T</span>${tr('addText')}</button>
          <button type="button" data-tool="colors"><span class="symbol">◉</span>${tr('colors')}</button>
          <button type="button" data-tool="templates"><span class="symbol">♛</span>${tr('templates')}</button>
          <button type="button" data-tool="layers"><span class="symbol">≡</span>${tr('layers')}</button>
        </div>
        <div class="tool-form" id="toolForm">
          <label for="productSelect">${tr('selectProduct')}</label><select id="productSelect">${PRODUCTS.map(p=>`<option value="${p.id}" ${p.id===editor.product?'selected':''}>${escapeHTML(name(p))}</option>`).join('')}</select>
          <label for="photoInput">${tr('upload')} <small>(JPG / PNG / WebP • ${words('en fazla 10 MB','max. 10 MB')})</small></label>
          <input id="photoInput" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="photoPrivacyInfo">
          <div class="mini-help" id="photoPrivacyInfo">${words('Fotoğraf önce küçültülür; EXIF metadata çıkarılır. Aynı anda en fazla 3 fotoğraf.','Fotos werden verkleinert, EXIF-Metadaten entfernt. Maximal 3 Fotos gleichzeitig.')}</div>
          <div class="privacy-state" id="privacyState" aria-live="polite"></div>
          <button type="button" class="btn secondary tiny" data-action="delete-photos">${words('Geçici fotoğrafları sil','Temporäre Fotos löschen')}</button>
          <div class="form-divider"></div>
          <label for="textInput">${tr('typeText')}</label>
          <input id="textInput" type="text" maxlength="80" value="${escapeHTML(sel?.type==='text'?sel.text:'')}" placeholder="${escapeHTML(tr('sampleText'))}">
          <button class="btn secondary tiny" type="button" data-action="add-text">+ ${tr('addText')}</button>
          <label for="fontSelect">${tr('chooseFont')}</label><select id="fontSelect"><option value="serif">Elegant Serif</option><option value="script">Script</option><option value="sans">Modern Sans</option></select>
          <label for="textColorInput">${tr('textColor')}</label><input id="textColorInput" type="color" value="${sel?.color||'#e8b974'}">
          <label for="sizeInput">${tr('size')} <output id="sizeOutput">${sel?.size||68}</output></label><input id="sizeInput" type="range" min="22" max="130" value="${sel?.size||68}">
          <label for="angleInput">${tr('rotation')} <output id="angleOutput">${sel?.angle||0}°</output></label><input id="angleInput" type="range" min="-180" max="180" value="${sel?.angle||0}">
          <label>${tr('productColor')}</label><div class="palette" role="group" aria-label="${tr('productColor')}">${COLORS.map(c=>`<button type="button" class="colorbtn ${c===editor.productColor?'active':''}" data-color="${c}" style="background:${c}" aria-label="${c}" aria-pressed="${c===editor.productColor}"></button>`).join('')}</div>
          <div class="form-divider"></div><label>${tr('layers')}</label>
          <div class="layer-list">${editor.layers.map((l,i)=>`<button type="button" data-layer-id="${escapeHTML(l.id)}" class="layer-item ${l.id===editor.selected?'active':''}">${l.type==='image'?'▧':'T'} &nbsp;${l.type==='image'?words('Geçici fotoğraf','Temporäres Foto'):escapeHTML(l.text||'Text')} <span>${i+1}</span></button>`).join('')}</div>
          <button type="button" class="btn secondary tiny" data-action="remove-layer">✕ ${tr('deleteLayer')}</button>
        </div>
      </aside>
      <section class="card studio-canvas-wrap">
        <div class="canvas-head"><h2>${tr('editArea')}</h2><span class="eyebrow">✦ ${escapeHTML(name(choice))}</span></div>
        <div class="canvas-outer"><canvas id="studioCanvas" width="${W}" height="${H}" aria-label="${tr('editArea')}"></canvas></div>
        <p class="studio-hint">${tr('productHint')}</p>
        <div class="canvas-foot"><button type="button" class="btn secondary tiny" data-action="undo">↶ ${tr('undo')}</button><button type="button" class="btn secondary tiny" data-action="redo">↷ ${tr('redo')}</button></div>
        <div class="editor-template-header"><h3>✦ ${tr('allTemplates')}</h3></div>
        <div class="editor-templates">${TEMPLATE_IDS.map((id,i)=>`<button type="button" data-template="${id}" class="template-btn ${editor.template===id?'active':''}"><span aria-hidden="true">${TEMPLATE_ICONS[i]}</span>${tr('template_'+id)}</button>`).join('')}</div>
      </section>
      <aside class="card studio-preview"><h2>◉ ${tr('preview')}</h2>
        <div class="preview-frame"><canvas id="studioPreview" width="450" height="325" aria-label="${tr('preview')}"></canvas></div>
        <div class="controlgroup"><h3>${words('Seçilen ürün','Gewähltes Produkt')}</h3><img loading="lazy" src="${AS+editor.product}.webp" alt="${escapeHTML(name(choice))}" class="product-preview-image"><p>${escapeHTML(name(choice))}</p></div>
        <div class="controlgroup"><h3>${words('Fotoğraf gizliliği','Foto-Datenschutz')}</h3><p>${words('Fotoğraflar hiçbir sunucuya veya kalıcı depoya yüklenmez. Tasarımı kaydedince yalnızca yazı/renk bilgileri kalır. PNG indirince fotoğraflar tarayıcı belleğinden temizlenir.','Fotos werden nicht an Server oder dauerhafte Speicher übertragen. Beim Speichern bleiben nur Text und Farben. Nach dem PNG-Download werden Fotos aus dem Browser-Speicher entfernt.')}</p></div>
        <div class="studio-panel-actions"><button class="btn secondary tiny" type="button" data-action="save">▣ ${tr('save')}</button><button class="btn tiny" type="button" data-action="download">↓ PNG</button></div>
        <button class="btn danger studio-finish" type="button" data-action="finish">✓ ${words('İşlemi bitir ve fotoğrafları sil','Fertig & Fotos löschen')}</button>
      </aside>
    </div>
    <div class="disclaimer">${tr('editorNote')}</div>
  </main>`;
}

/* An intentionally stylized product mockup. This is not a production 3-D or print engine. */
function round(ctx,x,y,w,h,r=12){ctx.beginPath();ctx.roundRect(x,y,w,h,Math.min(r,w/2,h/2));}
function fillRound(ctx,x,y,w,h,r=12){round(ctx,x,y,w,h,r);ctx.fill();}
function strokeRound(ctx,x,y,w,h,r=12){round(ctx,x,y,w,h,r);ctx.stroke();}
function printArea(){
  switch(editor.product){
    case 'case':return {x:368,y:215,w:166,h:275};
    case 'mug':return {x:342,y:275,w:228,h:175};
    case 'shirt':return {x:352,y:290,w:196,h:200};
    case 'keychain':return {x:352,y:300,w:196,h:150};
    case 'hoodie':return {x:350,y:290,w:200,h:195};
    case 'tote':return {x:345,y:320,w:210,h:170};
    case 'poster':return {x:346,y:182,w:210,h:322};
    case 'giftbox':return {x:331,y:369,w:238,h:127};
  }
}
function drawBackground(ctx){
  const base=ctx.createRadialGradient(465,340,20,450,330,590);
  base.addColorStop(0,'#6c2035');base.addColorStop(.48,'#2f0c1b');base.addColorStop(1,'#10060e');
  ctx.fillStyle=base;ctx.fillRect(0,0,W,H);
  ctx.globalAlpha=.09;
  for(let i=0;i<20;i++){
    const x=i*68-110;let g=ctx.createLinearGradient(x,0,x+85,0);
    g.addColorStop(0,'#000');g.addColorStop(.45,'#ef5364');g.addColorStop(1,'#170411');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+95,0);ctx.bezierCurveTo(x+15,205,x+95,430,x+45,650);ctx.lineTo(x-25,650);ctx.closePath();ctx.fill();
  }ctx.globalAlpha=1;
  const glow=ctx.createRadialGradient(450,490,50,450,480,320);glow.addColorStop(0,'#ffcb7c31');glow.addColorStop(1,'#fa934700');ctx.fillStyle=glow;ctx.fillRect(0,100,W,550);
  ctx.save();ctx.shadowColor='#f29c40';ctx.shadowBlur=27;ctx.strokeStyle='#d69a55';ctx.lineWidth=6;
  ctx.beginPath();ctx.ellipse(450,548,308,51,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  ctx.fillStyle='#f8d6a1';ctx.textAlign='center';ctx.font='italic 28px Georgia';ctx.fillText('EJDER Studio',450,610);
  for(let i=0;i<25;i++){
    const sx=67+(i*137)%765,sy=36+(i*71)%507;
    ctx.globalAlpha=.17+(i%3)*.11;ctx.fillStyle='#ffe5b5';ctx.fillRect(sx,sy,i%4===0?3:2,i%4===0?3:2);
  }ctx.globalAlpha=1;
}
function materialGradient(ctx,x,y,w){let gr=ctx.createLinearGradient(x,y,x+w,y);gr.addColorStop(0,'#ad7f68');gr.addColorStop(.16,editor.productColor);gr.addColorStop(.53,editor.productColor);gr.addColorStop(.87,editor.productColor);gr.addColorStop(1,'#936d52');return gr;}
function drawMockup(ctx){
  const id=editor.product;
  ctx.save();ctx.shadowColor='#000a';ctx.shadowBlur=28;ctx.shadowOffsetY=15;
  ctx.strokeStyle='#f9d49a';ctx.lineWidth=5;
  if(id==='case'){
    ctx.fillStyle=materialGradient(ctx,335,150,230);fillRound(ctx,333,120,234,422,36);strokeRound(ctx,333,120,234,422,36);
    ctx.fillStyle='#341324';fillRound(ctx,354,140,76,89,22);
    for(const [x,y] of [[374,164],[407,164],[388,201]]){ctx.beginPath();ctx.arc(x,y,13,0,7);ctx.fillStyle='#131017';ctx.fill();ctx.strokeStyle='#bd8e50';ctx.lineWidth=3;ctx.stroke();}
    ctx.fillStyle='#e4c692';fillRound(ctx,416,523,64,5,3);
  }else if(id==='mug'){
    ctx.strokeStyle='#e7b672';ctx.lineWidth=27;ctx.beginPath();ctx.ellipse(603,342,82,95,0,0,7);ctx.stroke();ctx.strokeStyle='#fff0bd';ctx.lineWidth=7;ctx.stroke();
    ctx.fillStyle=materialGradient(ctx,275,205,315);fillRound(ctx,278,222,312,275,23);
    let lip=ctx.createLinearGradient(0,210,0,240);lip.addColorStop(0,'#b47737');lip.addColorStop(.5,'#ffe3ac');lip.addColorStop(1,'#c0803e');ctx.fillStyle=lip;ctx.beginPath();ctx.ellipse(434,224,158,25,0,0,7);ctx.fill();
    ctx.fillStyle='#401b27';ctx.beginPath();ctx.ellipse(434,221,139,13,0,0,7);ctx.fill();
  }else if(id==='shirt'||id==='hoodie'){
    ctx.fillStyle=materialGradient(ctx,280,200,340);ctx.beginPath();ctx.moveTo(357,171);
    ctx.lineTo(298,208);ctx.lineTo(222,315);ctx.lineTo(296,358);ctx.lineTo(323,328);ctx.lineTo(323,540);ctx.lineTo(577,540);ctx.lineTo(577,328);ctx.lineTo(608,358);ctx.lineTo(679,315);ctx.lineTo(603,208);ctx.lineTo(543,171);
    if(id==='hoodie'){ctx.quadraticCurveTo(488,121,450,138);ctx.quadraticCurveTo(410,121,357,171);}else{ctx.quadraticCurveTo(450,235,357,171);}ctx.closePath();ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;ctx.strokeStyle='#eccd9f99';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(357,171);ctx.quadraticCurveTo(450,235,543,171);ctx.stroke();
    if(id==='hoodie'){ctx.strokeStyle='#e7c798';ctx.beginPath();ctx.moveTo(415,208);ctx.lineTo(408,284);ctx.moveTo(485,208);ctx.lineTo(492,284);ctx.stroke();ctx.strokeStyle='#ba8f5c';strokeRound(ctx,391,445,118,73,20);}
  }else if(id==='keychain'){
    ctx.shadowBlur=16;ctx.strokeStyle='#f7c989';ctx.lineWidth=13;ctx.beginPath();ctx.arc(450,145,56,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#deb674';fillRound(ctx,439,185,22,65,8);
    ctx.fillStyle=materialGradient(ctx,313,260,274);ctx.beginPath();ctx.arc(450,378,150,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f4c477';ctx.lineWidth=12;ctx.stroke();
  }else if(id==='tote'){
    ctx.shadowBlur=0;ctx.strokeStyle='#e9c38f';ctx.lineWidth=23;ctx.beginPath();ctx.moveTo(350,276);ctx.bezierCurveTo(333,82,562,93,549,276);ctx.stroke();
    ctx.shadowBlur=24;ctx.fillStyle=materialGradient(ctx,280,237,340);fillRound(ctx,287,240,326,302,9);ctx.strokeStyle='#efdbb9';ctx.lineWidth=4;strokeRound(ctx,287,240,326,302,9);
  }else if(id==='poster'){
    ctx.fillStyle='#926031';fillRound(ctx,275,113,350,450,6);ctx.fillStyle='#e5bc73';fillRound(ctx,286,124,328,428,3);
    ctx.fillStyle='#281723';fillRound(ctx,310,146,280,382,2);ctx.strokeStyle='#fff0bc';ctx.lineWidth=2;strokeRound(ctx,310,146,280,382,2);
  }else if(id==='giftbox'){
    ctx.fillStyle=materialGradient(ctx,273,275,354);fillRound(ctx,271,306,358,243,8);ctx.strokeStyle='#ffcc79';ctx.lineWidth=4;strokeRound(ctx,271,306,358,243,8);
    ctx.fillStyle='#ca963f';ctx.fillRect(433,305,35,244);
    ctx.fillStyle='#802139';fillRound(ctx,258,266,385,70,10);ctx.strokeStyle='#f3c17b';strokeRound(ctx,258,266,385,70,10);
    ctx.fillStyle='#eabe75';ctx.fillRect(430,266,40,72);
    ctx.strokeStyle='#f3ce92';ctx.lineWidth=12;
    ctx.beginPath();ctx.ellipse(410,259,38,23,-.4,0,7);ctx.ellipse(490,259,38,23,.4,0,7);ctx.stroke();
  }
  ctx.restore();
}
function drawCanvasTo(canvas,includePhotos=true,showSelection=false) {
  if(!canvas) return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  ctx.save();ctx.scale(canvas.width/W,canvas.height/H);
  drawBackground(ctx);drawMockup(ctx);
  const area=printArea();if(showSelection) selectedBounds=[];
  // Transparent print area: guides on the editing canvas only.
  if(showSelection){ctx.save();ctx.strokeStyle='#e3ad6577';ctx.lineWidth=1.5;ctx.setLineDash([8,7]);strokeRound(ctx,area.x,area.y,area.w,area.h,11);ctx.restore();}
  ctx.save();round(ctx,area.x,area.y,area.w,area.h,10);ctx.clip();
  for(const layer of editor.layers){
    if(layer.type==='image'&&!includePhotos)continue;
    const x=area.x+area.w*layer.x,y=area.y+area.h*layer.y;
    ctx.save();ctx.translate(x,y);ctx.rotate((layer.angle||0)*Math.PI/180);
    if(layer.type==='image'){
      const ph=cachedImages.get(layer.key);
      if(ph && ph.img.complete && ph.img.naturalWidth){
        const iw=Math.min(area.w*.95,layer.size||175);
        const ih=iw*ph.img.naturalHeight/ph.img.naturalWidth;
        ctx.drawImage(ph.img,-iw/2,-ih/2,iw,ih);
        if(showSelection)selectedBounds.push({id:layer.id,x,y,w:iw,h:ih});
      }
    }else{
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`${layer.font==='script'?'italic ':'600 '}${layer.size||68}px ${FONTS[layer.font]||FONTS.serif}`;
      const txt=String(layer.text||'').slice(0,80);
      let width=ctx.measureText(txt).width;
      // No design data is modified; only visually scaled to fit the printable panel.
      const factor=Math.min(1,(area.w*.95)/Math.max(1,width));ctx.scale(factor,factor);
      ctx.shadowColor='#120612bb';ctx.shadowBlur=4;ctx.strokeStyle='#0006';ctx.lineWidth=1.2;ctx.strokeText(txt,0,0);
      ctx.fillStyle=layer.color||'#eab76d';ctx.fillText(txt,0,0);
      if(showSelection)selectedBounds.push({id:layer.id,x,y,w:Math.min(width,area.w*.95),h:Math.max(30,layer.size)});
    }
    ctx.restore();
  }
  ctx.restore();
  if(showSelection){
    const b=selectedBounds.find(b=>b.id===editor.selected);
    if(b){ctx.save();ctx.strokeStyle='#ffe6a6';ctx.setLineDash([7,4]);ctx.lineWidth=2;ctx.strokeRect(b.x-b.w/2-7,b.y-b.h/2-7,b.w+14,b.h+14);ctx.setLineDash([]);ctx.fillStyle='#ffdc8c';for(const x of [b.x-b.w/2-7,b.x+b.w/2+7])for(const y of [b.y-b.h/2-7,b.y+b.h/2+7])ctx.fillRect(x-4,y-4,8,8);ctx.restore();}
  }
  ctx.restore();
}
function drawStudio(){
  studioCanvas=document.getElementById('studioCanvas');if(!studioCanvas)return;
  drawCanvasTo(studioCanvas,true,true);
  const smaller=document.getElementById('studioPreview');
  if(smaller)drawCanvasTo(smaller,true,false);
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
  drawStudio();
  attachCanvasPointer();
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
    l.x=Math.min(1,Math.max(0,l.x+(p.x-dragging.from.x)/area.w));
    l.y=Math.min(1,Math.max(0,l.y+(p.y-dragging.from.y)/area.h));
    dragging.from=p;drawStudio();
  });
  for(const e of ['pointerup','pointercancel','lostpointercapture'])studioCanvas.addEventListener(e,()=>{dragging=null;studioCanvas.classList.remove('dragging')});
}
function updateControlValues(){
  const sel=selectedLayer();
  const tx=document.getElementById('textInput');if(tx)tx.value=sel?.type==='text'?sel.text:'';
  const fs=document.getElementById('fontSelect');if(fs)fs.value=sel?.font||'serif';
  const clr=document.getElementById('textColorInput');if(clr)clr.value=sel?.color||'#e8b974';
  const range=document.getElementById('sizeInput');if(range)range.value=sel?.size||68;
  const sz=document.getElementById('sizeOutput');if(sz)sz.textContent=sel?.size||68;
  const rot=document.getElementById('angleInput');if(rot)rot.value=sel?.angle||0;
  const rt=document.getElementById('angleOutput');if(rt)rt.textContent=(sel?.angle||0)+'°';
  for(const b of ROOT.querySelectorAll('[data-layer-id]'))b.classList.toggle('active',b.dataset.layerId===editor.selected);
}
async function processPhotoFile(file){
  const accepted=['image/jpeg','image/png','image/webp'];
  if(!file||!accepted.includes(file.type)||file.size>MAX_FILE_BYTES||file.size===0){notify(tr('toastBadFile'));return;}
  if(cachedImages.size>=3){notify(words('En fazla 3 geçici fotoğraf kullanılabilir.','Maximal 3 temporäre Fotos möglich.'));return;}
  const myTicket=++imageTicket;
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
    for(const q of [.80,.66,.52,.42]){
      compressed=await new Promise(resolve=>work.toBlob(resolve,'image/webp',q));
      if(compressed?.type!=='image/webp') compressed=await new Promise(resolve=>work.toBlob(resolve,'image/jpeg',q));
      if(compressed && compressed.size<=TARGET_IMAGE_BYTES)break;
    }
    if(!compressed)throw new Error('Photo compression failed');
    if(myTicket!==imageTicket)return;
    resultURL=URL.createObjectURL(compressed);
    const small=new Image();
    await new Promise((resolve,reject)=>{small.onload=resolve;small.onerror=reject;small.src=resultURL});
    if(myTicket!==imageTicket)return;
    const key=newId();
    cachedImages.set(key,{img:small,url:resultURL,bytes:compressed.size});resultURL=null;
    rememberUndo();
    const l={id:newId(),type:'image',key,x:.5,y:.5,size:Math.min(175,printArea().w*.92),angle:0};
    editor.layers.push(l);editor.selected=l.id;editor.tool='photo';
    refreshStudio();
    notify(words(`Fotoğraf ${w}×${h} piksele küçültüldü (${Math.round(compressed.size/1024)} KB). Sunucuya gönderilmedi.`,`Foto verkleinert auf ${w}×${h} Pixel (${Math.round(compressed.size/1024)} KB). Kein Upload.`));
  }catch(err){console.error('Local image processing error',err);notify(words('Fotoğraf okunamadı veya küçültülemedi.','Foto konnte nicht gelesen oder verkleinert werden.'));}
  finally{
    if(originalBitmap)originalBitmap.close();
    if(tempURL)URL.revokeObjectURL(tempURL);
    if(resultURL)URL.revokeObjectURL(resultURL);
    if(originalImage){originalImage.onload=null;originalImage.onerror=null;originalImage.src='';}
    const input=document.getElementById('photoInput');if(input)input.value='';
  }
}
function downloadCanvas(){
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  drawCanvasTo(canvas,true,false);
  canvas.toBlob(blob=>{
    if(!blob){notify(words('PNG oluşturulamadı.','PNG konnte nicht erzeugt werden.'));return;}
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='EJDER-Studio-'+editor.product+'-'+new Date().toISOString().slice(0,10)+'.png';
    document.body.appendChild(a);a.click();a.remove();
    // The only permanent user photo is the file downloaded by explicit action.
    setTimeout(()=>URL.revokeObjectURL(url),2000);
    const hadPhotos=cachedImages.size>0;
    disposeTemporaryPhotos();
    notify(hadPhotos?words('PNG indirildi. Fotoğraflar geçici bellekten silindi.','PNG heruntergeladen. Temporäre Fotos wurden gelöscht.'):tr('toastDownloaded'));
  },'image/png');
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
function loadSavedProject(id){
  const p=getSaved().find(p=>p.id===id);if(!p)return;
  disposeTemporaryPhotos(false);
  editor=makeEditor(p.product);
  editor.projectId=p.id;editor.template=p.template||'minimal';editor.productColor=p.productColor||'#faf0dc';
  editor.layers=(Array.isArray(p.layers)?p.layers:[]).filter(l=>l.type==='text').slice(0,15).map(l=>({...l,type:'text'}));
  editor.selected=editor.layers[0]?.id||null;
  window.location.hash=hash('studio/'+p.product);
  if(currentRoute()[0]==='studio')refreshStudio();
}
function render(){
  const route=currentRoute(), page=route[0]||'home';
  let main='';
  switch(page){
    case 'home':main=home();break;
    case 'products':main=productsPage();break;
    case 'campaigns':main=campaignsPage();break;
    case 'collection':main=collectionsPage(route[1]);break;
    case 'studio':
      if(editor.product!==(route[1]||'mug')){
        disposeTemporaryPhotos(false);editor=makeEditor(route[1]);
      }
      if(pendingTemplate){applyTemplate(pendingTemplate);pendingTemplate=null;}
      main=studioPage();break;
    case 'templates':main=templatesPage();break;
    case 'saved':main=savedPage();break;
    case 'about':case 'contact':case 'legal':main=infoPage(page);break;
    default:main=home();
  }
  ROOT.innerHTML=header()+main+footer();
  document.documentElement.lang=language;
  if(page==='studio'){drawStudio();attachCanvasPointer();updateControlValues();}
  activeRoute=window.location.hash||'#/';
}

ROOT.addEventListener('click', ev=>{
  const action=ev.target.closest('[data-action]');
  const bcolor=ev.target.closest('[data-color]');
  const template=ev.target.closest('[data-template]');
  const templateGo=ev.target.closest('[data-template-go]');
  const layer=ev.target.closest('[data-layer-id]');
  const lang=ev.target.closest('[data-lang]');
  const openProject=ev.target.closest('[data-open-project]');
  const delProject=ev.target.closest('[data-delete-project]');
  const tool=ev.target.closest('[data-tool]');
  if(lang){language=lang.dataset.lang==='de'?'de':'tr';writeStore('ejder_lang',language);render();return;}
  if(bcolor){rememberUndo();editor.productColor=bcolor.dataset.color;refreshStudio();return;}
  if(template){applyTemplate(template.dataset.template);return;}
  if(templateGo){
    pendingTemplate=templateGo.dataset.templateGo;
    if(currentRoute()[0]==='studio'){applyTemplate(pendingTemplate);pendingTemplate=null;}
    else window.location.hash=hash('studio/mug');
    return;
  }
  if(layer){editor.selected=layer.dataset.layerId;updateControlValues();drawStudio();return;}
  if(tool){
    editor.tool=tool.dataset.tool;
    const focusId={product:'productSelect',photo:'photoInput',colors:'textColorInput',templates:null,layers:null}[editor.tool];
    if(focusId)document.getElementById(focusId)?.focus();
    if(editor.tool==='templates')document.querySelector('.editor-templates')?.scrollIntoView({behavior:'smooth',block:'center'});
    if(editor.tool==='layers')document.querySelector('.layer-list')?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  if(openProject){loadSavedProject(openProject.dataset.openProject);return;}
  if(delProject){putSaved(getSaved().filter(p=>p.id!==delProject.dataset.deleteProject));render();notify(tr('toastDeleted'));return;}
  if(!action)return;
  switch(action.dataset.action){
    case 'menu':mobileOpen=!mobileOpen;render();return;
    case 'gift-toggle':{
      const stage=document.querySelector('.gift-stage');const opened=stage?.classList.toggle('opened');
      action.textContent=opened?tr('giftClose'):tr('giftOpen');action.setAttribute('aria-expanded',String(!!opened));return;
    }
    case 'add-text':addText();return;
    case 'remove-layer':{
      if(!selectedLayer()){notify(tr('toastNoSelected'));return;}
      rememberUndo();const l=selectedLayer();editor.layers=editor.layers.filter(x=>x.id!==l.id);
      if(l.type==='image'){
        const ph=cachedImages.get(l.key);if(ph){URL.revokeObjectURL(ph.url);ph.img.src='';cachedImages.delete(l.key);}
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
  }
});
ROOT.addEventListener('input',ev=>{
  const el=ev.target;const l=selectedLayer();
  if(el.id==='headerSearch'){
    searchVal=el.value.trim().slice(0,60);const result=document.getElementById('searchResults');
    if(result){const matches=PRODUCTS.filter(p=>p.tr.toLocaleLowerCase('tr').includes(searchVal.toLocaleLowerCase('tr'))||p.de.toLowerCase().includes(searchVal.toLowerCase()));
      result.innerHTML=searchVal?matches.map(p=>`<a href="${hash('studio/'+p.id)}">${escapeHTML(name(p))} ↗</a>`).join(''):'';result.hidden=!searchVal||!matches.length;}
    return;
  }
  if(!l)return;
  if(el.id==='textInput'&&l.type==='text'){l.text=el.value.slice(0,80);drawStudio();return;}
  if(el.id==='textColorInput'&&l.type==='text'){l.color=el.value;drawStudio();return;}
  if(el.id==='sizeInput'){l.size=Number(el.value);document.getElementById('sizeOutput').textContent=el.value;drawStudio();return;}
  if(el.id==='angleInput'){l.angle=Number(el.value);document.getElementById('angleOutput').textContent=el.value+'°';drawStudio();return;}
});
ROOT.addEventListener('change',ev=>{
  const el=ev.target;
  if(el.id==='photoInput'){if(el.files?.[0])processPhotoFile(el.files[0]);return;}
  if(el.id==='productSelect'){const id=el.value;if(PRODUCTS.some(p=>p.id===id)){disposeTemporaryPhotos(false);editor=makeEditor(id);window.location.hash=hash('studio/'+id);if(activeRoute===window.location.hash)render();}return;}
  if(el.id==='fontSelect'){const l=selectedLayer();if(l?.type==='text'){rememberUndo();l.font=el.value;drawStudio();}return;}
  if(['sizeInput','angleInput','textColorInput','textInput'].includes(el.id)){
    const l=selectedLayer();if(l){const i=editor.layers.findIndex(x=>x.id===l.id);if(i>=0)refreshStudio();}return;
  }
});
window.addEventListener('hashchange',()=>{
  const now=currentRoute();
  if(editorRoute==='studio'&&(now[0]!=='studio'||editor.product!==(now[1]||'mug'))){
    disposeTemporaryPhotos(false);undoStack=[];redoStack=[];
  }
  editorRoute=now[0];mobileOpen=false;
  render();window.scrollTo({top:0,behavior:'instant'});
});
window.addEventListener('pagehide',()=>disposeTemporaryPhotos(false));
window.addEventListener('beforeunload',()=>disposeTemporaryPhotos(false));
editorRoute=currentRoute()[0];
render();
})();
