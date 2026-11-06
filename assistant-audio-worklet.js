/* Continuous mono capture; resample to 16 kHz without reopening the microphone. */
class EJDERCapture extends AudioWorkletProcessor {
 constructor(){super();this.frame=new Float32Array(320);this.index=0;this.sum=0;this.weight=0;this.ratio=sampleRate/16000;}
 process(inputs){
  const data=inputs[0]?.[0];if(!data)return true;
  for(const value of data){let left=1;while(left>1e-7){
   const take=Math.min(left,this.ratio-this.weight);this.sum+=value*take;this.weight+=take;left-=take;
   if(this.weight>=this.ratio-1e-7){this.frame[this.index++]=this.sum/this.ratio;this.sum=0;this.weight=0;
    if(this.index===320){this.port.postMessage(this.frame,[this.frame.buffer]);this.frame=new Float32Array(320);this.index=0;}
   }
  }}return true;
 }
}
registerProcessor('ejder-capture',EJDERCapture);
