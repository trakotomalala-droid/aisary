# Contribuer à AIsary

Merci de vouloir améliorer AIsary ! Vous n'avez pas besoin d'être développeur pour aider.

## Sans coder

- **Proposer une idée ou signaler un problème** : ouvrez une *Issue* sur GitHub (onglet « Issues », puis « New issue »). Décrivez ce que vous avez fait, ce que vous attendiez et ce qui s'est passé. Une capture d'écran aide beaucoup.
- **Proposer des décors, des lumières ou des tenues** : décrivez-les dans une Issue, en français ou en malagasy. Pour un décor, donnez son nom et une courte description de ce qu'on y voit.

## En codant

AIsary est écrit en HTML, CSS et JavaScript simples, sans outil de compilation.

| Fichier | Contenu |
|---|---|
| `index.html` | La structure de la page |
| `css/aisary.css` | Les styles |
| `js/data.js` | Les listes : décors, lumières, caméras, tenues, poses… |
| `js/mada.js` | Les décors de Madagascar et les ajouts de sujets |
| `js/app.js` | L'état de la scène, le plateau, le viseur et le prompt |
| `js/panel.js` | Les panneaux de réglages |
| `js/brand.js` | Le logo, l'écran de bienvenue et « À propos » |

Pour tester, ouvrez simplement `index.html` dans un navigateur.

### Ajouter un décor

Dans `js/mada.js` (Madagascar) ou `js/data.js` (monde), ajoutez une ligne au tableau :

```js
['identifiant','Nom affiché en français','description in English for the prompt','categorie','linear-gradient(...)'],
```

La description anglaise est celle qui part dans le prompt : soyez précis sur ce qu'on voit.

### Envoyer vos modifications

1. Faites un *fork* du dépôt.
2. Faites vos changements dans une nouvelle branche.
3. Ouvrez une *Pull Request* en expliquant ce que vous avez changé.

## Règles

- Restez respectueux et bienveillant.
- En contribuant, vous acceptez que votre travail soit publié sous licence GPL v3 ou ultérieure.
- Gardez le crédit de l'auteur original, Toky Rakotomalala, dans le logiciel et la documentation.
