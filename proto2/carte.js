// Carte du hameau (prototype 2). Données pures : aucun DOM, aucun état de partie.
// Coordonnées dans le repère du plan (viewBox 800 × 560). Voir design/gdd-proto2.md § 3.

export const LARGEUR = 800, HAUTEUR = 560;

// Lieux de jour. x, y : centre ; l, h : taille de la zone. trace : ce que le lieu laisse aux bottes.
export const LIEUX = {
  chapelle: { nom: "Chapelle", x: 150, y: 95,  l: 200, h: 120, trace: "cire",  role: "On y veille le mort ; seul endroit où examiner le corps." },
  taverne:  { nom: "Taverne",  x: 400, y: 95,  l: 200, h: 120, trace: "bière", role: "Bruyante : on y parle à plusieurs." },
  forge:    { nom: "Forge",    x: 650, y: 95,  l: 200, h: 120, trace: "suie",  role: "Vue sur la Place et les maisons Est." },
  grange:   { nom: "Grange",   x: 150, y: 280, l: 200, h: 120, trace: "paille", fermee: true, role: "Fermée : on voit qui entre, pas ce qui s'y dit." },
  place:    { nom: "Place",    x: 400, y: 280, l: 250, h: 160, trace: "boue",  publique: true, role: "Aube et conseil du soir : la parole y est publique." },
  moulin:   { nom: "Moulin",   x: 650, y: 280, l: 200, h: 120, trace: "farine", role: "Isolé ; se voit avec le Lavoir." },
  lavoir:   { nom: "Lavoir",   x: 400, y: 465, l: 200, h: 110, trace: "eau",   bruyant: true, role: "Le bruit de l'eau empêche d'écouter." },
};

// Chemins praticables (non orientés).
export const CHEMINS = [
  ["place", "chapelle"], ["place", "taverne"], ["place", "forge"], ["place", "grange"], ["place", "moulin"], ["place", "lavoir"],
  ["taverne", "forge"], ["forge", "moulin"], ["moulin", "lavoir"], ["lavoir", "grange"], ["grange", "chapelle"],
];

// Lignes de vue (orientées : « depuis » voit « vers » sans entendre). La Grange, fermée, n'est vue de nulle part.
export const VUES = [
  ["place", "taverne"], ["taverne", "place"],
  ["place", "chapelle"], ["chapelle", "place"],
  ["forge", "place"],
  ["moulin", "lavoir"], ["lavoir", "moulin"],
];

// Maisons : une par joueur, attribuées au début de partie. fenetre : le lieu vu la nuit depuis la maison.
export const MAISONS = [
  { id: "o1", quartier: "Ouest", x: 45,  y: 400, fenetre: "grange" },
  { id: "o2", quartier: "Ouest", x: 105, y: 455, fenetre: "grange" },
  { id: "o3", quartier: "Ouest", x: 165, y: 505, fenetre: "lavoir" },
  { id: "o4", quartier: "Ouest", x: 240, y: 520, fenetre: "lavoir" },
  { id: "e1", quartier: "Est",   x: 560, y: 520, fenetre: "lavoir" },
  { id: "e2", quartier: "Est",   x: 635, y: 505, fenetre: "moulin" },
  { id: "e3", quartier: "Est",   x: 695, y: 455, fenetre: "moulin" },
  { id: "e4", quartier: "Est",   x: 755, y: 400, fenetre: "forge" },
];

// Lisière : passage nocturne, pas un lieu de jour.
export const LISIERE = { nom: "Lisière", x: 22, y: 40, l: 34, h: 320 };

export const voisins = lieu => CHEMINS.filter(c => c.includes(lieu)).map(([a, b]) => (a === lieu ? b : a));
export const voitDepuis = lieu => VUES.filter(([a]) => a === lieu).map(([, b]) => b);
export const sontVoisins = (a, b) => CHEMINS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

// Plus court chemin (en nombre de moments) entre deux lieux.
export function trajet(de, vers) {
  if (de === vers) return [de];
  const prec = { [de]: null }, file = [de];
  while (file.length) {
    const l = file.shift();
    for (const v of voisins(l)) if (!(v in prec)) { prec[v] = l; if (v === vers) { const t = [v]; let p = l; while (p) { t.unshift(p); p = prec[p]; } return t; } file.push(v); }
  }
  return null;
}
