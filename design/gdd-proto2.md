# La Veillée du Loup-Garou — GDD du prototype 2 (spatialisation 2D)

Version 1 · 03/10 · Équipe : game design, UX/UI, design des IA, tech design ; synthèse et arbitrages : direction.
Détail de chaque métier dans `design/annexes/` (game-design, ux-ui, ia, tech). Ce document fait foi en cas de désaccord avec une annexe.

---

## 1. Pourquoi un proto 2

Le prototype 1 (chat puis page web, 4 séries de validation) a prouvé que des IA Claude tiennent une partie de Loup-Garou lisible, résistent aux manipulations du juge et que le loup sait mentir. Il a aussi montré trois limites structurelles, qu'aucune correction de prompt n'a levées :

| Limite du proto 1 | Symptôme mesuré |
|---|---|
| **La parole est le seul signal.** | Bouc émissaire de style : le premier qui organise ou le plus discret est lynché (Camille visée 8 fois pour son silence, série 4). Le loup se cache dans le consensus. |
| **Sans Voyante, rien ; avec elle, tout.** | Sans Voyante : 1 défaite, 1 victoire « de chance ». Avec : la partie se résume à « croire la Voyante », qui parle sans risque en privé. |
| **Premiers tours sans prise.** | Jour 1 à l'aveugle ; le joueur compense en provoquant les IA. |

Coût et fiabilité restent à améliorer : 60 à 114 appels par partie, 130 à 560 k tokens d'entrée, relances autour de 19 % (objectif < 10 %).

**Le proto 2 ajoute ce que les mots ne peuvent pas effacer : où chacun était, avec qui, et ce que la nuit a laissé.**

## 2. Pitch et piliers

> Le hameau, vu de dessus, devient le plateau. Sept villageois IA vont et viennent entre la forge, le moulin et la taverne ; tu les suis avec ta lanterne, seul juge du village. Chaque nuit le Loup traverse le hameau pour dévorer, et son trajet laisse des traces que les mots n'effacent pas.

1. **Les pas ne mentent pas, les bouches si.** Le moteur produit des faits de position vrais ; les IA (le loup surtout) peuvent mentir à leur sujet, et ces mensonges deviennent vérifiables.
2. **On ne voit que ce qu'on regarde.** L'attention du juge est la ressource du jeu : être à la forge, c'est ne pas voir le moulin.
3. **Le modèle parle, le moteur marche.** Trajets, perception et traces sont calculés par des règles ; le modèle ne décide que des paroles, des soupçons et d'une intention.
4. **Des indices contestables, jamais des preuves.** Tout indice spatial a une explication innocente possible ; c'est la parole qui départage.

Invariants hérités du proto 1 : un seul humain, toujours villageois, seul juge, ne meurt pas ; un loup parmi 7 IA ; le texte du joueur est de la parole en jeu ; aucune information cachée ne fuit vers l'écran ni vers une IA non témoin ; révélation des rôles à la fin seulement.

## 3. Le hameau

Un écran, sans défilement ni zoom : **7 lieux** en grille 3 × 3 autour de la Place, plus les maisons en périphérie.

```
   [Chapelle]      [Taverne]       [Forge]
        \             |             /
   [Grange] ------ ( PLACE ) ------ [Moulin]
        /             |             \
   (lisière)       [Lavoir] ~~~~~~ (rivière)
   maisons Ouest                  maisons Est
```

| Lieu | Voisins | Fonction de jeu | Trace laissée |
|---|---|---|---|
| **Place** (feu de veillée) | tous | Aube et conseil du soir : seul lieu où la parole est publique pour tout le village. Voit la Taverne et la Chapelle. | boue |
| **Taverne** | Place, Forge | Bruyante : on y parle à plusieurs ; on peut y surprendre un aparté voisin. | bière renversée |
| **Forge** | Place, Taverne, Moulin | Point de vue sur la Place et les maisons Est. | suie |
| **Moulin** | Place, Forge, Lavoir | Isolé ; se voit avec le Lavoir. | farine |
| **Lavoir** | Place, Moulin, Grange | Le bruit de l'eau empêche d'écouter. | eau |
| **Grange** | Place, Lavoir, Chapelle | Fermée : on voit qui entre, pas ce qui s'y dit. Le lieu des apartés. | paille |
| **Chapelle** | Place, Grange | On y veille le mort ; seul endroit où examiner le corps. | cire |

La **lisière** n'est pas un lieu de jour : c'est un passage nocturne. Chaque **maison** est attribuée et connue ; sa **fenêtre** donne sur un lieu, affiché sur le plan, ce qui rend les témoignages nocturnes vérifiables.

**Perception (binaire, la même pour le juge et les IA)** :

| Où est l'observateur | Voit qui est là | Entend la parole « à tous » | Voit les apartés |
|---|---|---|---|
| Même lieu | oui | oui | oui (contenu réservé aux deux) |
| Lieu en vue (lignes de vue fixes, dessinées sur le plan) | oui | non | oui, sans contenu |
| Lieu traversé | « X est passé vers… » | — | — |
| Ailleurs | non : le plan garde la dernière position vue, estompée (« fantôme ») | non | non |

Arbitrage : **brouillard** au-delà des lignes de vue (game design), contre « tout visible » (UX). Sans brouillard, se déplacer et écouter ne sont plus de vrais choix. Le plan ouvert reste une variante de calibrage (§ 11).

## 4. Le temps : une journée en 5 moments

```
Aube (Place) → Matin → Midi → Après-midi → Conseil du soir (Place) → Nuit
```

- **Aube** : tout le monde à la Place. Le meneur annonce la victime, sa maison, les traces numérotées. Chaque IA réagit (un tour de parole) et fixe son intention de la journée.
- **Matin, Midi, Après-midi** : chacun suit sa routine (§ 7) ; le juge choisit une action par moment (§ 5). Dans chaque moment, la parole n'existe que **dans un lieu** : seules les scènes où le juge est présent sont jouées en entier.
- **Conseil du soir** : tout le village à la Place. On réutilise la mécanique de parole du proto 1 (seuil d'envie, 2 à 3 micro-tours), puis interpellation : l'accusé doit répondre. Le juge élimine ou passe.
- **Nuit** : chacun chez soi ; le loup trace son chemin, les veilleurs entendent, la Voyante (si elle est là) sort.

**Le temps n'avance que quand le joueur agit** (aucun temps réel) : la pause est triviale et la latence des IA n'est jamais une pénalité.

**Prologue, la veillée (soir 0).** Les huit arrivent au hameau par des chemins différents (le juge voit qui vient d'où), deux moments de déplacement libre autour du feu, puis une première nuit : le loup égorge un **mouton** à la lisière et laisse une trace. Pas de mort humaine (on garde 8 vivants et l'équilibre des chances), mais dès l'aube 1 il y a des rencontres à examiner et une trace à expliquer. Le jour 1 « à l'aveugle » disparaît.

## 5. Le juge : 7 verbes

Une action par moment ; **parler est gratuit** et se combine avec l'action (dans la limite de 2 répliques par moment, pour tenir le budget).

| Verbe | Effet | Coût / limite |
|---|---|---|
| **Aller** | rejoindre un lieu voisin (on peut écrire en partant) | le moment |
| **Parler** | à tous les présents, ou en aparté à une personne présente (l'aparté est vu) | gratuit, 2 répliques par moment |
| **Écouter** | depuis un lieu voisin, entendre une phrase d'un aparté (impossible au Lavoir et à la Grange) ; 30 % d'être repéré | le moment |
| **Convoquer** | un joueur abandonne sa routine et rejoint le juge au moment suivant | 1 par jour |
| **Examiner** | les bottes d'un présent (boue, farine… de la nuit *ou* de la veille), ou le corps à la Chapelle (côté d'entrée, heure approximative) | 2 par jour |
| **Sonner le conseil** | avance le conseil ; les moments restants sont perdus pour tous | — |
| **Éliminer** | au conseil, après la réplique de l'accusé ; ou passer | — |

**Plus de message privé à distance**, pour personne. Parler en privé suppose d'être ensemble, donc d'être vu. C'est le changement qui rend la Voyante risquée et les manœuvres du loup observables. Le goût du joueur pour l'interpellation et la provocation est préservé : il va chercher les IA (Convoquer, Aller), et l'aparté avec lui devient un acte public.

Le moteur **ne désigne jamais de suspect** : il juxtapose ce qui a été vu et ce qui a été dit ; le juge conclut.

## 6. La nuit et les indices

**Règle du repérage** (centrale) : le loup ne peut dévorer qu'un joueur avec qui il a partagé un lieu pendant au moins un moment depuis l'aube précédente ; l'aube et le conseil ne comptent pas. Chaque mort désigne donc un **ensemble de suspects** : ceux qui ont croisé la victime. Le juge en a vu une partie, les témoins complètent, le loup ment. Ses parades : croiser beaucoup de monde, ou croiser sa victime à la Grange, où personne ne compte les présents.

**Le chemin du loup.** Le moteur propose 3 itinéraires précalculés, risque affiché (« par la Place : boue, 2 chiens ; par le Moulin : farine, fenêtre de Camille »). Le modèle arbitre un risque, il ne calcule pas de chemin.

**Fuites tirées par le moteur** (calibrées, jamais nominatives) :

| Indice | Fréquence | Qui le perçoit | Ambiguïté |
|---|---|---|---|
| Trace au seuil de la victime, liée à un lieu du chemin | 70 % des nuits | annoncée à l'aube | désigne un lieu, pas une personne |
| Chiens qui aboient sur le chemin | toujours | maisons voisines | direction seulement |
| Veilleur : « des pas vers le Moulin, peu après minuit » | paranoïaque 40 %, discret 25 %, autres 10 % | le veilleur | direction, jamais un nom |
| Bottes marquées le lendemain | 20 % | qui examine ou remarque | un villageois du même quartier peut avoir la même marque |
| Évitement de la maison de la victime le matin | 50 % | les présents | beaucoup n'y vont pas non plus |

**Calibrage garanti** avant chaque tirage : l'ensemble des joueurs compatibles avec la mort et les traces **contient toujours le loup et compte au moins 3 personnes la nuit 1, au moins 2 la nuit 2**. Sinon la trace est déplacée vers un lieu plus fréquenté. Deux nuits recoupées donnent un vrai signal, jamais une preuve au jour 1.

**La Voyante marche.** Pour sonder, elle va la nuit à la fenêtre de sa cible : elle peut être entendue et laisse des traces (fausse piste possible). Pour transmettre sa vision, elle doit rejoindre le juge, et l'aparté est vu : le loup sait qui viser. **Mode par défaut : sans Voyante** ; l'espace doit suffire. Variante à calibrer : le **Guetteur**, qui surveille un lieu par nuit et voit des silhouettes sans nom.

## 7. Les IA dans l'espace

**Partage des décisions** : le modèle décide de ce qui se dit et de qui il soupçonne ; le moteur décide de tout ce qui se mesure.

| Décision | Qui | Pourquoi |
|---|---|---|
| Paroles, `vise` + `motif`, revendications | modèle | cœur du jeu ; le modèle y est solide |
| Interlocuteur parmi les présents | modèle | acte social qui a du sens |
| Intention `ensuite` (aller, suivre) | le modèle propose, le moteur applique selon la personnalité | jamais de trajet écrit par le modèle |
| Victime et chemin du loup | modèle, parmi les cibles autorisées et 3 chemins | choix fermé, toujours valide |
| Trajets, routines, perception, traces, gestes | moteur | coût nul, fiable, testable |

**Routines par personnalité** (lieux pondérés par moment, 15 % d'aléa, probabilité d'obéir à `ensuite`) :

| Personnalité | Matin | Midi | Après-midi | Réaction |
|---|---|---|---|---|
| Meneur | Place | lieu le plus peuplé | Place | rejoint le juge |
| Paranoïaque | voisin du plus gros groupe | idem | Forge | quitte un lieu où entre son suspect n° 1 |
| Discret | Lavoir | Moulin ou Lavoir | Chapelle | fuit les groupes de 4 et plus |
| Bavard | Taverne | Place | Taverne | colporte les ouï-dire avec leur source |
| Sceptique | lieu de la trace | Place | Taverne | va vérifier la trace |
| Émotif | maison du mort, Chapelle | près d'un allié | Chapelle | part après deux accusations |
| Stratège | Forge (vue sur la Place) | jamais deux fois le même lieu | Place | — |
| Naïf | suit qui l'a rassuré | idem | rejoint le juge | rejoint qui lui a parlé en aparté |

Le **loup suit la routine de sa personnalité de façade** et dispose de trois leviers : se faire voir (son `ensuite` s'applique à 100 % l'après-midi), mentir sur une position (il est le seul autorisé), isoler un naïf ou un émotif en aparté. Sa vue tient « Tes alibis déclarés » pour qu'il reste cohérent.

**Effets attendus sur les biais du proto 1.** Le discret, au bord de la rivière, devient le témoin unique des passages vers le Moulin : il apporte des faits que lui seul possède. Chaque IA n'entend qu'une partie des paroles, donc les carnets divergent sans forçage. La vue dit : « Être seul n'est pas un indice », et le moteur garantit à chacun au moins un moment seul tous les deux jours.

**Angles d'enquête spatiaux** : le paranoïaque surveille qui rencontre qui ; le discret suit la victime et ses croisements ; le sceptique traque les contradictions de position ; le stratège reconstitue les itinéraires et les chiens ; le bavard compare les intentions annoncées et les trajets ; le meneur, l'émotif et le naïf gardent des angles verbaux, pour la diversité.

**Accusation motivée.** `vise` s'accompagne d'un `motif` parmi `croisement`, `trace`, `mensonge_position`, `temoignage`, `parole`. Le juge voit l'étiquette (« Marc vise Léa — mensonge de position ») : une accusation de style reste permise, mais elle s'affiche pour ce qu'elle est.

**Faits sans faute.** Le moteur tient un registre : chaque observation a un identifiant (`o12`) et toutes les vues en dérivent, écrites à la deuxième personne (« Ce matin, tu étais au Lavoir avec Hugo ; tu as vu Léa entrer au Moulin »). Toute affirmation spatiale passe par le champ `affirme`, contrôlé :
- un villageois doit citer une observation de sa vue ou un ouï-dire présenté comme tel, sinon relance avec correction ;
- le loup peut mentir ; chez les vrais témoins, le moteur ajoute une contradiction prudente (« Marc dit avoir passé la matinée au Puits ; tu y étais et tu ne l'as pas remarqué — vous étiez cinq »).

**Format de réponse (jour)** :

```json
{"pense": "Marc ment sur hier midi, je l'ai vu au Moulin.",
 "carnet": {"Marc": [75, "ment sur sa position d'hier midi"]},
 "action": "parler", "envie": 80, "a": "tous",
 "texte": "Marc, hier midi je t'ai vu entrer au Moulin avec Léa, pas au Puits. Et la farine sur le seuil de Thomas vient d'ici.",
 "vise": "Marc", "motif": "mensonge_position",
 "affirme": [{"qui": "Marc", "lieu": "Moulin", "quand": "hier midi", "obs": "o12"}],
 "ensuite": {"suivre": "Arnaud"}}
```

Retirés par rapport au proto 1 : `canal` (déduit de `a`), le `prive` ajouté au public, les messages de nuit des villageois, le carnet complet (seulement les changements). Nuit : loup `{"victime", "chemin"}`, Voyante `{"sonde"}`.

## 8. Interface

**Principe : le plan est le lieu du jeu, le fil est sa mémoire.**

**Ordinateur** : plan à gauche (≈ 58 %), fil à droite ; le carnet s'ouvre en tiroir par-dessus le fil, jamais sur le plan. **Téléphone** : plan collé en haut (40 % de la hauteur, poignée à trois tailles : bande, normal, plein écran), fil dessous, saisie en bas. Schémas dans `annexes/ux-ui.md`.

**Le plan** : SVG minimaliste, lieux en zones arrondies avec pictogramme et nom, chemins pointillés, lignes de vue visibles. Jetons = portraits du proto 1 (forme + couleur + initiale). Bulles seulement pour ce que le juge **entend** ; au loin, un pictogramme « bouche » sans texte. Chaque indicateur (parle, aparté, s'est déplacé, réfléchit, ta note) a un équivalent non coloré ; bouton « Plan en liste » pour l'accessibilité ; mouvements coupés sous `prefers-reduced-motion`. La nuit est un voile sur le plan, pas le thème sombre.

**Interactions** : le plan sert à choisir, le champ sert à dire. Cliquer un lieu = y aller ; cliquer un jeton ouvre sa carte (Interpeller · Aparté · Son trajet · Éliminer). Raccourcis : `1`–`7` lieux, `Espace` attendre, `E` carnet, `/` saisir, `Maj+P` pause.

**Latence (3 à 10 s) masquée en trois temps** : l'action du joueur s'exécute tout de suite (son jeton marche, le moment avance) ; les IA perçues affichent qu'elles réfléchissent ; quand tout est validé, la restitution est mise en scène (déplacements, puis apartés, puis paroles), passable d'un clic. Les relances restent invisibles.

**Carnet d'enquête** :
- **Chronologie** : une ligne par personnage, une colonne par moment, ce que *le juge* a vu ou appris ; cliquer une case rejoue le plan à ce moment.
- **Vu / dit** : face à face entre ce qu'une IA affirme de sa position et ce que le juge a vu ; les contradictions sont surlignées, sans conclusion.
- **Qui vise qui** : la matrice du proto 1, avec le motif.
- **Rencontres et revendications** : datées et localisées.

**Résumé d'aube** : trois cartes sur le plan (la mort, les traces numérotées, « hier » en 3 lignes), puis rangé dans le fil.

**Premiers pas** : tutoriel en 3 gestes ancrés sur le plan (« touche un lieu », « ici tu entends tout, ailleurs tu vois qui se parle », « touche un jeton pour un aparté ») ; questions-amorces aux jours 1 et 2, construites à partir de faits observés et écrites pour faire réagir (« Léa, que faisais-tu à la Grange avec Hugo ? »).

**Du proto 1** : on garde jetons, palette, fil, compteur d'enjeu, matrice, notes, sauvegarde, pause et débrief (enrichi du **rejeu des trajets du loup**). On supprime « parlé n · visé n », le bloc « Silencieux en public » et la ligne technique du seuil de parole : ils nourrissaient le lynchage des discrets.

## 9. Architecture technique

- **`engine.py`, `prompts/` et l'orchestration par sous-agents sont gelés** (étiquette `proto1-chat`). La page web est la référence.
- **Modules ES dans un artefact multi-fichiers, sans build** : `carte.js` (lieux, graphe), `moteur.js` (état, horloge, routines, résolutions ; pur, testable sous Node), `perception.js`, `ia.js`, `plan.js`, `ui.js`, `index.html`. Repli si les modules ne se chargent pas dans l'artefact : un script Node qui les concatène en une page.
- **Rendu en SVG écrit à la main**, sans bibliothèque : variables de thème existantes, `viewBox` pour le téléphone, clic et lecteur d'écran natifs, tests Playwright par le DOM. PixiJS et Phaser sont surdimensionnés pour 8 jetons au tour par tour.
- **État `S` version 3** : positions discrètes (lieu ou trajet entre deux lieux), horloge en moments, dernier aperçu par observateur, traces dont l'auteur reste secret, historique compact des positions pour le débrief. Hasard par PRNG à graine tirée de `crypto` : parties rejouables pour le débogage, imprévisibles pour le joueur. Nouvelle sauvegarde v3 (les parties v2 restent lisibles par l'artefact du proto 1).
- **Visibilité figée à l'émission** : chaque événement du journal porte son lieu et la liste de ses témoins au moment où il a lieu (le calcul à la lecture du proto 1 deviendrait faux dès que les gens bougent).
- **Une seule porte de sortie** : `projection(S, observateur)`. L'écran ne reçoit que la projection du juge ; chaque vue d'IA ne dérive que de sa projection. Un personnage hors de vue n'est pas dans le DOM. Canaux annexes corrigés : le compteur « 3/5 réfléchissent », « Voulaient aussi parler » et la durée de la nuit ne doivent rien révéler d'ailleurs.
- **Appels** : seules les IA en scène avec le juge, interpellées, ou à l'aube et au conseil sont appelées ; hors du juge, au plus une scène par moment est jouée (tirée sans regarder les rôles), les autres sont résumées par le moteur. Pool de 3 appels parallèles, délai maximal 25 s, une seule relance.

## 10. Budget et fiabilité

| Phase | Appels |
|---|---|
| Aube (toutes les IA) | 6–7 |
| 3 moments (IA en scène avec le juge, ≤ 4 ; plus une scène hors juge) | ≈ 10 |
| Conseil (micro-tours + réplique de l'accusé) | ≈ 8 |
| Nuit (loup, plus la Voyante si présente) | 1–2 |
| **Par cycle** | **≈ 25** |

Partie de 3 cycles plus prologue : **≤ 80 appels**. Vue cible **≤ 2,5 k tokens** (journal limité à ce que l'IA a entendu dans son lieu, perception ≤ 250 tokens, faits anciens réduits à cinq). Cible **≤ 250 k tokens d'entrée** par partie.

**Relances sous 10 %** : on ne relance plus que pour la révélation du loup, une position fausse affirmée par un villageois, une réponse due au juge, une vision non transmise, la répétition de soi-même et le JSON invalide. Le reste est **réparé sans appel** : coupe à la dernière fin de phrase entre 61 et 75 mots, retrait d'un « X a raison » initial, jargon nettoyé. Les réparations sont comptées à part dans le débrief.

**Modèles** : le modèle rapide pour toutes les paroles (un loup qui parlerait mieux se trahirait) ; le modèle fin pour l'appel de nuit du loup et la seconde tentative des relances. Option « tout en fin » pour faire enfin la mesure jamais faite au proto 1.

À vérifier au jalon J0 : sortie JSON contrainte et cache de préfixe dans les appels de l'artefact (gains supplémentaires s'ils existent ; le budget ci-dessus n'en dépend pas).

## 11. Risques et calibrage

| Risque | Parade |
|---|---|
| **Cluedo mécanique** : on déduit sans écouter les IA | indices directionnels jamais nominatifs, bottes ambiguës, Grange opaque, calibrage ≥ 3 puis ≥ 2 suspects |
| Le loup trop exposé ou trop protégé par le repérage | variante A : repérage strict ou libre |
| Le juge reste à la Place où tout passe | la Place se vide à midi (routines) ; variante B |
| Surcharge du juge | partie ≤ 40 minutes, sinon on retire Écouter |
| Les IA ne parlent plus que de positions | angles verbaux gardés pour trois personnalités ; « une seule idée » par parole |
| Le solitaire devient le nouveau discret | règle écrite dans la vue ; solitude garantie pour tous |
| Faits spatiaux faux | registre, champ `affirme`, filet sur le texte (prénom + lieu + moment) |
| Fuite par le méta-jeu | nuit à durée fixe, nombre d'appels de nuit constant, scène hors juge tirée sans regarder les rôles |

Le joueur jouant seul, le « papier-prototype » est remplacé par la **simulation** : 1 000 parties avec agents factices par variante, avant tout appel réel.
- **A. Repérage strict ou libre** : taille de l'ensemble des suspects à l'aube 2, cible 2 à 3.
- **B. Brouillard ou plan ouvert** : le juge doit se déplacer au moins 2 fois par jour pour que ce soit un vrai choix.
- **C. Voyante qui marche ou Guetteur** : moins d'une victoire sur deux due au seul rôle.

## 12. Jalons

| Jalon | Contenu | Sortie | Estimation |
|---|---|---|---|
| **J0 maquette** | plan SVG, thèmes, téléphone 375 px, jetons placés depuis un JSON ; chargement des modules dans l'artefact ; vérification JSON contraint et cache | captures clair / sombre / téléphone | 3 j |
| **J1 hameau sans IA** | `moteur.js` v3, routines, perception, témoins, traces, conseil, projection, sauvegarde v3, agents factices ; calibrage des variantes A–C par simulation | partie complète jouable en factices ; 1 000 parties sans fuite ni blocage | 8 j |
| **J2 IA branchées** | vues spatiales, consignes, `affirme` / `motif` / `ensuite`, réparations, latence masquée, compteurs | 3 parties internes, relances < 10 %, budget tenu | 7 j |
| **J3 série de validation** | 5 parties en version figée ; corrections ciblées | tableau de série dans `analyses/` | ≈ 1 semaine |

Environ 4 semaines. **Réutilisé du proto 1 tel quel** : outils de texte et de JSON, filtres, `PERSOS` (plus les paramètres de routine), `lireParole` / `valider`, `appeler` / `consulter`, `choisirParole`, éliminations, `chancesDepuis`, sauvegarde, styles, portraits, matrice, débrief. **Réécrit** : visibilité, vue et journal, nuit, boucle de tour, choix des IA à consulter.

**Tests** : moteur sous `node --test` ; simulation 1 000 parties ; contrôle de fuites par **canaris** (chaînes uniques glissées dans l'information cachée, qui ne doivent apparaître dans aucune projection, aucun prompt de non-témoin, aucun DOM) et par **non-interférence** (deux états qui ne diffèrent que par du caché donnent une vue humaine identique à l'octet) ; Playwright avec un faux `window.claude` (latence, erreurs, pause et rechargement en plein appel) ; tokens mesurés par simulation avant de dépenser.

## 13. Critères de réussite du proto 2

Série de 5 parties en version figée, dont **au moins 3 sans Voyante**. Si un critère échoue : une seule correction ciblée, puis on recommence la série.

1. **Fiabilité** : 0 bug bloquant, 0 fuite, relances < 10 %.
2. **Coût** : ≤ 80 appels et ≤ 250 k tokens d'entrée par partie ; au moins une partie « IA plus fines ».
3. **Signal sans Voyante** : victoire entre 40 et 70 % ; dans 4 parties sur 5, un indice spatial menait au loup avant l'élimination décisive.
4. **Fin des boucs émissaires de style** : au plus 1 villageois éliminé sur la série sur des accusations majoritairement `parole` ; au moins 50 % des accusations IA ont un motif spatial.
5. **Prises dès le début** : dans chaque partie, le joueur fait au moins une action non verbale avant le premier conseil ; premiers tours notés ≥ 6/10.
6. **Un loup qui ment** : démasqué au premier conseil au plus 1 fois sur 5 ; au moins un mensonge de position par partie.
7. **Lisibilité** : messages incompréhensibles ≤ 10 %.
8. **Plaisir** : note moyenne ≥ 7,5/10, partie ≤ 40 minutes.

## 14. Décisions à confirmer par le joueur

1. **Plus de message privé à distance** (y compris pour toi) : il faut aller voir quelqu'un pour lui parler en aparté, et ça se voit.
2. **Mode par défaut sans Voyante.**
3. **Prologue avec un mouton égorgé** plutôt qu'un premier mort humain.
4. **Brouillard** au-delà des lignes de vue.
5. **Gel de la version chat** (`engine.py`).
