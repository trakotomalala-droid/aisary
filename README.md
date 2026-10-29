<p align="center">
  <img src="assets/logo.svg" width="120" alt="Logo AIsary">
</p>

<h1 align="center">AIsary</h1>
<p align="center"><em>par Toky Rakotomalala</em></p>
<p align="center"><strong>Composez vos images IA comme sur un vrai plateau photo.</strong><br>
Logiciel libre et gratuit, créé à Madagascar.</p>

---

## Tongasoa ! (Bienvenue)

**AIsary** aide les créatifs et les designers à créer des images avec l'IA sans perdre de temps à écrire des prompts.
On compose la scène comme sur un plateau : le décor, l'ambiance, les lumières, la caméra, les sujets.
AIsary écrit ensuite le prompt, adapté au modèle d'image choisi.

« Sary » veut dire « image » en malagasy.

AIsary a été créé par **Toky Rakotomalala**, directeur artistique à Madagascar, d'abord pour les créatifs et les designers malagasy, et il est ouvert à tous.

> Soyez créatifs. La seule limite, c'est vous. — *Toky Rakotomalala*

## Ce que fait AIsary

- **Décors** : une soixantaine de décors du monde, et un onglet **Madagascar** avec 57 décors par région (Antananarivo, Hautes Terres, Côte Est, Nord, Ouest, Sud, vie quotidienne).
- **Ambiance** : moment de la journée, météo, climat et pays, température de couleur, ambiance.
- **Lumières** : 29 kits prêts à l'emploi, du studio au naturel, 25 types de lumière, kits personnels enregistrables.
- **Caméra** : boîtiers, objectifs, ouverture, vitesse, valeur de plan, angle, hauteur, inclinaison, rendu pellicule.
- **Sujets** : jusqu'à 3 sujets et une foule ; personnes, produits, animaux, véhicules, créatures, objets ; images de référence (visage, tenue, accessoires…).
- **Plateau** : vues de dessus (Z), de face (X) et de côté (Y), avec des réglages au clic.
- **Viseur** : aperçu de la composition en direct.
- **Prompt** : adapté à Gemini, ChatGPT (GPT Image), Flux, Midjourney et Stable Diffusion.
- **Export** : récapitulatif de la scène, prompt modifiable, dossier de projet prêt à importer dans votre modèle, ou génération directe avec une clé API.
- **Projets** : un projet par image, sauvegardés dans le navigateur et exportables en fichier `.aisary`.
- **Barres de prompt** dans chaque catégorie pour écrire librement.

## Utiliser AIsary

- **Version web** : [trakotomalala-droid.github.io/aisary](https://trakotomalala-droid.github.io/aisary/) (Chrome ou Edge recommandés).
- **Applications Mac et Windows** : [télécharger la dernière version](https://github.com/trakotomalala-droid/aisary/releases/latest)
  - Mac (Intel et Apple Silicon) : fichier `.dmg`. Au premier lancement, clic droit sur AIsary > Ouvrir. Si macOS dit que l'appli est endommagée : `xattr -cr /Applications/AIsary.app` dans le Terminal.
  - Windows : fichier `-setup.exe`. Si Windows SmartScreen s'affiche : « Informations complémentaires » > « Exécuter quand même ».
- **En local** : téléchargez ce dépôt et ouvrez `index.html` dans votre navigateur.

### Fabriquer les applications

Les applications sont fabriquées automatiquement par GitHub Actions (Tauri) à chaque changement de `version` dans `src-tauri/tauri.conf.json`, ou à la main depuis l'onglet **Actions** > « Applications Mac et Windows » > **Run workflow**. Les fichiers sont publiés dans **Releases**.

## Feuille de route

- [x] Prototype : composition de la scène et génération du prompt
- [x] Onglet Madagascar, catégories, barres de prompt, images de référence
- [x] Interrupteur **Avec API / Sans API**
- [x] Mode sans API : export d'un dossier par projet (prompt + images de référence renommées), ou ZIP
- [x] Mode avec API : gestion des clés, choix du modèle, génération Gemini et OpenAI
- [x] Accueil, projets, enregistrement et réouverture des scènes (.aisary)
- [x] Guide de démarrage et visite guidée
- [ ] Vue 3D de la scène
- [x] Applications Mac et Windows (Tauri, fabrication automatique)
- [ ] Export PSD par calques et vectoriel

## Contribuer

Toute aide est bienvenue : nouveaux décors, kits de lumière, traductions, corrections, idées.
Lisez [CONTRIBUTING.md](CONTRIBUTING.md) pour savoir comment faire.

## Soutenir AIsary

AIsary est gratuit et le restera. Si l'outil vous fait gagner du temps, vous pouvez soutenir son développement.
- **MVola** : `+261 38 71 559 16` (Toky Rakotomalala)
- **GitHub Sponsors** : bientôt disponible pour les dons depuis l'étranger.

Misaotra ! (Merci !)

## Licence

AIsary est distribué sous licence **GNU GPL v3 ou ultérieure**. Voir [LICENSE](LICENSE).

Vous pouvez utiliser, modifier et partager AIsary librement. Toute version modifiée doit rester libre, sous la même licence, et conserver le crédit de l'auteur original : **Toky Rakotomalala**.

Copyright © 2026 Toky Rakotomalala

---

## English

**AIsary** by Toky Rakotomalala is a free, open-source tool that lets creatives compose AI images like on a real photo set: background, mood, lights, camera and subjects. It then writes a prompt tailored to the chosen image model (Gemini, GPT Image, Flux, Midjourney, Stable Diffusion). "Sary" means "image" in Malagasy.

Created in Madagascar by art director Toky Rakotomalala, first for Malagasy creatives and designers, and open to everyone.

Licensed under the GNU GPL v3 or later. Contributions are welcome, see [CONTRIBUTING.md](CONTRIBUTING.md).
