# Le Hameau vivant — ressenti et mise en scène des nouveaux gestes

Ce qui plaît : **marcher et parler**. Tout ce qui suit le renforce sans l'interrompre. Règle d'or : un événement fort se *montre* dans le village (canvas, bulles, attroupement) avant de s'*écrire* dans le carnet ; aucun modal sauf la sentence. Le temps ralentit (×0,15, comme `G.lent`) au lieu de s'arrêter.

## 1. Les cinq moments forts

Outils communs, tous en canvas simple : `pulse` (cercle qui s'élargit et s'efface), `vignette` (bord d'écran teinté, 1,5 s), `zoom` (cam.z ×1,12 puis retour, 700 ms, désactivé si `prefers-reduced-motion`), `flèche de bord` (chevron au bord du canvas pointant vers un événement hors champ). Sons : WebAudio synthétisé (pas de fichiers), bouton « Son » dans l'en-tête, **coupé par défaut**, activé seulement après un clic du joueur.

**Découverte d'un corps (jour, après une agression à l'écart).**
- Écran : quand le juge entre à 120 u du corps, le corps apparaît (bonhomme couché, couleur désaturée à 40 %, flaque sombre), vignette rouge sang (`--blood`), zoom bref. Toast : « Tu découvres Léa, au Lavoir. » Les traces autour deviennent cliquables (halo pulsant).
- Si un villageois le découvre avant toi : bulle « Au secours ! », il court vers la Place et entraîne ceux qu'il croise.
- Durée : 2 s, puis ralenti tant que tu restes à moins de 120 u du corps. Contrôle total, la caméra reste sur toi.

**Cri au loin (agression hors de vue).**
- Le cri porte à 600 u (au-delà de la vue, 430). Flèche de bord rouge pendant 6 s vers la source, texte court près de la flèche : « un cri, vers le Moulin ». Son : cri court, étouffé selon la distance. Les villageois à portée tournent la tête (petit trait de regard) et 1 ou 2 se mettent à courir vers le lieu.
- Carnet : « 14:20 — un cri vers le Moulin. Tu étais à la Forge. » (ton alibi, noté d'office).
- Contrôle : tu choisis d'y aller ou non. Le temps n'est pas ralenti : courir vers le cri est le jeu.

**Accusation publique (le cœur de la scène).**
- Déclenchement : le juge accuse X (voir § 2). Tous les villageois dans les 430 u convergent en 3 s vers un cercle de 90 u autour de X ; ceux plus loin l'apprennent par rumeur (§ 4). Le temps ralentit à ×0,3.
- Écran : X au centre avec un anneau rouge ; le juge en face, anneau ambre ; les autres en arc. Bulles qui fusent, décalées de 0,6 à 1 s : d'abord 2 à 3 réactions **scriptées** courtes (« Quoi ? Hugo ? », « Je l'ai vu au Moulin ce matin ! », « Prouve-le. »), puis la **défense de X par Claude** (40 mots, bulle plus large, bord rouge), puis 1 soutien ou 1 renfort par Claude si le budget le permet. Signes au-dessus des têtes : ▲ rouge (soutient) / ▼ vert (défend X), recopiés dans le carnet.
- Durée : 20 à 30 s réelles.
- Contrôle : pendant la scène, un panneau d'action réduit s'ouvre en bas : « Demander une preuve à… », « Retirer l'accusation », « Convoquer au conseil » (marque X pour le soir). Une phrase tapée est entendue de tout l'attroupement (`ecouterAutour` sans destinataire).

**Élimination (sentence et révélation).**
- Seul moment modal, et volontairement solennel. Caméra centrée sur la Place, tous en cercle autour du feu (déjà le cas au conseil). Le juge confirme par **appui long 1,2 s** sur « Éliminer X » (une jauge se remplit ; relâcher annule). Puis : le feu monte (feu × 1,6), silence 1,5 s, X fait trois pas vers la lisière et s'efface, une carte se retourne au-dessus de sa stèle : fond rouge « Loup-Garou » ou fond paille « Villageois · émotif ». Son : un seul coup de cloche grave.
- Si innocent : un pip s'éteint avec une secousse, chaque villageois réagit d'un mot scripté (« Non… »), les accusateurs de X perdent du crédit (§ 3).
- Durée : 8 s au total, puis bouton « Passer la nuit ».

**Flagrant délit (le juge voit l'agression).**
- Si le juge a la victime ET le loup dans son champ (430 u) au moment de l'attaque : la silhouette du loup s'assombrit en ombre pendant 0,8 s, bond vers la victime, la victime tombe. Ralenti ×0,15 pendant 2 s, zoom, vignette. Pas d'étiquette de prénom sur l'ombre si la distance > 165 u (on voit une forme, pas un visage) : seule la **couleur du vêtement** reste lisible. C'est l'indice.
- Carnet, entrée épinglée en rouge : « Tu as vu une silhouette en vêtement bleu frapper Camille près de la Grange, 15:40. »
- Contrôle : rien ne t'est imposé. Le flagrant délit doit rester **rare** (le loup frappe hors de vue s'il le peut) : 1 partie sur 4, sinon tout se résout trop vite.

## 2. Interface des nouveaux gestes

**Barre d'action contextuelle** en bas du canvas, sous forme de 3 boutons de 44 px minimum, apparaissant quand un villageois est sélectionné (clic ou toucher) : **Parler** · **Accuser** · **Fiche**. Le clic sur un villageois sélectionne d'abord (anneau ambre) ; un second clic ou « Parler » ouvre le dialogue actuel. Raccourcis clavier : `E` parler, `A` accuser, `F` fiche, `Échap` désélectionner.

**Accuser.**
- Bouton rouge dans la barre et dans le dialogue (« Accuser Hugo devant tous »). Portée : la cible doit être à moins de 165 u (on accuse en face, pas de loin).
- Confirmation légère, pas de modal : le bouton se transforme en « Sur quoi ? » avec 3 motifs pré-remplis tirés du carnet (contradiction relevée, indice relié, « je le sens ») + champ libre d'une ligne. Valider = accusation. Le motif est ce que les IA entendront.
- Limite affichée : 1 accusation publique par jour ; elle coûte, donc elle pèse.

**Éliminer.** Uniquement au conseil (sauf règle contraire des collègues). La liste du conseil met en tête les « convoqués » de la journée, avec le nombre de ▲/▼ reçus. Appui long, voir § 1.

**Désigner un indice.**
- Traces au sol (empreintes existantes, sang, touffe de poils, objet tombé) : halo léger quand le juge est à moins de 80 u. Toucher → fiche courte : « Empreintes de farine, fraîches, vont vers le quartier Est. » Bouton **Noter** (copie dans le carnet) et, pour un objet, **Ramasser** (va dans une besace de 3 places en haut du carnet).
- Montrer un objet : dans le dialogue, un bouton « Montrer… » liste la besace. L'IA reçoit « Le juge te montre : un bouton de veste bleu trouvé près du corps de Camille. » Meilleure réaction pour un seul appel.
- Relier : dans le carnet, glisser un indice sur une fiche de villageois (au téléphone : « Relier à… » puis choix). Sans effet mécanique : c'est la pensée du joueur, rendue visible, qui pré-remplit les motifs d'accusation.

**Carnet enrichi.** Trois onglets en tête, la dernière entrée importante épinglée au-dessus :
- **Fil** : l'actuel, avec nouveaux tags `cri`, `corps`, `indice`, `rumeur`, `accusation`. Filtre par jour.
- **Indices** : besace + indices notés, chacun avec lieu, heure, liens.
- **Gens** : une carte par villageois (pastille couleur, personnalité) avec : alibis déclarés (« dit avoir été au Lavoir à 14 h »), alibis contredits en rouge, qui il accuse / qui l'accuse (petites flèches nominatives), dernière fois vu par toi. C'est ici que le joueur raisonne.

**Au téléphone (390 × 844).** Le carnet devient un tiroir bas (poignée, 3 hauteurs : fermé avec la dernière entrée sur une ligne, mi-hauteur, plein). La barre d'action flotte au-dessus du tiroir, pouce droit. Pas de glisser-déposer : « Relier à… » par liste. Au-delà de 3 bulles qui se chevauchent, bandeau (comme en J0).

## 3. Réactions des IA

**Le moteur (gratuit, toujours)** : états chiffrés par villageois, mis à jour par règle.
- `peur` (0–3) : monte avec un corps découvert, un cri entendu, une nuit à proximité. Effets visibles : peur ≥ 2 → marche plus vite, évite les lieux isolés (Grange, Lavoir), se regroupe ; peur 3 → rentre chez lui plus tôt.
- `méfiance[x]` par cible : monte quand on voit x près d'un corps, quand x est accusé avec un motif solide, quand x a menti au juge devant soi. Le paranoïaque double, le naïf divise par deux.
- `crédit du juge` : baisse après chaque innocent éliminé et chaque accusation retirée. Bas crédit → réponses plus sèches, moins de témoins qui viennent spontanément.
- Alliances : deux villageois qui se défendent mutuellement deviennent « proches » et marchent ensemble.
- Bulles réflexes scriptées : cris, « Au secours », réactions d'attroupement, réactions de sentence, fuites.

**Claude (rare, réservé à ce qui se lit)** : défense de l'accusé, réponse à un objet montré, réponses aux questions du juge, une prise de parole au conseil, conversations à portée d'oreille. Les états moteur entrent dans la vue en une ligne : « Tu as peur (2/3). Tu te méfies surtout de Hugo. » Claude colore, le moteur décide.

**Injection en mémoire.** Ajouter `c.evenements` à côté de `vu` et `entendu`, rendu dans `vueIA` sous une rubrique « CE QUI T'EST ARRIVÉ », 6 lignes maximum, une ligne par événement, 2ᵉ personne, datée, sans interprétation :
```
- Aujourd'hui vers 14 h, tu as entendu un cri du côté du Moulin. Tu étais à la Forge.
- Aujourd'hui vers 14 h 30, tu as vu le corps de Camille au Lavoir.
- Aujourd'hui vers 16 h, sur la Place, le juge a accusé Hugo : « il ment sur sa matinée ». Léa l'a soutenu, Marc l'a défendu.
- Hier soir, le juge a éliminé Sophie. Elle était Villageoise.
- On t'a raconté (Marc) que Hugo rôdait près de la Grange. Tu ne l'as pas vu toi-même.
```
Les rumeurs sont marquées « on t'a raconté », pour que les IA ne les traitent pas comme des faits.

**Budget (≤ 60 par partie de 3 à 4 jours).** Plafond par jour : **16 appels**, dans cet ordre de priorité :
1. Questions directes du juge et objet montré : jusqu'à 7.
2. Défense de l'accusé : 1 (+ 1 soutien/renfort si reste > 4).
3. Conseil : 4 prises de parole Claude (les 2 plus méfiants, l'accusé du jour, le loup s'il n'est pas déjà dedans) ; les autres en script.
4. Conversations entendues : le reste, 0 quand le compteur du jour dépasse 12.
Au-delà, repli scripté silencieux ; 2 appels restent en réserve pour une défense imprévue.

## 4. Lisibilité : ce qui s'est passé sans toi

Principe : **on n'apprend jamais un fait, on apprend qu'un villageois le dit.**
- **Rumeurs** : quand deux villageois se croisent hors de portée, le moteur transmet un événement (« X a vu Y près de la Grange ») avec 70 % de fidélité ; le bavard transmet tout, le discret rien. Quand le juge passe à portée, la bulle porte la rumeur ; dans le carnet, tag `rumeur`, gris, avec la source.
- **Témoin spontané** : après un corps, un seul villageois (le plus effrayé ayant vu quelque chose) vient te parler. Le reste se cherche.
- **Résumé du soir** : au début du conseil, 4 lignes maximum, factuelles et partielles : « Aujourd'hui : un cri au Moulin vers 14 h. Camille retrouvée au Lavoir par Nicolas. Hugo accusé par toi, défendu par Marc. » Jamais qui était où à l'heure du crime : ça, il faut l'avoir demandé.

## 5. Trois pièges à ne pas faire

1. **Arrêter le monde.** Une cinématique, un modal ou une caméra qui part sans toi à chaque événement tue ce qui marche (bouger, parler). Ralentir oui, prendre la main non ; seule la sentence est modale.
2. **Tout écrire dans le carnet.** Si le cri, le corps, le coupable probable et les alibis arrivent tout prêts dans le journal, le joueur cesse de marcher. Le carnet consigne ce que *tu* as vu, entendu, ramassé ; le reste se gagne en allant parler.
3. **Laisser Claude piloter les réactions.** Brûler des appels sur les cris, la peur et l'attroupement épuise le budget avant le conseil et rend les réactions lentes (bulles « … » de 5 s au moment le plus tendu). Réflexes et états : le moteur ; mots qui comptent (défense, témoignage, objet montré) : Claude.
