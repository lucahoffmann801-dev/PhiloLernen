import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../lib/store.jsx";
import { Confetti } from "../lib/ui.jsx";
import { QUESTIONS } from "../data/questions.js";
import { WORLDS } from "../data/content.js";
import { PHILS } from "../data/ref.js";
import { fxCorrect, fxWrong } from "../lib/fx.js";
import { findEsel } from "../lib/esel.js";

const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const DURATION = 90; // Sekunden

const WNAME = Object.fromEntries(WORLDS.map(w => [w.id, w.nr === "GV" ? "Gastvortrag" : "Kap. " + w.nr]));
const WCOLOR = Object.fromEntries(WORLDS.map(w => [w.id, w.color]));

// Blitzrunde: nur automatisch prüfbare Fragen, gegen die Uhr.
// Richtig -> kurzes grünes Feedback, automatisch weiter.
// Falsch -> die richtige Antwort samt Begründung bleibt stehen, bis du weitertippst.
function buildRound() {
  const tf = shuffle(QUESTIONS.filter(q => q.typ === "tf" && q.w !== "wx")).slice(0, 24)
    .map(q => ({ kind: "tf", q }));
  const phils = shuffle(PHILS).slice(0, 8).map(p => {
    const distract = shuffle(PHILS.filter(x => x[0] !== p[0])).slice(0, 3).map(x => x[0]);
    return { kind: "phil", prompt: p[2], theory: p[1], name: p[0], rel: p[3],
      opts: shuffle([p[0], ...distract]) };
  });
  const cards = WORLDS.flatMap(w => w.lessons.flatMap(l => l.cards.map(c => ({ ...c, _w: w }))));
  const defs = shuffle(cards).slice(0, 8).map(c => {
    const distract = shuffle(cards.filter(x => x.term !== c.term)).slice(0, 3).map(x => x.term);
    const klar = c.klar.match(/^[^.!?]+[.!?]/)?.[0] ?? c.klar;
    return { kind: "def", prompt: klar.length > 150 ? klar.slice(0, 147) + "…" : klar,
      name: c.term, world: c._w, opts: shuffle([c.term, ...distract]) };
  });
  return shuffle([...tf, ...phils, ...defs]);
}

export default function Blitz({ onClose }) {
  const { finishBlitz } = useStore();
  const [round] = useState(buildRound);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [picked, setPicked] = useState(null);
  const [hits, setHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const doneRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setLeft(l => l - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (left <= 0 && !doneRef.current) endRound(hits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  function endRound(nHits) {
    if (doneRef.current) return;
    doneRef.current = true;
    clearInterval(timerRef.current);
    finishBlitz(nHits);
    setOver(true);
  }

  const item = round[i];

  function answer(idx, ok) {
    if (picked !== null) return;
    setPicked({ idx, ok });
    (ok ? fxCorrect : fxWrong)();
    const nHits = ok ? hits + 1 : hits;
    const nCombo = ok ? combo + 1 : 0;
    setHits(nHits); setCombo(nCombo); setBest(b => Math.max(b, nCombo));
    if (ok) setTimeout(() => next(nHits), 650); // richtig: kurz feiern, automatisch weiter
  }

  function next(nHits) {
    if (doneRef.current) return;
    if (i + 1 >= round.length) { endRound(nHits ?? hits); return; }
    setPicked(null); setI(x => x + 1);
  }

  if (over) {
    return (
      <div className="player">
        <Confetti on={hits >= 10} />
        <div className="ptop"><button className="x" onClick={onClose}>✕</button></div>
        <div className="body">
          <div className="lend">
            <div className="big">{hits >= 15 ? "🏆" : hits >= 8 ? "⚡" : "💪"}</div>
            <h1>{hits} richtig!</h1>
            <div className="xp">+{hits * 2} XP</div>
            <p>Beste Serie: {best} in Folge. {hits >= 15 ? "Absoluter Wahnsinn." : hits >= 8 ? "Starke Runde!" : "Jede Runde macht die nächste leichter."}</p>
          </div>
        </div>
        <div className="foot"><button className="btn" onClick={onClose}>Fertig</button></div>
      </div>
    );
  }

  return (
    <div className="player">
      {combo >= 3 && <div className="combo" key={combo}>{combo}er-Serie 🔥</div>}
      <div className="ptop">
        <button className="x" onClick={onClose}>✕</button>
        <div className="pbar"><i style={{ width: (left / DURATION * 100) + "%",
          background: left <= 15 ? "var(--no)" : "var(--warn)", transition: "width 1s linear" }} /></div>
        <span className="mono" style={{ fontWeight: 800, color: left <= 15 ? "var(--no)" : "var(--warn)", fontSize: 17 }}>{left}s</span>
      </div>

      <div className="body">
        <div className="qcard">
          <div className="qmeta">
            <span className="tag" style={{ background: "#fdf3e2", color: "#b57708" }}>⚡ Blitz</span>
            <span className="small muted">
              {item.kind === "tf" ? WNAME[item.q.w] + " · Wahr oder falsch?" :
               item.kind === "phil" ? "Wer war das?" : "Welcher Begriff ist gemeint?"}
            </span>
            <span className="small mono" style={{ marginLeft: "auto", fontWeight: 800, color: "var(--ok)" }}>{hits} ✓</span>
          </div>

          {item.kind === "tf" ? (
            <>
              <div className="these">{item.q.t}</div>
              <div className="tf">
                <button className={picked ? (item.q.wahr ? "hit" : picked.idx === 0 ? "missed" : "") : ""}
                  disabled={picked !== null} onClick={() => answer(0, item.q.wahr === true)}>WAHR</button>
                <button className={picked ? (!item.q.wahr ? "hit" : picked.idx === 1 ? "missed" : "") : ""}
                  disabled={picked !== null} onClick={() => answer(1, item.q.wahr === false)}>FALSCH</button>
              </div>
              {picked && !picked.ok && (
                <div className="reveal bad">
                  <div className="verdict" style={{ color: "var(--no)" }}>Leider nein</div>
                  <p>{item.q.b}</p>
                  <div className="sr3" style={{ gridTemplateColumns: "1fr" }}>
                    <button onClick={() => next()}>Weiter</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="these" style={{ fontSize: 16.5 }}>{item.prompt}</div>
              {item.kind === "phil" && <p className="hint">Theorie: {item.theory} · {item.rel}</p>}
              <div className="mc">
                {item.opts.map((o, j) => (
                  <button key={j} disabled={picked !== null}
                    className={picked !== null ? (o === item.name ? "hit" : j === picked.idx ? "missed" : "") : ""}
                    onClick={() => answer(j, o === item.name)}>{o}</button>
                ))}
              </div>
              {picked && !picked.ok && (
                <div className="reveal bad">
                  <div className="verdict" style={{ color: "var(--no)" }}>Richtig wäre: {item.name}</div>
                  {item.kind === "def" && (() => { const e = findEsel(item.name); return e ? <p className="small">🧠 {e.esel}</p> : null; })()}
                  <div className="sr3" style={{ gridTemplateColumns: "1fr" }}>
                    <button onClick={() => next()}>Weiter</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
