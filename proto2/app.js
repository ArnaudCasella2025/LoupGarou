// Montage de la maquette J0 : charge les projections d'exemple et les dessine.
import { LIEUX, voisins, voitDepuis } from "./carte.js";
import { dessinerPlan, planEnListe } from "./plan.js";

const $ = id => document.getElementById(id);
const MOMENTS = [["aube", "Aube"], ["matin", "Matin"], ["midi", "Midi"], ["apres-midi", "Après-midi"], ["conseil", "Conseil"]];
const etat = { scene: "midi", toutesVues: false, liste: false };
try { etat.scene = localStorage.getItem("hameau:scene") || etat.scene; } catch {}

let donnees;
try {
  donnees = await (await fetch("maquette.json")).json();
} catch (e) {
  $("diag").textContent = "Données d'exemple introuvables (maquette.json).";
  $("diag").className = "diag ko";
  throw e;
}
const joueurs = donnees.joueurs;
const joueur = nom => joueurs.find(j => j.nom === nom);

function fiche(titre, texte) {
  const f = $("fiche"); f.replaceChildren();
  const h = document.createElement("h2"); h.textContent = titre;
  const p = document.createElement("p"); p.textContent = texte;
  f.append(h, p);
}

function surLieu(id) {
  const L = LIEUX[id], v = vueCourante();
  const nVue = voitDepuis(id).map(x => LIEUX[x].nom);
  const statut = v.nuit ? "La nuit, tu es chez toi." : id === v.lieuJuge ? "Tu es ici : tu vois et entends tout." : voitDepuis(v.lieuJuge || "").includes(id) ? "En vue : tu vois qui s'y trouve, sans entendre." : "Hors de vue : tu ne sais que la dernière position vue.";
  fiche(L.nom, `${L.role} Voisins : ${voisins(id).map(x => LIEUX[x].nom).join(", ")}.${nVue.length ? ` Vue sur : ${nVue.join(", ")}.` : ""} Trace laissée : ${L.trace}. ${statut}`);
}
function surJeton(nom) {
  const j = joueur(nom), v = vueCourante();
  const f = (v.fantomes || []).find(x => x.nom === nom);
  const ou = Object.entries(v.presents || {}).find(([, n]) => n.includes(nom))?.[0];
  const vu = Object.entries(v.vus || {}).find(([, n]) => n.includes(nom))?.[0];
  const pos = f ? `${f.depuis} à ${LIEUX[f.lieu].nom} ; position actuelle inconnue.` : ou ? `Avec toi à ${LIEUX[ou].nom}.` : vu ? `À ${LIEUX[vu].nom}, en vue : tu ne l'entends pas.` : "";
  fiche(nom, j.humain ? `C'est toi, le juge. ${pos}` : `Personnalité : ${j.perso}. ${pos}`);
}
const surTrace = t => fiche(`Trace ${t.n}`, t.texte);
const surReste = (lieu, noms) => fiche(LIEUX[lieu].nom, `Aussi présents : ${noms.join(", ")}.`);

const vueCourante = () => donnees.scenes[etat.scene];

function rendreEntete(v) {
  const h = $("horloge"); h.replaceChildren();
  const lbl = document.createElement("span");
  const idx = MOMENTS.findIndex(([k]) => k === v.moment);
  lbl.textContent = `Jour ${v.jour} · ${v.nuit ? "Nuit" : MOMENTS[idx][1]}`;
  const crans = document.createElement("span"); crans.className = "crans"; crans.setAttribute("aria-hidden", "true");
  MOMENTS.forEach((_, i) => { const c = document.createElement("span"); c.className = "cran" + (v.nuit || i < idx ? " passe" : i === idx ? " actuel" : ""); crans.append(c); });
  h.append(lbl, crans);
  const e = $("enjeu"); e.replaceChildren();
  const pips = document.createElement("span"); pips.style.display = "inline-flex"; pips.style.gap = "4px";
  for (let i = 0; i < v.enjeu.total; i++) { const p = document.createElement("span"); p.className = "pip" + (i < v.enjeu.restantes ? " plein" : ""); pips.append(p); }
  const t = document.createElement("span"); t.textContent = `${v.enjeu.restantes} élimination${v.enjeu.restantes > 1 ? "s" : ""} avant la victoire du Loup`;
  e.append(pips, t);
}

function rendreFil(v) {
  const fil = $("fil"); fil.replaceChildren();
  for (const l of v.fil) {
    const d = document.createElement("div"); d.className = `ligne ${l.type}`;
    const m = document.createElement("span");
    if (l.de) { const j = joueur(l.de); m.className = "mini"; m.style.setProperty("--c", `var(--c${j.slot})`); m.textContent = l.de[0]; }
    else { m.className = "mini mj"; m.textContent = "·"; m.setAttribute("aria-hidden", "true"); }
    const t = document.createElement("div"); t.className = "txt";
    if (l.de) { const b = document.createElement("b"); b.textContent = l.de + " : "; t.append(b); }
    t.append(document.createTextNode(l.texte));
    d.append(m, t); fil.append(d);
  }
}

function rendre() {
  const v = vueCourante(), svg = $("plan");
  for (const b of document.querySelectorAll("[data-scene]")) b.setAttribute("aria-pressed", String(b.dataset.scene === etat.scene));
  $("btn-vues").setAttribute("aria-pressed", String(etat.toutesVues));
  $("btn-liste").setAttribute("aria-pressed", String(etat.liste));
  rendreEntete(v);
  dessinerPlan(svg, $("calque"), v, joueurs, { largeurPx: svg.clientWidth || 800, toutesVues: etat.toutesVues, onLieu: surLieu, onJeton: surJeton, onTrace: surTrace, onReste: surReste });
  const ul = $("liste"); ul.replaceChildren(...planEnListe(v).map(t => { const li = document.createElement("li"); li.textContent = t; return li; }));
  ul.hidden = !etat.liste;
  rendreFil(v);
}

for (const b of document.querySelectorAll("[data-scene]")) b.addEventListener("click", () => {
  etat.scene = b.dataset.scene; try { localStorage.setItem("hameau:scene", etat.scene); } catch {}
  rendre();
});
$("btn-vues").addEventListener("click", () => { etat.toutesVues = !etat.toutesVues; rendre(); });
$("btn-liste").addEventListener("click", () => { etat.liste = !etat.liste; rendre(); });
let largeur = 0;
new ResizeObserver(() => { const w = $("plan").clientWidth; if (Math.abs(w - largeur) > 40) { largeur = w; rendre(); } }).observe($("plan"));

rendre();
window.__proto2 = true;
$("diag").textContent = "Modules chargés.";
$("diag").className = "diag ok";
