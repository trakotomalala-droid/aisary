/*
 * AIsary — par Toky Rakotomalala
 * Copyright (C) 2026 Toky Rakotomalala
 * Licence : GPL-3.0-or-later (voir LICENSE)
 */
/* ================= ONGLET MADAGASCAR ================= */
const MREG = D([
 ['tana','Antananarivo','', 'landmark'],['hautes','Hautes Terres','', 'mountain'],['est','Côte Est','', 'palmtree'],
 ['nord','Nord','', 'compass'],['ouest','Ouest','', 'sunset'],['sud','Sud','', 'sun'],['vie','Vie quotidienne','', 'home']
]);
const MADA = [
 // Antananarivo
 ['analakely','Marché d’Analakely','a lively street market in Analakely, Antananarivo, colorful stalls and white parasols','tana','linear-gradient(135deg,#e8d9b0,#d9543f 40%,#3a6ea5 75%,#f2c94c)'],
 ['tana','Haute-Ville & Rova','the hillside old town of Antananarivo with colorful houses climbing toward the Rova palace','tana','linear-gradient(180deg,#bcd5ec,#e9b48a 45%,#b35c3c 70%,#6f7d4a)'],
 ['ruelleTana','Ruelle de Tana','a narrow cobbled alley in Antananarivo between old brick houses with wooden balconies and hanging laundry','tana','linear-gradient(170deg,#c9b8a0,#9a5a3a 50%,#4a3a30)'],
 ['escaliers','Escaliers de Tana','the steep stone staircases of Antananarivo climbing between colorful houses','tana','linear-gradient(170deg,#d8c8b0,#a86a4a 50%,#6a5a4a)'],
 ['independance','Avenue de l’Indépendance','Avenue de l’Indépendance in Antananarivo with colonial arcades and blooming jacaranda trees','tana','linear-gradient(180deg,#c8d8ea,#b99ad8 40%,#d8c8a8 75%)'],
 ['anosy','Lac Anosy & jacarandas','Lake Anosy in Antananarivo lined with blooming purple jacaranda trees','tana','linear-gradient(180deg,#b9a6e8,#8a6cc8 45%,#7fa6c9 72%)'],
 ['isoraka','Quartier d’Isoraka','the charming Isoraka district of Antananarivo with small cafés and old villas','tana','linear-gradient(160deg,#efe0c8,#c48a5a 55%,#5a6a4a)'],
 ['quartierPop','Quartier populaire','a working-class neighborhood of Antananarivo with red brick houses, narrow paths and children playing','tana','linear-gradient(170deg,#d8b090,#a04a2a 50%,#5a4030)'],
 ['andravoahangy','Marché d’Andravoahangy','the crowded Andravoahangy market in Antananarivo with second-hand clothes and fabric stalls','tana','linear-gradient(135deg,#e0c890,#c84a5a 40%,#4a7ab0 70%,#e8e0c8)'],
 ['soarano','Gare de Soarano','the colonial Soarano train station at the end of Avenue de l’Indépendance, Antananarivo','tana','linear-gradient(180deg,#d8e4ee,#e8d0b0 55%,#8a6a50)'],
 ['taxibe','Arrêt de taxi-be','a busy taxi-be minibus stop in Antananarivo with commuters and street vendors','tana','linear-gradient(170deg,#c8d0d8,#e8c04a 45%,#4a6a8a 75%)'],
 ['mahamasina','Stade de Mahamasina','the Mahamasina stadium in Antananarivo with crowds in the stands','tana','linear-gradient(180deg,#a8c8e8,#3a8a4a 60%,#2a5a2a)'],
 ['tanaNuit','Tana la nuit','the hills of Antananarivo at night with thousands of warm city lights','tana','linear-gradient(180deg,#0a0e24,#1a2448 55%,#e8a84a)'],
 ['tanaPeri','Rizières aux portes de Tana','rice paddies on the outskirts of Antananarivo with the city hills in the distance','tana','linear-gradient(180deg,#b8d0e8,#8ac06a 50%,#4a7a3a 75%)'],
 // Hautes Terres
 ['rizieres','Rizières en terrasses','terraced rice paddies of the Malagasy Highlands, red laterite soil, traditional brick houses in the distance','hautes','linear-gradient(180deg,#a9c8e8,#8fbf6a 45%,#5c8a3a 70%,#9b4a2a)'],
 ['antsirabe','Antsirabe & pousse-pousse','a wide avenue in Antsirabe with colorful pousse-pousse rickshaws','hautes','linear-gradient(170deg,#c8dce8,#e8604a 40%,#3aa0c8 65%,#d8c8a8)'],
 ['zafimaniry','Village zafimaniry','a Zafimaniry village near Ambositra with intricately carved wooden houses','hautes','linear-gradient(170deg,#c8d8c0,#8a6a4a 55%,#4a5a3a)'],
 ['fianar','Vieille ville de Fianarantsoa','the old upper town of Fianarantsoa with churches and cobbled streets','hautes','linear-gradient(180deg,#c8d4e4,#c89a7a 50%,#6a5a50)'],
 ['ambohimanga','Colline d’Ambohimanga','the sacred royal hill of Ambohimanga with stone gates and ancient fig trees','hautes','linear-gradient(180deg,#cfdde9,#8a9a6a 50%,#6b5a44)'],
 ['andringitra','Massif d’Andringitra','the granite peaks of the Andringitra massif above high grasslands','hautes','linear-gradient(180deg,#b8cce0,#8a8a8a 45%,#6a8a4a 75%)'],
 ['betafo','Lacs volcaniques de Betafo','volcanic crater lakes and rice fields around Betafo','hautes','linear-gradient(180deg,#a8c8e0,#3a7a9a 45%,#6aa04a 75%)'],
 ['villageHT','Village des Hautes Terres','a highland village of two-story red clay houses with wooden balconies','hautes','linear-gradient(170deg,#d0dce8,#b85a3a 50%,#7a6a4a)'],
 ['ambalavao','Marché aux zébus d’Ambalavao','the zebu cattle market of Ambalavao with herders and dust','hautes','linear-gradient(170deg,#e8d0a0,#a87a4a 50%,#6a4a30)'],
 // Côte Est
 ['foret','Forêt d’Andasibe','a dense Malagasy eastern rainforest in the style of Andasibe, lush tree ferns, moss-covered trunks, humid hazy air','est','linear-gradient(160deg,#2f6b45,#0f2a1c 60%,#4f7d3f)'],
 ['ranomafana','Cascade de Ranomafana','a misty waterfall in the Ranomafana rainforest, Madagascar','est','linear-gradient(180deg,#cfe6e8,#5e9b7a 45%,#1f4d3a)'],
 ['toamasina','Front de mer de Toamasina','the palm-lined seafront of Toamasina with the Indian Ocean','est','linear-gradient(180deg,#9ad0e8,#3a90b0 50%,#e0d0a8 72%)'],
 ['saintemarie','Île Sainte-Marie','a wild beach on Île Sainte-Marie with coconut palms and turquoise lagoon','est','linear-gradient(180deg,#8ad8e8,#20a8b0 45%,#f0e0b8 70%,#3a7a3a)'],
 ['pangalanes','Canal des Pangalanes','the calm Pangalanes canal with dugout pirogues and dense vegetation','est','linear-gradient(180deg,#b8d8e0,#5a9a8a 50%,#2a5a3a)'],
 ['vanille','Plantation de vanille','a vanilla plantation in the SAVA region with vines climbing on trees','est','linear-gradient(160deg,#a8c890,#3a6a3a 55%,#2a3a20)'],
 ['litchi','Vergers de litchis','litchi orchards heavy with red fruit on the east coast','est','linear-gradient(160deg,#a8d080,#d83a4a 45%,#3a6a2a)'],
 // Nord
 ['nosybe','Plage de Nosy Be','a tropical white-sand beach in Nosy Be, Madagascar, turquoise water, a traditional outrigger pirogue','nord','linear-gradient(180deg,#7fd0e6,#2aa6b8 50%,#f1e3c2 72%)'],
 ['diego','Baie de Diego-Suarez','the bay of Diego-Suarez with the Pain de Sucre islet','nord','linear-gradient(180deg,#a8d8f0,#2a80b0 50%,#c8a870 75%)'],
 ['tsingyRouges','Tsingy rouges','the red sandstone pinnacles of the Tsingy Rouges near Diego-Suarez','nord','linear-gradient(170deg,#f0c8a0,#d0603a 50%,#8a3a20)'],
 ['ambre','Montagne d’Ambre','the lush cloud forest of Montagne d’Ambre with waterfalls','nord','linear-gradient(170deg,#c0d8c8,#3a7a4a 50%,#1a3a2a)'],
 ['ankarana','Ankarana','the grey limestone canyons and caves of Ankarana','nord','linear-gradient(170deg,#c8c8c0,#7a7a70 50%,#3a4a30)'],
 ['cacao','Plantation de cacao','a cacao plantation in the Sambirano valley near Ambanja','nord','linear-gradient(160deg,#a8b880,#6a4a2a 50%,#2a3a1a)'],
 // Ouest
 ['baobab','Allée des Baobabs','the Avenue of the Baobabs near Morondava, Madagascar, giant baobab trees lining a red dirt road','ouest','linear-gradient(180deg,#f7c27c,#e07b3c 58%,#7a3518)'],
 ['tsingy','Tsingy de Bemaraha','the razor-sharp limestone pinnacles of Tsingy de Bemaraha, Madagascar','ouest','linear-gradient(170deg,#c8c2b4,#7d776c 55%,#3d4a33)'],
 ['mahajanga','Bord de mer de Mahajanga','the seafront of Mahajanga with its giant baobab and sunset over the Mozambique Channel','ouest','linear-gradient(180deg,#f0b080,#e07050 45%,#3a80a0 72%)'],
 ['kirindy','Forêt de Kirindy','the dry deciduous forest of Kirindy','ouest','linear-gradient(170deg,#d8c8a0,#8a7a4a 55%,#4a4a2a)'],
 ['morondavaPlage','Plage de Morondava','the beach of Morondava with fishing pirogues at sunset','ouest','linear-gradient(180deg,#f8b070,#f07a4a 45%,#d8c0a0 72%)'],
 // Sud
 ['isalo','Canyon de l’Isalo','the sandstone canyons and golden grass plains of Isalo National Park, Madagascar','sud','linear-gradient(180deg,#f0c98a,#c1723a 50%,#d8b45a 75%)'],
 ['ifaty','Village vezo d’Ifaty','a Vezo fishing village in Ifaty with outrigger pirogues and turquoise sea','sud','linear-gradient(180deg,#8ad8e8,#30b0c0 45%,#f0e0c0 70%)'],
 ['toliara','Rues de Tuléar','a sunny street in Toliara with zebu carts and pousse-pousse','sud','linear-gradient(170deg,#f0e0b8,#d8a060 50%,#8a6a4a)'],
 ['fortdauphin','Fort-Dauphin','the beaches and green mountains of Fort-Dauphin (Taolagnaro)','sud','linear-gradient(180deg,#a8d0e8,#3a90a0 45%,#e8d8b8 65%,#4a7a3a)'],
 ['epineuse','Forêt épineuse','the spiny forest of southern Madagascar with octopus trees','sud','linear-gradient(170deg,#e8d8b0,#9aa060 50%,#5a5a30)'],
 ['anakao','Plage d’Anakao','the white dunes and clear lagoon of Anakao','sud','linear-gradient(180deg,#a0e0f0,#40c0d0 45%,#f8f0d8 70%)'],
 // Vie quotidienne
 ['village','Village de pêcheurs','a Malagasy coastal fishing village with palm-thatched huts and outrigger pirogues on the sand','vie','linear-gradient(180deg,#8fd3e8,#5fb7c9 40%,#d8c59a 66%,#7a5a33)'],
 ['rn7','Route & taxi-brousse','a Malagasy national road winding through the highlands, a colorful taxi-brousse minibus','vie','linear-gradient(180deg,#a7c7e7,#7aa35a 50%,#a2532d 80%)'],
 ['hotely','Gargote / hotely','a small Malagasy roadside hotely restaurant with wooden benches and a hand-painted sign','vie','linear-gradient(160deg,#e8c890,#a8603a 55%,#4a3a2a)'],
 ['epicerie','Épicerie de quartier','a small neighborhood grocery shop in Madagascar with colorful products stacked behind a counter','vie','linear-gradient(160deg,#f0d080,#c84a3a 45%,#3a6aa0 75%)'],
 ['zoma','Marché de village','a weekly village market in Madagascar with fruits, vegetables and woven baskets','vie','linear-gradient(135deg,#e8d090,#80b040 40%,#d86a3a 70%)'],
 ['cuisineRurale','Cuisine au feu de bois','a rural Malagasy kitchen with a wood fire, clay pots and smoke','vie','linear-gradient(160deg,#4a3a30,#a8603a 50%,#f0a050)'],
 ['ecole','École de brousse','a rural school in Madagascar with a wooden blackboard and children at benches','vie','linear-gradient(160deg,#e8e0c8,#a8b080 55%,#6a5a40)'],
 ['eglise','Église de village','a brick village church on a hill in the Malagasy countryside','vie','linear-gradient(180deg,#c8d8e8,#c08060 55%,#6a8a4a)'],
 ['footQuartier','Terrain de foot de quartier','a dusty neighborhood football field with makeshift goals','vie','linear-gradient(180deg,#c8d8e8,#d8a870 55%,#8a5a3a)'],
 ['manioc','Champ de manioc','a cassava field with farmers working the red earth','vie','linear-gradient(180deg,#b8d0e8,#6a9a4a 50%,#a0502a 80%)'],
 ['lacPeche','Pêche au lac','fishermen casting nets from pirogues on a calm Malagasy lake','vie','linear-gradient(180deg,#d8e0e8,#7aa0b0 50%,#3a5a5a)'],
].map(([id,fr,en,reg,sw])=>({id,fr,en,cat:'mada',reg,sw}));
BG.splice(0,BG.length,...BG.filter(b=>b.cat!=='mada'),...MADA);
Object.keys(BGM).forEach(k=>delete BGM[k]);BG.forEach(b=>BGM[b.id]=b);
delete BGCAT.mada;
BGCAT.mada={fr:'Madagascar',ic:'map'};

/* ---------- AJOUTS SUJETS ---------- */
const ACCESS = D([
 ['glasses','Lunettes de vue','wearing glasses','glasses'],['sunglasses','Lunettes de soleil','wearing sunglasses','glasses'],['watch','Montre','wearing a wristwatch','watch'],
 ['jewels','Bijoux dorés','wearing gold jewelry','gem'],['earrings','Boucles d’oreilles','wearing earrings','sparkle'],['necklace','Collier','wearing a necklace','gem'],
 ['handbag','Sac à main','carrying a handbag','shopping-bag'],['backpack','Sac à dos','wearing a backpack','backpack'],['cap','Casquette','wearing a cap','hard-hat'],
 ['headphones','Casque audio','wearing headphones','headphones'],['earbuds','Écouteurs','wearing wireless earbuds','headphones'],['umbrella','Parapluie','holding an umbrella','umbrella'],
 ['scarfA','Écharpe','wearing a scarf','wind'],['phoneA','Smartphone en main','holding a smartphone','smartphone'],['tie','Cravate','wearing a tie','briefcase'],
 ['basket','Panier tressé','carrying a woven basket','shopping-basket'],['flowers','Bouquet de fleurs','holding a bouquet of flowers','flower-2'],['bike','Vélo à la main','pushing a bicycle','bike'],
]);
Object.assign(INTERACT, D([
 ['handshake','Se serrent la main','shaking hands','handshake'],['toast','Trinquent','raising their glasses in a toast','wine'],['selfie','Font un selfie','taking a selfie together','smartphone'],
 ['danceT','Dansent ensemble','dancing together','music'],['runT','Courent ensemble','running together','footprints'],['meal','Partagent un repas','sharing a meal at a table','utensils'],
 ['teach','L’un montre à l’autre','one showing or teaching something to the other','presentation'],['playT','Jouent ensemble','playing together','gamepad-2'],['whisper','Se chuchotent','whispering a secret','ear'],
 ['sameDir','Regardent au loin','looking in the same direction into the distance','eye'],['backtoback','Dos à dos','standing back to back','arrow-left-right'],['family','Portrait de famille','posing for a family portrait','home'],
 ['couple','Couple romantique','as a romantic couple, close and tender','heart'],['carry','L’un porte l’autre','one carrying the other on the back','arrow-up'],['argue','Débattent','having a lively debate','message-circle'],
 ['solo','Chacun dans son monde','each absorbed in their own activity','user'],
]));
REFSLOTS.person.splice(3,0,['hairR','Coiffure','scissors']);
REFLABEL_EN.hairR='hairstyle';
