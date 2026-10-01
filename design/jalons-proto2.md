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

## Pivot : temps réel (03/10)

Retour du joueur sur la maquette J0 : « ça ne donne pas trop envie de jouer ». Proposition retenue : un jeu en temps réel. J1 (tour par tour) est suspendu.

### Prototype de sensation v1

Artefact : https://claude.ai/artifact/AFFu7x5m8JaVmgnBgQeRgq (privé). Source : `proto-sensation/hameau-vivant.html` (page unique, canvas, aucune IA).

Question testée : **est-ce que le village vivant donne envie de jouer ?**
- Une journée ≈ 3 min 30 (07:00 → 18:50), cloche à 18:15, conseil à la Place, nuit de 30 s, aube.
- Le juge marche (clic, flèches/ZQSD), voit à 430 unités (brume au-delà) et entend à 165 (cercle pointillé). Le soir, la lanterne et le feu percent l'obscurité.
- 7 villageois scriptés suivent les routines par personnalité du GDD, se croisent, discutent en bulles (« … » si trop loin pour entendre). Le paranoïaque se tait et s'éloigne quand le juge approche.
- Les paroles sont tirées des faits simulés (qui a vu qui, où, quand ; pas entendus la nuit). Le loup ment toujours sur sa rencontre avec la victime ; les villageois oublient parfois (20 %).
- Interroger un villageois : 6 questions ; le temps ralentit (×0,15) pendant l'échange. Le carnet note vu / entendu / réponses / nuits et relève une contradiction quand une réponse dément ce que le juge a vu.
- Nuit : vue sur sa maison et sa fenêtre ; le loup marche de chez lui à la victime (règle du repérage), les chiens aboient par quartier, une silhouette passe parfois devant la fenêtre ; au matin, empreintes colorées selon le dernier lieu traversé.
- Prologue : mouton égorgé à la bergerie, empreintes vers le quartier du loup.

Vérifié : partie accélérée jour → conseil → nuit → aube sans erreur, ordinateur 1440 × 900 et téléphone 390 × 844, pas de débordement horizontal.
