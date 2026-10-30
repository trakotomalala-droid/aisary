/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= MODES, CLÉS API, EXPORT ================= */
const SERVICES={gemini:{n:'Google Gemini',get:'https://aistudio.google.com/apikey',models:[['gemini-nano-banana-2.1','Nano Banana 2.1 (recommandé)'],['gemini-3-pro-image','Nano Banana Pro (qualité max)'],['gemini-3.1-flash-image','Nano Banana 2'],['gemini-3.1-flash-lite-image','Nano Banana 2 Lite (rapide)'],['gemini-2.5-flash-image','Nano Banana (ancien)']]},
 openai:{n:'OpenAI',get:'https://platform.openai.com/api-keys',models:[['gpt-image-1','GPT Image']]}};
const MODEL_SERVICE={gemini:'gemini',gpt:'openai'};
const MODEL_LINK={gemini:['Ouvrir Gemini','https://gemini.google.com/app'],gpt:['Ouvrir ChatGPT','https://chatgpt.com/'],mj:['Ouvrir Midjourney','https://www.midjourney.com/imagine']};
const PERSEND_DEF={gemini:10,gpt:10,flux:4,mj:3,sd:2};
const perSend=m=>Math.max(1,+(G.perSend[m]||PERSEND_DEF[m]||4));
const keyFor=svc=>G.keys.find(k=>k.id===G.active[svc])||G.keys.find(k=>k.service===svc);
const mask=k=>k.length>10?k.slice(0,4)+'••••••'+k.slice(-4):'••••';
let XP={edited:null,model:null,busy:false,err:null,last:null,done:false};

/* ---------- interrupteur de mode (en-tête) ---------- */
function renderModeSwitch(){const el=$('#modeSwitch');if(!el)return;
 el.innerHTML=`<button data-mode="noapi" aria-pressed="${G.mode==='noapi'}">${ic('folder-output')}<span>Sans API</span></button><button data-mode="api" aria-pressed="${G.mode==='api'}">${ic('zap')}<span>Avec API</span></button>${G.mode==='api'?`<button class="gear" data-keys title="Gérer les clés API">${ic('key-round')}</button>`:''}`;refreshIcons()}
function setMode(m){G.mode=m;saveG();renderModeSwitch();if(m==='api'&&!G.keys.length)openKeys();if(SCREEN==='export')renderExport();toast(m==='api'?'Mode avec API activé':'Mode sans API activé')}

/* ---------- gestion des clés ---------- */
function keysHTML(){return `<div class="wl-card keys" role="dialog" aria-modal="true" aria-labelledby="kT">
 <button class="x close" data-overlay-close aria-label="Fermer">${ic('x')}</button>
 <h2 id="kT">${ic('key-round')} Mes clés API</h2>
 <p>Les clés restent enregistrées dans ce navigateur, sur cet ordinateur. Elles ne sont jamais envoyées ailleurs qu'au service concerné.</p>
 ${G.keys.length?`<div class="klist">${G.keys.map(k=>`<div class="krow"><span class="ksvc">${esc(SERVICES[k.service].n)}</span><b>${esc(k.name)}</b><code>${mask(k.key)}</code>
  <label class="check"><input type="radio" name="act-${k.service}" data-actkey="${k.id}" ${keyFor(k.service)?.id===k.id?'checked':''}> Active</label>
  <button class="btn small" data-testkey="${k.id}">${ic('activity')}Tester</button><button class="btn small ghost danger" data-delkey="${k.id}">${ic('trash-2')}</button></div>`).join('')}</div>`:`<p class="hint">Aucune clé pour l'instant.</p>`}
 ${keyForm('k')}
 <div class="field"><span class="lab">Modèles utilisés</span>${Object.entries(SERVICES).map(([s,v])=>`<div class="row2"><span class="hint" style="align-self:center">${v.n}</span><select data-gmodel="${s}">${v.models.map(([id,l])=>`<option value="${id}"${G.models[s]===id?' selected':''}>${esc(l)}</option>`).join('')}</select></div>`).join('')}</div>
 <p class="hint" id="kStatus" role="status"></p>
</div>`}
function keyForm(p){return `<div class="kform"><span class="lab">Ajouter une clé</span>
  <div class="row2"><select id="${p}Svc" aria-label="Service">${Object.entries(SERVICES).map(([s,v])=>`<option value="${s}">${v.n}</option>`).join('')}</select><input type="text" id="${p}Name" placeholder="Nom : clé agence" aria-label="Nom de la clé"></div>
  <input type="password" id="${p}Key" placeholder="Collez votre clé API ici" aria-label="Clé API" autocomplete="off">
  <div class="row-btns"><button class="btn primary" data-addkey="${p}">${ic('check')}Tester et enregistrer</button>
  <span class="hint">Où la trouver ? <a href="${SERVICES.gemini.get}" target="_blank" rel="noopener">Gemini</a> · <a href="${SERVICES.openai.get}" target="_blank" rel="noopener">OpenAI</a></span></div></div>`}
function openKeys(){openOverlay(keysHTML())}
async function testKey(k){try{let r;if(k.service==='gemini')r=await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1',{headers:{'x-goog-api-key':k.key}});
 else r=await fetch('https://api.openai.com/v1/models',{headers:{Authorization:'Bearer '+k.key}});return r.ok}catch(e){return false}}
async function addKeyFrom(p,statusEl){const svc=$('#'+p+'Svc').value,key=$('#'+p+'Key').value.trim(),name=$('#'+p+'Name').value.trim()||('Clé '+SERVICES[svc].n);
 const st=$(statusEl);if(!key){st.textContent='Collez d’abord votre clé.';return false}
 st.textContent='Test de la clé…';const k={id:'k'+Date.now(),service:svc,name,key};const ok=await testKey(k);
 G.keys.push(k);G.active[svc]=k.id;saveG();$('#'+p+'Key').value='';st.textContent=ok?'Clé valide et enregistrée.':'Clé enregistrée, mais le test a échoué : vérifiez-la ou votre connexion.';return true}
document.addEventListener('click',async e=>{
 const t=e.target.closest('[data-mode],[data-keys],[data-addkey],[data-delkey],[data-testkey],[data-actkey],#exportBtn,[data-xmodel],[data-goto],#xRegen,[data-copyenv],#xFolder,#xZip,#xGen,#xRoot,[data-dlres],[data-saveres],[data-delres],[data-upres],[data-openpj],[data-save]');if(!t)return;const d=t.dataset;
 if(d.mode){setMode(d.mode);return}
 if(d.keys!==undefined){openKeys();return}
 if(d.addkey){if(await addKeyFrom(d.addkey,d.addkey==='k'?'#kStatus':'#gStatus')){if(d.addkey==='k')openKeys();renderModeSwitch()}return}
 if(d.delkey){G.keys=G.keys.filter(k=>k.id!==d.delkey);saveG();openKeys();renderModeSwitch();return}
 if(d.testkey){const k=G.keys.find(x=>x.id===d.testkey);$('#kStatus').textContent='Test…';$('#kStatus').textContent=(await testKey(k))?'« '+k.name+' » fonctionne.':'« '+k.name+' » ne répond pas : clé invalide ou pas de connexion.';return}
 if(d.actkey){const k=G.keys.find(x=>x.id===d.actkey);G.active[k.service]=k.id;saveG();return}
 if(t.id==='exportBtn'){POP=null;showScreen('export');return}
 if(d.xmodel){if(t.disabled)return;S.render.model=d.xmodel;XP.edited=null;save();renderExport();return}
 if(d.goto){S.tab=d.goto;showScreen('editor');all();return}
 if(t.id==='xRegen'){XP.edited=null;renderExport();return}
 if(d.copyenv!==undefined){const pk=buildPack();const txt=pk.envois[+d.copyenv].text;try{await navigator.clipboard.writeText(txt);toast('Envoi '+(+d.copyenv+1)+' copié')}catch(err){const ta=$('#xPrompt');ta&&ta.select();toast('Sélectionné : faites Cmd/Ctrl + C')}return}
 if(t.id==='xRoot'){await pickRoot();renderExport();return}
 if(t.id==='xFolder'){exportFolder();return}
 if(t.id==='xZip'){exportZip();return}
 if(t.id==='xGen'){generate();return}
 if(d.dlres){const r=PROJ.results.find(x=>x.id===d.dlres);downloadBlob(await (await fetch(r.data)).blob(),slug(PROJ.name)+'_'+r.id+'.'+(r.data.includes('png')?'png':'jpg'));return}
 if(d.saveres){const r=PROJ.results.find(x=>x.id===d.saveres);saveResultToFolder(r);return}
 if(d.delres){PROJ.results=PROJ.results.filter(x=>x.id!==d.delres);scheduleProjSave();renderExport();return}
 if(d.upres){const r=PROJ.results.find(x=>x.id===d.upres);await saveProjNow();showScreen('upscale');upAddData(r.data,slug(PROJ.name)+'_'+r.id);return}
 if(d.openpj!==undefined){openAttachments();return}
 if(d.save!==undefined){saveProjectExplicit();return}
});
document.addEventListener('change',e=>{if(e.target.id==='xImport'&&e.target.files[0]){importGenerated(e.target.files[0]);return}const s=e.target.dataset&&e.target.dataset.gmodel;if(s){G.models[s]=e.target.value;saveG();if(SCREEN==='export')renderExport()}
 if(e.target.id==='xPer'){G.perSend[S.render.model]=+e.target.value||1;saveG();renderExport()}});
document.addEventListener('input',e=>{if(e.target.id==='xPrompt'){XP.edited=e.target.value;$('#xWords').textContent=e.target.value.split(/\s+/).filter(Boolean).length+' mots · modifié'}});

/* ---------- paquet d'export ---------- */
const pad=n=>String(n).padStart(2,'0');
function buildPack(){const m=S.render.model,refs=refList(),names=refs.map((r,i)=>`${pad(i+1)}_${slug(r.file)}.jpg`);
 const {main,neg}=buildPrompt(names,m);const text=XP.edited??main;const per=perSend(m);
 const chunks=[];for(let i=0;i<Math.max(refs.length,1);i+=per)chunks.push(refs.map((r,j)=>({...r,name:names[j],n:j+1})).slice(i,i+per));
 const N=chunks.length;const envois=chunks.map((c,i)=>{let t;
  if(N===1)t=text;
  else if(i===0)t=`This request is split into ${N} messages because of the image limit. Do not generate yet: wait for message ${N}.\n\n`+text;
  else t=`Message ${i+1}/${N}: additional reference images for the same scene: ${c.map(x=>`[${x.n}] ${x.name}`).join('; ')}.`+(i===N-1?' All references are now sent: generate the image described in the first message.':' Do not generate yet.');
  return {text:t,files:c}});
 return {model:m,text,neg,refs:refs.map((r,j)=>({...r,name:names[j],n:j+1})),envois}}
function readme(pk){const L=MODEL_LINK[pk.model];return `AIsary — par Toky Rakotomalala
Projet : ${PROJ.name}
Date : ${new Date().toLocaleString('fr-FR')}
Modèle de destination : ${MODELS[pk.model].n}

COMMENT UTILISER CE DOSSIER
Les images à joindre sont dans le dossier « pieces-jointes », déjà numérotées.
${pk.envois.map((e,i)=>`${pk.envois.length>1?`\nENVOI ${i+1}/${pk.envois.length}\n`:''}1. ${i===0?`Ouvrez ${L?L[1]:'votre outil de génération'}`:'Restez dans la même conversation'}
2. Copiez-collez le texte de ${pk.envois.length>1?`envoi-${i+1}.txt`:'prompt_….txt'}
${e.files.length?`3. Glissez depuis « pieces-jointes », dans cet ordre : ${e.files.map(f=>f.name).join(', ')}`:'3. Aucune image à joindre'}
4. Envoyez`).join('\n')}

Une fois l'image générée, enregistrez-la dans le dossier « images » et importez-la dans AIsary (Export > Importer l'image générée) pour l'upscaler.

Le fichier scene.aisary permet de rouvrir cette scène dans AIsary (Accueil > Ouvrir un fichier .aisary).
`}
async function dataToBlob(u){return await (await fetch(u)).blob()}
async function packFiles(pk){const f=[];const mk=MODELS[pk.model].n.split(' ')[0].toLowerCase();
 f.push([`prompt_${mk}.txt`,pk.text]);if(pk.envois.length>1)pk.envois.forEach((e,i)=>f.push([`envoi-${i+1}.txt`,e.text]));
 if(pk.neg)f.push(['prompt_negatif.txt',pk.neg]);f.push(['LISEZ-MOI.txt',readme(pk)]);
 for(const r of pk.refs)f.push(['pieces-jointes/'+r.name,await dataToBlob(R[r.key])]);
 f.push(['scene.aisary',projectFileBlob({...PROJ,scene:S,refs:R})]);return f}

/* ---------- dossier de dépôt ---------- */
let FS_OK=typeof window.showDirectoryPicker==='function';
async function getRoot(ask){let h=null;try{h=await DB.kvGet('root')}catch(e){}
 if(h){try{let p=await h.queryPermission({mode:'readwrite'});if(p!=='granted'&&ask)p=await h.requestPermission({mode:'readwrite'});if(p==='granted')return h}catch(e){}}
 return ask?pickRoot():null}
async function pickRoot(){try{const h=await window.showDirectoryPicker({id:'aisary-depot',mode:'readwrite'});await DB.kvSet('root',h);G.rootName=h.name;saveG();toast('Dossier de dépôt : '+h.name);return h}
 catch(e){if(e.name!=='AbortError')toast('Ce navigateur ne permet pas de choisir un dossier. Utilisez le ZIP.');return null}}
async function writeFile(dir,name,data){const parts=name.split('/');while(parts.length>1)dir=await dir.getDirectoryHandle(parts.shift(),{create:true});name=parts[0];const fh=await dir.getFileHandle(name,{create:true});const w=await fh.createWritable();await w.write(data);await w.close()}
async function nextVersionDir(root){const pd=await root.getDirectoryHandle(slug(PROJ.name),{create:true});let max=0;for await(const [n] of pd.entries()){const m=/^v(\d+)$/.exec(n);if(m)max=Math.max(max,+m[1])}const v='v'+pad(max+1);return {pd,v,vd:await pd.getDirectoryHandle(v,{create:true})}}
async function exportFolder(){await saveProjNow();const pk=buildPack();
 if(!FS_OK){exportZip();return}
 try{const root=await getRoot(true);if(!root)return;const {v,vd}=await nextVersionDir(root);for(const [n,d] of await packFiles(pk))await writeFile(vd,n,d);
  XP.last=`${root.name}/${slug(PROJ.name)}/${v}`;XP.done=true;toast('Dossier créé : '+XP.last);renderExport()}
 catch(e){toast('Écriture impossible ici ('+e.name+'). Téléchargement du ZIP.');exportZip()}}
async function exportZip(){await saveProjNow();if(!window.JSZip){toast('Module ZIP indisponible hors connexion');return}
 const pk=buildPack(),z=new JSZip(),dir=z.folder(slug(PROJ.name));for(const [n,d] of await packFiles(pk))dir.file(n,d);
 downloadBlob(await z.generateAsync({type:'blob'}),slug(PROJ.name)+'.zip');XP.last='ZIP téléchargé : décompressez-le, les images sont dans « pieces-jointes »';XP.done=true;renderExport()}
async function saveSceneToFolder(){const root=await getRoot(false);if(!root||!PROJ)return '';const pd=await root.getDirectoryHandle(slug(PROJ.name),{create:true});await writeFile(pd,slug(PROJ.name)+'.aisary',projectFileBlob({...PROJ,scene:S,refs:R}));return root.name+'/'+slug(PROJ.name)}
async function openAttachments(){if(!XP.done){await exportFolder();if(!XP.done)return}
 if(window.__TAURI__&&XP.lastPath){try{await window.__TAURI__.opener.openPath(XP.lastPath+(navigator.platform.includes('Win')?'\\':'/')+'pieces-jointes');return}catch(err){try{await window.__TAURI__.opener.revealItemInDir(XP.lastPath);return}catch(e2){}}}
 toast('Ouvrez ce dossier dans le Finder ou l’Explorateur : '+XP.last+'/pieces-jointes')}
async function importGenerated(file){if(!file||!PROJ)return;const data=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(file)});
 PROJ.results=PROJ.results||[];PROJ.results.push({id:Date.now().toString(36),data,model:'importée ('+MODELS[S.render.model].n+')',date:Date.now()});await saveProjNow();renderExport();toast('Image ajoutée au projet')}
async function saveResultToFolder(r){try{const root=await getRoot(true);if(!root)return;const pd=await root.getDirectoryHandle(slug(PROJ.name),{create:true});const rd=await pd.getDirectoryHandle('images',{create:true});
 await writeFile(rd,`${slug(PROJ.name)}_${r.id}.${r.data.includes('png')?'png':'jpg'}`,await dataToBlob(r.data));toast('Image enregistrée dans '+root.name+'/'+slug(PROJ.name)+'/images')}catch(e){toast('Enregistrement impossible : utilisez Télécharger')}}

/* ---------- génération par API ---------- */
async function genGemini(key,model,prompt,images,ratio){
 const input=[{type:'text',text:prompt},...images.map(u=>({type:'image',mime_type:u.slice(5,u.indexOf(';')),data:u.split(',')[1]}))];
 const size=model.includes('lite')?'1K':'2K';
 let r=await fetch('https://generativelanguage.googleapis.com/v1beta/interactions',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({model,input,response_format:{type:'image',mime_type:'image/jpeg',aspect_ratio:ratio,image_size:size}})});
 if(r.status===404){ // ancienne interface generateContent
  r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:prompt},...images.map(u=>({inline_data:{mime_type:u.slice(5,u.indexOf(';')),data:u.split(',')[1]}}))]}],generationConfig:{responseModalities:['TEXT','IMAGE'],imageConfig:{aspectRatio:ratio}}})});
  const j=await r.json();if(!r.ok)throw new Error(j.error?.message||('Erreur '+r.status));
  const part=(j.candidates?.[0]?.content?.parts||[]).find(p=>p.inlineData||p.inline_data);if(!part)throw new Error('Le modèle n’a pas renvoyé d’image.');const id=part.inlineData||part.inline_data;return `data:${id.mimeType||id.mime_type};base64,${id.data}`}
 const j=await r.json();if(!r.ok)throw new Error(j.error?.message||('Erreur '+r.status));
 let b=j.output_image?.data;if(!b)for(const st of j.steps||[])for(const c of st.content||[])if(c.type==='image'&&c.data)b=c.data;
 if(!b)throw new Error(j.output_text||'Le modèle n’a pas renvoyé d’image.');return 'data:image/jpeg;base64,'+b}
async function genOpenAI(key,model,prompt,images,ratio){const [a,b]=ratio.split(':').map(Number),size=a===b?'1024x1024':a>b?'1536x1024':'1024x1536';let r;
 if(images.length){const fd=new FormData();fd.append('model',model);fd.append('prompt',prompt);fd.append('size',size);for(const [i,u] of images.entries())fd.append('image[]',await dataToBlob(u),`ref${i+1}.jpg`);
  r=await fetch('https://api.openai.com/v1/images/edits',{method:'POST',headers:{Authorization:'Bearer '+key},body:fd})}
 else r=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({model,prompt,size,n:1})});
 const j=await r.json();if(!r.ok)throw new Error(j.error?.message||('Erreur '+r.status));return 'data:image/png;base64,'+j.data[0].b64_json}
async function generate(){const m=S.render.model,svc=MODEL_SERVICE[m],k=svc&&keyFor(svc);
 if(!k){openKeys();return}
 XP.busy=true;XP.err=null;renderExport();
 try{const pk=buildPack(),imgs=pk.refs.map(r=>R[r.key]);const fn=svc==='gemini'?genGemini:genOpenAI;
  const data=await fn(k.key,G.models[svc],pk.text,imgs,S.render.ratio);
  PROJ.results=PROJ.results||[];PROJ.results.push({id:Date.now().toString(36),data,model:G.models[svc],date:Date.now()});await saveProjNow();toast('Image générée')}
 catch(e){const m=e.message||String(e);XP.err=/Failed to fetch|NetworkError|Load failed/i.test(m)?'Impossible de joindre le service : vérifiez votre connexion internet, puis réessayez.':'Le service a répondu : '+m}
 XP.busy=false;renderExport()}

/* ---------- écran Export ---------- */
function recapCard(tab,icn,title,visual,lines){return `<article class="rcard"><div class="rvis">${visual}</div><div class="rtxt"><span class="rt">${ic(icn)}${esc(title)}</span>${lines.map(l=>`<span>${l}</span>`).join('')}</div><button class="btn small ghost" data-goto="${tab}">${ic('pencil')}Modifier</button></article>`}
function renderExport(){
 if(!PROJ){showScreen('home');return}
 const el=$('#export'),c=S.camera,m=S.render.model,api=G.mode==='api',pk=buildPack(),kitName=(KITS[S.kit]||S.customKits.find(k=>k.id===S.kit)||{fr:'Installation personnalisée'}).fr,T=S.ptype;
 const L=MODEL_LINK[m],mac=navigator.platform.includes('Mac');
 const subj=S.subjects.map((s,i)=>`${S.subjects.length>1?i+1+'. ':''}${esc(KIND[s.kind].fr)}${s.kind==='person'?' · '+esc(flat(OUTFIT)[s.outfit].fr):s.kind==='product'&&s.product?' · '+esc(s.product):''}`).join('<br>');
 const svc=MODEL_SERVICE[m],key=svc&&keyFor(svc),canGen=api&&key;
 const words=pk.text.split(/\s+/).filter(Boolean).length;
 el.innerHTML=`<div class="xwrap">
 <div class="xhead"><button class="btn ghost" data-tab="decor">${ic('arrow-left')}Retour au plateau</button><div><p class="eyebrow">Export · ${esc(PTYPES[T].fr)}</p><h1>${esc(PROJ.name)}</h1></div><span class="sp"></span><button class="btn savebig" data-save>${ic('save')}Enregistrer le projet</button></div>
 <div class="xgrid">
  <section class="xleft">
   <div class="finderbox big"><svg id="xFinder" viewBox="0 0 100 125" aria-label="Aperçu de la composition"></svg><div id="xFinderCap"></div></div>
   <h2 class="xh">${ic('list-checks')}Récapitulatif de la scène</h2>
   <div class="rgrid">
    ${recapCard('decor','image',T==='scene'?'Lieu':'Décor',customBg()?`<img class="rsw" src="${R['d.bgR']}" alt="">`:`<div class="rsw" style="background:${BGM[S.bg].sw}"></div>`,[esc(customBg()?'Mon décor (image)':BGM[S.bg].fr),S.bgNote?'✎ '+esc(S.bgNote.slice(0,60)):'',T==='human'&&S.props.length?esc(S.props.map(k=>DPROPS[k]?.fr).join(', ')):''].filter(Boolean))}
    ${T==='product'?recapCard('produit','package','Produit',`<div class="ricons">${ic(PKTYPE[S.pk.type].ic)}</div>`,[esc((S.subjects[0]&&S.subjects[0].product)||PKTYPE[S.pk.type].fr),esc(S.pk.mat.map(k=>PKMAT[k]?.fr).join(', '))].filter(Boolean)):''}
    ${T==='product'?recapCard('effets','sparkles','Effets',`<div class="ricons">${ic('droplets')}${ic('apple')}</div>`,[esc([...S.pk.splash.map(k=>PKSPLASH[k]?.fr),...S.pk.fruits.map(k=>PKFRUIT[k]?.fr),...S.pk.fx.map(k=>PKFX[k]?.fr)].filter(Boolean).join(', ')||'Aucun effet')]):''}
    ${T==='scene'?recapCard('elements','trees','Éléments',`<div class="ricons">${ic('trees')}</div>`,[esc(S.sc.style.map(k=>SCSTYLE[k]?.fr).join(', ')),esc(SCCOMP[S.sc.comp]?.fr||'')].filter(Boolean)):''}
    ${recapCard('ambiance','sun','Ambiance',timeThumb(S.time,TIME[S.time]),[esc(TIME[S.time].fr)+(S.weather.length?' · '+esc(S.weather.map(k=>WEATHER[k]?.fr).join(', ')):''),esc(S.mood.map(k=>MOOD[k]?.fr).join(', '))].filter(Boolean))}
    ${recapCard('lumiere','lightbulb','Lumières',kitThumb(S.lights.map(l=>[l.type,l.role,l.x,l.y,l.z,l.power,l.kelvin,l.gel])),[esc(kitName),S.lights.length+' lumière'+(S.lights.length>1?'s':'')])}
    ${recapCard('camera','camera','Caméra',framingThumb(c.framing,FRAMING[c.framing]),[esc(BODY[c.body].fr)+' · '+LENS[c.lens].f+' mm · f/'+c.ap,esc(FRAMING[c.framing].fr)+' · '+esc(angleInfo().fr)])}
    ${T==='human'?recapCard('sujet','users','Sujets',`<div class="ricons">${S.subjects.map(s=>ic(KIND[s.kind].ic)).join('')}${S.crowd!=='none'?ic('users'):''}</div>`,[subj,S.crowd!=='none'?'+ '+esc(CROWD[S.crowd].fr):''].filter(Boolean)):''}
    ${recapCard('rendu','frame','Format & style',ratioThumb(S.render.ratio),[S.render.ratio+' · '+esc(USAGE[S.render.usage].fr),esc(STYLE[S.render.style].fr)])}
   </div>
  </section>
  <section class="xright">
   <div class="xstep"><span class="xn">1</span><div class="xbody"><h2>Mode</h2>
    <div class="bigmode"><button data-mode="noapi" aria-pressed="${!api}">${ic('folder-output')}<b>Sans API</b><small>Dossier de projet + copier-coller dans le modèle</small></button><button data-mode="api" aria-pressed="${api}">${ic('zap')}<b>Avec API</b><small>Génération directe dans AIsary</small></button></div></div></div>
   <div class="xstep"><span class="xn">2</span><div class="xbody"><h2>Modèle de destination</h2>
    <div class="xmodels">${Object.entries(MODELS).map(([k,v])=>{const ok=!api||MODEL_SERVICE[k];return `<button class="xmodel" data-xmodel="${k}" aria-pressed="${m===k}" ${ok?'':'disabled'}><b>${v.n}</b><small>${ok?v.s:'Sans API uniquement'}</small></button>`}).join('')}</div>
    ${api&&svc?`<p class="hint">${key?`Clé : ${esc(key.name)} · modèle ${esc(G.models[svc])}`:'Aucune clé pour ce service.'} <button class="linkbtn" data-keys>Gérer les clés</button></p>`:''}</div></div>
   <div class="xstep"><span class="xn">3</span><div class="xbody"><h2>Prompt final</h2>
    <div class="meta"><span id="xWords">${words} mots${XP.edited!=null?' · modifié':''}</span><button class="btn small ghost" id="xRegen">${ic('refresh-cw')}Régénérer depuis la scène</button></div>
    <textarea id="xPrompt" class="promptbox" spellcheck="false" aria-label="Prompt final modifiable">${esc(pk.text)}</textarea>
    ${pk.neg?`<span class="lab">Prompt négatif</span><div class="promptbox neg">${esc(pk.neg)}</div>`:''}
    <p class="hint">Vous pouvez retoucher le texte ici. « Régénérer » revient au prompt calculé depuis la scène.</p></div></div>
   <div class="xstep"><span class="xn">4</span><div class="xbody"><h2>Images de référence</h2>
    ${pk.refs.length?`<div class="xrefs">${pk.refs.map(r=>`<figure><img src="${R[r.key]}" alt=""><figcaption><b>${esc(r.name)}</b><small>${esc(r.fr)}</small></figcaption></figure>`).join('')}</div>`:`<p class="hint">Aucune image de référence. Ajoutez-en dans les menus avancés (sujets, décor, lumière) si besoin.</p>`}
    ${!api&&pk.refs.length?`<div class="perrow"><label class="lab" for="xPer">Images max par envoi</label><input type="number" id="xPer" min="1" max="20" value="${perSend(m)}"><span class="hint">${pk.envois.length>1?`Découpé en ${pk.envois.length} envois.`:'Tout part en un seul envoi.'}</span></div>`:''}</div></div>
   <div class="xstep final"><span class="xn">5</span><div class="xbody">
   ${api?`<h2>Générer</h2>
    <button class="btn primary huge" id="xGen" ${XP.busy?'disabled':''}>${XP.busy?`${ic('loader')}Génération en cours…`:`${ic('wand-sparkles')}Générer l'image`}</button>
    ${!canGen?`<p class="hint">${svc?'Ajoutez une clé pour ce service.':'Ce modèle n’est disponible qu’en mode sans API.'}</p>`:''}
    ${XP.err?`<p class="err">${ic('circle-alert')}${esc(XP.err)}</p>`:''}`
   :`<h2>Exporter vers ${esc(MODELS[m].n)} : suivez les étapes</h2>
    <div class="xactions">
     <div class="gstep${XP.done?' done':''}"><span class="gs">A</span><div><b>Créer le dossier du projet</b><small>${FS_OK?`Dossier de dépôt : <b>${esc(G.rootName||'pas encore choisi')}</b> · <button class="linkbtn" id="xRoot">changer</button> · <button class="linkbtn" id="xZip">ZIP plutôt</button>`:`Votre navigateur télécharge un ZIP. Pour écrire directement dans un dossier : Chrome, Edge ou <a href="https://github.com/trakotomalala-droid/aisary/releases/latest" target="_blank" rel="noopener">l'appli AIsary</a>.`}</small>
      ${XP.last?`<p class="ok">${ic('circle-check')}${esc(XP.last)}</p>`:''}</div><button class="btn ${XP.done?'':'primary'}" id="xFolder">${ic('folder-plus')}${XP.done?'Recréer (nouvelle version)':FS_OK?'Créer le dossier':'Télécharger le ZIP'}</button></div>
     ${pk.envois.map((env,i)=>`<div class="envblock">${pk.envois.length>1?`<span class="ebadge">Envoi ${i+1} sur ${pk.envois.length}</span>`:''}
      <div class="gstep"><span class="gs">1</span><div><b>Copiez le texte</b><small>${pk.envois.length>1&&i>0?'Message suivant, dans la même conversation.':'Le prompt complet, prêt à coller.'}</small></div><button class="btn primary" data-copyenv="${i}">${ic('copy')}Copier le texte</button></div>
      ${env.files.length?`<div class="gstep"><span class="gs">2</span><div><b>Ouvrez les pièces jointes</b><small>Dossier « pieces-jointes » : ${esc(env.files.map(f=>f.name).join(', '))}</small><div class="pjthumbs">${env.files.map(f=>`<figure><img src="${R[f.key]}" alt=""><figcaption>${f.n}</figcaption></figure>`).join('')}</div></div><button class="btn" data-openpj>${ic('folder-open')}${window.__TAURI__?(mac?'Ouvrir dans le Finder':'Ouvrir le dossier'):'Où sont-elles ?'}</button></div>`:''}
      <div class="gstep"><span class="gs">${env.files.length?3:2}</span><div><b>${i===0?`Ouvrez ${esc(MODELS[m].n)}, collez le texte`:'Collez le texte'}${env.files.length?' et glissez les images':''}</b><small>${mac?'Cmd + V':'Ctrl + V'} pour coller${env.files.length?', puis faites glisser les images numérotées dans la zone de message, dans l’ordre.':'.'}</small></div>${i===0&&L?`<a class="btn" href="${L[1]}" target="_blank" rel="noopener">${ic('external-link')}${L[0]}</a>`:''}</div>
     </div>`).join('')}
     <div class="gstep"><span class="gs">${ic('image-down')}</span><div><b>Votre image est générée ?</b><small>Importez-la ici pour la garder dans le projet et l'upscaler pour l'impression.</small></div><label class="btn">${ic('upload')}Importer l'image<input type="file" id="xImport" accept="image/*" hidden></label></div>
    </div>`}
    ${(PROJ.results||[]).length?`<h2 class="xh">${ic('images')}Images générées</h2><div class="results">${PROJ.results.slice().reverse().map(r=>`<figure><img src="${r.data}" alt="Image générée"><figcaption><small>${esc(r.model)} · ${ago(r.date)}</small><span><button class="ib up" data-upres="${r.id}" title="Upscaler pour l'impression">${ic('maximize')}</button><button class="ib" data-dlres="${r.id}" title="Télécharger">${ic('download')}</button>${FS_OK?`<button class="ib" data-saveres="${r.id}" title="Enregistrer dans le dossier du projet">${ic('folder-down')}</button>`:''}<button class="ib danger" data-delres="${r.id}" title="Supprimer">${ic('trash-2')}</button></span></figcaption></figure>`).join('')}</div>`:''}
   </div></div>
  </section>
 </div></div>`;
 renderFinder('#xFinder','#xFinderCap','x');refreshIcons();
}

/* enregistrer un fichier dans un sous-dossier du dossier de dépôt (web Chrome/Edge) */
window.saveToRootSub=window.saveToRootSub||async function(sub,name,blob){const root=await getRoot(true);if(!root)return '';let dir=root;for(const p of sub)dir=await dir.getDirectoryHandle(p,{create:true});await writeFile(dir,name,blob);return [root.name,...sub].join('/')};
