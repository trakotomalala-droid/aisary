/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= V2 : POSES ENRICHIES, TRIOS, SUGGESTIONS SELON LE DÉCOR ================= */
const L2='var(--line2)',AC='var(--accent)';
Object.assign(PROPS,{
 bench:f=>`<path d="M${f1(f.hip[0]-26)} ${f1(f.hip[1]+4)}h52M${f1(f.hip[0]-22)} ${f1(f.hip[1]+4)}v24M${f1(f.hip[0]+22)} ${f1(f.hip[1]+4)}v24M${f1(f.hip[0]-26)} ${f1(f.hip[1]-10)}h52" stroke="${L2}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
 table:f=>`<path d="M${f1(f.hip[0]+6)} ${f1(f.hip[1]-6)}h40M${f1(f.hip[0]+10)} ${f1(f.hip[1]-6)}v34M${f1(f.hip[0]+42)} ${f1(f.hip[1]-6)}v34" stroke="${L2}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
 tableR:()=>`<path d="M62 74h34M66 74v34M92 74v34" stroke="${L2}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
 laptop:f=>`<path d="M${f1(f.hip[0]+14)} ${f1(f.hip[1]-7)}h16l4-12h-16z" fill="${AC}" opacity=".85"/>`,
 paper:f=>`<rect x="${f1(f.hip[0]+14)}" y="${f1(f.hip[1]-9)}" width="16" height="3" fill="${AC}"/>`,
 plate:f=>`<ellipse cx="${f1(f.hip[0]+24)}" cy="${f1(f.hip[1]-8)}" rx="9" ry="2.5" fill="${AC}"/>`,
 book:f=>`<path d="M${f1((f.handL[0]+f.handR[0])/2-8)} ${f1((f.handL[1]+f.handR[1])/2-6)}h16v10h-16z" fill="${AC}"/><line x1="${f1((f.handL[0]+f.handR[0])/2)}" y1="${f1((f.handL[1]+f.handR[1])/2-6)}" x2="${f1((f.handL[0]+f.handR[0])/2)}" y2="${f1((f.handL[1]+f.handR[1])/2+4)}" stroke="var(--bg)" stroke-width="1"/>`,
 umbrella:f=>`<path d="M${f1(f.handR[0]-24)} ${f1(f.handR[1]-14)}q24-22 48 0z" fill="${AC}" opacity=".8"/><line x1="${f1(f.handR[0])}" y1="${f1(f.handR[1]-14)}" x2="${f1(f.handR[0])}" y2="${f1(f.handR[1]+4)}" stroke="${AC}" stroke-width="1.4"/>`,
 guitar:f=>`<g transform="translate(${f1(f.hip[0]+2)} ${f1(f.hip[1]-14)}) rotate(-30)"><ellipse rx="8" ry="6.5" fill="${AC}" opacity=".85"/><rect x="6" y="-1.5" width="22" height="3" fill="${AC}"/></g>`,
 camera:f=>`<rect x="${f1(f.head[0]-7)}" y="${f1(f.head[1]-1)}" width="14" height="9" rx="2" fill="${AC}"/><circle cx="${f1(f.head[0])}" cy="${f1(f.head[1]+3.5)}" r="2.6" fill="var(--bg)"/>`,
 heart:f=>`<path d="M${f1(f.head[0])} ${f1(f.head[1]-12)}c-4-6-12-2-8 4l8 7 8-7c4-6-4-10-8-4z" fill="${AC}"/>`,
 vsign:f=>`<path d="M${f1(f.handR[0]-2)} ${f1(f.handR[1]-2)}l-2-8M${f1(f.handR[0]+2)} ${f1(f.handR[1]-2)}l2-8" stroke="${AC}" stroke-width="2" stroke-linecap="round"/>`,
 lookup:f=>`<path d="M${f1(f.head[0])} ${f1(f.head[1]-12)}v-10m-5 5l5-5 5 5" stroke="${AC}" stroke-width="1.6" fill="none"/>`,
 lookdown:f=>`<path d="M${f1(f.head[0]+12)} ${f1(f.head[1]+2)}l6 8m-6 0h6v-6" stroke="${AC}" stroke-width="1.6" fill="none"/>`,
 stairsSit:()=>`<path d="M20 108v-12h22v-12h22v-12h22v36" fill="${L2}" opacity=".7"/>`,
 bed:f=>`<path d="M${f1(f.hip[0]-30)} ${f1(f.hip[1]+4)}h60v14h-60zM${f1(f.hip[0]-30)} ${f1(f.hip[1]-14)}v32" stroke="${L2}" stroke-width="2.4" fill="${L2}" fill-opacity=".35"/>`,
 swing:f=>`<path d="M${f1(f.handL[0])} 4V${f1(f.handL[1])}M${f1(f.handR[0])} 4V${f1(f.handR[1])}M${f1(f.hip[0]-12)} ${f1(f.hip[1]+4)}h24" stroke="${L2}" stroke-width="2" fill="none"/>`,
 tree:()=>`<path d="M14 108V30" stroke="${L2}" stroke-width="7" stroke-linecap="round"/><circle cx="14" cy="24" r="16" fill="${L2}" opacity=".7"/>`,
 rail:()=>`<path d="M4 78h92M10 78v30M30 78v30M50 78v30M70 78v30M90 78v30" stroke="${L2}" stroke-width="2" fill="none"/>`,
 box:f=>`<rect x="${f1((f.handL[0]+f.handR[0])/2-11)}" y="${f1((f.handL[1]+f.handR[1])/2-14)}" width="22" height="16" rx="1.5" fill="${AC}" opacity=".85"/>`,
 bags:f=>`<rect x="${f1(f.handL[0]-5)}" y="${f1(f.handL[1])}" width="10" height="10" rx="2" fill="${AC}"/><rect x="${f1(f.handR[0]-5)}" y="${f1(f.handR[1])}" width="10" height="10" rx="2" fill="${AC}"/>`,
 skate:f=>`<path d="M${f1(f.footL[0]-8)} ${f1(f.footL[1]+3)}h${f1(f.footR[0]-f.footL[0]+16)}" stroke="${AC}" stroke-width="2.5" stroke-linecap="round"/><circle cx="${f1(f.footL[0]-3)}" cy="${f1(f.footL[1]+6)}" r="2" fill="${AC}"/><circle cx="${f1(f.footR[0]+3)}" cy="${f1(f.footR[1]+6)}" r="2" fill="${AC}"/>`,
 mic:f=>`<line x1="${f1(f.handR[0])}" y1="${f1(f.handR[1])}" x2="${f1(f.handR[0]+6)}" y2="${f1(f.handR[1]-8)}" stroke="${AC}" stroke-width="2"/><circle cx="${f1(f.handR[0]+7)}" cy="${f1(f.handR[1]-10)}" r="3" fill="${AC}"/>`,
 ring:f=>`<circle cx="${f1(f.handR[0]+3)}" cy="${f1(f.handR[1]-3)}" r="3" fill="none" stroke="${AC}" stroke-width="1.6"/>`,
 sofaW:()=>`<path d="M8 92h84v14H8zM8 70v24M92 70v24M8 74h84" stroke="${L2}" stroke-width="2" fill="${L2}" fill-opacity=".3"/>`,
 benchW:()=>`<path d="M6 88h88M12 88v20M88 88v20M6 72h88" stroke="${L2}" stroke-width="2.4" fill="none"/>`,
});
function childAt(x,s=.5,o={}){return figure(mk({al:[-150,-170]}),{dx:x-50,s,female:o.female}).svg}
// --- vie quotidienne
addP('life','read','Lit un livre','reading a book',mk({hd:12,al:[-20,100],ar:[20,-100]}),['book']);
addP('life','laptop','Travaille sur un ordinateur','working on a laptop at a table',mk({h:[36,80],ll:[82,2],lr:[78,6],al:[60,90],ar:[56,92],hd:8}),['chair','table','laptop']);
addP('life','write','Écrit à une table','writing at a table',mk({h:[36,80],ll:[82,2],lr:[78,6],al:[50,80],ar:[60,95],hd:14}),['chair','table','paper']);
addP('life','eat_table','Mange à table','eating at a table',mk({h:[36,80],ll:[82,2],lr:[78,6],al:[60,90],ar:[30,165]}),['chair','table','plate']);
addP('life','umbrella','Sous un parapluie','holding an umbrella',mk({ar:[20,170]}),['umbrella']);
addP('life','guitar','Joue de la guitare','playing the guitar',mk({al:[40,110],ar:[50,80]}),['guitar']);
addP('life','photo','Prend une photo','taking a photo with a camera',mk({al:[-10,150],ar:[10,-150]}),['camera']);
addP('life','walk_phone','Marche au téléphone','walking while talking on the phone',mk({t:3,al:[22,12],ar:[16,176],ll:[-24,-6],lr:[22,30]}),['phone']);
addP('life','walk_bag','Marche avec des sacs','walking with shopping bags',mk({t:3,al:[10,0],ar:[-10,0],ll:[-24,-6],lr:[22,30]}),['bags']);
addP('life','carry_box','Porte un carton','carrying a box',mk({al:[-20,80],ar:[20,-80]}),['box']);
addP('life','carry_child','Porte un enfant','carrying a child on the hip',null,null,{draw:o=>figure(mk({ar:[30,110],t:-4}),{female:o.female}).svg+childAt(66,.48)});
addP('life','cook','Cuisine','cooking at the stove',mk({t:8,al:[40,60],ar:[60,90]}),['tableR']);
// --- gestes & émotions
addP('emo','heart','Cœur avec les mains','making a heart shape with the hands',mk({al:[-20,150],ar:[20,-150]}),['heart']);
addP('emo','peace','Signe V','making a peace sign',mk({ar:[150,175]}),['vsign']);
addP('emo','headback','Rire aux éclats','laughing out loud, head tilted back',mk({t:-6,al:[-20,60],ar:[20,-60]}));
addP('emo','hug_self','Se serre dans les bras','hugging oneself',mk({al:[20,120],ar:[-20,-120]}));
addP('emo','hands_hair','Mains dans les cheveux','hands running through the hair',mk({al:[-150,60],ar:[150,-60]}));
addP('emo','look_up','Regarde vers le ciel','looking up to the sky',mk({}),['lookup']);
addP('emo','look_down','Regarde vers le bas','looking down',mk({hd:10}),['lookdown']);
addP('emo','shrug','Haussement d’épaules','shrugging',mk({al:[-60,-150],ar:[60,150]}));
addP('emo','pray','Mains jointes (gratitude)','hands pressed together in gratitude',mk({al:[-10,130],ar:[10,-130]}));
addP('emo','bow','Révérence','bowing politely',mk({t:40,al:[10,0],ar:[-10,0]}));
addP('emo','fist','Poing levé','raising a fist in victory',mk({ar:[170,180]}));
addP('emo','present','Présente quelque chose','presenting with an open arm gesture',mk({ar:[100,110]}));
addP('emo','propose','Demande en mariage','kneeling on one knee, proposing with a ring',mk({h:[48,84],ll:[0,92],lr:[80,0],ar:[80,90]}),['ring']);
// --- assis & allongé (complément)
addP('sit','sit_stairs','Assis sur des marches','sitting on steps',mk({h:[48,82],ll:[60,10],lr:[54,14],al:[40,80],ar:[30,90]}),['stairsSit']);
addP('sit','bench_sit','Assis sur un banc','sitting on a bench',mk({h:[46,80],ll:[82,2],lr:[78,6],al:[30,70],ar:[24,78]}),['bench']);
addP('sit','bed_sit','Assis au bord du lit','sitting on the edge of a bed',mk({h:[46,86],ll:[70,6],lr:[64,10],al:[20,60],ar:[30,70]}),['bed']);
addP('sit','lie_side','Allongé sur le côté','lying on the side, propped on an elbow',mk({t:80,h:[36,96],ll:[-90,-90],lr:[-92,-88],al:[-10,-80],ar:[170,100]}));
addP('sit','swing','Sur une balançoire','sitting on a swing',mk({h:[50,74],al:[-170,180],ar:[170,180],ll:[60,10],lr:[50,20]}),['swing']);
addP('sit','meditate','Méditation','meditating cross-legged',mk({h:[50,98],ll:[-76,72],lr:[76,-72],al:[-50,60],ar:[50,-60]}));
// --- appuis (basique)
addP('base','lean_table','Appuyé sur une table','leaning on a table',mk({t:16,al:[30,10],ar:[40,10]}),['tableR']);
addP('base','lean_tree','Adossé à un arbre','leaning against a tree',mk({t:-9,h:[30,72],ll:[-12,2],lr:[18,-6],al:[-30,-10]}),['tree']);
addP('base','lean_rail','Accoudé à une rambarde','leaning on a railing',mk({t:12,al:[60,80],ar:[70,90]}),['rail']);
addP('base','wall_foot','Pied contre le mur','leaning on a wall with one foot up',mk({t:-9,h:[30,72],ll:[-12,2],lr:[40,-60],al:[-30,-10],ar:[20,10]}),['wall']);
// --- sport (complément)
addP('sport','sprint','Départ de sprint','in a sprint start position',mk({t:60,h:[52,84],al:[20,0],ar:[30,0],ll:[-60,60],lr:[40,40]}));
addP('sport','skate','Skateboard','riding a skateboard',mk({t:6,al:[-80,-90],ar:[80,90],ll:[-20,10],lr:[20,-10]}),['skate']);
addP('sport','pushup','Pompes','doing push-ups',mk({t:84,h:[34,92],al:[2,0],ar:[-2,0],ll:[-92,-92],lr:[-94,-90]}));
addP('sport','splitjump','Grand écart sauté','doing a split jump in the air',mk({h:[50,60],ll:[-80,-90],lr:[80,90],al:[-120,-150],ar:[120,150]}));
PCAT.life={fr:'Vie quotidienne',ic:'coffee'};
PCAT.emo={fr:'Gestes & émotions',ic:'smile'};
PCAT.suggest={fr:'Suggéré pour votre scène',ic:'sparkles'};
PCAT.trio={fr:'À trois',ic:'users'};

// --- duos supplémentaires
Object.assign(GP,{
 walkhand:[[mk({t:3,ar:[20,20],al:[22,12],ll:[-24,-6],lr:[22,30]}),-12],[mk({t:3,al:[-20,-20],ar:[-22,-16],ll:[-24,-6],lr:[22,30]}),12]],
 armarm:[[mk({ar:[30,60]}),-8],[mk({al:[-30,-60]}),8]],
 parentchild:[[mk({ar:[30,10]}),-12],[mk({al:[-150,-170]}),12,.52]],
 seller:[[mk({ar:[70,90]}),-16,null,null,['bag']],[mk({al:[-70,-90]}),16]],
 interview:[[mk({ar:[70,110]}),-15,null,null,['mic']],[FACE_L,15]],
 phoneT:[[mk({hd:14,ar:[40,120]}),-8,null,null,['phone']],[mk({hd:-14}),8]],
 benchT:[[mk({h:[36,86],ll:[82,2],lr:[78,6],al:[30,70],ar:[24,78]}),0,.8,null,['benchW']],[mk({h:[64,86],ll:[82,2],lr:[78,6],al:[30,70],ar:[24,78]}),0,.8]],
 fistbump:[[mk({ar:[100,95]}),-15],[mk({al:[-100,-95]}),15]],
 chase:[[POSESP('running'),-22,.75],[POSESP('running'),18,.82]],
});
// --- trios
const GP3={
 trio_line:[[ST,-26],[ST,0],[ST,26]],
 trio_shoulders:[[mk({ar:[90,20]}),-24],[mk({al:[-90,-20],ar:[90,20]}),0],[mk({al:[-90,-20]}),24]],
 trio_jump:[[POSESP('jumpjoy'),-26],[POSESP('jump'),0],[POSESP('jumpjoy'),26]],
 trio_walk:[[POSESP('walking'),-26],[POSESP('walkcam'),0],[POSESP('walking'),26]],
 trio_sofa:[[mk({h:[24,88],ll:[82,2],lr:[78,6],al:[30,70],ar:[24,78]}),0,.7,null,['sofaW']],[mk({h:[50,88],ll:[82,2],lr:[78,6],al:[30,70],ar:[24,78]}),0,.7],[mk({h:[76,88],ll:[82,2],lr:[78,6],al:[30,70],ar:[24,78]}),0,.7]],
 trio_toast:[[mk({ar:[150,165]}),-26,null,null,['cup']],[mk({ar:[160,170]}),0,null,null,['cup']],[mk({al:[-150,-165]}),26]],
 trio_selfie:[[mk({hd:10}),-24],[mk({ar:[160,165]}),0,null,null,['phone']],[mk({hd:-10}),24]],
 trio_team:[[mk({ar:[60,80]}),-22],[mk({al:[-10,-20],ar:[10,20]}),0],[mk({al:[-60,-80]}),22]],
 trio_family:[[mk({ar:[30,10]}),-24],[mk({al:[-150,-170]}),0,.48],[mk({al:[-30,-10]}),24]],
 trio_talk:[[FACE_R,-26],[mk({ar:[60,120]}),0],[FACE_L,26]],
 trio_laugh:[[mk({hd:-12,ar:[10,40]}),-26],[mk({t:-6,al:[-20,60],ar:[20,-60]}),0],[mk({hd:12,al:[-10,-40]}),26]],
 trio_depth:[[ST,-18,.84],[ST,4,.7],[ST,22,.58]],
 trio_dance:[[mk({ar:[150,170],al:[-40,-20]}),-26],[POSESP('dance'),0],[mk({al:[-150,-170],ar:[40,20]}),26]],
};
function groupSVG(id,n,o={}){let list;
 if(GP3[id])list=GP3[id].map(x=>[x[0],x[1],x[2]||.72,x[3],x[4]]);
 else{list=(GP[id]||GP.side).map(x=>[...x]);
  if(n>=3&&list.length===2&&!['family','parentchild','benchT'].includes(id))list=[[list[0][0],-28,.72],[list[1][0],28,.72],[ST,0,.66]];
  else list=list.map(x=>[x[0],x[1],x[2]||.82,x[3],x[4]])}
 return `<svg viewBox="0 0 100 112" aria-hidden="true">${floor}${grp(list,o)}</svg>`}

/* ---------- suggestions selon le décor et la scène ---------- */
function suggestPoses(){const P=new Set(S.props||[]),out=[];const add=(...k)=>k.forEach(x=>{if(POSES[x]&&!out.includes(x))out.push(x)});
 if(P.has('chair')||P.has('stool')||P.has('bar'))add('sitting','thinker','laptop','write','eat_table');
 if(P.has('sofa'))add('sofa','sitknees','read');
 if(P.has('bench'))add('bench_sit','read','sitting');
 if(P.has('table')||P.has('desk'))add('lean_table','laptop','write','eat_table');
 if(P.has('stairs'))add('sit_stairs','stairs');
 if(P.has('wall'))add('lean','wall_foot');
 if(P.has('bed'))add('bed_sit','lying','lie_side');
 if(P.has('swing'))add('swing');
 if(P.has('tree'))add('lean_tree','sitknees');
 if(P.has('railing'))add('lean_rail');
 if(P.has('umbrella'))add('umbrella');
 if(P.has('microphone'))add('present','wave');
 if(P.has('car')||S.subjects.some(x=>x.kind==='vehicle'))add('drive','passenger','leancar','opendoor','hood','window');
 if(P.has('moto'))add('moto');
 if(P.has('bike'))add('bike');
 if(S.subjects.some(x=>x.kind==='product')||S.ptype==='product')add('holding','show','twohands','drink','pointprod');
 return out}

/* ---------- catégories et fenêtre de poses (version enrichie) ---------- */
function poseCats(s){const others=S.subjects.filter(x=>x.id!==s.id),persons=S.subjects.filter(x=>x.kind==='person').length;
 if(s.kind==='product'||s.kind==='object')return ['pres','hands'];if(s.kind==='vehicle')return ['vang'];if(s.kind==='animal')return ['ani'];if(s.kind==='fantasy')return ['fant'];
 const c=[];if(suggestPoses().length)c.push('suggest');if(persons>=3)c.push('trio');if(persons>=2)c.push('group');
 if(others.some(x=>x.kind==='vehicle'))c.push('veh');if(others.some(x=>x.kind==='product')||S.ptype==='product')c.push('prod');
 ['base','move','sit','life','emo','sport','foot','dance','mode'].forEach(k=>c.push(k));['prod','hands','veh'].forEach(k=>{if(!c.includes(k))c.push(k)});return c}
function poseTile(k,o,sel){const p=POSES[k];return `<button class="ptile" data-psel="${k}" aria-pressed="${sel.includes(k)}"><span class="pfig">${poseSVG(k,o)}</span><span class="pl">${esc(p.fr)}</span>${sel.includes(k)?`<span class="pnum">${sel.indexOf(k)+1}</span>`:''}</button>`}
function renderPoses(){const s=S.subjects.find(x=>x.id==PW.sid);if(!s){closeOverlay();return}const cats=poseCats(s),o=subjOpts(s),n=S.subjects.filter(x=>x.kind==='person').length,idx=S.subjects.indexOf(s)+1;
 if(!cats.includes(PW.cat))PW.cat=cats[0];
 const who=s.kind==='person'?`${GENDER[s.gender].fr} · ${s.age} ans`:KIND[s.kind].fr;const IA=INTER_ALL();
 let grid;
 if(PW.cat==='group')grid=Object.entries(INTERACT).map(([k,v])=>`<button class="ptile" data-pinter="${k}" aria-pressed="${PW.inter===k}"><span class="pfig">${groupSVG(k,n,o)}</span><span class="pl">${esc(v.fr)}</span></button>`).join('');
 else if(PW.cat==='trio')grid=Object.entries(INTERACT3).map(([k,v])=>`<button class="ptile" data-pinter="${k}" aria-pressed="${PW.inter===k}"><span class="pfig">${groupSVG(k,3,o)}</span><span class="pl">${esc(v.fr)}</span></button>`).join('');
 else if(PW.cat==='suggest')grid=suggestPoses().filter(k=>!['pres','vang','ani','fant'].includes(POSES[k].cat)).map(k=>poseTile(k,o,PW.sel)).join('');
 else grid=Object.keys(POSES).filter(k=>POSES[k].cat===PW.cat).map(k=>poseTile(k,o,PW.sel)).join('');
 const big=PW.sel[0]?poseSVG(PW.sel[0],o):(PW.cat==='group'||PW.cat==='trio')&&IA[PW.inter]?groupSVG(PW.inter,n,o):`<svg viewBox="0 0 100 112">${floor}<text x="50" y="60" text-anchor="middle" fill="var(--dim)" font-size="7" font-family="var(--f-body)">Aucune pose choisie</text></svg>`;
 const again=!!$('.posewin');
 const props=(S.props||[]).map(k=>DPROPS[k]?.fr).filter(Boolean);
 openOverlay(`<div class="wl-card posewin${again?' still':''}" role="dialog" aria-modal="true" aria-labelledby="pwT">
  <div class="pwhead"><div><p class="eyebrow">Bibliothèque de poses</p><h2 id="pwT">Sujet ${idx} · ${esc(who)}</h2>${props.length?`<p class="hint">Décor : ${esc(props.join(', '))}. Les poses adaptées sont dans « Suggéré ».</p>`:''}</div><button class="x close" data-overlay-close aria-label="Fermer">${ic('x')}</button></div>
  <div class="pwcats">${cats.map(k=>`<button class="chip${k==='suggest'?' sugg':''}" data-pcat="${k}" aria-pressed="${PW.cat===k}">${ic(PCAT[k].ic)}<span>${PCAT[k].fr}</span></button>`).join('')}</div>
  <div class="pwbody"><div class="pgrid2">${grid||'<p class="hint">Aucune pose dans cette catégorie.</p>'}</div>
   <aside class="pwside"><div class="pbig">${big}</div>
    <span class="lab">Votre sélection (3 max, combinables)</span>
    <div class="psellist">${PW.sel.length?PW.sel.map((k,i)=>`<span class="pselc">${i+1}. ${esc(POSES[k].fr)}<button data-punsel="${k}" aria-label="Retirer">${ic('x')}</button></span>`).join(''):'<span class="hint">Cliquez sur une ou plusieurs poses.</span>'}</div>
    ${n>=2&&s.kind==='person'?`<p class="hint">Groupe : <b>${esc((IA[PW.inter]||{fr:'—'}).fr)}</b></p>`:''}
    <div class="row-btns"><button class="btn ghost" data-pclear>Effacer</button><span class="sp"></span><button class="btn primary" data-pok>${ic('check')}Valider</button></div>
   </aside></div></div>`);
}
