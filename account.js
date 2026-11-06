(() => {
  'use strict';
  const word=(lang,tr,de)=>lang==='de'?de:tr;
  const entry=lang=>lang==='de'?'de.html':'./';
  window.EJDERAccount={
    render(lang){
      const w=(tr,de)=>word(lang,tr,de);
      return `<main class="max"><div class="pagehead"><div class="eyebrow">EJDER STUDIO</div><h1>${w('Hesabım','Mein Konto')}</h1><p>${w('Tasarımlarına ve hesap bilgilerine tek yerden ulaş.','Deine Entwürfe und Kontoinformationen an einem Ort.')}</p></div>
      <div class="account-grid"><section class="card account-card" data-account-panel>
      <h2>${w('Güvenli giriş','Sicher anmelden')}</h2><p data-account-status class="account-state" role="status">${w('Giriş durumu kontrol ediliyor…','Anmeldestatus wird geprüft…')}</p>
      <div data-account-profile hidden><p data-account-name></p><p data-account-email></p></div>
      <a class="btn account-login" data-google-login aria-disabled="true">${w('Google ile devam et','Mit Google fortfahren')}</a><button type="button" class="btn secondary" data-account-logout hidden>${w('Çıkış yap','Abmelden')}</button>
      <p>${w('Google ile giriş etkin olduğunda yalnızca temel profil ve e-posta bilgilerin kullanılır. Google şifren EJDER Studio’ya verilmez.','Wenn Google-Anmeldung verfügbar ist, werden nur dein Basisprofil und deine E-Mail genutzt. Dein Google-Passwort wird nicht an EJDER Studio weitergegeben.')}</p></section>
      <section class="card account-card"><h2>${w('Tasarımlarım','Meine Entwürfe')}</h2><p>${w('Kaydettiğin yazılar, renkler ve şablonlar bu tarayıcıda kalır. Fotoğrafların hesaba yüklenmez; cihazlar arasında eşitleme yapılmaz.','Gespeicherte Texte, Farben und Vorlagen bleiben in diesem Browser. Fotos werden nicht in dein Konto hochgeladen; keine geräteübergreifende Synchronisierung.')}</p><a class="btn secondary" href="#/saved">${w('Tasarımları aç','Entwürfe öffnen')}</a></section>
      <section class="card account-card"><h2>${w('Siparişlerim','Meine Bestellungen')}</h2><p>${w('Gerçek sipariş ve ödeme hizmeti henüz açılmadı. Deneme ödemeleri ürün siparişi oluşturmaz.','Echte Bestellungen und Zahlungen sind noch nicht freigeschaltet. Testzahlungen erzeugen keine Produktbestellung.')}</p><a class="btn secondary" href="#/payments">${w('Ödeme bilgileri','Zahlungsinformationen')}</a></section>
      <section class="card account-card"><h2>${w('Gizliliğin','Deine Privatsphäre')}</h2><p>${w('Fotoğraflar tasarım sırasında cihazında işlenir. PNG indirdiğinde veya işlemi bitirdiğinde geçici fotoğraflar temizlenir.','Fotos werden beim Gestalten auf deinem Gerät verarbeitet. Beim PNG-Download oder Abschluss werden temporäre Fotos entfernt.')}</p><a class="btn secondary" href="#/privacy">${w('Gizlilik bilgileri','Datenschutz')}</a></section></div></main>`;
    },
    payments(lang){
      const w=(tr,de)=>word(lang,tr,de);
      return `<main class="max"><div class="pagehead"><div class="eyebrow">EJDER STUDIO</div><h1>${w('Ödeme seçenekleri','Zahlungsarten')}</h1></div><article class="text-panel card"><h2>${w('Ödeme sistemi deneme aşamasında','Zahlungen befinden sich im Testbetrieb')}</h2><p>${w('Gerçek ödeme ve ürün siparişi henüz alınmıyor. Deneme hesabında açık yöntemler aşağıdadır; ödeme ekranı ülkeye, para birimine, tutara ve cihaza uygun seçenekleri gösterir.','Aktuell werden keine echten Zahlungen oder Produktbestellungen angenommen. Die folgenden Methoden sind im Testkonto freigeschaltet; je nach Land, Währung, Betrag und Gerät zeigt die Kasse passende Optionen.')}</p><ul class="payment-methods"><li>Visa / Mastercard</li><li>Apple Pay</li><li>Link</li><li>Amazon Pay</li><li>Klarna</li><li>Bancontact</li><li>EPS</li><li>MB WAY</li><li>Satispay</li></ul><p>${w('PayPal, Google Pay ve SEPA bu hesapta henüz kullanılabilir değil. Kurulum ve uygunluk doğrulanmadan aktif gösterilmez.','PayPal, Google Pay und SEPA sind in diesem Konto noch nicht verfügbar. Sie werden erst nach bestätigter Einrichtung und Freigabe angeboten.')}</p><h2>${w('PNG indirme planı','Geplante PNG-Downloads')}</h2><p>${w('Plan: tasarım başına ilk PNG ücretsiz; aynı tasarımın sonraki indirmeleri 0,99 €. Ücretli indirme ve hesap üzerinden hak takibi henüz etkin değil. Şu anki PNG indirme devam ediyor.','Geplant: pro Entwurf der erste PNG-Download kostenlos, weitere Downloads desselben Entwurfs 0,99 €. Bezahlte Downloads und kontobasierte Freigaben sind noch nicht aktiv. Der bestehende PNG-Download bleibt verfügbar.')}</p><a class="btn secondary" href="#/account">${w('Hesabıma dön','Zurück zu meinem Konto')}</a></article></main>`;
    },
    async mount(lang){
      const panel=document.querySelector('[data-account-panel]');if(!panel)return;
      const w=(tr,de)=>word(lang,tr,de), status=panel.querySelector('[data-account-status]'), login=panel.querySelector('[data-google-login]'), logout=panel.querySelector('[data-account-logout]');
      try{
        const response=await fetch('account-api.php?action=status',{credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}});
        if(!response.ok)throw new Error('unavailable');
        const data=await response.json();if(!panel.isConnected)return;
        if(data.authenticated&&data.user){
          status.textContent=w('Google ile giriş yapıldı.','Mit Google angemeldet.');
          panel.querySelector('[data-account-profile]').hidden=false;
          panel.querySelector('[data-account-name]').textContent=String(data.user.name||'');
          panel.querySelector('[data-account-email]').textContent=String(data.user.email||'');
          login.hidden=true;logout.hidden=false;
          logout.onclick=async()=>{logout.disabled=true;try{const r=await fetch('account-api.php?action=logout',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json','X-CSRF-Token':data.csrf},body:'{}'});if(!r.ok)throw new Error('logout');location.replace(entry(lang)+'#/account');location.reload();}catch{status.textContent=w('Çıkış tamamlanamadı. Tekrar dene.','Abmeldung fehlgeschlagen. Bitte erneut versuchen.');logout.disabled=false;}};
        }else if(data.ready){
          status.textContent=w('Google hesabınla güvenli şekilde devam edebilirsin.','Du kannst sicher mit deinem Google-Konto fortfahren.');login.href='account-api.php?action=start&lang='+lang;login.removeAttribute('aria-disabled');
        }else status.textContent=w('Google ile giriş henüz etkin değil. Tasarım stüdyosunu giriş yapmadan kullanabilirsin.','Google-Anmeldung ist noch nicht freigeschaltet. Das Designstudio lässt sich ohne Anmeldung nutzen.');
      }catch{if(panel.isConnected)status.textContent=w('Hesap hizmetine şu anda ulaşılamıyor. Tasarımların bu tarayıcıda duruyor.','Der Kontodienst ist derzeit nicht erreichbar. Deine Entwürfe bleiben in diesem Browser.');}
    }
  };
})();
