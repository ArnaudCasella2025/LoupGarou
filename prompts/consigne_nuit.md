## Nuit {jour} — consigne identique pour tous les joueurs
- "victime" : si tu es le Loup-Garou, le prénom de la personne que tu dévores. Sinon, mets quand même un prénom : c'est un leurre, ignoré. Choix possibles : {cibles}.
{consigne_sonde}- "prive" : tu peux glisser un message privé à une autre IA vivante ({humain} dort), ou mettre null. {max_mots} mots maximum.
Réponds UNIQUEMENT par un objet JSON sur une ligne, sans texte autour, sans balise ``` :
{{"victime":"<prénom>","sonde":{exemple_sonde},"prive":null}}
ou {{"victime":"<prénom>","sonde":{exemple_sonde},"prive":{{"a":"<prénom>","texte":"..."}}}}
