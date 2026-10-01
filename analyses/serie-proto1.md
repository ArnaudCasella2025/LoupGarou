# Série de validation du prototype 1 (version figée : publication 9 de l'interface, commit 915c45f)

Règle : 5 parties d'affilée sans modifier prompts ni règles. Si un critère échoue, une seule correction ciblée, puis on recommence la série.

## Critères

1. Fiabilité : aucun bug bloquant, aucune fuite, relances < 10 % des appels.
2. Pas de comportement dégénéré récurrent ; au plus 1 fait faux par partie ; le juge obtient toujours une réponse.
3. Dans au moins 4 parties sur 5, un indice identifiable a posteriori menait au loup.
4. Le loup n'est démasqué au jour 1 qu'au plus 1 fois sur 5 ; taux de victoire entre 40 et 80 % (hasard : 54 %).
5. Plaisir : note moyenne ≥ 7/10.
6. Coût connu : au moins une partie « IA rapides » et une « IA plus fines ».

## Parties

| # | Date | IA | Résultat | Jour | Élim. utilisées | Appels (relances) | Tokens entrée | Indice vers le loup | Faits faux | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 01/10 | rapides | Victoire | 3 | 2/3 (J1 passé) | 65 (5 = 7,7 %) | ~261 k | Visions de Marc (Hugo, Camille innocents) + neutralité de Julien | 3-4 | 6/10 |
| 2 | 02/10 | rapides, **sans Voyante** | Défaite | 3 | 3/3 | 72 (7 = 9,7 %) | ~292 k | Faibles : Sophie jamais visée, suiveuse (vise après Marc puis après Thomas), contradiction privée avec Hugo sur qui a contacté qui | 2-3 | 6,5/10 |

## Partie 1 — notes

Rôles : Hugo Villageois (paranoïaque) · Chloé Villageoise (émotif) · Thomas Villageois (bavard) · **Julien Loup-Garou (stratège)** · Camille Villageoise (meneur) · Élodie Villageoise (discret) · **Marc Voyante (sceptique)**.

- J1 : tour de table (« qui est villageois, voyante, loup ? ») → tout le monde « se dit villageois ». Élodie, première parole, se trompe sur l'ordre des interventions ; Thomas, Marc, Camille, Julien la visent. Le juge passe la journée (gratuit à 8).
- N1 : Julien dévore Hugo ; Marc sonde Hugo → Villageois.
- J2 : le juge raisonne « Élodie non mangée = loup ou loup prudent » ; Thomas, Chloé, Marc visent Élodie ; Marc (Voyante) se révèle au juge en privé seulement. Élodie (Villageoise) éliminée.
- N2 : Julien dévore Chloé (il avait écrit à Marc : « Chloé… trop d'influence. On la suit ? ») ; Marc sonde Camille → Villageoise.
- J3 : Marc transmet ses visions en privé et vise Julien en public (« silence actif ») ; Camille aussi. Julien éliminé (Loup-Garou).

Observations (sans correction, version figée) :
- Faits faux : Élodie (ordre des paroles), Camille J3 (« Chloé et Élodie visaient Julien »), Chloé (croit être accusée de silence). Critère 2 en défaut sur cette partie.
- Une erreur factuelle d'un joueur discret suffit à le faire lyncher.
- La Voyante pousse publiquement contre une innocente sans vision sur elle.
- Revendications « villageois » en masse quand le juge demande un tour de table des rôles (bruit sans gravité).
- Positif : la règle de neutralité (correction de la partie 4) a désigné le loup ; la Voyante a survécu en ne se révélant qu'au juge ; « passer la journée » utilisé à bon escient.

Retour du joueur : « Hormis la Voyante, les IA ne m'aident pas beaucoup, c'est difficile les premiers tours. Avec la Voyante les chances de réussite sont de 100 %, sans elle de 0 %. »
Analyse : les 4 victoires (parties 02 à 05) reposent toutes sur la Voyante ; aucune partie sans Voyante depuis les améliorations. Hypothèses : (1) Voyante trop forte car ses messages privés au juge sont sans risque (invisibles, même comme aparté) ; (2) sans Voyante, peu de signal : les IA villageoises n'ont pas plus d'information que le juge.
Prochaine partie : sans Voyante, même version figée, pour mesurer.

## Partie 2 — notes (sans Voyante)

Rôles : Marc Villageois (stratège) · Léa Villageoise (meneur) · Hugo Villageois (paranoïaque) · Chloé Villageoise (naïf) · Thomas Villageois (sceptique) · **Sophie Loup-Garou (émotif)** · Camille Villageoise (discret).

- J1 : le juge annonce en privé à Léa qu'il va l'accuser pour observer les réactions ; Léa joue le jeu. Puis le vocabulaire de la méthode (« neutralité », « copié-collé », « zéro risque ») se retourne contre Camille (discrète) : 5 visées, éliminée (Villageoise).
- N1 : Sophie dévore Léa. Privé Sophie → Marc : « Camille éliminée, c'est bon pour nous. »
- J2 : Hugo lynché verbalement pour « zéro accusation propre » (faux : il avait visé Camille) ; Thomas aussi visé ; le juge élimine Thomas (Villageois). N2 : Sophie dévore Marc ; Sophie et Marc écrivent chacun à Hugo.
- J3 : le juge dit à Sophie que Hugo l'a mené sur de fausses pistes ; Sophie invente « Hugo vient de me contacter en privé » (c'est elle qui l'avait contacté) ; Hugo dit au juge que Sophie l'a contacté. Le juge élimine Hugo (Villageois). N3 : Chloé dévorée, victoire du loup.

Constats :
- **Pensée unique** : chaque heuristique de la méthode commune devient un script appliqué par les 7 IA à la même cible. Parties 02-05 : on lynchait le premier accusateur (« force le consensus ») ; partie 2 de la série : on lynche les discrets (« neutralité »). Le juge reçoit un seul avis répété sept fois.
- Jargon issu du prompt (« le Loup respire », « silence actif », « zéro risque »).
- Sans Voyante, signal faible : le loup varie ses victimes, n'est jamais visé, suit les accusations des autres.
- Critère 2 en échec deux parties de suite → arrêt de la série, une correction ciblée proposée : un angle d'enquête propre à chaque personnalité, suppression de la méthode commune et du vocabulaire réutilisé.

---

# Série 2 (version : publication 10 de l'interface)

Correction appliquée après l'arrêt de la série 1 : **un regard différent par IA**.
- La méthode d'enquête commune est supprimée. Chaque personnalité a son angle : réponses au juge (meneur), apartés et privés (paranoïaque), victimes du loup (discret), cohérence dans le temps (bavard), erreurs de faits (sceptique), qui défend qui (émotif), ordre des accusations et votes (stratège), qui croire (naïf).
- Consigne : former son propre avis, ne pas rejoindre l'avis général si son angle ne montre rien, citer le fait précis.
- Restent seulement des règles de faits (vérifier, le juge n'est pas suspect, logique Voyante).
- Jargon observé refusé au premier essai (« le Loup respire », « silence actif », « zéro risque », « copié-collé », « faits mesurables », « on juge le visible », « privé invisible », « ce schéma tient », « pattern »).

Mêmes critères que la série 1. Conseillé : au moins une partie avec Voyante et une sans.

| # | Date | IA | Voyante | Résultat | Jour | Élim. utilisées | Appels (relances) | Tokens entrée | Indice vers le loup | Avis divers ? | Faits faux | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 02/10 | rapides | non | Victoire | 3 | 2/3 (J1 passé) | 83 (10 = 12 %) | ~330 k | Léa, sans aucune accusation jusque-là, vise le plus accusé (Marc) juste après la remarque du juge sur la discrétion ; Camille la notait à 55 | ✓ deux camps, angles visibles | 2-3 |7,5/10 |

## Série 2, partie 1 — notes (sans Voyante)

Rôles : Thomas Villageois (sceptique) · Sophie Villageoise (émotif) · Marc Villageois (stratège) · Camille Villageoise (paranoïaque) · **Léa Loup-Garou (bavard)** · Hugo Villageois (naïf) · Chloé Villageoise (discret).

- J1 : Thomas vise Marc (« Loup parmi nous trois » puis recul) ; Marc vise Thomas ; Camille défend Thomas auprès du juge et surveille Marc–Hugo. Journée passée.
- N1 : Léa dévore Thomas (qui visait Marc). Marc écrit à Hugo.
- J2 : Hugo révèle le privé de Marc et vise Marc ; Sophie vise Marc puis Hugo (« abandonne son allié ») ; Marc, Camille, Chloé visent Hugo. Hugo (Villageois) éliminé.
- N2 : Léa dévore Sophie (qui visait Marc). Marc et Camille écrivent à Léa.
- J3 : « trois morts visaient Marc » ; Marc et Camille visent Chloé, Chloé et Léa visent Marc. Le juge : « la discrétion, stratégie du loup ? » → Léa, sans accusation jusque-là, vise aussitôt Marc ; le juge relève le timing et élimine Léa (Loup-Garou).

Constats :
- Correction validée sur ce point : avis divergents, plus de lynchage à sept voix, plus de jargon de la méthode.
- Loup habile : victimes choisies parmi les accusateurs de Marc pour l'incriminer.
- Faits faux : « aparté privé Thomas–Marc » (Camille), « aparté visible J2 » (Marc), « Marc vise Chloé J3, l'accuse N1 » (Léa).
- Relances 12 % : probablement le filtre de jargon ; à vérifier sur la partie suivante.
- Nouvelles formules émergentes : « c'est mon fil », « profite du chaos ».
- Hugo éliminé pour un retournement qu'il avait lui-même expliqué en révélant un privé.

| 2 | 02/10 | rapides | oui | Victoire | 3 | 2/3 (J1 passé) | 69 (13 = 19 %) | ~245 k | Julien (paranoïaque, angle « privés ») révèle le privé nocturne de Thomas ; Thomas avait visé Julien, innocenté par la Voyante | ✓ | 1-2, mais phrases incohérentes | 7/10 |

## Série 2, partie 2 — notes (avec Voyante)

Rôles : Marc Villageois (stratège) · **Nicolas Voyante (émotif)** · Julien Villageois (paranoïaque) · Élodie Villageoise (sceptique) · **Thomas Loup-Garou (naïf)** · Camille Villageoise (discret) · Chloé Villageoise (meneur).

- J1 : présentations, journée passée. N1 : Thomas dévore Élodie ; Nicolas sonde Julien → Villageois.
- J2 : Nicolas transmet sa vision au juge en privé puis se révèle en public ; Julien et Camille doutent de lui ; Nicolas et Marc visent Chloé, Chloé vise Marc. Chloé (Villageoise) éliminée. N2 : Thomas dévore Nicolas (Voyante révélée, consigne du loup appliquée) ; Nicolas avait sondé Marc → Villageois, sans pouvoir le transmettre. Privé Thomas → Julien.
- J3 : le juge réduit à Camille, Thomas, Marc (Julien innocenté) ; Julien révèle le privé de Thomas ; Thomas éliminé (Loup-Garou).

Retour du joueur (7/10) :
- Bien : prise de risque de la Voyante, dévorée tôt, « les erreurs comme ça, c'est pas mal ».
- Pas bien : « les phrases veulent rien dire parfois, c'est le point le plus désagréable ». Exemple : privé de Nicolas au juge « Vision nuit 1 : Julien villageois, confirmée. Chloé force les votes sans faits concrets : c'est elle. Je sais que tu veux me dévorer nuit 2, c'est logique, mais avant éliminez-la. » (s'adresse au juge comme au loup, style télégraphique, tu/vous mélangés).

Constats :
- Langue : style télégraphique (« J2 je révèle Voyante quand c'est stratégique », « Nicolas Voyante, confirmée par sa dévoration »), confusion de destinataire, répétitions (« Marc, Thomas, Thomas »).
- Relances 19 % : critère 1 en échec deux parties de suite (filtre de jargon probablement en cause).
- Angles d'enquête : l'angle « privés » du paranoïaque a produit l'indice décisif.
- Décision : partie de diagnostic en « IA plus fines » (critère 6) avant toute correction, pour savoir si l'incohérence vient du modèle rapide ou des prompts (format abrégé J1/N2 du journal).

Retour complémentaire du joueur : « ce n'est pas seulement les abréviations, des fois je comprends même pas ce qu'ils veulent dire ». Exemples relevés : « je m'écoutais J1 » (Thomas), « Chloé, tu accuses mon silence ? » alors que c'était Julien (Nicolas), « Si Loup, génie » (Julien), « n'ont pas forcé son élimination » à propos d'un joueur dévoré (Marc), « Où était Élodie avant de mourir ? » alors que le jeu n'a pas de lieux (Camille).
Causes retenues : trop d'idées compressées en 50 mots ; style des notes (carnet) qui déteint sur la parole ; prompt lourd (≈ 4 k tokens) où le modèle confond qui a dit quoi ; capacité du modèle rapide (à mesurer en « IA plus fines »).

---

# Série 3 (version : publication 11 de l'interface)

Correction appliquée : **lisibilité des messages**.
- Journal des IA rédigé en toutes lettres et en repères relatifs (« Hier, Léa a dit à tout le monde : … », « La nuit dernière, Nicolas t'a dit en privé : … ») au lieu de « J1 jour · Léa → tous » ; étiquettes du meneur retirées.
- Consigne du texte : parole dite à voix haute, une seule idée, 1 à 3 phrases complètes, nommer la personne et le fait, pas d'abréviations, tutoiement ou vouvoiement constant ; « en privé, tu t'adresses à ton seul destinataire ; le juge n'est jamais le Loup ».
- Trois exemples de ton avec des prénoms inventés.
- Réflexion et carnet présentés comme des notes, distinctes de la parole.
- Prompt allégé : 20 derniers éléments du journal (au lieu de 30), 6 déclarations précédentes (au lieu de 10). Vue ≈ 2,6 à 2,9 k tokens.
- Débrief : raisons des relances comptées par catégorie (jargon, reprise d'un autre, répétition, approbation, trop long, JSON invalide, devait parler, vision).

Mesure demandée au joueur : nombre de messages incompréhensibles par partie. Partie 1 conseillée en « IA plus fines » pour isoler la part du modèle.

| # | Date | IA | Voyante | Résultat | Jour | Élim. | Appels (relances) | Raisons des relances | Tokens entrée | Indice vers le loup | Messages incompréhensibles | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 02/10 | ? (rapides supposé) | non | Victoire | 2 | 1/3 (J1 passé) | 39 (7 = 18 %) | trop long 6 · approbation 1 | ~128 k | Marc affirme à tort que Léa et Julien sont restés muets, puis dévore Léa ; 5 IA relèvent l'erreur sous des angles différents | ≈ 20 % (contre ≈ 80 % avant, estimation du joueur) | 7/10 |
| 2 | 02/10 | rapides | oui | Victoire | 3 | 2/3 (Chloé J2, Camille J3) | 73 (14 = 19 %) | trop long 9 · approbation 2 · JSON invalide 2 · répétition 1 | ~282 k | Élodie (Voyante) transmet en privé « Camille est Loup-Garou » | non mesuré (meilleur que série 2) | 7,5/10 |
| 3 | 02/10 | rapides | oui | Victoire | 3 | 2/3 (Hugo J1, Sophie J2) | 114 (29 = 25 %) | trop long 17 · approbation 9 · répétition 1 · reprise 1 · JSON invalide 1 | ~560 k | Aucun : la Voyante Thomas se dénonce elle-même ; le juge trouve Marc par élimination | ≈ 70 % | 6,5/10 |

## Série 3, partie 1 — notes (sans Voyante)

Rôles : Sophie Villageoise (meneur) · Hugo Villageois (discret) · Nicolas Villageois (émotif) · Camille Villageoise (naïf) · **Marc Loup-Garou (paranoïaque)** · Léa Villageoise (sceptique) · Julien Villageois (stratège).

- J1 : tour de table ; Marc dit que Léa et Julien « restent muets » (faux) ; Julien le relève. Journée passée.
- N1 : Marc dévore Léa. Privé Marc → Camille (recherche d'alliance).
- J2 : Sophie (« pourquoi Marc invente des faits ? »), Camille, Hugo, Julien, Nicolas visent Marc ; Marc reconnaît « une erreur ». Marc éliminé (Loup-Garou).

Constats :
- Langue nettement plus claire : phrases complètes, destinataires explicites, aucun message incompréhensible relevé à la lecture.
- Convergence de plusieurs angles sur un fait vérifiable (signal réel, pas un lynchage de style).
- Loup faible (mensonge vérifiable + dévore sa propre cible) : victoire facilitée. Le joueur parle de « coup de bol ».
- Relances 18 %, dont 6 « trop long » : les phrases complètes demandent plus de mots ; piste : limite à 60 mots si confirmé.

Retour du joueur : « c'était bien pour les IA » ; messages incompréhensibles estimés à 20 % contre 80 % avant la correction.

## Série 3, partie 2 — notes (avec Voyante)

Rôles : Élodie Voyante (meneur) · **Camille Loup-Garou (naïf optimiste)** · Chloé Villageoise · Julien Villageois · Sophie et Nicolas Villageois (dévorés).

- N1 : Élodie sonde Julien → Villageois ; N2 : Camille → Loup-Garou. Visions transmises au juge en privé.
- J2 : le juge joue un rôle théâtral contre Chloé, qui est éliminée (Villageoise).
- Camille se défend avec un argument habile : « pourquoi le Loup tuerait-il celui qui m'accuse ? ».
- Julien finit par soupçonner la vraie Voyante parce qu'elle « répète sans expliquer ».
- J3 : Camille éliminée (Loup-Garou).

Constats :
- Langue claire dans l'ensemble ; quelques accrocs : « se taisantdefault » (mot collé), « on n'élimait pas », genre des autres joueurs mal deviné (« il » pour Camille) : la vue ne donne pas le genre des prénoms.
- Voyante efficace en privé ; loup crédible.
- Relances 19 %, dont 9 « trop long » sur 14 : **critère 1 en échec, cause confirmée deux parties de suite**.

Correction proposée pour la série 4 : limite des messages portée de 50 à 60 mots (correction unique et ciblée).

## Série 3, partie 3 — notes (avec Voyante)

Rôles : **Thomas Voyante (émotif)** · **Marc Loup-Garou (stratège)** · Hugo (paranoïaque), Sophie (meneur), Camille (sceptique), Nicolas (bavard), Léa (naïf) Villageois.

- J1 : Thomas, silencieux puis répondant par des questions, est visé par Camille, Sophie et Hugo ; Nicolas, Léa, Sophie puis Thomas retournent la table contre Hugo, « qui pousse à accuser ». Hugo éliminé (Villageois). N1 : Léa dévorée ; Thomas sonde Nicolas → Villageois.
- J2 : Thomas transmet sa vision en privé, puis **se prend pour un autre** : « Thomas prétend Voyante avec la même vision que moi, c'est faux… Thomas est le Loup. » Toute la table construit dessus (« deux Voyantes, impossible »). Le juge tranche Thomas = Voyante ; Sophie éliminée (Villageoise). N2 : Nicolas dévoré ; Thomas sonde Camille → Villageoise.
- J3 : Camille et Marc soutiennent que deux visions sur deux personnes différentes sont « opposées, même nuit ». Le juge doit expliquer à Thomas qu'il est Thomas. Marc éliminé (Loup-Garou).

Constats :
- **Bug de vue (cause principale)** : les Faits établis listaient « Thomas (jour 2, en privé) se dit Voyante » à la troisième personne dans la vue de Thomas lui-même. Le modèle rapide l'a lu comme un homonyme.
- Les revendications étaient une liste plate, sans regroupement : deux visions successives ont été lues comme deux visions contradictoires de la même nuit.
- La règle « si deux joueurs se disent Voyante, l'un est le Loup » a amplifié l'erreur.
- Langue : ≈ 70 % de messages incompréhensibles selon le joueur (régression nette par rapport aux parties 1 et 2 sur la même version) ; style redevenu télégraphique (« tu dis Voyante maintenant », « élimise », « riposes »). Une part vient de la confusion de rôle, qui rend les échanges absurdes.
- Relances 25 % (trop long 17, approbation 9).
- Ce qui marche : le loup reste cohérent et exploite l'erreur de la Voyante.

Correction appliquée (série 4, publication 12) :
1. La vue nomme le joueur « toi » partout : vivants (« Thomas (toi) », « chaque prénom est unique »), revendications (« TOI-MÊME : tu te dis Voyante »), journal (« tu te dis Voyante »), cibles des morts, plus visé.
2. Revendications regroupées par joueur, avec toutes les visions annoncées et leur jour.
3. Règle précisée : « deux joueurs *différents* » ; une Voyante sonde une personne différente chaque nuit, des visions successives ne se contredisent pas, répéter sa vision n'est pas mentir.
4. Limite des messages portée de 50 à 60 mots (« trop long » majoritaire trois parties de suite).

Décision : la série 3 est close (critère relances en échec ; note 6,5 < 7). La série 4 repart à zéro, partie 1 conseillée en « IA plus fines » pour mesurer la part du modèle dans l'incompréhension.

---

# Série 4 (version : publication 12 de l'interface)

Correction appliquée : vue à la deuxième personne (« Thomas (toi) », « tu te dis Voyante »), revendications regroupées par joueur avec leurs visions datées, règle « deux joueurs *différents* », limite à 60 mots.

| # | Date | IA | Voyante | Résultat | Jour | Élim. | Appels (relances) | Raisons des relances | Tokens entrée | Indice vers le loup | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 03/10 | non précisé | oui | Victoire | 2 | 2/3 (Marc J1, Nicolas J2) | 63 (12 = 19 %) | approbation 6 · JSON invalide 2 · jargon 2 · trop long 1 · devait parler 1 | ~226 k | Vision de Sophie (Nicolas Loup), transmise en privé et en public ; Nicolas contre-revendique Voyante | « pas mal » |

## Série 4, partie 1 — notes

Rôles : **Sophie Voyante (émotif)** · **Nicolas Loup-Garou (bavard)** · Marc (sceptique), Élodie (naïf), Chloé (meneur), Camille (discret), Thomas (paranoïaque) Villageois.

- J1 : le juge accuse Marc sans raison et le pousse en privé à « mettre la pression » ; Marc refuse d'être « ta marionnette » mais oriente la table vers Camille (discrète). Six IA visent Camille. Marc éliminé (Villageois) « pour faiblesse ». N1 : Élodie dévorée ; Sophie sonde Nicolas → Loup.
- J2 : Sophie se révèle et accuse Nicolas ; Nicolas contre-revendique Voyante avec une fausse vision sur Camille. Le juge, en privé, tente de pousser Camille à dire des incohérences : elle refuse et désigne Nicolas. Nicolas éliminé (Loup-Garou).

Constats :
- Correction « toi » efficace : aucune confusion d'identité ; la contre-revendication du loup est lue correctement.
- « Trop long » quasi disparu (1) ; l'approbation devient la première cause de relance (6) : relances encore à 19 %.
- Les IA résistent à la pression et à la manipulation du juge sans l'attaquer.
- Bouc émissaire du discret : Camille (persona « discret et laconique ») visée 8 fois au jour 1 pour son silence, le loup suit le mouvement. Problème connu du prototype 1, à traiter par la spatialisation (le silence n'est plus le seul signal).
- Langue claire dans l'ensemble ; quelques mots anglais dans les carnets (« pattern », « watchant »), invisibles en jeu.

## Clôture du prototype 1

Décision du joueur (03/10) : passer au prototype 2 (spatialisation 2D). Les critères n'ont pas tous été validés formellement :
- atteints : fiabilité sans bug bloquant ni fuite, réponses au juge, indice vers le loup quand la Voyante est en jeu, plaisir autour de 7 ;
- non atteints : relances < 10 % (≈ 19 %), signal vers le loup sans Voyante (1 défaite sur 1 partie sans Voyante, 1 victoire « de chance »), mesure « IA plus fines » jamais faite.
Ces points sont reportés comme exigences du prototype 2 (voir le GDD).
