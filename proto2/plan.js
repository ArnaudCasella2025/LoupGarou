// Rendu du plan (prototype 2) : SVG écrit à la main + calque HTML pour les bulles.
// Ne reçoit qu'une projection (ce que le juge perçoit), jamais l'état complet de la partie.
import { LARGEUR, HAUTEUR, LIEUX, CHEMINS, VUES, MAISONS, LISIERE, voitDepuis } from "./carte.js";

const NS = "http://www.w3.org/2000/svg";
const s = (tag, attrs = {}, parent) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) e.setAttribute(k, v);
  if (parent) parent.append(e);
  return e;
};

// Pictogrammes 24 × 24, au trait.
const PICTOS = {
  chapelle: "M12 2v6M9 4.5h6M5 22V13l7-5 7 5v9zM10 22v-4h4v4",
  taverne: "M5 7h10v13H5zM15 10h3.5v6H15M5 10h10",
  forge: "M3 8h15c0 3-2 4-5 4v4h3v3H6v-3h3v-4C6 12 3 11 3 8z",
  grange: "M3 21V10l9-6 9 6v11zM9 21v-6h6v6M9 15l6 6M15 15l-6 6",
  place: "M12 3c3 4 5 6 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9zM4 21h16",
  moulin: "M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3 6.3 17.7M12 4a8 8 0 1 0 0.01 0",
  lavoir: "M3 9c3-2 6 2 9 0s6-2 9 0M3 15c3-2 6 2 9 0s6-2 9 0M3 21c3-2 6 2 9 0s6-2 9 0",
};

// Formes des jetons, mêmes que les portraits du proto 1 (forme + couleur + initiale).
function forme(slot, r, g) {
  const pts = (arr) => arr.map(([x, y]) => `${(x * r).toFixed(1)},${(y * r).toFixed(1)}`).join(" ");
  switch (slot) {
    case 0: return s("circle", { r }, g);
    case 1: return s("rect", { x: -r * .9, y: -r * .9, width: r * 1.8, height: r * 1.8, rx: r * .22 }, g);
    case 2: return s("polygon", { points: pts([[0, -1.1], [1.1, 0], [0, 1.1], [-1.1, 0]]) }, g);
    case 3: return s("polygon", { points: pts([[-.5, -.94], [.5, -.94], [1, 0], [.5, .94], [-.5, .94], [-1, 0]]) }, g);
    case 4: return s("polygon", { points: pts([[-.4, -1], [.4, -1], [1, -.4], [1, .4], [.4, 1], [-.4, 1], [-1, .4], [-1, -.4]]) }, g);
    case 5: return s("polygon", { points: pts([[-1, -1], [1, -1], [1, .25], [0, 1.1], [-1, .25]]) }, g);
    case 6: return s("polygon", { points: pts([[0, -1.1], [1.05, -.3], [.65, 1], [-.65, 1], [-1.05, -.3]]) }, g);
    default: return s("rect", { x: -r * .85, y: -r * .85, width: r * 1.7, height: r * 1.7, rx: r * .2 }, g);
  }
}

// Places des jetons dans un lieu : rangées centrées sous le nom du lieu. Au-delà de la capacité, une pastille « +n ».
function places(lieu, n, t) {
  const L = LIEUX[lieu], parRang = Math.max(1, Math.floor((L.l - 16) / t.pas));
  const haut = L.y - L.h / 2 + t.entete, dispo = L.h - t.entete - 6;
  const rangs = Math.max(1, Math.floor(dispo / t.rang)), capacite = parRang * rangs;
  const visibles = n > capacite ? capacite - 1 : n, nRangs = Math.ceil((visibles + (n > capacite ? 1 : 0)) / parRang);
  const y0 = haut + (dispo - nRangs * t.rang) / 2 + t.r + 2;
  const out = [], total = visibles + (n > capacite ? 1 : 0);
  for (let i = 0; i < total; i++) {
    const rang = Math.floor(i / parRang), dansRang = Math.min(parRang, total - rang * parRang), col = i % parRang;
    out.push([L.x + (col - (dansRang - 1) / 2) * t.pas, y0 + rang * t.rang]);
  }
  return { pos: out, visibles, reste: n - visibles };
}

const maison = id => MAISONS.find(m => m.id === id);

/** Dessine le plan. `vue` = projection pour le juge ; `opts` = { largeurPx, onLieu, onJeton, onTrace, toutesVues } */
export function dessinerPlan(svg, calque, vue, joueurs, opts = {}) {
  // tailles en unités du plan, calculées pour une taille réelle lisible (jeton ≥ 24 px, nom de lieu ≥ 11 px)
  const px = Math.max(300, opts.largeurPx || 800) / LARGEUR, compact = px < .75;
  const r = Math.max(19, 12 / px), fLieu = Math.max(17, 11.5 / px), fTexte = 11, k = fLieu / 17;
  const t = { r, pas: compact ? r * 2.35 : Math.max(r * 2.9, 58), rang: compact ? r * 2.3 : r * 2 + 17, entete: fLieu + 24 };
  svg.replaceChildren(); calque.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${LARGEUR} ${HAUTEUR}`);
  const ici = vue.lieuJuge, enVue = new Set(ici ? voitDepuis(ici) : []);
  const slotDe = nom => joueurs.find(j => j.nom === nom);

  // défs : hachures du brouillard
  const defs = s("defs", {}, svg);
  const motif = s("pattern", { id: "brume", width: 10, height: 10, patternUnits: "userSpaceOnUse", patternTransform: "rotate(35)" }, defs);
  s("line", { x1: 0, y1: 0, x2: 0, y2: 10, class: "brume-trait" }, motif);

  // lisière
  const lis = s("g", { class: "lisiere" }, svg);
  s("rect", { x: LISIERE.x - 12, y: LISIERE.y, width: LISIERE.l, height: LISIERE.h, rx: 12 }, lis);
  for (const y of [LISIERE.y + 26, LISIERE.y + 70, LISIERE.y + LISIERE.h - 60, LISIERE.y + LISIERE.h - 16]) s("path", { d: `M${LISIERE.x} ${y - 16}l-9 18h18z`, class: "arbre" }, lis);
  s("text", { x: 0, y: 0, transform: `translate(${LISIERE.x + 3} ${LISIERE.y + LISIERE.h / 2}) rotate(-90)`, class: "etiquette-lisiere", "font-size": 12 * k, "text-anchor": "middle", dy: ".35em" }, lis).textContent = "Lisière";

  // chemins
  const gc = s("g", { class: "chemins" }, svg);
  for (const [a, b] of CHEMINS) s("line", { x1: LIEUX[a].x, y1: LIEUX[a].y, x2: LIEUX[b].x, y2: LIEUX[b].y }, gc);

  // lieux
  for (const [id, L] of Object.entries(LIEUX)) {
    const etat = vue.nuit ? "nuit" : id === ici ? "ici" : enVue.has(id) ? "en-vue" : "brume";
    const g = s("g", { class: `lieu ${etat}`, tabindex: 0, role: "button", "data-lieu": id,
      "aria-label": `${L.nom}${etat === "ici" ? ", tu es ici" : etat === "en-vue" ? ", en vue : tu vois qui s'y trouve sans entendre" : ""}` }, svg);
    s("rect", { x: L.x - L.l / 2, y: L.y - L.h / 2, width: L.l, height: L.h, rx: 14, class: "zone" }, g);
    if (etat === "brume") s("rect", { x: L.x - L.l / 2, y: L.y - L.h / 2, width: L.l, height: L.h, rx: 14, fill: "url(#brume)", class: "voile-brume" }, g);
    const p = s("g", { transform: `translate(${L.x - L.l / 2 + 12} ${L.y - L.h / 2 + 10}) scale(${k})`, class: "picto" }, g);
    s("path", { d: PICTOS[id] }, p);
    s("text", { x: L.x - L.l / 2 + 12 + 30 * k, y: L.y - L.h / 2 + 10 + 17 * k, class: "nom-lieu", "font-size": fLieu }, g).textContent = L.nom;
    if (etat === "ici" && !compact) s("text", { x: L.x + L.l / 2 - 12, y: L.y - L.h / 2 + 24, class: "marque-ici", "text-anchor": "end", "font-size": 11 * k }, g).textContent = "tu es ici";
    g.addEventListener("click", () => opts.onLieu?.(id));
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); opts.onLieu?.(id); } });
  }

  // lignes de vue : celles du juge, ou toutes sur demande
  const gv = s("g", { class: "vues" }, svg);
  const lignes = opts.toutesVues ? VUES : ici ? VUES.filter(([a]) => a === ici) : [];
  for (const [a, b] of lignes) {
    const A = LIEUX[a], B = LIEUX[b], dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
    const x1 = A.x + ux * 58, y1 = A.y + uy * 58, x2 = B.x - ux * 64, y2 = B.y - uy * 64;
    s("line", { x1, y1, x2, y2 }, gv);
    s("path", { d: `M${x2} ${y2}l${(-ux * 9 - uy * 5).toFixed(1)} ${(-uy * 9 + ux * 5).toFixed(1)}M${x2} ${y2}l${(-ux * 9 + uy * 5).toFixed(1)} ${(-uy * 9 - ux * 5).toFixed(1)}` }, gv);
  }

  // maisons
  const habitant = id => joueurs.find(j => j.maison === id);
  for (const m of MAISONS) {
    const h = habitant(m.id), lumiere = vue.nuit && h?.humain;
    const g = s("g", { class: `maison${lumiere ? " allumee" : ""}`, transform: `translate(${m.x} ${m.y})`, tabindex: 0, role: "img",
      "aria-label": `Maison${h ? " de " + h.nom : ""}, fenêtre sur ${LIEUX[m.fenetre].nom}` }, svg);
    s("title", {}, g).textContent = `Maison${h ? " de " + h.nom : ""} — fenêtre sur ${LIEUX[m.fenetre].nom}`;
    s("path", { d: "M-15 14V-2l15-12 15 12v16z", class: "toit" }, g);
    s("rect", { x: -4, y: 1, width: 8, height: 7, class: "fenetre" }, g);
    if (lumiere) s("circle", { r: 34, class: "halo" }, g);
  }

  // morts : stèle devant la maison
  for (const mort of vue.morts || []) {
    const m = maison(mort.maison); if (!m) continue;
    const g = s("g", { class: "stele", transform: `translate(${m.x + 20} ${m.y - 10})`, role: "img", "aria-label": `${mort.nom}, ${mort.role}, ${mort.cause}` }, svg);
    s("title", {}, g).textContent = `${mort.nom} (${mort.role}) — ${mort.cause}`;
    s("path", { d: "M-8 10V-4a8 8 0 0 1 16 0v14z" }, g);
    s("text", { y: 6, "text-anchor": "middle", "font-size": 10 }, g).textContent = mort.nom[0];
  }

  // jetons
  const posJeton = {};
  const occupes = {};
  const poser = (lieu, noms, cls, extra = {}) => {
    const deja = occupes[lieu] || [];
    const tous = [...deja, ...noms.map(n => ({ n, cls, extra: extra[n] }))]; occupes[lieu] = tous;
    return tous;
  };
  const dessinerLieu = (lieu, tous) => {
    const { pos, visibles, reste } = places(lieu, tous.length, t);
    if (reste) {
      const [x, y] = pos[pos.length - 1], g = s("g", { class: "reste", transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`, tabindex: 0, role: "button",
        "aria-label": `et ${reste} autres : ${tous.slice(visibles).map(o => o.n).join(", ")}` }, svg);
      s("circle", { r: r * .95 }, g);
      s("text", { "text-anchor": "middle", dy: ".35em", "font-size": r * .85 }, g).textContent = `+${reste}`;
      g.addEventListener("click", () => opts.onReste?.(lieu, tous.slice(visibles).map(o => o.n)));
    }
    tous.slice(0, visibles).forEach(({ n: nom, cls, extra: ex }, i) => {
      const [x, y] = pos[i], j = slotDe(nom); posJeton[nom] = [x, y];
      const g = s("g", { class: `jeton ${cls} ${j?.humain ? "humain" : "s" + j?.slot}`, transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
        tabindex: 0, role: "button", "data-nom": nom, "aria-label": `${nom}${j?.humain ? " (toi)" : ""}${ex ? ", " + ex : ""}` }, svg);
      forme(j?.humain ? -1 : j?.slot, r, g).setAttribute("class", "corps");
      s("text", { class: "initiale", "text-anchor": "middle", dy: ".35em", "font-size": r * 1.05 }, g).textContent = nom[0];
      if (j?.humain) s("circle", { cx: r * .95, cy: -r * .95, r: r * .32, class: "lanterne" }, g);
      if (!compact) s("text", { class: "nom-jeton", "text-anchor": "middle", y: r + fTexte + 2, "font-size": fTexte }, g).textContent = ex && cls !== "fantome" ? `${nom} · ${ex}` : nom;
      s("title", {}, g).textContent = `${nom}${ex ? " — " + ex : ""}`;
      g.addEventListener("click", () => opts.onJeton?.(nom));
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); opts.onJeton?.(nom); } });
    });
  };
  if (!vue.nuit) {
    for (const [lieu, noms] of Object.entries(vue.presents || {})) poser(lieu, noms, "present");
    for (const [lieu, noms] of Object.entries(vue.vus || {})) poser(lieu, noms, "vu");
    const parLieu = {};
    for (const f of vue.fantomes || []) (parLieu[f.lieu] ||= []).push(f);
    for (const [lieu, fs] of Object.entries(parLieu)) poser(lieu, fs.map(f => f.nom), "fantome", Object.fromEntries(fs.map(f => [f.nom, f.depuis])));
    for (const [lieu, tous] of Object.entries(occupes)) dessinerLieu(lieu, tous);
  }

  // apartés : arc pointillé entre les deux jetons
  for (const [a, b] of vue.apartes || []) {
    const A = posJeton[a], B = posJeton[b]; if (!A || !B) continue;
    const mx = (A[0] + B[0]) / 2, my = Math.min(A[1], B[1]) - r * 2.2;
    s("path", { d: `M${A[0]} ${A[1] - r}Q${mx} ${my} ${B[0]} ${B[1] - r}`, class: "aparte" }, svg);
    if (!compact) s("text", { x: mx, y: my + 4, "text-anchor": "middle", class: "chut", "font-size": 11 }, svg).textContent = "à l'écart";
  }

  // bouche : on voit qu'on parle, sans entendre
  for (const lieu of vue.bouches || []) {
    const L = LIEUX[lieu], g = s("g", { class: "bouche", transform: `translate(${L.x + L.l / 2 - 22} ${L.y - L.h / 2 + 20}) scale(${k * .8})`, role: "img", "aria-label": `On parle à ${L.nom}, trop loin pour entendre` }, svg);
    s("title", {}, g).textContent = `On parle à ${L.nom} (trop loin pour entendre)`;
    s("path", { d: "M-10 0c4-6 16-6 20 0-4 6-16 6-20 0zM-10 0h20" }, g);
  }

  // traces numérotées
  for (const t of vue.traces || []) {
    const pos = t.maison ? maison(t.maison) : LIEUX[t.lieu]; if (!pos) continue;
    const x = t.maison ? pos.x - 22 : pos.x + LIEUX[t.lieu].l / 2 - 20, y = t.maison ? pos.y - 18 : pos.y + LIEUX[t.lieu].h / 2 - 18;
    const g = s("g", { class: "trace", transform: `translate(${x} ${y})`, tabindex: 0, role: "button", "aria-label": `Trace ${t.n} : ${t.texte}` }, svg);
    s("circle", { r: 11 * k }, g);
    s("text", { "text-anchor": "middle", dy: ".35em", "font-size": 12 * k }, g).textContent = t.n;
    g.addEventListener("click", () => opts.onTrace?.(t));
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); opts.onTrace?.(t); } });
  }

  // nuit : voile sur tout le plan
  if (vue.nuit) s("rect", { x: 0, y: 0, width: LARGEUR, height: HAUTEUR, class: "voile-nuit" }, svg);

  // bulles (calque HTML) : au-dessus du lieu du locuteur (au-dessous pour la rangée du haut), jamais sur les jetons ;
  // au téléphone, un bandeau en bas du plan.
  for (const b of vue.bulles || []) {
    const p = posJeton[b.nom]; if (!p) continue;
    const lieu = Object.entries(LIEUX).find(([, L]) => Math.abs(p[0] - L.x) <= L.l / 2 && Math.abs(p[1] - L.y) <= L.h / 2)?.[1];
    const d = document.createElement("div"), qui = document.createElement("b");
    qui.textContent = b.nom + " : ";
    const max = compact ? 70 : 110, txt = b.texte.length > max ? b.texte.slice(0, b.texte.lastIndexOf(" ", max)) + "…" : b.texte;
    d.append(qui, document.createTextNode(txt)); d.title = b.texte;
    if (compact || !lieu) d.className = "bulle bandeau";
    else {
      const dessous = lieu.y < HAUTEUR * .3;
      d.className = "bulle" + (dessous ? " dessous" : "");
      d.style.left = `${Math.min(84, Math.max(16, (p[0] / LARGEUR) * 100))}%`;
      d.style.top = `${((dessous ? lieu.y + lieu.h / 2 + 10 : lieu.y - lieu.h / 2 - 10) / HAUTEUR) * 100}%`;
    }
    calque.append(d);
  }
  return { posJeton };
}

/** Le même contenu en liste, pour les lecteurs d'écran et les petits écrans. */
export function planEnListe(vue) {
  const L = [];
  if (vue.nuit) L.push("La nuit : tu es chez toi. Aucune position n'est visible.");
  for (const [lieu, noms] of Object.entries(vue.presents || {})) L.push(`${LIEUX[lieu].nom} (tu y es) : ${noms.join(", ")}.`);
  for (const [lieu, noms] of Object.entries(vue.vus || {})) L.push(`${LIEUX[lieu].nom} (en vue, sans entendre) : ${noms.join(", ")}.`);
  for (const f of vue.fantomes || []) L.push(`${f.nom} : ${f.depuis} à ${LIEUX[f.lieu].nom}.`);
  for (const [a, b, lieu] of vue.apartes || []) L.push(`${a} et ${b} se parlent à l'écart (${LIEUX[lieu].nom}).`);
  for (const t of vue.traces || []) L.push(`Trace ${t.n} : ${t.texte}`);
  for (const m of vue.morts || []) L.push(`${m.nom} (${m.role}) : ${m.cause}.`);
  return L;
}
