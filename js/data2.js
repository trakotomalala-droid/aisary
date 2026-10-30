/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= V2 : TYPES DE PROJETS, PACKSHOT, PAYSAGES ================= */
const PTYPES={
 human:{fr:'Personnages',d:'Portraits, mode, lifestyle : un, deux ou trois personnages, avec ou sans foule.',ic:'users',accent:'#ffd23a'},
 product:{fr:'Packshot',d:'Mettre un produit en valeur : boisson, boîte, cosmétique, voiture… avec splash, fruits et effets.',ic:'package',accent:'#2ee6ff'},
 scene:{fr:'Paysages',d:'Décors, nature morte et environnements idylliques, sans personnage principal.',ic:'mountain',accent:'#3dff8f'},
};

/* ---------- éléments de décor (mode Personnages) : ils font aussi apparaître des poses adaptées ---------- */
const DPROPS=D([
 ['chair','Chaise','a chair','armchair'],['stool','Tabouret de bar','a bar stool','armchair'],['sofa','Canapé','a sofa','sofa'],['bench','Banc','a bench','rectangle-horizontal'],
 ['table','Table','a table','table'],['desk','Bureau','a desk with a laptop','laptop'],['stairs','Escaliers','a staircase','align-end-horizontal'],['wall','Mur','a wall to lean on','brick-wall'],
 ['bed','Lit','a bed','bed'],['swing','Balançoire','a swing','circle-dashed'],['tree','Arbre','a large tree','tree-deciduous'],['railing','Rambarde','a railing','fence'],
 ['bar','Comptoir de bar','a bar counter','beer'],['car','Voiture','a parked car','car'],['moto','Moto','a motorcycle','bike'],['bike','Vélo','a bicycle','bike'],
 ['umbrella','Parapluie / parasol','an umbrella','umbrella'],['plants','Plantes','lush green plants','sprout'],['mirror','Miroir','a large mirror','square'],['microphone','Micro sur pied','a microphone on a stand','mic'],
]);

/* ---------- PACKSHOT ---------- */
const PKTYPE=D([
 ['bottle','Bouteille / boisson','a beverage bottle','milk'],['can','Canette','a soda can','cup-soda'],['glass','Verre / cocktail','a glass drink','wine'],['carton','Brique (lait, jus)','a carton of milk or juice','package'],
 ['cosmetic','Flacon cosmétique','a cosmetic bottle','flask-conical'],['perfume','Parfum','a perfume bottle','spray-can'],['jar','Pot / crème','a cosmetic jar','cylinder'],['box','Boîte / packaging','a product box','box'],
 ['pouch','Sachet / paquet','a snack pouch','shopping-bag'],['phone','Smartphone / tech','a smartphone','smartphone'],['watch','Montre / bijou','a luxury watch','watch'],['shoe','Chaussure','a sneaker','footprints'],
 ['bag','Sac / maroquinerie','a leather handbag','shopping-bag'],['car','Voiture','a car','car'],['moto','Moto / scooter','a motorbike','bike'],['food','Plat / aliment','a dish of food','utensils'],
 ['snack','Chocolat / biscuit','a chocolate bar','cookie'],['appliance','Électroménager','a home appliance','refrigerator'],['other','Autre produit','the product','package'],
]);
const PKMAT=D([
 ['clear','Verre transparent','clear glass','glass-water'],['amber','Verre ambré','amber glass','glass-water'],['frosted','Verre givré','frosted glass','snowflake'],['glossy','Plastique brillant','glossy plastic','sparkles'],
 ['matte','Finition mate','matte finish','circle'],['metal','Métal brossé','brushed metal','disc'],['chrome','Chrome','polished chrome','disc'],['gold','Doré','gold metal','gem'],
 ['kraft','Papier kraft','kraft paper','scroll'],['card','Carton','printed cardboard','box'],['ceramic','Céramique','ceramic','cylinder'],['leather','Cuir','leather','briefcase'],['wood','Bois','natural wood','tree-pine'],
 ['condens','Gouttes de condensation','covered in fresh condensation droplets','droplets'],['label','Étiquette face caméra','label facing the camera','tag'],['open','Bouchon ouvert','with the cap open','circle-off'],
]);
const PKSPLASH=D([
 ['water','Eau','a crystal clear water splash','droplets'],['milk','Lait','a creamy milk splash','milk'],['orange','Jus d’orange','an orange juice splash','citrus'],['mango','Jus de mangue','a mango juice splash','citrus'],
 ['litchi','Jus de litchi','a litchi juice splash','cherry'],['choco','Chocolat','a melted chocolate splash','cookie'],['coffee','Café','a coffee splash','coffee'],['wine','Vin rouge','a red wine splash','wine'],
 ['yogurt','Crème / yaourt','a thick creamy yogurt splash','cloud'],['soda','Soda pétillant','a fizzy soda splash with bubbles','cup-soda'],['honey','Miel','a slow golden honey drip','droplet'],
 ['crown','Couronne de liquide','a liquid crown splash around the base','crown'],['frozen','Splash figé (glacé)','a frozen splash sculpture','snowflake'],['drops','Gouttes en suspension','droplets suspended in mid-air','droplets'],
]);
const PKFRUIT=D([
 ['mango','Mangue','mango slices','citrus'],['pineapple','Ananas','pineapple chunks','citrus'],['lime','Citron vert','lime wedges','citrus'],['lemon','Citron','lemon slices','citrus'],
 ['orange','Orange','orange slices','citrus'],['strawberry','Fraise','strawberries','cherry'],['litchi','Litchi','fresh litchis','cherry'],['banana','Banane','banana slices','banana'],
 ['coconut','Noix de coco','halved coconuts','circle'],['passion','Fruit de la passion','passion fruit halves','circle-dot'],['raspberry','Framboise','raspberries','cherry'],['blueberry','Myrtille','blueberries','grape'],
 ['grape','Raisin','grapes','grape'],['apple','Pomme','apple slices','apple'],['watermelon','Pastèque','watermelon slices','citrus'],['vanilla','Gousses de vanille','Madagascar vanilla pods','leaf'],
 ['cinnamon','Cannelle','cinnamon sticks','leaf'],['mint','Menthe','fresh mint leaves','leaf'],['ginger','Gingembre','ginger root','sprout'],['cocoa','Fèves de cacao','cocoa beans','bean'],
 ['coffeebean','Grains de café','coffee beans','bean'],['chili','Piment','red chili peppers','flame'],
]);
const PKFX=D([
 ['ice','Glaçons','ice cubes','snowflake'],['steam','Fumée / vapeur','soft steam and smoke','cloud-fog'],['powder','Explosion de poudre colorée','an explosion of colored powder','sparkles'],['bubbles','Bulles','floating bubbles','circle-dot'],
 ['petals','Pétales de fleurs','flower petals','flower'],['leaves','Feuilles','green leaves flying','leaf'],['sparks','Étincelles / particules','glowing particles and sparks','sparkle'],['glitter','Paillettes','glitter','sparkles'],
 ['snow','Neige','falling snow','snowflake'],['sand','Sable en suspension','flying sand','waves'],['rays','Rayons de lumière','volumetric light rays','sun'],['bokeh','Bokeh lumineux','glowing bokeh lights','circle'],['rain','Gouttes de pluie','rain drops','cloud-rain'],
]);
/* environnements packshot (catégorie de décor) */
BG.push(...[
 ['pk_water','Surface d’eau (mare)','a calm water surface with soft ripples and mirror reflections','packshot','linear-gradient(180deg,#0e2a3a,#1f6a86 55%,#9fd8e8)'],
 ['pk_rocks','Rochers mouillés','wet dark rocks with water droplets','packshot','linear-gradient(170deg,#3a4448,#1a2024 60%,#5a6a70)'],
 ['pk_leaves','Feuillage tropical','lush tropical leaves around the product','packshot','linear-gradient(160deg,#1f5a2e,#0e2a18 55%,#5ea84a)'],
 ['pk_marble','Dalle de marbre','a polished white marble slab','packshot','linear-gradient(160deg,#f4f2ee,#d8d4cc 60%,#b8b2a8)'],
 ['pk_wood','Table en bois','a rustic wooden tabletop','packshot','linear-gradient(170deg,#c48a5a,#7a4a2a 60%,#4a2a18)'],
 ['pk_podium','Podiums géométriques pastel','pastel geometric podiums and shapes','packshot','linear-gradient(160deg,#f6c9d6,#c9d8f6 55%,#f2e8c8)'],
 ['pk_concrete','Podium en béton','a raw concrete podium','packshot','linear-gradient(170deg,#a7a49e,#6f6c66 60%,#4a4844)'],
 ['pk_future','Décor futuriste néon','a futuristic sci-fi set with neon light strips and reflective floor','packshot','linear-gradient(160deg,#08081a,#3a1a8a 50%,#1ad0e0)'],
 ['pk_holo','Hologrammes','a holographic iridescent environment','packshot','linear-gradient(120deg,#b8f0ff,#e8b8ff 40%,#fff0b8 70%,#b8ffd8)'],
 ['pk_space','Espace / cosmos','outer space with stars and a nebula','packshot','radial-gradient(circle at 60% 40%,#5a2a8a,#0a0418)'],
 ['pk_clouds','Nuages','floating among soft clouds','packshot','linear-gradient(180deg,#bfe0ff,#ffffff 60%,#e8f0ff)'],
 ['pk_kitchen','Plan de travail cuisine','a bright kitchen counter','packshot','linear-gradient(160deg,#f6f2ea,#d8cfc0 55%,#8a7a64)'],
 ['pk_bar','Comptoir de bar','a moody bar counter with bottles in the background','packshot','linear-gradient(160deg,#3a2418,#140c08 60%,#c88a3a)'],
 ['pk_beach','Sable de plage','fine beach sand with sea in the background','packshot','linear-gradient(180deg,#8ad8e8,#30b0c0 40%,#f0e0c0 65%)'],
 ['pk_vanilla','Plantation de vanille','a Madagascar vanilla plantation','packshot','linear-gradient(160deg,#a8c890,#3a6a3a 55%,#2a3a20)'],
 ['pk_moss','Mousse de forêt','soft forest moss and ferns','packshot','linear-gradient(170deg,#4a7a3a,#1f3a1a 60%,#7aa05a)'],
 ['pk_ice','Glace / caverne gelée','an ice cave with frozen crystals','packshot','linear-gradient(170deg,#e8f6ff,#8ac8e8 55%,#3a6a8a)'],
 ['pk_city','Ville de nuit','a city skyline at night out of focus','packshot','linear-gradient(170deg,#0a0e24,#1a2448 55%,#e8a84a)'],
].map(([id,fr,en,cat,sw])=>({id,fr,en,cat,sw})));
BGCAT.packshot={fr:'Packshot',ic:'package'};
BG.forEach(b=>BGM[b.id]=b);

/* ---------- PAYSAGES ---------- */
const SCSTYLE=D([
 ['idyllic','Idyllique / paradisiaque','idyllic, paradise-like','palmtree'],['real','Réaliste','photorealistic','camera'],['mystic','Mystique','mystical','moon'],['fantasy','Fantastique','fantasy','wand-sparkles'],
 ['dreamy','Onirique','dreamlike, surreal','cloud'],['cinema','Cinématographique','cinematic','clapperboard'],['minimal','Minimaliste','minimalist','square'],['retro','Rétro','retro vintage','film'],
 ['fairytale','Conte de fées','fairytale','castle'],['postapo','Post-apocalyptique','post-apocalyptic','flame'],
]);
const SCELEM=GRP({
 'Végétation':[['palms','Palmiers','palm trees','palmtree'],['baobabs','Baobabs','baobab trees','tree-deciduous'],['ravinala','Ravinala (arbre du voyageur)','ravinala traveller’s palms','palmtree'],['flowers','Fleurs sauvages','wildflowers','flower'],
  ['bamboo','Bambous','bamboo','sprout'],['ferns','Fougères','tree ferns','leaf'],['blossom','Arbres en fleurs','blossoming trees','flower-2'],['cactus','Cactus','cacti','sprout'],['vines','Lianes','hanging vines','leaf'],['moss','Mousse','moss','leaf']],
 'Eau':[['waterfall','Cascade','a waterfall','droplets'],['lake','Lac miroir','a mirror-like lake','waves'],['river','Rivière','a winding river','waves'],['sea','Mer turquoise','a turquoise sea','waves'],
  ['wavesE','Vagues','crashing waves','waves'],['stream','Ruisseau','a small stream','droplet'],['mistw','Brume sur l’eau','mist over the water','cloud-fog']],
 'Architecture':[['mgHouse','Maison traditionnelle malgache','a traditional Malagasy house','home'],['hut','Cabane en bois','a wooden cabin','home'],['ruins','Ruines anciennes','ancient ruins','landmark'],
  ['bridge','Pont en pierre','a stone bridge','landmark'],['lighthouse','Phare','a lighthouse','lamp'],['temple','Temple','a temple','landmark'],['villageE','Village','a small village','house'],['futurecity','Ville futuriste','a futuristic city','building-2']],
 'Ciel':[['rainbow','Arc-en-ciel','a rainbow','rainbow'],['aurora','Aurore boréale','an aurora','sparkles'],['milkyway','Voie lactée','the milky way','star'],['dramaclouds','Nuages dramatiques','dramatic clouds','cloud'],
  ['firesky','Coucher de soleil flamboyant','a flaming sunset sky','sunset'],['bigmoon','Lune géante','a giant moon','moon']],
 'Faune':[['lemurs','Lémuriens','lemurs','squirrel'],['birds','Oiseaux','birds in flight','bird'],['butterflies','Papillons','butterflies','bug'],['zebus','Zébus','zebus','beef'],['fishE','Poissons','fish','fish'],['chameleons','Caméléons','chameleons','bug']],
 'Nature morte':[['vase','Vase de fleurs','a vase of flowers','flower'],['fruitbowl','Corbeille de fruits','a bowl of fruit','apple'],['books','Livres anciens','old books','book'],['candles','Bougies','lit candles','flame'],
  ['pottery','Poteries','clay pottery','cylinder'],['basket','Panier tressé','a woven basket','shopping-basket'],['drape','Tissu drapé','draped fabric','wind'],['winebottle','Bouteille de vin','a bottle of wine','wine'],
  ['shells','Coquillages','seashells','shell'],['instruments','Instruments de musique (valiha)','musical instruments including a Malagasy valiha','music']],
 'Échelle':[['tiny','Petite silhouette humaine','a tiny human silhouette for scale','person-standing']],
});
const SCCOMP=D([
 ['thirds','Règle des tiers','rule of thirds composition','grid-3x3'],['sym','Symétrie','perfectly symmetrical composition','flip-horizontal'],['lowhz','Horizon bas (ciel dominant)','low horizon with a dominant sky','arrow-down'],
 ['highhz','Horizon haut (sol dominant)','high horizon with a dominant foreground','arrow-up'],['path','Chemin qui mène au loin','a leading path drawing the eye into the distance','route'],
 ['frame','Cadre naturel (arche, branches)','framed by natural elements like branches or an arch','frame'],['vanish','Point de fuite central','central vanishing point','crosshair'],['pano','Panorama','wide panoramic composition','panel-top'],
]);

/* ---------- groupes à trois personnes ---------- */
const INTERACT3=D([
 ['trio_line','Côte à côte','standing side by side in a line','users'],['trio_shoulders','Bras sur les épaules','arms around each other’s shoulders','users'],['trio_jump','Sautent ensemble','jumping together in the air','arrow-up'],
 ['trio_walk','Marchent ensemble','walking together toward the camera','footprints'],['trio_sofa','Assis sur un canapé','sitting together on a sofa','sofa'],['trio_toast','Trinquent','raising their glasses together','wine'],
 ['trio_selfie','Selfie à trois','taking a group selfie','smartphone'],['trio_team','Mains au centre','stacking their hands in the center like a team','hand'],['trio_family','Famille (deux adultes et un enfant)','posing as a family with a child in the middle','home'],
 ['trio_talk','Discutent en cercle','talking together in a circle','message-circle'],['trio_laugh','Rient ensemble','laughing together','laugh'],['trio_depth','Échelonnés en profondeur','staggered in depth, one behind the other','layers'],['trio_dance','Dansent ensemble','dancing together','music'],
]);
INTERACT.walkhand={fr:'Main dans la main',en:'walking hand in hand',ic:'heart'};
INTERACT.armarm={fr:'Bras dessus, bras dessous',en:'walking arm in arm',ic:'users'};
INTERACT.parentchild={fr:'Parent et enfant',en:'a parent with a child',ic:'baby'};
INTERACT.seller={fr:'Vendeur et client',en:'a seller handing a product to a customer',ic:'shopping-bag'};
INTERACT.interview={fr:'Interview',en:'an interviewer holding a microphone to the other person',ic:'mic'};
INTERACT.phoneT={fr:'Regardent un téléphone',en:'looking at a smartphone together',ic:'smartphone'};
INTERACT.benchT={fr:'Assis sur un banc',en:'sitting together on a bench',ic:'rectangle-horizontal'};
INTERACT.fistbump={fr:'Check du poing',en:'giving a fist bump',ic:'hand'};
INTERACT.chase={fr:'Course-poursuite joyeuse',en:'playfully chasing each other',ic:'footprints'};
const INTER_ALL=()=>Object.assign({},INTERACT,INTERACT3);

/* ---------- références supplémentaires ---------- */
REFLABEL_EN.handR='hand reference (skin tone, manicure)';
const PKFRUITSLOTS=[1,2,3,4,5,6].map(n=>['pk.f'+n,'Fruit '+n,'apple']);

STYLE.pack={fr:'Packshot studio',en:'commercial product photography, packshot, photorealistic, ultra-detailed, crisp details',ic:'package'};
STYLE.land={fr:'Photo de paysage',en:'award-winning landscape photography, photorealistic, ultra-detailed',ic:'mountain'};
/* Madagascar en premier dans les catégories de décor */
(()=>{const c={...BGCAT};Object.keys(BGCAT).forEach(k=>delete BGCAT[k]);['mada','nature','urbain','interieur','studio','packshot','fantaisie'].forEach(k=>{if(c[k])BGCAT[k]=c[k]})})();
