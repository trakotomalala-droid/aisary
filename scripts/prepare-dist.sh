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
echo "dist/ prêt"
