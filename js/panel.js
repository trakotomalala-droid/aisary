/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= V2 : PANNEAU EN CARTES + FENÊTRES DE RÉGLAGE =================
   Le panneau de gauche montre des cartes (titre, résumé, bouton Modifier).
   Chaque carte ouvre une fenêtre : « Vos choix » (supprimables), barre de texte libre,
   puis les préréglages. Valider / Annuler / Réinitialiser en bas. */

/* ---------- petits composants ---------- */
function note(path,ph){const v=get(path);return `<div class="note${v?' filled':''}">${ic('pencil-line')}<input type="text" data-k="${path}" value="${esc(v||'')}" placeholder="${esc(ph)}" aria-label="${esc(ph)}"></div>`}
function refRow(list,label='Images de référence'){return `<div class="refrow"><span class="lab">${esc(label)}</span><div class="slots">${list.map(r=>slot(r[0],r[1],r[2])).join('')}</div></div>`}
const SR=(s,keys)=>keys.map(k=>{const r=REFSLOTS[s.kind].find(x=>x[0]===k);return [`s${s.id}.${k}`,r[1],r[2]]});
function bgBtn(b){return `<button class="bg" data-set="bg" data-val="${b.id}" aria-pressed="${S.bg===b.id}"><div class="sw" style="background:${b.sw}">${ic(b.cat==='mada'?MREG[b.reg].ic:BGCAT[b.cat].ic)}</div><span>${esc(b.fr)}</span></button>`}
function bgGrid(){const q=bgQ.trim().toLowerCase();let list;
 if(q)list=BG.filter(b=>(b.fr+' '+b.en).toLowerCase().includes(q));
 else if(S.bgCat==='mada')list=BG.filter(b=>b.cat==='mada'&&b.reg===S.madaReg);
 else list=BG.filter(b=>b.cat===S.bgCat);
 return list.length?list.map(bgBtn).join(''):`<p class="hint">Aucun décor ne correspond. Décrivez-le dans la barre de texte ou importez votre image.</p>`}
const cnt=(n,s,p)=>n+' '+(n>1?(p||s+'s'):s);
/* « Vos choix » */
function cbox(items,notePath,ph){return `<div class="cbox"><div class="cbhd">${ic('list-checks')}<span class="lab">Vos choix</span>${items.length?`<span class="cbn">${items.length}</span>`:''}</div>
 <div class="cbchips">${items.length?items.map(it=>`<span class="cbchip">${ic(it.ic)}<span>${esc(it.label)}</span>${it.rm?`<button data-unpick="${it.path}" data-val="${it.val}"${it.reset?` data-reset="${it.reset}"`:''} aria-label="Retirer ${esc(it.label)}">${ic('x')}</button>`:''}</span>`).join(''):`<span class="hint">Aucun choix pour l'instant : choisissez ci-dessous ou écrivez.</span>`}</div>
 ${notePath?note(notePath,ph):''}</div>`}
const mItems=(path,dict)=>(get(path)||[]).filter(k=>dict[k]).map(k=>({label:dict[k].fr,ic:dict[k].ic,path,val:k,rm:true}));
const sItem=(path,dict,rm,reset)=>{const k=get(path);return dict[k]?[{label:dict[k].fr,ic:dict[k].ic,path,val:k,rm,reset}]:[]};
const presets=(html,label='Préréglages')=>`<div class="presets"><span class="lab">${esc(label)}</span>${html}</div>`;
const mchips=(path,dict,max)=>`<div class="chips">${Object.entries(dict).map(([k,v])=>`<button class="chip" data-toggle="${path}" data-val="${k}"${max?` data-max="${max}"`:''} aria-pressed="${(get(path)||[]).includes(k)}">${ic(v.ic)}<span>${esc(v.fr)}</span></button>`).join('')}</div>`;
const mgroups=(path,g,max)=>Object.entries(g).map(([n,o])=>`<div class="grp"><span class="grpn">${esc(n)}</span>${mchips(path,o,max)}</div>`).join('');
const mtiles=(path,dict,draw)=>`<div class="tiles">${Object.entries(dict).map(([k,v])=>`<button class="tile" data-toggle="${path}" data-val="${k}" aria-pressed="${(get(path)||[]).includes(k)}"><span class="thumb">${draw(k,v)}</span><span class="tl">${esc(v.fr)}</span></button>`).join('')}</div>`;
const sumChips=(labels,max=4)=>labels.length?`<span class="schips">${labels.slice(0,max).map(l=>`<span>${esc(l)}</span>`).join('')}${labels.length>max?`<span>+${labels.length-max}</span>`:''}</span>`:'<span class="sempty">Non précisé</span>';
const noteMark=k=>get(k)?' ✎':'';

/* ---------- définitions des cartes ---------- */
function subjOf(id){return S.subjects.find(x=>x.id==id)}
function personCards(s,prefix){const p=`subjects.${s.id}.`,N=(k,ph)=>note(p+'notes.'+k,ph),ov=overrides(s),acc=s.acc||[];
 const ovr=(k,label)=>`<p class="ovr">${ic('info')}<span>Vos images et votre description remplacent la présélection.</span><label class="check"><input type="checkbox" data-k="${p}${k}" data-bool data-rerender ${s[k]?'checked':''}> ${label}</label></p>`;
 return [
 {id:`s${s.id}.ident`,ic:'scan-face',t:'Identité & visage',sum:()=>sumChips([GENDER[s.gender].fr,s.age+' ans',ORIGIN[s.origin].fr,MORPHO[s.morpho].fr])+(R[`s${s.id}.faceF`]?' '+ic('image'):''),
  body:()=>`${cbox([{label:GENDER[s.gender].fr,ic:'user'},{label:s.age+' ans',ic:'calendar'},{label:ORIGIN[s.origin].fr,ic:'globe'},{label:MORPHO[s.morpho].fr,ic:'ruler'}],p+'notes.id','Précisez : barbe courte, taches de rousseur, sourire avec fossettes…')}
   ${refRow(SR(s,['faceF','faceP','faceB']),'Photos du visage (recommandé)')}
   ${presets(`<div class="field"><span class="lab">Genre</span>${chips(p+'gender',GENDER)}</div>
   <div class="field"><span class="lab">Âge</span><div class="chips">${Object.keys(AGE).map(a=>`<button class="chip" data-set="${p}age" data-val="${a}" aria-pressed="${s.age===a}"><span>${a} ans</span></button>`).join('')}</div></div>
   <div class="field"><span class="lab">Origine / casting</span>${chips(p+'origin',ORIGIN)}</div>
   <div class="field"><span class="lab">Morphologie</span>${chips(p+'morpho',MORPHO)}</div>`)}`,
  reset:()=>Object.assign(s,{gender:'woman',age:'25-35',origin:'highland',morpho:'average'},{notes:{...s.notes,id:''}})},
 {id:`s${s.id}.hair`,ic:'scissors',t:'Cheveux',sum:()=>sumChips([ov.hair&&!s.keepHair?'Selon vos références':HAIR[s.hair].fr])+noteMark(p+'notes.hair'),
  body:()=>`${cbox(ov.hair&&!s.keepHair?[{label:'Selon vos références',ic:'image'}]:sItem(p+'hair',HAIR),p+'notes.hair','Précisez : tresses fines avec perles, cheveux gris…')}
   ${refRow(SR(s,['hairR']),'Photo de la coiffure')}${ov.hair?ovr('keepHair','Garder aussi la présélection'):''}
   <div class="${ov.hair&&!s.keepHair?'dimmed':''}">${presets(chips(p+'hair',HAIR))}</div>`,reset:()=>{s.hair='braids';s.notes.hair='';s.keepHair=false}},
 {id:`s${s.id}.outfit`,ic:'shirt',t:'Tenue',sum:()=>sumChips([ov.outfit&&!s.keepOutfit?'Selon vos références':OUTFIT_ALL[s.outfit].fr])+noteMark(p+'notes.outfit'),
  body:()=>`${cbox(ov.outfit&&!s.keepOutfit?[{label:'Selon vos images de tenue',ic:'image'}]:sItem(p+'outfit',OUTFIT_ALL),p+'notes.outfit','Précisez : chemise en wax jaune, maillot des Barea…')}
   ${refRow(SR(s,['top','bottom','shoes']),'Photos de la tenue')}${ov.outfit?ovr('keepOutfit','Garder aussi la tenue présélectionnée'):''}
   <div class="${ov.outfit&&!s.keepOutfit?'dimmed':''}">${presets(groups(p+'outfit',OUTFIT))}</div>`,reset:()=>{s.outfit='hoany';s.notes.outfit='';s.keepOutfit=false}},
 {id:`s${s.id}.acc`,ic:'glasses',t:'Accessoires',sum:()=>sumChips(acc.includes('none')?['Aucun accessoire']:acc.map(a=>ACCESS[a]?.fr).filter(Boolean)),
  body:()=>`${cbox(acc.includes('none')?[{label:'Aucun accessoire',ic:'ban',path:p+'acc',val:'none',rm:true}]:mItems(p+'acc',ACCESS),p+'notes.acc','Précisez : montre dorée au poignet gauche, sac en raphia…')}
   ${refRow(SR(s,['acc']),'Photo d’accessoire')}
   ${presets(`<div class="chips"><button class="chip" data-toggle="${p}acc" data-val="none" aria-pressed="${acc.includes('none')}">${ic('ban')}<span>Aucun accessoire</span></button></div>${mchips(p+'acc',ACCESS)}`,'Préréglages (plusieurs possibles)')}`,reset:()=>{s.acc=[];s.notes.acc=''}},
 {id:`s${s.id}.expr`,ic:'smile',t:'Expression',sum:()=>sumChips([EXPR[s.expression].fr])+noteMark(p+'notes.expr'),
  body:()=>`${cbox(sItem(p+'expression',EXPR),p+'notes.expr','Précisez : regard complice vers la caméra, rire aux éclats…')}${presets(chips(p+'expression',EXPR))}`,reset:()=>{s.expression='smile';s.notes.expr=''}},
 {id:`s${s.id}.pose`,ic:'person-standing',t:'Pose',poses:s.id,sum:()=>`<span class="pminis sm">${poseThumbs(s)}</span>${sumChips([ov.pose&&!s.posesSet?'Selon vos références':poseSummary(s)],1)}`},
 {id:`s${s.id}.free`,ic:'pencil',t:'Détails libres',sum:()=>s.desc?`<span class="stext">${esc(s.desc.slice(0,70))}</span>`:'<span class="sempty">Vide</span>',
  body:()=>`<p class="hint">Tout ce que les menus ne disent pas : une histoire, une attitude, un détail. Vous pouvez écrire en français.</p><textarea data-k="subjects.${s.id}.desc" rows="5" placeholder="Ex. : elle vient de gagner un concours et serre le trophée contre elle…">${esc(s.desc)}</textarea>
   ${refRow(SR(s,['poseR']),'Photo de pose (optionnel)')}`,reset:()=>{s.desc=''}},
 ]}
function otherSubjectCards(s){const p=`subjects.${s.id}.`;const C=[];
 if(s.kind==='product')C.push({id:`s${s.id}.prod`,ic:'package',t:'Produit',sum:()=>sumChips([s.product||'À décrire',SURFACE[s.surface].fr]),
  body:()=>`${cbox(sItem(p+'surface',SURFACE),p+'notes.prod','Précisez : gouttes de condensation, étiquette face caméra…')}<div class="field"><label class="lab">Nom du produit</label><input type="text" data-k="${p}product" value="${esc(s.product)}" placeholder="Ex. : jus de litchi en bouteille de verre"></div>${refRow(SR(s,['front','backP','logo','pack']))}${presets(chips(p+'surface',SURFACE),'Support')}`,reset:()=>{s.product='';s.surface='wood'}});
 if(s.kind==='animal')C.push({id:`s${s.id}.anim`,ic:'paw-print',t:'Animal',sum:()=>sumChips([ANIMAL[s.animal].fr,ANIMACT[s.animAct].fr]),
  body:()=>`${cbox([...sItem(p+'animal',ANIMAL),...sItem(p+'animAct',ANIMACT)],p+'notes.anim','Précisez : jeune maki avec sa mère…')}${refRow(SR(s,['refA','refA2']))}${presets(chips(p+'animal',ANIMAL),'Animal')}${presets(chips(p+'animAct',ANIMACT),'Action')}`,reset:()=>{s.animal='maki';s.animAct='look'}});
 if(s.kind==='vehicle')C.push({id:`s${s.id}.veh`,ic:'car',t:'Véhicule',sum:()=>sumChips([VEHICLE[s.vehicle].fr,VSTATE[s.vstate].fr,s.vcolor].filter(Boolean)),
  body:()=>`${cbox([...sItem(p+'vehicle',VEHICLE),...sItem(p+'vstate',VSTATE)],p+'notes.veh','Précisez : galerie chargée de bagages, autocollants…')}<div class="field"><label class="lab">Couleur / marque</label><input type="text" data-k="${p}vcolor" value="${esc(s.vcolor)}" placeholder="Ex. : rouge métallisé, Renault 4L"></div>${refRow(SR(s,['vfront','vside','vrear','vdetail']))}${presets(chips(p+'vehicle',VEHICLE),'Véhicule')}${presets(chips(p+'vstate',VSTATE),'État')}`,reset:()=>{s.vehicle='city';s.vstate='new';s.vcolor=''}});
 if(s.kind==='fantasy')C.push({id:`s${s.id}.fan`,ic:'sparkles',t:'Créature',sum:()=>sumChips([FANTASY[s.fantasy].fr]),body:()=>`${cbox(sItem(p+'fantasy',FANTASY),p+'notes.fan','Précisez : écailles aux couleurs du drapeau malgache…')}${refRow(SR(s,['concept','texture']))}${presets(chips(p+'fantasy',FANTASY))}`,reset:()=>{s.fantasy='dragon'}});
 if(s.kind==='object')C.push({id:`s${s.id}.obj`,ic:'box',t:'Objet / élément',sum:()=>snt(s,'obj')?`<span class="stext">${esc(snt(s,'obj').slice(0,60))}</span>`:'<span class="sempty">À décrire</span>',body:()=>`${cbox([],p+'notes.obj','Décrivez : une soubique en vannerie, une lampe tempête…')}${refRow(SR(s,['refO','refO2']))}`,reset:()=>{s.notes.obj=''}});
 if(s.kind!=='object')C.push({id:`s${s.id}.pose`,ic:'person-standing',t:s.kind==='vehicle'?'Angle & action':'Pose',poses:s.id,sum:()=>`<span class="pminis sm">${poseThumbs(s)}</span>${sumChips([poseSummary(s)],1)}`});
 C.push({id:`s${s.id}.free`,ic:'pencil',t:'Détails libres',sum:()=>s.desc?`<span class="stext">${esc(s.desc.slice(0,70))}</span>`:'<span class="sempty">Vide</span>',body:()=>`<textarea data-k="subjects.${s.id}.desc" rows="5" placeholder="Tout ce que les menus ne disent pas…">${esc(s.desc)}</textarea>`,reset:()=>{s.desc=''}});
 return C}
function subjectCards(s){return s.kind==='person'?personCards(s):otherSubjectCards(s)}

function lightsSum(){return `<span class="ldots">${S.lights.map(l=>`<i style="background:${lightColor(l)}"></i>`).join('')}</span>${sumChips(S.lights.map(l=>LT[l.type].fr+' · '+LROLE[l.role].fr),3)}`}
const kitName=()=>(KITS[S.kit]||S.customKits.find(k=>k.id===S.kit)||{fr:'Installation personnalisée'}).fr;
function decorCard(){return {id:'bg',ic:'image',t:S.ptype==='scene'?'Lieu':'Arrière-plan',thumb:()=>customBg()?`<img src="${R['d.bgR']}" alt="">`:`<i style="background:${BGM[S.bg].sw}"></i>`,
 sum:()=>sumChips([customBg()?'Mon décor (image)':BGM[S.bg].fr])+noteMark('bgNote'),
 body:()=>{const items=[];if(R['d.bgR'])items.push({label:'Mon décor (image importée)',ic:'image',path:'',val:''});if(!customBg())items.push({label:BGM[S.bg].fr,ic:'map-pin'});
  return `${cbox(items,'bgNote','Précisez : un taxi-be rouge garé, du café qui fume sur la table…')}
  <div class="mydecor">${slot('d.bgR','Importer mon propre décor','image-plus')}<div><b>Votre propre décor</b><p class="hint">Glissez une photo de lieu ou de fond : le modèle la reprendra comme arrière-plan.</p>${R['d.bgR']?`<label class="check"><input type="checkbox" data-k="keepBg" data-bool data-rerender ${S.keepBg?'checked':''}> Combiner avec le décor présélectionné</label>`:''}</div>${slot('d.moodR','Moodboard / ambiance','palette')}</div>
  <div class="${customBg()?'dimmed':''}">${presets(`<div class="search">${ic('search')}<input type="text" id="bgQ" placeholder="Chercher : Tana, plage, néon, cuisine…" value="${esc(bgQ)}" aria-label="Chercher un décor"></div>
  <div class="chips catchips">${Object.entries(BGCAT).map(([k,v])=>`<button class="chip${k==='mada'?' mg':''}" data-set="bgCat" data-val="${k}" aria-pressed="${S.bgCat===k&&!bgQ}">${k==='mada'?'<span class="flag mini"><i></i><i></i><i></i></span>':ic(v.ic)}<span>${v.fr}</span></button>`).join('')}</div>
  ${S.bgCat==='mada'&&!bgQ?`<div class="chips regs">${Object.entries(MREG).map(([k,v])=>`<button class="chip" data-set="madaReg" data-val="${k}" aria-pressed="${S.madaReg===k}">${ic(v.ic)}<span>${v.fr}</span></button>`).join('')}</div>`:''}
  <div class="bgs" id="bgGrid">${bgGrid()}</div>`,'Décors prêts à l’emploi')}</div>`},
 reset:()=>{const d=defaults(S.ptype);S.bg=d.bg;S.bgCat=d.bgCat;S.bgNote='';S.keepBg=false;delete R['d.bgR'];saveRefs()}}}

function cardsFor(tab){const T=S.ptype,C=[];
 if(tab==='decor'){C.push(decorCard());
  if(T==='human')C.push({id:'props',ic:'armchair',t:'Éléments de décor',sum:()=>sumChips(S.props.map(k=>DPROPS[k]?.fr).filter(Boolean))+noteMark('notes.props'),
   body:()=>`${cbox(mItems('props',DPROPS),'notes.props','Précisez : une chaise en rotin, un vieux vélo rouge…')}<p class="hint">${ic('sparkles')} Les éléments choisis font apparaître des poses adaptées (assis, au volant…) dans la bibliothèque de poses.</p>${refRow(DECORSLOTS.filter(d=>d[0]==='el1'||d[0]==='el2').map(d=>['d.'+d[0],d[1],d[2]]),'Photos d’éléments')}${presets(mchips('props',DPROPS),'Préréglages (plusieurs possibles)')}`,reset:()=>{S.props=[];S.notes.props=''}});
  else C.push({id:'decorels',ic:'shapes',t:'Éléments de décor (photos)',sum:()=>sumChips(['el1','el2'].filter(k=>R['d.'+k]).map(k=>k==='el1'?'Élément 1':'Élément 2')),body:()=>`<p class="hint">Ajoutez la photo d'un objet ou d'un élément à placer dans le décor.</p>${refRow(DECORSLOTS.filter(d=>d[0]==='el1'||d[0]==='el2').map(d=>['d.'+d[0],d[1],d[2]]),'Photos d’éléments')}`,reset:()=>{delete R['d.el1'];delete R['d.el2'];saveRefs()}})}
 if(tab==='elements'){
  C.push({id:'scstyle',ic:'palette',t:'Style du paysage',sum:()=>sumChips(S.sc.style.map(k=>SCSTYLE[k]?.fr).filter(Boolean))+noteMark('notes.scstyle'),body:()=>`${cbox(mItems('sc.style',SCSTYLE),'notes.scstyle','Précisez : lumière de fin du monde, ambiance de conte malgache…')}${presets(mchips('sc.style',SCSTYLE),'Préréglages (plusieurs possibles)')}`,reset:()=>{S.sc.style=['idyllic'];S.notes.scstyle=''}});
  C.push({id:'scelems',ic:'trees',t:'Éléments du paysage',sum:()=>sumChips([].concat(...Object.values(SCELEM).map(g=>S.sc.elems.filter(k=>g[k]).map(k=>g[k].fr))))+noteMark('notes.elems'),body:()=>{const all=Object.assign({},...Object.values(SCELEM));return `${cbox(mItems('sc.elems',all),'notes.elems','Précisez : un pirogue au premier plan, des lanternes…')}${refRow(DECORSLOTS.filter(d=>d[0]==='el1'||d[0]==='el2').map(d=>['d.'+d[0],d[1],d[2]]),'Photos d’éléments')}${presets(mgroups('sc.elems',SCELEM),'Préréglages (plusieurs possibles)')}`},reset:()=>{S.sc.elems=[];S.notes.elems=''}});
  C.push({id:'sccomp',ic:'grid-3x3',t:'Composition',sum:()=>sumChips([SCCOMP[S.sc.comp]?.fr].filter(Boolean)),body:()=>`${cbox(sItem('sc.comp',SCCOMP),'notes.comp','Précisez : grand espace vide à droite pour un texte…')}${presets(chips('sc.comp',SCCOMP))}`,reset:()=>{S.sc.comp='thirds';S.notes.comp=''}})}
 if(tab==='produit'){const prod=S.subjects.find(x=>x.kind==='product');
  C.push({id:'pk',ic:'package',t:'Produit',sum:()=>sumChips([prod&&prod.product||'Nom à préciser',PKTYPE[S.pk.type].fr])+(prod&&R[`s${prod.id}.front`]?' '+ic('image'):''),
   body:()=>`${cbox(sItem('pk.type',PKTYPE),prod?`subjects.${prod.id}.notes.prod`:null,'Précisez : bouteille verte de 33 cl, étiquette dorée…')}
    ${prod?`<div class="field"><label class="lab">Nom du produit</label><input type="text" data-k="subjects.${prod.id}.product" value="${esc(prod.product)}" placeholder="Ex. : Jus de litchi Tsara"></div>${refRow(SR(prod,['front','backP','logo','pack']),'Photos du produit (pour un avatar fidèle)')}`:''}
    ${presets(chips('pk.type',PKTYPE),'Type de produit')}`,reset:()=>{S.pk.type='bottle';if(prod){prod.product='';prod.notes.prod=''}}});
  C.push({id:'pkmat',ic:'gem',t:'Matière & finition',sum:()=>sumChips(S.pk.mat.map(k=>PKMAT[k]?.fr).filter(Boolean))+noteMark('notes.mat'),body:()=>`${cbox(mItems('pk.mat',PKMAT),'notes.mat','Précisez : verre vert bouteille, bouchon en liège…')}${presets(mchips('pk.mat',PKMAT),'Préréglages (plusieurs possibles)')}`,reset:()=>{S.pk.mat=[];S.notes.mat=''}});
  if(prod){C.push({id:'pkpres',ic:'rotate-3d',t:'Présentation',poses:prod.id,sum:()=>`<span class="pminis sm">${poseThumbs(prod)}</span>${sumChips([poseSummary(prod)],1)}`});
   C.push({id:'pksurf',ic:'table',t:'Support',sum:()=>sumChips([SURFACE[prod.surface].fr])+noteMark(`subjects.${prod.id}.notes.surf`),body:()=>`${cbox(sItem(`subjects.${prod.id}.surface`,SURFACE),`subjects.${prod.id}.notes.surf`,'Précisez : sur une natte en raphia tressée…')}${presets(chips(`subjects.${prod.id}.surface`,SURFACE))}`,reset:()=>{prod.surface='plinth'}})}
  C.push({id:'pkhand',ic:'hand',t:'Main',sum:()=>sumChips([S.pk.hand==='none'?'Sans main':POSES[S.pk.hand]?.fr].filter(Boolean)),
   body:()=>{const H={none:{fr:'Sans main',ic:'ban'}};Object.keys(POSES).filter(k=>POSES[k].cat==='hands').forEach(k=>H[k]={fr:POSES[k].fr,ic:'hand'});
    return `${cbox(S.pk.hand==='none'?[]:[{label:POSES[S.pk.hand].fr,ic:'hand',path:'pk.hand',val:S.pk.hand,rm:true,reset:'none'}],'notes.hand','Précisez : ongles vernis rouge, bracelet en perles…')}
    <div class="row2"><div class="field"><label class="lab">Peau</label><select data-k="pk.handSkin">${opts(ORIGIN,S.pk.handSkin)}</select></div><div>${slot('pk.hand','Photo de main','hand')}</div></div>
    ${presets(`<div class="tiles">${Object.entries(H).map(([k,v])=>`<button class="tile" data-set="pk.hand" data-val="${k}" aria-pressed="${S.pk.hand===k}"><span class="thumb tall">${k==='none'?`<svg viewBox="0 0 100 112"><text x="50" y="62" text-anchor="middle" font-size="10" fill="var(--dim)">—</text></svg>`:poseSVG(k)}</span><span class="tl">${esc(v.fr)}</span></button>`).join('')}</div>`)}`},reset:()=>{S.pk.hand='none';S.notes.hand=''}});
  const pers=S.subjects.find(x=>x.kind==='person');
  C.push({id:'pkperson',ic:'user-plus',t:'Personnage',toggle:true,sum:()=>pers?sumChips([GENDER[pers.gender].fr,pers.age+' ans',poseSummary(pers)]):'<span class="sempty">Aucun personnage</span>'});
  if(pers)C.push(...personCards(pers).map(c=>Object.assign(c,{sub:true})))}
 if(tab==='effets'){
  C.push({id:'pksplash',ic:'droplets',t:'Splash & liquides',sum:()=>sumChips(S.pk.splash.map(k=>PKSPLASH[k]?.fr).filter(Boolean))+noteMark('notes.splash'),body:()=>`${cbox(mItems('pk.splash',PKSPLASH),'notes.splash','Précisez : splash qui entoure la bouteille en spirale…')}${presets(mchips('pk.splash',PKSPLASH),'Préréglages (plusieurs possibles)')}`,reset:()=>{S.pk.splash=[];S.notes.splash=''}});
  C.push({id:'pkfruit',ic:'apple',t:'Fruits & ingrédients',sum:()=>sumChips([...S.pk.fruits.map(k=>PKFRUIT[k]?.fr).filter(Boolean),...PKFRUITSLOTS.filter(([k])=>R[k]).map(([,l])=>l+' (photo)')])+noteMark('notes.fruits'),
   body:()=>`${cbox(mItems('pk.fruits',PKFRUIT),'notes.fruits','Précisez : tranches de mangue qui volent, feuilles de menthe…')}${refRow(PKFRUITSLOTS,'Vos fruits en photo (jusqu’à 6)')}${presets(mchips('pk.fruits',PKFRUIT,6),'Préréglages (6 maximum)')}`,reset:()=>{S.pk.fruits=[];S.notes.fruits='';PKFRUITSLOTS.forEach(([k])=>delete R[k]);saveRefs()}});
  C.push({id:'pkfx',ic:'sparkle',t:'Particules & atmosphère',sum:()=>sumChips(S.pk.fx.map(k=>PKFX[k]?.fr).filter(Boolean))+noteMark('notes.fx'),body:()=>`${cbox(mItems('pk.fx',PKFX),'notes.fx','Précisez : fumée légère au ras du sol…')}${presets(mchips('pk.fx',PKFX),'Préréglages (plusieurs possibles)')}`,reset:()=>{S.pk.fx=[];S.notes.fx=''}})}
 if(tab==='ambiance'){
  C.push({id:'time',ic:'sunrise',t:'Moment de la journée',thumb:()=>timeThumb(S.time,TIME[S.time]),sum:()=>sumChips([TIME[S.time].fr])+noteMark('notes.time'),body:()=>`${cbox(sItem('time',TIME),'notes.time','Précisez : juste avant l’orage, lumière rasante sur les rizières…')}${presets(tiles('time',TIME,timeThumb))}`,reset:()=>{S.time=defaults(S.ptype).time;S.notes.time=''}});
  C.push({id:'weather',ic:'cloud-sun',t:'Météo',sum:()=>sumChips(S.weather.map(k=>WEATHER[k]?.fr).filter(Boolean))+noteMark('notes.weather'),body:()=>`${cbox(mItems('weather',WEATHER),'notes.weather','Précisez : flaques qui reflètent les néons, crachin léger…')}${presets(mchips('weather',WEATHER),'Préréglages (plusieurs possibles)')}`,reset:()=>{S.weather=defaults(S.ptype).weather;S.notes.weather=''}});
  C.push({id:'climate',ic:'globe',t:'Climat, pays & température',sum:()=>sumChips([CLIMATE[S.climate].fr.replace('— ',''),tempLabel()])+noteMark('notes.climate'),
   body:()=>`${cbox(S.climate==='none'?[]:sItem('climate',CLIMATE,true,'none'),'notes.climate','Précisez : saison des pluies à Toamasina, hiver austral…')}
   <div class="field"><label class="lab" for="temp">Température de couleur <output data-out="temp">${tempLabel()}</output></label><div class="temp"></div><input type="range" id="temp" min="-100" max="100" step="5" data-k="temp" data-num value="${S.temp}"></div>${presets(chips('climate',CLIMATE))}`,reset:()=>{const d=defaults(S.ptype);S.climate=d.climate;S.temp=d.temp;S.notes.climate=''}});
  C.push({id:'mood',ic:'palette',t:'Ambiance',thumb:()=>S.mood[0]?moodThumb(S.mood[0],MOOD[S.mood[0]]):'',sum:()=>sumChips(S.mood.map(k=>MOOD[k]?.fr).filter(Boolean))+noteMark('notes.mood'),body:()=>`${cbox(mItems('mood',MOOD),'notes.mood','Précisez : nostalgie des années 90, énergie de fête de quartier…')}${presets(mtiles('mood',MOOD,moodThumb),'Préréglages (plusieurs possibles)')}`,reset:()=>{S.mood=defaults(S.ptype).mood;S.notes.mood=''}})}
 if(tab==='lumiere'){
  C.push({id:'kit',ic:'layout-template',t:'Kit de lumière',thumb:()=>kitThumb(S.lights.map(l=>[l.type,l.role,l.x,l.y,l.z,l.power,l.kelvin,l.gel])),sum:()=>sumChips([kitName()]),body:()=>{const kits=S.kitCat==='mine'?Object.fromEntries(S.customKits.map(k=>[k.id,k])):Object.fromEntries(Object.entries(KITS).filter(([,v])=>v.cat===S.kitCat));
   return `${cbox([{label:kitName(),ic:'lightbulb'}])}<p class="hint">Un kit remplace l'installation. Tout reste modifiable ensuite, sur le plateau ou dans « Lumières installées ».</p>
   ${presets(`<div class="chips">${Object.entries(KCAT).map(([k,v])=>`<button class="chip" data-set="kitCat" data-val="${k}" aria-pressed="${S.kitCat===k}">${ic(v.ic)}<span>${v.fr}</span></button>`).join('')}</div>
   <div class="kits">${Object.keys(kits).length?Object.entries(kits).map(([k,v])=>`<div class="kitw"><button class="kit" data-kit="${k}" aria-pressed="${S.kit===k}"><span class="kthumb">${kitThumb(v.L)}</span><b>${esc(v.fr)}</b><small>${esc(v.d||v.L.length+' lumières')}</small></button>${S.kitCat==='mine'?`<button class="kdel" data-kdel="${k}" aria-label="Supprimer ce kit">${ic('trash-2')}</button>`:''}</div>`).join(''):`<p class="hint">Aucun kit perso. Réglez une installation puis enregistrez-la ci-dessous.</p>`}</div>
   <div class="addrow"><input type="text" id="kitName" placeholder="Nom de mon kit" aria-label="Nom du kit à enregistrer"><button class="btn" id="saveKit">${ic('bookmark-plus')}Enregistrer mon kit</button></div>`,'Kits prêts à l’emploi')}`},reset:()=>{const d=defaults(S.ptype);S.lights=d.lights;S.kit=d.kit;S.kitCat=d.kitCat}});
  C.push({id:'lights',ic:'lightbulb',t:'Lumières installées',sum:lightsSum,body:()=>`${cbox(S.lights.map(l=>({label:LT[l.type].fr+' · '+LROLE[l.role].fr,ic:LT[l.type].ic})),'notes.light','Précisez l’éclairage général : reflets dorés sur la peau, ombres très marquées…')}
   <p class="hint">${ic('mouse-pointer-click')} Vous pouvez aussi cliquer directement sur une lumière du plateau.</p>
   ${S.lights.map(l=>lightCard(l)).join('')}<div class="addrow"><select id="addType" aria-label="Type de lumière à ajouter">${optsG(LTYPE,'softbox')}</select><button class="btn" id="addLight">${ic('plus')}Ajouter</button></div>`,reset:()=>{const d=defaults(S.ptype);S.lights=d.lights;S.kit=d.kit;S.notes.light=''}});
  C.push({id:'lightref',ic:'image-plus',t:'Référence d’éclairage',sum:()=>R['l.ref']?'<span class="schips"><span>Photo ajoutée</span></span>':'<span class="sempty">Aucune</span>',body:()=>`<p class="hint">Une photo dont vous aimez la lumière : le modèle s'en inspirera.</p><div class="slots">${slot('l.ref','Photo de référence','lightbulb')}</div>`,reset:()=>{delete R['l.ref'];saveRefs()}})}
 if(tab==='camera'){const c=S.camera;
  C.push({id:'body',ic:'camera',t:'Boîtier',sum:()=>sumChips([BODY[c.body].fr])+noteMark('notes.body'),body:()=>`${cbox(sItem('camera.body',BODY),'notes.body','Précisez : rendu argentique granuleux, capteur moyen format…')}${presets(chips('camera.body',BODY))}`,reset:()=>{c.body='a7r5';S.notes.body=''}});
  C.push({id:'lens',ic:'aperture',t:'Objectif & ouverture',thumb:()=>lensThumb(c.lens,LENS[c.lens]),sum:()=>sumChips([LENS[c.lens].fr,'f/'+c.ap,SHUTTER[c.shutter].fr]),body:()=>`${cbox([...sItem('camera.lens',LENS),{label:'f/'+c.ap,ic:'aperture'},...sItem('camera.shutter',SHUTTER)],'notes.lens','Précisez : flare doré dans l’objectif, bokeh en forme de cœur…')}
   <div class="field"><label class="lab" for="ca">Ouverture <output data-out="camera.ap">f/${c.ap}</output></label><div class="aprow"><span id="apIris">${apertureSvg(c.ap,56)}</span><span id="apBokeh">${bokehSvg(c.ap)}</span></div>
   <input type="range" id="ca" min="0" max="${APS.length-1}" step="1" data-ap value="${APS.indexOf(c.ap)}"><p class="hint" data-out="dof">${dofFr()}</p></div>
   ${presets(tiles('camera.lens',LENS,lensThumb,'t4'),'Objectifs')}${presets(chips('camera.shutter',SHUTTER),'Vitesse')}`,reset:()=>{const d=defaults(S.ptype).camera;c.lens=d.lens;c.ap=d.ap;c.shutter='normal';S.notes.lens=''}});
  C.push({id:'framing',ic:'crop',t:'Valeur de plan',thumb:()=>framingThumb(c.framing,FRAMING[c.framing]),sum:()=>sumChips([FRAMING[c.framing].fr])+noteMark('notes.framing'),body:()=>`${cbox(sItem('camera.framing',FRAMING),'notes.framing','Précisez : sujet décentré à gauche, espace libre en haut pour le texte…')}${presets(tiles('camera.framing',FRAMING,framingThumb))}`,reset:()=>{c.framing=defaults(S.ptype).camera.framing;S.notes.framing=''}});
  C.push({id:'angle',ic:'rotate-3d',t:'Angle & position',thumb:()=>ANGLE[c.angle]?angleThumb(c.angle,ANGLE[c.angle]):'',sum:()=>sumChips([angleInfo().fr,c.z.toFixed(1)+' m'])+noteMark('notes.angle'),body:()=>`${cbox([{label:angleInfo().fr,ic:'rotate-3d'},{label:'Hauteur '+c.z.toFixed(2)+' m',ic:'arrow-up-down'}],'notes.angle','Précisez : caméra à travers la vitre d’un taxi-be…')}${camSliders('w')}${presets(tiles('camera.angle',ANGLE,angleThumb))}`,reset:()=>{const d=defaults(S.ptype).camera;Object.assign(c,{angle:'eye',z:d.z,tilt:0,roll:0,aim:true,x:50,y:d.y});S.notes.angle=''}});
  C.push({id:'film',ic:'film',t:'Rendu / pellicule',sum:()=>sumChips([FILM[c.film].fr])+noteMark('notes.film'),body:()=>`${cbox(sItem('camera.film',FILM),'notes.film','Précisez : couleurs délavées, grain fort, vignettage…')}${presets(chips('camera.film',FILM))}`,reset:()=>{c.film=defaults(S.ptype).camera.film;S.notes.film=''}})}
 if(tab==='rendu'){
  C.push({id:'ratio',ic:'frame',t:'Format',thumb:()=>ratioThumb(S.render.ratio),sum:()=>sumChips([S.render.ratio]),body:()=>`${cbox([{label:S.render.ratio,ic:'frame'}])}${presets(`<div class="tiles t4">${RATIO.map(r=>`<button class="tile" data-set="render.ratio" data-val="${r}" aria-pressed="${S.render.ratio===r}"><span class="thumb">${ratioThumb(r)}</span><span class="tl">${r}</span></button>`).join('')}</div>`)}`,reset:()=>{S.render.ratio=defaults(S.ptype).render.ratio}});
  C.push({id:'usage',ic:'send',t:'Destination',sum:()=>sumChips([USAGE[S.render.usage].fr])+noteMark('notes.usage'),body:()=>`${cbox(sItem('render.usage',USAGE),'notes.usage','Précisez : affiche 4×3 m, zone logo en bas à droite…')}<p class="hint">${ic('maximize')} Pour un grand format, pensez à l'<b>Upscale</b> après la génération.</p>${presets(chips('render.usage',USAGE))}`,reset:()=>{S.render.usage='social';S.notes.usage=''}});
  C.push({id:'style',ic:'brush',t:'Style d’image',sum:()=>sumChips([STYLE[S.render.style].fr])+noteMark('notes.style'),body:()=>`${cbox(sItem('render.style',STYLE),'notes.style','Précisez : couleurs très saturées, façon campagne télécom…')}${presets(chips('render.style',STYLE))}`,reset:()=>{S.render.style=defaults(S.ptype).render.style;S.notes.style=''}})}
 return C}

/* ---------- rendu du panneau ---------- */
const TAB_HINT={decor:'Où se passe la scène ?',elements:'Ce qu’on voit dans le paysage',produit:'Le produit à mettre en valeur',effets:'Ce qui entoure le produit',ambiance:'Moment, météo et atmosphère',lumiere:'Comment la scène est éclairée',camera:'Comment on la photographie',sujet:'Qui est dans l’image ?',rendu:'Format et style final'};
function cardHTML(c){return `<article class="ccard${c.sub?' sub':''}" data-card="${c.id}">
 <div class="ccic">${c.thumb?`<span class="ccthumb">${c.thumb()}</span>`:ic(c.ic)}</div>
 <div class="ccmain"><b>${esc(c.t)}</b><div class="ccsum">${c.sum()}</div></div>
 ${c.toggle?(S.subjects.some(x=>x.kind==='person')?`<button class="btn small ghost danger" data-pkperson="off">${ic('user-minus')}Retirer</button>`:`<button class="btn small" data-pkperson="on">${ic('user-plus')}Ajouter</button>`)
  :c.poses?`<button class="btn small" data-poses="${c.poses}">${ic('layout-grid')}Choisir</button>`:`<button class="btn small" data-win="${c.id}">${ic('sliders-horizontal')}Modifier</button>`}
</article>`}
function renderPanel(){const p=$('#panel');if(!p)return;const tab=S.tab;let h=`<div class="phd"><h3>${esc((tabsFor(S.ptype).find(t=>t[0]===tab)||['','Réglages'])[1])}</h3><p class="hint">${esc(TAB_HINT[tab]||'')}</p></div>`;
 if(tab==='sujet'){const n=S.subjects.length,s=S.subjects.find(x=>x.id===S.subSel)||S.subjects[0];
  h+=`<article class="ccard"><div class="ccic">${ic('users')}</div><div class="ccmain"><b>Composition</b><div class="ccsum">${sumChips([cnt(n,'sujet'),S.crowd!=='none'?CROWD[S.crowd].fr:''].filter(Boolean))}</div></div><button class="btn small" data-win="compo">${ic('sliders-horizontal')}Modifier</button></article>`;
  if(n>1)h+=`<article class="ccard"><div class="ccic"><span class="ccthumb tall">${groupSVG(S.interact,n,subjOpts(S.subjects[0]))}</span></div><div class="ccmain"><b>Interaction</b><div class="ccsum">${sumChips([(INTER_ALL()[S.interact]||{fr:'—'}).fr])}</div></div><button class="btn small" data-win="inter">${ic('sliders-horizontal')}Modifier</button></article>`;
  if(s){h+=`<div class="subhead">${n>1?`<div class="subtabs">${S.subjects.map((x,i)=>`<button data-subsel="${x.id}" aria-selected="${x.id===s.id}">${ic(KIND[x.kind].ic)}Sujet ${i+1}</button>`).join('')}</div>`:`<h4>Sujet principal</h4>`}
   <div class="kindrow">${Object.entries(KIND).map(([k,v])=>`<button class="kind" data-set="subjects.${s.id}.kind" data-val="${k}" aria-pressed="${s.kind===k}" title="${esc(v.fr)}">${ic(v.ic)}<span>${esc(v.fr)}</span></button>`).join('')}</div></div>`;
   h+=subjectCards(s).map(cardHTML).join('')}}
 else{const C=cardsFor(tab);let subOpen=false;h+=C.map(c=>{let pre='';if(c.sub&&!subOpen){subOpen=true;pre=`<h4 class="subh">${ic('user')}Le personnage</h4>`}return pre+cardHTML(c)}).join('')}
 p.innerHTML=h;refreshIcons()}

/* ---------- fenêtres de réglage ---------- */
let WIN=null;
function winSpec(id){if(id==='compo')return {ic:'users',t:'Composition',body:()=>`${cbox([{label:cnt(S.subjects.length,'sujet'),ic:'users'},...(S.crowd!=='none'?sItem('crowd',CROWD,true,'none'):[])],'notes.crowd','Précisez : supporters en maillot vert, foule floue au marché…')}
  ${presets(`<div class="seg">${[1,2,3].map(k=>`<button data-nsub="${k}" aria-pressed="${S.subjects.length===k}">${ic(k===1?'user':'users')}${k} sujet${k>1?'s':''}</button>`).join('')}</div>`,'Nombre de sujets')}${presets(chips('crowd',CROWD),'Foule')}`,reset:()=>{setSubjects(1);S.crowd='none';S.notes.crowd=''}};
 if(id==='inter'){const n=S.subjects.length,o=subjOpts(S.subjects[0]),D3=n>=3?INTERACT3:INTERACT;return {ic:'handshake',t:'Interaction',body:()=>`${cbox(INTER_ALL()[S.interact]?[{label:INTER_ALL()[S.interact].fr,ic:'users'}]:[],'notes.interact','Précisez : la mère tient la main de sa fille, ils rient d’une blague…')}
  ${presets(`<div class="tiles">${Object.entries(D3).map(([k,v])=>`<button class="tile" data-set="interact" data-val="${k}" aria-pressed="${S.interact===k}"><span class="thumb tall">${groupSVG(k,n,o)}</span><span class="tl">${esc(v.fr)}</span></button>`).join('')}</div>`,n>=3?'Poses à trois':'Poses à deux')}`,reset:()=>{S.interact=n>=3?'trio_line':'side';S.notes.interact=''}}}
 const all=[...cardsFor(S.tab),...S.subjects.flatMap(subjectCards),...cardsFor('produit'),...cardsFor('effets'),...cardsFor('elements')];
 const c=all.find(x=>x.id===id);return c?{ic:c.ic,t:c.t,body:c.body,reset:c.reset}:null}
function openWin(id){POP=null;renderPop();WIN={id,snapS:JSON.stringify(S),snapR:Object.assign({},R)};renderWin();setTimeout(()=>{const f=$('#win .winbody input,#win .winbody button');f&&f.focus({preventScroll:true})},60)}
function renderWin(){const el=$('#win');if(!el)return;if(!WIN){el.hidden=true;el.innerHTML='';return}
 const sp=winSpec(WIN.id);if(!sp||!sp.body){WIN=null;el.hidden=true;return}
 const body=el.querySelector('.winbody'),st=body?body.scrollTop:0,first=!body;
 el.innerHTML=`<div class="winpanel${first?'':' still'}" role="dialog" aria-modal="true" aria-labelledby="winT">
  <header class="winhd"><span class="winic">${ic(sp.ic)}</span><h2 id="winT">${esc(sp.t)}</h2><span class="sp"></span><button class="x" data-winok aria-label="Fermer">${ic('x')}</button></header>
  <div class="winbody">${sp.body()}</div>
  <footer class="winft"><button class="btn ghost" data-winreset>${ic('rotate-ccw')}Réinitialiser</button><span class="sp"></span><button class="btn" data-wincancel>${ic('undo-2')}Annuler</button><button class="btn primary" data-winok>${ic('check')}Valider</button></footer></div>`;
 el.hidden=false;const nb=el.querySelector('.winbody');if(nb)nb.scrollTop=st;refreshIcons()}
ALL_HOOKS.push(()=>{const el=$('#win');if(WIN||(el&&!el.hidden))renderWin()});
function closeWin(ok){if(!WIN)return;if(!ok){S=JSON.parse(WIN.snapS);R=WIN.snapR;saveRefs()}WIN=null;all();if(!ok)toast('Modifications annulées')}
document.addEventListener('click',e=>{const t=e.target.closest('[data-win],[data-winok],[data-wincancel],[data-winreset],[data-card],[data-pkperson],#win');if(!t)return;const d=t.dataset;
 if(d.win){openWin(d.win);return}
 if(d.winok!==undefined){closeWin(true);return}
 if(d.wincancel!==undefined){closeWin(false);return}
 if(d.winreset!==undefined){const sp=winSpec(WIN.id);if(sp&&sp.reset)sp.reset();all();toast('Réglage remis par défaut');return}
 if(d.pkperson){if(d.pkperson==='on'){const id=Math.max(...S.subjects.map(s=>s.id))+1,ns=newSubject(id,'person',64,56);ns.poses=['holding'];S.subjects.push(ns);toast('Personnage ajouté')}
  else{const p=S.subjects.find(x=>x.kind==='person');if(p){S.subjects=S.subjects.filter(x=>x!==p);Object.keys(R).filter(k=>k.startsWith('s'+p.id+'.')).forEach(k=>delete R[k]);saveRefs()}}all();return}
 if(t.id==='win'&&e.target.id==='win'){closeWin(true);return}
 if(d.card&&!e.target.closest('button')){const b=t.querySelector('[data-win],[data-poses],[data-pkperson]');b&&b.click()}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&WIN&&$('#overlay').hidden)closeWin(true)});
