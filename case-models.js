/* Camera-safe artwork areas are measured on the same 480 by 332 studio photograph used for preview and export. */
(() => {
  'use strict';
  const models = [
    {id:'case-iphone17promax',brand:'Apple',model:'iPhone 17 Pro Max',print:[171,48,138,266],fullPrint:[173.0, 25.0, 134.0, 282.0],deviceMm:[78,163.4,8.75],previewOnly:true},
    {id:'case-iphone17pro',brand:'Apple',model:'iPhone 17 Pro',print:[184, 123, 112, 171],fullPrint:[165.0, 15.0, 150.1, 298.0],deviceMm:[71.9, 150.0, 8.75]},
    {id:'case-iphoneair',brand:'Apple',model:'iPhone Air',print:[184, 88, 112, 206],fullPrint:[165.2, 15.0, 149.7, 298.0],deviceMm:[74.7, 156.2, 5.64]},
    {id:'case-iphone17',    brand:'Apple',    model:'iPhone 17',               print:[185,112,110,184],fullPrint:[167.0, 15.0, 146.0, 298.0],deviceMm:[71.5, 149.6, 7.95]},
    {id:'case-iphone16promax',brand:'Apple',model:'iPhone 16 Pro Max',print:[171,48,138,266],fullPrint:[173.0, 25.0, 134.0, 282.0],deviceMm:[77.6,163,8.25],previewOnly:true},
    {id:'case-iphone16pro',brand:'Apple',model:'iPhone 16 Pro',print:[184, 124, 112, 170],fullPrint:[165.2, 15.0, 149.7, 298.0],deviceMm:[71.5, 149.6, 8.25]},
    {id:'case-iphone16plus',brand:'Apple',model:'iPhone 16 Plus',print:[183, 119, 113, 175],fullPrint:[164.4, 15.0, 151.2, 298.0],deviceMm:[77.8, 160.9, 7.8]},
    {id:'case-iphone16',    brand:'Apple',    model:'iPhone 16',               print:[181,124,118,170],fullPrint:[163.0, 15.0, 154.0, 298.0],deviceMm:[71.6, 147.6, 7.8]},
    {id:'case-iphone16e',brand:'Apple',model:'iPhone 16e',print:[183, 86, 114, 208],fullPrint:[163.8, 15.0, 152.5, 298.0],deviceMm:[71.5, 146.7, 7.8]},
    {id:'case-iphone15promax',brand:'Apple',model:'iPhone 15 Pro Max',print:[184, 121, 112, 173],fullPrint:[165.0, 15.0, 150.1, 298.0],deviceMm:[76.7, 159.9, 8.25]},
    {id:'case-iphone15pro',brand:'Apple',model:'iPhone 15 Pro',print:[184, 123, 113, 171],fullPrint:[164.6, 15.0, 150.8, 298.0],deviceMm:[70.6, 146.6, 8.25]},
    {id:'case-iphone15',brand:'Apple',model:'iPhone 15',print:[183, 117, 114, 177],fullPrint:[164.1, 15.0, 151.8, 298.0],deviceMm:[71.6, 147.6, 7.8]},
    {id:'case-iphone14',brand:'Apple',model:'iPhone 14',print:[183, 116, 114, 178],fullPrint:[163.8, 15.0, 152.5, 298.0],deviceMm:[71.5, 146.7, 7.8]},
    {id:'case-iphone13',brand:'Apple',model:'iPhone 13',print:[183, 114, 114, 180],fullPrint:[163.8, 15.0, 152.5, 298.0],deviceMm:[71.5, 146.7, 7.65]},
    {id:'case-s26ultra',    brand:'Samsung',  model:'Samsung Galaxy S26 Ultra',print:[186,139,108,157],fullPrint:[168.0, 15.0, 144.0, 298.0],deviceMm:[78.1, 163.6, 7.9]},
    {id:'case-s26plus',brand:'Samsung',model:'Samsung Galaxy S26+',print:[184, 137, 112, 157],fullPrint:[165.1, 15.0, 149.8, 298.0],deviceMm:[75.8, 158.4, 7.3]},
    {id:'case-s26',brand:'Samsung',model:'Samsung Galaxy S26',print:[184, 138, 112, 156],fullPrint:[165.0, 15.0, 150.1, 298.0],deviceMm:[71.7, 149.6, 7.2]},
    {id:'case-s25ultra',brand:'Samsung',model:'Samsung Galaxy S25 Ultra',print:[184, 142, 111, 152],fullPrint:[165.4, 15.0, 149.2, 298.0],deviceMm:[77.6, 162.8, 8.2]},
    {id:'case-s25',brand:'Samsung',model:'Samsung Galaxy S25',print:[184, 137, 112, 157],fullPrint:[164.9, 15.0, 150.3, 298.0],deviceMm:[70.5, 146.9, 7.2]},
    {id:'case-s24ultra',brand:'Samsung',model:'Samsung Galaxy S24 Ultra',print:[183, 143, 114, 151],fullPrint:[163.9, 15.0, 152.2, 298.0],deviceMm:[79.0, 162.3, 8.6]},
    {id:'case-s24',         brand:'Samsung',  model:'Samsung Galaxy S24',      print:[183,136,114,158],fullPrint:[165.0, 15.0, 149.0, 298.0],deviceMm:[70.6, 147.0, 7.6]},
    {id:'case-a56',brand:'Samsung',model:'Samsung Galaxy A56 5G',print:[184, 133, 112, 161],fullPrint:[165.2, 15.0, 149.5, 298.0],deviceMm:[77.5, 162.2, 7.4]},
    {id:'case-a36',brand:'Samsung',model:'Samsung Galaxy A36 5G',print:[184, 132, 112, 162],fullPrint:[164.9, 15.0, 150.2, 298.0],deviceMm:[78.2, 162.9, 7.4]},
    {id:'case-a16',brand:'Samsung',model:'Samsung Galaxy A16 5G',print:[185, 124, 110, 170],fullPrint:[165.8, 15.0, 148.3, 298.0],deviceMm:[77.9, 164.4, 7.9]},
    {id:'case-pixel10pro',brand:'Google',model:'Google Pixel 10 Pro',print:[185, 106, 110, 188],fullPrint:[166.2, 15.0, 147.6, 298.0],deviceMm:[72.0, 152.8, 8.6]},
    {id:'case-pixel10',brand:'Google',model:'Google Pixel 10',print:[185, 106, 110, 188],fullPrint:[166.2, 15.0, 147.6, 298.0],deviceMm:[72.0, 152.8, 8.6]},
    {id:'case-pixel9',      brand:'Google',   model:'Google Pixel 9',          print:[182,108,116,186],fullPrint:[166.0, 15.0, 148.0, 298.0],deviceMm:[72.0, 152.8, 8.5]},
    {id:'case-pixel9a',brand:'Google',model:'Google Pixel 9a',print:[185, 84, 110, 210],fullPrint:[165.8, 15.0, 148.4, 298.0],deviceMm:[73.3, 154.7, 8.9]},
    {id:'case-xiaomi17ultra',brand:'Xiaomi',  model:'Xiaomi 17 Ultra',         print:[186,152,108,144],fullPrint:[168.0, 15.0, 144.0, 297.0],deviceMm:[77.6, 162.9, 8.29]},
    {id:'case-xiaomi17',    brand:'Xiaomi',   model:'Xiaomi 17',               print:[185,129,110,167],fullPrint:[167.0, 15.0, 146.0, 297.0],deviceMm:[71.8, 151.1, 8.06]},
    {id:'case-xiaomi15',brand:'Xiaomi',model:'Xiaomi 15',print:[186, 116, 109, 178],fullPrint:[166.7, 15.0, 146.6, 298.0],deviceMm:[71.2, 152.3, 8.08]},
    {id:'case-redminote14pro',brand:'Xiaomi',model:'Xiaomi Redmi Note 14 Pro 5G',print:[187, 120, 106, 174],fullPrint:[168.1, 15.0, 143.8, 298.0],deviceMm:[74.42, 162.33, 8.4]},
    {id:'case-redmi13',     brand:'Xiaomi',   model:'Xiaomi Redmi Note 13 5G', print:[183,126,114,168],fullPrint:[165.0, 15.0, 150.0, 298.0],deviceMm:[74.95, 161.11, 7.6]},
    {id:'case-pura80pro',   brand:'Huawei',   model:'Huawei Pura 80 Pro',      print:[186,140,108,156],fullPrint:[168.0, 15.0, 144.0, 298.0],deviceMm:[76.1, 163.0, 8.3]},
    {id:'case-edge60pro',   brand:'Motorola', model:'Motorola Edge 60 Pro',    print:[188,116,104,180],fullPrint:[171.0, 16.0, 137.0, 296.0],deviceMm:[73.06, 160.69, 8.24]}
  ];
  function normalize(text) {
    return String(text).toLowerCase().replace(/\+/g,' plus ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/ß/g,'ss')
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
