/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= BIBLIOTHÈQUE DE POSES ILLUSTRÉE ================= */
/* Silhouettes dessinées à partir d'un squelette : angles en degrés.
   Membres : 0 = vers le bas, 90 = vers la droite, -90 = vers la gauche, 180 = vers le haut.
   Torse : 0 = droit, 90 = couché vers la droite. */
const rad=a=>a*Math.PI/180;
const segP=(p,a,l)=>[p[0]+Math.sin(rad(a))*l,p[1]+Math.cos(rad(a))*l];
const B0={t:0,hd:0,al:[-8,-4],ar:[8,4],ll:[-5,1],lr:[5,-1]};
const mk=o=>Object.assign({},B0,o);
const mir=P=>({...P,t:-(P.t||0),hd:-(P.hd||0),al:[-P.ar[0],-P.ar[1]],ar:[-P.al[0],-P.al[1]],ll:[-P.lr[0],-P.lr[1]],lr:[-P.ll[0],-P.ll[1]],mir:!P.mir});
const f1=n=>n.toFixed(1);
const ln=(a,b,w,c,o=1)=>`<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${c}" stroke-width="${f1(w)}" stroke-linecap="round" opacity="${o}"/>`;
const bottleAt=(p,rot=0,s=1)=>`<g transform="translate(${f1(p[0])} ${f1(p[1])}) rotate(${rot}) scale(${s})"><rect x="-3.2" y="-9" width="6.4" height="13" rx="2" fill="var(--accent)"/><rect x="-1.4" y="-12.5" width="2.8" height="4" rx=".8" fill="var(--accent)"/></g>`;
const PROPS={
 ball:(f)=>`<circle cx="${f1(f.footR[0]+5)}" cy="${f1(f.footR[1]-2)}" r="5" fill="none" stroke="var(--accent)" stroke-width="1.6"/>`,
 ballhead:(f)=>`<circle cx="${f1(f.head[0]+4)}" cy="${f1(f.head[1]-12)}" r="5" fill="none" stroke="var(--accent)" stroke-width="1.6"/>`,
 ballhand:(f)=>`<circle cx="${f1((f.handL[0]+f.handR[0])/2)}" cy="${f1((f.handL[1]+f.handR[1])/2-5)}" r="5.5" fill="none" stroke="var(--accent)" stroke-width="1.6"/>`,
 balllow:(f)=>`<circle cx="${f1(f.footR[0]+8)}" cy="${f1(f.footR[1]-1)}" r="4.5" fill="none" stroke="var(--accent)" stroke-width="1.6"/>`,
 bottleR:(f)=>bottleAt(f.handR,0),bottleRt:(f)=>bottleAt(f.handR,-60),bottleL:(f)=>bottleAt(f.handL,0),
 bottleC:(f)=>bottleAt([(f.handL[0]+f.handR[0])/2,(f.handL[1]+f.handR[1])/2],0,1.1),
 phone:(f)=>`<rect x="${f1(f.handR[0]-2)}" y="${f1(f.handR[1]-4)}" width="4" height="7" rx="1" fill="var(--accent)"/>`,
 cup:(f)=>`<path d="M${f1(f.handR[0]-3)} ${f1(f.handR[1]-4)}h6l-1 7h-4z" fill="var(--accent)"/>`,
 food:(f)=>`<circle cx="${f1(f.handR[0])}" cy="${f1(f.handR[1]-2)}" r="3" fill="var(--accent)"/>`,
 bag:(f)=>`<rect x="${f1(f.handR[0]-5)}" y="${f1(f.handR[1])}" width="10" height="9" rx="2" fill="var(--accent)"/>`,
 racket:(f)=>`<line x1="${f1(f.handR[0])}" y1="${f1(f.handR[1])}" x2="${f1(f.handR[0]+9)}" y2="${f1(f.handR[1]-6)}" stroke="var(--accent)" stroke-width="1.4"/><ellipse cx="${f1(f.handR[0]+13)}" cy="${f1(f.handR[1]-9)}" rx="5" ry="6.5" fill="none" stroke="var(--accent)" stroke-width="1.4"/>`,
 barbell:(f)=>`<line x1="${f1(f.handL[0]-10)}" y1="${f1(f.handL[1])}" x2="${f1(f.handR[0]+10)}" y2="${f1(f.handR[1])}" stroke="var(--accent)" stroke-width="2"/><rect x="${f1(f.handL[0]-14)}" y="${f1(f.handL[1]-6)}" width="4" height="12" rx="1" fill="var(--accent)"/><rect x="${f1(f.handR[0]+10)}" y="${f1(f.handR[1]-6)}" width="4" height="12" rx="1" fill="var(--accent)"/>`,
 chair:(f)=>`<path d="M${f1(f.hip[0]-10)} ${f1(f.hip[1]+4)}h22M${f1(f.hip[0]-8)} ${f1(f.hip[1]+4)}v24M${f1(f.hip[0]+10)} ${f1(f.hip[1]+4)}v24M${f1(f.hip[0]-10)} ${f1(f.hip[1]+4)}v-28" stroke="var(--line2)" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
 sofa:(f)=>`<path d="M${f1(f.hip[0]-22)} ${f1(f.hip[1]+5)}h44v14h-44zM${f1(f.hip[0]-22)} ${f1(f.hip[1]-14)}v20" stroke="var(--line2)" stroke-width="2" fill="none"/>`,
 wall:(f)=>`<rect x="10" y="20" width="6" height="88" fill="var(--line2)"/>`,
 stairs:()=>`<path d="M40 108h20v-8h20v-8h20" stroke="var(--line2)" stroke-width="2" fill="none"/>`,
 bike:(f)=>`<circle cx="${f1(f.hip[0]-16)}" cy="96" r="11" fill="none" stroke="var(--line2)" stroke-width="2"/><circle cx="${f1(f.hip[0]+22)}" cy="96" r="11" fill="none" stroke="var(--line2)" stroke-width="2"/><path d="M${f1(f.hip[0]-16)} 96L${f1(f.hip[0])} ${f1(f.hip[1]+2)}L${f1(f.hip[0]+22)} 96M${f1(f.hip[0]+14)} ${f1(f.hip[1]-6)}L${f1(f.hip[0]+22)} 96" stroke="var(--line2)" stroke-width="2" fill="none"/>`,
 moto:(f)=>`<circle cx="${f1(f.hip[0]-18)}" cy="96" r="11" fill="var(--line2)"/><circle cx="${f1(f.hip[0]+24)}" cy="96" r="11" fill="var(--line2)"/><path d="M${f1(f.hip[0]-22)} ${f1(f.hip[1]+4)}h42l8 12h-56z" fill="var(--line2)"/>`,
 eye:()=>`<g transform="translate(86 14)" stroke="var(--accent)" stroke-width="1.3" fill="none"><path d="M-7 0Q0 -6 7 0Q0 6 -7 0Z"/><circle r="2"/></g>`,
 back:()=>`<path d="M84 12l6 6-6 6" stroke="var(--accent)" stroke-width="1.5" fill="none"/>`,
};
function figure(P,o={}){
 const s=o.s||1,col=o.c||'var(--fig)',H=P.h?[...P.h]:[50,108-38*s];if(o.dx)H[0]+=o.dx;if(o.dy)H[1]+=o.dy;
 const t=P.t||0,S=[H[0]+Math.sin(rad(t))*29*s,H[1]-Math.cos(rad(t))*29*s],th=t+(P.hd||0),Hd=[S[0]+Math.sin(rad(th))*11*s,S[1]-Math.cos(rad(th))*11*s];
 const pp=[Math.cos(rad(t)),Math.sin(rad(t))],off=(q,k)=>[q[0]+pp[0]*k*s,q[1]+pp[1]*k*s];
 const SL=off(S,-7),SR=off(S,7),HL=off(H,-4),HR=off(H,4);
 const eL=segP(SL,P.al[0],14*s),hL=segP(eL,P.al[1],13*s),eR=segP(SR,P.ar[0],14*s),hR=segP(eR,P.ar[1],13*s);
 const kL=segP(HL,P.ll[0],19*s),fL=segP(kL,P.ll[1],19*s),kR=segP(HR,P.lr[0],19*s),fR=segP(kR,P.lr[1],19*s);
 const back=o.back||'var(--fig2)';let g='';
 if(o.female)g+=`<ellipse cx="${f1(Hd[0])}" cy="${f1(Hd[1]+4*s)}" rx="${f1(7.6*s)}" ry="${f1(10*s)}" fill="${col}" opacity=".85"/>`;
 g+=ln(SL,eL,6*s,back)+ln(eL,hL,5*s,back)+ln(HL,kL,8.5*s,back)+ln(kL,fL,7*s,back);
 g+=`<path d="M${f1(HL[0])} ${f1(HL[1])}L${f1(HR[0])} ${f1(HR[1])}L${f1(SR[0])} ${f1(SR[1])}L${f1(SL[0])} ${f1(SL[1])}Z" fill="${col}" stroke="${col}" stroke-width="${f1(7*s)}" stroke-linejoin="round"/>`;
 g+=ln(S,Hd,5*s,col)+ln(HR,kR,8.5*s,col)+ln(kR,fR,7*s,col);
 g+=`<circle cx="${f1(Hd[0])}" cy="${f1(Hd[1])}" r="${f1(7.4*s)}" fill="${col}"/>`;
 if(o.female)g+=`<path d="M${f1(H[0]-7*s)} ${f1(H[1]-2*s)}L${f1(H[0]+7*s)} ${f1(H[1]-2*s)}L${f1(H[0]+10*s)} ${f1(H[1]+9*s)}L${f1(H[0]-10*s)} ${f1(H[1]+9*s)}Z" fill="${col}" opacity=".0"/>`;
 g+=ln(SR,eR,6*s,col)+ln(eR,hR,5*s,col);
 if(o.wings)g=`<path d="M${f1(S[0])} ${f1(S[1]+4)}Q${f1(S[0]-34)} ${f1(S[1]-(o.wingsUp?34:10))} ${f1(S[0]-30)} ${f1(S[1]+22)}Q${f1(S[0]-14)} ${f1(S[1]+12)} ${f1(S[0])} ${f1(S[1]+14)}ZM${f1(S[0])} ${f1(S[1]+4)}Q${f1(S[0]+34)} ${f1(S[1]-(o.wingsUp?34:10))} ${f1(S[0]+30)} ${f1(S[1]+22)}Q${f1(S[0]+14)} ${f1(S[1]+12)} ${f1(S[0])} ${f1(S[1]+14)}Z" fill="var(--accent)" opacity=".35"/>`+g;
 return {svg:g,head:Hd,hip:H,sh:S,handL:hL,handR:hR,footL:fL,footR:fR};
}
const carSide=(x=50,y=96,s=1,flip=false)=>`<g transform="translate(${x} ${y}) scale(${flip?-s:s} ${s})"><path d="M-46 0v-12q1-6 9-7l15-2 10-11q3-3 7-3h22q6 0 10 4l9 10 10 2q5 2 5 7v12z" fill="var(--line2)"/><path d="M-20 -21l8-9h12v9zM4 -21v-9h10l8 9z" fill="var(--bg)" opacity=".8"/><circle cx="-28" r="7" fill="var(--bg)" stroke="var(--line2)" stroke-width="2"/><circle cx="30" r="7" fill="var(--bg)" stroke="var(--line2)" stroke-width="2"/></g>`;
const floor=`<line x1="4" y1="108.5" x2="96" y2="108.5" stroke="var(--line)" stroke-width="1"/>`;
function poseSVG(id,o={}){
 const p=POSES[id];if(!p)return '';const female=o.female,s=o.child?.72:1;let body='';
 if(p.draw)body=p.draw(o);
 else{const f=figure(p.P,{female,s});body=(p.pre?p.pre(f):'')+f.svg+(p.props||[]).map(k=>PROPS[k](f)).join('')}
 return `<svg viewBox="0 0 100 112" aria-hidden="true">${floor}${body}</svg>`}
/* ---------- groupes ---------- */
function grp(list,o){return list.map(([P,dx,sc,fem,props])=>{const f=figure(P,{dx,s:sc||.82,female:fem??o.female});return f.svg+(props||[]).map(k=>PROPS[k](f)).join('')}).join('')}
const ST=mk({}),FACE_R=mk({ar:[40,20]}),FACE_L=mir(FACE_R);
/* ---------- mains (gros plans) ---------- */
function handSVG(kind){const arm=(x1,y1,x2,y2)=>ln([x1,y1],[x2,y2],13,'var(--fig)');
 const palm=(x,y,r=0)=>`<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-9" y="-8" width="18" height="16" rx="6" fill="var(--fig)"/>${[-6,-2,2,6].map(dx=>`<rect x="${dx-1.8}" y="-17" width="3.6" height="11" rx="1.8" fill="var(--fig)"/>`).join('')}<rect x="7" y="-6" width="3.6" height="10" rx="1.8" fill="var(--fig)" transform="rotate(35 9 0)"/></g>`;
 if(kind==='grip')return arm(20,108,44,64)+bottleAt([52,52],0,2.2)+`<rect x="40" y="48" width="20" height="14" rx="6" fill="var(--fig)"/>`;
 if(kind==='pinch')return arm(16,108,46,66)+`<path d="M46 66q8-14 18-16M46 66q12-4 18-12" stroke="var(--fig)" stroke-width="5" stroke-linecap="round" fill="none"/>`+bottleAt([68,50],0,.9);
 if(kind==='offer')return arm(14,104,44,76)+palm(54,70,70)+bottleAt([58,52],0,1.6);
 if(kind==='twoh')return arm(10,108,38,66)+arm(90,108,62,66)+bottleAt([50,52],0,2.2)+`<rect x="34" y="52" width="10" height="16" rx="4" fill="var(--fig)"/><rect x="56" y="52" width="10" height="16" rx="4" fill="var(--fig)"/>`;
 if(kind==='pour')return arm(20,108,40,56)+bottleAt([52,44],120,2)+`<path d="M66 60q2 10 0 20" stroke="var(--accent)" stroke-width="2"/><path d="M58 82h18l-3 20h-12z" fill="none" stroke="var(--accent)" stroke-width="1.6"/>`;
 if(kind==='apply')return arm(14,108,40,70)+palm(48,62,40)+`<path d="M70 30q-10 18 -2 40" stroke="var(--fig2)" stroke-width="16" stroke-linecap="round" fill="none"/>`+`<circle cx="56" cy="54" r="3" fill="var(--accent)"/>`;
 if(kind==='thumb')return arm(20,108,46,70)+`<rect x="38" y="56" width="20" height="18" rx="6" fill="var(--fig)"/><rect x="44" y="38" width="6" height="20" rx="3" fill="var(--fig)"/>`+bottleAt([72,62],0,1.4);
 if(kind==='phoneh')return arm(20,108,46,70)+`<rect x="42" y="30" width="22" height="40" rx="4" fill="var(--accent)"/><rect x="38" y="56" width="10" height="16" rx="4" fill="var(--fig)"/>`;
 if(kind==='card')return arm(20,108,46,70)+`<rect x="44" y="40" width="34" height="22" rx="3" fill="var(--accent)" transform="rotate(-12 60 50)"/><rect x="38" y="54" width="14" height="14" rx="5" fill="var(--fig)"/>`;
 return ''}
/* ---------- produits, véhicules, animaux ---------- */
function prodSVG(kind){const b=(x,y,r=0,s=2.4)=>bottleAt([x,y],r,s);
 if(kind==='upright')return b(50,86);
 if(kind==='three')return `<g transform="translate(50 86) skewY(-8)">${bottleAt([0,0],0,2.4)}</g><path d="M58 64v26" stroke="var(--bg)" stroke-width="2" opacity=".5"/>`;
 if(kind==='lying')return b(50,98,90);
 if(kind==='float')return b(50,64,-12)+`<ellipse cx="50" cy="106" rx="16" ry="2.5" fill="var(--line2)"/>`;
 if(kind==='splash')return b(50,82)+[[30,60],[72,56],[24,80],[78,78],[40,48],[64,44]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="var(--accent)" opacity=".6"/>`).join('')+`<path d="M24 100q26-14 52 0" stroke="var(--accent)" stroke-width="2" fill="none" opacity=".6"/>`;
 if(kind==='group')return b(32,92,0,1.8)+b(50,88,0,2.4)+b(68,92,0,1.8);
 if(kind==='podium')return b(50,72)+`<rect x="30" y="88" width="40" height="20" rx="2" fill="var(--line2)"/>`;
 if(kind==='hand')return handSVG('grip');
 if(kind==='topdown')return `<circle cx="50" cy="60" r="16" fill="var(--accent)" opacity=".85"/><circle cx="26" cy="36" r="7" fill="var(--fig2)"/><circle cx="76" cy="40" r="9" fill="var(--fig2)"/><rect x="66" y="74" width="16" height="10" rx="2" fill="var(--fig2)"/><circle cx="28" cy="82" r="6" fill="var(--fig2)"/>`;
 if(kind==='ingred')return b(50,84)+[[26,96,6],[74,96,7],[20,74,4],[80,72,5],[34,104,3]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="var(--fig2)"/>`).join('');
 if(kind==='pourp')return handSVG('pour');
 if(kind==='open')return `<path d="M32 70h36v38h-36z" fill="var(--line2)"/><path d="M32 70l-8-14h36l8 14M68 70l10-12" stroke="var(--line2)" stroke-width="2" fill="none"/>`+b(50,66,0,1.6);
 return b(50,86)}
function vehSVG(kind){
 if(kind==='vside')return carSide(50,96,1);
 if(kind==='v34f')return `<g transform="translate(50 96) scale(.95 1) skewY(-6)">${carSide(0,0,1)}</g><path d="M80 86l10-4v10l-10 2z" fill="var(--accent)" opacity=".7"/>`;
 if(kind==='v34r')return `<g transform="translate(50 96) scale(.95 1) skewY(6)">${carSide(0,0,1,true)}</g><path d="M20 86l-10-4v10l10 2z" fill="#ff5a5a" opacity=".7"/>`;
 if(kind==='vfront')return `<path d="M22 98v-16q2-8 10-10l6-12q2-4 7-4h10q5 0 7 4l6 12q8 2 10 10v16z" fill="var(--line2)"/><rect x="36" y="58" width="28" height="12" rx="2" fill="var(--bg)" opacity=".8"/><circle cx="30" cy="84" r="4" fill="var(--accent)"/><circle cx="70" cy="84" r="4" fill="var(--accent)"/><rect x="22" y="98" width="10" height="8" rx="2" fill="var(--line2)"/><rect x="68" y="98" width="10" height="8" rx="2" fill="var(--line2)"/>`;
 if(kind==='vmove')return carSide(56,96,1)+[60,72,84].map((y,i)=>`<line x1="${2+i*4}" y1="${y}" x2="${22+i*4}" y2="${y}" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`).join('');
 if(kind==='vturn')return `<g transform="rotate(-10 50 96)">${carSide(50,96,1)}</g><path d="M10 106q40-16 84-4" stroke="var(--line)" stroke-width="2" fill="none" stroke-dasharray="4 3"/>`;
 if(kind==='vnight')return `<rect x="0" y="0" width="100" height="112" fill="#050807" opacity=".5"/>${carSide(44,96,1)}<path d="M92 84l8-10v26z" fill="var(--accent)" opacity=".35"/><circle cx="90" cy="86" r="2.5" fill="var(--accent)"/>`;
 if(kind==='vdoor')return carSide(50,96,1)+`<path d="M8 72l14-2v22l-12 4z" fill="var(--line2)" stroke="var(--bg)" stroke-width="1"/>`;
 if(kind==='vtop')return `<rect x="30" y="16" width="40" height="84" rx="14" fill="var(--line2)"/><rect x="36" y="34" width="28" height="18" rx="4" fill="var(--bg)" opacity=".8"/><rect x="36" y="66" width="28" height="14" rx="4" fill="var(--bg)" opacity=".8"/>`;
 if(kind==='vdust')return carSide(58,96,1)+[[14,96,8],[24,90,6],[8,86,5],[30,98,5]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#b85a3a" opacity=".45"/>`).join('');
 return carSide()}
function aniSVG(kind){const A=SHAPES.animal.d,base=(x,y,sx,sy,r=0)=>`<path d="${A}" transform="translate(${x} ${y}) rotate(${r}) scale(${sx} ${sy})" fill="var(--fig)"/>`;
 if(kind==='astand')return base(48,62,.42,.46);
 if(kind==='asit')return base(48,70,.34,.4,-24);
 if(kind==='alie')return base(50,86,.44,.24);
 if(kind==='awalk')return base(46,62,.42,.46,-3);
 if(kind==='arun')return base(46,58,.44,.4,-8)+`<line x1="4" y1="70" x2="18" y2="70" stroke="var(--accent)" stroke-width="1.5"/><line x1="2" y1="80" x2="14" y2="80" stroke="var(--accent)" stroke-width="1.5"/>`;
 if(kind==='ajump')return base(48,40,.4,.4,-18)+`<ellipse cx="50" cy="106" rx="16" ry="2.5" fill="var(--line2)"/>`;
 if(kind==='alook')return base(48,62,.42,.46)+PROPS.eye();
 if(kind==='aeat')return base(48,66,.42,.46,10)+`<circle cx="84" cy="102" r="4" fill="var(--accent)"/>`;
 if(kind==='asleep')return base(50,88,.42,.22)+`<text x="74" y="70" fill="var(--accent)" font-size="10" font-family="var(--f-mono)">z z</text>`;
 if(kind==='aperch')return `<path d="M6 82q44-8 88 2" stroke="var(--line2)" stroke-width="5" fill="none"/>`+base(48,44,.36,.4);
 return base(48,62,.42,.46)}

/* ---------- catalogue ---------- */
const POSES={};
function addP(cat,id,fr,en,P,props,extra){POSES[id]=Object.assign({cat,fr,en,P,props},extra||{})}
// Debout & basique
addP('base','standing','Debout','standing naturally',mk({}));
addP('base','lookcam','Regard caméra','looking directly into the lens',mk({}),['eye']);
addP('base','crossed','Bras croisés','arms crossed',mk({al:[-14,80],ar:[14,-80]}));
addP('base','hips','Mains sur les hanches','hands on hips',mk({al:[-48,40],ar:[48,-40]}));
addP('base','pockets','Mains dans les poches','hands in pockets',mk({al:[-10,10],ar:[10,-10]}));
addP('base','wave','Salue de la main','waving at the camera',mk({ar:[150,178]}));
addP('base','victory','Bras levés','both arms raised in victory',mk({al:[-158,-176],ar:[158,176]}));
addP('base','point','Pointe du doigt','pointing forward',mk({ar:[92,92]}));
addP('base','thumbs','Pouce levé','giving a thumbs up',mk({ar:[40,165]}));
addP('base','lean','Appuyé au mur','leaning against a wall',mk({t:-9,h:[30,72],ll:[-12,2],lr:[18,-6],al:[-30,-10]}),['wall']);
addP('base','back','De dos','seen from behind',mk({}),['back']);
addP('base','shy','Mains jointes devant','hands clasped in front',mk({al:[-6,60],ar:[6,-60]}));
// Marche & mouvement
addP('move','walking','Marche','walking naturally',mk({t:3,al:[22,12],ar:[-22,-16],ll:[-24,-6],lr:[22,30]}));
addP('move','walkcam','Marche vers la caméra','walking toward the camera',mk({al:[14,8],ar:[-14,-8],ll:[-10,0],lr:[12,20]}),['eye']);
addP('move','running','Court','running dynamically',mk({t:14,al:[40,120],ar:[-50,-115],ll:[-42,-100],lr:[62,4]}));
addP('move','jump','Saute','jumping in mid-air',mk({h:[50,58],al:[-150,-172],ar:[150,172],ll:[-32,24],lr:[34,-24]}));
addP('move','jumpjoy','Saut de joie','jumping for joy, knees tucked',mk({h:[50,56],al:[-130,-160],ar:[130,160],ll:[-70,20],lr:[70,-20]}));
addP('move','stairs','Monte des escaliers','climbing stairs',mk({t:5,h:[48,72],ll:[-10,0],lr:[60,0]}),['stairs']);
addP('move','turn','Se retourne','turning around mid-step',mk({t:-4,hd:-20,al:[-20,-10],ar:[25,10],ll:[-18,0],lr:[18,20]}));
// Assis & allongé
addP('sit','sitting','Assis sur une chaise','sitting on a chair',mk({h:[44,80],ll:[82,2],lr:[78,6],al:[30,70],ar:[24,78]}),['chair']);
addP('sit','sitfloor','Assis en tailleur','sitting cross-legged on the floor',mk({h:[50,98],ll:[-76,72],lr:[76,-72],al:[-30,30],ar:[30,-30]}));
addP('sit','sitknees','Assis, genoux repliés','sitting with knees drawn up',mk({h:[42,100],ll:[118,-10],lr:[112,0],al:[60,110],ar:[56,112]}));
addP('sit','crouch','Accroupi','crouching',mk({h:[50,88],ll:[-98,8],lr:[98,-8],al:[-30,60],ar:[30,-60]}));
addP('sit','kneel','À genoux','kneeling',mk({h:[48,84],ll:[0,92],lr:[6,92]}));
addP('sit','lying','Allongé','lying down',mk({t:90,h:[38,98],ll:[-90,-90],lr:[-94,-88],al:[-80,-90],ar:[-100,-90],hd:0}));
addP('sit','sofa','Détendu dans un canapé','relaxing on a sofa',mk({t:-14,h:[46,84],ll:[72,12],lr:[82,0],al:[-60,-90],ar:[40,80]}),['sofa']);
addP('sit','thinker','Assis, menton dans la main','sitting, chin resting on the hand',mk({h:[44,80],ll:[82,2],lr:[78,6],al:[30,70],ar:[60,175]}),['chair']);
// Sport
addP('sport','lift','Soulève des poids','lifting weights overhead',mk({al:[-140,-175],ar:[140,175],ll:[-14,0],lr:[14,0]}),['barbell']);
addP('sport','yoga','Posture de l’arbre (yoga)','holding the yoga tree pose',mk({al:[-176,176],ar:[176,-176],lr:[72,-112]}));
addP('sport','boxing','Garde de boxe','in a boxing guard',mk({t:6,al:[55,155],ar:[72,165],ll:[-16,0],lr:[22,0]}));
addP('sport','basket','Tir au panier','shooting a basketball',mk({al:[-170,176],ar:[170,-176],h:[50,66],ll:[-6,10],lr:[6,-10]}),['ballhand']);
addP('sport','tennis','Coup de tennis','hitting a tennis forehand',mk({t:10,ar:[100,110],al:[-40,-20],ll:[-24,0],lr:[30,0]}),['racket']);
addP('sport','bike','À vélo','riding a bicycle',mk({t:30,h:[50,72],ll:[60,10],lr:[30,30],al:[60,70],ar:[64,74]}),['bike']);
addP('sport','stretch','Étirement','stretching',mk({t:-22,al:[-150,-160],ar:[160,170],ll:[-12,0],lr:[14,0]}));
addP('sport','rugby','Course balle en main (rugby)','running with a rugby ball',mk({t:14,al:[40,120],ar:[60,150],ll:[-42,-100],lr:[62,4]}),['bottleR']);
// Football
addP('foot','kick','Frappe le ballon','kicking a football',mk({t:-10,al:[-62,-30],ar:[44,10],ll:[-6,0],lr:[72,60]}),['ball']);
addP('foot','dribble','Conduite de balle','dribbling the ball',mk({t:12,al:[40,100],ar:[-40,-90],ll:[-30,-60],lr:[40,10]}),['balllow']);
addP('foot','header','Coup de tête','heading the ball',mk({h:[50,64],t:8,hd:-18,al:[-60,-20],ar:[60,20],ll:[-20,40],lr:[20,-30]}),['ballhead']);
addP('foot','goalie','Arrêt du gardien','goalkeeper diving to save',mk({t:68,h:[44,82],al:[158,170],ar:[150,162],ll:[-30,-10],lr:[-62,0]}));
addP('foot','celebrate','Célébration de but','celebrating a goal',mk({h:[50,80],al:[-150,-170],ar:[150,170],ll:[0,92],lr:[80,0]}));
addP('foot','juggle','Jongle','juggling the ball',mk({al:[-40,-20],ar:[40,20],lr:[62,-30]}),['ball']);
// Danse
addP('dance','dance','Danse énergique','dancing energetically',mk({t:6,al:[-130,-160],ar:[62,20],lr:[40,10]}));
addP('dance','hira','Danse traditionnelle (hira gasy, salegy)','dancing a traditional Malagasy dance',mk({al:[-100,-60],ar:[100,60],ll:[-10,30],lr:[20,-20]}));
addP('dance','spin','Tourne sur soi','spinning with arms open',mk({al:[-90,-92],ar:[90,92],lr:[-30,60]}));
addP('dance','hiphop','Hip-hop','striking a hip-hop pose',mk({h:[50,76],al:[-80,170],ar:[50,-60],ll:[-40,10],lr:[40,-10]}));
// Mode & éditorial
addP('mode','hip','Main sur la hanche','hand on hip, fashion pose',mk({al:[-48,40],ar:[10,6],ll:[-4,2],lr:[14,-6]}));
addP('mode','shoulder','Regard par-dessus l’épaule','looking over the shoulder',mk({hd:24}),['back']);
addP('mode','face','Main au visage','hand gently touching the face',mk({ar:[22,172]}));
addP('mode','runway','Défilé','walking like on a runway',mk({ll:[-6,12],lr:[10,-4],al:[10,4],ar:[-10,-4]}));
addP('mode','leanfwd','Penché en avant','leaning forward toward the camera',mk({t:24,al:[30,10],ar:[40,20]}));
addP('mode','jacket','Veste sur l’épaule','jacket slung over the shoulder',mk({ar:[160,-150],al:[-12,8]}));
// Avec un produit
addP('prod','holding','Tient le produit près du visage','holding the product near the face',mk({ar:[22,165]}),['bottleR']);
addP('prod','show','Montre le produit à la caméra','showing the product to the camera',mk({ar:[72,96]}),['bottleR']);
addP('prod','drink','Boit','drinking from the product',mk({hd:-16,ar:[30,165]}),['bottleRt']);
addP('prod','twohands','Présente à deux mains','presenting the product with both hands',mk({al:[-26,118],ar:[26,-118]}),['bottleC']);
addP('prod','pointprod','Pointe le produit','pointing at the product',mk({al:[-30,122],ar:[64,82]}),['bottleL']);
addP('prod','eat','Mange avec plaisir','eating with delight',mk({ar:[26,168]}),['food']);
addP('prod','phone','Utilise son smartphone','using a smartphone',mk({hd:14,ar:[30,152]}),['phone']);
addP('prod','selfie','Fait un selfie','taking a selfie',mk({ar:[122,152]}),['phone']);
addP('prod','call','Au téléphone','talking on the phone',mk({ar:[16,176]}),['phone']);
addP('prod','bag','Porte un sac','carrying a shopping bag',mk({ar:[6,0]}),['bag']);
addP('prod','cup','Tasse à la main','holding a cup',mk({ar:[26,152]}),['cup']);
// Mains en gros plan
[['grip','Main tenant le produit','close-up of a hand holding the product'],['pinch','Doigts pinçant un petit produit','close-up of fingers pinching a small product'],['offer','Main ouverte qui présente','close-up of an open hand presenting the product'],
 ['twoh','Deux mains autour du produit','close-up of two hands holding the product'],['pour','Verse le produit','close-up of a hand pouring the product into a glass'],['apply','Applique une crème','close-up of a hand applying cream to the skin'],
 ['thumb','Pouce levé avec produit','close-up of a thumbs up next to the product'],['phoneh','Main tenant un smartphone','close-up of a hand holding a smartphone'],['card','Main tenant une carte','close-up of a hand holding a card']]
 .forEach(([id,fr,en])=>addP('hands','h_'+id,fr,en,null,null,{draw:()=>handSVG(id)}));
// Avec un véhicule
const winClip=`<clipPath id="carwin"><rect x="28" y="63" width="46" height="13"/></clipPath>`;
const inCarFig=(o,x,P)=>carSide(50,96,1)+winClip+`<g clip-path="url(#carwin)">${figure(P,{s:.62,female:o.female,dx:0}).svg.replace(/var\(--fig2\)/g,'var(--fig)')}</g>`;
addP('veh','drive','Au volant','driving the car, hands on the wheel',null,null,{draw:o=>inCarFig(o,0,mk({h:[42,94],al:[70,80],ar:[74,90]}))});
addP('veh','passenger','Passager','sitting in the passenger seat',null,null,{draw:o=>inCarFig(o,0,mk({h:[62,94],al:[20,60],ar:[30,70]}))});
addP('veh','leancar','Adossé à la voiture','leaning against the car',null,null,{draw:o=>carSide(40,96,.9)+figure(mk({t:-8,h:[78,72],al:[-40,-20],ar:[30,-60],lr:[-14,4]}),{female:o.female,s:.92}).svg});
addP('veh','opendoor','Ouvre la portière','opening the car door',null,null,{draw:o=>carSide(56,96,.9)+figure(mk({h:[22,72],ar:[80,70]}),{female:o.female,s:.92}).svg+`<path d="M30 70l12-2v22l-10 4z" fill="var(--line2)"/>`});
addP('veh','hood','Assis sur le capot','sitting on the car hood',null,null,{draw:o=>carSide(44,96,.9)+figure(mk({h:[76,80],ll:[80,6],lr:[74,10],al:[-40,-10],ar:[40,10]}),{female:o.female,s:.85}).svg});
addP('veh','window','Accoudé à la fenêtre','leaning out of the car window',null,null,{draw:o=>inCarFig(o,0,mk({h:[56,94],al:[30,60],ar:[30,60]}))+ln([62,72],[80,70],4,'var(--fig)')});
addP('veh','moto','Sur une moto','riding a motorcycle',mk({t:24,h:[50,76],ll:[70,10],lr:[50,20],al:[60,80],ar:[64,84]}),['moto']);
addP('veh','roofload','Charge la galerie du taxi-brousse','loading luggage onto the roof rack',null,null,{draw:o=>carSide(40,96,.9)+figure(mk({h:[80,72],al:[-150,-170],ar:[-140,-165]}),{female:o.female,s:.92}).svg+`<rect x="22" y="52" width="26" height="8" rx="2" fill="var(--accent)" opacity=".7"/>`});
// Produit seul
[['upright','Debout, de face','standing upright, front facing the camera'],['three','Trois-quarts','shown at a three-quarter angle'],['lying','Couché','lying on its side'],['float','En lévitation','floating in mid-air with a soft shadow below'],
 ['splash','Éclaboussure','with a dynamic liquid splash around it'],['group','Gamme / groupe','as part of a group with matching products'],['podium','Sur un podium','displayed on a podium'],['hand','Tenu en main','held in a hand'],
 ['topdown','Vue de dessus (flat lay)','arranged in a top-down flat lay'],['ingred','Entouré d’ingrédients','surrounded by its ingredients'],['pourp','Versé dans un verre','being poured into a glass'],['open','Packaging ouvert','with its packaging opened']]
 .forEach(([id,fr,en])=>addP('pres','p_'+id,fr,en,null,null,{draw:()=>prodSVG(id)}));
// Véhicule seul
[['v34f','Trois-quarts avant','shown in a three-quarter front view'],['vside','Profil','shown in a clean side profile'],['v34r','Trois-quarts arrière','shown in a three-quarter rear view'],['vfront','De face','shown head-on from the front'],
 ['vmove','En mouvement','driving fast with motion blur'],['vturn','En virage','taking a curve'],['vnight','De nuit, phares allumés','at night with headlights on'],['vdoor','Portières ouvertes','with doors open'],
 ['vtop','Vue de dessus','seen from directly above'],['vdust','Sur piste, poussière','driving on a dirt track kicking up red dust']]
 .forEach(([id,fr,en])=>addP('vang',id,fr,en,null,null,{draw:()=>vehSVG(id)}));
// Animal
[['astand','Debout','standing'],['asit','Assis','sitting'],['alie','Couché','lying down'],['awalk','Marche','walking'],['arun','Court','running'],['ajump','Saute','jumping'],
 ['alook','Regarde l’objectif','looking at the camera'],['aeat','Mange','eating'],['asleep','Dort','sleeping'],['aperch','Sur une branche','perched on a branch']]
 .forEach(([id,fr,en])=>addP('ani',id,fr,en,null,null,{draw:()=>aniSVG(id)}));
// Créature
addP('fant','fstand','Debout, majestueux','standing majestically',null,null,{draw:o=>figure(mk({}),{wings:true}).svg});
addP('fant','ffly','En vol','flying',null,null,{draw:o=>figure(mk({h:[50,60],al:[-60,-30],ar:[60,30],ll:[-10,20],lr:[10,30]}),{wings:true,wingsUp:true}).svg});
addP('fant','froar','Posture menaçante','in a menacing stance',null,null,{draw:o=>figure(mk({t:14,al:[100,150],ar:[110,160],ll:[-30,0],lr:[30,0]}),{wings:true,wingsUp:true}).svg});
addP('fant','fcalm','Au repos','resting calmly',null,null,{draw:o=>figure(mk({h:[50,98],ll:[-76,72],lr:[76,-72],al:[-30,30],ar:[30,-30]}),{wings:true}).svg});
// Groupes (interactions)
const GP={
 side:[[ST,-18],[ST,18]],face:[[FACE_R,-16],[FACE_L,16]],talk:[[mk({ar:[60,120]}),-16],[FACE_L,16]],laughT:[[mk({hd:-12,ar:[10,40]}),-16],[mk({hd:12,al:[-10,-40]}),16]],
 hug:[[mk({ar:[80,70]}),-9],[mk({al:[-80,-70]}),9]],highfive:[[mk({ar:[160,170]}),-14],[mk({al:[-160,-170]}),14]],handshake:[[mk({ar:[70,90]}),-14],[mk({al:[-70,-90]}),14]],
 backtoback:[[mir(mk({al:[-14,80],ar:[14,-80]})),-8],[mk({al:[-14,80],ar:[14,-80]}),8]],walkT:[[POSESP('walking'),-16],[POSESP('walking'),16]],runT:[[POSESP('running'),-18],[POSESP('running'),18]],
 danceT:[[mk({ar:[150,170],al:[-40,-20]}),-12],[mk({al:[-150,-170],ar:[40,20]}),12]],toast:[[mk({ar:[150,165]}),-14,null,null,['cup']],[mk({al:[-150,-165],ar:[150,165]}),14,null,null,['cup']]],
 selfie:[[mk({ar:[150,160]}),-10,null,null,['phone']],[mk({}),10]],family:[[ST,-24],[ST,22],[mk({al:[-150,-170]}),0,.55]],couple:[[mk({hd:14,ar:[60,80]}),-7],[mk({hd:-14,al:[-60,-80]}),7]],
 carry:[[mk({t:10,al:[30,90],ar:[40,100]}),-6],[mk({h:[44,60],ll:[60,20],lr:[70,10],al:[60,80]}),4,.7]],sitT:[[mk({h:[30,84],ll:[82,2],lr:[78,6],al:[30,70],ar:[24,78]}),0],[mk({h:[64,84],ll:[82,2],lr:[78,6],al:[30,70],ar:[24,78]}),0]],
 share:[[mk({ar:[70,90]}),-16,null,null,['bottleR']],[mk({al:[-70,-90]}),16]],meal:[[mk({h:[28,84],ll:[82,2],lr:[78,6],ar:[70,100]}),0],[mir(mk({h:[72,84],ll:[82,2],lr:[78,6],ar:[70,100]})),0]],
 behind:[[ST,-10,.95],[ST,14,.7]],teach:[[mk({ar:[90,92]}),-16],[FACE_L,16]],whisper:[[mk({t:10,hd:14,ar:[60,150]}),-8],[ST,10]],sameDir:[[mk({ar:[100,95]}),-16],[mk({ar:[100,95]}),16]],
 argue:[[mk({ar:[70,120],al:[-40,-60]}),-16],[mk({al:[-70,-120],ar:[40,60]}),16]],playT:[[POSESP('kick'),-16,null,null,['ball']],[POSESP('goalie'),20,.7]],solo:[[mk({ar:[30,150]}),-18,null,null,['phone']],[mk({hd:20}),18]],
};
function POSESP(id){return POSES[id]?POSES[id].P:mk({})}
function groupSVG(id,n,o={}){let list=(GP[id]||GP.side).map(x=>[...x]);if(n>=3&&list.length===2&&id!=='family')list=[[list[0][0],-28,.72],[list[1][0],28,.72],[ST,0,.66]];
 else list=list.map(x=>[x[0],x[1],x[2]||.82,x[3],x[4]]);return `<svg viewBox="0 0 100 112" aria-hidden="true">${floor}${grp(list,o)}</svg>`}
const PCAT={group:{fr:'En groupe',ic:'users'},veh:{fr:'Avec véhicule',ic:'car'},prod:{fr:'Avec un produit',ic:'package'},hands:{fr:'Mains en gros plan',ic:'hand'},base:{fr:'Debout & basique',ic:'person-standing'},move:{fr:'Marche & mouvement',ic:'footprints'},
 sit:{fr:'Assis & allongé',ic:'armchair'},sport:{fr:'Sport',ic:'dumbbell'},foot:{fr:'Football',ic:'volleyball'},dance:{fr:'Danse',ic:'music'},mode:{fr:'Mode & éditorial',ic:'sparkle'},
 pres:{fr:'Présentation produit',ic:'package'},vang:{fr:'Angles & action',ic:'car'},ani:{fr:'Poses de l’animal',ic:'paw-print'},fant:{fr:'Poses de la créature',ic:'sparkles'}};
INTERACT.sitT={fr:'Assis ensemble',en:'sitting together side by side',ic:'armchair'};

/* ---------- fenêtre de poses ---------- */
let PW=null; // {sid, sel:[], cat, inter}
function poseCats(s){const others=S.subjects.filter(x=>x.id!==s.id),persons=S.subjects.filter(x=>x.kind==='person').length;
 if(s.kind==='product'||s.kind==='object')return ['pres'];if(s.kind==='vehicle')return ['vang'];if(s.kind==='animal')return ['ani'];if(s.kind==='fantasy')return ['fant'];
 const c=[];if(persons>=2)c.push('group');if(others.some(x=>x.kind==='vehicle'))c.push('veh');if(others.some(x=>x.kind==='product'))c.push('prod');
 ['base','move','sit','sport','foot','dance','mode'].forEach(k=>c.push(k));if(!c.includes('prod'))c.push('prod');c.push('hands');if(!c.includes('veh'))c.push('veh');return c}
const subjOpts=s=>({female:s.gender==='woman'||s.gender==='girl',child:s.gender==='girl'||s.gender==='boy'||+String(s.age).split('-')[0]<13});
function openPoses(sid){const s=S.subjects.find(x=>x.id==sid);const cats=poseCats(s);PW={sid:s.id,sel:validPoses(s),cat:cats[0],inter:S.interact};renderPoses()}
function renderPoses(){const s=S.subjects.find(x=>x.id==PW.sid);if(!s){closeOverlay();return}const cats=poseCats(s),o=subjOpts(s),n=S.subjects.filter(x=>x.kind==='person').length,idx=S.subjects.indexOf(s)+1;
 const who=s.kind==='person'?`${GENDER[s.gender].fr} · ${s.age} ans`:KIND[s.kind].fr;
 let grid;
 if(PW.cat==='group')grid=Object.entries(INTERACT).map(([k,v])=>`<button class="ptile" data-pinter="${k}" aria-pressed="${PW.inter===k}"><span class="pfig">${groupSVG(k,n,o)}</span><span class="pl">${esc(v.fr)}</span></button>`).join('');
 else grid=Object.entries(POSES).filter(([,p])=>p.cat===PW.cat).map(([k,p])=>`<button class="ptile" data-psel="${k}" aria-pressed="${PW.sel.includes(k)}"><span class="pfig">${poseSVG(k,o)}</span><span class="pl">${esc(p.fr)}</span>${PW.sel.includes(k)?`<span class="pnum">${PW.sel.indexOf(k)+1}</span>`:''}</button>`).join('');
 const big=PW.sel[0]?poseSVG(PW.sel[0],o):`<svg viewBox="0 0 100 112">${floor}<text x="50" y="60" text-anchor="middle" fill="var(--dim)" font-size="7" font-family="var(--f-body)">Aucune pose choisie</text></svg>`;
 const again=!!$('.posewin');
 openOverlay(`<div class="wl-card posewin${again?' still':''}" role="dialog" aria-modal="true" aria-labelledby="pwT">
  <div class="pwhead"><div><p class="eyebrow">Bibliothèque de poses</p><h2 id="pwT">Sujet ${idx} · ${esc(who)}</h2></div><button class="x close" data-overlay-close aria-label="Fermer">${ic('x')}</button></div>
  <div class="pwcats">${cats.map(k=>`<button class="chip" data-pcat="${k}" aria-pressed="${PW.cat===k}">${ic(PCAT[k].ic)}<span>${PCAT[k].fr}</span></button>`).join('')}</div>
  <div class="pwbody"><div class="pgrid2">${grid}</div>
   <aside class="pwside"><div class="pbig">${big}</div>
    <span class="lab">Votre sélection ${PW.cat==='group'?'':'(3 max, combinables)'}</span>
    <div class="psellist">${PW.sel.length?PW.sel.map((k,i)=>`<span class="pselc">${i+1}. ${esc(POSES[k].fr)}<button data-punsel="${k}" aria-label="Retirer">${ic('x')}</button></span>`).join(''):'<span class="hint">Cliquez sur une ou plusieurs poses.</span>'}</div>
    ${n>=2&&s.kind==='person'?`<p class="hint">Groupe : <b>${esc(INTERACT[PW.inter].fr)}</b></p>`:''}
    <div class="row-btns"><button class="btn ghost" data-pclear>Effacer</button><span class="sp"></span><button class="btn primary" data-pok>${ic('check')}Valider</button></div>
   </aside></div></div>`);
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-poses],[data-pcat],[data-psel],[data-punsel],[data-pclear],[data-pok],[data-pinter]');if(!t)return;const d=t.dataset;
 if(d.poses){openPoses(d.poses);return}
 if(!PW)return;
 if(d.pcat){PW.cat=d.pcat;renderPoses();return}
 if(d.pinter){PW.inter=d.pinter;renderPoses();return}
 if(d.psel){const i=PW.sel.indexOf(d.psel);if(i>=0)PW.sel.splice(i,1);else{if(PW.sel.length>=3)PW.sel.shift();PW.sel.push(d.psel)}renderPoses();return}
 if(d.punsel){PW.sel=PW.sel.filter(k=>k!==d.punsel);renderPoses();return}
 if(d.pclear!==undefined){PW.sel=[];renderPoses();return}
 if(d.pok!==undefined){const s=S.subjects.find(x=>x.id==PW.sid);s.poses=[...PW.sel];s.posesSet=true;S.interact=PW.inter;PW=null;closeOverlay();all();toast('Pose validée')}
});
function poseSummary(s){const l=validPoses(s).map(k=>POSES[k]?.fr).filter(Boolean);return l.length?l.join(' + '):'Aucune'}
function poseEn(s){return validPoses(s).map(k=>POSES[k]?.en).filter(Boolean).join(', ')}
function poseThumbs(s){const o=subjOpts(s);return validPoses(s).filter(k=>POSES[k]).map(k=>`<span class="pmini">${poseSVG(k,o)}</span>`).join('')}
