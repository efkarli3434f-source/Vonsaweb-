/* Stable language URLs; no trackers and no fictitious product offers. */
(() => {
  'use strict';
  const titles={"tr": "EJDER Studio | Kişiye Özel Hediye ve Ürün Tasarımı", "de": "EJDER Studio | Personalisierte Geschenke selbst gestalten"};
  const descriptions={"tr": "Fotoğrafını yükle, yazını ekle; telefon kılıfı, kupa, tişört ve diğer ürünleri kişiselleştir. Tasarımını EJDER Studio’da 3D incele ve PNG indir.", "de": "Lade dein Foto hoch, ergänze deinen Text und gestalte Handyhüllen, Tassen, T-Shirts und weitere Produkte. In 3D ansehen und als PNG herunterladen."};
  window.EJDERSEO={sync(lang,page){
    lang=lang==='de'?'de':'tr';
    const canonical='https://ejderstudio.com/'+(lang==='de'?'de.html':'');
    const set=(selector,value)=>{const el=document.querySelector(selector);if(el)el.setAttribute('content',value);};
    document.querySelector('link[rel="canonical"]')?.setAttribute('href',canonical);
    set('meta[name="description"]',descriptions[lang]);
    set('meta[property="og:title"]',titles[lang]);
    set('meta[property="og:description"]',descriptions[lang]);
    set('meta[property="og:url"]',canonical);
    set('meta[property="og:locale"]',lang==='de'?'de_DE':'tr_TR');
    set('meta[property="og:locale:alternate"]',lang==='de'?'tr_TR':'de_DE');
    if(page==='home')document.title=titles[lang];
    const footer=document.querySelector('.foot-brand');
    if(footer&&!footer.querySelector('[data-design-guide]')){
      const p=document.createElement('p'),a=document.createElement('a');a.dataset.designGuide='';
      a.href=lang==='de'?'personalisierte-geschenke.html':'kisiye-ozel-tasarim.html';
      a.textContent=lang==='de'?'Designratgeber':'Ürün tasarım rehberi';a.className='btn secondary';p.append(a);footer.append(p);
    }
  }};
})();
