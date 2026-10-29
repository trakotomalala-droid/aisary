/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= MARQUE AIsary ================= */
const AISARY_VERSION='Prototype v3';
function logoMark(size=40,id='lm'){
 // diaphragme à 6 lames + étincelle IA au centre
 const c=24,r=15;let blades='';
 for(let i=0;i<6;i++){const a=i*Math.PI/3-Math.PI/2,b=a+2.15,x1=c+Math.cos(a)*r,y1=c+Math.sin(a)*r,x2=x1+Math.cos(b)*r*1.06,y2=y1+Math.sin(b)*r*1.06;
  blades+=`<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`}
 return `<svg class="logomark" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">
 <defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd38a"/><stop offset=".55" stop-color="#f0a24b"/><stop offset="1" stop-color="#e0602e"/></linearGradient>
 <radialGradient id="${id}b" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#2c2a33"/><stop offset="1" stop-color="#121116"/></radialGradient></defs>
 <rect x="1" y="1" width="46" height="46" rx="13" fill="url(#${id}b)"/>
 <rect x="1.5" y="1.5" width="45" height="45" rx="12.5" fill="none" stroke="url(#${id}g)" stroke-opacity=".35"/>
 <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="url(#${id}g)" stroke-width="2.4"/>
 <g stroke="url(#${id}g)" stroke-width="2.2" stroke-linecap="round">${blades}</g>
 <path d="M24 17.2Q24.9 23.1 30.8 24Q24.9 24.9 24 30.8Q23.1 24.9 17.2 24Q23.1 23.1 24 17.2Z" fill="#fff8ea"/>
 <circle cx="33.5" cy="14.5" r="1.6" fill="#fff8ea" opacity=".9"/>
</svg>`}
function logoFull(size=40,id='lf'){return `<span class="brand">${logoMark(size,id)}<span class="brandtxt"><span class="wordmark">AIsary</span><span class="byline">par Toky Rakotomalala</span></span></span>`}

function welcomeHTML(){return `<div class="wl-card" role="dialog" aria-modal="true" aria-labelledby="wlT">
 <div class="wl-logo">${logoMark(88,'wl')}<div><div class="wordmark big">AIsary</div><div class="byline">par Toky Rakotomalala</div></div></div>
 <p class="wl-hello" id="wlT">Tongasoa eto amin'ny AIsary !</p>
 <h2>Composez vos images IA comme sur un vrai plateau photo.</h2>
 <p>Choisissez le décor, placez les lumières, réglez la caméra, dirigez vos sujets. AIsary écrit le prompt pour vous, adapté au modèle que vous utilisez. Plus besoin d'être un expert du prompt : il suffit d'avoir une image en tête.</p>
 <p>AIsary est né à Madagascar. Il a été créé par un créatif malagasy, d'abord pour les créatifs et les designers malagasy, et il est ouvert à tous. Il est gratuit et open source : chacun peut l'utiliser, l'améliorer et le partager.</p>
 <p class="wl-note">« Sary » veut dire « image » en malagasy.</p>
 <ul class="wl-pills"><li>${ic('heart')}Gratuit & open source</li><li>${ic('map-pin')}Pensé à Madagascar</li><li>${ic('layers')}Pour tous les modèles d'image</li></ul>
 <blockquote>Soyez créatifs. La seule limite, c'est vous.<cite>Toky Rakotomalala, créateur d'AIsary</cite></blockquote>
 <button class="btn primary big" id="wlGo">${ic('clapperboard')}Entrer sur le plateau</button>
 <p class="hint">Ce message s'affiche au premier lancement. Vous le retrouverez dans « À propos ».</p>
</div>`}
function aboutHTML(){return `<div class="wl-card about" role="dialog" aria-modal="true" aria-labelledby="abT">
 <button class="x close" data-overlay-close aria-label="Fermer">${ic('x')}</button>
 <div class="wl-logo">${logoMark(64,'ab')}<div><div class="wordmark big" id="abT">AIsary</div><div class="byline">par Toky Rakotomalala</div></div></div>
 <dl class="fiche">
  <dt>Version</dt><dd>${AISARY_VERSION}</dd>
  <dt>Créateur</dt><dd>Toky Rakotomalala, directeur artistique, Madagascar</dd>
  <dt>Licence</dt><dd>Open source, gratuit pour tous</dd>
  <dt>Code</dt><dd>GitHub (lien ajouté à la mise en ligne)</dd>
 </dl>
 <p>AIsary aide les créatifs à composer une scène (décor, lumière, caméra, sujets) et transforme ces choix en prompt précis pour les modèles d'image.</p>
 <div class="don">
  <h3>${ic('heart-handshake')}Soutenir AIsary</h3>
  <p>AIsary est gratuit et le restera. Si l'outil vous fait gagner du temps, un don aide à le faire grandir.</p>
  <p class="hint">Les moyens de don seront ajoutés ici.</p>
 </div>
 <div class="row-btns"><button class="btn" id="showWelcome">${ic('sparkles')}Revoir l'écran de bienvenue</button></div>
 <p class="hint">Créé à Madagascar avec passion. Merci de garder ce crédit dans les versions dérivées.</p>
</div>`}
function openOverlay(html){const o=$('#overlay');o.innerHTML=html;o.hidden=false;refreshIcons();setTimeout(()=>{const b=o.querySelector('#wlGo,[data-overlay-close]');b&&b.focus()},50)}
function closeOverlay(){const o=$('#overlay');o.hidden=true;o.innerHTML=''}
document.addEventListener('click',e=>{
 const t=e.target.closest('#wlGo,#aboutBtn,[data-overlay-close],#showWelcome,#overlay');if(!t)return;
 if(t.id==='wlGo'){try{localStorage.setItem('aisary-welcome','1')}catch(err){}closeOverlay();return}
 if(t.id==='aboutBtn'){openOverlay(aboutHTML());return}
 if(t.id==='showWelcome'){openOverlay(welcomeHTML());return}
 if(t.dataset&&t.dataset.overlayClose!==undefined){closeOverlay();return}
 if(t.id==='overlay'&&e.target.id==='overlay'&&!$('#wlGo'))closeOverlay();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#overlay').hidden&&!$('#wlGo'))closeOverlay()});
$('#brandSlot').innerHTML=logoFull(34,'hd');
let seen=null;try{seen=localStorage.getItem('aisary-welcome')}catch(e){}
if(!seen)openOverlay(welcomeHTML());
