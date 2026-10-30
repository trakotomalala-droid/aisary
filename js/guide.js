/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= GUIDE DE DÉMARRAGE & VISITE GUIDÉE ================= */
let GD={path:null,step:'mode'};
const GSTEPS={noapi:['mode','folder','import','upscale','project'],api:['mode','key','model','upscale','project']};
let GD_TYPE='human';
function gProgress(){const list=GSTEPS[GD.path||'noapi'],i=list.indexOf(GD.step);return `<div class="gprog">${list.map((s,j)=>`<i class="${j<=i?'on':''}"></i>`).join('')}<span>Étape ${i+1} sur ${list.length}</span></div>`}
function gNav(next='Suivant',back=true){return `<div class="gnav">${back?`<button class="btn ghost" data-gback>${ic('arrow-left')}Retour</button>`:''}<span class="sp"></span><button class="linkbtn" data-gskip>Passer le guide</button><button class="btn primary" data-gnext>${next}${ic('arrow-right')}</button></div>`}
const folderTree=()=>`<div class="tree">
 <div class="tl0">${ic('folder')}<b>${esc(G.rootName||'Projets AIsary')}</b><small>votre dossier de dépôt</small></div>
 <div class="tl1">${ic('folder')}<b>voiture-avec-chauffeur</b><small>un dossier par projet</small></div>
 <div class="tl2">${ic('folder-open')}<b>v01</b><small>un sous-dossier à chaque export</small></div>
 <div class="tl3">${ic('file-text')}prompt_gemini.txt<small>le prompt à coller</small></div>
 <div class="tl3">${ic('image')}01_sujet1_visage-face.jpg<small>références, déjà numérotées</small></div>
 <div class="tl3">${ic('image')}02_sujet1_haut.jpg</div>
 <div class="tl3">${ic('file-text')}LISEZ-MOI.txt<small>les étapes, pas à pas</small></div>
 <div class="tl3">${ic('file-box')}scene.aisary<small>pour rouvrir la scène</small></div></div>`;
function guideHTML(){const s=GD.step;let b='';
 if(s==='mode')b=`<p class="eyebrow">Guide de démarrage</p><h2>Comment voulez-vous générer vos images ?</h2>
  <p>Vous pourrez changer à tout moment avec l'interrupteur en haut de l'écran.</p>
  <div class="gmodes"><button class="gmode" data-gmode="noapi">${ic('folder-output')}<b>Sans API</b><span>Vous utilisez Gemini, ChatGPT ou Midjourney sur leur site. AIsary prépare un dossier par projet avec le prompt et les images déjà numérotées.</span><em>Idéal pour commencer</em></button>
  <button class="gmode" data-gmode="api">${ic('zap')}<b>Avec API</b><span>Vous avez une clé API Gemini ou OpenAI. AIsary génère l'image directement, sans quitter l'appli.</span><em>Le plus rapide</em></button></div>
  <div class="gnav"><span class="sp"></span><button class="linkbtn" data-gskip>Passer le guide</button></div>`;
 if(s==='folder')b=`${gProgress()}<h2>${ic('folder-plus')} Votre dossier de dépôt</h2>
  <p>Choisissez une fois un dossier sur votre ordinateur. À chaque export, AIsary y range tout ce qu'il faut pour votre modèle :</p>${folderTree()}
  ${FS_OK&&!window.__TAURI__?`<p class="warn">${ic('info')}<span>Dans la fenêtre qui s'ouvre, cliquez sur <b>Nouveau dossier</b>, nommez-le par exemple <b>AIsary</b> (dans Documents), sélectionnez-le, puis cliquez sur <b>Autoriser</b>. Chrome refuse les dossiers protégés comme Documents ou Bureau eux-mêmes : il faut un sous-dossier.</span></p>`:''}${FS_OK?`<button class="btn huge outline" id="gRoot">${ic('folder-search')}${G.rootName?'Dossier choisi : '+esc(G.rootName)+' · changer':'Choisir mon dossier de dépôt'}</button>`:`<p class="warn">${ic('info')}Ce navigateur ne permet pas de choisir un dossier. AIsary vous donnera un fichier ZIP à chaque export. Pour écrire directement dans un dossier, utilisez Chrome ou Edge, ou l'appli AIsary.</p>`}${gNav()}`;
 if(s==='import')b=`${gProgress()}<h2>${ic('send')} Importer dans votre modèle</h2><p>Une fois le dossier créé, il suffit de trois gestes :</p>
  <ol class="gsteps"><li><span class="gico">${ic('copy')}</span><div><b>Copiez le prompt</b><small>Bouton « Copier le texte » dans l'onglet Export, ou ouvrez prompt_gemini.txt.</small></div></li>
  <li><span class="gico">${ic('external-link')}</span><div><b>Ouvrez le modèle et collez</b><small>Le bouton « Ouvrir Gemini » ouvre le site. Collez avec Cmd+V (Mac) ou Ctrl+V (Windows).</small></div></li>
  <li><span class="gico">${ic('images')}</span><div><b>Glissez les images dans l'ordre</b><small>01, 02, 03… depuis le dossier du projet vers la zone de message. Le prompt les cite par leur nom.</small></div></li></ol>
  <div class="gchat"><div class="gmsg">${ic('image')}${ic('image')}<span>01_sujet1_visage-face.jpg · 02_sujet1_haut.jpg</span></div><div class="gmsg txt">A medium shot of a woman… Reference images: [1] 01_sujet1_visage-face.jpg…</div><div class="gsend">${ic('send')}</div></div>
  <p class="hint">Trop d'images pour un seul message ? AIsary découpe en « Envoi 1 », « Envoi 2 »… avec le texte de chaque envoi.</p>${gNav()}`;
 if(s==='key')b=`${gProgress()}<h2>${ic('key-round')} Ajoutez votre clé API</h2><p>La clé reste enregistrée sur cet ordinateur. AIsary ne l'envoie qu'au service choisi.</p>
  ${keyForm('g')}<p class="hint" id="gStatus" role="status">${G.keys.length?G.keys.length+' clé(s) déjà enregistrée(s).':''}</p>
  <p class="hint">Pas encore de clé ? <button class="linkbtn" data-gmode="noapi">Passer en mode sans API</button></p>${gNav()}`;
 if(s==='model')b=`${gProgress()}<h2>${ic('cpu')} Choisissez votre modèle</h2><p>Le modèle qui recevra vos prompts. Vous pourrez le changer dans « Gérer les clés ».</p>
  ${Object.entries(SERVICES).map(([sv,v])=>`<div class="field"><label class="lab">${v.n}${keyFor(sv)?'':' · aucune clé'}</label><select data-gmodel="${sv}">${v.models.map(([id,l])=>`<option value="${id}"${G.models[sv]===id?' selected':''}>${esc(l)}</option>`).join('')}</select></div>`).join('')}${gNav()}`;
 if(s==='upscale')b=`${gProgress()}<h2 class="gup">${ic('maximize')} Upscale : prêt pour l'impression</h2>
  <p>Une image générée par Gemini ou ChatGPT est souvent trop petite pour une affiche ou un panneau 4×3. L'<b>Upscale</b> (en violet) l'agrandit pour l'impression :</p>
  <ol class="gsteps"><li><span class="gico up">${ic('image-up')}</span><div><b>Importez l'image générée</b><small>Depuis l'Export du projet (« Importer l'image »), ou glissez-la directement dans l'écran Upscale.</small></div></li>
  <li><span class="gico up">${ic('printer')}</span><div><b>Choisissez le format d'impression</b><small>A4, affiche A0, roll-up, panneau 4×3 m, bâche… AIsary calcule la taille en pixels et la résolution.</small></div></li>
  <li><span class="gico up">${ic('cpu')}</span><div><b>Choisissez la méthode et exportez</b><small>Classique (rapide), IA locale (plus de détails) ou Gemini 4K (avec clé). Fichier JPEG, PNG ou TIFF prêt pour l'imprimeur.</small></div></li></ol>
  <p class="hint">Le bouton violet « Upscale » est toujours en haut de l'écran.</p>${gNav()}`;
 if(s==='project')b=`${gProgress()}<h2>${ic('clapperboard')} Créez votre premier projet</h2><p>Un projet = une image. Choisissez d'abord le type : l'interface prend sa couleur et ses menus s'adaptent.</p>
  <div class="ptypes">${Object.entries(PTYPES).map(([k,v])=>`<button type="button" class="ptype" data-gtype="${k}" style="--tc:${v.accent}" aria-pressed="${GD_TYPE===k}"><span class="pti">${ic(v.ic)}</span><b>${esc(v.fr)}</b><small>${esc(v.d)}</small></button>`).join('')}</div>
  <input type="text" id="gProj" value="Mon premier projet" aria-label="Nom du projet" autocomplete="off">
  <p class="hint">${ic('zap')} Pressé ? Le <b>mode Turbo</b>, sur l'accueil, crée une image en quelques clics.</p>
  <p>Ensuite, une courte visite vous montre l'interface, du décor jusqu'à l'image finale.</p>${gNav('Créer et visiter')}`;
 return `<div class="wl-card guide" role="dialog" aria-modal="true">${b}</div>`}
function guideStart(){GD={path:null,step:'mode'};openOverlay(guideHTML())}
function gGo(dir){const list=GSTEPS[GD.path||'noapi'],i=list.indexOf(GD.step)+dir;if(i<0){GD.step='mode';GD.path=null}else GD.step=list[Math.min(i,list.length-1)];openOverlay(guideHTML())}
async function gFinish(name){G.guided=true;saveG();closeOverlay();await createProject(name||'Mon premier projet',GD_TYPE);setTimeout(()=>tourStart(),350)}
document.addEventListener('click',async e=>{
 const t=e.target.closest('[data-gmode],[data-gnext],[data-gback],[data-gskip],#gRoot,[data-tnext],[data-tprev],[data-tend],[data-gtype]');if(!t)return;const d=t.dataset;
 if(d.gtype){GD_TYPE=d.gtype;const nm=$('#gProj')?.value;openOverlay(guideHTML());if(nm&&$('#gProj'))$('#gProj').value=nm;setTheme(GD_TYPE);return}
 if(d.gmode){GD.path=d.gmode;G.mode=d.gmode;saveG();renderModeSwitch();GD.step=GSTEPS[d.gmode][1];openOverlay(guideHTML());return}
 if(d.gback!==undefined){gGo(-1);return}
 if(d.gskip!==undefined){G.guided=true;saveG();closeOverlay();showScreen('home');return}
 if(t.id==='gRoot'){await pickRoot();openOverlay(guideHTML());return}
 if(d.gnext!==undefined){
  if(GD.step==='key'&&$('#gKey').value.trim()){if(!await addKeyFrom('g','#gStatus'))return;renderModeSwitch()}
  if(GD.step==='project'){gFinish($('#gProj').value.trim());return}
  gGo(1);return}
 if(d.tnext!==undefined){tourGo(1);return}
 if(d.tprev!==undefined){tourGo(-1);return}
 if(d.tend!==undefined){tourEnd();return}
});

/* ---------- visite guidée ---------- */
const TOUR=[
 {sel:'#homeBtn',t:'Accueil et projets',x:'Revenez ici pour créer un projet, lancer le mode Turbo, rouvrir un projet récent ou un fichier .aisary.'},
 {sel:'#ptBadge',t:'Le type de projet',x:'Personnages en jaune, Packshot en bleu, Paysages en vert : la couleur vous dit toujours dans quel type de projet vous êtes.'},
 {sel:'#saveBtn',t:'Enregistrer',x:'Tout s’enregistre automatiquement, mais ce bouton confirme l’enregistrement et copie le projet dans votre dossier de dépôt.'},
 {sel:'#modeSwitch',t:'Avec ou sans API',x:'Cet interrupteur choisit comment l’image sera créée : dossier à coller dans votre modèle, ou génération directe avec votre clé.'},
 {sel:'#tabs',t:'Les onglets de réglages',x:'Avancez de gauche à droite. Chaque onglet affiche des cartes : cliquez sur « Modifier » pour ouvrir la fenêtre de réglage.',tab:'decor'},
 {sel:'#panel .ccard',t:'Une carte = un réglage',x:'La carte résume vos choix. « Modifier » ouvre une fenêtre avec vos choix (supprimables d’un clic sur ×), une barre pour écrire librement, et les préréglages. Validez, annulez ou réinitialisez.'},
 {sel:'#stagewrap',t:'Le plateau en 3 vues',x:'Dessus, face et côté en même temps. Glissez les lumières, la caméra et les sujets ; cliquez sur un élément pour ouvrir son mini-menu.'},
 {sel:'#addLightBtn',t:'Ajouter une lumière',x:'Ajoutez une lumière directement sur le plateau : softbox, soleil, néon, bougie…'},
 {sel:'.finderbox',t:'Le viseur',x:'Un aperçu indicatif du cadrage, mis à jour à chaque réglage.'},
 {sel:'#exportBtn',t:'L’export',x:'Quand la scène vous plaît : récapitulatif, choix du modèle, puis étapes guidées (copier le texte, ouvrir les pièces jointes, coller dans Gemini).'},
 {sel:'#upBtn',t:'Upscale',x:'Pour l’impression : agrandissez l’image générée en A0, 4×3 m ou bâche, et exportez un fichier prêt pour l’imprimeur.'},
];
let TI=0;
function tourStart(){TI=0;if(!$('#tour')){const d=document.createElement('div');d.id='tour';d.innerHTML='<div id="spot"></div><div id="coach" role="dialog" aria-live="polite"></div>';document.body.appendChild(d)}$('#tour').hidden=false;tourShow()}
function tourEnd(){const t=$('#tour');if(t)t.hidden=true;toast('Bonne création ! La seule limite, c’est vous.')}
function tourGo(d){TI+=d;if(TI<0)TI=0;if(TI>=TOUR.length){tourEnd();return}tourShow()}
function tourShow(){const st=TOUR[TI];if(st.tab&&S.tab!==st.tab){S.tab=st.tab;all()}
 const el=$(st.sel);if(!el){tourGo(1);return}
 el.scrollIntoView({block:'center',behavior:'instant'});
 requestAnimationFrame(()=>{const r=el.getBoundingClientRect(),p=8,sp=$('#spot'),co=$('#coach');
  Object.assign(sp.style,{left:(r.left-p)+'px',top:(r.top-p)+'px',width:(r.width+p*2)+'px',height:(r.height+p*2)+'px'});
  co.innerHTML=`<span class="tstep">${TI+1} / ${TOUR.length}</span><b>${esc(st.t)}</b><p>${esc(st.x)}</p><div class="gnav">${TI?`<button class="btn small ghost" data-tprev>${ic('arrow-left')}</button>`:''}<span class="sp"></span><button class="linkbtn" data-tend>Terminer</button><button class="btn small primary" data-tnext>${TI===TOUR.length-1?'C’est parti !':'Suivant'}${ic('arrow-right')}</button></div>`;
  refreshIcons();const cw=Math.min(320,innerWidth-24),ch=co.offsetHeight||160;co.style.width=cw+'px';
  let top=r.bottom+p+12;if(top+ch>innerHeight-12)top=r.top-p-12-ch;if(top<12)top=Math.min(innerHeight-ch-12,r.top+12);
  let left=r.left+r.width/2-cw/2;left=Math.max(12,Math.min(innerWidth-cw-12,left));co.style.top=top+'px';co.style.left=left+'px';
  const b=co.querySelector('[data-tnext]');b&&b.focus({preventScroll:true})})}
window.addEventListener('resize',()=>{const t=$('#tour');if(t&&!t.hidden)tourShow()});
