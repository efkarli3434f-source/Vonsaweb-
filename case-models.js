/* Camera-safe artwork areas are measured on the same 480 by 332 studio photograph used for preview and export. */
(() => {
  'use strict';
  const models = [
    {id:'case-iphone17promax',brand:'Apple',model:'iPhone 17 Pro Max',print:[171,48,138,266],fullPrint:[173.0, 25.0, 134.0, 282.0],deviceMm:[78,163.4,8.75],previewOnly:true},
    {id:'case-iphone16promax',brand:'Apple',model:'iPhone 16 Pro Max',print:[171,48,138,266],fullPrint:[173.0, 25.0, 134.0, 282.0],deviceMm:[77.6,163,8.25],previewOnly:true},
    {id:'case-iphone17',    brand:'Apple',    model:'iPhone 17',               print:[185,112,110,184],fullPrint:[167.0, 15.0, 146.0, 298.0]},
    {id:'case-s26ultra',    brand:'Samsung',  model:'Samsung Galaxy S26 Ultra',print:[186,139,108,157],fullPrint:[168.0, 15.0, 144.0, 298.0]},
    {id:'case-xiaomi17',    brand:'Xiaomi',   model:'Xiaomi 17',               print:[185,129,110,167],fullPrint:[167.0, 15.0, 146.0, 297.0]},
    {id:'case-xiaomi17ultra',brand:'Xiaomi',  model:'Xiaomi 17 Ultra',         print:[186,152,108,144],fullPrint:[168.0, 15.0, 144.0, 297.0]},
    {id:'case-pura80pro',   brand:'Huawei',   model:'Huawei Pura 80 Pro',      print:[186,140,108,156],fullPrint:[168.0, 15.0, 144.0, 298.0]},
    {id:'case-edge60pro',   brand:'Motorola', model:'Motorola Edge 60 Pro',    print:[188,116,104,180],fullPrint:[171.0, 16.0, 137.0, 296.0]},
    {id:'case-iphone16',    brand:'Apple',    model:'iPhone 16',               print:[181,124,118,170],fullPrint:[163.0, 15.0, 154.0, 298.0]},
    {id:'case-s24',         brand:'Samsung',  model:'Samsung Galaxy S24',      print:[183,136,114,158],fullPrint:[165.0, 15.0, 149.0, 298.0]},
    {id:'case-redmi13',     brand:'Xiaomi',   model:'Xiaomi Redmi Note 13 5G', print:[183,126,114,168],fullPrint:[165.0, 15.0, 150.0, 298.0]},
    {id:'case-pixel9',      brand:'Google',   model:'Google Pixel 9',          print:[182,108,116,186],fullPrint:[166.0, 15.0, 148.0, 298.0]}
  ];
  function normalize(text) {
    return String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ß/g,'ss')
      .replace(/\b(?:xoumi|xouimi|xiomi|xaomi|xioami|saomi)\b/g,'xiaomi')
      .replace(/\b(?:huvai|huvayi|huvay|huwai|huavei|huwey|huawei)\b/g,'huawei')
      .replace(/\b(?:motorala|motorolla|motarola|moto)\b/g,'motorola')
      .replace(/\b(iphone|redmi|xiaomi|pixel|pura|edge|note)(?=\d)/g,'$1 ')
      .replace(/\b(galaxy)\s*s\s*(\d+)/g,'$1 s$2').replace(/\bs\s+(\d+)/g,'s$1')
      .replace(/(\d)(?=ultra\b|pro\b|promax\b)/g,'$1 ').replace(/pro\s*max/g,'pro max').replace(/[^a-z0-9]+/g,' ').trim();
  }
  const vocabulary = new Set(models.flatMap(m=>normalize(m.brand+' '+m.model).split(' ')));
  const names = models.map(m=>({model:m,words:new Set(normalize(m.brand+' '+m.model).split(' '))}));
  const ignored = new Set(['kilif','kilifi','kiliflari','kiliflar','telefon','handy','hulle','hullen','handyhulle','handyhullen','fur','icin']);
  function search(query) {
    const terms=normalize(query).split(' ').filter(t=>t&&!ignored.has(t));
    if(!terms.length)return models;
    return names.filter(n=>terms.every(t=>[...n.words].some(w=>w.startsWith(t)))).map(n=>n.model);
  }
  function identify(query) {
    const tokens=normalize(query).split(' ');
    const hasBrand=tokens.some(t=>vocabulary.has(t)&&!/^\d/.test(t)&&!['pro','ultra','note'].includes(t));
    if(!hasBrand)return {terms:new Set(),matches:[]};
    const terms=new Set(tokens.filter(t=>vocabulary.has(t)||/^\d+$/.test(t)||/^s\d+$/.test(t)));
    const matches=names.filter(n=>[...terms].every(t=>n.words.has(t))).map(n=>n.model);
    // Xiaomi 17 is also the prefix of Xiaomi 17 Ultra. A fully named base model opens its own card.
    const phrase=' '+tokens.join(' ')+' ';
    const exact=matches.filter(m=>phrase.includes(' '+normalize(m.model)+' ')).sort((a,b)=>b.model.length-a.model.length);
    return {terms,matches:exact.length?[exact[0]]:matches};
  }
  window.EJDERCaseCatalog=Object.freeze({models,normalize,search,identify});
})();
