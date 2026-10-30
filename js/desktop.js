/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= APPLICATION DE BUREAU (Mac / Windows) =================
   Quand AIsary tourne dans l'application (Tauri), on remplace les fonctions
   « navigateur » par les fonctions natives : dossier choisi dans le Finder ou
   l'Explorateur, enregistrement de fichiers, liens ouverts dans le navigateur. */
const DESK=window.__TAURI__||null;
const RELEASES='https://github.com/trakotomalala-droid/aisary/releases/latest';
if(DESK){
 document.documentElement.classList.add('desktop');
 const {dialog,fs,opener,path}=DESK;
 FS_OK=true;
 const baseName=p=>String(p).split(/[\\/]/).filter(Boolean).pop()||p;
 pickRoot=async function(){try{const p=await dialog.open({directory:true,multiple:false,title:'Choisir le dossier de dépôt AIsary'});
  if(!p)return null;G.rootPath=p;G.rootName=baseName(p);saveG();toast('Dossier de dépôt : '+G.rootName);return {name:G.rootName,path:p}}catch(e){toast('Impossible d’ouvrir le choix du dossier');return null}};
 getRoot=async function(ask){if(G.rootPath)return {name:G.rootName,path:G.rootPath};return ask?pickRoot():null};
 const writeAny=async(p,d)=>{if(typeof d==='string')await fs.writeTextFile(p,d);else await fs.writeFile(p,new Uint8Array(await d.arrayBuffer()))};
 exportFolder=async function(){await saveProjNow();const pk=buildPack();
  try{const root=await getRoot(true);if(!root)return;const pd=await path.join(root.path,slug(PROJ.name));await fs.mkdir(pd,{recursive:true});
   let max=0;try{for(const e of await fs.readDir(pd)){const m=/^v(\d+)$/.exec(e.name);if(m)max=Math.max(max,+m[1])}}catch(e){}
   const v='v'+pad(max+1),vd=await path.join(pd,v);await fs.mkdir(vd,{recursive:true});
   for(const [n,d] of await packFiles(pk)){const parts=n.split('/');let dir=vd;for(const p of parts.slice(0,-1)){dir=await path.join(dir,p);await fs.mkdir(dir,{recursive:true})}await writeAny(await path.join(dir,parts[parts.length-1]),d)}
   XP.last=`${root.name}/${slug(PROJ.name)}/${v}`;XP.lastPath=vd;XP.done=true;toast('Dossier créé : '+XP.last);renderExport()}
  catch(e){toast('Écriture impossible : '+(e.message||e)+'. Choisissez un autre dossier de dépôt.')}};
 saveResultToFolder=async function(r){try{const root=await getRoot(true);if(!root)return;const d=await path.join(root.path,slug(PROJ.name),'images');await fs.mkdir(d,{recursive:true});
  const f=await path.join(d,`${slug(PROJ.name)}_${r.id}.${r.data.includes('png')?'png':'jpg'}`);await writeAny(f,await dataToBlob(r.data));toast('Image enregistrée dans '+root.name+'/'+slug(PROJ.name)+'/images')}catch(e){toast('Enregistrement impossible : '+(e.message||e))}};
 saveSceneToFolder=async function(){if(!G.rootPath||!PROJ)return '';const pd=await path.join(G.rootPath,slug(PROJ.name));await fs.mkdir(pd,{recursive:true});await writeAny(await path.join(pd,slug(PROJ.name)+'.aisary'),projectFileBlob({...PROJ,scene:S,refs:R}));return G.rootName+'/'+slug(PROJ.name)};
 window.saveToRootSub=async function(sub,name,blob){const root=await getRoot(true);if(!root)return '';const d=await path.join(root.path,...sub);await fs.mkdir(d,{recursive:true});await writeAny(await path.join(d,name),blob);return [root.name,...sub].join('/')};
 downloadBlob=async function(blob,name){try{const p=await dialog.save({defaultPath:name,title:'Enregistrer'});if(!p)return;await writeAny(p,blob);toast('Enregistré : '+baseName(p))}catch(e){toast('Enregistrement impossible : '+(e.message||e))}};
 // liens externes : navigateur par défaut
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="http"]');if(!a)return;e.preventDefault();opener.openUrl(a.href).catch(()=>{})},true);
 document.addEventListener('click',e=>{if(e.target.closest('#xReveal')&&XP.lastPath)opener.revealItemInDir(XP.lastPath).catch(()=>toast('Ouvrez le dossier '+XP.last+' depuis le Finder'))});
}
