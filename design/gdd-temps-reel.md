# Le Hameau vivant — accuser, chasser, éliminer (GDD v1)

03/10 · Équipe : boucle et règles, loup et indices, expérience et IA ; synthèse et arbitrages : direction.
Détail de chaque métier dans `design/annexes-temps-reel/` (boucle, loup, experience). Ce document fait foi en cas de désaccord.
Base : `proto-sensation/hameau-vivant.html` v2 (temps réel, villageois joués par Claude).

## Ce que le joueur a demandé

> « C'est très fun de pouvoir bouger et se parler. Il faudrait pouvoir **accuser** quelqu'un, que le loup **laisse des indices**, que le loup puisse **agresser quelqu'un à l'écart**, et qu'on puisse **éliminer** des gens. »

Règle d'or de l'équipe : **tout renforce « marcher et parler », rien ne l'interrompt.** Un événement fort se montre dans le village avant de s'écrire dans le carnet. Le temps ralentit, il ne s'arrête jamais, sauf pour la sentence.

## 1. La boucle en une phrase

Le loup **chasse de jour** une cible isolée. Le juge **enquête en marchant** : il entend des cris, examine les corps, ramasse des indices, écoute les rumeurs. Il **accuse en public** devant témoins, et le village réagit. Le soir, au conseil, il **élimine un accusé** ou gracie tout le monde. Le rôle est révélé.

## 2. Le loup chasseur

**Une seule mort par cycle, de préférence de jour.** Si le loup n'a tué personne à 17:45, il tue la nuit (règle actuelle : trajet, chiens, fenêtre), mais c'est plus risqué pour lui : trace au seuil à 100 %, veilleurs plus attentifs. Cible : deux morts sur trois de jour.

**Conditions d'une agression de jour**, toutes vérifiées par le moteur :
- la cible a été **croisée** depuis l'aube (règle du repérage) ;
- elle est **seule dans un lieu à l'écart** (Grange, Moulin, Lavoir, Chapelle) ou sur un chemin, jamais à la Place, à la Taverne ni à la Forge ;
- **aucun villageois à moins de 260 unités** (180 au Lavoir, à cause du bruit de l'eau) ;
- **le juge hors de vue selon l'estimation du loup**, qui se trompe de ±30 % ;
- entre 09:00 et 17:45 ; **jamais le jour 1** : le loup repère, le mouton du prologue suffit.

**Déroulé visible :**
1. **Filature :** le loup suit à distance, l'air de rien.
2. **Approche :** deux silhouettes se rejoignent, comme pour un aparté.
3. **Lutte :** quelques secondes, et un **cri** dans 70 % des cas, entendu à 340 unités.
4. **Fuite :** le loup part par un autre chemin, puis se fabrique un alibi dans un lieu fréquenté. Parfois, il revient « découvrir » le corps.
5. **Le corps reste sur place** jusqu'à ce qu'on le trouve.

**Le juge protège en étant là.** Le loup n'attaque jamais une cible qu'il croit sous les yeux du juge. Escorter quelqu'un le protège, mais tout le monde le voit. Arriver pendant la lutte fait fuir le loup : la victime survit, blessée, et devient un témoin (partiel, jamais nominatif). Une tentative avortée consomme la mort du cycle.

**Flagrant délit.** Si le juge est **à moins de 165 unités** pendant la lutte, il peut **arrêter le loup sur-le-champ : victoire**. Entre 165 et 430 unités, il voit la lutte et la direction de la fuite, mais pas de visage. C'est rare (cible : 5 à 8 % des parties) et mérité.

**Le juge n'est jamais attaqué.** Une défaite qu'on subit sans avoir rien compris n'apprend rien, et la peur figerait ses déplacements. Le loup peut en revanche le **suivre** pour savoir qui il protège, et un villageois attentif pourra le lui dire.

**Le comportement du loup est géré par le moteur, jamais par le LLM.** C'est une suite d'états : routine → repérage (score d'isolement) → filature camouflée → attaque → fuite → alibi → retour possible sur les lieux. Il est faillible par tirages :
- il se trompe sur la distance du juge ;
- il s'impatiente l'après-midi ;
- sa filature est remarquée (35 %) ;
- il fait un faux pas pendant la lutte (25 %) ;
- la victime riposte et le griffe (30 %) ;
- il ne trouve personne pour son alibi (20 %).

Son LLM ne fait que **parler** : mentir, se défendre, accuser.

## 3. Les indices

| Indice | Qui le perçoit | Ambiguïté voulue |
|---|---|---|
| **Cri** (lieu, heure) | tous dans un rayon de 340 unités ; flèche au bord de l'écran si c'est hors de vue | donne la fenêtre de temps, pas l'auteur |
| **Matière sur le corps** (farine, suie, paille…) | qui examine le corps | désigne le lieu d'où venait le loup ; d'autres y sont passés |
| **Bottes marquées** | le juge (2 examens par jour), les IA très proches | les habitués du lieu ont la même marque |
| **Objet perdu** (bouton, mouchoir) | qui découvre le corps | n'existe que s'il est commun à au moins 2 vivants |
| **Griffure, manche déchirée** | de près, jusqu'au lendemain | la Forge et le Moulin blessent aussi |
| **Silhouette en fuite** vers un lieu | qui est à portée de vue au moment de la fuite | 2 à 4 personnes vivent ou travaillent dans cette direction |
| **Filature vue** (« Marc marchait derrière Hugo ») | un villageois qui croise le duo (35 %) | le naïf suit les autres aussi |
| **Alibi impossible** | le carnet (recoupement « vu / dit ») | le loup prudent dit vrai à 10 minutes près |
| **Victime survivante** | elle, puis tous ceux à qui elle parle | silhouette, direction, jamais le nom |
| **Retour sur les lieux** | les présents | les curieux reviennent aussi |

**Calibrage garanti par le moteur.** Au premier corps, au moins 3 suspects restent compatibles avec tous les indices publics, puis au moins 2, le loup toujours compris. Un indice trop précis est dégradé : un nom devient une silhouette. Seule exception : le flagrant délit.

**Fausses pistes** : toujours vraies (la farine du meunier, le naïf qui suivait, le discret seul au Lavoir). **Seul le loup ment** : c'est ce qui donne leur valeur aux contradictions.

**Mémoire des IA.** Les indices entrent dans la mémoire de ceux qui les perçoivent sous forme d'entrées datées, à la 2ᵉ personne : « Aujourd'hui vers 15h, tu as entendu un cri du côté du Moulin ». Ils circulent de bouche à oreille : un villageois place d'abord son indice dans ses conversations, avec 20 % d'oubli et une heure déformée à chaque répétition. Une rumeur est marquée « on t'a raconté ». Le loup sait ce qu'on a vu de lui, pour préparer ses mensonges.

**La Voyante est retirée** : une vision nominative court-circuiterait le calibrage. C'est le juge, avec sa lanterne, qui « voit ».

## 4. Accuser

**Le geste.** Le juge est à portée d'oreille d'un villageois et touche **Accuser**. Il choisit une **pièce** proposée à partir du carnet : une contradiction, une chose vue, une chose entendue, un indice. Il peut aussi accuser sans pièce, et ajouter une phrase. Il a **2 accusations par jour**.

**La scène** dure 20 à 30 secondes, temps ralenti :
- **Attroupement :** les villageois à portée de vue accourent en cercle autour de l'accusé (anneau rouge).
- **Réactions réflexes :** 2 ou 3 bulles écrites d'avance (« Quoi ? Hugo ? », « Prouve-le. »).
- **Défense :** l'accusé se défend, écrit par Claude.
- **Témoins :** 1 à 2 témoins prennent parti (▲ soutient / ▼ défend), écrits par Claude si le budget le permet.
- **Relance :** le juge peut poser une question à l'accusé, puis la scène se ferme.

L'accusé porte un ruban rouge jusqu'au soir et figure sur la liste du conseil.

**Effets.**
- **Lieux vidés :** l'attroupement vide les autres lieux. Une grande scène au Moulin laisse la Chapelle sans témoin, ce qui est une occasion pour le loup.
- **Innocent accusé :** il se ferme et ses amis deviennent sceptiques.
- **Accusation sans pièce :** les témoins penchent pour la défense.

**Les IA accusent aussi**, quand elles ont un motif concret et qu'au moins une autre voix va dans leur sens :
- au plus une accusation d'IA par demi-journée, jamais avant 9h ;
- le loup ne le fait qu'une fois par partie, et c'est son arme pour mettre un innocent sur la liste.

Le juge vit la scène s'il est à portée d'oreille. À portée de vue, il voit le cercle rouge et peut accourir. Sinon, il l'apprend par la rumeur.

## 5. Le conseil et l'élimination

**Éliminer, seulement au conseil, et seulement un accusé du jour.** Le juge peut aussi gracier tout le monde. Le conseil se joue **sur le canvas, autour du feu**, sans panneau plein écran :
1. **Résumé du soir :** 4 lignes factuelles et partielles (un cri au Moulin vers 14h, qui a trouvé le corps, qui a été accusé).
2. **Pour chaque accusé** (3 au plus) :
   - l'accusateur rappelle sa pièce ;
   - l'accusé se défend, écrit par Claude ;
   - les **mains levées** (calculées par le moteur à partir des méfiances) donnent un avis. Ce n'est pas un vote : le juge reste **seul à décider**.
3. **Sentence**, le seul moment qui bloque le jeu :
   - il faut un appui long sur « Éliminer X » ;
   - le feu monte, X marche vers la lisière ;
   - une carte se retourne pour révéler son rôle ;
   - un coup de cloche.

**Fin de partie.**
- **Victoire :** le loup est éliminé au conseil ou arrêté en flagrant délit.
- **Défaite :** il ne reste que 2 villageois innocents.
- **Le compteur de 3 erreurs disparaît.** Avec 6 innocents et une mort par cycle, le juge a au mieux 4 conseils, et chaque erreur lui coûte un jour.

**Une erreur se paie dans le monde :**
- **Crédit :** les villageois qui avaient levé la main contre l'innocent perdent du crédit ;
- **Confiance :** le crédit du juge baisse (réponses plus sèches, moins de témoins spontanés) ;
- **Peur :** la peur monte.

## 6. Rythme et tension

| Jour | Durée réelle | Ce qui se passe |
|---|---|---|
| 1 | 3 min | mouton égorgé, aucune agression, on apprend qui va où |
| 2 | 3 min 30 | première mort humaine, premiers indices, première accusation |
| 3 | 3 min | peur 1 : cloche avancée, rentrée à 17h30 |
| 4 | 2 min 30 | peur 2 : les villageois se regroupent ; le loup doit prendre des risques |

Un cycle complet dure environ 6 minutes, une partie **15 à 24 minutes**.

**La peur** (0 à 3) se voit au feu de la Place, qui baisse. Elle raccourcit les journées et regroupe les villageois : moins de gens seuls, donc des agressions plus rares et plus risquées. Le jour 4 est court, nerveux, et décide la partie.

## 7. Les IA : le moteur décide, Claude parle

**Le moteur, gratuit et immédiat**, gère :
- la peur (0 à 3) et la méfiance envers chacun ;
- le crédit du juge et les alliances ;
- les cris, les attroupements, les fuites ;
- les bulles réflexes et les mains levées.

**Claude, réservé à ce qui se lit**, gère :
- les questions du juge et les objets montrés ;
- la défense d'un accusé et 1 à 2 témoins ;
- 4 prises de parole au conseil ;
- les conversations à portée d'oreille.

Ces états entrent dans la vue de chaque IA en une ligne (« Tu as peur. Tu te méfies surtout de Hugo. ») et dans une rubrique « CE QUI T'EST ARRIVÉ » de 6 lignes au plus.

**Budget :** 16 appels par jour au plus, par ordre de priorité, et 60 au plus par partie. Au-delà, le jeu passe à des répliques écrites d'avance, sans le dire.

## 8. Interface

- **Barre d'action** en bas du village quand un villageois est sélectionné : **Parler** (E), **Accuser** (A), **Fiche** (F). Boutons de 44 px, utilisables au pouce.
- **Indices au sol :** ils brillent quand le juge est à moins de 80 unités. On les touche pour lire, **noter** ou **ramasser** (une besace de 3 places). Un objet ramassé peut être **montré** pendant un dialogue.
- **Carnet en 3 onglets :**
  - **Fil** : le carnet actuel, avec les nouvelles étiquettes cri, corps, indice, rumeur, accusation.
  - **Indices** : la besace et les indices notés.
  - **Gens** : par villageois, les alibis déclarés, ceux qui sont contredits (en rouge), qui accuse qui, et la dernière fois que le juge l'a vu.
- **Au téléphone**, le carnet devient un tiroir à 3 hauteurs.
- **Effets** dessinés sur le canvas :
  - vignette rouge à la découverte d'un corps ;
  - flèche au bord de l'écran vers un cri ;
  - zoom bref, coupé si les animations sont réduites dans les réglages du système.
- **Sons** générés par le navigateur, **coupés par défaut**.

**Pièges à éviter.**
- **Arrêter le monde.** On ralentit le temps, on ne prend jamais la main au joueur.
- **Tout écrire dans le carnet.** Il garde ce que *tu* as vu, entendu ou ramassé. Le reste s'apprend en allant parler aux villageois.
- **Laisser Claude gérer les réflexes.** Ce serait lent, et le budget d'appels serait épuisé avant le conseil.

## 9. Ce qu'on garde, ce qu'on retire

**On garde :**
- la marche, la vue et l'ouïe, le dialogue libre ;
- le carnet et sa détection de contradictions, qui devient la source des pièces d'accusation ;
- la mémoire des IA (qui elles ont vu, ce qu'elles ont entendu) ;
- la cloche, la nuit, les chiens, les empreintes, le prologue du mouton ;
- la file d'appels et le repli sur des répliques scriptées.

**On retire :**
- le compteur de 3 erreurs ;
- le panneau plein écran du conseil, et le tour de table des 7 soupçons ;
- l'élimination de n'importe quel vivant : désormais, seulement un accusé du jour ;
- la Voyante.

## 10. Lots de réalisation

| Lot | Contenu | Vérification |
|---|---|---|
| **A. Accuser et éliminer** | barre d'action ; accusation avec pièce (2 par jour) ; scène d'attroupement ; défense par Claude ; accusations des IA ; conseil sur le canvas avec mains levées ; sentence et révélation ; nouvelle condition de défaite ; peur | partie complète avec un faux Claude, chronométrage des scènes (< 30 s) |
| **B. Le loup chasseur** | machine à états du loup ; agression de jour (filature, lutte, cri, fuite, corps) ; interruption et victime survivante ; flagrant délit ; nuit en repli ; découverte du corps | simulation : part des morts de jour, tentatives avortées, flagrants délits |
| **C. Indices et rumeurs** | indices du tableau ; calibrage ≥ 3 puis ≥ 2 suspects ; mémoire typée des IA et bouche-à-oreille ; examen et besace ; carnet en 3 onglets | simulation avec trois juges factices (immobile ≤ 25 % de victoires, chasseur 55-65 %) |
| **D. Mise en scène** | vignette, flèche vers le cri, corps couché, cartes de rôle, sons coupés par défaut, téléphone | captures ordinateur et téléphone |

## 11. Critères de réussite

- **Plaisir :** note ≥ 7,5, et « j'ai eu l'impression de décider » dans au moins 4 parties sur 5.
- **Agressions :** au moins 1 agression de jour vécue, de près ou de loin, par partie.
- **Indices :** au moins 2 indices perçus par mort, avec ≥ 3 suspects au premier corps.
- **Victoires du juge :** 40 % à la première partie, 55-60 % ensuite ; flagrants délits ≤ 8 %.
- **Scènes :** accusation < 30 s, conseil < 90 s, moins de 25 % de la journée passée en scènes.
- **Coût :** ≤ 60 appels par partie ; aucune fuite d'information vers une IA qui n'a pas pu la percevoir.
