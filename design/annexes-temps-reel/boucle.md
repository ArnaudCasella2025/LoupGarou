# Le Hameau vivant — boucle « accuser → débattre → éliminer » et rythme

Game design · boucle de jeu et règles · réponse au retour « accuser, indices, agression, éliminer ».
Base : `proto-sensation/hameau-vivant.html` (v2, Claude branché). Les indices et l'agression de jour sont traités par les collègues ; ce document fixe comment ils s'emboîtent dans la boucle.

## Principe directeur

Aujourd'hui, le juge enquête toute la journée puis tout se décide d'un clic dans un panneau. L'accusation n'existe pas : le soupçon n'a aucun effet dans le monde. **Règle nouvelle : accuser se fait de jour, dans un lieu, devant des témoins ; éliminer se fait au conseil, et seulement contre quelqu'un accusé ce jour-là.** L'accusation est l'acte social (elle bouge le village), l'élimination est l'acte irréversible (elle tue).

## 1. Accuser en temps réel

**Le geste.** Le juge est dans un lieu, un villageois est à portée d'oreille (165). Dans le panneau de dialogue apparaît un bouton **Accuser** ; on choisit une **pièce** dans le carnet (une entrée « vu », « entendu », « contradiction » ou une trace du matin) ou « sans pièce ». Le juge peut ajouter une phrase libre. Il dispose de **2 sceaux par jour** : au-delà, le bouton est grisé (« Tu as déjà accusé deux fois aujourd'hui »).

**Scène type.** 14 h 10, au Moulin. Le carnet a relevé : « Bastien dit ne pas avoir croisé Odile… mais tu les as vus tous les deux au Lavoir. » Le juge accuse Bastien avec cette pièce. Le temps passe à ×0,15. Une cloche brève, un cercle rouge autour du Moulin :
- **l'accusé se défend** (1 appel prioritaire, 40 mots) : il s'explique, nie, ou retourne l'accusation ;
- **les témoins réagissent** : jusqu'à 3 IA présentes dans le lieu ou dans un lieu en vue (les plus proches) disent en une phrase si elles appuient, doutent ou défendent (appels en parallèle). Leur `vise` + `motif` (déjà prévus dans le JSON du GDD) devient leur **position** : appuie / défend / se tait ;
- **le juge peut relancer une fois** (une question libre à l'accusé), puis la scène se ferme.

Durée cible : 20 à 30 s réelles, soit ≈ 15 min de jeu.

**Effets dans le monde.**
- **Attroupement** : toute IA qui voit le cercle rouge (430) interrompt sa routine et marche vers le lieu. Les autres l'apprennent par **rumeur** : les témoins répètent l'accusation dans leurs conversations suivantes (déjà supporté par `entendu`).
- **Marque** : l'accusé porte un ruban rouge jusqu'au conseil. Il est sur la liste du soir.
- **L'attroupement vide les autres lieux.** C'est voulu : accuser ouvre une fenêtre à l'agression de jour (§ 3). Le juge qui provoque une grande scène au Moulin laisse la Chapelle sans témoin.
- **Coût pour un innocent accusé** : il se ferme, répond en une phrase au juge jusqu'à l'aube suivante, et ses amis témoins deviennent sceptiques. Accuser sans pièce : les témoins penchent « défend » par défaut.

**Les IA accusent aussi.** Quand une IA a un motif spatial (croisement avec la victime, trace, mensonge de position) et a entendu au moins une autre voix aller dans son sens, elle peut **lever la voix** : même scène, sans le juge. Garde-fous : une accusation d'IA par demi-journée pour tout le village, jamais avant 9 h, jamais pendant une scène en cours. Le loup peut accuser (c'est son meilleur outil pour mettre un innocent sur la liste du soir), au plus une fois par partie.
Ce que voit le juge : s'il est à portée d'oreille, la scène complète ; à portée de vue, le cercle rouge et des bulles « … », et il peut accourir (la scène dure assez pour arriver depuis un lieu voisin) ; hors de vue, rien sur le moment, puis la rumeur dans le carnet : « On dit que Léa a accusé Marc à la Forge vers 11 h. » Une accusation d'IA met aussi l'accusé sur la liste du soir.

## 2. Éliminer

**Quand.** Seulement au conseil du soir, et seulement parmi les accusés du jour (juge ou IA). Pas de bûcher sans accusation. Le juge peut toujours **gracier tout le monde**.

**Une exception : le flagrant délit.** Si le juge voit de ses yeux le loup agresser quelqu'un (agression dans son champ de vision, même à travers la brume), le bouton **Arrêter** apparaît 10 s : arrestation immédiate, victoire. C'est la récompense de la filature et la raison pour laquelle le loup cherche l'écart.

**Le conseil.** Il ne repasse plus les 7 IA. Les accusés du jour (3 au plus : si plus, les 3 avec le plus de soutiens) passent tour à tour près du feu :
1. l'accusateur rappelle sa pièce (texte déjà prononcé, aucun appel) ;
2. l'accusé fait sa défense du soir (1 appel ; il connaît tout ce qui s'est dit de lui) ;
3. **mains levées** : chaque IA lève ou non la main, calculé par le moteur depuis son dernier `vise` (aucun appel).

Puis le juge tranche : **Éliminer X** ou **Gracier**. Le juge reste **seul décideur** : les mains levées sont un avis visible, pas un vote. Raison : c'est la promesse du jeu (« seul juge du village ») et cela empêche la partie de se jouer toute seule si les villageois honnêtes convergent.

**Révélation.** Oui, le rôle est révélé à l'élimination. C'est la seule boucle de rétroaction fiable du joueur ; sans elle, on ne sait pas ce qu'on apprend.

**Coût d'une erreur.** On **supprime le compteur de 3 chances**. Une erreur tue un innocent : elle rapproche la défaite d'un jour entier (§ 3), ce qui se lit sans compteur abstrait. Effets sur le village :
- les IA qui avaient levé la main contre l'innocent perdent du crédit : au conseil suivant, leur main compte en gris ;
- la **peur** monte d'un cran (§ 3).
Gracier un loup ne coûte rien sur le moment ; la nuit le fait payer.

## 3. Rythme

**Condition de défaite unique : il reste 2 villageois innocents vivants** (le loup peut alors tenir tête au hameau). **Victoire** : le loup éliminé au conseil ou arrêté en flagrant délit.

**Faim du loup : un meurtre par cycle**, de jour (agression à l'écart) *ou* de nuit (règle du repérage). S'il tue de jour, la nuit est calme mais pas vide (chiens, silhouette : il rôde). Ainsi le compte reste lisible quoi que décide le collègue « loup » sur les modalités de l'agression. Si l'équipe veut un meurtre de jour en plus de la nuit, il faut retirer un jour au plan ci-dessous.

Compte : 6 innocents au départ. Sans erreur du juge, la défaite tombe à l'aube du jour 5 ; **chaque erreur coûte un jour**. Le joueur a donc 4 conseils au mieux, 2 s'il se trompe deux fois.

| Jour | Durée réelle | Ce qui se passe |
|---|---|---|
| 1 | 3 min | mouton égorgé, aucune agression de jour (le loup n'a croisé personne) ; on apprend les déplacements |
| 2 | 3 min 30 | premier mort humain, traces ; première vraie accusation |
| 3 | 3 min | peur 1 : les IA rentrent à 17 h 30, cloche avancée |
| 4 | 2 min 30 | peur 2 : groupes de deux, plus d'apartés ; le loup doit risquer de jour |

Avec le conseil (≈ 1 min 15), la nuit (30 s) et l'aube (20 s) : **≈ 6 min par cycle, 15 à 24 min la partie.**

**Montée de tension.** La **peur** (0 à 3 : nombre de morts humains moins un, erreurs du juge comprises ; affichée comme une flamme du feu de la Place qui baisse) raccourcit les journées et regroupe les villageois. Effet croisé recherché : plus il y a de peur, moins il y a de gens seuls, donc l'agression de jour devient rare et risquée, et le loup qui l'ose s'expose au flagrant délit. Le jour 4 est court, nerveux, et décide la partie.

**L'agression de jour dans la boucle.** Un cri : toutes les IA à portée d'oreille accourent ; le corps reste sur place jusqu'au soir. Le premier arrivé, c'est souvent le loup qui revient « découvrir » le corps, ou un témoin qui le voit partir. La découverte déclenche d'elle-même une scène d'accusation (souvent d'IA), donc une liste du soir déjà remplie. Le juge n'a plus que ses 2 sceaux et le temps qui reste jusqu'à la cloche.

## 4. Ce qu'on garde, ce qu'on retire

**On garde** : marche, vue 430 et ouïe 165, brume ; dialogue libre avec temps ralenti ; questions suggérées ; carnet et détection de contradiction (elle devient la source des pièces) ; mémoire `vu` / `entendu` des IA ; cloche 18 h 15 ; nuit de 30 s, chiens, silhouette, empreintes ; prologue du mouton ; révélation du rôle à l'élimination ; file de 2 appels et repli scripté.

**On retire** :
- le **compteur de 3 chances** (remplacé par la population et les jours) ;
- le **panneau modal plein écran** du conseil : la scène se joue sur le canvas, autour du feu, avec un bandeau de décision en bas (Éliminer X / Gracier) ;
- le tour de table où les 7 IA disent qui elles soupçonnent (7 appels de monologue, sans enjeu) : remplacé par la défense des accusés et les mains levées ;
- l'élimination de n'importe quel vivant au conseil : seulement les accusés du jour.

**On ajoute dans le code** : `accuser(juge|ia, cible, piece)`, `G.accuses` (par jour), `G.peur`, état `scene` (comme `dialogueAvec`, ralentit le temps), `vise` + `motif` exploités pour les positions, `arreter()` en flagrant délit.

## 5. Risques et tests

**R1 — L'accusation dévore la journée.** Trop de scènes et d'attroupements : le village ne vit plus, on ne fait que juger. *Test* : 5 parties instrumentées (faux Claude + 3 parties humaines). Mesurer la part du temps réel de jour passé en scène et le nombre de scènes par jour. Cible : moins de 25 % du jour, 1 à 3 scènes. Au-delà : 1 sceau par jour pour le juge, et accusations d'IA seulement l'après-midi.

**R2 — La latence casse le temps réel.** Une scène, c'est 1 défense + 3 témoins + 1 relance. À 3 à 8 s par appel avec 2 appels simultanés, elle peut durer 30 s figées. *Test* : faux Claude avec latence fixée à 2, 5 puis 10 s ; chronométrer la scène et le conseil. Cible : scène < 30 s, conseil < 90 s. Parades déjà prévues : défense prioritaire, témoins en parallèle, réplique scriptée au-delà de 6 s, mains levées sans appel.

**R3 — Le village décide à la place du juge, ou le loup le manipule trop bien.** Les villageois honnêtes peuvent converger sur le loup (partie trop facile), ou le loup peut remplir la liste du soir d'innocents (bouc émissaire). *Test* : simulation scriptée de 1 000 parties (juge factice qui suit les mains levées, juge factice au hasard parmi les accusés). Cibles : le juge « suit la majorité » gagne entre 40 et 60 % (sinon on brouille les mains levées : seuls les témoins de la scène lèvent la main) ; victoires par flagrant délit < 20 % ; le loup figure sur la liste du soir dans 50 à 80 % des conseils. Puis 5 parties humaines : note de plaisir ≥ 7,5 et réponse à « as-tu eu l'impression de décider ? ».
