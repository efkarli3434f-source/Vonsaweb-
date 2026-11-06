/* Store-only ZIP: each face remains a separate, standard PNG file. */
(()=>{
  'use strict';
  const table=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
  function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
  function header(length){const bytes=new Uint8Array(length);return {bytes,view:new DataView(bytes.buffer)};}
  async function zip(files){
    const chunks=[],directory=[];let offset=0,directorySize=0;
    for(const file of files){
      if(!/^[a-zA-Z0-9_.-]+$/.test(file.name))throw Error('Invalid export name');
      const name=new TextEncoder().encode(file.name),data=new Uint8Array(await file.blob.arrayBuffer()),crc=crc32(data);
      const local=header(30+name.length),v=local.view;v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);local.bytes.set(name,30);
      const central=header(46+name.length),d=central.view;d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint32(16,crc,true);d.setUint32(20,data.length,true);d.setUint32(24,data.length,true);d.setUint16(28,name.length,true);d.setUint32(42,offset,true);central.bytes.set(name,46);
      chunks.push(local.bytes,data);directory.push(central.bytes);offset+=local.bytes.length+data.length;directorySize+=central.bytes.length;
    }
    const end=header(22),v=end.view;v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);v.setUint32(12,directorySize,true);v.setUint32(16,offset,true);
    return new Blob([...chunks,...directory,end.bytes],{type:'application/zip'});
  }
  window.EJDERDownloads={zip};
})();
