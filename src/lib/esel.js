// Eselsbrücken-Register: findet zu einem (Karten-)Begriff die passende Merkhilfe.
import { TERMS } from "../data/begriffe.js";

export const norm = s => (s ?? "").toLowerCase()
  .replaceAll("ä", "a").replaceAll("ö", "o").replaceAll("ü", "u").replaceAll("ß", "ss")
  .replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

const INDEX = TERMS.map(t => ({ key: norm(t.term), t }));

// Wortweiser Vergleich, der Beugungen toleriert ("Deontologie" ~ "Deontologische"):
// gemeinsamer Wortanfang muss fast das ganze kürzere Wort abdecken.
function tokenMatch(a, b) {
  if (a === b) return true;
  const min = Math.min(a.length, b.length);
  if (min < 6) return false;
  let p = 0;
  while (p < min && a[p] === b[p]) p++;
  return p >= Math.max(6, min - 3);
}

export function findEsel(label) {
  const k = norm(label);
  if (!k) return null;
  const labelToks = k.split(" ").filter(x => x.length > 3);
  if (!labelToks.length) return null;
  let best = null;
  for (const { key, t } of INDEX) {
    const keyToks = key.split(" ").filter(x => x.length > 3);
    if (!keyToks.length) continue;
    // Jeder Begriffs-Baustein muss im Kartentitel vorkommen ...
    if (!keyToks.every(kt => labelToks.some(lt => tokenMatch(kt, lt)))) continue;
    // ... und der Begriff muss den Titel tragen (erstes Wort trifft oder deckt ihn großteils ab),
    // damit "Ethik" nicht auf "Angewandte Ethik" landet.
    const firstHit = keyToks.some(kt => tokenMatch(kt, labelToks[0]));
    const coverage = labelToks.filter(lt => keyToks.some(kt => tokenMatch(kt, lt))).length / labelToks.length;
    if (!firstHit && coverage <= 0.5) continue;
    if (!best || key.length > norm(best.term).length) best = t;
  }
  return best;
}

// Tolerantes Antwort-Matching fürs Tippen im Dojo.
export function answerMatches(input, term) {
  const i = norm(input);
  if (!i) return false;
  const cands = [term.term, ...(term.aka ?? [])].map(norm);
  return cands.some(c => i === c);
}
