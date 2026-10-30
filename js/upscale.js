/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= UPSCALE POUR L'IMPRESSION =================
   Trois méthodes : classique HD (hors ligne), IA locale ESRGAN (UpscalerJS + TensorFlow.js),
   IA Gemini 4K (avec clé API). Sortie PNG / JPEG / TIFF avec la résolution (DPI) écrite dans le fichier. */
const UPRESETS={
 a5:{fr:'Flyer A5',w:14.8,h:21,dpi:300},a4:{fr:'A4',w:21,h:29.7,dpi:300},a3:{fr:'Affiche A3',w:29.7,h:42,dpi:300},a2:{fr:'Affiche A2',w:42,h:59.4,dpi:200},
 a1:{fr:'Affiche A1',w:59.4,h:84.1,dpi:150},a0:{fr:'Affiche A0',w:84.1,h:118.9,dpi:120},card:{fr:'Carte de visite',w:8.5,h:5.5,dpi:300},
 roll:{fr:'Roll-up 85×200',w:85,h:200,dpi:100},abri:{fr:'Abribus 120×176',w:120,h:176,dpi:100},b4x3:{fr:'Panneau 4×3 m',w:400,h:300,dpi:30},
 b8x3:{fr:'Bâche 8×3 m',w:800,h:300,dpi:20},b12x4:{fr:'Panneau 12×4 m',w:1200,h:400,dpi:15},custom:{fr:'Sur mesure',w:100,h:70,dpi:100},
};
const UPMETH={classic:{fr:'Classique HD',d:'Rapide, hors ligne. Lisse les pixels et renforce la netteté.',ic:'scaling'},
 ai:{fr:'IA locale (ESRGAN)',d:'Recrée des détails fins. Gratuit, sur votre ordinateur. Plus lent.',ic:'cpu'},
 gemini:{fr:'IA Gemini 4K',d:'Gemini redessine l’image en 4K. Très net, mais peut modifier de petits détails.',ic:'sparkles'}};
const MAXPX=200e6;
let UPS=(()=>{let s=null;try{s=JSON.parse(localStorage.getItem('aisary-ups'))}catch(e){}
 return Object.assign({mode:'print',preset:'b4x3',w:400,h:300,dpi:30,factor:4,pxw:3840,pxh:2160,fit:'cover',auto:true,method:'classic',sharpen:35,denoise:15,fmt:'jpg',q:92},s||{},{items:[],sel:null,busy:false,prog:0,msg:'',result:null,cmp:50})})();
function saveUps(){const {items,sel,busy,prog,msg,result,cmp,...keep}=UPS;try{localStorage.setItem('aisary-ups',JSON.stringify(keep))}catch(e){}}
const upSel=()=>UPS.items.find(x=>x.id===UPS.sel);
function upAddData(url,name){const img=new Image();img.onload=()=>{const it={id:'u'+Date.now()+Math.random().toString(36).slice(2,5),name:(name||'image').replace(/\.[a-z0-9]+$/i,''),url,w:img.naturalWidth,h:img.naturalHeight,img};UPS.items.push(it);UPS.sel=it.id;UPS.result=null;renderUpscale()};img.onerror=()=>toast('Image illisible');img.src=url}
function upAddFiles(files){[...files].filter(f=>f.type.startsWith('image/')).forEach(f=>upAddData(URL.createObjectURL(f),f.name))}

/* ---------- calcul de la taille de sortie ---------- */
function upTarget(it){if(!it)return null;const iw=it.w,ih=it.h;let tw,th,dpi=UPS.dpi,cw=iw,ch=ih,cx=0,cy=0,label;
 if(UPS.mode==='factor'){tw=Math.round(iw*UPS.factor);th=Math.round(ih*UPS.factor);label='×'+UPS.factor}
 else if(UPS.mode==='px'){tw=+UPS.pxw;th=+UPS.pxh;label=tw+' × '+th+' px'}
 else{let w=+UPS.w,h=+UPS.h;if(UPS.auto&&((iw>=ih)!==(w>=h))){[w,h]=[h,w]}tw=Math.round(w/2.54*dpi);th=Math.round(h/2.54*dpi);label=`${fmtCm(w)} × ${fmtCm(h)} à ${dpi} dpi`}
 if(UPS.mode!=='factor'){const ri=iw/ih,rt=tw/th;
  if(UPS.fit==='cover'){if(ri>rt){cw=Math.round(ih*rt);cx=Math.round((iw-cw)/2)}else{ch=Math.round(iw/rt);cy=Math.round((ih-ch)/2)}}
  else if(UPS.fit==='fit'){const s=Math.min(tw/iw,th/ih);tw=Math.round(iw*s);th=Math.round(ih*s)}}
 const pad=UPS.mode!=='factor'&&UPS.fit==='contain',f=pad?Math.min(tw/cw,th/ch):Math.max(tw/cw,th/ch);return {tw,th,cw,ch,cx,cy,f,label,pad}}
const fmtCm=v=>v>=100?(v/100).toLocaleString('fr-FR',{maximumFractionDigits:2})+' m':v.toLocaleString('fr-FR',{maximumFractionDigits:1})+' cm';
const fmtMB=b=>b>1048576?(b/1048576).toFixed(1).replace('.',',')+' Mo':Math.round(b/1024)+' Ko';

/* ---------- moteurs ---------- */
const tick=()=>new Promise(r=>setTimeout(r,0));
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function cropCanvas(it,t){const c=mkCanvas(t.cw,t.ch);c.getContext('2d').drawImage(it.img,t.cx,t.cy,t.cw,t.ch,0,0,t.cw,t.ch);return c}
function denoise(c,amount){if(amount<=0)return c;const ctx=c.getContext('2d'),W=c.width,H=c.height,src=ctx.getImageData(0,0,W,H),d=src.data,o=new Uint8ClampedArray(d.length),a=amount/100*.7;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){let r=0,g=0,b=0,n=0;for(let j=-1;j<=1;j++){const yy=Math.min(H-1,Math.max(0,y+j));for(let i=-1;i<=1;i++){const xx=Math.min(W-1,Math.max(0,x+i)),p=(yy*W+xx)*4;r+=d[p];g+=d[p+1];b+=d[p+2];n++}}
  const p=(y*W+x)*4;o[p]=d[p]*(1-a)+r/n*a;o[p+1]=d[p+1]*(1-a)+g/n*a;o[p+2]=d[p+2]*(1-a)+b/n*a;o[p+3]=d[p+3]}
 src.data.set(o);ctx.putImageData(src,0,0);return c}
async function resizeHQ(src,W,H){let cur=src;while(cur.width*2<W&&cur.height*2<H){const n=mkCanvas(cur.width*2,cur.height*2),x=n.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(cur,0,0,n.width,n.height);cur=n;await tick()}
 const out=mkCanvas(W,H),x=out.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(cur,0,0,W,H);return out}
async function sharpenCanvas(c,amount,radius,onp){if(amount<=0)return;const ctx=c.getContext('2d'),W=c.width,H=c.height,T=512,r=Math.max(1,Math.min(4,radius|0)),k=amount/100*1.4;let done=0;const tot=Math.ceil(W/T)*Math.ceil(H/T);
 for(let ty=0;ty<H;ty+=T)for(let tx=0;tx<W;tx+=T){if(UPS.abort)throw new Error('abort');
  const x0=Math.max(0,tx-r),y0=Math.max(0,ty-r),x1=Math.min(W,tx+T+r),y1=Math.min(H,ty+T+r),w=x1-x0,h=y1-y0,img=ctx.getImageData(x0,y0,w,h),d=img.data,tmp=new Float32Array(w*h*3),bl=new Float32Array(w*h*3);
  for(let y=0;y<h;y++){let acc=[0,0,0];for(let i=-r;i<=r;i++){const xx=Math.min(w-1,Math.max(0,i)),p=(y*w+xx)*4;acc[0]+=d[p];acc[1]+=d[p+1];acc[2]+=d[p+2]}
   for(let x=0;x<w;x++){const q=(y*w+x)*3;tmp[q]=acc[0];tmp[q+1]=acc[1];tmp[q+2]=acc[2];const a=Math.max(0,x-r),b=Math.min(w-1,x+r+1),pa=(y*w+a)*4,pb=(y*w+b)*4;acc[0]+=d[pb]-d[pa];acc[1]+=d[pb+1]-d[pa+1];acc[2]+=d[pb+2]-d[pa+2]}}
  const n=(2*r+1)*(2*r+1);
  for(let x=0;x<w;x++){let acc=[0,0,0];for(let j=-r;j<=r;j++){const yy=Math.min(h-1,Math.max(0,j)),q=(yy*w+x)*3;acc[0]+=tmp[q];acc[1]+=tmp[q+1];acc[2]+=tmp[q+2]}
   for(let y=0;y<h;y++){const q=(y*w+x)*3;bl[q]=acc[0]/n;bl[q+1]=acc[1]/n;bl[q+2]=acc[2]/n;const a=Math.max(0,y-r),b=Math.min(h-1,y+r+1),qa=(a*w+x)*3,qb=(b*w+x)*3;acc[0]+=tmp[qb]-tmp[qa];acc[1]+=tmp[qb+1]-tmp[qa+1];acc[2]+=tmp[qb+2]-tmp[qa+2]}}
  for(let i=0,p=0;i<w*h;i++,p+=4){const q=i*3;for(let c3=0;c3<3;c3++){const v=d[p+c3];d[p+c3]=v+(v-bl[q+c3])*k}}
  const ox=tx-x0,oy=ty-y0;ctx.putImageData(img,x0,y0,ox,oy,Math.min(T,W-tx),Math.min(T,H-ty));
  done++;onp&&onp(done/tot);await tick()}}
/* IA locale */
const AIV={tf:['4.22.0'],up:['1.0.0-beta.19','1.0.0','1.0.0-beta.18','1.0.0-beta.17'],m:['1.0.0','1.0.0-beta.19','1.0.0-beta.18','1.0.0-beta.17','1.0.0-beta.16','1.0.0-beta.15','1.0.0-beta.14','1.0.0-beta.13','1.0.0-beta.12']};
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.async=true;s.onload=res;s.onerror=()=>{s.remove();rej(new Error(src))};document.head.appendChild(s)})}
async function loadFirst(urls,g){if(window[g])return true;for(const u of urls){try{await loadScript(u);if(window[g])return true}catch(e){}}return false}
async function aiReady(scale){const sx=scale===2?'2x':'4x',G2='ESRGANMedium'+(scale===2?'2x':'4x');
 UPS.msg='Chargement du modèle d’IA (première fois : ~10 Mo)…';renderUpProg();
 if(!await loadFirst(['vendor/tf.min.js',...AIV.tf.map(v=>`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@${v}/dist/tf.min.js`)],'tf'))throw new Error('TensorFlow.js indisponible : vérifiez votre connexion internet.');
 if(!await loadFirst(['vendor/upscaler.min.js',...AIV.up.map(v=>`https://cdn.jsdelivr.net/npm/upscaler@${v}/dist/browser/umd/upscaler.min.js`)],'Upscaler'))throw new Error('Module d’upscaling indisponible : vérifiez votre connexion internet.');
 if(!await loadFirst([`vendor/esrgan-medium/${sx}.min.js`,...AIV.m.map(v=>`https://cdn.jsdelivr.net/npm/@upscalerjs/esrgan-medium@${v}/dist/umd/models/esrgan-medium/src/x${scale}/index.min.js`)],G2))throw new Error('Modèle ESRGAN indisponible : vérifiez votre connexion internet.');
 let model=window[G2];try{const r=await fetch(`vendor/esrgan-medium/models/x${scale}/model.json`,{method:'HEAD'});if(r.ok)model={...model,path:`vendor/esrgan-medium/models/x${scale}/model.json`}}catch(e){}
 return new window.Upscaler({model})}
async function aiUpscale(src,f,onp){const scale=f<=2.4?2:4;const up=await aiReady(scale);UPS.msg='L’IA recrée les détails…';renderUpProg();
 const ctl=new AbortController();UPS.ctl=ctl;const run=up.upscale||up.execute;
 const out=await run.call(up,src.toDataURL('image/png'),{patchSize:96,padding:6,awaitNextFrame:true,signal:ctl.signal,progress:a=>{onp(typeof a==='number'?a:0)}});
 const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=out});try{up.dispose&&up.dispose()}catch(e){}
 const c=mkCanvas(img.naturalWidth,img.naturalHeight);c.getContext('2d').drawImage(img,0,0);return c}
/* Gemini 4K */
async function geminiUpscale(src){const k=keyFor('gemini');if(!k)throw new Error('Ajoutez une clé API Gemini (mode Avec API) pour cette méthode.');
 let model=G.models.gemini||'gemini-nano-banana-2.1';if(/lite|2\.5/.test(model))model='gemini-3-pro-image';
 const ratios=['1:1','3:2','2:3','3:4','4:3','4:5','5:4','9:16','16:9','21:9'],r=src.width/src.height;const ar=ratios.reduce((b,x)=>{const [p,q]=x.split(':').map(Number);return Math.abs(Math.log(p/q/r))<Math.abs(Math.log(b[0]/b[1]/r))?[p,q]:b},[1,1]).join(':');
 const s=Math.min(1,2048/Math.max(src.width,src.height)),tmp=mkCanvas(Math.round(src.width*s),Math.round(src.height*s));tmp.getContext('2d').drawImage(src,0,0,tmp.width,tmp.height);
 const data=tmp.toDataURL('image/jpeg',.95);UPS.msg='Gemini redessine l’image en 4K…';renderUpProg();
 const prompt='Upscale this exact image to 4K resolution. Keep exactly the same composition, framing, subjects, faces, products, text, logos and colors. Do not add, remove or change anything: only increase resolution, sharpness and fine natural detail.';
 const r2=await fetch('https://generativelanguage.googleapis.com/v1beta/interactions',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':k.key},body:JSON.stringify({model,input:[{type:'text',text:prompt},{type:'image',mime_type:'image/jpeg',data:data.split(',')[1]}],response_format:{type:'image',mime_type:'image/png',aspect_ratio:ar,image_size:'4K'}})});
 const j=await r2.json();if(!r2.ok)throw new Error(j.error?.message||('Erreur '+r2.status));let b=j.output_image?.data;if(!b)for(const st of j.steps||[])for(const c of st.content||[])if(c.type==='image'&&c.data)b=c.data;
 if(!b)throw new Error('Gemini n’a pas renvoyé d’image.');const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src='data:image/png;base64,'+b});
 const c=mkCanvas(img.naturalWidth,img.naturalHeight);c.getContext('2d').drawImage(img,0,0);return c}

/* ---------- encodage avec DPI ---------- */
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0}return b=>{let c=0xffffffff;for(let i=0;i<b.length;i++)c=t[(c^b[i])&255]^(c>>>8);return (c^0xffffffff)>>>0}})();
const toBlob=(c,type,q)=>new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('Image trop grande pour ce navigateur')),type,q));
async function pngDpi(blob,dpi){const u=new Uint8Array(await blob.arrayBuffer()),ppm=Math.round(dpi/.0254),ch=new Uint8Array(21),dv=new DataView(ch.buffer);
 dv.setUint32(0,9);ch.set([112,72,89,115],4);dv.setUint32(8,ppm);dv.setUint32(12,ppm);ch[16]=1;dv.setUint32(17,CRC(ch.subarray(4,17)));
 const out=new Uint8Array(u.length+21);out.set(u.subarray(0,33));out.set(ch,33);out.set(u.subarray(33),54);return new Blob([out],{type:'image/png'})}
async function jpgDpi(blob,dpi){const u=new Uint8Array(await blob.arrayBuffer());if(u[2]===0xFF&&u[3]===0xE0&&u[6]===0x4A&&u[7]===0x46){u[13]=1;u[14]=dpi>>8;u[15]=dpi&255;u[16]=dpi>>8;u[17]=dpi&255;return new Blob([u],{type:'image/jpeg'})}
 const app0=new Uint8Array([0xFF,0xE0,0,16,0x4A,0x46,0x49,0x46,0,1,1,1,dpi>>8,dpi&255,dpi>>8,dpi&255,0,0]);const out=new Uint8Array(u.length+18);out.set(u.subarray(0,2));out.set(app0,2);out.set(u.subarray(2),20);return new Blob([out],{type:'image/jpeg'})}
async function tiffBlob(c,dpi,onp){const W=c.width,H=c.height,ctx=c.getContext('2d'),RPS=64,ns=Math.ceil(H/RPS),nt=12,ifd=8,ifdSize=2+nt*12+4,ext=ifd+ifdSize,bpsOff=ext,xrOff=ext+6,yrOff=ext+14,soOff=ext+22,sbOff=soOff+ns*4,dataOff=sbOff+ns*4,total=dataOff+W*H*3;
 const buf=new Uint8Array(total),dv=new DataView(buf.buffer);buf.set([0x49,0x49,42,0]);dv.setUint32(4,ifd,true);dv.setUint16(ifd,nt,true);let p=ifd+2;
 const tag=(t,ty,cnt,val)=>{dv.setUint16(p,t,true);dv.setUint16(p+2,ty,true);dv.setUint32(p+4,cnt,true);if(ty===3&&cnt===1)dv.setUint16(p+8,val,true);else dv.setUint32(p+8,val,true);p+=12};
 tag(256,4,1,W);tag(257,4,1,H);tag(258,3,3,bpsOff);tag(259,3,1,1);tag(262,3,1,2);tag(273,4,ns,ns===1?dataOff:soOff);tag(277,3,1,3);tag(278,4,1,RPS);tag(279,4,ns,ns===1?Math.min(RPS,H)*W*3:sbOff);tag(282,5,1,xrOff);tag(283,5,1,yrOff);tag(296,3,1,2);dv.setUint32(p,0,true);
 dv.setUint16(bpsOff,8,true);dv.setUint16(bpsOff+2,8,true);dv.setUint16(bpsOff+4,8,true);dv.setUint32(xrOff,dpi,true);dv.setUint32(xrOff+4,1,true);dv.setUint32(yrOff,dpi,true);dv.setUint32(yrOff+4,1,true);
 let o=dataOff;for(let s=0;s<ns;s++){const y=s*RPS,h=Math.min(RPS,H-y);if(ns>1){dv.setUint32(soOff+s*4,o,true);dv.setUint32(sbOff+s*4,h*W*3,true)}const d=ctx.getImageData(0,y,W,h).data;for(let i=0;i<d.length;i+=4){buf[o++]=d[i];buf[o++]=d[i+1];buf[o++]=d[i+2]}
  if(s%16===0){onp&&onp(s/ns);await tick()}}
 return new Blob([buf],{type:'image/tiff'})}

/* ---------- traitement complet ---------- */
async function runUpscale(){const it=upSel();if(!it||UPS.busy)return;const t=upTarget(it);
 if(t.tw*t.th>MAXPX){toast('Taille trop grande pour ce poste : baissez la résolution (dpi).');return}
 UPS.busy=true;UPS.abort=false;UPS.prog=0;UPS.result=null;UPS.err=null;UPS.msg='Préparation…';renderUpscale();const t0=Date.now();
 try{let src=cropCanvas(it,t);if(UPS.method==='classic')denoise(src,UPS.denoise);
  if(UPS.method==='ai'&&t.f>1.05){src=await aiUpscale(src,t.f,a=>{UPS.prog=a*.7;renderUpProg()})}
  else if(UPS.method==='gemini'){src=await geminiUpscale(src);UPS.prog=.6}
  UPS.msg='Mise à la taille finale…';renderUpProg();
  let out;
  if(t.pad){const w=Math.round(t.cw*t.f),h=Math.round(t.ch*t.f),img=await resizeHQ(src,w,h);out=mkCanvas(t.tw,t.th);const x=out.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,t.tw,t.th);x.drawImage(img,Math.round((t.tw-w)/2),Math.round((t.th-h)/2))}
  else out=await resizeHQ(src,t.tw,t.th);
  const sh=UPS.method==='classic'?UPS.sharpen:Math.round(UPS.sharpen*.5);UPS.msg='Netteté…';renderUpProg();
  await sharpenCanvas(out,sh,Math.round(t.f/2)||1,a=>{UPS.prog=.75+a*.15;renderUpProg()});
  UPS.msg='Écriture du fichier…';renderUpProg();const dpi=UPS.mode==='print'?+UPS.dpi:72;let blob;
  if(UPS.fmt==='png')blob=await pngDpi(await toBlob(out,'image/png'),dpi);
  else if(UPS.fmt==='tif')blob=await tiffBlob(out,dpi,a=>{UPS.prog=.9+a*.1;renderUpProg()});
  else blob=await jpgDpi(await toBlob(out,'image/jpeg',UPS.q/100),dpi);
  const prev=out.width*out.height>16e6?await toBlob(await resizeHQ(out,Math.round(out.width*Math.sqrt(16e6/(out.width*out.height))),Math.round(out.height*Math.sqrt(16e6/(out.width*out.height)))),'image/jpeg',.9):(UPS.fmt==='tif'?await toBlob(out,'image/jpeg',.92):blob);
  UPS.result={blob,url:URL.createObjectURL(prev),w:out.width,h:out.height,dpi,name:`${it.name}_upscale_${out.width}x${out.height}.${UPS.fmt==='tif'?'tif':UPS.fmt}`,secs:Math.round((Date.now()-t0)/1000)};
  toast('Upscale terminé ✓')}
 catch(e){UPS.err=e.message==='abort'||e.name==='AbortError'?'Upscale annulé.':(/Failed to fetch|NetworkError|Load failed/i.test(e.message)?'Connexion impossible : vérifiez internet ou choisissez la méthode Classique HD.':e.message)}
 UPS.busy=false;UPS.prog=0;renderUpscale()}

/* ---------- écran ---------- */
function renderUpProg(){const b=$('#upProg');if(!b)return;b.querySelector('i').style.width=Math.round(UPS.prog*100)+'%';b.querySelector('span').textContent=UPS.msg+' '+Math.round(UPS.prog*100)+' %'}
function upPreview(it,t){if(!it)return `<label class="updrop" id="upDrop">${ic('image-up')}<b>Glissez vos images ici</b><span>ou cliquez pour choisir (JPEG, PNG, WebP…)</span><input type="file" id="upFile" accept="image/*" multiple hidden></label>`;
 if(UPS.result)return `<div class="cmp" style="--c:${UPS.cmp}%"><img src="${it.url}" alt="Avant"><img class="after" src="${UPS.result.url}" alt="Après"><span class="cl">Avant</span><span class="cr">Après</span><input type="range" min="0" max="100" value="${UPS.cmp}" id="upCmp" aria-label="Comparer avant et après"></div>`;
 const cr=t&&(t.cw<it.w||t.ch<it.h)?`<div class="cropbox" style="left:${t.cx/it.w*100}%;top:${t.cy/it.h*100}%;width:${t.cw/it.w*100}%;height:${t.ch/it.h*100}%"></div>`:'';
 return `<div class="upimg"><img src="${it.url}" alt="">${cr}</div>${cr?'<p class="hint">Le cadre montre la partie gardée pour remplir exactement le format.</p>':''}`}
function renderUpscale(){const el=$('#upscale');if(!el)return;const it=upSel(),t=upTarget(it),m=UPS.method,ok=t&&t.tw*t.th<=MAXPX,mp=t?(t.tw*t.th/1e6):0;
 const warn=t&&(t.f>8?'Agrandissement très fort (×'+t.f.toFixed(1)+') : l’image restera douce. Préférez l’IA, ou baissez les dpi.':t.f>4&&m==='classic'?'Plus de ×4 : la méthode IA donnera plus de détails.':'');
 el.innerHTML=`<div class="upwrap">
 <div class="xhead"><button class="btn ghost" id="upBack">${ic('arrow-left')}Retour</button><div><p class="eyebrow">Upscale</p><h1>Agrandir pour l'impression</h1></div></div>
 <div class="upgrid">
  <section class="upleft">
   <div class="upstage">${upPreview(it,t)}</div>
   ${UPS.items.length?`<div class="upthumbs">${UPS.items.map(x=>`<button class="upth" data-upsel="${x.id}" aria-pressed="${x.id===UPS.sel}"><img src="${x.url}" alt=""><span>${x.w}×${x.h}</span></button><button class="upx" data-updel="${x.id}" aria-label="Retirer">${ic('x')}</button>`).join('')}<label class="upth add">${ic('plus')}<input type="file" id="upFile2" accept="image/*" multiple hidden></label></div>`:''}
   <div class="row-btns"><button class="btn small" id="upFromProj">${ic('folder-open')}Depuis mes projets</button>${it?`<span class="hint">${esc(it.name)} · ${it.w} × ${it.h} px</span>`:''}</div>
  </section>
  <section class="xright">
   <div class="xstep"><span class="xn">1</span><div class="xbody"><h2>Taille finale</h2>
    <div class="seg s3">${[['print','Pour l’impression','printer'],['factor','Multiplier','x'],['px','En pixels','ruler']].map(([k,l,i])=>`<button data-upmode="${k}" aria-pressed="${UPS.mode===k}">${ic(i)}${l}</button>`).join('')}</div>
    ${UPS.mode==='print'?`<div class="chips">${Object.entries(UPRESETS).map(([k,v])=>`<button class="chip" data-uppreset="${k}" aria-pressed="${UPS.preset===k}"><span>${esc(v.fr)}</span></button>`).join('')}</div>
     <div class="row3"><div class="field"><label class="lab">Largeur (cm)</label><input type="number" min="1" step="0.1" data-up="w" value="${UPS.w}"></div><div class="field"><label class="lab">Hauteur (cm)</label><input type="number" min="1" step="0.1" data-up="h" value="${UPS.h}"></div><div class="field"><label class="lab">Résolution (dpi)</label><input type="number" min="10" max="600" step="1" data-up="dpi" value="${UPS.dpi}"></div></div>
     <p class="hint">${ic('info')} Vu de loin, un grand format n'a pas besoin de 300 dpi : 30 à 40 dpi suffisent pour un 4×3 m, 100 à 150 pour une affiche, 300 pour un flyer.</p>
     <div class="field"><span class="lab">Si le format de l'image est différent</span><div class="chips">${[['cover','Remplir et recadrer'],['contain','Image entière + bandes blanches'],['fit','Image entière, taille ajustée']].map(([k,l])=>`<button class="chip" data-upfit="${k}" aria-pressed="${UPS.fit===k}"><span>${l}</span></button>`).join('')}</div>
     <label class="check"><input type="checkbox" data-upchk="auto" ${UPS.auto?'checked':''}> Tourner le format selon l'image (portrait / paysage)</label></div>`:''}
    ${UPS.mode==='factor'?`<div class="chips">${[1.5,2,3,4,6,8].map(f=>`<button class="chip" data-upfactor="${f}" aria-pressed="${+UPS.factor===f}"><span>×${String(f).replace('.',',')}</span></button>`).join('')}</div>`:''}
    ${UPS.mode==='px'?`<div class="row2"><div class="field"><label class="lab">Largeur (px)</label><input type="number" min="16" data-up="pxw" value="${UPS.pxw}"></div><div class="field"><label class="lab">Hauteur (px)</label><input type="number" min="16" data-up="pxh" value="${UPS.pxh}"></div></div><div class="chips">${[['3840','2160','4K'],['7680','4320','8K'],['1920','1080','Full HD']].map(([w,h,l])=>`<button class="chip" data-uppx="${w}x${h}"><span>${l}</span></button>`).join('')}</div>`:''}
    ${t?`<div class="upsum ${ok?'':'bad'}">${ic(ok?'circle-check':'circle-alert')}<div><b>${t.tw.toLocaleString('fr-FR')} × ${t.th.toLocaleString('fr-FR')} px</b><span>${esc(t.label)} · ×${t.f.toFixed(1).replace('.',',')} · ${mp.toFixed(0)} mégapixels</span></div></div>${warn?`<p class="warn">${ic('triangle-alert')}<span>${warn}</span></p>`:''}${ok?'':`<p class="err">${ic('circle-alert')}Trop grand pour être traité ici (max ${MAXPX/1e6} mégapixels) : baissez les dpi ou la taille.</p>`}`:'<p class="hint">Ajoutez une image pour voir la taille finale.</p>'}
   </div></div>
   <div class="xstep"><span class="xn">2</span><div class="xbody"><h2>Méthode</h2>
    <div class="upmeth">${Object.entries(UPMETH).map(([k,v])=>`<button data-upmeth="${k}" aria-pressed="${m===k}">${ic(v.ic)}<b>${v.fr}</b><small>${v.d}</small>${k==='gemini'&&!keyFor('gemini')?'<em>Clé API Gemini requise</em>':''}${k==='ai'?'<em>Internet la 1re fois</em>':''}</button>`).join('')}</div></div></div>
   <div class="xstep"><span class="xn">3</span><div class="xbody"><h2>Finition</h2>
    <div class="field"><label class="lab">Netteté <output>${UPS.sharpen}</output></label><input type="range" min="0" max="100" data-up="sharpen" value="${UPS.sharpen}"></div>
    ${m==='classic'?`<div class="field"><label class="lab">Réduction du bruit / des artefacts <output>${UPS.denoise}</output></label><input type="range" min="0" max="100" data-up="denoise" value="${UPS.denoise}"></div>`:''}
   </div></div>
   <div class="xstep"><span class="xn">4</span><div class="xbody"><h2>Fichier</h2>
    <div class="chips">${[['jpg','JPEG (léger)'],['png','PNG (sans perte)'],['tif','TIFF (imprimeur)']].map(([k,l])=>`<button class="chip" data-upfmt="${k}" aria-pressed="${UPS.fmt===k}"><span>${l}</span></button>`).join('')}</div>
    ${UPS.fmt==='jpg'?`<div class="field"><label class="lab">Qualité JPEG <output>${UPS.q}</output></label><input type="range" min="70" max="100" data-up="q" value="${UPS.q}"></div>`:''}
    <p class="hint">${UPS.mode==='print'?`La résolution de ${UPS.dpi} dpi est écrite dans le fichier. `:''}L'imprimeur convertit en CMJN avec son profil : demandez-lui s'il a une préférence.</p>
   </div></div>
   <div class="xstep final"><span class="xn">${ic('maximize')}</span><div class="xbody">
    ${UPS.busy?`<div class="upprog" id="upProg"><i style="width:${Math.round(UPS.prog*100)}%"></i><span>${esc(UPS.msg)} ${Math.round(UPS.prog*100)} %</span></div><button class="btn" id="upStop">${ic('square')}Annuler</button>`
     :`<button class="btn primary huge" id="upGo" ${it&&ok?'':'disabled'}>${ic('maximize')}Lancer l'upscale</button>`}
    ${UPS.err?`<p class="err">${ic('circle-alert')}${esc(UPS.err)}</p>`:''}
    ${UPS.result?`<div class="upres"><div><b>${esc(UPS.result.name)}</b><span>${UPS.result.w} × ${UPS.result.h} px · ${fmtMB(UPS.result.blob.size)}${UPS.mode==='print'?` · ${UPS.result.dpi} dpi`:''} · ${UPS.result.secs} s</span></div>
     <div class="row-btns"><button class="btn primary" id="upDl">${ic('download')}Télécharger</button>${FS_OK?`<button class="btn" id="upSave">${ic('folder-down')}Enregistrer dans le dossier de dépôt</button>`:''}</div></div>`:''}
   </div></div>
  </section></div></div>`;
 refreshIcons()}
document.addEventListener('click',async e=>{const t=e.target.closest('#upBack,[data-upsel],[data-updel],#upFromProj,[data-upmode],[data-uppreset],[data-upfit],[data-upfactor],[data-uppx],[data-upmeth],[data-upfmt],#upGo,#upStop,#upDl,#upSave,[data-upadd]');if(!t)return;const d=t.dataset;
 if(t.id==='upBack'){showScreen(PROJ?'export':'home');return}
 if(d.upsel){UPS.sel=d.upsel;UPS.result=null;renderUpscale();return}
 if(d.updel){UPS.items=UPS.items.filter(x=>x.id!==d.updel);if(UPS.sel===d.updel){UPS.sel=UPS.items[0]?.id||null;UPS.result=null}renderUpscale();return}
 if(t.id==='upFromProj'){let list=[];try{list=await DB.all()}catch(err){}const res=list.flatMap(p=>(p.results||[]).map(r=>({p,r})));
  openOverlay(`<div class="wl-card" role="dialog" aria-modal="true"><button class="x close" data-overlay-close aria-label="Fermer">${ic('x')}</button><h2>Images de mes projets</h2>${res.length?`<div class="results">${res.map(({p,r})=>`<figure><button class="pthumb" data-upadd="${p.id}|${r.id}"><img src="${r.data}" alt=""></button><figcaption><small>${esc(p.name)}</small></figcaption></figure>`).join('')}</div>`:`<p class="hint">Aucune image générée ou importée dans vos projets pour l'instant. Dans l'Export d'un projet, utilisez « Importer l'image ».</p>`}</div>`);return}
 if(d.upadd){const [pid,rid]=d.upadd.split('|');const p=await DB.get(pid);const r=p&&(p.results||[]).find(x=>x.id===rid);if(r){closeOverlay();upAddData(r.data,slug(p.name)+'_'+r.id)}return}
 if(d.upmode){UPS.mode=d.upmode;UPS.result=null;saveUps();renderUpscale();return}
 if(d.uppreset){const P=UPRESETS[d.uppreset];UPS.preset=d.uppreset;Object.assign(UPS,{w:P.w,h:P.h,dpi:P.dpi});UPS.result=null;saveUps();renderUpscale();return}
 if(d.upfit){UPS.fit=d.upfit;UPS.result=null;saveUps();renderUpscale();return}
 if(d.upfactor){UPS.factor=+d.upfactor;UPS.result=null;saveUps();renderUpscale();return}
 if(d.uppx){const [w,h]=d.uppx.split('x');UPS.pxw=+w;UPS.pxh=+h;UPS.result=null;saveUps();renderUpscale();return}
 if(d.upmeth){UPS.method=d.upmeth;saveUps();renderUpscale();return}
 if(d.upfmt){UPS.fmt=d.upfmt;saveUps();renderUpscale();return}
 if(t.id==='upGo'){runUpscale();return}
 if(t.id==='upStop'){UPS.abort=true;try{UPS.ctl&&UPS.ctl.abort()}catch(err){}return}
 if(t.id==='upDl'&&UPS.result){downloadBlob(UPS.result.blob,UPS.result.name);return}
 if(t.id==='upSave'&&UPS.result){try{const w=await saveToRootSub(['upscale'],UPS.result.name,UPS.result.blob);if(w)toast('Enregistré dans '+w)}catch(err){toast('Enregistrement impossible : utilisez Télécharger')}}
});
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.up;if(k){UPS[k]=e.target.type==='number'||e.target.type==='range'?+e.target.value:e.target.value;if(['w','h','dpi'].includes(k))UPS.preset='custom';
  if(e.target.type==='range'){const o=e.target.closest('.field')?.querySelector('output');if(o)o.textContent=e.target.value;saveUps();return}UPS.result=null;saveUps();clearTimeout(renderUpscale.t);renderUpscale.t=setTimeout(()=>{const a=document.activeElement,id=a&&a.dataset.up;renderUpscale();if(id){const n=$(`[data-up="${id}"]`);if(n){n.focus();try{n.setSelectionRange(n.value.length,n.value.length)}catch(err){}}}},500);return}
 if(e.target.id==='upCmp'){UPS.cmp=+e.target.value;e.target.closest('.cmp').style.setProperty('--c',UPS.cmp+'%')}});
document.addEventListener('change',e=>{if(e.target.id==='upFile'||e.target.id==='upFile2'){upAddFiles(e.target.files);return}if(e.target.dataset&&e.target.dataset.upchk){UPS[e.target.dataset.upchk]=e.target.checked;UPS.result=null;saveUps();renderUpscale()}});
document.addEventListener('dragover',e=>{if(SCREEN==='upscale'&&e.dataTransfer&&[...(e.dataTransfer.types||[])].includes('Files')){e.preventDefault();const d=$('#upDrop');d&&d.classList.add('over')}});
document.addEventListener('drop',e=>{if(SCREEN==='upscale'&&e.dataTransfer&&e.dataTransfer.files.length&&!e.target.closest('.slot')){e.preventDefault();upAddFiles(e.dataTransfer.files)}});
