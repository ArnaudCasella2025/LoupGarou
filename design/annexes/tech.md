# Section technique — prototype 2 (spatialisation 2D)

Auteur : tech design / lead dev. Base de travail : `interface/loup-garou.html` (publication 12, série 4) et `analyses/serie-proto1.md`.

## 1. Architecture

**Décision : on abandonne `engine.py`, on découpe la page en modules ES servis par un seul artefact multi-fichiers, sans build.**

- `engine.py`, `prompts/`, `CLAUDE.md` : gelés sous l'étiquette `proto1-chat`. La page JS les a dépassés (carnets, angles d'enquête, vue à la deuxième personne) ; spatialiser les deux doublerait le coût.
- **Source de vérité unique : `moteur.js`**, pur (ni DOM, ni `window.claude`, ni horloge système), exécutable tel quel sous Node 22 pour les tests et la simulation. Toute mutation passe par `appliquer(S, action)` ; `S` reste un objet JSON sérialisable.
- Découpage (dossier `proto2/`) :

| Fichier | Rôle | Lit |
|---|---|---|
| `carte.js` | lieux, graphe, maisons, constantes | — |
| `moteur.js` | état, horloge, routines, déplacements, résolutions jour/nuit/vote, traces | `carte.js` |
| `perception.js` | `projection(S, observateur)` : seule porte de sortie de l'état | `S` |
| `ia.js` | `vue()`, consignes, validation, `appeler`/`consulter`, agents factices | projections uniquement |
| `plan.js`, `ui.js` | rendu SVG du plan, chronique, carnet d'enquête | projection humaine uniquement |
| `index.html` | styles, montage, sauvegarde | — |

- Le hasard devient **graine + PRNG** (mulberry32, état dans `S.rng`) au lieu de `crypto.getRandomValues` : parties rejouables, simulations reproductibles, bugs reproductibles depuis une sauvegarde.
- Risque à lever en J0 : chargement de `<script type="module">` relatifs dans le bac à sable de l'artefact. Repli : un script Node de 30 lignes qui concatène les modules dans une page unique (pas d'outil de build tiers).

## 2. Rendu 2D

**Décision : SVG écrit à la main, sans bibliothèque.**

| Critère (8 jetons, 5-8 lieux) | SVG | Canvas 2D | PixiJS | Phaser / Kaboom |
|---|---|---|---|---|
| Volume d'animation | largement suffisant | suffisant | surdimensionné | surdimensionné |
| Thème clair/sombre | variables CSS existantes (`--c0`…`--c6`, `--candle`) directement | relire `getComputedStyle` à chaque thème | idem + textures | idem |
| Téléphone | `viewBox` + `preserveAspectRatio`, net à tout zoom | gestion du `devicePixelRatio` | idem | idem |
| Clic / focus / lecteur d'écran | natifs (`<g role="button" tabindex>`, `aria-label`) | test de collision et accessibilité à refaire | idem | idem |
| Poids | 0 Ko | 0 Ko | ~450 Ko | ~1 Mo, boucle de jeu imposée |
| Tests Playwright | sélecteurs DOM | captures seulement | captures | captures |

Le jeu est au tour par tour : une boucle `requestAnimationFrame` ou un moteur de scène n'apporte rien et contrarie notre boucle asynchrone. Les portraits deviennent des `<polygon>` partagés via `<symbol>` (forme + couleur + initiale). Transitions CSS sur `transform`, coupées sous `prefers-reduced-motion`. Nuit : masque sombre, halo sur la maison du joueur. Téléphone : plan en haut (`viewBox` 800×560, ~45 % de la hauteur), chronique dessous, carnet en onglet.

## 3. Modèle de données (`S.version = 3`)

Positions **discrètes** : un personnage est dans un lieu ou sur une arête du graphe. Les coordonnées fines (emplacement autour du centre du lieu) sont calculées au rendu et ne sont jamais stockées.

```js
S = { version: 3, carte: "hameau-1", rng: 123456789,
  // proto 1 conservé : cfg, joueurs, roles, vivants, morts, votes, revendications, visions,
  // carnets, reflexions, attentes, notes, coulisses, compteur
  horloge: { jour: 2, phase: "jour", pas: 5, pasParJour: 8 },   // phase : jour | assemblee | vote | nuit | fin
  pos:     { Marc: { lieu: "forge" }, Léa: { de: "puits", vers: "lavoir", reste: 1 } },
  trajets: { Marc: { but: "taverne", chemin: ["puits", "taverne"], source: "routine" } },  // routine | ia | humain
  vu:      { Arnaud: { Léa: { lieu: "lavoir", jour: 2, pas: 3 } } },   // dernier aperçu, par observateur
  traces:  [{ id: 1, nuit: 1, lieu: "moulin", indice: "boue fraîche vers le bois", auteur: "Hugo", decouvertePar: ["Léa"] }],
  histo:   ["0 3 3 1 5 2 2 4", "…"],   // une ligne par pas : index de lieu de chaque joueur (vérité, débrief seulement)
  log: [ /* entrées typées, voir plus bas */ ] }
```

**Visibilité figée à l'émission.** Le proto 1 recalcule la visibilité à la lecture (`visible(m, p)`, `estAparte`). Avec des positions qui changent, c'est faux : on fige les témoins au moment de l'événement. Chaque entrée du log porte `lieu` et `temoins` (liste de prénoms) :

```js
{ id, jour, pas, type: "parole" | "aparte" | "passage" | "trace" | "annonce", de, a, lieu, temoins: [...], texte, vise, ... }
const percoit = (e, p) => e.temoins.includes(p);   // remplace visible() et estAparte()
```

Règles de perception (dans `perception.js`, une seule fonction `temoinsDe(S, evenement)`) :
- même lieu : présence, paroles « à voix haute » du lieu, apartés (que deux personnes se parlent, pas le contenu) ;
- lieu voisin marqué `vue: true` dans la carte (place ↔ puits) : présence seulement ;
- arrivée et départ : `passage` vu par les présents du lieu quitté et du lieu d'arrivée ;
- privé (`a` = un prénom) : destinataire seul ; l'aparté est un événement distinct dont les témoins sont les co-présents ;
- annonces du meneur : tous.

« Public » ne veut plus dire « tout le village » mais « le lieu ». L'**assemblée** de fin de journée (déplacement forcé de tous sur la place, puis 2 à 3 micro-tours du proto 1, puis élimination ou vote) redonne une parole vraiment publique et réutilise `resoudreJour`/`choisirParole` tels quels.

**Journalisation** : seulement les événements perçus (avec témoins), plus une ligne par pas dans `histo` (~20 octets) pour le débrief ; moins de 2 Ko par partie.

**Sauvegarde et migration.** Les parties v2 n'ont pas de positions ; les convertir n'aurait pas de sens. Décision : nouvelle clé locale `veillee-loup-garou:v3` et nouveau document `data/users/{uid}/sauvegarde-v3`, l'artefact du proto 1 continue de lire les siennes. `decoder()` devient une chaîne `MIGRATIONS = { 3: m => m }` prête pour v4 ; une sauvegarde v2 est refusée proprement. On sauve à la fin de chaque pas, jamais pendant des appels en vol ; au rechargement, le pas interrompu est rejoué (résolution idempotente, voir §4).

## 4. Boucle de simulation

**Décision : horloge pilotée par l'humain, pas de temps réel.** Le temps n'avance que quand le joueur agit (se déplacer, parler, « Laisser passer le temps »). La pause est donc triviale et la latence n'est jamais une pénalité de jeu.

Un pas = `avancer()` (même verrou `occupe` que `tour()` aujourd'hui) :
1. **Intentions** (synchrone, instantané) : routines par personnalité → prochain lieu de chaque IA. Paramètres dans `PERSOS` (poids par lieu et moment du jour, sociabilité, suivre/éviter quelqu'un dans le carnet). Le loup a une routine de villageois plus un biais « rester près de sa cible ».
2. **Mouvement** : application des trajets, émission des `passage` avec témoins, mise à jour de `vu`, découverte des traces.
3. **Points de décision** : on consulte seulement les IA présentes dans un lieu avec au moins une autre personne, interpellées par le joueur, ou qui ont reçu un privé. Une IA seule suit sa routine sans appel. Plafond `cfg.consultes` (5) comme aujourd'hui.
4. **Appels** : pool de 3 en parallèle (code `consulter` actuel), délai maximal 25 s puis réponse par défaut, une seule relance.
5. **Résolution** par lieu : `choisirParole` lieu par lieu, champ facultatif `"aller": "<lieu>"` qui remplace la routine de l'IA au pas suivant (le modèle garde quelques choix).

**Masquer la latence** : l'étape 2 est connue avant les appels ; le plan anime les déplacements (~1,5 s) pendant que les appels partent avec des vues calculées après mouvement. Les bulles « … » ne s'affichent que sur les personnages que le joueur perçoit. Pas de pré-appel spéculatif le jour (l'action du joueur invaliderait les vues) ; la nuit, les 7 appels partent tous à la tombée de la nuit.

**Robustesse** : chaque appel porte un numéro de génération ; une réponse arrivée après un rechargement est ignorée. Pause possible pendant les appels : l'affichage est figé, les réponses sont mises de côté et appliquées à la reprise si la génération correspond.

## 5. Anti-fuite

**Modèle de menace** : l'état vit dans le navigateur, les outils de développement peuvent tout lire et on l'accepte. On garantit qu'**aucune information non perçue n'atteint l'écran, le DOM, l'accessibilité, les animations ni le prompt d'une IA non témoin**.

- **Une seule porte** : `projection(S, observateur)` renvoie `{ moi, presents, fantomes, log, traces, annonces, enjeu }`. `ui.js` et `plan.js` ne reçoivent que `projection(S, humain)` ; `ia.js` construit `vue(nom)` uniquement depuis `projection(S, nom)` plus la fiche de rôle. `S` n'est plus une variable globale lisible par le rendu.
- **Plan** : on ne dessine que les présents ; un personnage hors de vue n'est **pas** dans le DOM (pas de `display:none`). Les « fantômes » (« Léa, vue au lavoir il y a 2 pas ») viennent de `vu`, pas de la vérité. Un départ s'anime jusqu'au bord du lieu, jamais jusqu'à la destination.
- **Canaux annexes** à corriger par rapport au proto 1 : le statut « Les IA réfléchissent… 3/5 » révèle combien d'IA sont en conversation ailleurs → n'afficher que les IA perçues ; « Voulaient aussi parler » → seulement dans le lieu du joueur ; la durée de la nuit ne doit pas dépendre du trajet du loup (7 appels identiques, consigne de nuit commune comme aujourd'hui, durée minimale fixe).
- **La nuit** : villageois chez eux ; ils perçoivent au plus un `bruit` (« des pas devant chez toi ») sans identité si le trajet du loup longe leur maison. Le loup voit son trajet et ses traces. L'auteur d'une trace n'est jamais projeté avant `fin`.
- **Règles des IA** : la phrase « Aucun fait n'existe hors du journal : pas d'alibi, pas d'indice matériel » et « N'invente aucun fait matériel (alibi, lieu) » de `SYSTEME` deviennent fausses ; elles sont remplacées par « Tes seuls faits de lieu sont ceux de ton journal ; un alibi que personne n'a vu n'est pas vérifiable ».

## 6. Jalons

| Jalon | Contenu | Sortie | Estimation |
|---|---|---|---|
| **J0 maquette statique** | carte de 6 lieux + maisons, SVG, thèmes, 375 px, jetons placés depuis un JSON fixe ; validation du chargement des modules dans l'artefact | captures Playwright clair/sombre/téléphone, pas de défilement horizontal | 3 j |
| **J1 déplacements scriptés, sans IA** | `moteur.js` v3, routines, perception, témoins, traces, assemblée, projection, sauvegarde v3, déplacement du joueur au toucher, agents factices | partie complète jouable au téléphone en factices ; 1 000 parties simulées sans fuite ni blocage | 8 j |
| **J2 IA branchées** | `vue()` spatiale (« Ce matin à la forge, tu as vu Léa partir vers le moulin »), consignes, champ `aller`, points de décision, latence masquée, compteurs | 3 parties internes, relances < 10 %, budget tenu | 7 j |
| **J3 série de validation** | 5 parties, critères du proto 1 + critères spatiaux (le GDD les fixe), corrections ciblées | tableau de série dans `analyses/` | 2-3 j de dev, ~1 semaine calendaire |

Total : environ 4 semaines pour une personne avec Claude Code.

**Réutilisation du proto 1**
- **Tel quel** : outils (`norm`, `resoudre`, `nettoyer`, `extraireJSON`, `tropProche`, filtres de jargon), `PERSOS` (+ paramètres de routine), `lireParole`/`valider` (+ champ `aller`), `appeler`/`consulter`, `choisirParole`, éliminations, vote et fin, `chancesDepuis`, sauvegarde (clés changées), styles et portraits, carnet d'enquête, débrief (+ trajet du loup rejoué depuis `histo`).
- **Réécrit** : `visible`/`estAparte`/`elementsVisibles` (→ témoins), `vue`/`journalVue`/`ligneVue`/`quand` (repères de lieu et de pas), `resoudreNuit` (trajet + traces), `tour` (→ `avancer`), `aConsulter` (points de décision), `rendreScene`.
- **Abandonné** : `engine.py`, `prompts/`, l'orchestration par sous-agents.

## 7. Stratégie de test

1. **Moteur sous Node** (`node --test proto2/tests`) : chemins, perception, témoins, traces, assemblée, fin de partie, migration v3. Pas de dépendance npm.
2. **Simulation sans IA** : `node proto2/outils/simuler.js --parties 1000 --graine 1 [--voyante]`, agents factices nourris de leur seule projection. Invariants : fin en ≤ 7 jours, personne bloqué sur une arête, sauvegarde < 200 Ko.
3. **Contrôle de fuites, deux méthodes** :
   - **Canaris** : on glisse des chaînes uniques dans l'information cachée (texte des privés IA-IA, auteur des traces, lieu du loup la nuit) et on vérifie qu'elles n'apparaissent dans aucune projection humaine, aucun prompt d'un non-témoin, aucun DOM.
   - **Non-interférence** : deux états qui ne diffèrent que par de l'information cachée (loup échangé avec un autre villageois, position d'un personnage non perçu déplacée) doivent produire une projection humaine **identique à l'octet** et le même DOM. C'est le test qui attrape les fuites qu'on n'a pas imaginées.
4. **Playwright (Chromium)** avec un faux `window.claude` (latence 2-8 s, `rate_limited`, `db`/`user` en mémoire) : partie complète à 375×740 et 1440×900, clair et sombre ; canaris absents du `innerHTML` et des `aria-label` à chaque pas ; pause pendant des appels en vol ; rechargement en plein pas ; aucune réponse périmée appliquée.
5. **Budget tokens mesuré avant de dépenser** : la simulation calcule `tokens(vue())` pour chaque appel qui aurait lieu, sans appeler Claude. Cibles pour une partie « IA rapides » : ≤ 80 appels, ≤ 300 k tokens d'entrée (le proto 1 variait de 128 k à 560 k), vue ≤ 3 k tokens, relances < 10 %. Le compteur du débrief ventile par phase (pas, assemblée, nuit) et par cause de relance ; ces chiffres entrent dans le tableau de série. J3 inclut enfin la partie « IA plus fines » jamais faite au proto 1.
