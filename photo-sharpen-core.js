/* EJDER Studio: local, non-generative sharpening (unsharp mask on luminance only).
   Used by photo-sharpen-worker.js and, where workers are unavailable, by the page itself.
   Pixels come from the open editor session and go straight back; nothing is stored or sent. */
(function(scope){
  'use strict';
  function kernel(sigma){
    const r=Math.max(1,Math.ceil(sigma*3)),k=new Float32Array(2*r+1);let sum=0;
    for(let i=-r;i<=r;i++){const v=Math.exp(-(i*i)/(2*sigma*sigma));k[i+r]=v;sum+=v;}
    for(let i=0;i<k.length;i++)k[i]/=sum;
    return {k,r};
  }
  // data: RGBA Uint8ClampedArray, changed in place. Work happens in horizontal strips so a
  // 4096 px photo needs only a few megabytes beyond its own pixels.
  function sharpen(data,w,h,amount,sigma,threshold){
    const n=w*h,luma=new Uint8ClampedArray(n);
    for(let i=0,j=0;i<n;i++,j+=4)luma[i]=(data[j]*77+data[j+1]*150+data[j+2]*29)>>8;
    const {k,r}=kernel(sigma),strip=Math.max(1,Math.min(h,192)),pad=r;
    const a=new Float32Array((strip+2*pad)*w),b=new Float32Array(strip*w),limit=42;
    for(let y0=0;y0<h;y0+=strip){
      const y1=Math.min(h,y0+strip),top=Math.max(0,y0-pad),count=Math.min(h,y1+pad)-top;
      for(let y=0;y<count;y++){
        const src=(top+y)*w,dst=y*w;
        for(let x=0;x<w;x++){
          let s=0;
          for(let t=-r;t<=r;t++){let xx=x+t;if(xx<0)xx=0;else if(xx>=w)xx=w-1;s+=luma[src+xx]*k[t+r];}
          a[dst+x]=s;
        }
      }
      for(let y=y0;y<y1;y++){
        const local=y-top,out=(y-y0)*w;
        for(let x=0;x<w;x++){
          let s=0;
          for(let t=-r;t<=r;t++){let yy=local+t;if(yy<0)yy=0;else if(yy>=count)yy=count-1;s+=a[yy*w+x]*k[t+r];}
          b[out+x]=s;
        }
      }
      for(let y=y0;y<y1;y++){
        const row=y*w,out=(y-y0)*w;
        for(let x=0;x<w;x++){
          const i=row+x,j=i*4;if(data[j+3]===0)continue;
          let d=luma[i]-b[out+x];const m=d<0?-d:d;
          if(m<threshold)d*=m/threshold; // soft threshold keeps skin, sky and noise calm
          d*=amount;if(d>limit)d=limit;else if(d<-limit)d=-limit;
          data[j]+=d;data[j+1]+=d;data[j+2]+=d;
        }
      }
    }
    return data;
  }
  scope.EJDERSharpenCore={sharpen};
})(self);
