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
| 2 | 02/10 | rapides, **sans Voyante** | Défaite | 3 | 3/3 | 72 (7 = 9,7 %) | ~292 k | Faibles : Sophie jamais visée, suiveuse (vise après Marc puis après Thomas), contradiction privée avec Hugo sur qui a contacté qui | 2-3 | ? |

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
