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
