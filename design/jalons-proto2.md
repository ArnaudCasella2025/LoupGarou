# Prototype 2 — suivi des jalons

Décisions du GDD § 14 validées par le joueur le 03/10 (« c'est parti ») : plus de privé à distance, sans Voyante par défaut, prologue du mouton, brouillard, gel de la version chat.

## J0 — maquette statique (03/10)

Artefact : https://claude.ai/artifact/9kgaJ8bazacR5VZJ2ABqba (privé). Sources : `proto2/`.

Livré :
- `carte.js` : 7 lieux, 11 chemins, lignes de vue orientées (la Grange n'est vue de nulle part), 8 maisons avec leur fenêtre, lisière ; plus court chemin. Données pures, testées sous Node (`cd proto2 && node --test tests/*.test.js` : 6 tests).
- `plan.js` : rendu SVG sans bibliothèque à partir d'une projection du juge (jamais l'état complet) : lieu du juge, lieux en vue, brouillard hachuré, fantômes (dernière position vue), apartés, « bouche » (on parle sans être entendu), traces numérotées, stèles, voile de nuit, maison du juge éclairée ; bulles en calque HTML, en bandeau au téléphone ; pastille « +n » quand un lieu est plein ; « Plan en liste » pour l'accessibilité ; lieux, jetons et traces focusables au clavier.
- `app.js`, `maquette.json` : trois moments d'exemple (aube, midi, nuit), fiche au toucher, chronique.

Vérifications :
- Playwright (Chromium) 1440 × 900 et 390 × 844, clair et sombre : aucun débordement horizontal, aucune erreur de script, modules chargés en local.
- **Modules ES dans l'artefact multi-fichiers** : publiés et servis (`app.js`, `carte.js`, `plan.js`, `maquette.json`). Le chargement réel dans le cadre de l'artefact se lit sur la page : ligne « Modules chargés. » sous le plan (sinon message rouge au bout de 4 s → repli sur une page assemblée).
- **Appels Claude de l'artefact (`sample`)** : pas de sortie contrainte par schéma JSON (lecture tolérante seulement) ; pas de cache de préfixe (seulement la relecture d'un appel identique pendant 5 min). Piste pour J2 : un « outil » à `inputSchema` comme sortie structurée (les appels avec outils ne sont pas mis en cache et chaque tour est facturé : à mesurer). Le budget du GDD ne dépendait pas de ces deux points.

Reste pour J1 : moteur v3 (`moteur.js`, `perception.js`, `projection()`), routines, déplacements du juge au toucher, traces calculées, conseil du soir, sauvegarde v3, agents factices et simulation de 1 000 parties sans fuite.
