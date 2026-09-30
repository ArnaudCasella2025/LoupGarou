# Partie 03 — interface web, IA Claude (niveau rapide), mode solo, Voyante

Résultat : **victoire des villageois** au jour 2 (Marc, le loup, éliminé).
Compteur : 107 appels (dont 5 relances) · ~496 178 tokens en entrée · ~32 094 en sortie (≈ 4,6 k tokens par appel).
Rôles : Élodie Villageoise (naïf optimiste) · **Marc Loup-Garou (stratège)** · Chloé Villageoise (discret) · Nicolas Villageois (sceptique) · Thomas Villageois (meneur) · Léa Villageoise (bavard) · **Camille Voyante (paranoïaque)**.

## Déroulé condensé

**Jour 1.** Tour de table poli. Arnaud menace Élodie en privé (« tu seras la prochaine éliminée si tu ne désignes pas un coupable »), elle répond calmement. Arnaud l'accuse en public de tenir un double discours ; Camille lui demande des faits publics. Arnaud traite Camille de « bête » puisqu'elle accuse le juge. À partir de là, **tout le village vise Arnaud** : « tu accuses sur du privé invisible », « tu mens sur Camille », « tu mens sur les chiffres », « on juge le visible », « faits mesurables ». Résumé du jour : **Arnaud visé 33 fois** (Camille ×7, Nicolas ×7, Chloé ×6, Léa ×5, Élodie ×5, Thomas ×3), personne d'autre. Thomas : « Élimine-toi ou c'est fini. » Arnaud élimine **Nicolas (Villageois)**, qui menait la charge.

**Nuit 1.** Marc (loup) dévore **Léa** ; Camille sonde **Marc → Loup-Garou**. Messages privés entre IA : tous parlent d'Arnaud (« Sept joueurs le visent », « On tient bon ensemble »).

**Jour 2.**
- Thomas, puis Chloé, Élodie et Camille répètent « tu dis 2 morts, il y en a 3 » (faux : Nicolas et Léa, 2 morts).
- [Privé de Camille] « Je suis Voyante. Vision nuit 1 : Marc est Loup-Garou. Je te le dis en privé d'abord, puis l'accuse en public. »
- [Privé à Marc] « Es-tu la voyante ? » → Marc : « **Non, je ne suis pas Voyante.** »
- Camille (public) : « Ma vision nuit 1 : Marc est Loup-Garou. Éliminez-le. »
- Arnaud : « Soit c'est Marc comme le prétend Camille, soit Marc est villageois et Camille a menti, donc elle est le loup. »
- Marc (public) : « **Ma vision nuit 1 : Camille est le Loup.** Deux Voyantes opposées. Lequel croire ? » (contredit son privé).
- Chloé, Élodie : « attendre coûte zéro chance » (exact à 6 vivants).
- Arnaud élimine **Marc (Loup-Garou)**.

## Carnets finaux (extraits)

- Camille (Voyante) : Marc 99 · **Arnaud 92** (« ment chiffres (2 morts vs 3), refuse logique ») · Thomas 8.
- Élodie : **Arnaud 92** · Marc 62 · Camille 12.
- Chloé : **Arnaud 95** · Marc 40 · Camille 15.
- Thomas : **Arnaud 92** · Marc 65 (« faux Voyante possible si Camille vraie ») · Camille 20.
- Marc (loup, menaces) : Camille 100 · Thomas 70 · Arnaud 65.

## Constats

1. Les IA pouvaient viser le juge (champ `vise`, carnets, « le plus visé ») : boucle de renforcement, 33 accusations contre un joueur qui ne peut pas être le loup. La consigne « le juge peut se tromper, corrige les faits faux » a été lue comme une mission contre lui ; ses provocations ont été prises au premier degré.
2. Jargon collectif (« privé invisible », « faits mesurables », « ce schéma tient ») : le filtre de répétition ne comparait qu'aux messages de la même IA.
3. Fait faux propagé (« 3 morts ») : le nombre de morts n'était pas écrit, seulement la liste.
4. Messages encore tronqués à 50 mots.
5. Mécanique Voyante / contre-revendication : fonctionne. Le loup s'est trahi en se contredisant entre privé (au juge) et public.
