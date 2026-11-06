/* Clean design URLs with static entry pages. Legacy hash links remain valid. */
(() => {
  'use strict';
  const root=new URL('./',document.currentScript.src),rootPath=root.pathname;
  const base=document.querySelector('base');if(base)base.href=base.href;
  const products={
    'case-iphone17promax':['iphone-17-pro-max','iphone-17-pro-max'],
    'case-iphone16promax':['iphone-16-pro-max','iphone-16-pro-max'],
    'case-iphone17':['iphone-17','iphone-17'],
    'case-s26ultra':['samsung-galaxy-s26-ultra','samsung-galaxy-s26-ultra'],
    'case-xiaomi17':['xiaomi-17','xiaomi-17'],
    'case-xiaomi17ultra':['xiaomi-17-ultra','xiaomi-17-ultra'],
    'case-pura80pro':['huawei-pura-80-pro','huawei-pura-80-pro'],
    'case-edge60pro':['motorola-edge-60-pro','motorola-edge-60-pro'],
    'case-iphone16':['iphone-16','iphone-16'],
    'case-s24':['samsung-galaxy-s24','samsung-galaxy-s24'],
    'case-redmi13':['xiaomi-redmi-note-13','xiaomi-redmi-note-13'],
    'case-pixel9':['google-pixel-9','google-pixel-9'],
    mug:['kupa','tasse'],shirt:['tisort','t-shirt'],keychain:['anahtarlik','schluesselanhaenger'],
    hoodie:['hoodie','hoodie'],tote:['bez-canta','stoffbeutel'],poster:['poster','poster'],
    cushion:['yastik','kissen'],giftbox:['hediye-kutusu','geschenkbox']
  };
  const steps={photo:['fotograf','foto'],text:['yazi','text'],preview:['onizleme','vorschau'],png:['indir','herunterladen']};
  const cleanHash=h=>'#/'+String(h||'').replace(/^#\/?/,'').replace(/^\/+|\/+$/g,'');
  let language=document.documentElement.lang==='de'?'de':'tr',current='#/';
  function parse(url){
    if(url.origin!==root.origin)return null;
    if(/^#\//.test(url.hash)&&url.pathname===new URL(document.baseURI).pathname)return {hash:cleanHash(url.hash),lang:language};
    if(!url.pathname.startsWith(rootPath))return null;
    const rel=url.pathname.slice(rootPath.length),match=rel.match(/^(tasarim|gestalten)\/([a-z0-9-]+)\/(?:index\.html)?$/);
    const lang=match?(match[1]==='gestalten'?'de':'tr'):(rel==='de.html'?'de':language);
    if(/^#\//.test(url.hash))return {hash:cleanHash(url.hash),lang};
    if(match){
      const n=lang==='de'?1:0,id=Object.keys(products).find(k=>products[k][n]===match[2]);if(!id)return null;
      let hash='#/studio/'+id;
      const step=url.searchParams.get(n?'schritt':'adim'),theme=url.searchParams.get(n?'motiv':'tema');
      const key=Object.keys(steps).find(k=>steps[k][n]===step);
      if(theme&&/^[a-z0-9-]+$/.test(theme))hash+='/theme/'+theme;else if(key)hash+='/'+key;
      return {hash,lang};
    }
    if(['','index.html','de.html'].includes(rel)&&(!url.hash||url.hash==='#'))return {hash:'#/',lang};
    return null;
  }
  function href(hash,lang=language){
    if(root.protocol==='file:')return cleanHash(hash);
    const parts=cleanHash(hash).slice(2).split('/'),n=lang==='de'?1:0;
    const id=parts[1]==='case'?'case-s24':parts[1];
    if(parts[0]==='studio'&&products[id]){
      const url=new URL((n?'gestalten/':'tasarim/')+products[id][n]+'/',root);
      if(parts[2]==='theme'&&/^[a-z0-9-]+$/.test(parts[3]||''))url.searchParams.set(n?'motiv':'tema',parts[3]);
      else if(steps[parts[2]])url.searchParams.set(n?'schritt':'adim',steps[parts[2]][n]);
      return url.pathname+url.search;
    }
    return rootPath+(n?'de.html':'')+(parts[0]?cleanHash(hash):'');
  }
  function read(){const route=parse(new URL(location.href));if(route){current=route.hash;language=route.lang;}else current=cleanHash(location.hash);}
  function emit(){window.dispatchEvent(new Event('ejderroutechange'));}
  function go(hash){
    const next=cleanHash(hash);if(next===current)return;
    if(root.protocol==='file:'){location.hash=next;return;}
    current=next;history.pushState(null,'',href(current));emit();
  }
  function setLanguage(lang){language=lang==='de'?'de':'tr';history.replaceState(null,'',href(current));}
  function canonicalize(){if(root.protocol!=='file:'&&current.startsWith('#/studio/'))history.replaceState(null,'',href(current));}
  function refresh(node){
    const links=node.nodeType===1&&node.matches('a[href]')?[node]:node.querySelectorAll?.('a[href]')||[];
    for(const a of links){const h=a.getAttribute('href');if(h?.startsWith('#/studio/'))a.setAttribute('href',href(h));}
  }
  read();canonicalize();
  window.EJDERPaths={hash:()=>current,language:()=>language,href,go,setLanguage,refresh};
  function fromURL(){const previous=current,oldLanguage=language;read();canonicalize();if(previous!==current||oldLanguage!==language)emit();}
  window.addEventListener('popstate',fromURL);
  window.addEventListener('hashchange',fromURL);
  document.addEventListener('click',e=>{
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const a=e.target.closest?.('a[href]');if(!a||a.hasAttribute('download')||(a.target&&a.target!=='_self'))return;
    const url=new URL(a.getAttribute('href'),document.baseURI),route=parse(url);if(!route)return;
    e.preventDefault();go(route.hash);
  });
  const observer=new MutationObserver(records=>{for(const r of records){if(r.type==='attributes')refresh(r.target);else for(const n of r.addedNodes)refresh(n);}});
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
  refresh(document);
})();
