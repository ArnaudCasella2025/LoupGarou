# Expérience et interface — prototype 2 (spatialisation 2D)

Principe directeur : **le plan est le lieu du jeu, le fil est sa mémoire**. Au proto 1, le joueur n'avait qu'un signal (qui parle, qui se tait) et lynchait les discrets. Au proto 2, il regarde *où vont les gens et avec qui* ; le texte vient confirmer ou contredire ce qu'il a vu. Toute information spatiale est **vue** (positions, rencontres, traces) ; toute parole n'est **entendue** que sur place.

## 1. Disposition de l'écran

**Ordinateur (≥ 1100 px)** : plan à gauche (≈ 58 %), fil à droite (≈ 42 %, 380 px minimum). Le registre de gauche du proto 1 disparaît : les jetons sur le plan *sont* le registre. Le carnet d'enquête s'ouvre en tiroir par-dessus le fil (touche `E`), jamais par-dessus le plan, pour pouvoir comparer carnet et positions.

```
+--------------------------------------------------------------------------+
| La Veillée   (soleil) Jour 2 · Midi [###--]   ●●○ 2 élim.   Carnet  Pause |
+-------------------------------------------+------------------------------+
|                 PLAN (SVG)                |  FIL                [Ici|Tout]|
|   [Chapelle]      [Puits]     [Forge]     |  -- Jour 2, matin --          |
|       C            M  L                   |  (M) Marc : Léa ment sur...   |
|            \       |        /             |  [Puits] Léa et Marc ...      |
|   [Grange]---- ( FEU ) ----[Lavoir]       |  [MP de Léa] Je t'ai vu à... |
|      H . . S       (A)                    |                              |
|            /       |        \             |                              |
|   [Lisière]      [Moulin]    [Maison]     |                              |
|   x empreintes                            +------------------------------+
|  [rejouer : matin > midi]   légende (?)   | [@Tous v] Parle...  [Envoyer]|
|                                           | [Attendre]  [Éliminer...]    |
+-------------------------------------------+------------------------------+
```

**Entre 760 et 1100 px** : même grille, fil réduit à 340 px ; le carnet remplace le fil (comportement actuel conservé).

**Téléphone (< 760 px)** : plan en haut, collé, à 40 % de la hauteur (`40svh`), fil dessous, champ de saisie collé en bas. Une poignée sous le plan bascule entre trois hauteurs : bande (72 px, jetons en rangée avec icône de lieu), normal (40 %), plein écran (le fil passe en dernière bulle seule). Le carnet est une feuille montante plein écran.

```
+---------------------------+
| J2 · Midi ●●○   ☰   ‖    |
+---------------------------+
|   PLAN (40svh)            |
|  [Pui] M L    [Forge]     |
|      (FEU) A   S          |
|  [Grange] H   [Lisière]x  |
+------------ = ------------+  <- poignée
| (M) Marc : Léa ment...    |
| [MP de Léa] Je t'ai vu... |
| ...                       |
+---------------------------+
| [@Tous] Parle...      [>] |
| [Attendre] [Carnet] [...] |
+---------------------------+
```

## 2. Représentation du plan

**Style : minimaliste illustré, tout en SVG inline.** Pas de tuiles ni d'images : chaque lieu est une zone aux coins arrondis (fond `--soft`, contour `--line`) portant un pictogramme de 24 px tracé en chemins SVG (puits, croix, enclume, gerbe, vague, roue de moulin, arbres, toit), et son nom en toutes lettres en `--f-display`. Les chemins sont des traits pointillés. Plan fixe à **7 lieux** autour du **Feu** central (lieu public) : Chapelle, Puits, Forge, Grange, Lavoir, Moulin, Lisière. Disposition 3×3 avec le feu au centre : lisible au téléphone, aucun défilement, aucun zoom. Poids visé : < 25 ko de SVG.

**Jetons** : on reprend les portraits du proto 1 (forme + couleur + initiale, `p0`…`p6`), en 34 px sur ordinateur, 28 px au téléphone, prénom en étiquette dessous (masquée en mode bande). L'humain : carré cerclé d'encre, initiale, petite lanterne. Plusieurs jetons dans un lieu se rangent en arc. Mort : jeton éteint (gris, `opacity .45`), barré d'une croix, laissé une journée à l'endroit de la mort, puis remplacé par une petite stèle portant l'initiale.

**Bulles** : au-dessus du jeton, une ligne tronquée à ~45 caractères, 6 s, puis réduite en pastille `…` cliquable (ouvre le message dans le fil). Au plus 3 bulles ouvertes à la fois ; les suivantes attendent. Les bulles n'apparaissent que pour les paroles que l'humain **entend** (même lieu, ou Feu pour tout le monde). Hors de portée : pas de bulle, un pictogramme « bouche » sans texte.

**Indicateurs** (chacun doublé d'une forme ou d'un texte, jamais la couleur seule) :

| État | Marque visuelle | Équivalent non coloré |
|---|---|---|
| Parle | anneau épais autour du jeton | bulle ou pictogramme bouche |
| Chuchote (aparté) | deux jetons rapprochés reliés par un arc pointillé | icône « chut », `[Aparté]` dans le fil |
| Privé reçu de lui | enveloppe en coin du jeton | `[MP de …]` dans le fil |
| S'est déplacé ce moment | traînée pointillée qui s'efface en 2 s, flèche au départ | ligne « Marc va au Puits » dans le fil |
| Réfléchit | trois points animés sous le jeton | texte « réfléchit » pour lecteur d'écran |
| Ta note | petit badge `?`, `!` (suspect), `✓` (sûr) | lettre dans le badge |

**Traces nocturnes** : à l'aube, des pictogrammes posés sur les lieux : empreintes de pattes, porte entrouverte, lanterne abandonnée, terre retournée, tissu déchiré. Chaque trace porte un numéro (①②③) repris dans le carnet ; on les touche pour lire une phrase du meneur (« Des empreintes mènent de la Lisière vers le Lavoir »).

**Clair / sombre** : le plan utilise uniquement les jetons de couleur déjà existants. La nuit (phase) n'est pas le thème sombre : c'est un voile `color-mix(--ink 35 %)` sur le plan plus un halo autour du Feu, dans les deux thèmes. Contrastes du texte vérifiés ≥ 4.5:1 sur `--soft`.

**Accessibilité** : le SVG porte `role="img"` et un résumé ; à côté, un bouton « Plan en liste » donne une liste structurée (« Puits : Marc, Léa — se parlent à l'écart »). Lieux et jetons sont focusables (`tabindex`), annoncés par `aria-live="polite"` en fin de moment (« 3 déplacements, 1 aparté »). `prefers-reduced-motion` : déplacements instantanés, traînées statiques.

## 3. Interactions de l'humain

Règle : **le plan sert à choisir, le champ de saisie sert à dire.** Chaque action est faisable au plan, au clavier et dans le fil.

| Action | Ordinateur | Téléphone | Clics |
|---|---|---|---|
| Se déplacer | clic sur un lieu | tap lieu → bouton « Y aller » | 1 / 2 |
| Écouter | être dans le lieu (automatique) ; filtre « Ici » du fil | idem | 0 |
| Interpeller en public | `@Marc` dans le champ, ou clic jeton → « Interpeller » | tap jeton → « Interpeller » | 2 + texte |
| Message privé | clic jeton → « Privé » (destinataire pré-rempli) | tap jeton → « Privé » | 2 + texte |
| Laisser le temps passer | bouton « Attendre » | idem | 1 |
| Noter (?/suspect/sûr) | clic sur le badge du jeton | tap long jeton → badges | 1 / 2 |
| Éliminer | clic jeton → « Éliminer » → confirmer | idem | 3 |
| Carnet | bouton ou `E` | bouton « Carnet » | 1 |

Se déplacer **consomme le moment** (comme envoyer un message) : on ne peut pas faire le tour des lieux pour tout entendre. On peut cependant écrire et partir dans la même action (« Je vais voir Léa au Lavoir » + clic Lavoir = un seul moment). Un privé ne demande pas d'être au même endroit ; en revanche, un privé envoyé à quelqu'un dans le même lieu est vu des autres présents comme un aparté avec toi. L'élimination convoque tout le village au Feu (animation de rassemblement, 1,5 s), puis la sentence s'affiche.

Menu du jeton : petite carte ancrée (pas un menu radial, illisible au doigt) : prénom, personnalité, lieu actuel, ta note, et quatre boutons de 44 px : Interpeller · Privé · Son trajet · Éliminer (rouge, séparé).

**Raccourcis clavier** (actifs hors du champ de saisie, listés par `?`) : `1`–`8` aller au lieu n ; `Tab`/`Maj+Tab` parcourir les jetons, `Entrée` ouvre la carte ; `/` focus du champ ; `@` dans le champ propose les prénoms ; `Espace` attendre ; `M` privé au jeton sélectionné ; `E` carnet ; `R` rejouer le jour ; `Maj+P` pause ; `Échap` ferme ou annule.

## 4. Temps et attente

**Un jour = 5 moments** : Aube, Matin, Midi, Après-midi, Crépuscule. L'horloge de l'en-tête montre le soleil qui avance sur un arc à 5 crans. Chaque action de l'humain (parler, se déplacer, attendre) fait passer un moment. Au Crépuscule, tout le monde rejoint le Feu et l'humain doit éliminer ou passer la journée ; il peut éliminer avant à tout moment. Ce plafond remplace le « micro-tour » abstrait et donne au jour un début, un milieu et une fin.

**Masquer la latence (3 à 10 s)** en trois couches :
1. **Immédiat (0 ms)** : l'action de l'humain s'exécute sans attendre l'IA : son jeton marche (700 ms), son message entre dans le fil, le soleil avance d'un cran.
2. **Attente** : chaque jeton IA affiche ses trois points ; les jetons du lieu de l'humain tournent la tête vers lui (petit décalage de 2 px). Une jauge discrète « 4 / 7 ont décidé » remplit l'horloge.
3. **Restitution mise en scène** : quand toutes les réponses sont là, on les joue en séquence : d'abord tous les déplacements ensemble (800 ms), puis les apartés (arcs), puis les paroles une à une (1,2 s par bulle). Clic, `Espace` ou tap n'importe où : passer la mise en scène. Réglage « Rythme : posé / rapide / instantané ».

Les réponses ne sont jamais montrées avant d'être toutes validées (les relances restent invisibles, sauf une ligne discrète « Hugo hésite… » si l'attente dépasse 12 s).

**Nuit** : plan voilé, humain chez lui, 3 à 4 s de nuit muette (le Feu baisse, un hurlement en texte « Au loin, un chien aboie. »). Aucune position affichée la nuit. À l'aube, les traces apparaissent une à une avant le résumé.

**Pause** : bouton et `Maj+P` ; disponible même pendant un appel (l'appel termine, la restitution attend la reprise). Pause automatique si l'onglet est caché.

## 5. Carnet d'enquête spatial et résumé d'aube

Le carnet a quatre onglets :

**Chronologie (onglet par défaut)** : une ligne par personnage, une colonne par moment (5 par jour, défilement horizontal par jour). Chaque case = pictogramme + initiale du lieu où le personnage se trouvait ; case grisée « ? » la nuit. Les rencontres sont des cases encadrées reliant deux lignes. Clic sur une case : le plan revient à ce moment (mode « rejouer », bandeau « Tu regardes Jour 2 · Matin — Revenir au présent »).

**Alibis** : pour chaque mort et chaque trace, « qui était le plus près au Crépuscule », puis **ce que chacun a dit de sa nuit**. Quand une IA affirme un lieu (« j'étais au Moulin »), le moteur l'enregistre comme revendication de lieu ; le carnet la pose face à ce que l'humain a vu (« dit : Moulin · vu au Crépuscule : Lisière »). Le carnet ne juge pas : il juxtapose, et le joueur tire la conclusion.

**Qui vise qui** : la matrice du proto 1, conservée telle quelle (elle fonctionne).

**Rencontres et revendications** : la liste des apartés devient une liste datée et localisée (« J2 Midi · Grange · Hugo et Sophie »), et les revendications de rôle restent groupées par joueur.

**Son trajet** (depuis la carte du jeton) : surligne sur le plan la trajectoire du personnage sur la journée, flèches numérotées par moment.

**Résumé d'aube** : n'est plus un `details` dans le fil mais une **séquence de 3 cartes** sur le plan, 15 s au plus, à passer d'un tap : (1) la mort : jeton tombé à son lieu, rôle si révélé ; (2) les traces, numérotées, avec leur phrase ; (3) « Hier » : 3 lignes max (qui a été le plus visé, apartés remarqués, qui s'est déplacé vers la future victime). Il est ensuite rangé dans le fil en carte repliée, comme au proto 1.

## 6. Onboarding des premiers tours

Diagnostic : au jour 1 du proto 1, il n'y a ni mort, ni trace, ni historique ; le seul signal est le style de parole. Le proto 2 doit offrir **trois prises dès le premier jour**.

1. **Prologue « L'arrivée » (Jour 1, Aube)** : les huit arrivent au village par des chemins différents ; l'humain voit qui vient d'où. La nuit 0 a laissé **une trace sans mort** (un mouton égorgé à la bergerie près de la Lisière, des empreintes). Première question naturelle : « Qui est arrivé par la Lisière ? » (à valider avec le game design).
2. **Tutoriel en 3 gestes**, bulles du meneur ancrées sur le plan, chacune disparaît dès que le geste est fait : « Touche un lieu pour t'y rendre » → « Ici, tu entends tout. Ailleurs, tu vois seulement qui se parle » → « Touche un jeton pour lui écrire en privé ». Rien d'autre n'est expliqué avant le Midi du Jour 1. Bouton « Je connais » pour tout sauter ; option « Première partie » cochée par défaut au premier lancement.
3. **Questions-amorces** : au Jour 1 et au Jour 2, trois puces au-dessus du champ, construites à partir de faits observés et neutres sur les rôles (« Léa, que faisais-tu à la Grange avec Hugo ? », « Qui est passé par la Lisière ce matin ? »). Un tap remplit le champ, modifiable. Elles disparaissent dès le Jour 3 (désactivables). C'est le soutien explicite du goût du joueur pour la provocation : elles sont écrites pour faire réagir.
4. **Pas de jargon** : chaque terme de règle (aparté, trace, alibi, revendication) est souligné en pointillé et donne sa définition au survol ou au tap.

## 7. Proto 1 : garder, changer, supprimer

**Garder** : jetons forme + couleur + initiale ; jetons de thème et palette `--c0…c6` ; fil avec lignes du meneur, privés bordés de `--candle`, apartés en italique ; compteur d'enjeu (pastilles) et son conseil « passer ne coûte rien » ; confirmation d'élimination avec conséquence chiffrée ; matrice « qui vise qui » ; notes ?/suspect/sûr ; sauvegarde, reprise, écran de pause ; débrief final (rôles, dossier du loup, carnets secrets), **enrichi d'un rejeu du plan** montrant aussi les déplacements nocturnes du loup.

**Changer** : registre latéral → jetons du plan + bande du téléphone ; sélecteurs « destinataire » et « suspect à éliminer » → carte du jeton et `@prénom` ; micro-tours numérotés → moments du jour ; résumé d'aube en tableau → séquence sur le plan ; « Laisser parler » → « Attendre » ; « Apartés remarqués » → onglet Rencontres localisé ; fil → filtre « Ici / Tout » (par défaut : Tout, les paroles hors de portée y apparaissent comme « Marc parle au Puits »).

**Supprimer** : la ligne technique « Seuil de parole : 42 (3 voulaient parler) » et le nom du modèle sous la table (déplacés dans un panneau « Détails techniques » de la pause) ; les statistiques « parlé n · visé n » sous chaque nom (le silence n'est plus le signal principal, et ce chiffre nourrissait le lynchage des discrets) ; le bloc « Silencieux en public » du carnet, pour la même raison.

## Points ouverts pour le game design

- Positions de jour toutes visibles (choix de cette section) ou brouillard au-delà des lieux voisins ?
- Le loup se déplace-t-il la nuit sur le plan (traces calculées par le moteur) ou les traces sont-elles tirées au sort autour de la victime ?
- 5 moments × 7 IA ≈ 35 appels par jour : à confronter au budget mesuré au proto 1.
