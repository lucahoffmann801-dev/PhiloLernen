import React, { useMemo, useState } from "react";
import { fxCorrect, fxWrong } from "./fx.js";
import { norm } from "./esel.js";

const STOP = new Set(["richtig","falsch","dieser","diese","dieses","seiner","seine","ihrer","zwischen",
  "sondern","werden","wurden","müssen","können","gegenüber","unabhängig","allerdings","außerdem",
  "beziehungsweise","gegen","durch","unter","haben","nicht","keine","einer","eines","einem","einen",
  "sowie","damit","dabei","daraus","dafür","deshalb","genau","immer","wieder","bereits","etwa"]);

// Wählt die 2 tragendsten Wörter der Musterbegründung als Lücken:
// lange Inhaltswörter, die nicht schon in der These stehen.
export function makeCloze(q) {
  const theseWords = new Set(norm(q.t).split(" "));
  const tokens = q.b.split(/(\s+)/);
  const cand = [];
  tokens.forEach((tok, i) => {
    const clean = tok.replace(/[^A-Za-zÄÖÜäöüß-]/g, "");
    const n = norm(clean);
    if (clean.length >= 7 && !STOP.has(n) && !theseWords.has(n)) cand.push({ i, clean, len: clean.length });
  });
  cand.sort((a, b) => b.len - a.len);
  const picks = [];
  for (const c of cand) {
    if (picks.length >= 2) break;
    if (picks.some(p => Math.abs(p.i - c.i) < 4 || norm(p.clean) === norm(c.clean))) continue;
    picks.push(c);
  }
  if (!picks.length) return null;
  picks.sort((a, b) => a.i - b.i);
  return { tokens, gaps: picks };
}

// Lückentext auf der Musterbegründung: die Klausur-Fertigkeit "Begründung produzieren".
export default function Cloze({ q, onDone }) {
  const cz = useMemo(() => makeCloze(q), [q]);
  const [vals, setVals] = useState(() => (cz?.gaps ?? []).map(() => ""));
  const [state, setState] = useState("ask"); // ask | done
  const [results, setResults] = useState([]);

  if (!cz) { onDone(2); return null; }

  function check() {
    const res = cz.gaps.map((g, k) => {
      const want = norm(g.clean), got = norm(vals[k]);
      if (!got) return false;
      if (want === got) return true;
      // Wortstamm reicht (Beugungen tolerieren)
      const min = Math.min(want.length, got.length);
      let p = 0; while (p < min && want[p] === got[p]) p++;
      return p >= Math.max(6, min - 3);
    });
    setResults(res);
    (res.every(Boolean) ? fxCorrect : fxWrong)();
    setState("done");
  }

  let gi = 0;
  const rendered = cz.tokens.map((tok, i) => {
    const gap = cz.gaps.find(g => g.i === i);
    if (!gap) return <span key={i}>{tok}</span>;
    const k = cz.gaps.indexOf(gap);
    if (state === "done") {
      return <b key={i} style={{ color: results[k] ? "var(--ok)" : "var(--no)" }}>
        {gap.clean}{!results[k] && vals[k].trim() ? ` (du: ${vals[k].trim()})` : ""}</b>;
    }
    return <input key={i} className="clozein" value={vals[k]} aria-label={"Lücke " + (k + 1)}
      style={{ width: Math.max(70, gap.clean.length * 11) }}
      onChange={e => setVals(v => v.map((x, j) => j === k ? e.target.value : x))} />;
  });

  const hits = results.filter(Boolean).length;

  return (
    <div className="qcard">
      <div className="qmeta">
        <span className="tag" style={{ background: "#e8edff", color: "var(--acc)" }}>✏️ Lückentext</span>
        <span className="small muted">Die Begründung vervollständigen, das gibt die Punkte</span>
      </div>
      <div className="these" style={{ fontSize: 15.5 }}>{q.t}</div>
      {q.typ === "tf" && <p className="small" style={{ marginTop: 8, fontWeight: 800, color: q.wahr ? "var(--ok)" : "var(--no)" }}>
        Diese These ist {q.wahr ? "WAHR" : "FALSCH"}. Warum?</p>}
      <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.9 }}>{rendered}</p>
      {state === "ask" ? (
        <button className="btn" style={{ marginTop: 14 }} onClick={check}>Prüfen</button>
      ) : (
        <div className={"reveal " + (hits === cz.gaps.length ? "good" : "bad")}>
          <div className="verdict" style={{ color: hits === cz.gaps.length ? "var(--ok)" : "var(--no)" }}>
            {hits}/{cz.gaps.length} Lücken richtig
          </div>
          <div className="sr3" style={{ gridTemplateColumns: "1fr" }}>
            <button onClick={() => onDone(hits === cz.gaps.length ? 2 : hits > 0 ? 1 : 0)}>Weiter</button>
          </div>
        </div>
      )}
    </div>
  );
}
