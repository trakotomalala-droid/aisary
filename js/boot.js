/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= DÉMARRAGE ================= */
$('#brandSlot').innerHTML=logoFull(34,'hd');
renderModeSwitch();
(async()=>{
 let list=[];try{list=await DB.all()}catch(e){}
 // reprendre la scène d'une version précédente comme premier projet
 if(!list.length&&HAD_OLD){const p=newProjectObj('Ma première scène',S,R);try{await DB.put(p)}catch(e){}}
 showScreen('home');
 let seen=null;try{seen=localStorage.getItem('aisary-welcome')}catch(e){}
 if(!seen)openOverlay(welcomeHTML());else if(!G.guided)guideStart();
})();
