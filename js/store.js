/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= RÉGLAGES DE L'APPLI & STOCKAGE LOCAL ================= */
const G=(()=>{let g=null;try{g=JSON.parse(localStorage.getItem('aisary-app'))}catch(e){}
 return Object.assign({mode:'noapi',keys:[],active:{},models:{gemini:'gemini-nano-banana-2.1',openai:'gpt-image-1'},perSend:{},current:null,guided:false,rootName:null},g||{})})();
function saveG(){try{localStorage.setItem('aisary-app',JSON.stringify(G))}catch(e){}}

/* base de données du navigateur (projets, images, dossier de dépôt) */
const DB=(()=>{let p=null;
 function open(){return p||(p=new Promise((res,rej)=>{if(!window.indexedDB)return rej(new Error('no idb'));const r=indexedDB.open('aisary',1);
  r.onupgradeneeded=()=>{r.result.createObjectStore('projects',{keyPath:'id'});r.result.createObjectStore('kv')};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}))}
 async function tx(store,mode,fn){const db=await open();return new Promise((res,rej)=>{const t=db.transaction(store,mode);const q=fn(t.objectStore(store));t.oncomplete=()=>res(q&&'result' in q?q.result:undefined);t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error)})}
 return {all:()=>tx('projects','readonly',s=>s.getAll()),get:id=>tx('projects','readonly',s=>s.get(id)),put:x=>tx('projects','readwrite',s=>s.put(x)),
  del:id=>tx('projects','readwrite',s=>s.delete(id)),kvGet:k=>tx('kv','readonly',s=>s.get(k)),kvSet:(k,v)=>tx('kv','readwrite',s=>s.put(v,k))};
})();

/* projet ouvert */
let PROJ=null,projT=null;
function finderSnapshot(){const f=$('#finder');return f?{vb:f.getAttribute('viewBox'),svg:f.innerHTML}:null}
function scheduleProjSave(){if(!PROJ)return;markDirty();clearTimeout(projT);projT=setTimeout(saveProjNow,700)}
async function saveProjNow(){if(!PROJ)return;clearTimeout(projT);PROJ.scene=JSON.parse(JSON.stringify(S));PROJ.refs=R;PROJ.updated=Date.now();if(SCREEN==='editor')PROJ.thumb=finderSnapshot();
 try{await DB.put(PROJ);markSaved(PROJ.updated)}catch(e){toast('Sauvegarde impossible dans ce navigateur')}}
/* bouton Enregistrer : base locale + fichier .aisary dans le dossier du projet si un dossier de dépôt est choisi */
async function saveProjectExplicit(){if(!PROJ)return;await saveProjNow();let where='';
 try{if(typeof saveSceneToFolder==='function')where=await saveSceneToFolder()}catch(e){}
 toast(where?'Projet enregistré ✓ ('+where+')':'Projet enregistré ✓');const b=$('#saveBtn');if(b){b.classList.add('saved');setTimeout(()=>b.classList.remove('saved'),1400)}}
const slug=t=>(String(t||'projet').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'projet');
function newProjectObj(name,scene,refs){const now=Date.now();return {id:'p'+now+Math.random().toString(36).slice(2,6),name:name||'Nouveau projet',created:now,updated:now,scene:scene||defaults(),refs:refs||{},results:[],thumb:null}}
async function openProject(p,screen){PROJ=p;if(typeof XP!=='undefined'){XP.edited=null;XP.err=null;XP.last=null;XP.done=false;XP.lastPath=null}S=normalize(p.scene);R=p.refs||{};POP=null;bgQ='';G.current=p.id;saveG();showScreen(screen||'editor');all();$('#projName').value=p.name;markSaved(p.updated)}
async function createProject(name,type,screen){const p=newProjectObj(name,defaults(type||'human'));await DB.put(p).catch(()=>{});await openProject(p,screen);if(!screen)toast('Projet « '+p.name+' » créé');return p}
function markSaved(t){const el=$('#saveState');if(!el)return;const d=new Date(t||Date.now());el.textContent='Enregistré à '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});el.dataset.state='ok'}
function markDirty(){const el=$('#saveState');if(el){el.textContent='Enregistrement…';el.dataset.state='busy'}}
function downloadBlob(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
function projectFileBlob(p){return new Blob([JSON.stringify({aisary:1,app:'AIsary par Toky Rakotomalala',name:p.name,scene:p.scene,refs:p.refs,created:p.created,updated:p.updated})],{type:'application/json'})}
async function importAisaryFile(file){try{const j=JSON.parse(await file.text());if(!j.scene)throw 0;const p=newProjectObj(j.name||file.name.replace(/\.aisary$/,''),j.scene,j.refs);await DB.put(p);await openProject(p);toast('Projet importé')}catch(e){toast('Ce fichier n’est pas un projet AIsary valide')}}

/* écrans : accueil, éditeur, export */
let SCREEN='home';
function setTheme(t){document.documentElement.dataset.pt=t||'home';const b=$('#ptBadge');if(b){const P=PTYPES[t];b.hidden=!P;if(P)b.innerHTML=`${ic(P.ic)}<span>${P.fr}</span>`;refreshIcons()}}
function showScreen(s){const prev=SCREEN;SCREEN=s;['home','editor','export','upscale'].forEach(k=>{const el=$('#'+k);if(el)el.hidden=s!==k});
 document.body.dataset.screen=s;$$('.needproj').forEach(e=>e.hidden=s==='home'||s==='upscale'||!PROJ);
 if(typeof WIN!=='undefined'&&WIN){WIN=null;renderWin()}POP=null;
 setTheme(s==='home'?'home':s==='upscale'?'upscale':S.ptype);
 if(s==='home')renderHome();if(s==='export')renderExport();if(s==='editor'){renderStage();renderFinder();renderPop()}if(s==='upscale')renderUpscale();
 renderModeSwitch();window.scrollTo(0,0)}
