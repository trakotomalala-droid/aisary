/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= ACCUEIL : NOUVEAU PROJET (3 TYPES), TURBO, UPSCALE, RÉCENTS ================= */
let HOME_DEL=null,HOME_TYPE='human';
function ago(t){const s=(Date.now()-t)/1000;if(s<60)return 'à l’instant';if(s<3600)return 'il y a '+Math.floor(s/60)+' min';if(s<86400)return 'il y a '+Math.floor(s/3600)+' h';const d=Math.floor(s/86400);return d===1?'hier':d<30?'il y a '+d+' jours':new Date(t).toLocaleDateString('fr-FR')}
function projThumb(p){const last=(p.results||[]).slice(-1)[0];if(last)return `<img src="${last.data}" alt="">`;
 if(p.thumb&&p.thumb.svg)return `<svg viewBox="${p.thumb.vb}" preserveAspectRatio="xMidYMid slice">${p.thumb.svg.replace(/id="f(\w+)"/g,'id="t'+p.id+'$1"').replace(/url\(#f(\w+)\)/g,'url(#t'+p.id+'$1)')}</svg>`;
 const sw=BGM[p.scene?.bg]?.sw||'#222';return `<div style="width:100%;height:100%;background:${sw}"></div>`}
const typeCard=(k,v,sel)=>`<button type="button" class="ptype" data-ptype="${k}" style="--tc:${v.accent}" aria-pressed="${sel===k}"><span class="pti">${ic(v.ic)}</span><b>${esc(v.fr)}</b><small>${esc(v.d)}</small></button>`;
async function renderHome(){
 const el=$('#home');let list=[];try{list=await DB.all()}catch(e){}
 list.sort((a,b)=>b.updated-a.updated);
 el.innerHTML=`<div class="homewrap">
  <section class="hero">
   <div class="herotxt"><p class="eyebrow">Tongasoa !</p><h1>Quelle image allez-vous créer aujourd'hui ?</h1>
    <p>Un projet = une image. Choisissez le type, donnez un nom, composez la scène… ou laissez le mode Turbo vous guider en quelques clics.</p>
    <div class="turbo-cta"><button class="btn turbo huge" id="turboBtn">${ic('zap')}Mode Turbo</button><p class="hint">Avatar ou produit, décor, pose, format… et c'est prêt à exporter.</p></div></div>
   <form class="newproj" id="newProjForm"><span class="lab">Nouveau projet</span>
    <div class="ptypes">${Object.entries(PTYPES).map(([k,v])=>typeCard(k,v,HOME_TYPE)).join('')}</div>
    <div class="newrow"><input type="text" id="newProjName" placeholder="Nom : Voiture avec chauffeur, Jus de litchi…" value="${list.length?'':'Mon premier projet'}" autocomplete="off" aria-label="Nom du projet"><button class="btn primary" type="submit">${ic('plus')}Créer</button></div>
    <div class="row-btns"><label class="btn small ghost filebtn">${ic('folder-open')}Ouvrir un fichier .aisary<input type="file" id="openAisary" accept=".aisary,application/json" hidden></label>
    <button class="btn small ghost" type="button" id="replayGuide">${ic('graduation-cap')}Revoir le guide</button>${window.__TAURI__?'':`<a class="btn small ghost" href="https://github.com/trakotomalala-droid/aisary/releases/latest" target="_blank" rel="noopener">${ic('monitor-down')}Appli Mac / Windows</a>`}</div>
   </form>
  </section>
  <button class="upcard" id="upHome">${ic('maximize')}<div><b>Upscale pour l'impression</b><span>Agrandissez une image générée (Gemini, ChatGPT…) pour une affiche, un 4×3 ou une bâche, et exportez un fichier prêt à imprimer.</span></div>${ic('arrow-right')}</button>
  <section class="recents"><div class="rhd"><h2>Projets récents</h2><span class="hint">${list.length} projet${list.length>1?'s':''} · enregistrés sur cet ordinateur</span></div>
   ${list.length?`<div class="pgrid">${list.map(p=>{const t=PTYPES[p.scene?.ptype||'human'];return `<article class="pcard" style="--tc:${t.accent}">
    <button class="pthumb" data-open="${p.id}" aria-label="Ouvrir ${esc(p.name)}">${projThumb(p)}<span class="ptbadge">${ic(t.ic)}${esc(t.fr)}</span>${(p.results||[]).length?`<span class="pbadge">${ic('image')}${p.results.length}</span>`:''}</button>
    <div class="pinfo"><b>${esc(p.name)}</b><small>${esc(BGM[p.scene?.bg]?.fr||'')} · ${ago(p.updated)}</small></div>
    <div class="pact"><button class="ib" data-open="${p.id}" title="Ouvrir">${ic('pencil')}</button><button class="ib" data-openx="${p.id}" title="Aller à l'export">${ic('send')}</button><button class="ib" data-dupp="${p.id}" title="Dupliquer">${ic('copy')}</button><button class="ib" data-savep="${p.id}" title="Enregistrer sur l'ordinateur (.aisary)">${ic('download')}</button>
    <button class="ib danger${HOME_DEL===p.id?' confirm':''}" data-delp="${p.id}" title="Supprimer">${HOME_DEL===p.id?'Confirmer ?':ic('trash-2')}</button></div>
   </article>`}).join('')}</div>`:`<div class="empty">${ic('clapperboard')}<p>Aucun projet pour l'instant. Choisissez un type ci-dessus et créez le premier.</p></div>`}
  </section>
  <p class="hint homefoot">Les projets restent sur cet ordinateur. Pour les emporter ou les partager, enregistrez-les en fichier .aisary.</p>
 </div>`;
 refreshIcons();
}
document.addEventListener('submit',e=>{if(e.target.id==='newProjForm'){e.preventDefault();createProject($('#newProjName').value.trim()||'Nouveau projet',HOME_TYPE)}});
document.addEventListener('change',e=>{if(e.target.id==='openAisary'&&e.target.files[0])importAisaryFile(e.target.files[0])});
document.addEventListener('click',async e=>{
 const t=e.target.closest('[data-open],[data-openx],[data-dupp],[data-savep],[data-delp],[data-ptype],#homeBtn,#replayGuide,#upHome,#upBtn,#saveBtn,#turboBtn');if(!t)return;const d=t.dataset;
 if(d.ptype&&t.closest('#newProjForm')){HOME_TYPE=d.ptype;$$('#newProjForm .ptype').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ptype===HOME_TYPE));setTheme(HOME_TYPE);return}
 if(t.id==='homeBtn'){await saveProjNow();showScreen('home');return}
 if(t.id==='replayGuide'){guideStart();return}
 if(t.id==='upHome'||t.id==='upBtn'){if(PROJ)await saveProjNow();showScreen('upscale');return}
 if(t.id==='saveBtn'){saveProjectExplicit();return}
 if(t.id==='turboBtn'){turboStart();return}
 if(d.open||d.openx){const p=await DB.get(d.open||d.openx);if(p)openProject(p,d.openx?'export':null);return}
 if(d.dupp){const p=await DB.get(d.dupp);const c=newProjectObj(p.name+' (copie)',p.scene,p.refs);await DB.put(c);renderHome();toast('Projet dupliqué');return}
 if(d.savep){const p=await DB.get(d.savep);downloadBlob(projectFileBlob(p),slug(p.name)+'.aisary');return}
 if(d.delp){if(HOME_DEL!==d.delp){HOME_DEL=d.delp;renderHome();setTimeout(()=>{if(HOME_DEL===d.delp){HOME_DEL=null;if(SCREEN==='home')renderHome()}},4000);return}
  HOME_DEL=null;await DB.del(d.delp);if(PROJ&&PROJ.id===d.delp)PROJ=null;renderHome();toast('Projet supprimé')}
});
document.addEventListener('input',e=>{if(e.target.id==='projName'&&PROJ){PROJ.name=e.target.value||'Sans titre';scheduleProjSave()}});
