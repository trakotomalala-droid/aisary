/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= BIBLIOTHÈQUES DE PRESETS — AIsary ================= */
const D=arr=>{const o={};for(const a of arr){const [k,fr,en,ic,x]=a;o[k]=Object.assign({fr,en,ic},x||{})}return o};
const GRP=groups=>{const g={};for(const n in groups)g[n]=D(groups[n]);return g};
const flat=g=>Object.assign({},...Object.values(g));

/* ---------- DÉCOR ---------- */
const BGCAT = D([
 ['mada','Madagascar','', 'map-pin'],['nature','Nature','', 'trees'],['urbain','Urbain','', 'building-2'],
 ['interieur','Intérieur','', 'sofa'],['studio','Studio','', 'square'],['fantaisie','Fantaisie','', 'sparkles']
]);
const BG = [
 // Madagascar
 ['foret','Forêt humide d’Andasibe','a dense Malagasy eastern rainforest in the style of Andasibe, lush tree ferns, moss-covered trunks, humid hazy air','mada','linear-gradient(160deg,#2f6b45,#0f2a1c 60%,#4f7d3f)'],
 ['baobab','Allée des Baobabs','the Avenue of the Baobabs near Morondava, Madagascar, giant baobab trees lining a red dirt road','mada','linear-gradient(180deg,#f7c27c,#e07b3c 58%,#7a3518)'],
 ['rizieres','Rizières des Hautes Terres','terraced rice paddies of the Malagasy Highlands, red laterite soil, traditional brick houses in the distance','mada','linear-gradient(180deg,#a9c8e8,#8fbf6a 45%,#5c8a3a 70%,#9b4a2a)'],
 ['nosybe','Plage de Nosy Be','a tropical white-sand beach in Nosy Be, Madagascar, turquoise water, a traditional outrigger pirogue','mada','linear-gradient(180deg,#7fd0e6,#2aa6b8 50%,#f1e3c2 72%)'],
 ['tsingy','Tsingy de Bemaraha','the razor-sharp limestone pinnacles of Tsingy de Bemaraha, Madagascar','mada','linear-gradient(170deg,#c8c2b4,#7d776c 55%,#3d4a33)'],
 ['isalo','Canyon de l’Isalo','the sandstone canyons and golden grass plains of Isalo National Park, Madagascar','mada','linear-gradient(180deg,#f0c98a,#c1723a 50%,#d8b45a 75%)'],
 ['analakely','Marché d’Analakely','a lively street market in Analakely, Antananarivo, colorful stalls and white parasols','mada','linear-gradient(135deg,#e8d9b0,#d9543f 40%,#3a6ea5 75%,#f2c94c)'],
 ['tana','Haute-Ville de Tana','the hillside old town of Antananarivo with colorful houses climbing toward the Rova palace','mada','linear-gradient(180deg,#bcd5ec,#e9b48a 45%,#b35c3c 70%,#6f7d4a)'],
 ['anosy','Lac Anosy & jacarandas','Lake Anosy in Antananarivo lined with blooming purple jacaranda trees','mada','linear-gradient(180deg,#b9a6e8,#8a6cc8 45%,#7fa6c9 72%)'],
 ['village','Village de pêcheurs','a Malagasy coastal fishing village with palm-thatched huts and outrigger pirogues on the sand','mada','linear-gradient(180deg,#8fd3e8,#5fb7c9 40%,#d8c59a 66%,#7a5a33)'],
 ['rn7','Route & taxi-brousse','a Malagasy national road winding through the highlands, a colorful taxi-brousse minibus','mada','linear-gradient(180deg,#a7c7e7,#7aa35a 50%,#a2532d 80%)'],
 ['ranomafana','Cascade de Ranomafana','a misty waterfall in the Ranomafana rainforest, Madagascar','mada','linear-gradient(180deg,#cfe6e8,#5e9b7a 45%,#1f4d3a)'],
 ['ambohimanga','Colline d’Ambohimanga','the sacred royal hill of Ambohimanga with stone gates and ancient fig trees','mada','linear-gradient(180deg,#cfdde9,#8a9a6a 50%,#6b5a44)'],
 // Nature
 ['montagne','Lac de montagne','an alpine mountain lake with snowy peaks reflected in still water','nature','linear-gradient(180deg,#d8e6f5,#8fb0d4 40%,#3e6a8c 70%,#2e4a3a)'],
 ['dunes','Dunes du désert','vast golden sand dunes with soft wind-carved ridges','nature','linear-gradient(180deg,#f6dcae,#e3a65c 55%,#b06d34)'],
 ['automne','Forêt d’automne','a temperate forest in autumn, orange and red leaves, soft fallen foliage','nature','linear-gradient(170deg,#f2b25e,#c4542b 50%,#5a3a22)'],
 ['fleurs','Champ de fleurs','a wide meadow full of wildflowers','nature','linear-gradient(180deg,#bfe0f2,#e9a3c4 55%,#6fa55a)'],
 ['ble','Champ de blé doré','a golden wheat field under a big sky','nature','linear-gradient(180deg,#a8cbe8,#f0d58a 55%,#c49a3e)'],
 ['falaise','Falaises & océan','dramatic coastal cliffs above a deep blue ocean','nature','linear-gradient(180deg,#a7cfe9,#2d6c9c 55%,#5b6a5a)'],
 ['savane','Savane africaine','an African savanna with acacia trees and tall dry grass','nature','linear-gradient(180deg,#f4c886,#d39a4c 55%,#8a7a3a)'],
 ['neige','Paysage enneigé','a snowy winter landscape with frosted pine trees','nature','linear-gradient(180deg,#eef3f8,#c8d6e6 55%,#7d93ab)'],
 ['recif','Récif sous-marin','an underwater coral reef with sun rays through clear water','nature','linear-gradient(180deg,#5fd0e0,#1a7fb0 50%,#0d3a66)'],
 // Urbain
 ['rue','Rue animée','a busy city street with shallow background bokeh','urbain','linear-gradient(170deg,#5b6170,#2b2f38 55%,#d9a35b)'],
 ['rooftop','Toit-terrasse','a rooftop terrace overlooking the city skyline','urbain','linear-gradient(180deg,#f4a76b,#b0607a 45%,#3a3f5c)'],
 ['parking','Parking souterrain','an underground concrete parking garage with fluorescent lights','urbain','linear-gradient(180deg,#5e6466,#2f3335 60%,#a9b7a0)'],
 ['ruelle','Ruelle néon','a narrow back alley glowing with neon signs at night','urbain','linear-gradient(160deg,#1a1040,#c22e8c 50%,#20b5c9)'],
 ['affaires','Quartier d’affaires','a modern business district with glass skyscrapers','urbain','linear-gradient(180deg,#cfe0ef,#7c97b3 50%,#3b4a5c)'],
 ['station','Station-service de nuit','a gas station at night lit by bright canopy lights','urbain','linear-gradient(180deg,#0f1424,#273452 55%,#e8e2c0)'],
 ['graffiti','Mur graffiti','a colorful graffiti wall in an urban street','urbain','linear-gradient(120deg,#f2c94c,#e0503a 35%,#3a7bd5 70%,#55c27a)'],
 ['gare','Gare / métro','a busy train station platform with motion blur','urbain','linear-gradient(180deg,#9aa3ad,#4b535c 60%,#d7b46a)'],
 // Intérieur
 ['salon','Salon moderne','a bright modern living room with natural wood and plants','interieur','linear-gradient(160deg,#efe4d2,#c9a77c 60%,#6f8d5e)'],
 ['cuisine','Cuisine lumineuse','a bright contemporary kitchen with marble countertops','interieur','linear-gradient(160deg,#f6f2ea,#d8cfc0 55%,#8a7a64)'],
 ['bureau','Bureau / open space','a contemporary office with glass partitions and soft background blur','interieur','linear-gradient(160deg,#dfe6ec,#93a4b3 60%,#4b5966)'],
 ['cafe','Café cosy','a cozy coffee shop with warm pendant lights','interieur','linear-gradient(160deg,#e8c59a,#8a5a36 55%,#3a2a20)'],
 ['chambre','Chambre douce','a soft bedroom with white linen and morning light','interieur','linear-gradient(160deg,#fbf6ef,#e6d6c6 60%,#b8a08a)'],
 ['gym','Salle de sport','a modern gym with weights and dramatic lighting','interieur','linear-gradient(160deg,#4a4e55,#1f2226 60%,#c84a3a)'],
 ['boutique','Boutique de luxe','an upscale luxury boutique with marble and gold details','interieur','linear-gradient(160deg,#f2e8d6,#c9a86a 55%,#3a332a)'],
 ['classe','Salle de classe','a sunlit school classroom with wooden desks','interieur','linear-gradient(160deg,#f2eadb,#a9c08a 55%,#6b5a44)'],
 ['clinique','Clinique moderne','a clean modern medical clinic','interieur','linear-gradient(160deg,#f4f8fa,#bcd6e0 60%,#7aa0b0)'],
 ['entrepot','Entrepôt industriel','a vast industrial warehouse with tall windows','interieur','linear-gradient(160deg,#b4b0a6,#6a665e 55%,#2e2c28)'],
 ['restaurant','Restaurant chic','an elegant restaurant interior with candlelit tables','interieur','linear-gradient(160deg,#c48a5a,#5a2e22 55%,#1e1414)'],
 // Studio
 ['studioW','Fond blanc','a seamless pure white studio cyclorama background','studio','linear-gradient(180deg,#ffffff,#e6e4df)'],
 ['studioN','Fond noir','a seamless matte black studio background','studio','linear-gradient(180deg,#2a2a2e,#060607)'],
 ['studioC','Fond coloré','a seamless colored paper studio backdrop in a bold brand color','studio','linear-gradient(180deg,#ff8a3d,#d9622a)'],
 ['studioG','Gris dégradé','a smooth grey studio backdrop with a soft gradient vignette','studio','radial-gradient(circle at 50% 40%,#b9b9bb,#4a4a4e)'],
 ['beton','Béton brut','a raw concrete wall studio backdrop','studio','linear-gradient(170deg,#a7a49e,#77746e 60%,#55524d)'],
 ['pastel','Fond pastel','a soft pastel colored studio backdrop','studio','linear-gradient(160deg,#f6c9d6,#c9d8f6 60%,#d6f0e0)'],
 ['papier','Papier texturé','a hand-painted textured canvas backdrop in muted tones','studio','radial-gradient(circle at 40% 40%,#9a8c7a,#4c4236)'],
 ['chroma','Fond vert (incrustation)','a flat evenly lit green screen background for keying','studio','linear-gradient(180deg,#3fcf5a,#26a843)'],
 // Fantaisie
 ['enchantee','Forêt enchantée','an enchanted forest with glowing mushrooms and floating light particles','fantaisie','linear-gradient(160deg,#1b3a4a,#3c7a5a 50%,#c6e85a)'],
 ['planete','Planète extraterrestre','the surface of an alien planet with two moons in a purple sky','fantaisie','linear-gradient(180deg,#2a1450,#8a3ab0 50%,#e88a5a)'],
 ['cyberpunk','Ville cyberpunk','a futuristic cyberpunk megacity with flying vehicles and holograms','fantaisie','linear-gradient(170deg,#0c0a2a,#5a1a8a 45%,#1ad0e0)'],
 ['chateau','Château médiéval','a towering medieval castle on a misty hill','fantaisie','linear-gradient(180deg,#c8ccd6,#7a7f8c 55%,#3a3f3a)'],
 ['nuages','Royaume des nuages','a heavenly realm above the clouds with golden light','fantaisie','linear-gradient(180deg,#ffe7b0,#f6c0c8 45%,#ffffff)'],
 ['abysses','Abysses fantastiques','a fantastical deep sea world with bioluminescent creatures','fantaisie','linear-gradient(180deg,#0a2a4a,#04101e 60%,#2ad0b0)'],
 ['steampunk','Atelier steampunk','a steampunk workshop full of brass gears and steam','fantaisie','linear-gradient(160deg,#c89a5a,#6a4022 55%,#2a1a10)'],
 ['ile','Île flottante','a floating island with waterfalls pouring into the sky','fantaisie','linear-gradient(180deg,#9ad0f2,#e4f4ff 45%,#5aa05a 70%)'],
 ['temple','Temple en ruines','ancient temple ruins overgrown by jungle','fantaisie','linear-gradient(170deg,#b8b08a,#5a6a3a 55%,#2a3a22)'],
].map(([id,fr,en,cat,sw])=>({id,fr,en,cat,sw}));
const BGM=Object.fromEntries(BG.map(b=>[b.id,b]));

/* ---------- AMBIANCE ---------- */
const TIME = D([
 ['dawn','Aube','at dawn, pale first light','sunrise',{sky:['#2c3560','#d98a7a'],sun:-4,c:'#ffd0a8'}],
 ['sunrise','Lever du soleil','at sunrise, soft warm light skimming the landscape','sunrise',{sky:['#6a7fb8','#ffb070'],sun:6,c:'#ffc078'}],
 ['morning','Matin','in the morning, fresh clear light','sun',{sky:['#7fb6ea','#d8ecf8'],sun:30,c:'#fff4d8'}],
 ['noon','Midi','at midday, high sun, short shadows','sun',{sky:['#3a8ae0','#a8d4f6'],sun:80,c:'#ffffff'}],
 ['afternoon','Après-midi','in the afternoon, warm clear light','sun',{sky:['#5a9ce0','#e8e0c0'],sun:42,c:'#fff0c8'}],
 ['golden','Heure dorée','during golden hour, low warm sun','sunset',{sky:['#e8925a','#ffd690'],sun:12,c:'#ffb84a'}],
 ['sunset','Coucher','at sunset, glowing orange and pink sky','sunset',{sky:['#5a3a7a','#ff7a4a'],sun:2,c:'#ff8a4a'}],
 ['blue','Heure bleue','during blue hour, deep blue ambient sky','moon',{sky:['#14204a','#4a6ab0'],sun:-10,c:'#6a8ad8'}],
 ['night','Nuit','at night, dark ambient environment','moon',{sky:['#05070f','#1a2238'],sun:-30,c:'#3a4a7a'}],
 ['studio','Studio (neutre)','in a controlled studio environment','lightbulb',{sky:['#3a3a40','#6a6a70'],sun:-99,c:'#e0e0e0'}],
]);
const WEATHER = D([
 ['clear','Ciel dégagé','clear sky','sun'],['light','Nuages légers','scattered light clouds','cloud-sun'],
 ['over','Couvert','overcast sky, diffused light','cloud'],['rain','Pluie','light rain, wet glistening surfaces','cloud-rain'],
 ['storm','Orage','stormy sky, dramatic dark clouds','cloud-lightning'],['after','Après la pluie','just after the rain, wet ground and fresh air','droplets'],
 ['mist','Brume','soft mist and atmospheric haze','cloud-fog'],['wind','Vent','strong wind moving hair and fabric','wind'],
 ['dust','Poussière sèche','dry season dust floating in the air','sun-dim'],['heat','Chaleur','shimmering heat haze','thermometer-sun'],
 ['snow','Neige','gently falling snow','snowflake'],
]);
const CLIMATE = D([
 ['none','— Aucun','','globe'],
 ['hautes','Hautes Terres malgaches (frais, air clair)','crisp highland air of central Madagascar','map-pin'],
 ['est','Côte Est tropicale humide','humid tropical climate of eastern Madagascar','map-pin'],
 ['sud','Sud aride (Tuléar)','arid, sun-bleached southern Madagascar climate','map-pin'],
 ['ouest','Ouest sec, savane','dry savanna climate of western Madagascar','map-pin'],
 ['nord','Nord (Diego, Nosy Be)','warm breezy tropical climate of northern Madagascar','map-pin'],
 ['paris','Paris en hiver','cold grey Parisian winter','globe'],['medit','Méditerranée l’été','bright Mediterranean summer','globe'],
 ['scandi','Scandinavie','cool soft Nordic light','globe'],['desert','Désert du Golfe','hot dry Gulf desert light','globe'],
 ['tokyo','Tokyo néon','humid neon-lit Tokyo night atmosphere','globe'],['ny','New York automne','crisp New York autumn light','globe'],
 ['tropic','Tropiques (Caraïbes)','saturated Caribbean tropical light','globe'],['sahel','Afrique de l’Ouest','warm dusty West African light','globe'],
]);
const MOOD = D([
 ['warm','Chaleureux','warm and inviting mood','',{p:['#f0a24b','#e86a3a','#f6d6a0']}],
 ['fresh','Frais & clean','fresh, clean and airy mood','',{p:['#e8f4f8','#8fd0e0','#ffffff']}],
 ['drama','Dramatique','dramatic, high-contrast mood','',{p:['#0c0c0e','#8a1a1a','#e0d6c8']}],
 ['joy','Joyeux & pub','joyful, upbeat commercial mood','',{p:['#ffd23a','#ff5a7a','#3ac0ff']}],
 ['cine','Cinématographique','cinematic, moody atmosphere','',{p:['#1a3a4a','#e8894a','#2a2a30']}],
 ['doc','Naturel documentaire','authentic, documentary feel','',{p:['#8a7a5a','#c8b89a','#4a5a3a']}],
 ['lux','Luxe','premium, luxurious mood','',{p:['#0e0e10','#c9a86a','#f2e8d6']}],
 ['romance','Romantique','soft romantic mood','',{p:['#f6c9d6','#e88aa0','#fff0e8']}],
 ['mystere','Mystérieux','mysterious, enigmatic mood','',{p:['#1a1a3a','#4a3a8a','#8a9ab0']}],
 ['nostalgie','Nostalgique','nostalgic, vintage mood','',{p:['#d8b88a','#8a6a4a','#c8d0b0']}],
 ['futur','Futuriste','sleek futuristic mood','',{p:['#0a0e1a','#2ad0e0','#c0c8f0']}],
 ['fete','Festif','festive, celebratory mood','',{p:['#ff3a5a','#ffd23a','#7a3aff']}],
]);

/* ---------- LUMIÈRES ---------- */
const LTYPE = GRP({
 'Studio':[
  ['softbox','Softbox','large rectangular softbox','square',{q:'soft'}],
  ['octa','Octabox','octabox','octagon',{q:'soft, wrapping'}],
  ['dish','Beauty dish','beauty dish','disc',{q:'crisp yet flattering'}],
  ['strip','Strip box','narrow strip softbox','rectangle-vertical',{q:'soft, narrow'}],
  ['umbrella','Parapluie','shoot-through umbrella','umbrella',{q:'broad, soft'}],
  ['para','Grand parabolique','large deep parabolic reflector','radar',{q:'punchy yet soft'}],
  ['fresnel','Fresnel','focused fresnel spotlight','flashlight',{q:'hard, focused'}],
  ['gobo','Projecteur à découpe (gobo)','ellipsoidal spotlight with a gobo pattern','aperture',{q:'hard, patterned'}],
  ['bare','Flash nu','bare bulb flash','zap',{q:'hard, raw'}],
  ['ring','Ring light','ring light','circle-dot',{q:'flat, even'}],
  ['panel','Panneau LED','LED panel','panel-top',{q:'soft'}],
  ['tube','Tube LED','LED light tube','minus',{q:'linear, colored'}],
  ['neon','Néon','neon tube light','zap',{q:'colored'}],
  ['reflector','Réflecteur','white bounce reflector','circle',{q:'gentle bounced'}],
  ['flag','Drapeau noir','black flag','square-x',{q:'negative fill'}],
 ],
 'Naturel & décor':[
  ['sun','Soleil direct','direct sunlight','sun',{q:'hard, natural'}],
  ['dappled','Soleil filtré (feuillage)','sunlight filtered through foliage','trees',{q:'dappled'}],
  ['sky','Ciel ambiant','ambient skylight','cloud',{q:'soft, enveloping'}],
  ['window','Fenêtre','large window light','app-window',{q:'soft, natural'}],
  ['moon','Lune','moonlight','moon',{q:'cold, soft'}],
  ['fire','Feu / bougie','firelight and candlelight','flame',{q:'flickering'}],
  ['practical','Lampe d’intérieur','practical table lamp','lamp',{q:'cozy'}],
  ['street','Lampadaire','street lamp','lamp-floor',{q:'sodium'}],
  ['screen','Écran / téléphone','screen glow','smartphone',{q:'cool glow'}],
  ['headlight','Phares de voiture','car headlights','car',{q:'hard, directional'}],
 ]
});
const LT=flat(LTYPE);
const LROLE = D([['key','Principale','key light','star'],['fill','Débouchage','fill light','circle-half'],['rim','Contre-jour','rim light','circle-dashed'],['hair','Cheveux','hair light','arrow-down'],['bg','Fond','background light','image'],['accent','Effet','accent light','sparkle']]);
const GEL = D([
 ['none','Aucune (température)','',null],['cyan','Cyan','cyan','',{hex:'#3fe0ff'}],['magenta','Magenta','magenta','',{hex:'#ff4fd8'}],
 ['cto','Orange (CTO)','warm orange','',{hex:'#ff9a3c'}],['ctb','Bleu (CTB)','cool blue','',{hex:'#4f8dff'}],['red','Rouge','deep red','',{hex:'#ff3b3b'}],
 ['green','Vert','emerald green','',{hex:'#3fdc7a'}],['purple','Violet','violet','',{hex:'#9b5cff'}],['pink','Rose pastel','soft pink','',{hex:'#ff9ec4'}],
 ['amber','Ambre','amber','',{hex:'#ffb000'}],['teal','Bleu-vert','teal','',{hex:'#1fb5a8'}],
]);
const KCAT = D([['portrait','Portrait studio','','user'],['produit','Produit','','package'],['creatif','Créatif','','wand-sparkles'],['naturel','Naturel','','sun'],['mine','Mes kits','','bookmark']]);
// [type, rôle, x, y, hauteur(m), puissance, kelvin, gélatine]
const KITS = {
 rembrandt:{fr:'Rembrandt',cat:'portrait',d:'Triangle de lumière sur la joue, classique',L:[['softbox','key',32,62,2.4,85,5200,'none'],['reflector','fill',70,60,1.3,30,5600,'none'],['strip','rim',70,30,2.2,45,5600,'none']]},
 butterfly:{fr:'Butterfly / Paramount',cat:'portrait',d:'Ombre papillon sous le nez, glamour',L:[['dish','key',50,64,2.7,85,5600,'none'],['reflector','fill',50,61,0.8,40,5600,'none']]},
 clamshell:{fr:'Clamshell beauté',cat:'portrait',d:'Peau lumineuse, idéal cosmétique',L:[['dish','key',50,65,2.4,85,5600,'none'],['softbox','fill',50,63,0.9,45,5600,'none'],['strip','hair',50,36,3.2,40,5600,'none'],['softbox','bg',50,18,1.5,50,6000,'none']]},
 loop:{fr:'Loop',cat:'portrait',d:'Petite ombre de nez, naturel et flatteur',L:[['octa','key',36,66,2.2,80,5400,'none'],['umbrella','fill',66,72,1.6,30,5600,'none']]},
 split:{fr:'Split',cat:'portrait',d:'Moitié du visage dans l’ombre',L:[['strip','key',24,50,1.7,85,5600,'none']]},
 lowkey:{fr:'Low-key dramatique',cat:'portrait',d:'Fond noir, contraste fort',L:[['fresnel','key',30,58,2.6,90,3800,'none'],['flag','fill',70,56,1.6,100,5600,'none'],['strip','rim',66,30,2.2,35,5600,'none']]},
 highkey:{fr:'High-key portrait',cat:'portrait',d:'Fond blanc éclatant, ombres légères',L:[['octa','key',50,70,2.2,80,5600,'none'],['umbrella','fill',34,66,1.6,40,5600,'none'],['umbrella','fill',66,66,1.6,40,5600,'none'],['softbox','bg',36,22,1.4,90,6000,'none'],['softbox','bg',64,22,1.4,90,6000,'none']]},
 rimdouble:{fr:'Double contre-jour',cat:'portrait',d:'Silhouette détourée des deux côtés',L:[['strip','rim',28,36,1.8,75,5600,'none'],['strip','rim',72,36,1.8,75,5600,'none'],['softbox','key',50,72,1.8,40,5600,'none']]},
 corporate:{fr:'Corporate / headshot',cat:'portrait',d:'Portrait pro propre pour LinkedIn, rapports',L:[['octa','key',38,68,2,75,5400,'none'],['reflector','fill',64,66,1.2,40,5600,'none'],['strip','hair',54,34,2.8,35,5600,'none'],['softbox','bg',50,20,1.2,40,5600,'none']]},
 packshot:{fr:'Packshot high-key',cat:'produit',d:'Produit sur fond blanc pur, e-commerce',L:[['strip','key',22,52,1,75,5600,'none'],['strip','fill',78,52,1,65,5600,'none'],['softbox','accent',50,52,3.2,60,5600,'none'],['softbox','bg',35,14,1,90,6000,'none'],['softbox','bg',65,14,1,90,6000,'none']]},
 bouteille:{fr:'Bouteille & verre',cat:'produit',d:'Liserés nets sur les bords du verre',L:[['strip','rim',26,44,1.2,80,5600,'none'],['strip','rim',74,44,1.2,80,5600,'none'],['softbox','bg',50,18,1.2,50,5600,'none']]},
 luxe:{fr:'Produit luxe low-key',cat:'produit',d:'Fond sombre, reflets précieux',L:[['strip','key',50,48,3,60,5600,'none'],['strip','rim',70,38,1.2,70,5600,'none'],['fresnel','accent',30,62,1.4,40,3200,'none'],['flag','fill',24,50,1.2,100,5600,'none']]},
 cosmetique:{fr:'Cosmétique pastel',cat:'produit',d:'Doux et lumineux, fond coloré',L:[['octa','key',50,68,1.6,70,5600,'none'],['reflector','fill',34,56,0.8,40,5600,'none'],['reflector','fill',66,56,0.8,40,5600,'none'],['panel','bg',50,16,1,40,5600,'pink']]},
 food:{fr:'Food contre-jour',cat:'produit',d:'Lumière arrière qui fait briller la nourriture',L:[['softbox','key',50,30,1.4,80,5400,'none'],['reflector','fill',50,66,0.8,40,5600,'none']]},
 neon:{fr:'Néon cyberpunk',cat:'creatif',d:'Cyan et magenta, ambiance nuit',L:[['neon','key',24,46,1.6,80,5600,'cyan'],['neon','rim',78,40,1.6,75,5600,'magenta'],['panel','bg',50,12,1.5,30,3200,'purple']]},
 tealorange:{fr:'Teal & orange',cat:'creatif',d:'Look ciné bicolore chaud/froid',L:[['panel','key',32,62,1.8,80,5600,'cto'],['panel','rim',70,32,1.8,70,5600,'teal']]},
 stores:{fr:'Ombres de stores',cat:'creatif',d:'Rayures de lumière façon film noir',L:[['gobo','key',28,62,2.8,90,3800,'none'],['panel','fill',66,66,1.6,20,5600,'ctb']]},
 faisceau:{fr:'Faisceau & fumée',cat:'creatif',d:'Rayon de lumière visible dans la brume',L:[['fresnel','rim',50,24,3,100,5600,'none'],['strip','fill',50,74,1.6,25,5600,'none']]},
 rgb:{fr:'Fête RGB',cat:'creatif',d:'Tubes colorés, énergie de soirée',L:[['tube','key',30,58,1.6,75,5600,'red'],['tube','rim',70,40,1.6,70,5600,'purple'],['tube','accent',52,22,2.2,60,5600,'green']]},
 cinenuit:{fr:'Intérieur nuit ciné',cat:'creatif',d:'Lampe chaude, écran froid, lune par la fenêtre',L:[['practical','key',34,56,1.2,60,2800,'none'],['screen','fill',60,62,1,40,6500,'ctb'],['window','rim',74,30,2.4,40,7000,'none']]},
 goldenback:{fr:'Heure dorée contre-jour',cat:'naturel',d:'Soleil bas derrière le sujet, halo doré',L:[['sun','rim',76,16,1,90,3400,'none'],['reflector','fill',40,70,0.8,45,4000,'none']]},
 midi:{fr:'Plein soleil de midi',cat:'naturel',d:'Soleil zénithal, réflecteur pour déboucher',L:[['sun','key',56,48,4.5,100,5600,'none'],['reflector','fill',48,62,0.5,40,5600,'none']]},
 couvert:{fr:'Ciel couvert doux',cat:'naturel',d:'Lumière enveloppante sans ombres dures',L:[['sky','key',50,40,4.5,70,6500,'none']]},
 fenetre:{fr:'Fenêtre douce',cat:'naturel',d:'Lumière latérale d’une grande fenêtre',L:[['window','key',20,50,1.6,70,5600,'none'],['reflector','fill',76,58,1.2,25,5600,'none']]},
 sousbois:{fr:'Sous-bois filtré',cat:'naturel',d:'Taches de soleil à travers les feuilles',L:[['dappled','key',36,40,4.5,80,5200,'none'],['sky','fill',60,60,4,30,6500,'none']]},
 feu:{fr:'Feu & bougies',cat:'naturel',d:'Lueur chaude et vacillante',L:[['fire','key',40,62,0.6,70,1900,'none'],['fire','accent',60,58,0.6,40,2000,'none']]},
 rueNuit:{fr:'Rue de nuit',cat:'naturel',d:'Lampadaire sodium, ciel nocturne',L:[['street','key',34,40,4,70,2200,'none'],['moon','rim',74,30,4.5,30,7500,'none']]},
 lune:{fr:'Clair de lune',cat:'naturel',d:'Bleu froid, petite lampe chaude',L:[['moon','key',70,30,4.5,55,7500,'none'],['practical','accent',30,62,1.2,30,2800,'none']]},
 heurebleue:{fr:'Heure bleue urbaine',cat:'naturel',d:'Ciel bleu profond, vitrines chaudes',L:[['sky','key',50,30,4.5,60,9000,'none'],['practical','fill',32,64,1.4,40,2800,'none']]},
};

/* ---------- CAMÉRA ---------- */
const BODY = D([
 ['r5','Canon EOS R5','Canon EOS R5','camera'],['a7r5','Sony A7R V','Sony A7R V','camera'],['z8','Nikon Z8','Nikon Z8','camera'],
 ['gfx','Fujifilm GFX 100 II','Fujifilm GFX 100 II medium format','camera'],['x2d','Hasselblad X2D','Hasselblad X2D medium format','camera'],
 ['m11','Leica M11','Leica M11','camera'],['alexa','ARRI Alexa 35','ARRI Alexa 35 cinema camera','video'],['red','RED V-Raptor','RED V-Raptor cinema camera','video'],
 ['fx3','Sony FX3','Sony FX3 cinema camera','video'],['iphone','Smartphone','modern smartphone camera','smartphone'],['gopro','GoPro','GoPro action camera','scan'],
 ['drone','Drone DJI','DJI drone camera','plane'],['film35','Argentique 35 mm','35mm film camera','film'],['rz67','Mamiya RZ67','Mamiya RZ67 medium format film camera','film'],['polaroid','Polaroid','Polaroid instant camera','image'],
]);
const LENS = D([
 ['8','8 mm fisheye','8mm fisheye','',{f:8,fov:180}],['14','14 mm','14mm ultra-wide','',{f:14}],['24','24 mm','24mm wide','',{f:24}],
 ['35','35 mm','35mm','',{f:35}],['50','50 mm','50mm','',{f:50}],['85','85 mm portrait','85mm portrait','',{f:85}],
 ['100m','100 mm macro','100mm macro','',{f:100}],['135','135 mm','135mm telephoto','',{f:135}],['200','200 mm','200mm telephoto','',{f:200}],
 ['400','400 mm','400mm super-telephoto','',{f:400}],['ts24','24 mm tilt-shift','24mm tilt-shift','',{f:24}],['ana50','50 mm anamorphique','50mm anamorphic','',{f:50,ana:1}],
]);
const APS=[1.2,1.4,1.8,2,2.8,4,5.6,8,11,16,22];
const SHUTTER = D([['normal','Normale','', 'circle'],['freeze','Action figée','frozen action at 1/4000s','zap'],['pan','Filé (panning)','panning shot with motion-blurred background','move-horizontal'],['long','Pose longue','long exposure with light trails and silky motion','timer']]);
const FRAMING = D([
 ['xwide','Plan d’ensemble','extreme wide shot','',{k:.32}],['wide','Plan large','wide shot','',{k:.55}],['full','Plan pied','full-body shot','',{k:1}],
 ['cowboy','Plan américain','medium-long shot','',{k:1.45}],['medium','Plan poitrine','medium shot','',{k:2.1}],['mcu','Plan rapproché','medium close-up','',{k:2.9}],
 ['cu','Gros plan','close-up','',{k:4.3}],['xcu','Très gros plan','extreme close-up','',{k:7.5}],['detail','Insert / détail','macro detail shot','',{k:11}],
]);
// angle → hauteur caméra (m), inclinaison (°), roulis
const ANGLE = D([
 ['eye','Hauteur des yeux','eye-level angle','',{z:1.6,tilt:null,roll:0}],['high','Plongée','high angle looking down','',{z:2.8,tilt:null,roll:0}],
 ['low','Contre-plongée','low angle looking up','',{z:0.5,tilt:null,roll:0}],['worm','Ras du sol','worm’s-eye view from the ground','',{z:0.15,tilt:null,roll:0}],
 ['top','Zénithale','top-down flat lay view','',{z:4,tilt:-90,roll:0}],['aerial','Vue aérienne','aerial drone view','',{z:5,tilt:-45,roll:0}],
 ['dutch','Hollandais','dutch tilt angle','',{z:1.6,tilt:null,roll:18}],
]);
const FILM = D([
 ['clean','Numérique propre','','sparkles'],['portra','Kodak Portra 400','Kodak Portra 400 film look, soft grain','film'],['fuji','Fuji Pro 400H','Fujifilm Pro 400H film look, pastel greens','film'],
 ['cinestill','Cinestill 800T','Cinestill 800T film look, halation around highlights','film'],['bw','N&B Tri-X','black and white Kodak Tri-X film, rich grain','contrast'],
 ['ekta','Ektachrome vintage','vintage Ektachrome slide film colors','film'],['tealorange','Étalonnage ciné','cinematic teal and orange color grade','clapperboard'],
 ['polaroid','Instantané Polaroid','Polaroid instant film look, soft faded colors','image'],['vhs','Rétro VHS','retro 90s VHS camcorder look','video'],
]);

/* ---------- SUJETS ---------- */
const KIND = D([['person','Personne','', 'user'],['product','Produit','', 'package'],['animal','Animal','', 'paw-print'],['vehicle','Véhicule','', 'car'],['fantasy','Créature fantaisie','', 'sparkles'],['object','Objet / élément','', 'box']]);
const GENDER = D([['woman','Femme','woman','user'],['man','Homme','man','user'],['girl','Fille','girl','baby'],['boy','Garçon','boy','baby'],['person','Non précisé','person','user']]);
const AGE = {'3-6':'toddler, about 5 years old','7-12':'child, about 10 years old','13-17':'teenager','18-25':'young adult in their early twenties','25-35':'in their late twenties','35-50':'in their forties','50-65':'in their late fifties','65+':'elderly'};
const ORIGIN = D([
 ['highland','Malagasy des Hautes Terres','Malagasy from the Highlands'],['coastal','Malagasy côtier','Malagasy from the coast'],['mg','Malagasy (général)','Malagasy'],
 ['african','Africain','African'],['european','Européen','European'],['asian','Asiatique','East Asian'],['indian','Indien','South Asian'],['arab','Maghrébin / Moyen-Orient','Middle Eastern'],
 ['latino','Latino','Latino'],['mixed','Métisse','mixed-heritage'],
]);
const MORPHO = D([['slim','Mince','slim build'],['average','Moyenne','average build'],['athletic','Athlétique','athletic build'],['muscular','Musclée','muscular build'],['curvy','Ronde','curvy, plus-size build'],['petite','Petite','petite build']]);
const HAIR = D([
 ['short','Courts','short hair','scissors'],['long','Longs lisses','long straight hair','wind'],['curly','Bouclés','curly hair','waves'],['braids','Tresses','braided hair','grip'],
 ['afro','Afro','natural afro hair','cloud'],['shaved','Rasé','shaved head','circle'],['bun','Chignon','hair in a neat bun','circle-dot'],['ponytail','Queue de cheval','ponytail','wind'],
 ['scarf','Foulard / hijab','hair covered by a headscarf','shield'],['hat','Chapeau','wearing a hat','hard-hat'],
]);
const OUTFIT = GRP({
 'Quotidien':[['casual','Jean & t-shirt','wearing casual jeans and a t-shirt','shirt'],['summer','Robe légère','wearing a light summer dress','shirt'],['street','Streetwear','wearing trendy streetwear','shirt'],['smartc','Smart casual','wearing a smart casual outfit','shirt'],['home','Tenue d’intérieur','wearing comfortable homewear','home']],
 'Professionnel':[['business','Costume business','wearing a modern business suit','briefcase'],['office','Chemise & pantalon','wearing a crisp white shirt and tailored trousers','briefcase'],['doctor','Blouse médicale','wearing a white medical coat','stethoscope'],['chef','Tenue de chef','wearing a chef’s jacket and apron','chef-hat'],['worker','Chantier (casque, gilet)','wearing a hard hat and hi-vis safety vest','hard-hat'],['farmer','Agriculteur','wearing practical farm clothes and a straw hat','sprout'],['mechanic','Mécanicien','wearing mechanic overalls','wrench'],['teacher','Enseignant','wearing a teacher’s smart outfit','graduation-cap']],
 'Traditionnel':[['lamba','Lamba blanc','wearing a traditional white Malagasy lamba draped over the shoulders','flower'],['hoany','Lamba hoany coloré','wearing a colorful printed Malagasy lamba hoany','flower'],['salovana','Salovana','wearing a traditional Malagasy salovana wrap','flower'],['satroka','Chapeau de paille malgache','wearing a traditional woven Malagasy straw hat','flower'],['boubou','Boubou africain','wearing a vibrant African boubou','flower']],
 'Sport':[['foot','Football','wearing a football jersey and shorts','volleyball'],['basket','Basketball','wearing a basketball jersey','dribbble'],['run','Running','wearing running gear','footprints'],['rugby','Rugby','wearing a rugby jersey','shield'],['yoga','Yoga / fitness','wearing yoga leggings and a sports top','heart-pulse'],['boxe','Boxe','wearing boxing shorts and gloves','hand'],['cycl','Cyclisme','wearing a cycling kit and helmet','bike'],['swim','Natation','wearing swimwear','waves']],
 'Soirée':[['evening','Robe de soirée','wearing an elegant evening gown','gem'],['tux','Smoking','wearing a black tuxedo','gem'],['wedding','Mariage','wearing wedding attire','heart'],['party','Tenue de fête','wearing a sparkly party outfit','party-popper']],
 'Fantaisie':[['hero','Super-héros','wearing an original superhero costume','zap'],['armor','Armure médiévale','wearing medieval plate armor','shield'],['wizard','Sorcier','wearing a wizard robe','wand-sparkles'],['astro','Astronaute','wearing an astronaut suit','rocket'],['cyber','Cyberpunk','wearing futuristic cyberpunk clothing with LEDs','cpu'],['elf','Elfe','wearing elegant elven clothing','leaf'],['pirate','Pirate','wearing a pirate costume','anchor']],
});
const EXPR = D([
 ['smile','Sourire naturel','natural warm smile','smile'],['bigsmile','Grand sourire','big bright smile','laugh'],['laugh','Éclat de rire','laughing genuinely','laugh'],
 ['confident','Confiant','confident expression','badge-check'],['serious','Sérieux','serious, focused expression','meh'],['pensive','Pensif','pensive, thoughtful expression','brain'],
 ['surprised','Surpris','pleasantly surprised expression','circle-alert'],['amazed','Émerveillé','amazed, wide-eyed expression','sparkles'],['determined','Déterminé','determined expression','target'],
 ['serene','Serein','calm, serene expression','leaf'],['charisma','Charismatique','charismatic, intense gaze','eye'],['tired','Fatigué','tired expression','battery-low'],
 ['worried','Inquiet','worried expression','frown'],['angry','En colère','angry expression','angry'],['love','Amoureux','loving, tender expression','heart'],
]);
const POSE = GRP({
 'Basique':[['standing','Debout','standing','person-standing'],['sitting','Assis','sitting','armchair'],['walking','En marche','walking toward the camera','footprints'],['lookcam','Regard caméra','looking directly into the lens','eye'],['profile','De profil','in profile','user'],['back','De dos','seen from behind','undo-2'],['crossed','Bras croisés','arms crossed','x'],['pockets','Mains dans les poches','hands in pockets','hand'],['lean','Appuyé au mur','leaning against a wall','align-start-vertical'],['lying','Allongé','lying down','bed']],
 'Action & sport':[['running','Court','running dynamically','footprints'],['jump','Saute','jumping in mid-air','arrow-up'],['kick','Frappe le ballon','kicking a football','volleyball'],['dribble','Dribble','dribbling a basketball','dribbble'],['dance','Danse','dancing energetically','music'],['lift','Soulève des poids','lifting weights','dumbbell'],['yogap','Posture de yoga','holding a yoga pose','heart-pulse'],['ride','À vélo / moto','riding a bike','bike']],
 'Avec le produit':[['holding','Tient le produit','holding the product near the face','package'],['drink','Boit','drinking from the product','cup-soda'],['eat','Mange','eating with delight','utensils'],['phone','Utilise son téléphone','using a smartphone','smartphone'],['showing','Montre à la caméra','showing the product to the camera','hand'],['pointing','Pointe du doigt','pointing at the product','pointer']],
 'Mode & éditorial':[['hip','Main sur la hanche','hand on hip, fashion pose','sparkle'],['shoulder','Regard par-dessus l’épaule','looking over the shoulder','undo-2'],['crouch','Accroupi','crouching','arrow-down'],['runway','Défilé','walking like on a runway','footprints'],['face','Main au visage','hand gently touching the face','hand']],
});
const ANIMAL = D([
 ['zebu','Zébu','Malagasy zebu with a large hump and long horns','beef'],['maki','Maki catta (lémurien)','ring-tailed lemur','squirrel'],['sifaka','Propithèque (sifaka)','white sifaka lemur','squirrel'],
 ['chameleon','Caméléon','colorful Parson’s chameleon','bug'],['fossa','Fossa','fossa','cat'],['dog','Chien','dog','dog'],['cat','Chat','cat','cat'],['horse','Cheval','horse','rabbit'],
 ['chicken','Poule','chicken','bird'],['parrot','Perroquet','tropical parrot','bird'],['butterfly','Papillon','butterfly','bug'],['fish','Poisson tropical','tropical fish','fish'],
 ['lion','Lion','lion','cat'],['elephant','Éléphant','elephant','beef'],['turtle','Tortue radiée','radiated tortoise','turtle'],
]);
const ANIMACT = D([['calm','Calme','sitting calmly'],['walk','Marche','walking'],['run','Court','running'],['eat','Mange','eating'],['look','Regarde l’objectif','looking at the camera'],['sleep','Dort','sleeping'],['jumpA','Saute','jumping'],['play','Joue','playing']]);
const VEHICLE = D([
 ['city','Citadine','compact city car','car'],['suv','SUV','SUV','car'],['pickup','Pick-up','pickup truck','truck'],['sport','Sportive','sports car','car-front'],
 ['moto','Moto','motorcycle','bike'],['scooter','Scooter','scooter','bike'],['brousse','Taxi-brousse','colorful Malagasy taxi-brousse minibus','bus'],['bajaj','Bajaj / tuk-tuk','three-wheeled bajaj tuk-tuk','car'],
 ['pousse','Pousse-pousse','traditional Malagasy pousse-pousse rickshaw','bike'],['velo','Vélo','bicycle','bike'],['truck','Camion','truck','truck'],['bus','Bus','city bus','bus'],
 ['pirogue','Pirogue','traditional outrigger pirogue boat','sailboat'],['plane','Avion','airplane','plane'],
]);
const VSTATE = D([['new','Neuf et brillant','brand new and glossy'],['dusty','Poussiéreux','covered in red dust'],['moving','En mouvement','driving at speed with motion blur'],['parked','Garé','parked'],['open','Portes ouvertes','with doors open']]);
const FANTASY = D([
 ['dragon','Dragon','majestic dragon','flame'],['robot','Robot','sleek humanoid robot','bot'],['fairy','Fée','glowing fairy','sparkles'],['unicorn','Licorne','unicorn','star'],
 ['alien','Extraterrestre','friendly alien creature','orbit'],['golem','Golem de pierre','stone golem','mountain'],['mermaid','Sirène','mermaid','fish'],['giantcham','Caméléon géant','giant mythical chameleon','bug'],
 ['phoenix','Phénix','phoenix made of fire','flame'],['spirit','Esprit lumineux','luminous forest spirit','ghost'],
]);
const SURFACE = D([
 ['wood','Table en bois','on a natural wooden table','table'],['plinth','Socle blanc','on a white minimalist plinth','square'],['stone','Pierre','on a rough stone surface','mountain'],
 ['marble','Marbre','on polished marble','gem'],['water','Dans l’eau','partially submerged in splashing water','droplets'],['sand','Sable','on fine sand','waves'],
 ['float','En lévitation','floating in mid-air','arrow-up'],['leaves','Feuillage tropical','surrounded by tropical leaves','leaf'],['ice','Glaçons','surrounded by ice cubes','snowflake'],['hand','Dans une main','held in a hand','hand'],
]);
const CROWD = D([['none','Aucune','','user'],['few','Quelques passants','a few passers-by in the background','users'],['medium','Foule moyenne','a crowd of people in the background, softly out of focus','users'],['dense','Foule dense','a dense bustling crowd surrounding the scene','users']]);
const INTERACT = D([
 ['side','Côte à côte','standing side by side','users'],['face','Face à face','facing each other','arrow-left-right'],['talk','Discutent','talking together','message-circle'],
 ['laughT','Rient ensemble','laughing together','laugh'],['hug','S’enlacent','hugging warmly','heart'],['walkT','Marchent ensemble','walking together','footprints'],
 ['behind','L’un derrière l’autre','one behind the other in depth','layers'],['highfive','Se tapent dans la main','giving a high five','hand'],['share','Partagent le produit','sharing the product','package'],
]);
// emplacements d'images de référence
const REFSLOTS = {
 person:[['faceF','Visage face','scan-face'],['faceP','Visage profil','user'],['faceB','De dos','undo-2'],['top','Haut','shirt'],['bottom','Bas / pantalon','ruler'],['shoes','Chaussures','footprints'],['acc','Accessoire','glasses'],['poseR','Pose de référence','person-standing']],
 product:[['front','Produit face','package'],['backP','Produit dos','package'],['logo','Logo / étiquette','tag'],['pack','Packaging','box']],
 animal:[['refA','Photo de l’animal','paw-print'],['refA2','Autre angle','rotate-3d']],
 vehicle:[['vfront','Face avant','car-front'],['vside','Profil','car'],['vrear','Arrière','car'],['vdetail','Détail / logo','tag']],
 fantasy:[['concept','Concept / croquis','pencil'],['texture','Matière / texture','layers']],
 object:[['refO','Photo de l’objet','box'],['refO2','Autre angle','rotate-3d']],
};
const REFLABEL_EN = {faceF:'face, front view',faceP:'face, profile view',faceB:'head and body seen from behind',top:'top garment',bottom:'trousers / lower garment',shoes:'shoes',acc:'accessory',poseR:'pose reference',front:'product, front',backP:'product, back',logo:'logo / label',pack:'packaging',refA:'the animal',refA2:'the animal, another angle',vfront:'vehicle, front',vside:'vehicle, side profile',vrear:'vehicle, rear',vdetail:'vehicle detail / logo',concept:'concept sketch',texture:'material / texture',refO:'the object',refO2:'the object, another angle'};
const DECORSLOTS=[['bgR','Arrière-plan','image','background environment'],['el1','Élément de décor 1','shapes','set element'],['el2','Élément de décor 2','shapes','set element'],['moodR','Moodboard / ambiance','palette','overall mood and color palette']];

/* ---------- RENDU ---------- */
const RATIO=['1:1','4:5','2:3','3:2','16:9','9:16','21:9','4:3'];
const USAGE = D([['social','Réseaux sociaux','optimized for social media','smartphone'],['ooh','Grand format (affiche)','ultra-high resolution, print-ready for large-format billboard, clean negative space for text','panel-top'],['video','Simulation vidéo','cinematic still frame from a commercial video','clapperboard'],['press','Presse / catalogue','editorial print quality','newspaper'],['web','Bannière web','clean composition for a web banner with space for copy','monitor']]);
const STYLE = D([
 ['ad','Photo publicitaire','high-end advertising photography, photorealistic, ultra-detailed','camera'],['edito','Éditorial magazine','magazine editorial photography, photorealistic','book-open'],
 ['fashion','Mode','high-fashion photography, photorealistic','shirt'],['cine','Cinéma','cinematic film still, photorealistic','clapperboard'],
 ['life','Lifestyle naturel','natural lifestyle photography, candid, photorealistic','heart'],['doc','Reportage','documentary photojournalism','newspaper'],
 ['3d','Rendu 3D','stylized 3D render, soft materials, octane render','box'],['flat','Illustration vectorielle','flat vector illustration, clean shapes, limited palette','pen-tool'],
 ['paint','Peinture','painterly digital painting','palette'],['water','Aquarelle','delicate watercolor illustration','droplets'],['anime','Anime','anime illustration style','sparkles'],
]);
const MODELS = {
 gemini:{n:'Gemini',s:'Nano Banana / Imagen',kind:'natural',refs:true},
 gpt:{n:'ChatGPT',s:'GPT Image · OpenAI',kind:'natural',refs:true},
 flux:{n:'Flux',s:'Black Forest Labs',kind:'natural',refs:true},
 mj:{n:'Midjourney',s:'paramètres --ar',kind:'mj',refs:false},
 sd:{n:'Stable Diffusion',s:'SDXL, tags + négatif',kind:'sd',refs:false},
};
