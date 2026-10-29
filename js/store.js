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
function scheduleProjSave(){if(!PROJ)return;clearTimeout(projT);projT=setTimeout(saveProjNow,700)}
async function saveProjNow(){if(!PROJ)return;PROJ.scene=JSON.parse(JSON.stringify(S));PROJ.refs=R;PROJ.updated=Date.now();PROJ.thumb=finderSnapshot();
 try{await DB.put(PROJ)}catch(e){toast('Sauvegarde impossible dans ce navigateur')}}
const slug=t=>(String(t||'projet').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'projet');
function newProjectObj(name,scene,refs){const now=Date.now();return {id:'p'+now+Math.random().toString(36).slice(2,6),name:name||'Nouveau projet',created:now,updated:now,scene:scene||defaults(),refs:refs||{},results:[],thumb:null}}
async function openProject(p){PROJ=p;if(typeof XP!=='undefined'){XP.edited=null;XP.err=null;XP.last=null}S=normalize(p.scene);R=p.refs||{};POP=null;bgQ='';G.current=p.id;saveG();showScreen('editor');all();$('#projName').value=p.name}
async function createProject(name){const p=newProjectObj(name);await DB.put(p).catch(()=>{});await openProject(p);toast('Projet « '+p.name+' » créé');return p}
function downloadBlob(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
function projectFileBlob(p){return new Blob([JSON.stringify({aisary:1,app:'AIsary par Toky Rakotomalala',name:p.name,scene:p.scene,refs:p.refs,created:p.created,updated:p.updated})],{type:'application/json'})}
async function importAisaryFile(file){try{const j=JSON.parse(await file.text());if(!j.scene)throw 0;const p=newProjectObj(j.name||file.name.replace(/\.aisary$/,''),j.scene,j.refs);await DB.put(p);await openProject(p);toast('Projet importé')}catch(e){toast('Ce fichier n’est pas un projet AIsary valide')}}

/* écrans : accueil, éditeur, export */
let SCREEN='home';
function showScreen(s){SCREEN=s;$('#home').hidden=s!=='home';$('#editor').hidden=s!=='editor';$('#export').hidden=s!=='export';
 document.body.dataset.screen=s;$$('.needproj').forEach(e=>e.hidden=s==='home');
 if(s==='home')renderHome();if(s==='export')renderExport();if(s==='editor'){renderStage();renderFinder()}
 renderModeSwitch();window.scrollTo(0,0)}
