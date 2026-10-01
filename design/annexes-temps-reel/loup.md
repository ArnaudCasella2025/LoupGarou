# Le loup chasseur et l'économie d'indices

Principe directeur : **une seule mort par cycle (aube → aube), mais elle peut tomber de jour**. Le loup chasse le jour, et la nuit ne sert plus que de repli. On ne double pas la menace : avec 6 innocents et la défaite à 2 innocents restants, le juge n'aurait plus qu'un essai.

## 1. L'agression de jour

### Conditions (toutes vérifiées par le moteur à chaque pas de simulation)
- **Cible repérée** : la règle du repérage reste, c'est-à-dire que le loup a croisé la cible depuis l'aube. La filature compte.
- **Cible seule dans un lieu à l'écart ou sur un chemin** : Grange, Moulin, Lavoir, Chapelle, ou un tronçon de chemin à plus de 140 unités de tout centre de lieu. Jamais à la Place, à la Taverne ni à la Forge, qui sont trop fréquentées et trop en vue.
- **Aucun villageois IA à moins de 260 unités** de la cible. Au Lavoir, le bruit de l'eau ramène ce rayon à 180.
- **Le juge à plus de 430 unités selon l'estimation du loup**. L'estimation est bruitée (voir § 2), et c'est là que le loup peut se tromper.
- **Fenêtre horaire** : de 09:00 à 17:45. Jamais pendant l'aube ni pendant le conseil. **Pas d'attaque humaine le jour 1** : le loup repère, et le mouton du prologue suffit.

### Déroulé visible
1. **Filature** (20 à 60 s réelles) : le loup suit à 200–320 unités. Il prend la même destination « par hasard » ou passe par le lieu voisin.
2. **Approche** (≈ 4 s réelles, 14 min de jeu) : il réduit la distance à moins de 40 unités. Pour un observateur, ce sont deux silhouettes qui se rejoignent, et cela ressemble à un aparté.
3. **Lutte** (5 s réelles, ≈ 17 min de jeu) : les jetons se confondent, le jeton de la victime tremble. **Cri** au début de la lutte, tiré à 70 % (la victime peut être prise à la gorge), entendu dans un rayon de 340 unités, 200 au Lavoir.
4. **Fuite** : le loup repart par un **autre chemin** que celui de l'arrivée quand le graphe le permet, et rejoint le lieu fréquenté le plus proche.
5. **Le corps reste sur place**, couché et gris. Il est **découvert** dès qu'un villageois ou le juge entre dans le lieu. S'il ne l'est pas, l'absence se constate à la cloche (« Hugo ne vient pas au conseil »), puis le corps est trouvé à l'aube.

### Le juge peut empêcher ou surprendre
- **Présence = protection** : le loup n'attaque jamais une cible qu'il croit dans le champ du juge. Escorter un villageois le protège, mais c'est **visible** : le loup se reporte sur un autre, et les IA remarquent « le juge ne lâche pas Léa ».
- **Interruption** : si le juge (ou une IA) arrive à moins de 430 unités pendant l'approche, le loup abandonne et « passe son chemin ». Si l'arrivée a lieu pendant la lutte, le loup s'enfuit et **la victime survit, blessée**. Elle devient le meilleur témoin du jeu, avec un témoignage partiel tiré (voir § 3). Pas de seconde tentative ce jour-là.
- **Flagrant délit** : le juge est à moins de 165 unités (portée d'oreille) pendant la lutte, avec le loup dans son champ. Le loup est démasqué et **la partie est gagnée**. Rare, mais possible quand le loup se trompe sur la distance du juge. Entre 165 et 430 unités, le juge voit **la lutte et la direction de la fuite**, mais pas un visage. Le carnet note alors « une silhouette fuit la Grange vers le Lavoir à 15h30 ».
- **Le juge n'est jamais attaqué**. C'est tranché, pour trois raisons. (a) Le joueur perdrait sans rien avoir compris : une défaite subie, pas une erreur de jugement. (b) Le juge doit pouvoir s'approprier l'espace sans peur paralysante, puisque c'est sa mobilité qui crée le jeu. Pour la tension, on garde la **menace sans la mort** : le loup peut **filer le juge** pour savoir qui il protège, et un villageois attentif pourra le dire (« quelqu'un te suit depuis la Forge »).

### Fréquence et lien avec la nuit
- Au plus **2 tentatives par jour** (une tentative avortée compte) et **1 mort par cycle**.
- Si aucune mort n'a eu lieu à 17:45, le loup **tue la nuit** avec la règle v2 (trajet maison → maison, chiens, fenêtre). Mais la nuit est **plus risquée** pour lui : trace au seuil à 100 %, veilleurs à +10 points. Cible : 65–75 % de morts de jour.
- Une tentative interrompue de jour **consomme la mort du cycle** : pas de rattrapage la nuit. Protéger quelqu'un sauve réellement une vie.

## 2. Comportement du loup (moteur, pas LLM)

Le LLM du loup ne fait que **parler** : mentir et accuser. Les trajets et les attaques passent par une machine à états déterministe à tirages, testable et gratuite.

| État | Ce que fait le loup | Sortie |
|---|---|---|
| ROUTINE | Suit la routine de sa personnalité, comme un villageois. | à 09:00 → REPÉRAGE |
| REPÉRAGE | Note toutes les 10 min de jeu chaque cible repérée : `isolement` (personnes à moins de 260) + `écart` (lieu à l'écart) + `risque_témoin` (la cible a vu le loup lors d'une mort précédente, bonus) − `juge_proche`. | score > seuil → FILATURE |
| FILATURE | Suit à 200–320 unités. Toutes les 30 s de jeu, **cache** sa filature : il entre dans un lieu intermédiaire ou fait mine de parler à quelqu'un (40 %). | conditions réunies → ATTAQUE ; cible rejoint un groupe → REPÉRAGE |
| ATTAQUE | Approche, puis lutte (§ 1). | → FUITE ou ABANDON |
| FUITE | Autre chemin, puis lieu fréquenté le plus proche. | → ALIBI |
| ALIBI | Engage la conversation avec le premier venu, dans un lieu fréquenté. Son LLM reçoit dans sa vue : « Tu dois pouvoir dire que tu étais ici depuis un moment. » | après 30 min de jeu → RETOUR ? |
| RETOUR | À 30 %, revient dans le lieu du corps **au milieu des autres**, une fois la découverte faite, pour « voir ». | → ROUTINE |

**Paramètres qui le rendent faillible** (tous tirés par le moteur et réglables) :
- `erreur_juge` : le loup estime la distance du juge à ±30 %. Au-delà de 430, il ne le voit pas du tout, à cause du brouillard : il peut attaquer alors que le juge débouche d'un chemin.
- `impatience` : le seuil d'attaque baisse de 10 % par heure de jeu sans mort après 13:00. Un loup pressé, l'après-midi, prend plus de risques et attaque plus près des autres.
- `filature_visible` : 35 % de chances qu'un villageois qui croise le duo retienne « X marchait derrière Y ».
- `faux_pas` : 25 % de chances d'une erreur physique pendant la lutte (objet perdu, manche déchirée ; voir § 3).
- `riposte` : 30 % de chances que la victime se défende et griffe le loup, qui porte alors une marque jusqu'au lendemain.
- `alibi_raté` : 20 % de chances que le loup n'ait personne à qui parler en arrivant. Il reste seul 30 minutes, ce qui fait un trou dans son emploi du temps.

## 3. Les indices

### Liste (perception, source, ambiguïté)

| Indice | Qui le perçoit | Ce qu'il dit | Pourquoi il reste ambigu |
|---|---|---|---|
| **Cri** (« un cri du côté du Moulin vers 15h ») | tous dans un rayon de 340 unités, juge compris | lieu et heure de l'attaque | donne la fenêtre de temps, pas l'auteur |
| **Matière sur le corps** (paille, farine, suie…) | le juge en examinant le corps, ou les IA présentes à la découverte | **lieu d'où venait le loup** (dernier lieu traversé, comme la trace de nuit) | plusieurs personnes sont passées par ce lieu |
| **Bottes marquées** de la matière du lieu du crime | juge (examen, 2 par jour), IA à moins de 60 unités (15 %) | le porteur est passé par le lieu du crime | les habitués du lieu ont la même marque, et c'est voulu |
| **Objet perdu** (bouton de couleur, mouchoir, pipe) | qui découvre le corps | une **couleur de vêtement** ou un objet partagé par 2–3 villageois | le moteur ne crée que des objets communs à ≥ 2 vivants |
| **Manche déchirée / griffure** | juge (de près, < 80 unités), IA à côté | marque visible sur une personne jusqu'au lendemain | la Forge et le Moulin blessent aussi : des innocents à routine manuelle sont marqués 15 % du temps |
| **« Quelqu'un partait vers… »** | IA ou juge à moins de 430 unités au moment de la fuite | direction de fuite, silhouette sans nom | 2 à 4 personnes habitent ou travaillent dans cette direction |
| **Filature vue** (« Marc marchait derrière Hugo vers la Grange ») | IA qui croise le duo (35 %) | **un nom** | marcher derrière quelqu'un n'est pas un crime : le naïf suit aussi les autres (`*suivre`), donc fausse piste naturelle |
| **Alibi impossible** | carnet du juge (recoupement) | le loup dit « j'étais à la Taverne » alors que le juge ou un témoin l'a vu ailleurs | le loup le plus prudent dit vrai à 10 minutes près |
| **Victime survivante** (attaque interrompue) | elle-même, puis tous ceux à qui elle parle | 50 % : couleur du vêtement ; 30 % : « grand, il venait du Lavoir » ; 20 % : « je n'ai rien vu » | jamais le nom, et elle a peur (l'émotif exagère) |
| **Retour sur les lieux** | IA présentes | « X est revenu voir, il ne pleurait pas » | les curieux reviennent aussi (le sceptique va voir la trace) |

### Entrée dans la mémoire des IA
On ajoute à `c.vu` des entrées typées : `{type:"cri", lieu, minute}`, `{type:"fuite", vers, minute}`, `{type:"filature", qui, derriere, lieu, minute}`, `{type:"marque", qui, matiere}`, `{type:"corps", qui, lieu, minute, indices:[…]}`. `vueIA` les rend dans « CE QUE TU AS VU TOI-MÊME » en phrases datées. Exemple : « Aujourd'hui vers 15h, tu as entendu un cri du côté du Moulin. » `repondre` et `conversation` gagnent un cas « indice » : un villageois qui détient un indice le place en priorité (60 %) dans sa prochaine conversation et au conseil, pour que l'information **circule** de bouche à oreille et arrive au juge déformée ou non. **Oubli** : 20 %, comme aujourd'hui, et **déformation de l'heure** de ±30 min à chaque répétition par un tiers. Le loup reçoit les indices qui le concernent (« Sophie a vu ta manche ») pour préparer son mensonge.

### Carnet du juge
Nouvelle catégorie **indice**, avec une icône, un lieu et une heure. N'y entre que ce que le juge a **perçu** (cri entendu, corps examiné, silhouette vue) ou **entendu dire**. Le carnet indique la source : « selon Léa ». Le carnet ne conclut jamais.

### Ambiguïté calibrée
Avant de tirer chaque indice, le moteur calcule **l'ensemble compatible** : les vivants sans alibi vérifiable dans la fenêtre du cri ou de la découverte et compatibles avec tous les indices publics.
- Il exige **≥ 3 personnes à la première mort humaine** et **≥ 2 ensuite**, le loup toujours compris.
- Si un indice ferait passer sous ce seuil, il est **dégradé**. Par exemple, un nom devient une silhouette, ou une matière devient « de la terre ».
- **Exception unique** : le flagrant délit à moins de 165 unités, qui est mérité.
- Deux morts recoupées, par exemple « marqué de farine » et « filature vue », donnent un signal fort. **Jamais une preuve au premier corps.**

### Fausses pistes (voulues, pas des bugs)
Elles viennent toutes du moteur et sont toujours **vraies en elles-mêmes**. Un innocent marqué par sa routine (farine du meunier, suie du forgeron). Le naïf qui suivait la victime. Le discret seul au Lavoir pendant la fenêtre. La victime survivante qui se trompe de couleur à 20 %. Le loup qui **désigne** l'habitué du lieu du crime, puisque sa vue lui dit qui y était. On n'invente jamais un faux fait chez une IA innocente : le mensonge est réservé au loup. C'est ce qui donne de la valeur aux contradictions.

## 4. La Voyante : retirée

À retirer du mode par défaut, ce qui confirme les jalons du 03/10. Avec des morts de jour, des cris et des filatures, le juge enquête déjà en marchant. Une vision nominative court-circuiterait tout le calibrage : un « Marc est innocent » retire d'un coup un tiers de l'ensemble compatible. Le **rôle de « voir à distance »**, c'est désormais le juge lui-même, avec sa lanterne. Variante future : le **Guetteur** du GDD, qui surveille un lieu à l'écart par jour.

## 5. Équilibrage

**Taux de victoire cible du juge** : 40 % pour la première partie, 55–60 % pour un joueur rodé. Le flagrant délit sert de soupape, avec une cible de 5–8 % des parties.

**Réglages** : tous les paramètres ci-dessus, regroupés dans un objet `REGLAGES` exposé à la simulation.

**Ce que la simulation (1 000 parties, juges factices) doit mesurer** :
1. Taille de l'ensemble compatible à chaque découverte. Ne doit jamais descendre sous 3 au premier corps. Médiane 3–4, puis 2–3.
2. Répartition jour/nuit des morts, heure médiane des attaques, part des corps découverts avant le conseil (cible 60 %).
3. Tentatives avortées par partie (cible 0,5–1), flagrants délits (5–8 %), victimes survivantes.
4. Nombre d'indices perçus par le juge par mort, selon trois juges factices : **immobile** à la Place, **errant** au hasard, **chasseur** qui suit les isolés. Cible : 1, 2–3 et 3–4. L'écart entre eux mesure la valeur de l'espace.
5. Taux de victoire de chaque juge factice qui vote pour le suspect le plus chargé : immobile ≤ 25 %, chasseur 55–65 %. Si l'immobile gagne, les indices sont trop publics.
6. Fréquence des fausses pistes : un innocent porteur d'un indice dans ≥ 50 % des cycles.
7. Fuites : aucun indice nominatif hors calibrage, aucune entrée de mémoire d'une IA qui n'a pas pu la percevoir. Contrôle identique à `simuler`.
8. Durée moyenne d'une partie (cible 3–4 jours, soit 12–15 minutes réelles) et nombre d'appels LLM par jour, qui ne doit pas croître : les indices passent par la vue, pas par des appels de plus.

**Scène test à rejouer à la main** : 14h40, le juge est à la Forge et voit Hugo partir seul vers le Moulin, puis Marc prendre le même chemin deux minutes plus tard. Il suit. À 15h05, un cri. Il arrive à 300 unités : une silhouette file vers le Lavoir, Hugo est à terre, couvert de farine. Au Lavoir, Marc rince ses bottes en parlant à Léa (alibi). Mais Chloé, la meunière, a aussi de la farine aux manches, et le naïf jure avoir vu « Chloé suivre Hugo ce matin ». Le juge a trois noms, deux indices et une heure de conseil devant lui. Objectif : une scène de ce genre par partie.
