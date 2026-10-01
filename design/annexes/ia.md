# GDD proto 2 — Les IA dans l'espace

Rédigé par : design des IA et narration. S'appuie sur la série de validation du proto 1 et sur `interface/loup-garou.html`.

## 0. Cadre retenu

- **Plan** : 7 lieux. La Place est au centre et sert de carrefour. Autour : le Puits, l'Église, la Taverne et la Forge. Au bord de la rivière : le Moulin et le Lavoir. Chaque joueur a une maison connue de tous, dans le quartier d'un des lieux.
- **Lignes de vue fixes** : la Place voit le Puits, l'Église et la Taverne ; la Forge voit la Place ; le Moulin et le Lavoir se voient l'un l'autre. Tout trajet entre deux lieux non voisins passe par la Place.
- **Temps** : chaque jour a trois créneaux (Matin, Midi, Soir), puis vient la Nuit. Dans chaque créneau, le moteur déplace tout le monde, puis les scènes se jouent.
- **Le juge** choisit son lieu à chaque créneau. Il perçoit selon les mêmes règles que les IA.
- **Plus de message privé à distance.** Un échange privé est un aparté entre deux joueurs présents au même endroit, et il est visible de tous ceux qui voient le lieu. La Voyante doit donc rejoindre le juge pour lui parler, et cela se voit. On corrige ainsi le « privé sans risque », qui rendait la Voyante trop forte.

## 1. Partage des décisions

Principe : **le modèle décide de ce qui se dit et de qui il soupçonne ; le moteur décide de tout ce qui se mesure.** Une position, une heure ou une trace ne dépend jamais d'un texte généré.

| Décision | Qui décide | Pourquoi |
|---|---|---|
| Paroles, `vise`, revendication | Modèle | C'est le cœur du jeu, et le proto 1 montre que le modèle y est solide. |
| Interlocuteur parmi les présents (`a`) | Modèle | C'est un acte social qui a du sens (le loup qui isole le naïf). |
| Intention de déplacement (`ensuite`) | Le modèle propose, le moteur dispose | Le champ est facultatif et appliqué selon la personnalité. Le modèle n'écrit jamais de trajet. |
| Victime, chemin du loup | Modèle, parmi 2 ou 3 chemins proposés par le moteur | C'est la décision stratégique majeure, et le choix fermé est toujours valide. |
| Trajets, routines, horaires, ce que chacun perçoit | Moteur, via le registre | Coût nul, fiabilité totale, reproductible en test. |
| Réactions simples (s'écarter, rejoindre un allié, quitter le lieu quand on est accusé) | Moteur, à partir du carnet et d'une banque de gestes par personnalité | Pas d'appel, et de la texture (« Hugo s'écarte quand tu arrives »). Un geste n'est jamais présenté comme une parole. |
| Fuites involontaires du loup | Moteur, par tirages calibrés (§2.3) | Laissées au modèle, elles seraient soit absentes, soit grossières. |

Une IA seule dans un lieu n'est pas appelée : elle suit sa routine. C'est le premier levier de coût.

## 2. Routines par personnalité

Chaque IA a une routine de base, faite de lieux pondérés pour le Matin, le Midi et le Soir. Le moteur l'ajuste de trois façons :
- **« Obéit »** : la probabilité que le moteur applique l'intention `ensuite` du modèle.
- **Réactions** déclenchées par le carnet de l'IA.
- **15 % d'aléa**, pour qu'aucune routine ne soit lisible à coup sûr.

L'**attention** est la probabilité de remarquer une arrivée dans un lieu où se trouvent au moins quatre personnes.

| Personnalité | Matin | Midi | Soir | Obéit | Attention | Réaction |
|---|---|---|---|---|---|---|
| Meneur | Place | lieu le plus peuplé | Place | 60 % | 80 % | Rejoint le juge ; va là où le mort a été annoncé. |
| Paranoïaque | lieu voisin du plus gros groupe (il voit sans être vu) | idem | Forge | 50 % | 100 % | Quitte le lieu si son suspect n° 1 (≥ 60) y entre. |
| Discret | Lavoir | Moulin ou Lavoir | Église | 40 % | 100 % | Fuit les groupes de quatre ou plus. |
| Bavard | Taverne | Puits | Taverne | 70 % | 60 % | Colporte : reçoit les ouï-dire avec leur source. |
| Sceptique | lieu de la trace | Place | Taverne | 60 % | 80 % | Va vérifier la trace en premier. |
| Émotif | maison du mort, puis Église | près d'un allié (carnet ≤ 20) | Église | 70 % | 70 % | S'en va après deux accusations dans la scène. |
| Stratège | Forge (vue sur la Place) | jamais deux fois le même lieu | Place | 80 % | 80 % | — |
| Naïf | suit celui qui l'a rassuré en dernier | idem | rejoint le juge | 90 % | 70 % | Rejoint qui lui a parlé en aparté. |

Effets attendus :
- **Le discret cesse d'être le bouc émissaire du silence.** Au bord de la rivière, il est souvent le seul témoin des passages vers le Moulin. Il apporte donc des faits que lui seul possède.
- **Moins de pensée de groupe.** Chaque IA n'entend qu'environ un tiers des paroles et voit d'autres choses, si bien que les carnets divergent sans forçage par le prompt.
- **Le meneur est le plus vu**, donc le mieux couvert par des témoins : il n'est plus une cible commode.
- **« Être seul n'est pas un indice »** est écrit dans la vue. Le moteur garantit à chacun au moins un créneau seul tous les deux jours, pour que le solitaire ne devienne pas le nouveau « discret ».

### 2.1 Nuit

Chacun rentre chez lui. Le moteur propose au loup des chemins avec leur risque écrit en clair : « Par le Moulin : Camille dort près du Moulin et veille parfois. Par la Place : personne ne veille, mais la Place laisse de la boue. »

Les veilleurs sont tirés au sort : le paranoïaque veille 40 % des nuits, le discret 25 %, les autres 10 %. Un veilleur dont le quartier est traversé entend « des pas vers le Moulin, peu après minuit ». Il apprend une direction, jamais un nom.

### 2.2 Le loup ment par ses déplacements

Le loup suit la routine de sa personnalité de façade. Il n'a aucune routine propre. Il dispose de trois leviers volontaires :
1. **Se faire voir.** Au Soir, son `ensuite` est appliqué à 100 %. Il peut s'entourer de témoins, par exemple à la Taverne.
2. **Mentir** sur sa position ou celle d'un autre. Il est le seul autorisé à le faire (§4).
3. **Isoler** le naïf ou l'émotif en aparté dans un lieu calme pour y semer une piste.

Sa vue récapitule « Tes alibis déclarés » pour qu'il reste cohérent.

### 2.3 Fuites involontaires (tirées par le moteur)

| Fuite | Probabilité | Perçue par | Ambiguïté |
|---|---|---|---|
| Trace au seuil de la victime, liée à un lieu du chemin (farine du Moulin, suie de la Forge, boue de la Place, eau du Lavoir) | 70 % par nuit | Tous : annoncée au matin, la correspondance trace → lieu est publique | Elle désigne un lieu, pas une personne. |
| Évitement : le loup n'approche pas la maison de la victime le Matin | 50 % | Ceux qui y sont | Beaucoup de villageois n'y vont pas non plus. |
| Bottes crottées, visibles le Matin | 20 % | Les présents, selon leur attention | Un villageois du même quartier a la même marque (20 %). |
| Retour au lieu de la trace le Soir | 30 % | Ceux qui voient ce lieu | Le sceptique y va aussi. |

**Calibrage**, vérifié avant le tirage : l'ensemble des joueurs compatibles avec la trace (passés par ce lieu dans la journée) **inclut toujours le loup et compte au moins 3 personnes la nuit 1, au moins 2 la nuit 2**. Sinon, la trace est décalée vers un lieu plus fréquenté. Même sans Voyante, deux nuits recoupées ramènent la liste à deux ou trois suspects : un vrai signal, jamais une preuve au jour 1.

## 3. Perception

| Où est l'observateur | Voit les présents | Entend ce qui est dit « à tous » | Voit les apartés |
|---|---|---|---|
| Même lieu | oui (arrivées selon l'attention s'il y a au moins 4 personnes) | oui | oui (contenu réservé aux deux interlocuteurs) |
| Lieu en vue | oui, à l'arrivée | non | oui |
| Lieu traversé | « X est passé en direction de… » | — | — |
| Hors de vue | rien | rien | rien |

Il n'y a pas de portée intermédiaire : une règle binaire s'apprend et se teste mieux.

**Écriture dans la vue.** Un seul bloc, à la deuxième personne, regroupé par créneau. Le moteur le rédige à partir de gabarits, sans appel au modèle : « Ce matin, tu étais au Lavoir avec Hugo. Tu as vu Léa entrer au Moulin. »

Budget et règles d'écriture :
- Le bloc fait **250 tokens au plus**. Il contient le jour en cours et la nuit précédente. Ce qui est plus ancien est réduit à **cinq faits retenus** : ceux qui touchent les trois premiers du carnet, les traces et les contradictions.
- Les prénoms sont regroupés (« Léa, Hugo et toi ») et un créneau vide n'est pas écrit.
- Le journal contient seulement **ce que l'IA a entendu dans son lieu**, 12 éléments au plus, au lieu des 20 derniers éléments du village.
- Les ouï-dire sont étiquetés : « Hugo t'a raconté qu'il a vu Marc au Moulin (tu ne l'as pas vu toi-même). »
- La convention « toi » du proto 1 est gardée partout. Aucune ligne ne désigne l'IA elle-même à la troisième personne.

## 4. Faits spatiaux et faits faux

**Le registre.** Pour chaque créneau, le moteur tient la position de chacun, les apartés, les passages et ce que chaque observateur a perçu. Chaque observation reçoit un identifiant (`o12`), et toutes les vues en sont dérivées.

**Faits publics**, annoncés au matin : le mort, sa maison, la trace et son lieu. **Les positions ne sont jamais publiques** : on les connaît pour les avoir vues ou se les être fait raconter.

**L'IA cite, elle ne devine pas.** Une affirmation spatiale passe par le champ `affirme`, contrôlé par le moteur :
- **Un villageois** doit s'appuyer sur une observation de sa vue (`obs`) ou sur un ouï-dire présenté comme tel (`source`). Sinon, on relance avec la correction : « Tu n'as pas vu Marc au Moulin ce matin ; dis ce que tu as vu, ou présente-le comme une supposition. »
- **Le loup** peut mentir. Son affirmation est enregistrée comme une déclaration. Chez chaque témoin réel, le moteur ajoute une contradiction prudente : « Marc dit avoir passé la matinée au Puits. Tu y étais et tu ne l'as pas remarqué (vous étiez cinq). » Une absence dans une foule n'est jamais une preuve.
- **Filet sur le texte** : les lieux, les créneaux et les prénoms sont tous distinctifs. Si une phrase associe un prénom, un lieu et un moment sans entrée dans `affirme`, la même vérification s'applique, avec une seule relance tolérante.

Les faits faux du proto 1 (« 3 morts », « aparté visible ») venaient de ce que le moteur savait sans l'écrire clairement. D'où la règle : **tout nombre et toute position sont écrits en toutes lettres par le moteur.**

## 5. Format JSON

**Retirés** :
- `canal`, déduit de `a` : `"tous"` désigne les présents, un prénom ouvre un aparté ;
- `prive` ajouté à un message public : une parole par tour ;
- les messages de nuit des villageois ;
- le carnet complet, remplacé par les seuls changements (trois au plus).

**Ajoutés** :
- `affirme` ;
- `ensuite` : `{"aller": "<lieu>"}`, `{"suivre": "<prénom>"}` ou `null` ;
- `chemin` pour le loup, la nuit.

**Renommé** : `reflexion` devient `pense`, 25 mots au plus.

La sortie est contrainte par un schéma JSON (sortie structurée de l'API).

**Vue courte** (Camille, discrète, villageoise, Midi du jour 2 ; environ 1,9 k tokens, dont environ 1,2 k de préfixe fixe mis en cache) :

```
[PRÉFIXE FIXE EN CACHE : système, règles, fiche, personnalité, angle]
Plan : Place (centre ; voit Puits, Église, Taverne) · Forge (voit la Place) · Moulin ↔ Lavoir.
Traces : farine = Moulin · suie = Forge · boue = Place · eau = Lavoir. Être seul n'est pas un indice.

## Faits établis (tenus par le meneur, fiables)
- Jour 2, Midi. Vivants (7) : Arnaud (le juge), Marc, Léa, Hugo, Julien, Sophie, Camille (toi).
- Mort : Thomas (Villageois), dévoré la nuit dernière chez lui, quartier de la Forge. Trace : farine (Moulin).
- Il reste 3 éliminations au juge.

## Où tu étais et ce que tu as vu (sûr)
Hier midi, tu étais au Lavoir ; tu as vu Marc et Léa entrer au Moulin. [o12]
La nuit dernière, tu veillais : des pas sont passés vers la Place, peu après minuit. [o15]
Ce matin, tu étais au Lavoir avec Hugo ; personne n'est allé au Moulin. [o17]
Ce midi, tu es au Moulin avec Léa et Marc. Le juge n'est pas là.

## Ce que tu as entendu ici
Ce midi, Marc a dit à tout le monde : « Hier je suis resté au Puits tout l'après-midi, demandez à Sophie. »

## Contradiction relevée par le meneur
Marc dit avoir été au Puits hier midi. Toi, tu l'as vu entrer au Moulin hier midi. [o12]

## Ton carnet : Marc 45 (au Moulin hier) · Léa 30 · Hugo 10

## À toi (scène au Moulin)
JSON : pense, carnet (changements), action, envie, a, texte (40 mots visés, 60 au plus), vise, affirme, ensuite.
```

**Réponse** :

```json
{"pense":"Marc ment sur hier midi, je l'ai vu au Moulin. Farine du Moulin.",
 "carnet":{"Marc":[75,"ment sur sa position d'hier midi"]},
 "action":"parler","envie":80,"a":"tous",
 "texte":"Marc, hier midi je t'ai vu entrer au Moulin avec Léa, pas au Puits. Et la farine sur le seuil de Thomas vient d'ici.",
 "vise":"Marc",
 "affirme":[{"qui":"Marc","lieu":"Moulin","quand":"hier midi","obs":"o12"}],
 "ensuite":{"suivre":"Arnaud"}}
```

Nuit, pour le loup : `{"victime":"Hugo","chemin":"B"}`. Pour la Voyante : `{"sonde":"Léa"}`. Le vote est inchangé.

## 6. Budget

**Appels.**
- On joue toujours la scène du juge. Hors de sa présence, on joue au plus **une** scène par créneau, tirée au sort et pondérée par sa taille, sans regarder les rôles. Les autres scènes sont résumées par le moteur (« Hugo et Sophie ont parlé au Puits »).
- **Jour** : environ 5 appels par créneau, plus 2 ou 3 par intervention du juge (on en compte 4), soit **environ 25 appels**.
- **Nuit** : 1 appel pour le loup, plus 1 pour la Voyante. L'écran affiche « La nuit passe… » pendant une durée fixe, sans compteur.
- **Partie de 3 jours** : environ **80 appels**.

**Tokens.** La vue fait environ 1,9 k tokens, contre 4 k au proto 1. Le préfixe de 1,2 k, propre à chaque IA, est **mis en cache** (une lecture en cache coûte environ 10 %). Cela fait environ 0,8 k tokens facturés par appel et environ 70 k par partie, contre 250 à 560 k au proto 1.

**Modèles.**
- **Rapide** pour toutes les paroles, afin que le style soit le même pour tous : un loup qui parlerait mieux se trahirait.
- **Fin** pour l'appel de nuit du loup, qui n'est jamais lu par personne, et pour la seconde tentative de chaque relance (environ 5 % des appels).
- L'option « tout en fin » sert à faire enfin la mesure du critère 6.

**Sous 10 % de relances.** Au proto 1, les relances venaient de « trop long », « approbation » et « JSON invalide ». Mesures :
1. JSON invalide : supprimé par la sortie structurée.
2. Trop long : la consigne vise 40 mots. Entre 61 et 75 mots, le moteur coupe à la dernière fin de phrase. On ne relance qu'au-delà de 75.
3. « X a raison, » en tête : retiré automatiquement si le reste fait au moins 6 mots.
4. Jargon et reprise du message d'un autre : réparés sans relance.
5. Une parole par tour : deux fois moins de surface de refus.
6. Ne restent en relance que la révélation du loup, une position fausse affirmée par un villageois, l'obligation de répondre au juge, une vision non transmise et la répétition de soi-même.

Objectif : **5 à 7 %**. Les réparations sont comptées à part dans le débrief.

## 7. Risques et tests

| Risque | Parade |
|---|---|
| Les IA ne parlent plus que de positions | Faits anciens réduits à cinq ; angle d'enquête propre à chaque personnalité gardé ; « une seule idée » par parole. |
| Le loup est trouvé mécaniquement | Ensembles compatibles d'au moins 3 puis d'au moins 2 ; faux positifs prévus ; contradictions « si remarqué » seulement. |
| Aucun indice sans Voyante | Environ une fuite par nuit (§2.3), mesurée. |
| Le solitaire devient bouc émissaire | Règle écrite dans la vue ; solitude garantie pour tous. |
| Fuite par le méta-jeu (nombre d'appels, durée) | Nuit à durée fixe ; scène hors juge tirée sans regarder les rôles. |
| Le loup se contredit | Bloc « Tes alibis déclarés ». |

**Simulation** (`simuler --parties 200 --spatial`), avec des agents factices qui suivent les routines. 10 % de leurs réponses sont malformées, trop longues ou en approbation, et un « loup menteur » déclare de fausses positions. Assertions bloquantes :
- **Perception exacte** : chaque observation d'une vue, juge compris, est recalculée indépendamment à partir du registre et des règles de perception.
- **Aucune fuite** : pas de chemin nocturne nommé, pas de rôle d'un vivant, pas d'observation hors de portée dans une vue de non-loup ; nombre d'appels de nuit visibles constant.
- **Aucune ligne à la troisième personne** sur le destinataire de la vue.
- **Calibrage** : le loup est toujours dans l'ensemble compatible, et cet ensemble compte au moins 3 personnes à la nuit 1 dans 95 % des parties.
- **Zéro fait spatial faux** accepté chez un villageois.
- **Vue de 2,2 k tokens au plus** (95ᵉ centile) ; **90 appels au plus**.

**Banc réel** : 20 parties en modèle rapide et 5 en modèle fin, avec un juge scripté. Objectifs :
- relances sous 10 % ;
- au plus 1 fait faux par partie ;
- aucune cible ne reçoit plus de 50 % des visées d'une journée ;
- le discret n'est plus visé pour son silence ;
- un indice juste vers le loup sans Voyante dans au moins 4 parties sur 5.

Les critères humains du proto 1 sont repris tels quels.
