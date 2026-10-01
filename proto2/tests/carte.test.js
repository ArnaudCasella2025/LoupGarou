import { test } from "node:test";
import assert from "node:assert/strict";
import { LIEUX, CHEMINS, VUES, MAISONS, voisins, trajet, LARGEUR, HAUTEUR } from "../carte.js";

test("7 lieux, tous reliés à la Place", () => {
  assert.equal(Object.keys(LIEUX).length, 7);
  for (const l of Object.keys(LIEUX)) if (l !== "place") assert.ok(voisins("place").includes(l), l);
});
test("chemins et vues ne citent que des lieux existants, sans doublon", () => {
  for (const [a, b] of [...CHEMINS, ...VUES]) { assert.ok(LIEUX[a] && LIEUX[b], `${a}-${b}`); assert.notEqual(a, b); }
  const cles = CHEMINS.map(c => [...c].sort().join("-"));
  assert.equal(new Set(cles).size, cles.length);
});
test("la Grange, fermée, n'est vue de nulle part", () => {
  assert.ok(LIEUX.grange.fermee);
  assert.ok(!VUES.some(([, b]) => b === "grange"));
});
test("tout lieu est à deux moments au plus de tout autre", () => {
  for (const a of Object.keys(LIEUX)) for (const b of Object.keys(LIEUX)) assert.ok(trajet(a, b).length - 1 <= 2, `${a}→${b}`);
});
test("8 maisons, fenêtres sur des lieux existants, dans le plan", () => {
  assert.equal(MAISONS.length, 8);
  for (const m of MAISONS) { assert.ok(LIEUX[m.fenetre]); assert.ok(m.x > 0 && m.x < LARGEUR && m.y > 0 && m.y < HAUTEUR); }
});
test("les zones des lieux ne se chevauchent pas", () => {
  const z = Object.values(LIEUX);
  for (let i = 0; i < z.length; i++) for (let j = i + 1; j < z.length; j++) {
    const a = z[i], b = z[j];
    const sep = Math.abs(a.x - b.x) >= (a.l + b.l) / 2 || Math.abs(a.y - b.y) >= (a.h + b.h) / 2;
    assert.ok(sep, `${a.nom} / ${b.nom}`);
  }
});
