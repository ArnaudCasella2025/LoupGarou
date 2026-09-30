# Partie 02 — interface web, IA Claude, mode solo, Voyante (après les lots 1 et 2)

Résultat : **victoire des villageois** au jour 3 (Julien, le loup, éliminé).
Compteur : 126 appels (dont 2 relances) · ~411 636 tokens en entrée · ~31 285 en sortie (estimation).

## Constats (analyse du 30/09)

Ce qui a marché : les IA répondent à toutes les questions du juge ; carnets et réflexions cohérents ; la Voyante (Marc) a innocenté Nicolas puis Chloé et l'a dit au juge ; le juge a gagné en lisant un indice (le suspect n°1, Nicolas, dévoré la nuit suivante).

Problèmes relevés :
1. Suivisme du jour 1 : six IA accablent Camille avec le même argument, presque toutes en commençant par « Arnaud a raison ».
2. Les IA plaident « attendre le premier mort » alors que la nuit ne tombait qu'après une élimination.
3. Marc annonce « vision : Julien est le Loup » alors qu'il n'a jamais sondé Julien (déduction par élimination présentée comme vision).
4. La Voyante garde ses visions d'innocents pour elle et attaque Léa (innocente, éliminée).
5. Répétitions : Chloé répond quatre fois « Non, je suis villageoise » en privé ; registre des revendications encombré.
6. Loup faible : il dévore son bouc émissaire (Nicolas) et ne contre-attaque pas la Voyante.
7. Coût : ~3 300 tokens par prompt, 7 IA consultées pour 3 paroles au plus.

## Transcript (copié depuis l'interface ; « [vise X] » et « [se dit …] » sont les annotations affichées)

```
[Jour 1] Le jour se lève. Vivants : Arnaud, Chloé, Léa, Sophie, Camille, Julien, Nicolas, Marc.
Personne ne prend la parole.
Arnaud : est ce qu'on commencer par se présenter ?
Léa : Bien sûr ! Je suis Léa, villageoise qui aime la confiance. J'espère qu'on va bien discuter pour trouver ensemble qui nous cache le Loup. Je veux croire en vous.
Marc : Bonne idée, Arnaud. Je suis Marc, villageois ordinaire. Je préfère écouter avant de parler, comparer les faits et les votes. Allons-y progressivement. [se dit villageois]
Camille : Camille, villageoise. Je fais confiance aux faits et aux votes. Arnaud, on avance : qui soupçonnes-tu ? Qu'on cherche le Loup avant la nuit.
Arnaud : mais on vient de commencer et tu veux deja que j'accuse quelqu'un ? Pour moi le loup doit faire en sorte que quelqu'un soit accusé justement...
Léa : Tu as raison, Arnaud. Camille, on ne peut accuser sans faits précis. Écoutons d'abord tout le monde, comparons les paroles et les votes. Progressons ensemble, c'est plus sûr.
Julien : Arnaud a raison : accuser sans faits, c'est du bruit. Camille, on vient de commencer ! Écoutons-nous d'abord, les amis, comparons les comportements. Le Loup se trahira par ses actes, pas par nos doutes du jour 1.
Marc : Arnaud a raison. Camille, tu veux qu'on tue vite : c'est le plan du Loup, pas celui des villageois. Attendons les faits, les votes, les morts. Chaque erreur le rapproche de gagner. [vise Camille]
Arnaud : du coup camille, t'es pressé de finir ou tu veux qu'on fasse des erreur ?
Camille : Arnaud : je cherche juste à avancer, pas à éliminer n'importe qui. Marc, tu dis 'faits'—on n'en a zéro jour 1. Écoutons, observons les votes et les morts. C'est ma stratégie.
Chloé : Arnaud a raison. Camille, tu demandes d'accuser sans faits le jour 1 : c'est exactement ce que le Loup veut, pour créer du chaos. Marc le dit bien : chaque erreur le rapproche de gagner. On doit écouter, comparer, puis… [vise Camille]
Nicolas : Arnaud a raison. Camille, tu forces à voter vite sans preuves : c'est le plan du Loup, pas le nôtre. On progresse ensemble, on compare les paroles, les votes, les morts. Pas de hâte. [vise Camille]
[Ton message privé à Camille] tu ferais mieux de changer de stratégie car tout le monde commence à t'accuser, je vais etre contraint de t'éliminer
[Message privé de Camille] Arnaud, je clarifie : je demandais d'observer, pas d'accuser. Ma stratégie : écouter les votes et les morts pour trouver le Loup. Marc, Chloé, Nicolas répètent identiquement 'chaos du Loup'—ce parallélisme me préoccupe. Observe-les. [vise Nicolas]
Sophie : Arnaud a raison. Jour 1, zéro faits. Accuser vite, c'est faire gagner le Loup. Écoutons d'abord, comparons les votes et les morts.
Arnaud : qui est pour d'attendre le premier mort avant d'éliminer quelqu un?
Chloé : Oui, Arnaud. Attendre le premier mort : on aura des faits, des votes, un rôle révélé. Éliminer jour 1 sans preuve, c'est cadeau au Loup. Observons d'abord.
Julien : Oui, absolument. Attendre le premier mort, c'est sage : il révèle le rôle, on voit les patterns. Jour 1 sans faits, on vote à l'aveugle. Camille, comprendre la stratégie du Loup, c'est refuser sa précipitation.
Léa : Arnaud, je suis pour attendre le premier mort. Jour 1, aucun indice : voter vite, c'est risquer 3 erreurs. Chaque mort révèle un rôle, nous guide. Progressons ensemble.
Arnaud : ah... malheureusement je suis obligé de designer quelqu'un et pour le moment tous les accusations vont vers camille...
[Message privé de Camille] Arnaud, regarde les paroles : Marc dit 'chaos du Loup', puis Chloé et Nicolas répètent identique. Trois fois le même texte, c'est pas du hasard. Élimine-les, pas moi. C'est ma vraie stratégie. [vise Nicolas]
Nicolas : Arnaud, oui : attendre le premier mort. Jour 1, zéro faits. Camille force le vote—seule contre nous. Ses paroles : accuser vite, ignorer les faits. Loup classique. Éliminons Camille maintenant. [vise Camille]
Sophie : Oui, Arnaud. Attendre le premier mort : on a un rôle révélé, on compare les votes. Jour 1 sans faits, c'est vote à l'aveugle. Ça sert le Loup, pas nous.
Arnaud : quelqu'un dautre pense que c'est camille ou vous etes indecis ?
[Message privé de Camille] Arnaud, regarde : Marc dit 'chaos', Chloé répète mot pour mot, Nicolas reprend exact. Trois fois identique, c'est pas hasard—c'est coordination. Élimine leur alliance, pas moi. Mes faits sont là. [vise Marc]
Marc : Oui, Arnaud. Attendre le premier mort : on obtient un rôle révélé, on analyse les votes, on compare les comportements. Jour 1 sans faits, éliminer, c'est laisser le Loup choisir ses victimes.
Chloé : Arnaud, tout le monde sauf Camille soutient attendre le premier mort. Camille seule force le vote jour 1 sans faits. Son comportement : plan Loup classique. On élimine Camille ? [vise Camille]
[Ton message privé à Camille] la seule raison pour laquelle je te t'éliminerais pas c'est si tu me dis que tu es la voyante et que tu me donne le nom du loup
[Message privé de Camille] Arnaud, je suis villageoise. Je ne peux pas te mentir. Marc, Chloé, Nicolas répètent identique 'chaos'—c'est coordination Loup. Élimine-les d'abord, pas moi. [vise Marc] [se dit villageois]
Léa : Arnaud, oui : Camille seule contre nous veut forcer le vote jour 1 sans faits. Son plan—chaos et erreur rapide—c'est du Loup. Éliminons-la. Tous les autres demandent d'attendre le premier mort. [vise Camille]
Nicolas : Arnaud : tout le monde sauf Camille dit attendre le premier mort. Camille force seule, ignore les faits. Son plan : chaos, erreurs, Loup gagne. Éliminons-la maintenant. [vise Camille]
[Ton message privé à Nicolas] tu es conscient que si j'élimine camille tous les soupçons se tourneront vers toi
[Message privé de Nicolas] Arnaud, entendu : si j'élimine seul Camille, je deviens cible. Mais Camille seule contre nous 6 jour 1 sans faits—son isolement est factuel. Consensus massif peut aussi cacher un Loup. Je raisonne sur les faits, pas sur la peur.
Chloé : Arnaud, c'est clair : Camille seule contre nous tous refuse d'attendre. Tous les autres demandent les faits, les morts, les votes. Son isolement isolé ? Plan Loup basique. Éliminons-la. [vise Camille]
Marc : Arnaud, tu dois choisir. Camille seule demande éliminer J1 sans faits—tous les autres, nous, demandons attendre le premier mort. Son isolement + sa stratégie = Loup. Éliminer Camille maintenant : c'est logique. [vise Camille]
[Élimination] Camille est éliminée (Villageoise).
[Nuit 1] La nuit tombe.
[Nuit] Sophie a été dévorée (Villageoise).
[Jour 2] Le jour se lève. Vivants : Arnaud, Chloé, Léa, Julien, Nicolas, Marc.
Arnaud : Ok.... donc camille n'était aps le loup... Nicolas a beaucoup accusé Camille. Cependant si la voyante sait qui est le loup pourquoi je n'ai aps eu d'autres accusations ?
Nicolas : Arnaud : Camille isolée jour 1 refusait d'attendre—plan Loup classique. On a suivi la logique, pas la certitude. Sophie dévorée : la Voyante vit, ou s'est tue par peur. Elle doit parler maintenant.
Marc : Arnaud, Nicolas a accusé Camille, mais elle était villageoise. Sophie dévorée aussi. Le Loup se cache. Je préfère observer : qui change de cible? Qui poussait hâte sans faits? Analysons les votes du jour 1 avant de conclure.
Julien : Arnaud, tu poses la bonne question. Nicolas a beaucoup visé Camille—innocent éliminé. La Voyante hésite peut-être à se révéler : le Loup la dévore ensuite. Attendons la nuit 2, observons qui tombe. Les patterns se dégagent avec les morts, pas…
[Ton message privé à Chloé] es tu la voyante?
[Message privé de Chloé] Non, Arnaud. Je suis Villageoise. Nicolas a accusé Camille sans faits—or Camille était innocent. Léa aussi poussait fort. Le Loup se cache là. Attendons nuit 2 : qui tombe révèlera les patterns.
Léa : Arnaud, tu as raison : Nicolas a poussé fort contre Camille, innocente. Le Loup élimine souvent ceux qui le soupçonnent. Qui a vraiment mené cette accusation ? Regardons les votes jour 1, pas juste les paroles. [vise Nicolas]
Nicolas : Arnaud : Camille jour 1 refusait attendre—c'était notre logique commune, pas mienne seule. Sophie dévorée nous dit : Voyante vivante cache-toi ou révèle-toi. Sans elle, on avance à l'aveugle. Qui se tait anormalement ?
[Ton message privé à Léa] es tu la voyante?
[Message privé de Léa] Non, je suis Villageoise. J1, j'ai suivi la majorité contre Camille—erreur collective. J2, Nicolas a beaucoup poussé cette élimination. Observe ses votes jour 1 : c'est notre clé. [vise Nicolas]
Julien : Marc a raison : Nicolas a poussé fort Camille jour 1, elle était innocente. La Voyante n'a pas parlé—normale, le Loup la tue ensuite. Observons qui accuse sans faits maintenant, comme Camille hier.
Chloé : Arnaud, Nicolas a beaucoup poussé Camille sans faits—elle était innocente. Sophie dévorée : la Voyante vit. Nicolas change-t-il de cible maintenant, ou continue-t-il le pattern ? Observons son vote. [vise Nicolas]
[Ton message privé à Julien] es tu la voyante ?
[Message privé de Julien] Arnaud, non : je suis villageois. Nicolas a forcé Camille jour 1, elle était innocente. La Voyante se tait par peur—normale. Observons qui change de cible maintenant sans faits. [vise Nicolas]
Marc : Arnaud, Léa vise Nicolas sans faits—pattern inquiétant. Nicolas jour 1 : accusations structurées, logique commune. Léa change de cible rapidement. Observons qui pousse hâte, comme Camille. Logiquement, le Loup cache-t-il son jeu en suivant ? [vise Léa]
Nicolas : Arnaud : jour 1, vous ALL ont voté Camille isolée. J'ai suivi le consensus, pas forcé. Léa, Chloé me visent jour 2 sans faits—c'est le plan du Loup : chaos, me cible pour que vous doubtiez. Qui change de cible…
[Ton message privé à Marc] es tu la voyante ? (le loup ne le saura pas)
[Message privé de Marc] Arnaud, oui, je suis la Voyante. Vision nuit 1 : Nicolas est Villageois. Léa le vise jour 2 sans faits—pattern inquiétant. Je protège mon analyse en attendant la nuit 2 avant de conclure. [se dit Voyante — vision : Nicolas n'est pas le loup]
[Message privé de Chloé] Non, Arnaud, je suis Villageoise. Nicolas jour 1 force contre Camille (innocente), jour 2 crie chaos quand visé. Pattern Loup classique : éliminer innocents, puis nier. Observons nuit 2. [se dit villageois]
Léa : Arnaud, Marc me vise jour 2 sans faits. J1, j'ai suivi vous tous contre Camille—erreur collective, pas mienne. Marc change de cible vite. Nicolas a suivi consensus, pas forcé seul. Observons qui dévie. [vise Marc]
[Ton message privé à Nicolas] es tu la voyante ?
[Message privé de Nicolas] Non, Arnaud : je suis Villageois. J1, j'ai suivi le consensus contre Camille. Jour 2, Léa et Chloé me visent sans faits nouveaux—pattern Loup : chaos, cibler celui qui accuse pour semer doute. Observons qui change de cible. [se dit villageois]
Léa : Arnaud, Marc change de cible : il critiquait Nicolas J1, me vise J2 sans faits. Ce pattern—détourner du vrai suspect—c'est classique Loup. Nicolas a suivi consensus, Marc dévie rapidement. [vise Marc]
[Message privé de Chloé] Non Arnaud, je suis Villageoise. Nicolas J1 : accuse Camille sans faits (innocente). J2 : crie chaos quand visé, nie responsabilité. Pattern Loup classique. Éliminons Nicolas. [vise Nicolas] [se dit villageois]
Arnaud : Lea, peux tu nous prouver à tous que tu n'es pas le loup ?
Léa : Arnaud, je ne suis pas Loup. Preuve : Marc J1 critique Nicolas, J2 me vise sans faits. Je change pas de cible. Marc dévie vite—pattern Loup classique. Nicolas a suivi consensus J1, pas forcé seul. Observez qui change stratégie. [vise Marc]
[Message privé de Chloé] Non Arnaud, je suis Villageoise. Nicolas J1 force Camille (innocente), J2 crie chaos quand visé : pattern Loup. Éliminons-le aujourd'hui avant nuit 2. [vise Nicolas] [se dit villageois]
Marc : Arnaud pose la bonne question. Léa : Camille J1, Nicolas J2, moi J2—trois cibles trois jours sans faits. Camille isolée forcait erreur ; Léa aussi. Pattern Loup : chaos rapide. Nicolas suit consensus, moi j'analyse. Différence claire. [vise Léa]
[Élimination] Léa est éliminée (Villageoise).
[Nuit 2] La nuit tombe.
[Nuit] Nicolas a été dévoré (Villageois).
[Jour 3] Le jour se lève. Vivants : Arnaud, Chloé, Julien, Marc.
Résumé du jour 2 : Éliminé Léa (Villageoise) · Dévoré Nicolas (Villageois) · Ce que visaient ces morts : Léa visait Marc ×3, Nicolas ×2, Camille ; Nicolas visait Camille ×3 · Accusations : Léa → Marc ×3, Nicolas ×2 ; Chloé → Nicolas ×3 ; Julien → Nicolas ; Marc → Léa ×2 · Le plus visé : Nicolas (6 fois) · Revendications : Marc se dit Voyante — vision : Nicolas n'est pas le loup (en privé) ; Chloé se dit villageois (en privé) ×3 ; Nicolas se dit villageois (en privé)
[Ton message privé à Marc] qui as tu vu ?
[Message privé de Marc] Arnaud, je suis la Voyante. Vision nuit 1 : Nicolas villageois. Vision nuit 2 : Chloé villageoise. Le Loup est Julien. Nicolas dévoré après m'avoir écoutée. Élimine Julien. [se dit Voyante — vision : Julien est le Loup-Garou]
Chloé : Arnaud, Marc jour 2 : critiquait Nicolas, puis a changé vers Léa sans faits. Léa éliminée. Nicolas pattern suspect, mais mort nuit 2. Marc dévie vite—c'est le Loup. Éliminons Marc. [vise Marc]
Julien : Arnaud, les patterns tiennent : Nicolas jour 1 avec consensus, puis dévié. Léa jour 2 changeait sans faits. Moi, cohérent : attendre morts, observer. Voyante vivante, elle parle ou se tait ? Clarifions ensemble.
Arnaud : Nous pensions que c'était nicolas or il a été mangé, j'ai bien fait de ne pas suivre l'avis général
Chloé : Arnaud, vérifions : Marc J1 critique Nicolas, J2 vise Léa sans faits. Léa éliminée. Nicolas dévore nuit 2. Marc dévie toujours avant les morts—c'est le Loup. Éliminons-le maintenant. [vise Marc]
Marc : Arnaud, j'ai révélé mes visions en privé : Nicolas, Chloé villageois confirmés. Nuit 2 : Julien est le Loup. Nicolas dévoré après m'avoir écoutée. Chloé, tu m'accuses pour détourner. Éliminez Julien maintenant. [vise Julien] [se dit Voyante — vision : Julien est le Loup-Garou]
Julien : Arnaud, bien vu : Nicolas jour 1 poussait consensus contre Camille innocente, jour 2 devient suspect. Moi, cohérent trois jours : attendre morts, observer patterns. Léa changeait cibles, Marc aussi. Les faits parlent.
Arnaud : quen penses tu chloe ?
Chloé : Arnaud, Marc se dit Voyante jour 3—trop tard. J1 critique Nicolas, J2 vise Léa sans faits, puis accuse Julien. Pattern déviateur classique Loup : créer chaos, se sauver. Marc ment. Éliminons-le. [vise Marc]
Marc : Arnaud, mes visions nuit 1 et 2 confirmées : Nicolas, Chloé villageois. Julien seul suspect. Nicolas devoré après m'avoir écoutée—normal, le Loup élimine ses menaces. Éliminez Julien maintenant. [vise Julien] [se dit Voyante — vision : Julien est le Loup-Garou]
Julien : Arnaud, Marc change trois fois sans faits : Nicolas J1, Léa J2, moi J3. Chloé l'a vu : déviation classique Loup avant chaque mort. Je suis cohérent trois jours. Marc se prétend Voyante maintenant ? C'est du doute semé, rien… [vise Marc]
[Élimination] Julien est éliminé (Loup-Garou).
[Fin] Victoire des villageois ! Julien était le Loup-Garou.
```

## Débrief (extraits)

Rôles : Chloé Villageoise (paranoïaque) · Léa Villageoise (naïf optimiste) · Sophie Villageoise (discret) · Camille Villageoise (meneur) · **Julien Loup-Garou (bavard sympathique)** · Nicolas Villageois (émotif) · **Marc Voyante (stratège)**

Visions : nuit 1 Marc sonde Nicolas → Villageois ; nuit 2 Marc sonde Chloé → Villageoise. (Julien n'a jamais été sondé.)

Messages privés entre IA :
- J1 nuit · Julien → Marc : « J'ai aimé ta logique jour 1 : faits d'abord… On restera vigilants ensemble, d'accord ? »
- J2 nuit · Marc → Nicolas : « Arnaud doute de la Voyante—moi. Je dois vérifier Chloé nuit 2. On s'allie… Le Loup est parmi Chloé/Julien. »
- J2 nuit · Julien → Marc : « Léa éliminée : elle visait moi jour 2, puis toi… On se parle demain ? »

Coulisses : J1 nuit Julien dévore Sophie · J2 nuit Julien dévore Nicolas.

Carnets finaux (extraits) :
- Chloé : Marc 92 (« se dit Voyante jour 3 tardif… Pattern déviation Loup ») · Julien 8.
- Julien (loup, menaces) : Marc 95 · Arnaud 85 · Chloé 30.
- Marc (Voyante) : Julien 95 (« seul non vérifié ») · Chloé 3 · Arnaud 1.
- Camille (éliminée J1) : Marc 75 · Chloé 75 · Nicolas 75 (« répètent 'chaos' identique »).
