#!/usr/bin/env bash
# Prépare le dossier dist/ pour l'application de bureau :
# copie l'interface et télécharge les bibliothèques pour un usage hors connexion.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist && mkdir -p dist/vendor
cp -R index.html css js assets dist/
curl -fsSL "https://cdn.jsdelivr.net/npm/lucide@0.460.0/dist/umd/lucide.min.js" -o dist/vendor/lucide.min.js
curl -fsSL "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" -o dist/vendor/jszip.min.js
sed -i.bak \
  -e 's#https://cdn.jsdelivr.net/npm/lucide@0.460.0/dist/umd/lucide.min.js#vendor/lucide.min.js#' \
  -e 's#https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js#vendor/jszip.min.js#' \
  dist/index.html
rm -f dist/index.html.bak
# Upscale IA : moteur pré-chargé si possible (le modèle se télécharge à la 1re utilisation)
curl -fsSL "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js" -o dist/vendor/tf.min.js || echo "tfjs : téléchargé à la demande"
curl -fsSL "https://cdn.jsdelivr.net/npm/upscaler@1.0.0-beta.19/dist/browser/umd/upscaler.min.js" -o dist/vendor/upscaler.min.js || echo "upscaler : téléchargé à la demande"
echo "dist/ prêt"
