/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= ÉTAT ================= */
const SUBPOS=[[50,50],[38,53],[62,53]];
function newSubject(id,kind,x,y){return {id,kind:kind||'person',x,y,gender:'woman',age:'25-35',origin:'highland',morpho:'average',hair:'braids',outfit:'hoany',expression:'smile',pose:'standing',poses:['standing'],posesSet:false,acc:[],notes:{},animal:'maki',animAct:'look',vehicle:'city',vstate:'new',vcolor:'',fantasy:'dragon',product:'',surface:'wood',desc:''}}
function mkLights(L){return L.map((a,i)=>({id:i+1,type:a[0],role:a[1],x:a[2],y:a[3],z:a[4],power:a[5],kelvin:a[6],gel:a[7]}))}
function defaults(){return {v:2,tab:'decor',view:'z',bg:'foret',bgCat:'nature',madaReg:'tana',notes:{},bgNote:'',time:'golden',weather:'clear',climate:'est',temp:30,mood:'warm',
 lights:mkLights(KITS.rembrandt.L),kit:'rembrandt',kitCat:'portrait',lsel:1,customKits:[],
 camera:{body:'a7r5',lens:'85',ap:2,framing:'medium',angle:'eye',film:'portra',shutter:'normal',x:50,y:86,z:1.6,tilt:0,roll:0,aim:true},
 subjects:[newSubject(1,'person',50,50)],subSel:1,crowd:'none',interact:'side',adv:{},
 render:{model:'gemini',ratio:'4:5',usage:'social',style:'ad'}}}
let S; try{S=JSON.parse(localStorage.getItem('aisary-v2'))}catch(e){}
const HAD_OLD=!!S;
function normalize(X){if(!X||X.v!==2)X=defaults();const d=defaults();for(const k in d)if(X[k]===undefined)X[k]=d[k];
 X.notes=X.notes||{};X.adv=X.adv||{};X.madaReg=X.madaReg||'tana';if(X.bgCat==='mada')X.bgCat='nature';X.subjects.forEach(s=>{s.notes=s.notes||{};s.acc=s.acc||[];if(!Array.isArray(s.poses))s.poses=[typeof POSES!=='undefined'&&POSES[s.pose]?s.pose:'standing']});if(X.tab==='export')X.tab='decor';return X}
S=normalize(S);
let POP=null, bgQ='';
let R={}; try{R=JSON.parse(localStorage.getItem('aisary-refs'))||{}}catch(e){R={}}
function save(){try{localStorage.setItem('aisary-v2',JSON.stringify(S))}catch(e){}if(window.scheduleProjSave)scheduleProjSave()}
function saveRefs(){try{localStorage.setItem('aisary-refs',JSON.stringify(R))}catch(e){}if(window.scheduleProjSave)scheduleProjSave()}

function get(p){const k=p.split('.');let o=S;for(let i=0;i<k.length;i++){if(k[i]==='lights'||k[i]==='subjects'){const id=k[++i];o=S[k[i-1]].find(l=>l.id==id);continue}o=o?.[k[i]]}return o}
function set(p,v){const k=p.split('.');let o=S;for(let i=0;i<k.length-1;i++){if(k[i]==='lights'||k[i]==='subjects'){const id=k[++i];o=S[k[i-1]].find(l=>l.id==id);continue}if(o[k[i]]==null)o[k[i]]={};o=o[k[i]]}o[k[k.length-1]]=v}
const nt=k=>(S.notes[k]||'').trim(), snt=(s,k)=>((s.notes||{})[k]||'').trim();
const withN=(base,n)=>n?(base?base+', '+n:n):base;

/* ================= OUTILS ================= */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ic=n=>n?`<i data-lucide="${n}" class="ic"></i>`:'';
const cap=x=>x?x.charAt(0).toUpperCase()+x.slice(1):'';
const art=w=>/^[aeiou]/i.test(w)?'An':'A';
function kToHex(k){k/=100;let r,g,b;
 if(k<=66){r=255;g=99.47*Math.log(k)-161.12;b=k<=19?0:138.52*Math.log(k-10)-305.04}
 else{r=329.7*Math.pow(k-60,-.1332);g=288.12*Math.pow(k-60,-.0755);b=255}
 const c=x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0');return '#'+c(r)+c(g)+c(b)}
const lightColor=l=>l.type==='flag'?'#4f5f58':(GEL[l.gel]?.hex||kToHex(l.kelvin));
const opts=(obj,cur)=>Object.entries(obj).map(([k,v])=>`<option value="${k}"${k==cur?' selected':''}>${esc(typeof v==='string'?k:v.fr)}</option>`).join('');
const optsG=(g,cur)=>Object.entries(g).map(([n,o])=>`<optgroup label="${esc(n)}">${opts(o,cur)}</optgroup>`).join('');
const chip=(path,k,v)=>`<button class="chip" data-set="${path}" data-val="${k}" aria-pressed="${get(path)==k}">${ic(v.ic)}<span>${esc(v.fr)}</span></button>`;
const chips=(path,obj)=>`<div class="chips">${Object.entries(obj).map(([k,v])=>chip(path,k,v)).join('')}</div>`;
const groups=(path,g)=>Object.entries(g).map(([n,o])=>`<div class="grp"><span class="grpn">${esc(n)}</span>${chips(path,o)}</div>`).join('');
const tiles=(path,obj,draw,cls='')=>`<div class="tiles ${cls}">${Object.entries(obj).map(([k,v])=>`<button class="tile" data-set="${path}" data-val="${k}" aria-pressed="${get(path)==k}"><span class="thumb">${draw(k,v)}</span><span class="tl">${esc(v.fr)}</span></button>`).join('')}</div>`;
let iconT; function refreshIcons(){cancelAnimationFrame(iconT);iconT=requestAnimationFrame(()=>{try{window.lucide&&lucide.createIcons({attrs:{'stroke-width':1.7}})}catch(e){}})}

/* ================= GÉOMÉTRIE ================= */
const KMETA={person:{h:1.75,t:1.5},product:{h:.32,t:.9},animal:{h:.7,t:.45},vehicle:{h:1.5,t:.8},fantasy:{h:2.1,t:1.6},object:{h:.6,t:.6}};
function subH(s){return s.kind==='person'&&(s.gender==='girl'||s.gender==='boy'||+String(s.age).split('-')[0]<13)?1.15:KMETA[s.kind].h}
function target(){const n=S.subjects.length;let x=0,y=0,z=0;S.subjects.forEach(s=>{x+=s.x;y+=s.y;z+=(s.kind==='person'?subH(s)*.88:KMETA[s.kind].t)});return {x:x/n,y:y/n,z:z/n}}
function fovDeg(){const L=LENS[S.camera.lens];let f=L.fov||2*Math.atan(36/(2*L.f))*180/Math.PI;if(L.ana)f*=1.33;return Math.min(f,180)}
function camTilt(){const c=S.camera;if(!c.aim)return c.tilt;const t=target(),d=Math.hypot(t.x-c.x,t.y-c.y)/10;return Math.round(Math.atan2(t.z-c.z,Math.max(d,.05))*180/Math.PI)}
function angleInfo(){const c=S.camera,t=camTilt();let en,fr;
 if(t<=-70){en='top-down overhead view';fr='Zénithale'}
 else if(c.z>=4&&t<-15){en='aerial view from above';fr='Vue aérienne'}
 else if(t<-12){en='high angle looking down';fr='Plongée'}
 else if(c.z<=.3){en='worm’s-eye view from ground level';fr='Ras du sol'}
 else if(t>10){en='low angle looking up';fr='Contre-plongée'}
 else{en='eye-level angle';fr='Hauteur des yeux'}
 if(Math.abs(c.roll)>6){en+=', dutch tilt';fr+=', hollandais'}
 return {en,fr,tilt:t};
}
function lightDir(l){
 const T=target(),c=S.camera, cx=c.x-T.x, cy=c.y-T.y, lx=l.x-T.x, ly=l.y-T.y;
 const cross=cx*ly-cy*lx, dot=cx*lx+cy*ly, a=Math.abs(Math.atan2(cross,dot)*180/Math.PI);
 const sign=a<22||a>158?0:(cross>0?-1:1);
 const side=sign<0?'left':'right', sideFr=sign<0?'gauche':'droite';
 const dist=Math.hypot(lx,ly)/10, elev=Math.atan2(l.z-T.z,Math.max(dist,.05))*180/Math.PI;
 let en,fr;
 if(a<22){en='from the front, near the camera axis';fr='de face'}
 else if(a<67){en=`from camera-${side} at 45 degrees`;fr=`45° ${sideFr}`}
 else if(a<112){en=`from the ${side} side`;fr=`côté ${sideFr}`}
 else if(a<158){en=`from behind on the ${side}`;fr=`arrière ${sideFr}`}
 else{en='from directly behind the subject';fr='derrière'}
 const elEn=elev>60?'from directly above':elev>18?'from above':elev<-12?'from below':'at subject height';
 const near=dist<1.4?'close to the subject':dist>4?'from a distance':'';
 return {en,fr,a,sign,elEn,near};
}

/* ================= SILHOUETTES ================= */
const SHAPES={
 person:{w:36,poi:.1,d:'M0 0a8.5 8.5 0 1 1 0 17a8.5 8.5 0 1 1 0-17zM-5 18L5 18L15 22Q18 24 18 30L17 56L12.5 56L12 36L11 36L10.5 99L2 99L1 60L-1 60L-2 99L-10.5 99L-11 36L-12 36L-12.5 56L-17 56L-18 30Q-18 24 -15 22Z'},
 product:{w:30,poi:.45,d:'M-5 0L5 0L5 20Q14 28 14 40L14 96Q14 100 10 100L-10 100Q-14 100 -14 96L-14 40Q-14 28 -5 20Z'},
 animal:{w:150,poi:.3,d:'M-55 45Q-62 25 -30 22L30 22Q52 22 58 38L68 20Q76 10 86 20L86 34Q72 42 64 50Q58 62 50 64L50 100L40 100L38 66L-30 66L-32 100L-42 100L-44 64Q-60 60 -55 45Z'},
 vehicle:{w:250,poi:.45,d:'M-125 86L-125 62Q-122 50 -104 47L-62 42L-38 16Q-32 10 -22 10L40 10Q52 10 62 20L86 42L112 48Q125 52 125 64L125 86ZM-92 86a14 14 0 1 0 28 0a14 14 0 1 0 -28 0ZM66 86a14 14 0 1 0 28 0a14 14 0 1 0 -28 0Z'},
 fantasy:{w:96,poi:.1,d:'M-14 26Q-50 0 -46 42Q-30 34 -16 42ZM14 26Q50 0 46 42Q30 34 16 42ZM0 0a8.5 8.5 0 1 1 0 17a8.5 8.5 0 1 1 0-17zM-5 18L5 18L15 22Q18 24 18 30L17 56L12.5 56L12 36L11 36L10.5 99L2 99L1 60L-1 60L-2 99L-10.5 99L-11 36L-12 36L-12.5 56L-17 56L-18 30Q-18 24 -15 22Z'},
 object:{w:80,poi:.4,d:'M-40 10Q-40 0 -30 0L30 0Q40 0 40 10L40 100L-40 100Z'},
};

/* ================= VIGNETTES ILLUSTRÉES ================= */
function framingThumb(k,v){const w=44,h=30,s=.8*h/100*v.k,sh=SHAPES.person;let ty=v.k<=1?h*.92-100*s:h*.34-sh.poi*100*s;if(k==='detail')ty=h*.5-60*s;
 return `<svg viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="var(--sky)"/><path d="${sh.d}" transform="translate(${w/2} ${ty}) scale(${s})" fill="var(--fig)"/></svg>`}
function angleThumb(k,v){const gy=27,px=13,head=10,cz=v.z;let cx=33,cy=gy-Math.min(cz,5)*4.6;if(k==='top'){cx=px;cy=2.5}if(k==='aerial'){cx=36;cy=3}
 const rot=k==='dutch'?18:0;
 return `<svg viewBox="0 0 44 30"><line x1="0" y1="${gy}" x2="44" y2="${gy}" stroke="var(--line)" stroke-width=".8"/><path d="${SHAPES.person.d}" transform="translate(${px} ${gy-17}) scale(.17)" fill="var(--fig)"/><line x1="${cx}" y1="${cy}" x2="${px}" y2="${head+(gy-27)}" stroke="var(--accent)" stroke-width=".7" stroke-dasharray="1.5 1"/><rect x="${cx-3}" y="${cy-2}" width="6" height="4" rx="1" fill="var(--fg)" transform="rotate(${rot} ${cx} ${cy})"/></svg>`}
function lensThumb(k,v){let f=v.fov||2*Math.atan(36/(2*v.f))*180/Math.PI;if(v.ana)f*=1.33;f=Math.min(f,180);const a=f/2*Math.PI/180,L=24,cx=22,cy=28;
 const p1=[cx-Math.sin(a)*L,cy-Math.cos(a)*L],p2=[cx+Math.sin(a)*L,cy-Math.cos(a)*L];
 return `<svg viewBox="0 0 44 30"><path d="M${cx} ${cy}L${p1}A${L} ${L} 0 0 1 ${p2}Z" fill="var(--accent)" opacity=".28"/><path d="M${p1}L${cx} ${cy}L${p2}" stroke="var(--accent)" stroke-width=".7" fill="none"/><rect x="${cx-4}" y="${cy-3}" width="8" height="4" rx="1" fill="var(--fg)"/><text x="40" y="8" text-anchor="end" font-size="6" fill="var(--muted)" font-family="var(--f-mono)">${Math.round(f)}°</text></svg>`}
function apertureSvg(ap,size=60){const r=size/2-2,o=2+(r-4)*Math.pow(1.2/ap,.55);let pts=[];for(let i=0;i<7;i++){const a=i/7*Math.PI*2-Math.PI/2;pts.push((size/2+Math.cos(a)*o).toFixed(1)+','+(size/2+Math.sin(a)*o).toFixed(1))}
 return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="#0c0e0d" stroke="var(--line)"/><polygon points="${pts.join(' ')}" fill="var(--accent)" opacity=".85"/></svg>`}
function bokehSvg(ap){const b=ap<=1.8?3.2:ap<=2.8?2.4:ap<=5.6?1.2:.2,dots=[[12,10,'#3dff8f'],[30,7,'#8db6ff'],[48,12,'#a8ffd0'],[22,22,'#ff8a7a'],[52,24,'#3dff8f'],[38,20,'#dee5e2']];
 return `<svg viewBox="0 0 64 34" width="120" height="64"><defs><filter id="bk" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${b}"/></filter></defs><rect width="64" height="34" rx="4" fill="#131715"/><g filter="url(#bk)">${dots.map(d=>`<circle cx="${d[0]}" cy="${d[1]}" r="${2.5+b*.9}" fill="${d[2]}" opacity=".8"/>`).join('')}</g><path d="${SHAPES.person.d}" transform="translate(32 9) scale(.25)" fill="var(--fg)"/></svg>`}
function timeThumb(k,v){const sy=Math.max(4,26-v.sun*.25);
 return `<svg viewBox="0 0 44 30"><defs><linearGradient id="tg${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${v.sky[0]}"/><stop offset="1" stop-color="${v.sky[1]}"/></linearGradient></defs><rect width="44" height="30" fill="url(#tg${k})"/>${v.sun>-5?`<circle cx="30" cy="${sy}" r="4" fill="${v.c}"/>`:v.sun>-50?`<circle cx="31" cy="8" r="3" fill="#eef2f0"/><circle cx="32.5" cy="7" r="2.6" fill="${v.sky[0]}"/>`:`<rect x="16" y="6" width="12" height="10" rx="2" fill="#fff" opacity=".85"/>`}<rect y="23" width="44" height="7" fill="#000" opacity=".35"/></svg>`}
function ratioThumb(r){const [a,b]=r.split(':').map(Number),s=Math.min(34/a,24/b),w=a*s,h=b*s;return `<svg viewBox="0 0 44 30"><rect x="${(44-w)/2}" y="${(30-h)/2}" width="${w}" height="${h}" rx="1.5" fill="none" stroke="var(--fg)" stroke-width="1.2"/></svg>`}
function moodThumb(k,v){return `<svg viewBox="0 0 44 30">${v.p.map((c,i)=>`<rect x="${i*14.66}" width="14.7" height="30" fill="${c}"/>`).join('')}</svg>`}
function kitThumb(L){const T={x:50,y:50};
 const lights=L.map(a=>{const col=a[0]==='flag'?'#4f5f58':(GEL[a[7]]?.hex||kToHex(a[6]));return `<line x1="${a[2]}" y1="${a[3]}" x2="${T.x}" y2="${T.y}" stroke="${col}" stroke-width="1.2" opacity=".55"/><circle cx="${a[2]}" cy="${a[3]}" r="${a[0]==='reflector'||a[0]==='flag'?4:4.6}" fill="${a[0]==='reflector'?'#dee5e2':col}" ${a[0]==='reflector'?'opacity=".7"':''}/>`}).join('');
 return `<svg viewBox="6 6 88 88"><rect x="6" y="6" width="88" height="88" fill="#121514"/><circle cx="50" cy="50" r="22" fill="none" stroke="#28302d" stroke-width=".6"/>${lights}<circle cx="50" cy="50" r="5" fill="#28312d" stroke="#e4e9e7" stroke-width="1.2"/><rect x="45" y="83" width="10" height="7" rx="1.5" fill="#e4e9e7"/></svg>`}

/* ================= ONGLETS & PANNEAUX ================= */
const TABS=[['decor','Décor','image'],['mada','Mada','map'],['ambiance','Ambiance','sun'],['lumiere','Lumières','lightbulb'],['camera','Caméra','camera'],['sujet','Sujets','users'],['rendu','Rendu','frame'],['export','Export','send']];
function renderTabs(){$('#tabs').innerHTML=TABS.map(([id,fr,i])=>`<button role="tab" data-tab="${id}" aria-selected="${S.tab===id}">${ic(i)}<span>${fr}</span></button>`).join('')}

function slot(key,label,icn){const u=R[key];return `<label class="slot${u?' has':''}" data-slot="${key}">${u?`<img src="${u}" alt=""><button class="unslot" data-unslot="${key}" aria-label="Retirer l'image">${ic('x')}</button>`:`${ic(icn||'image-plus')}`}<span>${esc(label)}</span><input type="file" accept="image/*" data-slotin="${key}" hidden></label>`}
function advanced(id,title,inner){return `<details class="adv" data-adv="${id}"${S.adv[id]?' open':''}><summary>${ic('sliders-horizontal')}<span>${esc(title)}</span><span class="badge">${countRefs(id)}</span></summary><div class="advb">${inner}</div></details>`}
function countRefs(id){const pre=id==='decor'?'d.':id==='light'?'l.':id+'.';const n=Object.keys(R).filter(k=>k.startsWith(pre)).length;return n?n+' image'+(n>1?'s':''):'vide'}

function bgGrid(){const q=bgQ.trim().toLowerCase();const list=q?BG.filter(b=>(b.fr+' '+b.en).toLowerCase().includes(q)):BG.filter(b=>b.cat===S.bgCat);
 return list.length?list.map(bgBtn).join(''):`<p class="hint">Aucun décor ne correspond. Décrivez-le dans « Précisions » ci-dessous.</p>`}

function camSliders(pre=''){const c=S.camera,t=camTilt();return `
  <div class="field"><label class="lab" for="${pre}cz">Hauteur caméra <output data-out="camera.z">${c.z.toFixed(2)} m</output></label><input type="range" id="${pre}cz" min="0.1" max="5.5" step="0.05" data-k="camera.z" data-num data-custom value="${c.z}"></div>
  <div class="field"><label class="lab" for="${pre}ct">Inclinaison <output data-out="camera.tilt">${t}°</output></label><input type="range" id="${pre}ct" min="-90" max="45" step="1" data-k="camera.tilt" data-num data-custom value="${t}" ${c.aim?'disabled':''}>
  <label class="check"><input type="checkbox" id="${pre}caim" data-k="camera.aim" data-bool ${c.aim?'checked':''}> Viser automatiquement le sujet</label></div>
  <div class="field"><label class="lab" for="${pre}cr">Roulis <output data-out="camera.roll">${c.roll}°</output></label><input type="range" id="${pre}cr" min="-30" max="30" step="1" data-k="camera.roll" data-num data-custom value="${c.roll}"></div>`}
function lightFields(l,pre=''){return `
  <div class="row2"><div class="field"><label class="lab" for="${pre}lt${l.id}">Type</label><select id="${pre}lt${l.id}" data-k="lights.${l.id}.type" data-rerender>${optsG(LTYPE,l.type)}</select></div>
  <div class="field"><label class="lab" for="${pre}lr${l.id}">Rôle</label><select id="${pre}lr${l.id}" data-k="lights.${l.id}.role" data-rerender>${opts(LROLE,l.role)}</select></div></div>
  <div class="field"><label class="lab" for="${pre}lp${l.id}">Puissance <output data-out="lights.${l.id}.power">${l.power}%</output></label><input type="range" id="${pre}lp${l.id}" min="5" max="100" step="5" data-k="lights.${l.id}.power" data-num value="${l.power}"></div>
  <div class="field"><label class="lab" for="${pre}lk${l.id}">Température <output data-out="lights.${l.id}.kelvin">${l.kelvin} K</output></label><div class="kbar"></div><input type="range" id="${pre}lk${l.id}" min="1800" max="10000" step="100" data-k="lights.${l.id}.kelvin" data-num value="${l.kelvin}"></div>
  <div class="row2"><div class="field"><label class="lab" for="${pre}lg${l.id}">Gélatine</label><select id="${pre}lg${l.id}" data-k="lights.${l.id}.gel">${opts(GEL,l.gel)}</select></div>
  <div class="field"><label class="lab" for="${pre}lz${l.id}">Hauteur <output data-out="lights.${l.id}.z">${l.z.toFixed(1)} m</output></label><input type="range" id="${pre}lz${l.id}" min="0.1" max="5.5" step="0.1" data-k="lights.${l.id}.z" data-num value="${l.z}"></div></div>
  ${note('lights.'+l.id+'.note','Précisez cette lumière : passe à travers un rideau, forme de fenêtre…')}`}
function lightCard(l){const d=lightDir(l),col=lightColor(l),on=S.lsel===l.id;return `
 <div class="light${on?' sel':''}">
  <div class="hd" data-lsel="${l.id}"><span class="dot" style="background:${col};color:${col}"></span>${ic(LT[l.type].ic)}<b>${esc(LT[l.type].fr)}</b><small>${LROLE[l.role].fr} · ${d.fr}</small><span class="sp"></span><small>${l.power}%</small></div>
  ${on?`<div class="bd">${lightFields(l)}<div class="row-btns"><button class="btn small" data-dup="${l.id}">${ic('copy')}Dupliquer</button><button class="btn small ghost danger" data-del="${l.id}">${ic('trash-2')}Retirer</button></div></div>`:''}
 </div>`}
function tempLabel(){const t=S.temp;return t<-20?'Froid':t>20?'Chaud':'Neutre'}
function dofFr(){const a=S.camera.ap;return a<=2?'Faible profondeur de champ, fond très flou.':a<=5.6?'Profondeur de champ moyenne.':'Grande profondeur de champ, tout est net.'}

/* ================= PLATEAU : VUES Z / X / Y ================= */
const GY=56, ZS=10; // vues latérales : sol à y=56, 1 m = 10 unités
const zy=z=>GY-z*ZS;
function bgStrip(x,y,w,h,op){const sw=BGM[S.bg]?.sw||'#333';return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;border-radius:1.5px;background:${sw};opacity:${op}"></div></foreignObject>`}
function crowdDots(){const n={none:0,few:5,medium:12,dense:22}[S.crowd];let o='';for(let i=0;i<n;i++){const x=10+((i*37)%80),y=16+((i*23)%22);o+=`<circle cx="${x}" cy="${y}" r="1.4" fill="#5e7169" opacity=".7"/>`}return o}
function selRing(key,r=4.8){return POP&&POP.key===key?`<circle r="${r}" fill="none" stroke="#e4e9e7" stroke-width=".45" stroke-dasharray="1 1"/>`:''}
function viewZ(){
 const c=S.camera,T=target(),fov=fovDeg()*Math.PI/180,ang=Math.atan2(T.y-c.y,T.x-c.x),R1=26;
 const p1=[c.x+Math.cos(ang-fov/2)*R1,c.y+Math.sin(ang-fov/2)*R1],p2=[c.x+Math.cos(ang+fov/2)*R1,c.y+Math.sin(ang+fov/2)*R1];
 let g='';for(let i=10;i<100;i+=10)g+=`<line x1="${i}" y1="2" x2="${i}" y2="98" stroke="#242b28" stroke-width=".2"/><line x1="2" y1="${i}" x2="98" y2="${i}" stroke="#242b28" stroke-width=".2"/>`;
 let L='';S.lights.forEach(l=>{const col=lightColor(l),a=Math.atan2(T.y-l.y,T.x-l.x),len=Math.hypot(T.x-l.x,T.y-l.y),sp=(LT[l.type].q.includes('hard')?.16:.42)*len*.5;
  const b1=[T.x+Math.cos(a+Math.PI/2)*sp,T.y+Math.sin(a+Math.PI/2)*sp],b2=[T.x-Math.cos(a+Math.PI/2)*sp,T.y-Math.sin(a+Math.PI/2)*sp];
  if(l.type!=='flag')L+=`<polygon points="${l.x},${l.y} ${b1} ${b2}" fill="${col}" opacity="${(.12+l.power/300)*.6}"/>`;
  L+=`<g class="drag" data-drag="l:${l.id}" transform="translate(${l.x} ${l.y})"><circle r="6" fill="transparent"/>${selRing('l:'+l.id)}<g transform="rotate(${a*180/Math.PI})"><rect x="-1.4" y="-3" width="2.4" height="6" rx=".6" fill="${col}"/></g><circle r="1" fill="#131715"/><text y="-5.4" text-anchor="middle" class="svl">${esc(LROLE[l.role].fr)}</text></g>`});
 const subs=S.subjects.map((s,i)=>{const fp=s.kind==='vehicle'?`<rect x="-19" y="-8" width="38" height="16" rx="3" fill="#28312d" stroke="#e4e9e7" stroke-width=".5"/>`:s.kind==='animal'?`<ellipse rx="4.5" ry="2.4" fill="#28312d" stroke="#e4e9e7" stroke-width=".5"/>`:s.kind==='product'||s.kind==='object'?`<rect x="-2.4" y="-2.4" width="4.8" height="4.8" rx=".8" fill="#28312d" stroke="#e4e9e7" stroke-width=".5"/>`:`<circle r="${s.kind==='fantasy'?5:3.4}" fill="#28312d" stroke="#e4e9e7" stroke-width=".5"/><circle cy="-.6" r="1.2" fill="#e4e9e7"/>`;
  return `<g class="drag" data-drag="s:${s.id}" transform="translate(${s.x} ${s.y})"><circle r="6" fill="transparent"/>${selRing('s:'+s.id,6)}${fp}<text y="${s.kind==='vehicle'?12:7.4}" text-anchor="middle" class="svl">${S.subjects.length>1?'Sujet '+(i+1):'Sujet'}</text></g>`}).join('');
 return `<rect x="1" y="1" width="98" height="98" rx="3" fill="#1a1f1d" stroke="#313a36" stroke-width=".3"/>${g}
  ${bgStrip(8,3,84,4.5,.9)}<text x="50" y="11" text-anchor="middle" class="svm">FOND · ${esc((BGM[S.bg]?.fr||'').toUpperCase())}</text>${crowdDots()}
  <polygon points="${c.x},${c.y} ${p1} ${p2}" fill="#e4e9e7" opacity=".05"/><line x1="${c.x}" y1="${c.y}" x2="${T.x}" y2="${T.y}" stroke="#e4e9e7" stroke-width=".25" stroke-dasharray="1 1" opacity=".5"/>
  ${subs}${L}
  <g class="drag" data-drag="cam" transform="translate(${c.x} ${c.y}) rotate(${ang*180/Math.PI+90})"><circle r="6" fill="transparent"/>${selRing('cam')}<rect x="-3.2" y="-1.6" width="6.4" height="4" rx=".8" fill="#e4e9e7"/><rect x="-1.3" y="-3" width="2.6" height="1.6" fill="#e4e9e7"/><circle cy=".4" r="1.2" fill="#131715"/></g>
  <text x="${c.x}" y="${Math.min(97.5,c.y+7)}" text-anchor="middle" class="svm">${LENS[c.lens].f} mm · ${c.z.toFixed(1)} m</text>`;
}
function sideShape(s,hx){const sh=SHAPES[s.kind],hm=subH(s),sc=hm*ZS/100,base=s.kind==='product'?.8:0;
 return `${s.kind==='product'?`<rect x="${hx-4}" y="${zy(.8)}" width="8" height="${.8*ZS}" fill="#28312d" stroke="#4f5f58" stroke-width=".3"/>`:''}<path d="${sh.d}" transform="translate(${hx} ${zy(base+hm)}) scale(${sc})" fill="#38423e" stroke="#e4e9e7" stroke-width="${.5/sc}"/>`}
function viewSide(ax){ // ax 'x' = vue de face (horizontal = x), 'y' = vue de côté (horizontal = profondeur)
 const c=S.camera,T=target(),H=v=>ax==='x'?v.x:v.y;
 let g='';for(let m=0;m<=5;m++)g+=`<line x1="2" y1="${zy(m)}" x2="98" y2="${zy(m)}" stroke="#242b28" stroke-width=".2"/><text x="3" y="${zy(m)-.8}" class="svm" text-anchor="start">${m} m</text>`;
 const bg=ax==='x'?bgStrip(6,4,88,GY-4,.28):bgStrip(2,4,4,GY-4,.9);
 const subs=S.subjects.map(s=>`<g class="drag" data-drag="s:${s.id}">${sideShape(s,H(s))}<rect x="${H(s)-5}" y="${zy(subH(s))}" width="10" height="${subH(s)*ZS}" fill="transparent"/></g>`).join('');
 let L='';S.lights.forEach(l=>{const col=lightColor(l),lx=H(l),ly=zy(l.z);
  L+=`<line x1="${lx}" y1="${ly}" x2="${H(T)}" y2="${zy(T.z)}" stroke="${col}" stroke-width=".35" opacity=".45"/><line x1="${lx}" y1="${ly}" x2="${lx}" y2="${GY}" stroke="#4f5f58" stroke-width=".25" stroke-dasharray=".8 .8"/>
  <g class="drag" data-drag="l:${l.id}" transform="translate(${lx} ${ly})"><circle r="5" fill="transparent"/>${selRing('l:'+l.id,4)}<circle r="2.3" fill="${col}"/><circle r=".8" fill="#131715"/><text y="-3.6" text-anchor="middle" class="svl">${esc(LROLE[l.role].fr)}</text></g>`});
 const cx=H(c),cy=zy(c.z),tilt=camTilt();let cam='';
 if(ax==='y'){const vf=fovDeg()*(+S.render.ratio.split(':')[1]/+S.render.ratio.split(':')[0])*Math.PI/180,t=tilt*Math.PI/180,LL=30;
  const dir=c.y>T.y?-1:1,e1=[cx+dir*Math.cos(t+vf/2)*LL,cy-Math.sin(t+vf/2)*LL],e2=[cx+dir*Math.cos(t-vf/2)*LL,cy-Math.sin(t-vf/2)*LL],ec=[cx+dir*Math.cos(t)*LL*.8,cy-Math.sin(t)*LL*.8];
  cam=`<polygon points="${cx},${cy} ${e1} ${e2}" fill="#e4e9e7" opacity=".06"/><line x1="${cx}" y1="${cy}" x2="${ec[0]}" y2="${ec[1]}" stroke="#3dff8f" stroke-width=".35" stroke-dasharray="1 .8"/>
  <g class="drag" data-drag="cam" transform="translate(${cx} ${cy}) rotate(${dir<0?tilt:-tilt}) scale(${dir<0?-1:1} 1)"><circle r="5" fill="transparent"/>${selRing('cam',4.4)}<rect x="-2.6" y="-1.8" width="4.6" height="3.6" rx=".6" fill="#e4e9e7"/><rect x="2" y="-1.1" width="2" height="2.2" fill="#e4e9e7"/></g>`;
 } else {
  cam=`<g class="drag" data-drag="cam" transform="translate(${cx} ${cy}) rotate(${c.roll})" opacity=".92"><circle r="5" fill="transparent"/>${selRing('cam',4.4)}<rect x="-3" y="-2" width="6" height="4" rx=".7" fill="none" stroke="#e4e9e7" stroke-width=".6"/><circle r="1.1" fill="none" stroke="#e4e9e7" stroke-width=".5"/></g>`;
 }
 return `<rect x="1" y="1" width="98" height="${GY+3}" rx="3" fill="#1a1f1d" stroke="#313a36" stroke-width=".3"/>${bg}${g}
  <rect x="1" y="${GY}" width="98" height="3" fill="#28302d"/>${subs}${L}${cam}
  <text x="${cx}" y="${Math.max(4,cy-4)}" text-anchor="middle" class="svm">${ax==='y'?tilt+'°':c.roll?c.roll+'° roulis':''}</text>
  <text x="97" y="${GY+2.3}" text-anchor="end" class="svm">${ax==='x'?'VUE X · FACE':'VUE Y · CÔTÉ ← fond'}</text>`;
}
function renderStage(){
 const v=S.view;$$('.vbtn').forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===v));
 $('#stagewrap').dataset.mode=v;
 const show={z:v==='z'||v==='all',x:v==='x'||v==='all',y:v==='y'||v==='all'};
 $$('#stagewrap svg').forEach(s=>{s.hidden=!show[s.dataset.view]});
 if(show.z)$('#vz').innerHTML=viewZ();
 if(show.x)$('#vx').innerHTML=viewSide('x');
 if(show.y)$('#vy').innerHTML=viewSide('y');
 const c=S.camera,ai=angleInfo(),dist=Math.hypot(c.x-target().x,c.y-target().y)/10;
 $('#readout').innerHTML=`<span>${ic('camera')}<b>${esc(BODY[c.body].fr)}</b></span><span>Champ <b>${Math.round(fovDeg())}°</b></span><span>Distance <b>${dist.toFixed(1)} m</b></span><span>Hauteur <b>${c.z.toFixed(2)} m</b></span><span>Angle <b>${esc(ai.fr)}</b></span>`;
 refreshIcons();
}

/* glisser / cliquer sur le plateau */
let drag=null;
function svgPt(e,svg){const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse())}
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));
function objOf(key){if(key==='cam')return S.camera;const [t,id]=key.split(':');return (t==='l'?S.lights:S.subjects).find(o=>o.id==id)}
function onDown(e){const g=e.target.closest('[data-drag]');const svg=e.target.closest('svg[data-view]');if(!svg)return;
 if(!g){if(POP){POP=null;renderPop();renderStage()}return}
 drag={key:g.dataset.drag,svg,view:svg.dataset.view,x0:e.clientX,y0:e.clientY,moved:false};svg.setPointerCapture(e.pointerId);e.preventDefault()}
function onMove(e){if(!drag)return;if(!drag.moved&&Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0)<4)return;drag.moved=true;
 const p=svgPt(e,drag.svg),o=objOf(drag.key);if(!o)return;const isSub=drag.key[0]==='s';
 if(drag.view==='z'){o.x=+cl(p.x,3,97).toFixed(1);o.y=+cl(p.y,isSub?14:12,97).toFixed(1)}
 else{const hz=+cl(p.x,3,97).toFixed(1);if(drag.view==='x')o.x=hz;else o.y=cl(hz,isSub?14:12,97);if(!isSub){o.z=+cl((GY-p.y)/ZS,.1,5.5).toFixed(2);if(drag.key==='cam')S.camera.angle='custom'}}
 renderStage();renderPrompt();renderFinder();if(POP)syncPopOutputs()}
function onUp(e){if(!drag)return;const d=drag;drag=null;
 if(!d.moved){const wr=$('#stagewrap').getBoundingClientRect();POP={key:d.key,x:e.clientX-wr.left,y:e.clientY-wr.top};if(d.key[0]==='l'){S.lsel=+d.key.split(':')[1]}if(d.key[0]==='s'){S.subSel=+d.key.split(':')[1]}renderPop();renderStage()}
 else{save();if(S.tab==='lumiere'||S.tab==='camera')renderPanel();if(POP)renderPop()}}

/* mini-menus */
function renderPop(){const el=$('#pop');if(!POP){el.hidden=true;return}
 const o=objOf(POP.key);if(!o){POP=null;el.hidden=true;return}
 let h='';
 if(POP.key==='cam'){const c=S.camera;h=`<div class="pophd">${ic('camera')}<b>Caméra</b><span class="sp"></span><button class="x" data-popclose aria-label="Fermer">${ic('x')}</button></div>
  <div class="field"><label class="lab" for="pcb">Boîtier</label><select id="pcb" data-k="camera.body">${opts(BODY,c.body)}</select></div>
  <div class="row2"><div class="field"><label class="lab" for="pcl">Objectif</label><select id="pcl" data-k="camera.lens">${opts(LENS,c.lens)}</select></div>
  <div class="field"><label class="lab" for="pca">Ouverture</label><select id="pca" data-k="camera.ap" data-num>${APS.map(a=>`<option value="${a}"${a==c.ap?' selected':''}>f/${a}</option>`).join('')}</select></div></div>
  <div class="field"><label class="lab" for="pcf">Valeur de plan</label><select id="pcf" data-k="camera.framing">${opts(FRAMING,c.framing)}</select></div>
  ${camSliders('p')}
  <button class="btn small" data-tab="camera">${ic('panel-left-open')}Menu caméra complet</button>`}
 else if(POP.key[0]==='l'){h=`<div class="pophd"><span class="dot" style="background:${lightColor(o)};color:${lightColor(o)}"></span><b>${esc(LT[o.type].fr)}</b><span class="sp"></span><button class="x" data-popclose aria-label="Fermer">${ic('x')}</button></div>
  ${lightFields(o,'p')}
  <div class="row-btns"><button class="btn small" data-dup="${o.id}">${ic('copy')}Dupliquer</button><button class="btn small ghost danger" data-del="${o.id}">${ic('trash-2')}Retirer</button></div>`}
 else {const i=S.subjects.indexOf(o);h=`<div class="pophd">${ic(KIND[o.kind].ic)}<b>Sujet ${i+1}</b><span class="sp"></span><button class="x" data-popclose aria-label="Fermer">${ic('x')}</button></div>
  <div class="field"><label class="lab" for="psk">Type</label><select id="psk" data-k="subjects.${o.id}.kind" data-rerender>${opts(KIND,o.kind)}</select></div>
  ${o.kind==='person'?`<div class="row2"><div class="field"><label class="lab" for="pse">Expression</label><select id="pse" data-k="subjects.${o.id}.expression">${opts(EXPR,o.expression)}</select></div><div class="field"><span class="lab">Pose</span><button class="btn small" data-poses="${o.id}">${ic('person-standing')}${esc(poseSummary(o))}</button></div></div>
  <div class="field"><label class="lab" for="pso">Tenue</label><select id="pso" data-k="subjects.${o.id}.outfit">${optsG(OUTFIT,o.outfit)}</select></div>`:''}
  ${o.kind==='product'?`<div class="field"><label class="lab" for="psr">Produit</label><input type="text" id="psr" data-k="subjects.${o.id}.product" value="${esc(o.product)}"></div>`:''}
  <div class="row-btns"><button class="btn small" data-tab="sujet">${ic('panel-left-open')}Menu sujet complet</button>${S.subjects.length>1?`<button class="btn small ghost danger" data-subdel="${o.id}">${ic('trash-2')}Retirer</button>`:''}</div>`}
 el.innerHTML=h;el.hidden=false;
 const wr=$('#stagewrap').getBoundingClientRect(),pw=Math.min(290,wr.width-16);el.style.width=pw+'px';
 let x=POP.x+14,y=POP.y-30;if(x+pw>wr.width-8)x=POP.x-pw-14;if(x<8)x=8;
 const ph=el.offsetHeight;if(y+ph>wr.height-8)y=wr.height-ph-8;if(y<8)y=8;el.style.left=x+'px';el.style.top=y+'px';
 refreshIcons();
}
function syncPopOutputs(){$$('#pop [data-out]').forEach(o=>{const k=o.dataset.out,v=get(k);if(k==='camera.z'||k.endsWith('.z'))o.textContent=(+v).toFixed(k==='camera.z'?2:1)+' m'});$$('#pop input[type=range][data-k$=".z"]').forEach(i=>i.value=get(i.dataset.k))}

/* ================= VISEUR ================= */
function renderFinder(fid='#finder',cid='#finderCap',pre='f'){const fEl=$(fid);
 const [ra,rb]=S.render.ratio.split(':').map(Number),W=100,H=Math.round(100*rb/ra*10)/10,c=S.camera,T=target();
 const fr=FRAMING[c.framing],tilt=camTilt(),fov=fovDeg()*Math.PI/180;
 const bl=(c.ap<=1.8?4:c.ap<=2.8?3:c.ap<=5.6?1.5:.3)*(fr.k>2?1.3:1)*(LENS[c.lens].f>=85?1.2:1);
 const studio=BGM[S.bg]?.cat==='studio';
 let hy=H*(.56+cl(tilt,-60,45)/90*.6);hy=cl(hy,-H,H*1.6);
 // projection
 const fx=T.x-c.x,fy=T.y-c.y,fl=Math.hypot(fx,fy)||1,f=[fx/fl,fy/fl],r=[-f[1],f[0]];
 const prim=S.subjects[0];const pd=Math.max(.5,((prim.x-c.x)*f[0]+(prim.y-c.y)*f[1]));
 const pm=.8*H/subH(prim)*fr.k;
 const ground=fr.k<=1?H*(c.framing==='xwide'?.78:c.framing==='wide'?.84:.92):H*.34+(subH(prim)*(1-SHAPES[prim.kind].poi))*pm;
 const key=S.lights.find(l=>l.role==='key'&&l.type!=='flag')||S.lights.find(l=>l.type!=='flag');
 const kd=key?lightDir(key):null,kc=key?lightColor(key):'#ccc';
 const rim=S.lights.find(l=>l.type!=='flag'&&(l.role==='rim'||lightDir(l).a>115));
 const g1=kd&&kd.sign<0?0:1;
 const subs=S.subjects.map((s,i)=>{const rel=[s.x-c.x,s.y-c.y],dp=Math.max(.3,rel[0]*f[0]+rel[1]*f[1]),lat=rel[0]*r[0]+rel[1]*r[1];
  const a=Math.atan2(lat,dp),sx=W/2+(a/(fov/2))*(W/2),k=pd/dp,hpx=subH(s)*pm*k,sc=hpx/100,gy=hy+(ground-hy)*k;
  const sh=SHAPES[s.kind];
  return {dp,svg:`<path d="${sh.d}" transform="translate(${sx.toFixed(1)} ${(gy-hpx).toFixed(1)}) scale(${sc.toFixed(3)})" fill="url(#${pre}g)" ${rim?`stroke="${lightColor(rim)}" stroke-opacity=".9" stroke-width="${(1.1/sc).toFixed(2)}"`:''}/>`}}).sort((a,b)=>b.dp-a.dp).map(o=>o.svg).join('');
 const n={none:0,few:5,medium:11,dense:20}[S.crowd];let crowd='';
 for(let i=0;i<n;i++){const x=((i*37+11)%100),hh=H*(.09+((i*7)%5)/60)*(fr.k>2?1.8:1),y=hy+H*.06;crowd+=`<path d="${SHAPES.person.d}" transform="translate(${x} ${y-hh}) scale(${hh/100})" fill="#1a201d" opacity=".75"/>`}
 const tt=TIME[S.time];
 const night=S.time==='night'?.5:S.time==='blue'?.28:0;
 const tint=S.temp>0?`rgba(255,150,60,${(S.temp/100*.16).toFixed(3)})`:`rgba(80,140,255,${(-S.temp/100*.16).toFixed(3)})`;
 const sw=BGM[S.bg]?.sw||'#333';
 fEl.setAttribute('viewBox',`0 0 ${W} ${H}`);
 fEl.innerHTML=`<defs><linearGradient id="${pre}g" x1="${g1}" y1="0" x2="${1-g1}" y2="0"><stop offset="0" stop-color="${kd&&kd.a<112?kc:'#28302d'}" stop-opacity="${kd&&kd.a<112?.85:1}"/><stop offset="${kd&&kd.sign===0?1:.55}" stop-color="#38433e"/><stop offset="1" stop-color="#151a18"/></linearGradient>
  <filter id="${pre}b" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${(bl*.25).toFixed(2)}"/></filter></defs>
  <g transform="rotate(${c.roll} ${W/2} ${H/2})"><g transform="translate(${W/2} ${H/2}) scale(${c.roll?1.25:1}) translate(${-W/2} ${-H/2})">
  <foreignObject x="-6" y="-6" width="${W+12}" height="${H+12}"><div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;background:${sw};filter:blur(${bl}px)"></div></foreignObject>
  ${studio?'':`<rect x="-10" y="${hy}" width="${W+20}" height="${H*2}" fill="#000" opacity=".22"/><line x1="-10" y1="${hy}" x2="${W+10}" y2="${hy}" stroke="#fff" stroke-opacity=".12" stroke-width=".3"/>`}
  <g filter="url(#${pre}b)">${crowd}</g>${subs}</g></g>
  <rect width="${W}" height="${H}" fill="${tint}"/>${night?`<rect width="${W}" height="${H}" fill="#0b0e0d" opacity="${night}"/>`:''}
  ${tt.sun>-5&&tt.sun<20&&!studio?`<rect width="${W}" height="${H}" fill="${tt.c}" opacity=".12"/>`:''}
  <g stroke="#fff" stroke-opacity=".22" stroke-width=".25"><line x1="${W/3}" y1="0" x2="${W/3}" y2="${H}"/><line x1="${W*2/3}" y1="0" x2="${W*2/3}" y2="${H}"/><line x1="0" y1="${H/3}" x2="${W}" y2="${H/3}"/><line x1="0" y1="${H*2/3}" x2="${W}" y2="${H*2/3}"/></g>`;
 $(cid).innerHTML=`<span>${LENS[c.lens].f} mm · f/${c.ap} · ${S.render.ratio}</span><span>${esc(fr.fr)} · ${esc(angleInfo().fr)}</span>`;
}

/* ================= PROMPT ================= */
function subjDesc(s){
 if(s.kind==='person'){const g=GENDER[s.gender].en,age=AGE[s.age]||'';
  const acc=(s.acc||[]).includes('none')?'no accessories, no jewelry':(s.acc||[]).map(k=>ACCESS[k].en).join(', ');
  const ov=overrides(s);
  const outfit=ov.outfit&&!s.keepOutfit?[hasRef(s,['top','bottom','shoes'])?'wearing exactly the clothing shown in the reference images':'',snt(s,'outfit')].filter(Boolean).join(', '):withN(OUTFIT_ALL[s.outfit]?.en||'',snt(s,'outfit'));
  const hair=ov.hair&&!s.keepHair?[hasRef(s,['hairR'])?'with the hairstyle shown in the reference image':'',snt(s,'hair')].filter(Boolean).join(', '):withN(HAIR[s.hair].en,snt(s,'hair'));
  const pose=ov.pose&&!s.posesSet?[hasRef(s,['poseR'])?'in the pose shown in the reference image':'',snt(s,'pose')].filter(Boolean).join(', '):withN(poseEn(s),snt(s,'pose'));
  return [`a ${g}, ${age}, ${ORIGIN[s.origin].en}`,MORPHO[s.morpho].en,snt(s,'id'),hair,outfit,acc,snt(s,'acc'),withN(EXPR[s.expression].en,snt(s,'expr')),pose].filter(Boolean).join(', ').replace(/ +/g,' ')}
 if(s.kind==='product')return [`${s.product||'the product'} ${SURFACE[s.surface].en}`,snt(s,'prod'),snt(s,'surf'),poseEn(s),snt(s,'pose')].filter(Boolean).join(', ');
 if(s.kind==='animal')return [`a ${ANIMAL[s.animal].en} ${ANIMACT[s.animAct].en}`,snt(s,'anim'),snt(s,'act'),poseEn(s),snt(s,'pose')].filter(Boolean).join(', ');
 if(s.kind==='vehicle')return [`a ${s.vcolor?s.vcolor+' ':''}${VEHICLE[s.vehicle].en}, ${VSTATE[s.vstate].en}`,snt(s,'veh'),snt(s,'vst'),poseEn(s),snt(s,'pose')].filter(Boolean).join(', ');
 if(s.kind==='fantasy')return [`a ${FANTASY[s.fantasy].en}`,snt(s,'fan'),poseEn(s),snt(s,'pose')].filter(Boolean).join(', ');
 return snt(s,'obj')||(s.desc?'':'a decorative object');
}
const OUTFIT_ALL=flat(OUTFIT);
const hasRef=(s,keys)=>keys.some(k=>R[`s${s.id}.${k}`]);
function overrides(s){return {outfit:hasRef(s,['top','bottom','shoes'])||!!snt(s,'outfit'),hair:hasRef(s,['hairR'])||!!snt(s,'hair'),pose:hasRef(s,['poseR'])||!!snt(s,'pose')}}
function validPoses(s){const allowed=s.kind==='person'?null:{product:'pres',object:'pres',vehicle:'vang',animal:'ani',fantasy:'fant'}[s.kind];
 return (s.poses||[]).filter(k=>POSES[k]&&(allowed?POSES[k].cat===allowed:!['pres','vang','ani','fant'].includes(POSES[k].cat)))}
function subjPos(s){const c=S.camera,T=target(),fx=T.x-c.x,fy=T.y-c.y,fl=Math.hypot(fx,fy)||1,f=[fx/fl,fy/fl],r=[-f[1],f[0]];
 const rel=[s.x-c.x,s.y-c.y],dp=rel[0]*f[0]+rel[1]*f[1],lat=rel[0]*r[0]+rel[1]*r[1],ref=fl;
 const side=lat<-4?'on the left':lat>4?'on the right':'in the center';const depth=dp>ref*1.15?', in the background':dp<ref*.85?', in the foreground':'';
 return {en:side+depth,fr:(lat<-4?'à gauche':lat>4?'à droite':'au centre')+(dp>ref*1.15?', au fond':dp<ref*.85?', devant':'')}}
function refList(){const out=[];
 DECORSLOTS.forEach(d=>{if(R['d.'+d[0]])out.push({key:'d.'+d[0],en:d[3],fr:'Décor · '+d[1],file:'decor_'+d[1]})});
 if(R['l.ref'])out.push({key:'l.ref',en:'lighting reference',fr:'Référence lumière',file:'lumiere_reference'});
 S.subjects.forEach((s,i)=>REFSLOTS[s.kind].forEach(r=>{const k=`s${s.id}.${r[0]}`;if(R[k])out.push({key:k,en:`subject ${i+1}, ${REFLABEL_EN[r[0]]}`,fr:`Sujet ${i+1} · ${r[1]}`,file:`sujet${i+1}_${r[1]}`})}));
 return out}
function parts(){
 const c=S.camera,r=S.render,P={},fr=FRAMING[c.framing].en,n=S.subjects.length;
 const withDesc=s=>[subjDesc(s),s.desc.trim()].filter(Boolean).join(', ');
 if(n===1){const s=S.subjects[0];P.subject=s.kind==='product'?`A ${fr} product shot of ${withDesc(s)}`:`${art(fr)} ${fr} of ${withDesc(s)}`}
 else P.subject=`${art(fr)} ${fr} of ${n} subjects ${withN(INTERACT[S.interact].en,nt('interact'))}: `+S.subjects.map(s=>`${subjPos(s).en}, ${withDesc(s)}`).join('; ');
 if(S.crowd!=='none'||nt('crowd'))P.subject+=`, ${withN(CROWD[S.crowd].en,nt('crowd'))}`;
 const bg=BGM[S.bg];P.setting=`set in ${bg.en}${S.bgNote.trim()?', '+S.bgNote.trim():''}`;
 P.time=[withN(TIME[S.time].en,nt('time')),withN(WEATHER[S.weather].en,nt('weather')),withN(CLIMATE[S.climate].en,nt('climate'))].filter(Boolean).join(', ');
 P.lights=S.lights.map(l=>{const d=lightDir(l),t=LT[l.type],g=GEL[l.gel];
  if(l.type==='flag')return `a black flag ${d.en} for negative fill, deepening the shadows`;
  const col=g.hex?`${g.en}`:(l.kelvin<=3600?`warm ${l.kelvin}K`:l.kelvin>=6200?`cool ${l.kelvin}K`:`neutral ${l.kelvin}K`);
  const pw=l.power>=80?'strong':l.power<=35?'subtle':'';
  return withN([pw,`${t.q} ${col} ${LROLE[l.role].en} from ${art(t.en).toLowerCase()} ${t.en}`,d.en,d.elEn,d.near].filter(Boolean).join(' ').replace(/ +/g,' '),(l.note||'').trim())});
 if(nt('light'))P.lights.push('overall: '+nt('light'));
 const dof=c.ap<=2?'shallow depth of field with creamy bokeh':c.ap<=5.6?'moderate depth of field':'deep focus, everything sharp';
 const ai=angleInfo();
 P.camera=[withN(`shot on ${BODY[c.body].en}`,nt('body'))+` with a ${LENS[c.lens].en} lens at f/${c.ap}`,nt('lens'),nt('framing'),withN(ai.en,nt('angle')),`camera about ${c.z.toFixed(1)} m above the ground`,dof,SHUTTER[c.shutter].en].filter(Boolean).join(', ');
 const grade=S.temp<-20?'cool color grade':S.temp>20?'warm color grade':'natural neutral color balance';
 P.look=[withN(MOOD[S.mood].en,nt('mood')),FILM[c.film].en,nt('film'),grade].filter(Boolean).join(', ');
 P.style=[STYLE[r.style].en,nt('style'),USAGE[r.usage].en,nt('usage')].filter(Boolean).join(', ');
 return P;
}
const NEG='blurry, low resolution, distorted hands, extra fingers, deformed face, watermark, text, logo artifacts, oversaturated, plastic skin, cartoon';
function hasFrench(){const t=[S.bgNote,...Object.values(S.notes),...S.lights.map(l=>l.note||''),...S.subjects.flatMap(s=>[s.desc,s.product,s.vcolor,...Object.values(s.notes||{})])].join(' ');return t.trim().length>0}
function buildPrompt(names,model){
 const P=parts(),mk=model||S.render.model,m=MODELS[mk],r=S.render,refs=refList();
 if(m.kind==='natural'){
  let t=`${P.subject}, ${P.setting}, ${P.time}.\n\nLighting: ${P.lights.join('; ')}.\n\n${cap(P.camera)}. ${cap(P.look)}.\n\n${cap(P.style)}.`;
  if(mk!=='flux')t+=` Aspect ratio ${r.ratio}.`;
  t+=' Avoid text, watermarks and distorted anatomy.';
  if(hasFrench())t+=' Some details are written in French: interpret them accurately.';
  if(refs.length)t+=`\n\nReference images (attached in this order): ${refs.map((x,i)=>`[${i+1}] ${names&&names[i]?names[i]+' = ':''}${x.en}`).join('; ')}. Reproduce faces, clothing, products and set elements from these references faithfully.`;
  return {main:t,neg:null,refs};
 }
 if(m.kind==='mj')return {main:[P.subject,P.setting,P.time,...P.lights,P.camera,P.look,P.style].join(', ')+` --ar ${r.ratio} --style raw --no text, watermark, deformed hands`,neg:null,refs};
 return {main:[P.style,P.subject,P.setting,P.time,...P.lights,P.camera,P.look,'masterpiece, best quality, 8k'].join(', '),neg:NEG,refs};
}
function renderPrompt(){
 const r=S.render,{main,neg,refs}=buildPrompt(),c=S.camera,m=MODELS[r.model];
 $('#prompt').innerHTML=`
  <div class="field"><span class="lab">Modèle de génération</span>
   <div class="models">${Object.entries(MODELS).map(([k,v])=>`<button class="model" data-set="render.model" data-val="${k}" aria-pressed="${r.model===k}"><b>${v.n}</b><small>${v.s}</small></button>`).join('')}</div></div>
  <div class="field"><div class="meta"><span>EN · ${main.split(/\s+/).length} mots</span><button class="btn small primary" id="copy">${ic('copy')}Copier le prompt</button></div>
   <div class="promptbox" id="pmain">${esc(main)}</div></div>
  ${neg?`<div class="field"><div class="meta"><span>PROMPT NÉGATIF</span><button class="btn small" id="copyneg">${ic('copy')}Copier</button></div><div class="promptbox neg" id="pneg">${esc(neg)}</div></div>`:''}
  ${refs.length?`<div class="field"><span class="lab">Images à joindre (${refs.length})</span><div class="refstrip">${refs.map((x,i)=>`<figure><img src="${R[x.key]}" alt=""><figcaption>${i+1}</figcaption></figure>`).join('')}</div>
   ${m.refs?'':`<p class="hint">${r.model==='mj'?'Midjourney : ajoutez-les avec --cref (personnage) et --sref (style).':'Stable Diffusion : utilisez IP-Adapter ou ControlNet pour ces images.'}</p>`}</div>`:''}
  <div class="field"><span class="lab">Fiche de scène</span>
  <dl class="fiche">
   <dt>Décor</dt><dd>${esc(BGM[S.bg].fr)}</dd>
   <dt>Moment</dt><dd>${esc(TIME[S.time].fr)} · ${esc(WEATHER[S.weather].fr)}</dd>
   <dt>Sujets</dt><dd>${S.subjects.map((s,i)=>`${i+1}. ${esc(KIND[s.kind].fr)}${S.subjects.length>1?' ('+subjPos(s).fr+')':''}`).join('<br>')}${S.crowd!=='none'?'<br>+ '+esc(CROWD[S.crowd].fr):''}</dd>
   <dt>Lumières</dt><dd>${S.lights.map(l=>`${esc(LT[l.type].fr)} (${lightDir(l).fr})`).join(', ')}</dd>
   <dt>Caméra</dt><dd>${esc(BODY[c.body].fr)} · ${LENS[c.lens].f} mm · f/${c.ap}</dd>
   <dt>Plan</dt><dd>${esc(FRAMING[c.framing].fr)} · ${esc(angleInfo().fr)} · ${c.z.toFixed(1)} m</dd>
   <dt>Sortie</dt><dd>${r.ratio} · ${esc(USAGE[r.usage].fr)}</dd>
  </dl></div>
  <div class="soon">${ic('wand-sparkles')}<span>Générer l'image directement ici</span><span class="sp"></span><span class="tag">Étape 2</span></div>`;
 refreshIcons();
}

/* ================= ACTIONS ================= */
function toast(t){const el=$('#toast');el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,1800)}
async function copyEl(id){const el=$(id),txt=el.textContent;try{await navigator.clipboard.writeText(txt);toast('Prompt copié')}catch(e){const rg=document.createRange();rg.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(rg);toast('Texte sélectionné, faites Cmd/Ctrl + C')}}
function lightsRefresh(){renderStage();renderPrompt();renderFinder()}
function all(){renderTabs();renderPanel();renderStage();renderPrompt();renderFinder();renderPop();save()}
function applyAngle(k){const a=ANGLE[k],c=S.camera,T=target();c.angle=k;c.z=a.z;c.roll=a.roll;
 if(a.tilt===null){c.aim=true}else{c.aim=false;c.tilt=a.tilt}
 if(k==='top'){c.x=T.x;c.y=+(T.y+1.5).toFixed(1)}
 else if(k==='aerial'){c.x=T.x;c.y=cl(T.y+40,14,97)}
 else if(Math.hypot(c.x-T.x,c.y-T.y)<14){c.x=T.x;c.y=cl(T.y+36,14,97)}}
function setSubjects(n){while(S.subjects.length<n){const id=Math.max(...S.subjects.map(s=>s.id))+1,[x,y]=SUBPOS[S.subjects.length];const ns=newSubject(id,'person',x,y);if(S.subjects.length===1){ns.gender='man';ns.outfit='casual'}S.subjects.push(ns)}
 while(S.subjects.length>n){const s=S.subjects.pop();Object.keys(R).filter(k=>k.startsWith('s'+s.id+'.')).forEach(k=>delete R[k])}
 if(!S.subjects.find(s=>s.id===S.subSel))S.subSel=S.subjects[0].id;saveRefs()}
function readImage(file,key){if(!file||!file.type.startsWith('image/'))return;const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>{const m=640,s=Math.min(1,m/Math.max(img.width,img.height)),cv=document.createElement('canvas');cv.width=Math.round(img.width*s);cv.height=Math.round(img.height*s);cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);R[key]=cv.toDataURL('image/jpeg',.82);saveRefs();renderPanel();renderPrompt();toast('Image ajoutée')};img.src=fr.result};fr.readAsDataURL(file)}

document.addEventListener('click',e=>{
 const t=e.target.closest('button,[data-lsel]');if(!t)return;const d=t.dataset;
 if(d.unslot){e.preventDefault();delete R[d.unslot];saveRefs();renderPanel();renderPrompt();return}
 if(d.tab==='export'){POP=null;showScreen('export');return}
 if(d.tab){if(SCREEN!=='editor')showScreen('editor');if(d.tab!==S.tab)bgQ='';S.tab=d.tab;if(t.closest('#pop'))POP=null;all();return}
 if(d.view){S.view=d.view;POP=null;renderPop();renderStage();save();return}
 if(d.popclose!==undefined){POP=null;renderPop();renderStage();renderPanel();return}
 if(d.set){if(d.set==='camera.angle')applyAngle(d.val);else set(d.set,d.val);if(d.set==='bgCat'||d.set==='madaReg'){bgQ=''}
  if(/^subjects\.\d+\.kind$/.test(d.set)&&POP)renderPop();all();return}
 if(d.toggle){let arr=get(d.toggle)||[];const i=arr.indexOf(d.val);if(i<0){if(d.val==='none')arr=[];else arr=arr.filter(x=>x!=='none');arr.push(d.val)}else arr.splice(i,1);set(d.toggle,arr);all();return}
 if(d.kit){const k=S.customKits.find(x=>x.id===d.kit)||KITS[d.kit];S.lights=mkLights(k.L);S.kit=d.kit;S.lsel=1;POP=null;all();toast('Kit « '+k.fr+' » appliqué');return}
 if(d.kdel){S.customKits=S.customKits.filter(k=>k.id!==d.kdel);all();return}
 if(d.lsel){S.lsel=S.lsel==+d.lsel?0:+d.lsel;renderPanel();save();return}
 if(d.del){S.lights=S.lights.filter(l=>l.id!=d.del);if(POP&&POP.key==='l:'+d.del)POP=null;all();return}
 if(d.dup){const l=S.lights.find(x=>x.id==d.dup),id=Math.max(0,...S.lights.map(x=>x.id))+1;S.lights.push({...l,id,x:cl(l.x+8,3,97),y:cl(l.y-6,12,97)});S.lsel=id;all();return}
 if(d.nsub){setSubjects(+d.nsub);POP=null;all();return}
 if(d.subsel){S.subSel=+d.subsel;renderPanel();save();return}
 if(d.subdel){S.subjects=S.subjects.filter(s=>s.id!=d.subdel);Object.keys(R).filter(k=>k.startsWith('s'+d.subdel+'.')).forEach(k=>delete R[k]);saveRefs();S.subSel=S.subjects[0].id;POP=null;all();return}
 if(t.id==='addLight'){const id=Math.max(0,...S.lights.map(l=>l.id))+1,ty=$('#addType').value;
  S.lights.push({id,type:ty,role:S.lights.length?'accent':'key',x:+(30+Math.random()*40).toFixed(1),y:+(22+Math.random()*16).toFixed(1),z:ty==='sun'||ty==='moon'||ty==='sky'?4.5:1.8,power:60,kelvin:ty==='fire'?1900:ty==='practical'?2800:5600,gel:'none'});S.lsel=id;S.kit=null;all();return}
 if(t.id==='saveKit'){const n=$('#kitName').value.trim()||'Mon kit '+(S.customKits.length+1);S.customKits.push({id:'c'+Date.now(),fr:n,d:S.lights.length+' lumières',L:S.lights.map(l=>[l.type,l.role,l.x,l.y,l.z,l.power,l.kelvin,l.gel])});S.kitCat='mine';all();toast('Kit « '+n+' » enregistré');return}
 if(t.id==='copy'){copyEl('#pmain');return}
 if(t.id==='copyneg'){copyEl('#pneg');return}
 if(t.id==='reset'){S=defaults();R={};saveRefs();POP=null;bgQ='';all();toast('Scène réinitialisée')}
});
function onField(e){
 const el=e.target;
 if(el.id==='bgQ'||el.id==='mgQ'){bgQ=el.value;const q=bgQ.trim().toLowerCase();
  if(el.id==='mgQ'){const list=q?BG.filter(b=>b.cat==='mada'&&(b.fr+' '+b.en).toLowerCase().includes(q)):BG.filter(b=>b.reg===S.madaReg);$('#bgGrid').innerHTML=list.length?list.map(bgBtn).join(''):'<p class="hint">Aucun décor ne correspond.</p>';$$('[data-set="madaReg"]').forEach(b=>b.setAttribute('aria-pressed',S.madaReg===b.dataset.val&&!bgQ))}
  else{$('#bgGrid').innerHTML=bgGrid();$$('[data-set="bgCat"]').forEach(b=>b.setAttribute('aria-pressed',S.bgCat===b.dataset.val&&!bgQ))}refreshIcons();return}
 if(el.dataset.slotin){if(e.type==='change')readImage(el.files[0],el.dataset.slotin);return}
 if(el.dataset.ap!==undefined){S.camera.ap=APS[+el.value];$$('[data-out="camera.ap"]').forEach(o=>o.textContent='f/'+S.camera.ap);$$('[data-out="dof"]').forEach(o=>o.textContent=dofFr());$('#apIris').innerHTML=apertureSvg(S.camera.ap,56);$('#apBokeh').innerHTML=bokehSvg(S.camera.ap);lightsRefresh();save();return}
 const k=el.dataset.k;if(!k)return;
 if(el.tagName==='SELECT'&&e.type==='input')return; // traité sur change
 const v=el.dataset.bool!==undefined?el.checked:el.dataset.num!==undefined?+el.value:el.value;
 set(k,v);
 if(el.dataset.custom!==undefined)S.camera.angle='custom';
 if(k==='camera.aim'&&!v)S.camera.tilt=camTilt();
 const fmt=(k,v)=>k==='temp'?tempLabel():k.endsWith('kelvin')?v+' K':k.endsWith('power')?v+'%':k==='camera.z'?(+v).toFixed(2)+' m':k.endsWith('.z')?(+v).toFixed(1)+' m':k==='camera.tilt'||k==='camera.roll'?v+'°':v;
 $$(`[data-out="${k}"]`).forEach(o=>o.textContent=fmt(k,v));
 if(k.startsWith('camera.')){$$('[data-out="camera.tilt"]').forEach(o=>o.textContent=camTilt()+'°');$$('input[data-k="camera.tilt"]').forEach(i=>{i.value=camTilt();i.disabled=S.camera.aim})}
 if(el.dataset.rerender!==undefined||k==='camera.aim'){if(el.closest('#pop'))renderPop();else renderPanel()}
 else if(el.closest('#pop')&&S.tab!=='decor')renderPanelSoft();
 lightsRefresh();save();
}
let softT;function renderPanelSoft(){clearTimeout(softT);softT=setTimeout(()=>{if(!document.activeElement||!document.activeElement.closest('#panel'))renderPanel()},250)}
document.addEventListener('input',onField);
document.addEventListener('change',onField);
document.addEventListener('toggle',e=>{const a=e.target.dataset&&e.target.dataset.adv;if(a){S.adv[a]=e.target.open;save()}},true);
document.addEventListener('dragover',e=>{const s=e.target.closest('.slot');if(s){e.preventDefault();s.classList.add('over')}});
document.addEventListener('dragleave',e=>{const s=e.target.closest('.slot');if(s)s.classList.remove('over')});
document.addEventListener('drop',e=>{const s=e.target.closest('.slot');if(!s)return;e.preventDefault();s.classList.remove('over');readImage(e.dataTransfer.files[0],s.dataset.slot)});
const sw=$('#stagewrap');sw.addEventListener('pointerdown',onDown);sw.addEventListener('pointermove',onMove);sw.addEventListener('pointerup',onUp);sw.addEventListener('pointercancel',()=>{drag=null});
window.addEventListener('resize',()=>{if(POP)renderPop()});

