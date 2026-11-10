# Modèles d'IA Upscayl dans AIsary

Ces fichiers de modèles (`.param` + `.bin`, format ncnn) viennent du projet libre **Upscayl**.
Ils sont exécutés dans le navigateur par le moteur WebGPU d'AIsary (`js/upscayl-engine.js`).

- **Upscayl**, © Nayam Amarshe, TGS963 et les contributeurs d'Upscayl.
  Site : https://upscayl.org · Code : https://github.com/upscayl/upscayl
  Licence : GNU AGPL v3 (voir `LICENSE-Upscayl-AGPL-3.0.txt`).
  Fichiers copiés depuis `resources/models/` du dépôt Upscayl (commit `a00d55f`, mars 2026), sans modification.
- **Real-ESRGAN**, © 2021 Xintao Wang : architecture et recherche à la base de ces modèles.
  Licence : BSD 3-Clause (voir `LICENSE-Real-ESRGAN-BSD-3.txt`).

## Origine et licence de chaque modèle

| Fichier | Nom dans AIsary | Auteur | Usage commercial |
|---|---|---|---|
| `upscayl-standard-4x` | Upscayl Standard | Équipe Upscayl | Oui |
| `upscayl-lite-4x` | Upscayl Lite | Équipe Upscayl | Oui |
| `high-fidelity-4x` | Haute fidélité | Helaman ([4x-HFA2k](https://openmodeldb.info/models/4x-HFA2k)) | Oui, selon Upscayl ; vérifiez la licence de l'auteur |
| `digital-art-4x` | Art numérique | Real-ESRGAN (Xintao Wang) | Oui (BSD 3-Clause) |
| `remacri-4x` | Remacri | Foolhardy ([4x-Remacri](https://openmodeldb.info/models/4x-Remacri)) | **Non** (CC BY-NC-SA 4.0) |
| `ultramix-balanced-4x` | UltraMix équilibré | Kim2091 | **Non** (CC BY-NC-SA 4.0) |
| `ultrasharp-4x` | UltraSharp | Kim2091 ([4x-UltraSharp](https://openmodeldb.info/models/4x-UltraSharp)) | **Non** (CC BY-NC-SA 4.0) |

Upscayl indique lui-même « Non-Commercial » pour Remacri, UltraMix et UltraSharp.
AIsary affiche un avertissement quand l'un de ces trois modèles est choisi.

Merci à toute l'équipe d'Upscayl et aux auteurs des modèles pour leur travail libre.
