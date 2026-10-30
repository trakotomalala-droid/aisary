/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= MODE TURBO : une image en quelques clics ================= */
let TB=null; // {step, cat}
const TB_MADA=['analakely','tana','ruelleTana','independance','rizieres','baobab','nosybe','foret','toamasina','antsirabe','hotely','village'];
function tbBg(cats){const q=bgQ.trim().toLowerCase();const list=q?BG.filter(b=>(b.fr+' '+b.en).toLowerCase().includes(q)):S.bgCat==='mada'&&!cats.includes('noquick')?BG.filter(b=>b.cat==='mada'&&(S.madaReg==='tana'?TB_MADA.includes(b.id)||b.reg===S.madaReg:b.reg===S.madaReg)):BG.filter(b=>b.cat===S.bgCat);
 return `<div class="mydecor">${slot('d.bgR','Importer mon décor','image-plus')}<div><b>Votre propre décor ?</b><p class="hint">Glissez une photo de lieu : elle servira d'arrière-plan. Sinon, choisissez ci-dessous.</p></div></div>
 <div class="search">${ic('search')}<input type="text" id="bgQ" placeholder="Chercher : Tana, plage, studio…" value="${esc(bgQ)}" aria-label="Chercher un décor"></div>
 <div class="chips catchips">${cats.filter(k=>BGCAT[k]).map(k=>`<button class="chip${k==='mada'?' mg':''}" data-set="bgCat" data-val="${k}" aria-pressed="${S.bgCat===k&&!bgQ}">${k==='mada'?'<span class="flag mini"><i></i><i></i><i></i></span>':ic(BGCAT[k].ic)}<span>${BGCAT[k].fr}</span></button>`).join('')}</div>
 ${S.bgCat==='mada'&&!bgQ?`<div class="chips regs">${Object.entries(MREG).map(([k,v])=>`<button class="chip" data-set="madaReg" data-val="${k}" aria-pressed="${S.madaReg===k}">${ic(v.ic)}<span>${v.fr}</span></button>`).join('')}</div>`:''}
 <div class="bgs tb" id="bgGrid">${list.map(bgBtn).join('')||'<p class="hint">Aucun décor ne correspond.</p>'}</div>`}
function tbFormat(){return `<div class="field"><span class="lab">Format</span><div class="tiles t4">${RATIO.map(r=>`<button class="tile" data-set="render.ratio" data-val="${r}" aria-pressed="${S.render.ratio===r}"><span class="thumb">${ratioThumb(r)}</span><span class="tl">${r}</span></button>`).join('')}</div></div>
 <div class="field"><span class="lab">Destination</span>${chips('render.usage',USAGE)}</div>
 <div class="field"><span class="lab">Style d'image</span>${chips('render.style',STYLE)}</div>
 <div class="field"><span class="lab">Modèle de génération</span><div class="models">${Object.entries(MODELS).map(([k,v])=>`<button class="model" data-set="render.model" data-val="${k}" aria-pressed="${S.render.model===k}"><b>${v.n}</b><small>${v.s}</small></button>`).join('')}</div></div>`}
function tbPoseGrid(s,cats){const o=subjOpts(s);if(!cats.includes(TB.cat))TB.cat=cats[0];const sel=validPoses(s);
 return `<div class="chips">${cats.map(k=>`<button class="chip${k==='suggest'?' sugg':''}" data-tbcat="${k}" aria-pressed="${TB.cat===k}">${ic(PCAT[k].ic)}<span>${PCAT[k].fr}</span></button>`).join('')}</div>
 <div class="pgrid2 tb">${(TB.cat==='suggest'?suggestPoses():Object.keys(POSES).filter(k=>POSES[k].cat===TB.cat)).map(k=>`<button class="ptile" data-tpose="${k}" aria-pressed="${sel.includes(k)}"><span class="pfig">${poseSVG(k,o)}</span><span class="pl">${esc(POSES[k].fr)}</span></button>`).join('')}</div>`}
function tbSteps(){const T=S.ptype,s=S.subjects[0],p=s?`subjects.${s.id}.`:'';
 if(T==='human')return [
  {t:'Votre personnage',d:'Qui est sur l’image ?',b:()=>`<div class="tb2"><div>${refRow(SR(s,['faceF','faceP']),'Photo du visage (conseillé)')}${note(p+'notes.id','En quelques mots : barbe courte, sourire franc…')}</div><div>
   <div class="field"><span class="lab">Genre</span>${chips(p+'gender',GENDER)}</div>
   <div class="field"><span class="lab">Âge</span><div class="chips">${Object.keys(AGE).map(a=>`<button class="chip" data-set="${p}age" data-val="${a}" aria-pressed="${s.age===a}"><span>${a} ans</span></button>`).join('')}</div></div>
   <div class="field"><span class="lab">Origine</span>${chips(p+'origin',ORIGIN)}</div></div></div>`},
  {t:'Sa tenue',d:'Des photos, quelques mots, ou un préréglage',b:()=>`${refRow(SR(s,['top','bottom','shoes','acc']),'Photos : haut, bas, chaussures, accessoire')}${note(p+'notes.outfit','En quelques mots : chemise en wax jaune, jean brut…')}
   ${overrides(s).outfit?`<p class="ovr">${ic('info')}<span>Vos photos et votre texte sont pris en compte : la présélection est ignorée.</span></p>`:''}<div class="${overrides(s).outfit?'dimmed':''}">${presets(groups(p+'outfit',OUTFIT),'Ou un préréglage')}</div>
   <div class="field"><span class="lab">Accessoires</span><div class="chips"><button class="chip" data-toggle="${p}acc" data-val="none" aria-pressed="${(s.acc||[]).includes('none')}">${ic('ban')}<span>Aucun</span></button></div>${mchips(p+'acc',ACCESS)}</div>`},
  {t:'Le décor',d:'Où se passe la scène ?',b:()=>tbBg(['mada','urbain','interieur','studio','nature','fantaisie'])},
  {t:'La pose',d:'Cliquez sur la pose qui vous plaît',pose:true,b:()=>tbPoseGrid(s,['base','move','sit','life','emo','sport','foot','dance','mode','prod'])},
  {t:'Format & finition',d:'Dernière étape',fin:true,b:tbFormat}];
 if(T==='product')return [
  {t:'Votre produit',d:'Des photos pour un avatar produit fidèle',b:()=>`<div class="field"><span class="lab">Nom du produit</span><input type="text" data-k="${p}product" value="${esc(s.product)}" placeholder="Ex. : Jus de litchi Tsara 33 cl"></div>
   ${refRow(SR(s,['front','backP','logo','pack']),'Photos du produit')}${presets(chips('pk.type',PKTYPE),'Type de produit')}`},
  {t:'Les effets',d:'Splash, fruits, particules (facultatif)',b:()=>`<div class="field"><span class="lab">Splash & liquides</span>${mchips('pk.splash',PKSPLASH)}</div>
   <div class="field"><span class="lab">Fruits & ingrédients (6 max)</span>${mchips('pk.fruits',PKFRUIT,6)}</div>${refRow(PKFRUITSLOTS,'Ou vos fruits en photo')}
   <div class="field"><span class="lab">Particules & atmosphère</span>${mchips('pk.fx',PKFX)}</div>`},
  {t:'Le décor',d:'Où poser le produit ?',b:()=>tbBg(['packshot','studio','mada','nature','interieur','fantaisie','noquick'])},
  {t:'La présentation',d:'Comment le produit est montré',pose:true,b:()=>`${tbPoseGrid(s,['pres'])}<div class="field"><span class="lab">Une main dans l'image ?</span><div class="chips"><button class="chip" data-set="pk.hand" data-val="none" aria-pressed="${S.pk.hand==='none'}"><span>Sans main</span></button>${Object.keys(POSES).filter(k=>POSES[k].cat==='hands').map(k=>`<button class="chip" data-set="pk.hand" data-val="${k}" aria-pressed="${S.pk.hand===k}">${ic('hand')}<span>${esc(POSES[k].fr)}</span></button>`).join('')}</div></div>`},
  {t:'Format & finition',d:'Dernière étape',fin:true,b:tbFormat}];
 return [
  {t:'Le lieu',d:'Quel paysage ou quel décor ?',b:()=>tbBg(['mada','nature','fantaisie','urbain','interieur'])},
  {t:'Éléments & style',d:'Ce qu’on voit et l’esprit de l’image',b:()=>`<div class="field"><span class="lab">Style</span>${mchips('sc.style',SCSTYLE)}</div>${mgroups('sc.elems',SCELEM)}${note('notes.elems','En quelques mots : une pirogue au premier plan…')}`},
  {t:'Moment & ambiance',d:'La lumière du jour et l’atmosphère',b:()=>`<div class="field"><span class="lab">Moment</span>${tiles('time',TIME,timeThumb)}</div><div class="field"><span class="lab">Ambiance (plusieurs possibles)</span>${mtiles('mood',MOOD,moodThumb)}</div>`},
  {t:'Format & finition',d:'Dernière étape',fin:true,b:tbFormat}]}
function turboStart(){TB={step:-1,cat:null};renderTurbo()}
function renderTurbo(){const el=$('#turbo');if(!el)return;if(!TB){el.hidden=true;el.innerHTML='';return}
 let h;
 if(TB.step<0)h=`<div class="tbhd"><span class="tbz">${ic('zap')}</span><div><p class="eyebrow">Mode Turbo</p><h2>Que voulez-vous créer ?</h2></div><span class="sp"></span><button class="x" data-tbquit aria-label="Fermer">${ic('x')}</button></div>
  <p class="hint">Quelques choix guidés, et votre prompt est prêt à exporter. Vous pourrez tout affiner ensuite.</p>
  <div class="ptypes big">${Object.entries(PTYPES).map(([k,v])=>`<button class="ptype" data-tbtype="${k}" style="--tc:${v.accent}"><span class="pti">${ic(v.ic)}</span><b>${esc(v.fr)}</b><small>${esc(v.d)}</small></button>`).join('')}</div>`;
 else{const st=tbSteps(),cur=st[TB.step],last=TB.step===st.length-1;
  h=`<div class="tbhd"><span class="tbz">${ic('zap')}</span><div><p class="eyebrow">Turbo · ${esc(PTYPES[S.ptype].fr)} · étape ${TB.step+1} sur ${st.length}</p><h2>${esc(cur.t)}</h2><p class="hint">${esc(cur.d)}</p></div><span class="sp"></span><button class="x" data-tbquit aria-label="Abandonner">${ic('x')}</button></div>
  <div class="gprog">${st.map((x,i)=>`<i class="${i<=TB.step?'on':''}"></i>`).join('')}</div>
  <div class="tbbody"><div class="tbmain">${cur.b()}</div>
   <aside class="tbside"><div class="finderbox"><svg id="tFinder" viewBox="0 0 100 125" aria-label="Aperçu"></svg><div id="tFinderCap"></div></div>
   <dl class="fiche small">${tbRecap()}</dl></aside></div>
  <div class="gnav"><button class="btn ghost" data-tbback>${ic('arrow-left')}Retour</button><span class="sp"></span>${last?'':`<button class="linkbtn" data-tbnext>Passer</button>`}
   <button class="btn primary${last?' huge':''}" data-tbnext>${last?`${ic('zap')}Créer et exporter`:`Suivant${ic('arrow-right')}`}</button></div>`}
 const body=el.querySelector('.tbmain'),stt=body?body.scrollTop:0,same=el.dataset.step==String(TB.step);
 el.innerHTML=`<div class="tbcard${same?' still':''}" role="dialog" aria-modal="true">${h}</div>`;el.dataset.step=TB.step;el.hidden=false;
 const nb=el.querySelector('.tbmain');if(nb&&same)nb.scrollTop=stt;
 if(TB.step>=0)renderFinder('#tFinder','#tFinderCap','t');refreshIcons()}
function tbRecap(){const T=S.ptype,s=S.subjects[0],r=[];
 r.push(['Décor',customBg()?'Mon décor (image)':BGM[S.bg].fr]);
 if(T==='human'&&s)r.push(['Personnage',`${GENDER[s.gender].fr}, ${s.age} ans`],['Tenue',overrides(s).outfit?'Selon vos références':OUTFIT_ALL[s.outfit].fr],['Pose',poseSummary(s)]);
 if(T==='product'&&s)r.push(['Produit',s.product||PKTYPE[S.pk.type].fr],['Effets',[...S.pk.splash.map(k=>PKSPLASH[k]?.fr),...S.pk.fruits.map(k=>PKFRUIT[k]?.fr)].filter(Boolean).join(', ')||'—'],['Présentation',poseSummary(s)]);
 if(T==='scene')r.push(['Style',S.sc.style.map(k=>SCSTYLE[k]?.fr).join(', ')||'—'],['Moment',TIME[S.time].fr]);
 r.push(['Format',S.render.ratio+' · '+MODELS[S.render.model].n]);return r.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}
ALL_HOOKS.push(()=>{if(TB)renderTurbo()});
document.addEventListener('click',async e=>{const t=e.target.closest('[data-tbtype],[data-tbnext],[data-tbback],[data-tbquit],[data-tbcat],[data-tpose]');if(!t)return;const d=t.dataset;
 if(d.tbtype){const name='Turbo · '+PTYPES[d.tbtype].fr+' · '+new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'short'});bgQ='';await createProject(name,d.tbtype);TB.step=0;TB.cat=null;
  if(d.tbtype==='product')S.bgCat='packshot';all();return}
 if(d.tbquit!==undefined){if(TB.step>=0&&PROJ){const id=PROJ.id;TB=null;renderTurbo();await DB.del(id).catch(()=>{});PROJ=null;showScreen('home');toast('Turbo abandonné')}else{TB=null;renderTurbo()}return}
 if(d.tbback!==undefined){if(TB.step>0){TB.step--;TB.cat=null;renderTurbo()}else{const id=PROJ&&PROJ.id;TB.step=-1;if(id){await DB.del(id).catch(()=>{});PROJ=null}showScreen('home');renderTurbo()}return}
 if(d.tbnext!==undefined){const st=tbSteps();if(TB.step<st.length-1){TB.step++;TB.cat=null;bgQ='';renderTurbo();return}
  TB=null;renderTurbo();await saveProjNow();showScreen('export');toast('Prêt ! Suivez les étapes d’export ⚡');return}
 if(d.tbcat){TB.cat=d.tbcat;renderTurbo();return}
 if(d.tpose){const s=S.subjects[0];s.poses=[d.tpose];s.posesSet=true;all();return}
});
