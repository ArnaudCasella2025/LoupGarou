# Loup-Garou en mode texte, joué dans Claude Code

Tu es l'unique humain (villageois) face à 7 IA, dont un Loup-Garou caché. Claude Code est le maître du jeu (voir `CLAUDE.md`).
Les IA sont des sous-agents `joueur` (Haiku, sans outil) ; leur contexte est reconstruit à chaque appel par `python engine.py vue <prénom>`.
`engine.py` (Python standard) détient l'état dans `secret/` (rôles tirés avec `secrets`, log JSONL append-only), interdit en lecture par `.claude/settings.json`.
Réglages dans `config.json` : `vote_mode` (solo|vote), `reveal_roles`, `human_can_die`, `voyante`, 3 paroles max par micro-tour, 40 mots par message.
Jouer : ouvrir Claude Code ici, dire « lance une partie », puis `/pub`, `/mp <prénom>`, `/attendre`, `/eliminer <prénom>`, `/carnet`, `/etat`.
Le jour, chaque micro-tour consulte toutes les IA en parallèle ; la nuit, toutes reçoivent la même consigne et seul le vrai loup compte.
Tu vois le public, tes privés et « X et Y se parlent à l'écart » ; les privés IA-IA ne sont révélés qu'à la fin (`python engine.py revele`).
Tests : `python -m pytest -q` ; simulation complète avec agents factices et contrôle de fuites : `python engine.py simuler --parties 5 --voyante`.
Interface web autonome (moteur porté en JS, IA via Claude ou factices) : `interface/loup-garou.html`. Prompts des IA : `prompts/`.
Limite connue : l'orchestrateur transmet les vues (qui contiennent le rôle de chaque IA) ; son silence repose sur `CLAUDE.md`.
