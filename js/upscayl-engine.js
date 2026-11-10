/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 *
 * Moteur d'upscaling IA dans le navigateur (WebGPU).
 * Il lit directement les modèles au format ncnn (.param + .bin) fournis par
 * Upscayl (https://github.com/upscayl/upscayl, AGPL-3.0, © Nayam Amarshe, TGS963
 * et contributeurs) et basés sur Real-ESRGAN (© 2021 Xintao Wang, BSD-3-Clause).
 * Voir models/upscayl/NOTICE.md pour l'origine et la licence de chaque modèle.
 */
const UPX=(()=>{
const PAD=12;            // marge autour de chaque tuile (évite les coutures)
const CACHE='aisary-upscayl-v1';

/* ---------- lecture du format ncnn ---------- */
function parseParam(txt){
 const L=txt.split(/\r?\n/);if(L[0].trim()!=='7767517')throw new Error('Fichier .param non reconnu (format ncnn attendu).');
 const layers=[];
 for(const ln of L.slice(2)){const t=ln.trim().split(/\s+/);if(t.length<4)continue;
  const ty=t[0],nm=t[1],nb=+t[2],nt=+t[3],b=t.slice(4,4+nb),o=t.slice(4+nb,4+nb+nt),P={};
  for(const kv of t.slice(4+nb+nt)){const i=kv.indexOf('=');if(i<0)continue;let k=+kv.slice(0,i);const v=kv.slice(i+1);
   if(k<=-23300){P[-k-23300]=v.split(',').slice(1).map(Number)}else P[k]=Number(v)}
  layers.push({ty,nm,b,o,P})}
 return layers}
function h2f(u){const o=new Float32Array(u.length),o32=new Uint32Array(o.buffer);
 for(let i=0;i<u.length;i++){const h=u[i],s=(h&0x8000)<<16,e=(h>>10)&31,m=h&1023;
  if(e===0)o[i]=(s?-1:1)*m*5.960464477539063e-8;else if(e===31)o32[i]=(s|0x7f800000|(m<<13))>>>0;else o32[i]=(s|((e+112)<<23)|(m<<13))>>>0}
 return o}
function loadWeights(layers,buf){const dv=new DataView(buf);let off=0;const W={};
 const raw=n=>{if(off+n*4>buf.byteLength)throw new Error('Fichier .bin trop court');const a=new Float32Array(buf.slice(off,off+n*4));off+=n*4;return a};
 const flagged=n=>{const tag=dv.getUint32(off,true);off+=4;
  if(tag===0x01306B47){const a=h2f(new Uint16Array(buf.slice(off,off+n*2)));off+=Math.ceil(n*2/4)*4;return a}
  if(tag===0||tag===0x0002C056)return raw(n);
  throw new Error('Poids quantifiés (int8) non pris en charge')};
 for(const l of layers){const P=l.P;
  if(l.ty==='Convolution'){const n=P[6],co=P[0],k=P[1]||1,w=flagged(n),b=P[5]?raw(co):new Float32Array(co);W[l.nm]={w,b,co,ci:n/(co*k*k),k}}
  else if(l.ty==='PReLU'){W[l.nm]=raw(P[0]||1)}}
 if(off!==buf.byteLength)throw new Error('Le .bin ne correspond pas au .param');
 return W}

/* ---------- forme des données à travers le réseau ---------- */
function infer(layers,S){const sh={};let out=null;
 for(const l of layers){const P=l.P,X=l.b.map(b=>sh[b]);
  if(X.some(x=>!x))throw new Error('Réseau mal ordonné');
  let y;
  switch(l.ty){
   case 'Input':y=[3,S,S];break;
   case 'Split':case 'Noop':case 'Dropout':l.o.forEach(t=>sh[t]=X[0]);out=l.o[0];continue;
   case 'Convolution':{const k=P[1]||1,kh=P[11]??k,pad=P[4]??0,st=P[3]??1,dl=P[2]??1;
    if(k!==kh||st!==1||dl!==1||!((k===3&&pad===1)||(k===1&&pad===0)))throw new Error('Convolution non prise en charge ('+k+'×'+kh+', pas '+st+')');
    if(P[9]&&P[9]!==1&&P[9]!==2)throw new Error('Activation non prise en charge');y=[P[0],X[0][1],X[0][2]];break}
   case 'ReLU':case 'PReLU':y=X[0];break;
   case 'Concat':if(P[0])throw new Error('Concat non pris en charge');y=[X.reduce((a,x)=>a+x[0],0),X[0][1],X[0][2]];break;
   case 'Eltwise':if((P[0]??1)!==1)throw new Error('Eltwise non pris en charge');y=X[0];break;
   case 'BinaryOp':if(![0,1,2].includes(P[0]??0))throw new Error('Opération non prise en charge');if(!P[1]&&X[1]&&X[1].join()!==X[0].join())throw new Error('Diffusion non prise en charge');y=X[0];break;
   case 'Interp':{if(P[0]!==1)throw new Error('Seul l’agrandissement « plus proche voisin » est pris en charge');const s=Math.round(P[1]);if(s!==Math.round(P[2])||s<1)throw new Error('Interp non pris en charge');y=[X[0][0],X[0][1]*s,X[0][2]*s];break}
   case 'PixelShuffle':{const r=P[0];if(P[1])throw new Error('PixelShuffle non pris en charge');y=[X[0][0]/(r*r),X[0][1]*r,X[0][2]*r];break}
   default:throw new Error('Couche « '+l.ty+' » non prise en charge')}
  sh[l.o[0]]=y;out=l.o[0]}
 return {sh,out}}
function memPlan(layers,S){const {sh,out}=infer(layers,S),uses={};layers.forEach(l=>l.b.forEach(b=>uses[b]=(uses[b]||0)+1));
 const root={},rem={},pool=[];let live=0,peak=0,maxBuf=0;const bytes=s=>s[0]*s[1]*s[2]*4;
 const alloc=n=>{const i=pool.indexOf(n);if(i>=0)pool.splice(i,1);else{live+=n;peak=Math.max(peak,live)}maxBuf=Math.max(maxBuf,n)};
 const use=b=>{const r=root[b];if(--rem[r]===0&&r!==out)pool.push(bytes(sh[r]))};
 for(const l of layers){if(l.ty==='Split'||l.ty==='Noop'||l.ty==='Dropout'){const r=root[l.b[0]];rem[r]+=l.o.reduce((a,t)=>a+(uses[t]||0),0)-1;l.o.forEach(t=>root[t]=r);continue}
  const t=l.o[0];root[t]=t;rem[t]=uses[t]||0;alloc(bytes(sh[t]));l.b.forEach(use)}
 return {peak,maxBuf,scale:sh[out][1]/S}}

/* ---------- WebGPU ---------- */
const WG_CONV=`struct P{cin:u32,cout:u32,h:u32,w:u32,act:u32,slope:f32,r0:u32,r1:u32}
@group(0)@binding(0) var<storage,read> X:array<f32>;@group(0)@binding(1) var<storage,read> Wt:array<f32>;
@group(0)@binding(2) var<storage,read> Bs:array<f32>;@group(0)@binding(3) var<storage,read_write> Y:array<f32>;@group(0)@binding(4) var<uniform> p:P;
var<workgroup> tin:array<f32,2592>;var<workgroup> tw:array<f32,576>;
@compute @workgroup_size(8,8,1) fn main(@builtin(workgroup_id) g:vec3u,@builtin(local_invocation_id) l:vec3u,@builtin(local_invocation_index) li:u32){
 let ox=g.x*16u;let oy=g.y*16u;let oc=g.z*8u;var acc:array<vec4f,8>;
 for(var c=0u;c<8u;c++){var b=0.0;if(oc+c<p.cout){b=Bs[oc+c];}acc[c]=vec4f(b);}
 for(var c0=0u;c0<p.cin;c0+=8u){
  for(var i=li;i<2592u;i+=64u){let c=i/324u;let r=i-c*324u;let yy=r/18u;let xx=r-yy*18u;let gy=i32(oy+yy)-1;let gx=i32(ox+xx)-1;let gc=c0+c;var v=0.0;
   if(gc<p.cin&&gy>=0&&gx>=0&&gy<i32(p.h)&&gx<i32(p.w)){v=X[(gc*p.h+u32(gy))*p.w+u32(gx)];}tin[i]=v;}
  for(var i=li;i<576u;i+=64u){let c=i/72u;let r=i-c*72u;let k=r/9u;let t=r-k*9u;let gc=c0+k;let go=oc+c;var v=0.0;
   if(gc<p.cin&&go<p.cout){v=Wt[(go*p.cin+gc)*9u+t];}tw[i]=v;}
  workgroupBarrier();
  for(var k=0u;k<8u;k++){for(var ky=0u;ky<3u;ky++){let rb=k*324u+(2u*l.y+ky)*18u+2u*l.x;
   for(var kx=0u;kx<3u;kx++){let b0=rb+kx;let v=vec4f(tin[b0],tin[b0+1u],tin[b0+18u],tin[b0+19u]);let wb=k*9u+ky*3u+kx;
    for(var c=0u;c<8u;c++){acc[c]+=tw[c*72u+wb]*v;}}}}
  workgroupBarrier();}
 let px=ox+2u*l.x;let py=oy+2u*l.y;
 for(var c=0u;c<8u;c++){let co=oc+c;if(co>=p.cout){break;}var a=acc[c];
  if(p.act==1u){a=select(a*p.slope,a,a>vec4f(0.0));}
  let base=co*p.h*p.w;
  if(py<p.h){if(px<p.w){Y[base+py*p.w+px]=a.x;}if(px+1u<p.w){Y[base+py*p.w+px+1u]=a.y;}}
  if(py+1u<p.h){if(px<p.w){Y[base+(py+1u)*p.w+px]=a.z;}if(px+1u<p.w){Y[base+(py+1u)*p.w+px+1u]=a.w;}}}}`;
const IDX='let i=(g.y*nw.x+g.x)*256u+l.x;';
const HEAD='@compute @workgroup_size(256) fn main(@builtin(workgroup_id) g:vec3u,@builtin(num_workgroups) nw:vec3u,@builtin(local_invocation_id) l:vec3u){'+IDX;
const WG_LIN=`struct P{n:u32,mode:u32,ca:f32,cb:f32,act:u32,slope:f32,r0:u32,r1:u32}
@group(0)@binding(0) var<storage,read> A:array<f32>;@group(0)@binding(1) var<storage,read> B:array<f32>;
@group(0)@binding(2) var<storage,read_write> Y:array<f32>;@group(0)@binding(3) var<uniform> p:P;
${HEAD}if(i>=p.n){return;}var v=p.ca*A[i];if(p.mode==0u){v+=p.cb*B[i];}else{v+=p.cb;}
 if(p.act==1u&&v<0.0){v*=p.slope;}Y[i]=v;}`;
const WG_PRELU=`struct P{n:u32,hw:u32,r0:u32,r1:u32}
@group(0)@binding(0) var<storage,read> A:array<f32>;@group(0)@binding(1) var<storage,read> S:array<f32>;
@group(0)@binding(2) var<storage,read_write> Y:array<f32>;@group(0)@binding(3) var<uniform> p:P;
${HEAD}if(i>=p.n){return;}let v=A[i];let c=min(i/p.hw,arrayLength(&S)-1u);Y[i]=select(v*S[c],v,v>0.0);}`;
const WG_UP=`struct P{c:u32,h:u32,w:u32,s:u32}
@group(0)@binding(0) var<storage,read> A:array<f32>;@group(0)@binding(1) var<storage,read_write> Y:array<f32>;@group(0)@binding(2) var<uniform> p:P;
${HEAD}let W2=p.w*p.s;let H2=p.h*p.s;if(i>=p.c*H2*W2){return;}let x=i%W2;let y=(i/W2)%H2;let c=i/(W2*H2);
 Y[i]=A[(c*p.h+y/p.s)*p.w+x/p.s];}`;
const WG_PS=`struct P{c:u32,h:u32,w:u32,r:u32}
@group(0)@binding(0) var<storage,read> A:array<f32>;@group(0)@binding(1) var<storage,read_write> Y:array<f32>;@group(0)@binding(2) var<uniform> p:P;
${HEAD}let W2=p.w*p.r;let H2=p.h*p.r;if(i>=p.c*H2*W2){return;}let x=i%W2;let y=(i/W2)%H2;let c=i/(W2*H2);
 let ic=(c*p.r+y%p.r)*p.r+x%p.r;Y[i]=A[(ic*p.h+y/p.r)*p.w+x/p.r];}`;
const WG_COPY=`struct P{n:u32,off:u32,r0:u32,r1:u32}
@group(0)@binding(0) var<storage,read> A:array<f32>;@group(0)@binding(1) var<storage,read_write> Y:array<f32>;@group(0)@binding(2) var<uniform> p:P;
${HEAD}if(i>=p.n){return;}Y[p.off+i]=A[i];}`;

const GPU={dev:null,pipes:null,info:'',maxBind:0,lostMsg:''};
async function gpuInit(){if(GPU.dev)return GPU;
 if(!navigator.gpu)throw new Error('NOGPU');
 const ad=await navigator.gpu.requestAdapter({powerPreference:'high-performance'});if(!ad)throw new Error('NOGPU');
 const lim=ad.limits;const want={maxStorageBufferBindingSize:lim.maxStorageBufferBindingSize,maxBufferSize:lim.maxBufferSize};
 const dev=await ad.requestDevice({requiredLimits:want});
 GPU.dev=dev;GPU.maxBind=Math.min(lim.maxStorageBufferBindingSize,lim.maxBufferSize);
 try{const i=ad.info||{};GPU.info=[i.vendor,i.architecture,i.description].filter(Boolean).join(' · ')}catch(e){}
 dev.lost.then(r=>{GPU.dev=null;GPU.pipes=null;GPU.lostMsg=r&&r.message||'';MODELS.clear()});
 const mk=code=>dev.createComputePipeline({layout:'auto',compute:{module:dev.createShaderModule({code}),entryPoint:'main'}});
 GPU.pipes={conv:mk(WG_CONV),lin:mk(WG_LIN),prelu:mk(WG_PRELU),up:mk(WG_UP),ps:mk(WG_PS),copy:mk(WG_COPY)};
 return GPU}
const gpuOK=()=>!!navigator.gpu;

/* ---------- modèle chargé sur la carte graphique ---------- */
const MODELS=new Map();
function uploadModel(layers,W){const dev=GPU.dev,G={};
 const buf=a=>{const b=dev.createBuffer({size:Math.max(16,a.byteLength),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});dev.queue.writeBuffer(b,0,a);return b};
 for(const l of layers){const w=W[l.nm];if(!w)continue;
  if(l.ty==='Convolution'){let wt=w.w;if(w.k===1){wt=new Float32Array(w.co*w.ci*9);for(let i=0;i<w.co*w.ci;i++)wt[i*9+4]=w.w[i]}
   G[l.nm]={w:buf(wt),b:buf(w.b),co:w.co,ci:w.ci}}
  else G[l.nm]={s:buf(w)}}
 return G}
function buildPlan(m,S){const dev=GPU.dev,P=GPU.pipes,layers=m.layers,{sh,out}=infer(layers,S);
 const uses={};layers.forEach(l=>l.b.forEach(b=>uses[b]=(uses[b]||0)+1));
 const root={},rem={},bufOf={},pool=new Map(),made=[];const bytes=s=>s[0]*s[1]*s[2]*4;
 const alloc=n=>{const fr=pool.get(n);if(fr&&fr.length)return fr.pop();const b=dev.createBuffer({size:n,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});made.push(b);return b};
 const free=(n,b)=>{if(!pool.has(n))pool.set(n,[]);pool.get(n).push(b)};
 const ops=[];let uOff=0;const U=[];
 const uni=(arr)=>{const o=uOff;U.push([o,arr]);uOff+=256;return o};
 const dummy=dev.createBuffer({size:16,usage:GPUBufferUsage.STORAGE});made.push(dummy);
 let inBuf=null;
 const wg=n=>{const g=Math.ceil(n/256),x=Math.min(g,65535);return [x,Math.ceil(g/x),1]};
 for(const l of layers){const p=l.P;
  if(l.ty==='Split'||l.ty==='Noop'||l.ty==='Dropout'){const r=root[l.b[0]];rem[r]+=l.o.reduce((a,t)=>a+(uses[t]||0),0)-1;l.o.forEach(t=>root[t]=r);continue}
  const t=l.o[0],s=sh[t];root[t]=t;rem[t]=uses[t]||0;const Y=alloc(bytes(s));bufOf[t]=Y;const X=l.b.map(b=>bufOf[root[b]]),xs=l.b.map(b=>sh[b]);
  const n=s[0]*s[1]*s[2];
  switch(l.ty){
   case 'Input':inBuf=Y;break;
   case 'Convolution':{const g=m.gpu[l.nm],act=p[9]===1?1:p[9]===2?1:0,slope=p[9]===2?(p[10]?p[10][0]:0.2):0;
    ops.push({pipe:P.conv,bufs:[X[0],g.w,g.b,Y],u:uni([['u',xs[0][0]],['u',s[0]],['u',s[1]],['u',s[2]],['u',act],['f',slope],['u',0],['u',0]]),wg:[Math.ceil(s[2]/16),Math.ceil(s[1]/16),Math.ceil(s[0]/8)],cost:s[0]*xs[0][0]*9*s[1]*s[2]});break}
   case 'ReLU':ops.push({pipe:P.lin,bufs:[X[0],dummy,Y],u:uni([['u',n],['u',1],['f',1],['f',0],['u',1],['f',p[0]||0],['u',0],['u',0]]),wg:wg(n),cost:n});break;
   case 'PReLU':ops.push({pipe:P.prelu,bufs:[X[0],m.gpu[l.nm].s,Y],u:uni([['u',n],['u',s[1]*s[2]],['u',0],['u',0]]),wg:wg(n),cost:n});break;
   case 'Eltwise':{const c=p[1]||[1,1];ops.push({pipe:P.lin,bufs:[X[0],X[1],Y],u:uni([['u',n],['u',0],['f',c[0]],['f',c[1]],['u',0],['f',0],['u',0],['u',0]]),wg:wg(n),cost:n});break}
   case 'BinaryOp':{const op=p[0]||0;let mode=0,ca=1,cb=1,B=X[1]||dummy;
    if(p[1]){mode=1;const v=p[2]||0;if(op===2){ca=v;cb=0}else{cb=op===1?-v:v}}else if(op===1)cb=-1;else if(op===2)throw new Error('Multiplication de deux couches non prise en charge');
    ops.push({pipe:P.lin,bufs:[X[0],B,Y],u:uni([['u',n],['u',mode],['f',ca],['f',cb],['u',0],['f',0],['u',0],['u',0]]),wg:wg(n),cost:n});break}
   case 'Concat':{let off=0;for(let i=0;i<X.length;i++){const k=xs[i][0]*xs[i][1]*xs[i][2];ops.push({pipe:P.copy,bufs:[X[i],Y],u:uni([['u',k],['u',off],['u',0],['u',0]]),wg:wg(k),cost:k});off+=k}break}
   case 'Interp':ops.push({pipe:P.up,bufs:[X[0],Y],u:uni([['u',xs[0][0]],['u',xs[0][1]],['u',xs[0][2]],['u',Math.round(p[1])]]),wg:wg(n),cost:n});break;
   case 'PixelShuffle':ops.push({pipe:P.ps,bufs:[X[0],Y],u:uni([['u',s[0]],['u',xs[0][1]],['u',xs[0][2]],['u',p[0]]]),wg:wg(n),cost:n});break;
  }
  for(const b of l.b){const r=root[b];if(--rem[r]===0&&r!==out)free(bytes(sh[r]),bufOf[r])}}
 const ubuf=dev.createBuffer({size:Math.max(256,uOff),usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});made.push(ubuf);
 const ua=new ArrayBuffer(Math.max(256,uOff)),udv=new DataView(ua);
 for(const [o,arr] of U)arr.forEach(([ty,v],i)=>ty==='f'?udv.setFloat32(o+i*4,v,true):udv.setUint32(o+i*4,v>>>0,true));
 dev.queue.writeBuffer(ubuf,0,ua);
 for(const op of ops){op.bg=dev.createBindGroup({layout:op.pipe.getBindGroupLayout(0),entries:[...op.bufs.map((b,i)=>({binding:i,resource:{buffer:b}})),{binding:op.bufs.length,resource:{buffer:ubuf,offset:op.u,size:32}}]})}
 const os=sh[out],outBytes=bytes(os),rb=dev.createBuffer({size:outBytes,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST});made.push(rb);
 // tranches d'environ 2 milliards d'opérations (évite que le système coupe la carte graphique)
 const chunks=[];let cur=[],acc=0;for(const op of ops){cur.push(op);acc+=op.cost;if(acc>2e9){chunks.push(cur);cur=[];acc=0}}if(cur.length)chunks.push(cur);
 return {S,os,inBuf,outBuf:bufOf[out],rb,chunks,made,
  async run(input,onp,abort){dev.queue.writeBuffer(this.inBuf,0,input);
   for(let i=0;i<this.chunks.length;i++){if(abort&&abort())throw new Error('abort');
    const enc=dev.createCommandEncoder(),ps=enc.beginComputePass();for(const op of this.chunks[i]){ps.setPipeline(op.pipe);ps.setBindGroup(0,op.bg);ps.dispatchWorkgroups(...op.wg)}ps.end();
    if(i===this.chunks.length-1)enc.copyBufferToBuffer(this.outBuf,0,this.rb,0,outBytes);
    dev.queue.submit([enc.finish()]);await dev.queue.onSubmittedWorkDone();if(GPU.dev!==dev)throw new Error('GPULOST');onp&&onp((i+1)/this.chunks.length)}
   await this.rb.mapAsync(GPUMapMode.READ);const r=new Float32Array(this.rb.getMappedRange().slice(0));this.rb.unmap();return r},
  destroy(){this.made.forEach(b=>{try{b.destroy()}catch(e){}})}}}

/* ---------- fichiers de modèles (avec cache hors ligne) ---------- */
async function getFile(url,onp){let c=null;try{c=await caches.open(CACHE)}catch(e){}
 if(c){const hit=await c.match(url);if(hit){onp&&onp(1);return hit.arrayBuffer()}}
 const res=await fetch(url);if(!res.ok)throw new Error('Modèle introuvable ('+res.status+')');
 const len=+res.headers.get('content-length')||0;let got=0;const parts=[];
 if(res.body&&res.body.getReader){const rd=res.body.getReader();for(;;){const {done,value}=await rd.read();if(done)break;parts.push(value);got+=value.length;onp&&len&&onp(Math.min(1,got/len))}}
 else parts.push(new Uint8Array(await res.arrayBuffer()));
 const blob=new Blob(parts);if(c){try{await c.put(url,new Response(blob))}catch(e){}}return blob.arrayBuffer()}
async function isCached(url){try{const c=await caches.open(CACHE);return !!(await c.match(url))}catch(e){return false}}
const customURL=(name,ext)=>new URL('upscayl-custom/'+encodeURIComponent(name)+'.'+ext,location.href).href;
async function listCustom(){try{const c=await caches.open(CACHE);const ks=await c.keys();return [...new Set(ks.map(r=>r.url).filter(u=>u.includes('/upscayl-custom/')&&u.endsWith('.param')).map(u=>decodeURIComponent(u.split('/upscayl-custom/')[1].replace(/\.param$/,''))))]}catch(e){return []}}
async function addCustom(files){const fs=[...files],byName={};
 for(const f of fs){const m=/^(.*)\.(param|bin)$/i.exec(f.name);if(m){(byName[m[1]]=byName[m[1]]||{})[m[2].toLowerCase()]=f}}
 const added=[],errors=[];const c=await caches.open(CACHE);
 for(const [name,p] of Object.entries(byName)){if(!p.param||!p.bin){errors.push(name+' : il faut le .param ET le .bin');continue}
  try{const layers=parseParam(await p.param.text());loadWeights(layers,await p.bin.arrayBuffer());memPlan(layers,64);
   await c.put(customURL(name,'param'),new Response(p.param));await c.put(customURL(name,'bin'),new Response(p.bin));added.push(name)}
  catch(e){errors.push(name+' : '+e.message)}}
 return {added,errors}}
async function delCustom(name){try{const c=await caches.open(CACHE);await c.delete(customURL(name,'param'));await c.delete(customURL(name,'bin'))}catch(e){}MODELS.delete('custom:'+name)}

async function loadModel(id,base,onp){await gpuInit();if(MODELS.has(id))return MODELS.get(id);
 const isC=id.startsWith('custom:'),name=isC?id.slice(7):id;
 const pu=isC?customURL(name,'param'):new URL(base+name+'.param',location.href).href,bu=isC?customURL(name,'bin'):new URL(base+name+'.bin',location.href).href;
 const txt=new TextDecoder().decode(await getFile(pu));const layers=parseParam(txt);
 const W=loadWeights(layers,await getFile(bu,onp));
 for(const [k,m] of MODELS){m.plans&&m.plans.forEach(p=>p.destroy());Object.values(m.gpu||{}).forEach(g=>Object.values(g).forEach(b=>b&&b.destroy&&b.destroy()));MODELS.delete(k)}
 const m={id,layers,gpu:uploadModel(layers,W),plans:new Map(),scale:memPlan(layers,32).scale};MODELS.set(id,m);return m}

/* ---------- taille des tuiles ---------- */
function pickTile(m,W,H,want){const budget=Math.min(GPU.maxBind||134217728,1<<30),cands=want?[want]:[400,320,256,192,160,128,96,64];
 for(const T0 of cands){const T=Math.min(T0,Math.ceil(Math.max(W,H)/16)*16),S=T+2*PAD,mp=memPlan(m.layers,S);
  if(mp.maxBuf<=budget&&mp.peak<=budget*1.6)return T}
 return 48}

/* ---------- agrandissement complet d'une image ---------- */
function xf(t,n){return (y,x)=>{let a=y,b=x;if(t&4){const z=a;a=b;b=z}if(t&1)b=n-1-b;if(t&2)a=n-1-a;return a*n+b}}
async function upscale(src,id,o){o=o||{};const m=await loadModel(id,o.base||'models/upscayl/',o.onModel);
 const W=src.width,H=src.height,sc=m.scale,T=pickTile(m,W,H,o.tile||0),S=T+2*PAD;
 let pl=m.plans.get(S);if(!pl){GPU.dev.pushErrorScope('out-of-memory');pl=buildPlan(m,S);const err=await GPU.dev.popErrorScope();if(err){pl.destroy();throw new Error('Mémoire de la carte graphique insuffisante : choisissez des tuiles plus petites.')}m.plans.set(S,pl)}
 const sd=src.getContext('2d',{willReadFrequently:true}).getImageData(0,0,W,H).data;
 const out=document.createElement('canvas');out.width=W*sc;out.height=H*sc;const octx=out.getContext('2d');
 const nx=Math.ceil(W/T),ny=Math.ceil(H/T),tta=o.tta?8:1,tot=nx*ny*tta,N=S*S,So=S*sc,No=So*So;let done=0;
 const inp=new Float32Array(3*N),tmp=new Float32Array(3*N),t0=performance.now();
 for(let ty=0;ty<ny;ty++)for(let tx=0;tx<nx;tx++){
  for(let y=0;y<S;y++){const sy=Math.min(H-1,Math.max(0,ty*T-PAD+y));for(let x=0;x<S;x++){const sx=Math.min(W-1,Math.max(0,tx*T-PAD+x)),p=(sy*W+sx)*4,q=y*S+x;inp[q]=sd[p]/255;inp[N+q]=sd[p+1]/255;inp[2*N+q]=sd[p+2]/255}}
  let acc=null;
  for(let t=0;t<tta;t++){let tin=inp;
   if(t){const f=xf(t,S);for(let y=0;y<S;y++)for(let x=0;x<S;x++){const d=f(y,x),q=y*S+x;tmp[d]=inp[q];tmp[N+d]=inp[N+q];tmp[2*N+d]=inp[2*N+q]}tin=tmp}
   const r=await pl.run(tin,f=>o.onp&&o.onp((done+f)/tot,eta(done+f)),o.abort);done++;
   if(tta===1){acc=r;break}
   if(!acc)acc=new Float32Array(3*No);const g=xf(t,So);
   for(let y=0;y<So;y++)for(let x=0;x<So;x++){const s2=g(y,x),q=y*So+x;acc[q]+=r[s2];acc[No+q]+=r[No+s2];acc[2*No+q]+=r[2*No+s2]}}
  const k=tta===1?255:255/tta,tw=Math.min(T,W-tx*T)*sc,th=Math.min(T,H-ty*T)*sc,id=new ImageData(tw,th),d=id.data,o0=PAD*sc;
  for(let y=0;y<th;y++)for(let x=0;x<tw;x++){const q=(o0+y)*So+o0+x,p=(y*tw+x)*4;d[p]=acc[q]*k;d[p+1]=acc[No+q]*k;d[p+2]=acc[2*No+q]*k;d[p+3]=255}
  octx.putImageData(id,tx*T*sc,ty*T*sc);await new Promise(r=>setTimeout(r,0))}
 function eta(f){const el=(performance.now()-t0)/1000,pr=f/tot;return pr>0.01?Math.round(el/pr-el):-1}
 return {canvas:out,tile:T,scale:sc}}

return {gpuOK,gpuInit,GPU,upscale,loadModel,isCached,listCustom,addCustom,delCustom,parseParam,loadWeights,infer,memPlan,PAD}})();
