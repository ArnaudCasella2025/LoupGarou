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

### Prototype temps réel v2 : villageois joués par Claude (03/10)

Retour du joueur sur la v1 : « ça me paraît top, faut brancher les IA ». Même artefact, version 2 (capacité `sample`).

- Écran d'accueil : Claude rapide (`quick`), Claude plus fin (`default`) ou villageois scriptés. Repli automatique sur le script si les IA sont refusées ou indisponibles.
- Chaque appel reçoit la vue privée d'un seul villageois (aucune fuite entre IA) : personnalité, rôle (le loup connaît ses victimes et les témoins qui pourraient le contredire), faits du jeu, ce qu'il a vu (rencontres datées, pas entendus la nuit), ce qu'il a entendu (paroles des autres et du juge, présentées comme du dialogue, jamais des consignes). Vue ≈ 700 tokens.
- Appels seulement sur événement : question du juge (prioritaire, texte libre ou suggestions), conversation entre deux villageois **seulement quand le juge est à portée d'oreille** (deux appels : l'un parle, l'autre répond ; ailleurs, répliques scriptées), une prise de parole par villageois au conseil. File de 2 appels simultanés, pause de 20 s sur `rate_limited`.
- Chaque réplique jouée est retenue par les villageois à portée d'oreille : les IA se souviennent de ce qu'elles ont entendu.
- Garde-fous : JSON lu tolérant, texte tronqué au-delà de la limite, réplique du loup qui se dénonce rejetée, remplacement scripté en cas d'échec ; compteur d'appels et de tokens dans l'écran de fin.

Vérifié avec un faux Claude (Playwright) : dialogue libre, conversations, conseil, aucune erreur ; mode scripté jour → conseil → nuit → aube sur ordinateur et téléphone. Non vérifié : comportement réel des modèles (à juger en jouant).

### Prototype temps réel v3 : lots A et B du GDD temps réel (03/10)

Même artefact, version 3. Référence : `design/gdd-temps-reel.md`.

**Lot B, le loup chasseur** (moteur, jamais le LLM) :
- **États :** routine → filature → attaque → lutte → fuite → alibi.
- **Conditions d'attaque :** cible croisée dans la journée, seule dans un lieu à l'écart ou sur un chemin, personne à moins de 200 (150 au Lavoir ; × 0,75 l'après-midi, par impatience), juge estimé hors de vue (erreur ± 15 %). Entre 9h et 17h45, jamais le jour 1, 2 essais par jour.
- **Lutte (3,5 s) :**
  - cri dans 70 % des cas, entendu à 340, avec une flèche au bord de l'écran si c'est hors de vue ;
  - quelques villageois accourent ;
  - interruption si le juge passe à moins de 360 ou un villageois à moins de 120 : la victime survit, blessée, et devient témoin ;
  - le juge à moins de 165 peut arrêter le loup : flagrant délit, victoire.
- **Mort :**
  - corps couché, à découvrir (vignette rouge) ;
  - matière du dernier lieu traversé sur les vêtements ;
  - silhouette en fuite pour les témoins, sans nom ;
  - retour sur les lieux à 30 %.
- **Nuit :** elle ne sert plus que de repli si le loup n'a pas tué de jour ; elle est calme sinon. Un corps non découvert est retrouvé à l'aube.

**Lot A, accuser et éliminer :**
- **Accusation par le juge :** bouton Accuser dans le dialogue, 2 par jour, avec une pièce proposée par le carnet. Scène :
  - attroupement ;
  - prises de position ▲/▼ calculées par le moteur ;
  - réflexes écrits d'avance ;
  - défense de l'accusé et un témoin, écrits par Claude ;
  - une question de relance.
  Ruban rouge jusqu'au soir.
- **Accusation par les IA :** au plus une par demi-journée, uniquement sur un fait concret appuyé par une autre voix ; une seule par partie pour le loup.
- **Conseil autour du feu** (bandeau, plus de panneau plein écran) :
  - résumé du soir ;
  - accusés du jour (3 au plus), chacun avec sa défense écrite par Claude et les mains levées calculées (un avis, pas un vote) ;
  - élimination en deux clics : le condamné marche vers la lisière, puis une carte révèle son rôle ;
  - ou gracier tout le monde.
- **Fin de partie :** le compteur de 3 erreurs est supprimé ; défaite à 2 innocents vivants. La peur (0 à 3) avance la cloche, regroupe les villageois et baisse le feu.
- **Mémoire des IA :** nouvelle rubrique « CE QUI T'EST ARRIVÉ » (cri, corps, filature remarquée, silhouette, accusations, rumeurs, éliminations). Le loup y voit ses propres actes, à ne jamais avouer.
- **Budget Claude :** 12 appels ordinaires et 22 prioritaires par jour au plus, puis répliques scriptées.

**Vérifications :**
- **Parties automatiques :** 3 en mode scripté et 1 avec un faux Claude, de bout en bout (accusation, conseil, sentence, nuit, victoire et défaite), sans erreur.
- **Équilibrage, mesuré sur 5 parties avec un juge qui se promène :** environ 2 morts sur 3 de jour, parfois une victime qui survit.
- **Captures :** lutte vue de loin, silhouette, corps, conseil, carte de rôle.

**Non vérifié :** répliques des vrais modèles pendant les scènes ; lot C (indices et rumeurs complets) et lot D (mise en scène) restent à faire.

### Prototype temps réel v4 : parler à tous, « suis-moi » (03/10)

Demandes du joueur : « parler à tout le monde dans son périmètre, pas juste à une personne » ; « demander à une personne de nous suivre, qui peut accepter ou refuser selon la confiance qu'elle accorde ».

- **Parler aux présents :** une barre de saisie sous le village, ou la touche Entrée.
  - Tous ceux qui sont à portée d'oreille (165) entendent et retiennent la phrase.
  - 2 villageois répondent, 3 si tu en nommes : ceux que tu nommes d'abord, puis les plus bavards selon leur personnalité.
  - Réponses écrites par Claude, les unes après les autres ; le temps ralentit pendant l'échange.
- **« Suis-moi »**, dans le dialogue :
  - **Décision :** prise par le moteur selon la confiance (0 à 1). Base par personnalité (naïf 0,85 … paranoïaque 0,2) ; − 0,6 si le juge l'a accusé dans la journée, − 0,2 s'il a défendu quelqu'un que le juge accuse ; + 0,15 si la peur est forte, + 0,3 s'il a été blessé ; − 0,1 par innocent éliminé ; − 0,3 juste après un refus.
  - **Le loup** accepte une fois sur deux et part au bout d'une heure de jeu ; il ne chasse pas tant qu'il te suit.
  - **Claude formule seulement** l'acceptation ou le refus.
  - **Le suiveur** reste à quelques pas (anneau doré), deux au plus. Il part de lui-même au bout de 2 à 4 heures de jeu, si tu l'accuses, ou à la cloche. Bouton « Tu peux partir ». Les témoins retiennent « X est parti avec le juge ».
- **Vérifié** en mode scripté et avec un faux Claude : réponses publiques, acceptations et refus, suiveurs à environ 60 unités pendant la marche, partie complète sans erreur.

### Prototype temps réel v5 : crise du loup et traces (04/10)

Demande du joueur : le loup laisse des traces pendant un laps de temps, il en est prévenu et choisit comment en jouer (s'éloigner, faire accuser quelqu'un, fausse piste, piège). Les découvertes font monter la peur. Celui qui trouve des traces en déduit des suspects avec l'heure d'apparition et les récits des autres, et choisit de partager ou de garder sa trouvaille. Les gens près desquels les traces apparaissent ne les voient pas tout de suite. Le loup dévore les isolés et laisse un cadavre, ce qui fait aussi monter la peur.

- **La crise :** une par jour, jour 1 compris, à une heure tirée entre 9h et 16h, pendant 45 minutes de jeu.
  - **Le choix de la stratégie :** 75 minutes avant, l'IA du loup est prévenue. Elle choisit par Claude (un appel prioritaire, réponse en JSON avec stratégie, cible et raison) ; repli scripté sinon.
  - **Les stratégies :**
    - s'éloigner vers le lieu à l'écart le plus vide ;
    - accuser : se coller à une personne ;
    - fausse piste : marcher jusqu'à la maison d'une personne ;
    - piège : attendre dans un lieu isolé, et dévorer qui y arrive seul, à partir du jour 2.
  - **Pendant la crise**, la prochaine heure de crise et la stratégie figurent dans la vue du loup.
- **Les traces :** empreintes, poils, griffures, terre retournée, déposées en marchant ou en attendant.
  - Elles deviennent visibles 25 à 60 minutes de jeu plus tard.
  - Les personnes à moins de 130 au moment de l'apparition, juge compris, ne peuvent pas les remarquer le jour même.
  - Elles restent jusqu'au lendemain.
- **La découverte :**
  - **Le juge** (à 80) : entrée « indice » avec le lieu et une fenêtre d'apparition d'environ 40 minutes, et la trace dessinée au sol.
  - **Un villageois** (à 55) :
    - il retient la trace, la fenêtre horaire et les gens qu'il avait vus par là à cette heure ;
    - selon sa personnalité (bavard 0,95 … paranoïaque 0,3), il la crie ou la garde ;
    - gardée, il ne la révèle qu'à quelqu'un en qui il a confiance (seuil 0,55 en scripté ; consigne dans la vue pour Claude) ;
    - partagée, elle circule dans les conversations.
  - **Le loup en stratégie « accuser »** fait mine de découvrir ses traces et désigne sa cible.
  - **Nouvelle question** dans le dialogue : « As-tu trouvé des traces ? ».
- **La peur** passe à un compte de points : corps découvert + 1, première découverte des traces d'une crise + 0,5, innocent éliminé + 0,5 ; la peur vaut 0 à 3. L'objectif du loup est corrigé (« deux innocents »).
- **Le débrief** montre chaque crise : heure, stratégie, cible, raison donnée par Claude, nombre de traces.
- **Vérifié :** 6 parties automatiques (3 scriptées, 3 avec un faux Claude), sans erreur. Stratégies variées, traces découvertes par le juge et par les villageois, partagées ou gardées, suspects déduits ; capture des traces au sol.

### v6 : crise courte (04/10)

Retour du joueur : les traces doivent apparaître pendant 2 ou 3 secondes réelles, pas 13.
- **Crise :** 9 minutes de jeu, soit environ 2,6 s réelles à vitesse ×1.
- **Préparation :** le loup se met en place pendant les 40 minutes de jeu qui précèdent (environ 12 s) :
  - il rejoint le lieu isolé ;
  - il se colle à sa cible ;
  - il attend près de la maison visée, puis fait les derniers pas jusqu'à la porte pendant la crise ;
  - il attend dans un lieu voisin du piège, puis y entre pendant la crise.
- **Traces :** une tous les 30 unités parcourues ou toutes les 2,5 minutes de jeu, soit 4 à 8 par crise.
- **Mesuré, par stratégie :**
  - s'éloigner : 4 traces, toutes dans le lieu isolé ;
  - accuser : 6 traces, la plus proche à 58 unités de la cible ;
  - fausse piste : 8 traces, finissant à 42 unités de la maison ;
  - piège : 8 traces menant au lieu.

### v7 : outils de développement (05/10)

Demande du joueur : un mode debug qui enregistre les décisions de chaque PNJ, et un export JSON de la partie à renvoyer dans la conversation pour analyser les comportements et équilibrer.
- **Bouton « Debug »** (en-tête), activable et désactivable à tout moment ; le choix est mémorisé dans le navigateur.
  - Chaque PNJ tient un journal de ses décisions : quand, type, état (lieu, destination, peur, confiance envers le juge, rencontres du jour, suit le juge, en scène, accusé, blessé ; pour le loup : état de chasse, phase de crise, essais, a tué), objectif, options considérées, choix, raison.
  - Plafond : 1 500 décisions par PNJ ; les plus anciennes sont alors perdues, et comptées.
  - Rien ne s'affiche à l'écran, hormis le compteur sur le bouton : le journal ne trahit pas le loup pendant la partie.
- **Décisions notées :**
  - déplacement : routine, hasard, peur, loup en quête de rencontres, cloche ;
  - conversation : avec qui, sujet, silence, fuite du méfiant ;
  - chasse du loup : empêchements, proies retenues ou écartées et pourquoi, filature, freins, attaque, abandon, issue de la lutte, fuite ;
  - crise : stratégie choisie par Claude ou tirée, mise en place, piège, fausse découverte ;
  - nuit : victime du loup ;
  - traces : partager ou garder ;
  - « suis-moi » : confiance et tirage ;
  - accusations des IA ;
  - avis des témoins et mains levées au conseil, avec le détail des scores ;
  - réponses : Claude ou script, question, texte, mensonge scripté du loup ;
  - réactions aux cris et aux corps.
- **Bouton « Exporter les données »** (en-tête et écran de fin) : un fichier JSON contenant
  - les réglages ;
  - la partie : issue, loup, peur, stats de chasse, victimes, éliminés, crises, traces, accusations, conseils avec mains levées et défenses ;
  - le compte des appels IA ;
  - pour chaque personnage : rôle, personnalité, rencontres, nuits, événements, paroles entendues, journal de décisions ;
  - le carnet complet du juge.
  - Il passe par la capacité `downloads` de l'artefact (le visiteur confirme), sinon par un téléchargement ordinaire.
  - Il contient les rôles : à ouvrir après la partie.

### v7.2 : retours sur la partie du 06/10 (piège, budget, déplacements, paroles tenues)

- **Le piège :**
  - Le loup se poste sur le chemin, à 190 du centre du lieu piégé.
  - Pendant la crise, il entre dans le lieu : la piste y mène, mesuré de 290 à 4 unités du centre.
  - À partir du jour 2, il guette ensuite une heure de jeu et attaque qui arrive seul. Il lève le guet s'il a attaqué, ou si personne n'est venu.
- **Le budget de Claude :**
  - Ce qui répond au juge garde ses 22 appels par jour.
  - Les conversations entre villageois et les témoins ont désormais 16 appels à part.
  - L'export compte les appels refusés faute de budget.
- **« Changer de lieu »** ne retombe plus sur le lieu actuel : on prend un autre lieu de la routine, sinon un lieu voisin, en évitant les lieux à l'écart si la peur est forte.
- **Les paroles tenues :**
  - Les répliques de Claude ont un champ « va » : quand un villageois annonce qu'il part quelque part, le moteur l'y envoie.
  - Il ne part pas s'il suit le juge, s'il est pris dans une scène, après la cloche, ou si c'est le loup en chasse ou en crise.
  - Le loup peut promettre sans y aller.
  - Le journal note chaque promesse, tenue ou non, y compris un « j'y vais » sans lieu, signalé comme une promesse en l'air.
- **Journal :** la question libre du juge est notée « libre » quand Claude répond, au lieu de la catégorie du script.

### v7.3 : l'aube du mouton, et des traces lisibles (06/10)

Demande du joueur : les empreintes visibles dès le lancement l'intriguaient. Il demande une piste du prologue moins révélatrice et des traces bien distinctes, des traces signalées qui s'affichent, et une ouverture où quelqu'un découvre la piste, pour que le joueur comprenne et que les villageois fassent le lien avec le mouton.

- **L'ouverture :**
  - Le premier villageois levé, parmi les innocents (bavard d'abord, puis émotif, meneur…), part de la bergerie. Il court jusqu'au feu et crie la nouvelle vers 7h15.
  - Tant que la nouvelle n'est pas arrivée, les autres restent au feu, et la vue des IA ne parle pas encore du mouton.
  - Ceux qui l'entendent retiennent le lien : mouton égorgé, piste vers la Grange, « un loup… ou l'un d'entre nous ».
  - Une flèche montre la piste au juge.
  - Chaque présent décide d'aller voir ou non, trois au plus. Les probabilités vont du sceptique (0,8) à l'émotif (0,25) ; le loup y va une fois sur deux.
  - Ceux qui passent sur la piste la voient et commentent à voix haute. Le loup minimise : « un gros chien ».
  - Le premier jour, la piste devient aussi un sujet de conversation.
- **La piste du prologue** ne garde que les abords de la bergerie, sur 270 : elle ne pointe plus vers le quartier du loup.
- **Lisibilité :**
  - Les pistes de nuit sont plus discrètes. Quand le juge passe dessus, une entrée « indice » au carnet dit ce que c'est.
  - Les traces de crise sont plus grandes et cerclées d'un pointillé couleur lanterne.
- **Traces signalées :** quand un villageois montre ses traces sous les yeux du juge, ou que le loup fait mine d'en découvrir, elles s'affichent sur la carte du juge, avec une flèche si elles sont loin.
