/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* barres de prompt, accordéons, références */
function note(path,ph){const v=get(path);return `<div class="note${v?' filled':''}">${ic('pencil-line')}<input type="text" data-k="${path}" value="${esc(get(path)||'')}" placeholder="${esc(ph)}" aria-label="${esc(ph)}"></div>`}
function sec(id,icn,title,sum,inner,def){const open=S.adv[id]??def;const hasNote=inner.includes('class="note filled"');
 return `<details class="sec" data-adv="${id}"${open?' open':''}><summary>${ic(icn)}<b>${esc(title)}</b><span class="sum">${esc(sum)}${hasNote?' · ✎':''}</span>${ic('chevron-down')}</summary><div class="secb">${inner}</div></details>`}
function refRow(list){return `<div class="refrow"><span class="lab">Images de référence</span><div class="slots">${list.map(r=>slot(r[0],r[1],r[2])).join('')}</div></div>`}
const SR=(s,keys)=>keys.map(k=>{const r=REFSLOTS[s.kind].find(x=>x[0]===k);return [`s${s.id}.${k}`,r[1],r[2]]});

function renderPanel(){
 const p=$('#panel');let h='';const c=S.camera;
 if(S.tab==='mada'){
  const q=bgQ.trim().toLowerCase();const list=q?BG.filter(b=>b.cat==='mada'&&(b.fr+' '+b.en).toLowerCase().includes(q)):BG.filter(b=>b.reg===S.madaReg);
  h=`<div class="mghd"><span class="flag"><i></i><i></i><i></i></span><div><h3>Madagasikara</h3><p class="hint">Décors malgaches, région par région.</p></div></div>
  <div class="search">${ic('search')}<input type="text" id="mgQ" placeholder="Chercher : Tana, baobab, marché…" value="${esc(bgQ)}" aria-label="Chercher un décor malgache"></div>
  <div class="chips">${Object.entries(MREG).map(([k,v])=>`<button class="chip" data-set="madaReg" data-val="${k}" aria-pressed="${S.madaReg===k&&!bgQ}">${ic(v.ic)}<span>${v.fr}</span></button>`).join('')}</div>
  <div class="bgs" id="bgGrid">${list.length?list.map(bgBtn).join(''):'<p class="hint">Aucun décor ne correspond. Décrivez-le ci-dessous.</p>'}</div>
  <div class="field"><label class="lab" for="bgNoteM">Précisions sur le décor</label><textarea id="bgNoteM" data-k="bgNote" placeholder="Ex. : un taxi-be rouge garé, des marchandes de mofo gasy…">${esc(S.bgNote)}</textarea></div>
  ${sec('decorRefs','image-plus','Images de référence du décor',countRefs('decor'),`<div class="slots">${DECORSLOTS.map(d=>slot('d.'+d[0],d[1],d[2])).join('')}</div>`,false)}`;
 }
 if(S.tab==='decor'){
  h=`<h3>Arrière-plan</h3>
  <div class="search">${ic('search')}<input type="text" id="bgQ" placeholder="Chercher : plage, néon, cuisine…" value="${esc(bgQ)}" aria-label="Chercher un décor"></div>
  <div class="chips">${Object.entries(BGCAT).filter(([k])=>k!=='mada').map(([k,v])=>`<button class="chip" data-set="bgCat" data-val="${k}" aria-pressed="${S.bgCat===k&&!bgQ}">${ic(v.ic)}<span>${v.fr}</span></button>`).join('')}<button class="chip mg" data-tab="mada">${ic('map')}<span>Madagascar →</span></button></div>
  <div class="bgs" id="bgGrid">${bgGrid()}</div>
  <div class="field"><label class="lab" for="bgNote">Précisions sur le décor</label>
  <textarea id="bgNote" data-k="bgNote" placeholder="Ex. : un caméléon sur une branche, du café qui fume sur la table…">${esc(S.bgNote)}</textarea>
  <p class="hint">Vous pouvez écrire en français. La traduction se fera automatiquement à l'étape 2.</p></div>
  ${sec('decorRefs','image-plus','Images de référence du décor',countRefs('decor'),`<div class="slots">${DECORSLOTS.map(d=>slot('d.'+d[0],d[1],d[2])).join('')}</div>`,false)}`;
 }
 if(S.tab==='ambiance'){
  h=sec('am.time','sunrise','Moment de la journée',TIME[S.time].fr,`${tiles('time',TIME,timeThumb)}${note('notes.time','Précisez : juste avant l’orage, lumière rasante sur les rizières…')}`,true)
   +sec('am.weather','cloud-sun','Météo',WEATHER[S.weather].fr,`${chips('weather',WEATHER)}${note('notes.weather','Précisez : flaques qui reflètent les néons, crachin léger…')}`,true)
   +sec('am.climate','globe','Climat & pays',CLIMATE[S.climate].fr.replace('— ',''),`<select id="climate" data-k="climate" aria-label="Climat">${opts(CLIMATE,S.climate)}</select>${note('notes.climate','Précisez : saison des pluies à Toamasina, hiver austral…')}
    <div class="field"><label class="lab" for="temp">Température de couleur <output data-out="temp">${tempLabel()}</output></label><div class="temp"></div><input type="range" id="temp" min="-100" max="100" step="5" data-k="temp" data-num value="${S.temp}"></div>`,true)
   +sec('am.mood','palette','Ambiance',MOOD[S.mood].fr,`${tiles('mood',MOOD,moodThumb)}${note('notes.mood','Précisez : nostalgie des années 90, énergie de fête de quartier…')}`,true);
 }
 if(S.tab==='lumiere'){
  const kits=S.kitCat==='mine'?Object.fromEntries(S.customKits.map(k=>[k.id,k])):Object.fromEntries(Object.entries(KITS).filter(([,v])=>v.cat===S.kitCat));
  h=sec('li.kits','layout-template','Kits de lumière',(KITS[S.kit]||S.customKits.find(k=>k.id===S.kit)||{fr:'Personnalisé'}).fr,`
  <div class="chips">${Object.entries(KCAT).map(([k,v])=>`<button class="chip" data-set="kitCat" data-val="${k}" aria-pressed="${S.kitCat===k}">${ic(v.ic)}<span>${v.fr}</span></button>`).join('')}</div>
  <div class="kits">${Object.keys(kits).length?Object.entries(kits).map(([k,v])=>`<div class="kitw"><button class="kit" data-kit="${k}" aria-pressed="${S.kit===k}"><span class="kthumb">${kitThumb(v.L)}</span><b>${esc(v.fr)}</b><small>${esc(v.d||v.L.length+' lumières')}</small></button>${S.kitCat==='mine'?`<button class="kdel" data-kdel="${k}" aria-label="Supprimer ce kit">${ic('trash-2')}</button>`:''}</div>`).join(''):`<p class="hint">Aucun kit perso. Réglez une installation puis enregistrez-la ci-dessous.</p>`}</div>
  <p class="hint">Un kit remplace l'installation. Tout reste modifiable : déplacez, réglez ou ajoutez des lumières.</p>
  <div class="addrow"><input type="text" id="kitName" placeholder="Nom de mon kit" aria-label="Nom du kit à enregistrer"><button class="btn" id="saveKit">${ic('bookmark-plus')}Enregistrer</button></div>`,true)
  +sec('li.setup','lightbulb','Installation',S.lights.length+' lumière'+(S.lights.length>1?'s':''),`
  ${S.lights.map(l=>lightCard(l)).join('')}
  <div class="addrow"><select id="addType" aria-label="Type de lumière à ajouter">${optsG(LTYPE,'softbox')}</select><button class="btn" id="addLight">${ic('plus')}Ajouter</button></div>
  ${note('notes.light','Précisez l’éclairage général : reflets dorés sur la peau, ombres très marquées…')}`,true)
  +sec('li.refs','image-plus','Référence d’éclairage',countRefs('light'),`<div class="slots">${slot('l.ref','Photo de référence','lightbulb')}</div>`,false);
 }
 if(S.tab==='camera'){
  h=sec('ca.body','camera','Boîtier',BODY[c.body].fr,`${chips('camera.body',BODY)}${note('notes.body','Précisez : rendu argentique granuleux, capteur moyen format…')}`,false)
  +sec('ca.lens','aperture','Objectif & ouverture',`${LENS[c.lens].fr} · f/${c.ap}`,`${tiles('camera.lens',LENS,lensThumb,'t4')}
   <div class="field"><label class="lab" for="ca">Ouverture <output data-out="camera.ap">f/${c.ap}</output></label>
   <div class="aprow"><span id="apIris">${apertureSvg(c.ap,56)}</span><span id="apBokeh">${bokehSvg(c.ap)}</span></div>
   <input type="range" id="ca" min="0" max="${APS.length-1}" step="1" data-ap value="${APS.indexOf(c.ap)}"><p class="hint" data-out="dof">${dofFr()}</p></div>
   <div class="field"><span class="lab">Vitesse</span>${chips('camera.shutter',SHUTTER)}</div>${note('notes.lens','Précisez : flare doré dans l’objectif, bokeh en forme de cœur…')}`,true)
  +sec('ca.framing','crop','Valeur de plan',FRAMING[c.framing].fr,`${tiles('camera.framing',FRAMING,framingThumb)}${note('notes.framing','Précisez : sujet décentré à gauche, espace libre en haut pour le texte…')}`,true)
  +sec('ca.angle','rotate-3d','Angle & position',angleInfo().fr,`${tiles('camera.angle',ANGLE,angleThumb)}${camSliders()}${note('notes.angle','Précisez : caméra à travers la vitre d’un taxi-be…')}`,false)
  +sec('ca.film','film','Rendu / pellicule',FILM[c.film].fr,`${chips('camera.film',FILM)}${note('notes.film','Précisez : couleurs délavées, grain fort, vignettage…')}`,false);
 }
 if(S.tab==='sujet') h=subjectPanel();
 if(S.tab==='rendu'){
  h=sec('re.ratio','frame','Format',S.render.ratio,`<div class="tiles t4">${RATIO.map(r=>`<button class="tile" data-set="render.ratio" data-val="${r}" aria-pressed="${S.render.ratio===r}"><span class="thumb">${ratioThumb(r)}</span><span class="tl">${r}</span></button>`).join('')}</div>`,true)
  +sec('re.usage','send','Destination',USAGE[S.render.usage].fr,`${chips('render.usage',USAGE)}${note('notes.usage','Précisez : affiche 4×3 m, zone logo en bas à droite…')}`,true)
  +sec('re.style','brush','Style d’image',STYLE[S.render.style].fr,`${chips('render.style',STYLE)}${note('notes.style','Précisez : façon photo de campagne Orange, couleurs très saturées…')}`,true)
  +`<div class="soon">${ic('layers')}<span>Export PSD par calques et vectoriel</span><span class="sp"></span><span class="tag">Étape 5</span></div>`;
 }
 p.innerHTML=h;refreshIcons();
}
function bgBtn(b){return `<button class="bg" data-set="bg" data-val="${b.id}" aria-pressed="${S.bg===b.id}"><div class="sw" style="background:${b.sw}">${ic(b.cat==='mada'?MREG[b.reg].ic:BGCAT[b.cat].ic)}</div><span>${esc(b.fr)}</span></button>`}

function subjectPanel(){
 const s=S.subjects.find(x=>x.id===S.subSel)||S.subjects[0],n=S.subjects.length,idx=S.subjects.indexOf(s)+1;
 let h=sec('su.compo','users','Composition',`${n} sujet${n>1?'s':''}${S.crowd!=='none'?' + foule':''}`,`
  <div class="seg">${[1,2,3].map(k=>`<button data-nsub="${k}" aria-pressed="${n===k}">${ic(k===1?'user':'users')}${k} sujet${k>1?'s':''}</button>`).join('')}</div>
  <div class="field"><span class="lab">Foule</span>${chips('crowd',CROWD)}</div>${note('notes.crowd','Précisez : supporters en maillot vert, foule floue au marché…')}`,true);
 if(n>1)h+=sec('su.inter','handshake','Interaction',INTERACT[S.interact].fr,`${chips('interact',INTERACT)}${note('notes.interact','Précisez : la mère tient la main de sa fille, ils rient d’une blague…')}`,true);
 h+=`<div class="subhead">${n>1?`<div class="subtabs">${S.subjects.map((x,i)=>`<button data-subsel="${x.id}" aria-selected="${x.id===s.id}">${ic(KIND[x.kind].ic)}Sujet ${i+1}</button>`).join('')}</div>`:`<h3>Sujet principal</h3>`}
  <div class="kindrow">${Object.entries(KIND).map(([k,v])=>`<button class="kind" data-set="subjects.${s.id}.kind" data-val="${k}" aria-pressed="${s.kind===k}" title="${esc(v.fr)}">${ic(v.ic)}<span>${esc(v.fr)}</span></button>`).join('')}</div></div>`;
 h+=subjectSections(s);
 return h;
}
function subjectSections(s){const p=`subjects.${s.id}.`,id='s'+s.id;let h='';
 const N=(k,ph)=>note(p+'notes.'+k,ph);
 if(s.kind==='person'){
  const acc=(s.acc||[]);
  h+=sec(id+'.ident','scan-face','Identité & visage',`${GENDER[s.gender].fr} · ${s.age} ans · ${ORIGIN[s.origin].fr}`,`
   <div class="row2"><div class="field"><label class="lab" for="sg${s.id}">Genre</label><select id="sg${s.id}" data-k="${p}gender" data-rerender>${opts(GENDER,s.gender)}</select></div>
   <div class="field"><label class="lab" for="sa${s.id}">Âge</label><select id="sa${s.id}" data-k="${p}age" data-rerender>${Object.keys(AGE).map(a=>`<option${a==s.age?' selected':''}>${a}</option>`).join('')}</select></div></div>
   <div class="row2"><div class="field"><label class="lab" for="so${s.id}">Origine / casting</label><select id="so${s.id}" data-k="${p}origin" data-rerender>${opts(ORIGIN,s.origin)}</select></div>
   <div class="field"><label class="lab" for="sm${s.id}">Morphologie</label><select id="sm${s.id}" data-k="${p}morpho">${opts(MORPHO,s.morpho)}</select></div></div>
   ${N('id','Précisez : barbe courte, taches de rousseur, sourire avec fossettes…')}${refRow(SR(s,['faceF','faceP','faceB']))}`,true);
  h+=sec(id+'.hair','scissors','Cheveux',HAIR[s.hair].fr,`${chips(p+'hair',HAIR)}${N('hair','Précisez : tresses fines avec perles, cheveux gris…')}${refRow(SR(s,['hairR']))}`,false);
  h+=sec(id+'.outfit','shirt','Tenue',flat(OUTFIT)[s.outfit].fr,`${groups(p+'outfit',OUTFIT)}${N('outfit','Précisez : chemise en wax jaune, maillot des Barea…')}${refRow(SR(s,['top','bottom','shoes']))}`,false);
  h+=sec(id+'.acc','glasses','Accessoires',acc.length?acc.map(a=>ACCESS[a].fr).join(', '):'Aucun',`<div class="chips">${Object.entries(ACCESS).map(([k,v])=>`<button class="chip" data-toggle="${p}acc" data-val="${k}" aria-pressed="${acc.includes(k)}">${ic(v.ic)}<span>${esc(v.fr)}</span></button>`).join('')}</div>${N('acc','Précisez : montre dorée au poignet gauche, sac en raphia…')}${refRow(SR(s,['acc']))}`,false);
  h+=sec(id+'.expr','smile','Expression',EXPR[s.expression].fr,`${chips(p+'expression',EXPR)}${N('expr','Précisez : regard complice vers la caméra, rire aux éclats…')}`,false);
  h+=sec(id+'.pose','person-standing','Pose',flat(POSE)[s.pose].fr,`${groups(p+'pose',POSE)}${N('pose','Précisez : main gauche sur l’épaule de son ami…')}${refRow(SR(s,['poseR']))}`,false);
 }
 if(s.kind==='product'){
  h+=sec(id+'.prod','package','Produit',s.product||'À décrire',`<input type="text" data-k="${p}product" value="${esc(s.product)}" placeholder="Ex. : une bouteille de jus de litchi en verre" aria-label="Produit">${N('prod','Précisez : gouttes de condensation, étiquette face caméra…')}${refRow(SR(s,['front','backP','logo','pack']))}`,true);
  h+=sec(id+'.surf','table','Support',SURFACE[s.surface].fr,`${chips(p+'surface',SURFACE)}${N('surf','Précisez : sur une natte en raphia tressée…')}`,true);
 }
 if(s.kind==='animal'){
  h+=sec(id+'.anim','paw-print','Animal',ANIMAL[s.animal].fr,`${chips(p+'animal',ANIMAL)}${N('anim','Précisez : jeune maki avec sa mère…')}${refRow(SR(s,['refA','refA2']))}`,true);
  h+=sec(id+'.act','activity','Action',ANIMACT[s.animAct].fr,`${chips(p+'animAct',ANIMACT)}${N('act','Précisez : mange une banane, saute de branche en branche…')}`,true);
 }
 if(s.kind==='vehicle'){
  h+=sec(id+'.veh','car','Véhicule',VEHICLE[s.vehicle].fr,`${chips(p+'vehicle',VEHICLE)}<input type="text" data-k="${p}vcolor" value="${esc(s.vcolor)}" placeholder="Couleur / marque : rouge métallisé, Renault 4L…" aria-label="Couleur ou marque">${N('veh','Précisez : galerie chargée de bagages, autocollants…')}${refRow(SR(s,['vfront','vside','vrear','vdetail']))}`,true);
  h+=sec(id+'.vst','gauge','État',VSTATE[s.vstate].fr,`${chips(p+'vstate',VSTATE)}${N('vst','Précisez : roule sur une piste de latérite…')}`,true);
 }
 if(s.kind==='fantasy'){
  h+=sec(id+'.fan','sparkles','Créature',FANTASY[s.fantasy].fr,`${chips(p+'fantasy',FANTASY)}${N('fan','Précisez : écailles aux couleurs du drapeau malgache…')}${refRow(SR(s,['concept','texture']))}`,true);
 }
 if(s.kind==='object'){
  h+=sec(id+'.obj','box','Objet / élément',s.desc?'Décrit':'À décrire',`${N('obj','Décrivez : une soubique en vannerie, une lampe tempête…')}${refRow(SR(s,['refO','refO2']))}`,true);
 }
 h+=sec(id+'.free','pencil','Détails libres',s.desc?'Rempli':'Vide',`<textarea id="sd${s.id}" data-k="${p}desc" placeholder="Tout ce que les menus ne disent pas : une histoire, une attitude, un détail…">${esc(s.desc)}</textarea>`,false);
 return h;
}
all();
