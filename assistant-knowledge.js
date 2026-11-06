/* EJDER's public studio guide. Replies and destinations are selected from this file. */
(() => {
  'use strict';
  const products = [
    ['case', /^(?:kilif|handyhull|handyhuell)[a-z]*$/, 'Telefon Kılıfı', 'Handyhülle'],
    ['cushion', /^(?:yast[iı]?[kg]|yastig|kissen|dekokissen)[a-z]*$/, 'Dekoratif Yastık', 'Dekokissen'],
    ['mug', /^(?:kupa|bardak|bardag|tasse|becher)[a-z]*$/, 'Kupa / Bardak', 'Tasse / Becher'],
    ['shirt', /^(?:tisort|tshirt|shirt)[a-z]*$/, 'Tişört', 'T-Shirt'],
    ['keychain', /^(?:anahtarlik|anahtarlig|schlusselanhang|schluesselanhaeng)[a-z]*$/, 'Anahtarlık', 'Schlüsselanhänger'],
    ['hoodie', /^(?:hoodie|sweatshirt)[a-z]*$/, 'Hoodie / Sweatshirt', 'Hoodie / Sweatshirt'],
    ['tote', /^(?:canta|stofftasche)[a-z]*$/, 'Bez Çanta', 'Stofftasche'],
    ['poster', /^(?:poster|tablo|wandbild)[a-z]*$/, 'Poster / Tablo', 'Poster / Wandbild'],
    ['giftbox', /^(?:kutu(?:[mynls][a-z]*|da[a-z]*)?|geschenkbox[a-z]*)$/, 'Hediye Kutusu', 'Geschenkbox']
  ];
  const caseCatalog=window.EJDERCaseCatalog;
  const caseRows=new Map(caseCatalog.models.map(m=>[m.id,[m.id,null,m.model+' Kılıfı',m.model+' Hülle']]));
  const topics = {
    lettering:/^(?:sekilli|suslu|kaligraf[a-z]*|kalligraf[a-z]*|kalligraph[a-z]*|retro|varak[a-z]*|goldfolie[a-z]*|kontur[a-z]*|schrifteffekt[a-z]*|schriftstil[a-z]*|handschrift[a-z]*|efekt[a-z]*)$/,
    romance:/^(?:sevgili[a-z]*|verliebt[a-z]*|romantik[a-z]*)$/,
    wedding:/^(?:evli[a-z]*|nikah[a-z]*|yildonum[a-z]*|hochzeit[a-z]*|jahrestag[a-z]*)$/,
    color:/^(?:reng[a-z]*|renk[a-z]*|farbe[a-z]*|bordeaux|bordo|pembe|rosa)$/,
    cat:/^(?:kedi[a-z]*|tekir[a-z]*|katze[a-z]*|getiger[a-z]*)$/,
    bird:/^(?:kus(?:u|lar[a-z]*|lu|un|um|uma|una|ta|a)?|muhabbet|vogel[a-z]*|voegel[a-z]*|wellensittich[a-z]*)$/,
    dog:/^(?:kopek[a-z]*|kopeg[a-z]*|hund[a-z]*|retriever|golden)$/,
    animals:/^(?:evcil|hayvan[a-z]*|haustier[a-z]*|tiermotiv[a-z]*)$/,
    design:/^(?:tasarim(?:i|im|imi|ima|in|ini|ina|lar|lari|larimi|a|da|dan)?|design(?:s|en|e)?)$/,
    fit:/^(?:deckt|bedeck[a-z]*|kapl[a-z]*|otur[a-z]*|ortala[a-z]*|bosluk[a-z]*|vollflach[a-z]*|zentrier[a-z]*|kirp[a-z]*|kesil[a-z]*|sigdir[a-z]*|beschnitt[a-z]*|beschnitten|zugeschnitten|abgeschnitten)$/,
    site:/^(?:ejder(?:in|de|den|e|i)?|studio(?:da|dan|ya|nun|sunda|su|sunun|yu)?|studyo[a-z]*|site(?:de|den|nin|mizde|ye|yi|si|m|sinde)?|website|webseite|designstudio)$/,
    catalog:/^(?:urun|produkt|kategori|katalog|sortiment|kategorie|koleksiyon|kollektion|auswahl)[a-z]*$/,
    photo:/^(?:foto[a-z]*|resim[a-z]*|resm[a-z]*|gorsel[a-z]*|bild(?:er|chen|datei|es|e|format|groesse|grosse)?|jpeg|jpg|webp)$/,
    upload:/^(?:yukle[a-z]*|hochlad[a-z]*|hochgelad[a-z]*|upload[a-z]*|hinzufug[a-z]*|hinzufueg[a-z]*|einfug[a-z]*|einfueg[a-z]*|aktar[a-z]*)$/,
    privacy:/^(?:gizli[a-z]*|mahrem[a-z]*|sunucu[a-z]*|server[a-z]*|privat[a-z]*|datenschutz[a-z]*|veri(?:ler[a-z]*|m|lerim|si)?|geschutzt|geschuetzt|schutz|guvenli[a-z]*|saklan[a-z]*|gonderil[a-z]*|iletil[a-z]*|gesendet|ubertrag[a-z]*|uebertrag[a-z]*|paylasil[a-z]*)$/,
    limit:/^(?:boyut[a-z]*|cozunurlu[a-z]*|piksel[a-z]*|pixel[a-z]*|sinir[a-z]*|limit[a-z]*|auflosung[a-z]*|aufloesung[a-z]*|dateigro[a-z]*|dosya[a-z]*|datei(?:en)?|mb|megabayt|megabyte|format[a-z]*|sikistir[a-z]*|verkleiner[a-z]*|kucult[a-z]*|maksimum|maximal|maximum|hochstens|hoechstens)$/,
    install:/^(?:uygulama[a-z]*|kurulum[a-z]*|kurabilir[a-z]*|kurmak|kurulur|kurar[a-z]*|app|installation[a-z]*|installier[a-z]*|homescreen|startbildschirm[a-z]*|anaekran[a-z]*|pwa)$/,
    offline:/^(?:cevrimdisi|internetsiz|offline|baglantisiz|internet|internete|internetsizken)$/,
    png:/^(?:png[a-z]*|export[a-z]*|indir[a-z]*|indire[a-z]*|herunterlad[a-z]*|heruntergelad[a-z]*|download[a-z]*|ausgabe[a-z]*)$/,
    motif:/^(?:motif[a-z]*|motiv[a-z]*|desen[a-z]*|ayri(?:ca)?|separat[a-z]*|separieren|ohneproduktbild|seffaf[a-z]*|transparent[a-z]*)$/,
    print:/^(?:dpi|baski[a-z]*|bastir[a-z]*|matbaa[a-z]*|druck[a-z]*|drucken|druckenlassen)$/,
    draft:/^(?:kaydet[a-z]*|kayd(?:et|ed|ol)[a-z]*|kayit[a-z]*|kaydi[a-z]*|taslak[a-z]*|tasarimlarim[a-z]*|speich[a-z]*|gespeich[a-z]*|entw(?:urf|urf[e]?|uerf|urf|urfen|urfe|urfes)[a-z]*|galeri[a-z]*|galerie[a-z]*)$/,
    remove:/^(?:sil(?:di[a-z]*|iyor[a-z]*|ebil[a-z]*|er[a-z]*|mek|me[a-z]*|in[a-z]*|ip|sem|erek)?|temizle[a-z]*|kaldir[a-z]*|losch[a-z]*|loesch[a-z]*|geloscht|geloescht|entfern[a-z]*)$/,
    template:/^(?:sablon[a-z]*|tema(?:lar[a-z]*|yi|ya|si)?|vorlag[a-z]*|monogram[a-z]*|cicek[a-z]*|doga|evcil|hayvan[a-z]*|minimal|gece|ejderha[a-z]*|ask|ani|blume[a-z]*|natur|haustier[a-z]*|liebe|nacht|drache[a-z]*)$/,
    edit:/^(?:ad(?:im|imi|imla|ini|i|ini|ina|imda)?|yazar[a-z]*|yazi(?:yi|ya|ma|mi|m|lar[a-z]*|sini|si|nin|yla|ni|yla)?|yaz(?:mak|mayi|ayim|ilir|abil[a-z]*|sam|acagim)|met(?:in|ni|ne)[a-z]*|isim[a-z]*|ism[a-z]*|renk[a-z]*|reng[a-z]*|katman[a-z]*|font[a-z]*|schrift[a-z]*|text[a-z]*|farbe[a-z]*|farb[a-z]*|ebene[a-z]*|name(?:n|ns)?|surukle[a-z]*|tasima[a-z]*|verschieb[a-z]*|position[a-z]*)$/,
    preview:/^(?:360|zoom[a-z]*|yakinlastir[a-z]*|3d|ucboyutlu|vitrin[a-z]*|vitrine[a-z]*|onizle[a-z]*|izle(?:me|ye|ne)[a-z]*|vorscha[a-z]*|dondur[a-z]*|cevir[a-z]*|dreh[a-z]*|wisch[a-z]*|kaydir[a-z]*)$/,
    gift:/^(?:hediye[a-z]*|kurdele[a-z]*|geschenk[a-z]*|schleife[a-z]*)$/,
    open:/^(?:ac|acmak|acabilir[a-z]*|acar[a-z]*|acili[a-z]*|actig[a-z]*|coz[a-z]*|offne[a-z]*|oeffne[a-z]*|losen|loesen|auspack[a-z]*)$/,
    sale:/^(?:para|tutar[a-z]*|teuer|fiyat[a-z]*|ucret[a-z]*|odeme[a-z]*|odey[a-z]*|satin|satis[a-z]*|siparis[a-z]*|kargo[a-z]*|teslim[a-z]*|sepet[a-z]*|preis[a-z]*|kostet|kosten|gebuhr[a-z]*|gebuehr[a-z]*|bestell[a-z]*|bezah[a-z]*|zahlung[a-z]*|versand[a-z]*|liefer[a-z]*|warenkorb|kauf[a-z]*)$/,
    contact:/^(?:iletisim[a-z]*|whatsapp[a-z]*|ulasa[a-z]*|ulas(?:mak|ir[a-z]*)|kontakt[a-z]*|erreich[a-z]*|numara[a-z]*)$/,
    language:/^(?:dil(?:i|ini|ler[a-z]*|de|im|in|e)?|turkce[a-z]*|almanca[a-z]*|deutsch[a-z]*|turkisch[a-z]*|sprache[a-z]*|sprachwechsel|tr|de)$/,
    voice:/^(?:asistan[a-z]*|assistent[a-z]*|sesli[a-z]*|mikrofon[a-z]*|seslend[a-z]*|sprachgesprach|spracheingabe|sprachchat|vorlesen|dinliyor|konusma[a-z]*|konusmak)$/,
    guide:/^(?:basla[a-z]*|basliyor[a-z]*|yardim[a-z]*|hilfe|anfang[a-z]*|begin[a-z]*|starten|loslegen|kullan[a-z]*|nutz[a-z]*|benutz[a-z]*|funktioniert)$/
  };
  function normalize(value){
    return String(value||'').slice(0,300).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ß/g,'ss').replace(/[’']/g,'').replace(/t[ -]shirt/g,'tshirt').replace(/çevrim dışı|cevrim disi/g,'cevrimdisi').replace(/\baltin\s+(?=varak)/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  }
  const rules=Object.entries(topics);
  function isSpeechArtifact(value){
    const q=normalize(value);
    return /^(?:alt ?yazi(?: m ?k)?|subtitles?(?: by amara org)?|untertitel(?: der amara org community| von amara org)?|izlediginiz icin tesekkur(?:ler| ederim| ederiz)|thanks? for watching|thank you for watching|vielen dank furs zuschauen|danke furs zuschauen|musik|music)$/.test(q);
  }
  const general={
    scope:['Yalnızca EJDER Studio hakkında yardımcı olabilirim. Ürün, fotoğraf ekleme veya PNG indirme hakkında sorabilirsin.','Ich beantworte Fragen zu EJDER Studio, etwa zu Produkten, Fotos oder zum PNG-Download.'],
    unknown:['Bu ayrıntı EJDER Studio’nun site bilgilerinde yer almıyor. İletişim bölümünden EJDER’e sorabilirsin.','Dieses Detail steht nicht in den Informationen von EJDER Studio. Du kannst über die Kontaktseite nachfragen.']
  };
  function answer(text,language,route,context={}){
    const i=language==='de'?1:0;
    if(context.route!==route){context.product='';context.question='';context.route=route;}
    const reply=(lines,href,labels)=>({message:lines[i],href:href||'',label:labels?.[i]||''});
    const fallback=()=>reply(general.scope);
    const raw=normalize(text);
    if(!raw)return fallback();
    let q=normalize(String(text).replace(/“[^”]{1,80}”|"[^"]{1,80}"/g,' '));
    if(/^(?:(?:slm|selam|selamlar|merhaba|merhabalar|mrb|sa|s a|selamunaleykum|selamun aleykum|gunaydin|iyi aksamlar|hallo|hi|hey|moin|servus|guten tag|guten morgen|guten abend)(?: kanka| kankam| ejder| asistan)?(?: nasilsin| nasilsiniz| naber| n aber| wie geht es dir| wie gehts)?|nasilsin|nasilsiniz|naber|wie geht es dir|wie gehts)$/.test(q))return reply(['Merhaba! EJDER Studio’ya hoş geldin. Ürün seçimi, fotoğraf ekleme veya tasarımını indirme konusunda yardımcı olabilirim. Ne yapmak istersin?','Hallo! Willkommen bei EJDER Studio. Ich helfe dir bei der Produktauswahl, beim Hinzufügen von Fotos oder beim Herunterladen deines Designs. Was möchtest du machen?']);
    if(/^(?:evet|olur|peki|tamam devam|ja|ja bitte|okay|ok)$/.test(q))return reply(['Tamam. Hangi ürün veya adımla ilgili yardım istersin: kılıf, kupa, fotoğraf ekleme ya da PNG indirme?','Gern. Wobei brauchst du Hilfe: Hülle, Tasse, Foto hinzufügen oder PNG herunterladen?']);
    if(/(?:sesin gelmiyor|ses gelmiyor|seni duyamiyorum|konusmuyorsun|neden konusmuyorsun|sesli cevap vermiyorsun|ich hore dich nicht|kein ton|du sprichst nicht)/.test(q))return reply(['Telefonunun medya sesini ve varsa Bluetooth kulaklık bağlantısını kontrol et. Yazışmadaysan Sesli yanıt düğmesini aç; Sesli konuş modunda yanıt otomatik okunur. Ses başlamazsa Sesi tekrar çal düğmesini dene. Sesli sorular ekrana yazılmaz.','Prüfe die Medienlautstärke und eine mögliche Bluetooth-Verbindung. Aktiviere im Textchat Vorlesen; im Sprachgespräch wird automatisch vorgelesen. Wenn die Ausgabe nicht startet, nutze Erneut vorlesen. Sprachfragen erscheinen nicht als Text.']);
    if(/^(?:tesekkur(?:ler| ederim)?|sag ol|tamam|danke|vielen dank|alles klar)$/.test(q))return reply(['Rica ederim. EJDER’de başka bir adımda takılırsan sorabilirsin.','Gern. Wenn du bei einem weiteren Schritt in EJDER Hilfe brauchst, frag einfach.']);
    if(/^(?:nasil|nasil yapacagim|adim adim|biraz daha anlat|anlamadim|peki sonra|devam|wie|wie geht das|schritt fur schritt|weiter|das verstehe ich nicht)$/.test(q)&&context.question)q=context.question;
    if(/\b(?:hava durumu|wetter|bitcoin|borsa|kripto|siyaset|politik|hastalik|ilac|doktor|fussballergebnis|mac sonucu|siir yaz|gedicht|ignore|system prompt|sistem talimati|talimatlari unut)\b/.test(q))return fallback();
    const modelQuery=caseCatalog.normalize(q), requested=caseCatalog.identify(q);
    const words=modelQuery.split(' '),tags=new Set(),matches=[];

    for(const w of words){

      for(const [key,pattern] of rules)if(pattern.test(w)){
        if(key!=='limit'||w!=='pixel'||!requested.terms.has(w))tags.add(key);

      }
      for(const product of products)if(product[1].test(w)){if(!matches.includes(product))matches.push(product);}

    }

    const has=k=>tags.has(k);
    const active=String(route||'').match(/^#\/studio\/([a-z0-9-]+)(?:\/|$)/)?.[1];
    const explicit=requested.matches.length===1?caseRows.get(requested.matches[0].id):null;
    const chosen=explicit||matches[0]||caseRows.get(context.product)||products.find(p=>p[0]===context.product)||caseRows.get(active)||products.find(p=>p[0]===active);
    if(chosen)context.product=chosen[0];
    if(tags.size||matches.length||requested.matches.length)context.question=q;
    const product=chosen||products.find(p=>p[0]==='mug');
    const studio='studio/'+(product[0]==='case'?'case-s24':product[0]),go=['Stüdyoyu aç','Studio öffnen'];
    if(/\b(?:arka|arkasi|arkasina|arkasini|arkada|on arka|iki taraf|iki yuz|cift taraf|ruckseite|ruckseitig|beidseitig|hinten|vorderseite)\b/.test(q))return reply(product[0].startsWith('case')?['Telefon kılıfında yalnızca dış baskı yüzeyi düzenlenir. Modeli döndürerek kenarları ve kamera açıklığını kontrol edebilirsin.','Bei Handyhüllen gestaltest du nur die äußere Druckseite. Drehe das Modell, um Kanten und Kameraöffnung zu prüfen.']:['Kılıf dışındaki ürünlerde Ön / Arka tasarım düğmeleriyle iki yüzü ayrı düzenleyebilirsin. Her yüzün fotoğrafı ve yazısı bağımsızdır. Kupada her görsel çevrenin yarısını kaplar.','Bei Produkten außer Handyhüllen kannst du Vorder- und Rückseite separat gestalten. Bilder und Texte jeder Seite sind unabhängig. Auf Tassen bedeckt jedes Motiv die halbe Rundung.'],studio,go);
    if(/\b(?:kargo|teslimat|teslim|versand|lieferung|lieferzeit|iade|ruckgabe|retoure|siparisim|bestellstatus|takip)\b/.test(q))return reply(['Kargo ücreti, teslim tarihi, iade koşulları veya kişisel sipariş durumunu buradan doğrulayamıyorum. İletişim bölümünden EJDER’e yaz; kesin bilgi olmadan süre ya da tutar söylemem.','Versandkosten, Liefertermin, Rückgabebedingungen oder deinen persönlichen Bestellstatus kann ich hier nicht bestätigen. Bitte frage EJDER über Kontakt; ich erfinde keine Termine oder Beträge.'],'contact',['İletişim','Kontakt']);
    if(/\b(?:hesap|giris|google|sifre|konto|anmelden|passwort)\b/.test(q))return reply(['Hesabım bölümünden giriş durumunu görebilirsin. Google ile giriş hizmeti etkinse oradan başlatılır. Şifre veya doğrulama kodunu bu sohbete yazma; asistan hesabına erişmez.','Unter Mein Konto siehst du den Anmeldestatus. Wenn die Google-Anmeldung freigeschaltet ist, kannst du sie dort starten. Schreibe keine Passwörter oder Bestätigungscodes in diesen Chat; der Assistent greift nicht auf dein Konto zu.'],'account',['Hesabım','Mein Konto']);
    if(/\b(?:ses|mikrofon|voice|audio|sprach|asistan|assistent)/.test(q)&&(has('privacy')||has('draft')))return reply(['Soruların ve son birkaç mesajın, yanıt üretmek için Supabase üzerinden Groq’a gönderilebilir. Sesli modda konuşma parçaları da metne çevrilir. EJDER ses dosyası veya konuşma dökümü kaydetmez. Sesli okuma tarayıcının ses hizmetini kullanır.','Fragen und die letzten Nachrichten können über Supabase an Groq zur Beantwortung gesendet werden. Im Sprachmodus werden zusätzlich gesprochene Abschnitte transkribiert. EJDER speichert keine Audiodateien oder Transkripte. Das Vorlesen erfolgt über den Sprachdienst deines Browsers.'],'privacy',['Gizlilik','Datenschutz']);
    if(has('sale'))return reply(['Satış Vitrini’nde ürünleri inceleyebilir; fiyatı ve satışı açılan ürünlerde beden, renk, model ve adet seçerek sepete ekleyebilirsin. Mağaza tarafından açıldığında ödeme alınmadan sipariş talebi gönderilebilir. Gerçek ödeme henüz etkin değil.','Im Shop kannst du Artikel ansehen und freigeschaltete Artikel mit Größe, Farbe, Modell und Menge in den Warenkorb legen. Nach Freischaltung sind unbezahlte Bestellanfragen möglich. Echte Zahlungen sind noch nicht aktiv.'],'shop',['Satış vitrinini aç','Shop öffnen']);
    if(has('contact'))return reply(['Sağdaki yeşil WhatsApp düğmesi, EJDER için hazır bir sohbet açar. Mesajı WhatsApp’ta sen gönderirsin.','Über den grünen WhatsApp-Knopf öffnest du einen Chat mit EJDER. Du sendest die Nachricht selbst in WhatsApp.'],'contact',['İletişimi aç','Kontakt öffnen']);
    if(has('privacy')||(has('photo')&&(has('remove')||has('draft'))))return reply(['Fotoğrafların cihazında işlenir. PNG indirdiğinde, kaydettiğinde, işlemi bitirdiğinde veya stüdyodan çıktığında geçici kopyalar silinir. Taslakta ürün, yazı ve renkler kalır.','Deine Fotos werden auf deinem Gerät verarbeitet. Beim Herunterladen, Speichern, Beenden oder Verlassen des Studios werden temporäre Fotos gelöscht. Produkt, Texte und Farben bleiben im Entwurf.'],'privacy',['Gizliliği aç','Datenschutz öffnen']);
    if(has('install')||/\bana ekran/.test(q))return reply(['Sağdaki en üst yükleme düğmesine dokun. Tarayıcın destekliyorsa kurulum penceresi açılır. iPhone’da Safari’nin Paylaş menüsünden Ana Ekrana Ekle’yi seç.','Tippe rechts auf den obersten Installationsknopf. Unterstützte Browser öffnen die Installation. Auf dem iPhone wählst du in Safari unter Teilen „Zum Home-Bildschirm“.']);
    if(has('offline'))return reply(['EJDER’i önce çevrimiçiyken aç. Önbelleğe alınan tasarım araçları, PNG indirme ve yazılı asistan çevrimdışı çalışabilir. Sesin metne çevrilmesi için internet gerekir.','Öffne EJDER zuerst online. Gespeicherte Designwerkzeuge, PNG-Download und Texthilfe können offline funktionieren. Spracherkennung braucht eine Internetverbindung.']);
    if(requested.terms.size&&requested.matches.length!==1){
      const list=requested.matches.length?requested.matches:caseCatalog.models;
      const names=list.map(m=>m.model).join(' · ');
      return reply(['Katalogdaki kılıf seçenekleri — '+names+'. Renk ve baskı için bir model seçebilirsin.','Hüllen im Katalog — '+names+'. Wähle ein Modell für Farbe und Motiv.'],'cases',['Kılıfları aç','Hüllen öffnen']);
    }
    if(has('fit'))return reply(product[0]==='mug'?['Kupada her yüzün görseli bardağın çevresinin yarısını kaplar. Ön ve arka yüzü ayrı seçip fotoğraf veya motif yerleştir. 3D modeli çevirerek birleşimi kontrol et.','Auf der Tasse bedeckt jedes Seitenmotiv die halbe Rundung. Wähle Vorder- und Rückseite separat und füge ein Foto oder Motiv ein. Prüfe die Übergänge durch Drehen des 3D-Modells.']:product[0].startsWith('case')?['Kılıfta görsel baskı alanını dolduracak şekilde otomatik ortalanır. Kamera açıklığı modele göre korunur. Farklı oranlarda kenarlardan kırpma olabilir; ana konuyu ön izlemede kontrol et. Yazıyı ayrı isim alanına ekleyebilirsin.','Das Hüllenmotiv wird automatisch zentriert und füllt die Druckfläche. Die modellabhängige Kameraöffnung bleibt frei. Abweichende Bildformate können an den Rändern beschnitten werden. Prüfe das Hauptmotiv in der Vorschau; Text kommt ins separate Namensfeld.']:['Görsel seçilen ürünün baskı alanına otomatik ortalanır ve alanı doldurur. Oran farklıysa kenarlardan kırpılabilir; 3D ön izlemede önemli ayrıntıları kontrol et. İsim veya yazıyı ayrı alandan ekleyebilirsin.','Das Motiv wird automatisch in der Druckfläche zentriert und füllt sie aus. Bei anderem Seitenverhältnis können Ränder beschnitten werden. Prüfe wichtige Details in der 3D-Vorschau und füge Text im eigenen Feld hinzu.'],studio,go);
    if(has('photo')&&(!has('png')||has('upload')))return reply(['Fotoğraf yükle alanından JPG, PNG veya WebP seç. En fazla 3 fotoğraf, dosya başına 10 MB. Studio her fotoğrafı cihazında uzun kenarı en fazla 4096 piksel olacak şekilde işler.','Wähle unter „Foto hochladen“ JPG, PNG oder WebP. Bis zu 3 Fotos mit jeweils höchstens 10 MB. Das Studio verkleinert sie auf deinem Gerät auf maximal 4096 Pixel.'],studio+'/photo',['Fotoğraf ekle','Foto hinzufügen']);
    if(has('png')||has('print')||(has('motif')&&/\b(?:ayri|separat)/.test(q))||has('limit'))return reply(['“PNG Ön İzlemeyi İndir” ürün görünümünü 900 × 650 piksel indirir. “Tasarımı ayrı indir (PNG)” yalnızca motifini, uzun kenarı 1600 piksel olarak verir. Baskı ölçüsünü üreticinle kontrol edebilirsin.','„PNG-Vorschau herunterladen“ exportiert die Produktansicht mit 900 × 650 Pixeln. „Motiv separat laden (PNG)“ gibt nur das Motiv mit 1600 Pixeln an der langen Seite aus. Stimme die Druckgröße mit der Druckerei ab.'],studio+'/png',['PNG seçenekleri','PNG-Optionen']);
    if(has('draft'))return reply(has('remove')?['Tasarımlarım bölümünü aç. Silmek istediğin kayıtlı tasarımın altındaki Sil düğmesini kullan.','Öffne „Meine Entwürfe“ und nutze beim gewünschten Entwurf die Schaltfläche zum Löschen.']:['“Tarayıcıya Kaydet” ile taslağını bu tarayıcıda saklarsın. Tasarımlarım bölümünden tekrar açabilirsin. Yüklediğin fotoğraflar taslağa kaydedilmez.','Mit „Im Browser speichern“ sicherst du den Entwurf in diesem Browser. Öffne ihn unter „Meine Entwürfe“ erneut. Hochgeladene Fotos werden nicht im Entwurf gespeichert.'],'saved',['Tasarımlarım','Meine Entwürfe']);
    if((has('gift')||matches.some(p=>p[0]==='giftbox'))&&has('open'))return reply(['Ana sayfada “Kurdeleyi Çöz & Kutuyu Aç” düğmesine dokun. Hediye kutusu açılır ve içindeki ürünler 3D görünür.','Tippe auf der Startseite bei der Geschenkbox auf die Schaltfläche zum Öffnen. Die Box zeigt ihre Produkte in 3D.'],'home/gift',['Hediye kutusuna git','Zur Geschenkbox']);
    if(has('preview'))return reply(['Ürünü stüdyoda aç. Modeli parmağınla veya fareyle döndür. İki parmakla, fare tekerleğiyle ya da + ve − düğmeleriyle yakınlığı ayarla. Kutu açılışını yeniden izlemek için Kutuyu aç düğmesine dokun.','Öffne das Produkt im Studio. Drehe das Modell mit Finger oder Maus. Mit zwei Fingern, dem Mausrad oder den Tasten + und − kannst du zoomen. Mit Box öffnen siehst du die Geschenköffnung erneut.'],studio,['Vitrini aç','Vitrine öffnen']);
    if(has('lettering')||(has('edit')&&/\b(stili|tarzi|stilini|tarzini)\b/.test(q)))return reply(['İsim alanının altında Yazı tarzı ve Yazı efekti seçenekleri var. Kaligrafi, Retro, Daktilo, Afiş veya Kalın Serif ile başlayıp Kontur ya da Altın varak ekleyebilirsin. Seçimin iki PNG dosyasına da işlenir.','Unter dem Namensfeld findest du Schriftstil und Schrifteffekt. Probiere Kalligrafie, Retro, Schreibmaschine, Plakatschrift oder kräftige Serifenschrift mit Kontur oder Goldfolie. Deine Auswahl erscheint in beiden PNG-Dateien.'],studio+'/text',['Yazı tarzını seç','Schriftstil wählen']);
    if(has('edit'))return reply(['Ürünün hemen altındaki isim alanına yaz. İsmin üründe hemen görünür. Altından yazı tarzını ve efekti seçebilir, üründe yazıyı sürükleyebilirsin.','Schreibe in das Namensfeld direkt unter dem Produkt. Dein Name erscheint sofort. Darunter wählst du Schriftstil und Effekt aus. Ziehe den Text auf dem Produkt an die gewünschte Stelle.'],studio+'/text',['Yazı ekle','Text hinzufügen']);
    if(has('romance')||has('wedding'))return reply(['Sevgililer ve Evlilik ve yıl dönümü bölümlerinde çift görselleri var. Bir motifi seçip altına isim veya tarih yazabilirsin.','Unter Verliebte und Hochzeit und Jahrestag findest du Paarmotive. Wähle ein Bild und ergänze darunter Namen oder ein Datum.'],'templates/'+(has('wedding')?'married':'lovers'),['Çift görsellerini aç','Paarmotive öffnen']);
    if(has('color'))return reply(['Tasarım alanında ürünün altındaki renklerden birine dokun. Özel renk ile kendi tonunu seçebilirsin.','Tippe direkt unter dem Produkt auf eine Farbe. Mit Eigene Farbe kannst du einen eigenen Farbton wählen.'],studio,['Renkleri dene','Farben ausprobieren']);
    if(has('voice'))return reply(['Sesli konuş düğmesine bir kez dokunup mikrofon izni ver. Soru ve yanıtlar arasında mikrofon açık kalır; tekrar basman gerekmez. Bitirmek için Sesli sohbeti kapat’a dokun veya “mikrofonu kapat” de. Telefon ekranı kilitlenirse tarayıcı sesi duraklatabilir.','Tippe einmal auf Sprachgespräch und erlaube das Mikrofon. Zwischen Fragen und Antworten bleibt es offen. Zum Beenden tippe auf Sprachgespräch beenden oder sage „Mikrofon ausschalten“. Bei gesperrtem Bildschirm kann der Browser den Ton pausieren.']);
    if(has('language'))return reply(['EJDER Studio Türkçe ve Almanca çalışır. Üstteki TR veya DE düğmesiyle dili değiştirebilirsin.','EJDER Studio ist auf Deutsch und Türkisch verfügbar. Oben wechselst du mit DE oder TR die Sprache.']);
    const pets=['dog','cat','bird'].filter(has);
    if(pets.length===1){
      const pet={dog:['pet','case','Köpek','Hund'],cat:['cat','mug','Tekir Kedi','Getigerte Katze'],bird:['bird','tote','Muhabbet Kuşu','Wellensittich']}[pets[0]];
      return reply([pet[2]+' motifini Evcil Hayvanlar bölümünden seçebilirsin. Tüm ürünlerde kullanılabilir. Altındaki alana bir isim yazabilirsin.','Wähle „'+pet[3]+'“ unter Haustiere. Das Motiv funktioniert auf allen Produkten. Im Namensfeld unter dem Produkt kannst du deinen Text ergänzen.'],'studio/'+(chosen?.[0]||pet[1])+'/theme/'+pet[0],['Motifi aç','Motiv öffnen']);
    }
    if(pets.length||has('animals'))return reply(['Evcil Hayvanlar bölümünde köpek, tekir kedi ve muhabbet kuşu var. Her motifi tüm ürünlerde kullanabilirsin.','Unter Haustiere findest du Hund, getigerte Katze und Wellensittich. Jedes Motiv lässt sich auf allen Produkten verwenden.'],'templates/pets',['Evcil hayvanları aç','Haustiere öffnen']);
    if(has('template')||has('motif'))return reply(['Şablonlar bölümünde kategorilere ayrılmış 42 motif var. Bir kart seçtiğinde gösterdiği ürün ve motif düzenleyicide açılır. Kendi yazını veya fotoğrafını da ekleyebilirsin.','Unter „Vorlagen“ gibt es 42 Motive in mehreren Kategorien. Eine Karte öffnet das gezeigte Produkt mit dem passenden Motiv. Dort kannst du Text oder Fotos ergänzen.'],'templates',['Şablonları aç','Vorlagen öffnen']);
    if(has('catalog')||matches.length>1)return reply(['Dokuz kategori var. Telefon kılıfı, yastık, kupa, tişört, anahtarlık, hoodie, bez çanta, poster ve hediye kutusu tasarlayabilirsin.','Du kannst Produkte aus neun Kategorien gestalten. Handyhülle, Dekokissen, Tasse, T-Shirt, Schlüsselanhänger, Hoodie, Stofftasche, Poster und Geschenkbox.'],'products',['Ürünleri gör','Produkte ansehen']);
    if(chosen?.[0]==='case'){
      const names=caseCatalog.models.map(m=>m.model).join(' · ');
      return reply(['Kılıf modelleri — '+names+'. Her modelin rengini ve baskısını ayrı seçebilirsin.','Hüllenmodelle — '+names+'. Farbe und Motiv wählst du für jede Hülle einzeln.'],'cases',['Kılıf modelleri','Hüllenmodelle']);
    }
    if(matches.length===1||chosen?.[0].startsWith('case-'))return reply([product[2]+' tasarımını stüdyoda açabilirsin. Fotoğraf, yazı veya şablon ekleyip PNG olarak indirebilirsin.','Öffne „'+product[3]+'“ im Studio. Ergänze Fotos, Text oder eine Vorlage und lade dein Design als PNG herunter.'],studio,['Bu ürünü tasarla','Produkt gestalten']);
    if(has('guide')||has('site')||has('design')||/^(?:merhaba|selam|selamlar|hallo|guten tag)$/.test(q))return reply(['Ürünler bölümünden bir ürün seç. Stüdyoda fotoğraf, yazı ve renk ekleyebilir, ardından tasarımını kaydedebilir veya PNG indirebilirsin.','Wähle unter „Produkte“ ein Produkt. Im Studio kannst du Fotos, Text und Farben ergänzen und den Entwurf speichern oder als PNG herunterladen.'],'products',['Ürün seç','Produkt wählen']);
    return has('site')?reply(general.unknown,'contact',['İletişim','Kontakt']):fallback();
  }
  window.EJDERGuide=Object.freeze({answer,normalize,isSpeechArtifact,createSession(){let context={};return {answer:(text,language,route)=>answer(text,language,route,context),reset(){context={};}};}});
})();
