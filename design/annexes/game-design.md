# La Veillée du Loup-Garou — Prototype 2 : boucle de jeu spatiale (2D)

## 1. Pitch et piliers

**Pitch.** Le hameau, vu de dessus, devient le plateau : sept IA vont et viennent entre le puits, la forge, le lavoir et la grange, et le juge les suit avec sa lanterne. Chaque soir on débat sur la place ; chaque nuit le Loup traverse le village pour dévorer, et ce trajet laisse des traces que les mots n'effacent pas. Le joueur ne juge plus seulement ce qu'on dit, mais aussi où chacun était, avec qui, et ce qu'il prétend avoir vu.

**Piliers.**
1. **Les pas ne mentent pas, les bouches si.** Le moteur produit des faits de position vrais (rencontres, traces, témoins). Les IA, et surtout le Loup, peuvent mentir à leur sujet, et ces mensonges deviennent vérifiables.
2. **On ne voit que ce qu'on regarde.** L'attention du juge est la ressource du jeu : être à la forge, c'est ne pas voir la grange.
3. **Le modèle parle, le moteur marche.** Déplacements, visibilité et traces sont calculés par des règles. Le modèle ne choisit qu'une parole et une intention.
4. **Des indices contestables, pas des preuves.** Tout indice spatial a une explication innocente possible ; c'est la parole qui les départage.

## 2. Le plan

Une carte d'un écran (environ 32 × 20 tuiles), sous forme de **graphe de 7 lieux** : passer d'un lieu à un lieu adjacent prend une « cloche ». La position exacte dans le lieu sert seulement au rendu.

| Lieu | Adjacent à | Fonction de jeu |
|---|---|---|
| **Place du puits** (centre) | tous sauf le bois | Aube et conseil du soir. Tout ce qui s'y dit est public. |
| **Auberge** | place, forge | Bruyante : on y parle à plusieurs, et on entend parfois une conversation voisine. |
| **Forge** | place, auberge, maisons Est | Point de vue sur les portes des maisons Est. |
| **Lavoir** | place, bois | Le bruit de l'eau empêche d'écouter. Y passer laisse de la **boue** aux bottes jusqu'au lendemain. |
| **Chapelle et cimetière** | place, grange | On y veille le mort, dont le corps ne peut être examiné qu'ici. |
| **Grange** | chapelle, bois, maisons Ouest | Fermée : on voit qui entre, pas ce qui s'y dit. Le lieu des apartés. Laisse de la **paille**. |
| **Lisière du bois** | lavoir, grange | Personne n'a de raison d'y aller le jour : y être vu est un fait. C'est un passage nocturne. |

Les **maisons** (4 à l'Est, 4 à l'Ouest, dont celle du juge) ne sont pas des lieux de jour. Chaque maison a une **fenêtre** qui donne sur un ou deux lieux, et cette information est affichée sur le plan : elle sert à vérifier les témoignages nocturnes.

**Visibilité du juge.** Dans son lieu, il voit et entend tout. Dans les lieux adjacents, il voit qui est là, qui arrive et qui part, ainsi que « X et Y se parlent à l'écart », sans les paroles. Au-delà, c'est le brouillard : le plan garde la dernière position connue, estompée. La nuit, le juge dort. Il ne sait que ce que le moteur annonce à l'aube et ce que les témoins lui racontent.

## 3. Boucle jour, soir et nuit

**Prologue : la veillée (soir 0).** Deux cloches de déplacement libre autour du feu, puis la nuit 1. Le jour 1 « à l'aveugle » du proto 1 disparaît : la première victime tombe avant le premier débat, et il y a déjà des rencontres à examiner.

**Aube (1 micro-tour).** Tout le monde se retrouve devant la maison de la victime. Le moteur annonce les faits publics : la victime, la porte forcée (côté rue ou côté jardin), les chiens qui ont aboyé. Chaque IA réagit et fixe son plan de la journée.

**Jour : 3 cloches (matin, midi, après-midi).** Chacun suit son plan, et le juge choisit un verbe à chaque cloche. **Il n'y a plus de message privé à distance** : parler en privé suppose d'être ensemble, donc d'être vu. L'aparté du proto 1, une simple ligne de texte, devient une rencontre physique observée par les présents et par les lieux adjacents.

**Règle du repérage** (centrale) : *le Loup ne peut dévorer qu'un joueur avec qui il a partagé un lieu pendant au moins une cloche depuis l'aube précédente*. L'aube et le conseil ne comptent pas. Chaque mort désigne donc un **ensemble de suspects** : ceux qui ont croisé la victime. Le juge en a vu une partie, les témoignages complètent le reste, et le Loup ment. Il a deux parades : croiser beaucoup de monde, ou croiser sa victime dans la grange, où personne ne compte les présents.

**Soir : le conseil sur la place.** Un micro-tour public, puis une interpellation : l'accusé est obligé de répondre. Le juge élimine ou passe. Chaque accusé a une fiche qui rassemble les rencontres vues ou déclarées, les traces et les contradictions.

**Nuit.** Tout le monde rentre chez soi. Le moteur calcule :
- **le trajet du Loup** jusqu'à sa victime, selon l'itinéraire choisi. Les chiens voisins aboient ; un passage par le lavoir laisse de la boue, un passage par la grange de la paille ;
- **un ou deux insomniaques**, tirés au sort (le paranoïaque plus souvent). Chacun reçoit dans sa vue les passages visibles depuis sa fenêtre, sous forme directionnelle et jamais nominative ;
- **la Voyante**, si elle est en jeu, qui sort elle aussi (§ 5).

**Exemple.** Nuit 2 : Léa (le Loup, maison Est 2) dévore Hugo (maison Ouest 3) en passant par la place. Le chien de Marc aboie. Chloé, insomniaque, a vu « une silhouette sur la place, venant de l'Est ». À l'aube, elle le dit. Le juge, qui était à l'auberge la veille, a vu Léa et Thomas avec Hugo à la forge. Léa prétend avoir entendu « quelqu'un rôder côté Ouest » ; or le plan montre que sa fenêtre donne sur la forge. C'est une prise concrète qui ne doit rien au style de parole.

## 4. Verbes du juge

Une action par cloche (3 par jour), plus le conseil. Parler est gratuit et se combine avec l'action.

1. **Aller** dans un lieu adjacent (coûte la cloche ; on peut parler à l'arrivée).
2. **Rester et parler** : en public dans le lieu, ou en privé à une personne présente. L'aparté avec le juge est vu.
3. **Écouter** un aparté depuis un lieu adjacent (impossible au lavoir et dans la grange). Le juge entend une phrase du message. Il a 30 % de chances d'être repéré, et les deux IA le savent alors.
4. **Convoquer** (1 fois par jour) : un joueur abandonne son plan et rejoint le juge à la cloche suivante. Pendant ce temps, il n'est nulle part ailleurs.
5. **Examiner** (2 fois par jour) : les bottes d'une personne présente (la boue ou la paille vient de la nuit *ou* de la veille), ou le corps à la chapelle (côté d'entrée, heure approximative).
6. **Sonner le conseil** plus tôt : les cloches restantes sont perdues pour tous, y compris pour le repérage du Loup.
7. **Éliminer**, au conseil seulement, en public, après la réplique de l'accusé ; ou passer.

Le juge **reste le seul juge** : aucune règle spatiale n'élimine, et le moteur ne désigne jamais de suspect.

## 5. Contre les boucs émissaires, et sans Voyante

**Le style perd son monopole.** Dans le proto 1, le discret était lynché parce que le silence était le seul fait disponible. Dans le proto 2, il a un emploi du temps : si Camille a passé la matinée au lavoir, n'a croisé Hugo à aucune cloche et que deux témoins le confirment, elle ne peut pas l'avoir dévoré, quel que soit son silence. L'organisateur n'est plus « celui qui force le consensus » : il est celui qui était à la forge à midi, ce que chacun peut vérifier.

**Accusation motivée.** Le champ `vise` est accompagné d'un champ `motif`, choisi parmi `croisement`, `trace`, `mensonge_position`, `temoignage` et `parole`. Le juge voit l'étiquette (« Marc vise Léa — mensonge de position ») : une accusation de style reste permise, mais elle s'affiche pour ce qu'elle est. Les angles d'enquête par personnalité (validés en série 2) deviennent spatiaux :
- le paranoïaque surveille qui rencontre qui ;
- le discret suit les victimes et leurs croisements ;
- le sceptique traque les contradictions de position ;
- le stratège reconstitue les itinéraires et les chiens ;
- le bavard compare les plans annoncés et les trajets réels ;
- le meneur, l'émotif et le naïf gardent des angles verbaux, pour la diversité des avis.

**Registre du juge.** Un carnet tenu automatiquement, en deux colonnes : **vu** (vrai, issu du moteur) et **dit** (témoignages). Un dit qui contredit un vu est surligné. Le joueur a ainsi des prises dès l'aube 1.

**La Voyante marche.** Pour sonder, elle va la nuit à la fenêtre de sa cible : elle peut être vue, elle porte des traces et crée une fausse piste. Pour transmettre sa vision, elle doit rejoindre le juge, et cet aparté est vu ; le Loup sait alors qui viser. Croire la Voyante cesse d'être gratuit. **Mode par défaut : sans Voyante** ; l'espace doit suffire à lui seul.

## 6. Décisions des IA et coût

**Le modèle ajoute trois champs à son JSON.**
- `plan` : jusqu'à 3 lieux, ou `"suivre:<prénom>"`, ou `"chercher:<prénom>"`.
- `mot` : un message privé que le moteur remet à la prochaine rencontre avec la personne visée, sans nouvel appel. Les manœuvres privées du Loup subsistent ainsi.
- `itineraire` (Loup seul, la nuit) : un choix parmi **3 trajets précalculés** par le moteur, chacun avec son risque affiché (« direct par la place : 2 chiens, fenêtres de Chloé et Marc » ; « par le bois : boue, 1 chien »). Le modèle arbitre un risque, il ne calcule pas de chemin.

**Le moteur décide du reste par des règles** : trajets, horaires, rencontres, visibilité, traces, insomnie, chiens. Quand le plan d'une IA est vide, il applique une routine liée à sa personnalité (le bavard à l'auberge, le discret au lavoir, le meneur sur la place, le paranoïaque qui suit son suspect). Il applique aussi la règle du repérage : la vue du Loup ne propose que ses cibles autorisées.

**Budget d'appels par cycle (jour et nuit).** Une IA n'est appelée que si sa parole peut atteindre le juge ou si son plan doit être fixé.

| Moment | Appels |
|---|---|
| Aube (toutes les IA) | 5–6 |
| 3 cloches (uniquement les IA dans le lieu du juge, 4 au plus, environ 2,5 en moyenne) | ≈ 8 |
| Conseil (micro-tour de 5, réplique de l'accusé, 2 réactions) | 8 |
| Nuit (Loup, et Voyante si elle est en jeu) | 1–2 |
| **Total par cycle** | **≈ 23** |

Une partie de 3 cycles plus le prologue revient à environ **70 appels**, contre 60 à 110 aujourd'hui. Les IA hors du champ du juge ne génèrent aucun texte : leur aparté se réduit à « Thomas et Sophie à la grange », avec éventuellement un `mot` déjà rédigé.

**Les vues s'allègent.** Une IA n'entend que les conversations de son lieu, et ses positions sont données en tableau compact (cloche, lieu, présents). L'objectif est de **2,5 k tokens par vue**, contre environ 4 k.

**Les relances se limitent** au JSON invalide, à une révélation interdite et à une **position fausse affirmée par un villageois** : le champ facultatif `affirme: {qui, lieu, cloche}` est vérifié par le moteur, et seul le Loup a le droit de mentir. L'approbation et la longueur, principales causes des 19 % de relances, sont désormais tronquées ou ignorées en silence.

## 7. Risques, variantes papier et critères de réussite

**Risques.**
- **Cluedo mécanique** : on déduit sans écouter les IA. Parades : témoins seulement directionnels, boue ambiguë (le lavoir est fréquenté le jour), seconde silhouette de la Voyante, grange opaque.
- **Loup trop exposé ou trop protégé** par la règle du repérage : à calibrer avec la variante A.
- **Surcharge du juge** : on coupe Écouter si une partie dépasse 40 minutes.
- **Le juge reste sur la place**, où tout passe. Parade : la place se vide à midi, quand les routines partent au travail.
- **Faits faux spatiaux** des IA rapides : le champ `affirme` les attrape ; sinon, on interdit les noms de lieux non étiquetés dans le texte.

**Trois variantes en papier-prototype.** Un meneur joue le moteur avec des pions sur un plan imprimé ; 3 joueurs tiennent chacun 2 ou 3 IA. On joue 3 parties par variante et on note l'indice qui motive chaque élimination.
- **A. Repérage strict ou libre** (le Loup peut-il dévorer n'importe qui ?). On mesure la taille de l'ensemble des suspects à l'aube 2 ; cible : 2 à 3.
- **B. Brouillard ou plan ouvert** (positions de tous visibles, sans les paroles). Le juge doit se déplacer au moins 2 fois par jour, sinon Aller et Écouter ne sont plus de vrais choix.
- **C. Voyante qui marche ou Guetteur** (un villageois surveille un lieu chaque nuit et voit des silhouettes sans nom). Cible : moins d'une victoire sur deux due à ce seul rôle.

**Critères de réussite**, sur une série de 5 parties en version figée, dont au moins 3 sans Voyante :
1. **Fiabilité** : 0 bug bloquant, 0 fuite, relances **< 10 %**.
2. **Coût** : **≤ 75 appels**, **≤ 2,5 k tokens par vue** en moyenne, ≤ 200 k tokens d'entrée par partie, et au moins une partie en « IA plus fines ».
3. **Signal sans Voyante** : victoire entre 40 et 70 %. Dans 4 parties sur 5, le débrief tiré de `revele` montre un **indice spatial** menant au Loup avant l'élimination décisive.
4. **Boucs émissaires** : au plus 1 villageois éliminé sur la série sur des accusations majoritairement `parole` ; **≥ 50 %** des accusations IA portent un motif spatial.
5. **Prises au début** : dans 5 parties sur 5, le joueur fait au moins une action non verbale (Écouter, Examiner, Convoquer) avant le premier conseil ; il note les premiers tours à 6/10 ou plus.
6. **Un Loup qui ment** : démasqué au premier conseil au plus 1 fois sur 5, et au moins un mensonge de position par partie. Sans mensonge, le pilier 1 ne fonctionne pas.
7. **Lisibilité** : messages incompréhensibles ≤ 10 %.
8. **Plaisir** : note moyenne **≥ 7,5/10**, partie ≤ 40 minutes.

Comme au proto 1 : si un critère échoue, une seule correction ciblée, puis on recommence la série.
