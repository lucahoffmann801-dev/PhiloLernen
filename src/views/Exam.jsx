import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../lib/store.jsx";
import { Confetti } from "../lib/ui.jsx";
import Question from "../lib/Question.jsx";
import { QUESTIONS } from "../data/questions.js";
import { WORLDS } from "../data/content.js";

const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const DURATION = 25 * 60;
const WNAME = Object.fromEntries(WORLDS.map(w => [w.id, w.nr === "GV" ? "Gastvortrag" : "Kap. " + w.nr]));
const WCOLOR = Object.fromEntries(WORLDS.map(w => [w.id, w.color]));

// Generalprobe: 20 Fragen (14 Wahr/Falsch à 2 PKT + 6 Ein-Satz à 3 PKT = 46 PKT),
// 25 Minuten, Punktzählung wie in der echten Klausur, Auswertung nach Kapiteln.
function buildExam() {
  const byWorld = {};
  QUESTIONS.filter(q => q.w !== "wx").forEach(q => (byWorld[q.w] ??= []).push(q));
  const tf = [], fr = [];
  // gleichmäßig über die Kapitel streuen
  const worlds = shuffle(Object.keys(byWorld));
  for (const w of worlds) {
    const t = shuffle(byWorld[w].filter(q => q.typ === "tf"));
    const f = shuffle(byWorld[w].filter(q => q.typ === "q"));
    if (t[0]) tf.push(t[0]); if (t[1]) tf.push(t[1]);
    if (f[0]) fr.push(f[0]);
  }
  return shuffle([...shuffle(tf).slice(0, 14), ...shuffle(fr).slice(0, 6)]);
}

export default function Exam({ onClose }) {
  const { grade, finishProbe, s } = useStore();
  const [exam] = useState(buildExam);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [results, setResults] = useState([]); // {qid, w, typ, pts, max}
  const [over, setOver] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setLeft(l => l - 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (left <= 0 && !doneRef.current) end(results); // eslint-disable-next-line
  }, [left]);

  function end(res) {
    if (doneRef.current) return;
    doneRef.current = true;
    const pts = res.reduce((a, r) => a + r.pts, 0);
    const max = exam.reduce((a, q) => a + (q.typ === "tf" ? 2 : 3), 0);
    finishProbe(pts, max);
    setOver(true);
  }

  const q = exam[i];

  function done(g, conf) {
    // Punktlogik: TF 2 PKT nur mit Begründung (g=2), 1 PKT bei richtigem
    // Wahrheitswert mit halber Begründung (g=1), sonst 0.
    // Ein-Satz: 3 / 1 / 0.
    const pts = q.typ === "tf" ? (g === 2 ? 2 : g === 1 ? 1 : 0) : (g === 2 ? 3 : g === 1 ? 1 : 0);
    grade(q.id, g, conf); // zählt auch fürs normale Training
    const res = [...results, { qid: q.id, w: q.w, typ: q.typ, pts, max: q.typ === "tf" ? 2 : 3 }];
    setResults(res);
    if (i + 1 >= exam.length) end(res);
    else setI(i + 1);
  }

  const fmt = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(Math.max(0, s) % 60).padStart(2, "0");

  if (over) {
    const pts = results.reduce((a, r) => a + r.pts, 0);
    const max = exam.reduce((a, q) => a + (q.typ === "tf" ? 2 : 3), 0);
    const pct = pts / max;
    const tendenz = pct >= 0.9 ? "1er-Bereich" : pct >= 0.78 ? "2er-Bereich" : pct >= 0.65 ? "3er-Bereich" : pct >= 0.5 ? "4er-Bereich" : "noch nicht bestanden";
    const perWorld = {};
    results.forEach(r => { const p = perWorld[r.w] ??= { pts: 0, max: 0 }; p.pts += r.pts; p.max += r.max; });
    return (
      <div className="player">
        <Confetti on={pct >= 0.78} />
        <div className="ptop"><button className="x" onClick={onClose}>✕</button></div>
        <div className="body">
          <div className="lend" style={{ width: "100%" }}>
            <div className="big">{pct >= 0.78 ? "🎓" : pct >= 0.5 ? "📈" : "🧗"}</div>
            <h1>Generalprobe: {pts} / {max} PKT</h1>
            <div className="gradebox">
              <div className="g">{Math.round(pct * 100)} %</div>
              <p className="small muted">grobe Tendenz: {tendenz} · rein zur Orientierung, der echte Notenschlüssel kann abweichen</p>
            </div>
            {s.probeBest && s.probeBest.pts !== pts && (
              <p className="small muted">Bisherige Bestmarke: {Math.round(s.probeBest.pct * 100)} %</p>
            )}
            <div className="wbreak">
              {Object.entries(perWorld).sort((a, b) => a[1].pts / a[1].max - b[1].pts / b[1].max).map(([w, p]) => (
                <div className="row" key={w}>
                  <span style={{ color: WCOLOR[w], fontWeight: 800 }}>{WNAME[w]}</span>
                  <span className="pbar"><i style={{ width: (p.pts / p.max * 100) + "%", background: WCOLOR[w] }} /></span>
                  <span className="mono muted">{p.pts}/{p.max}</span>
                </div>
              ))}
            </div>
            <p className="small muted" style={{ marginTop: 14 }}>
              Die schwächsten Kapitel stehen oben. Alle Fehler sind automatisch in deinem Postfach gelandet.
            </p>
          </div>
        </div>
        <div className="foot"><button className="btn" onClick={onClose}>Fertig (+20 XP)</button></div>
      </div>
    );
  }

  return (
    <div className="player">
      <div className="ptop">
        <button className="x" onClick={() => { if (confirm("Generalprobe wirklich abbrechen?")) onClose(); }}>✕</button>
        <div className="pbar"><i style={{ width: (i / exam.length * 100) + "%", background: "var(--acc)" }} /></div>
        <span className="mono" style={{ fontWeight: 800, color: left < 300 ? "var(--no)" : "var(--tx2)", fontSize: 16 }}>{fmt(left)}</span>
      </div>
      <div className="body">
        <div className="exambar wrap" style={{ padding: 0 }}>
          <span className="tag" style={{ background: "#e8edff", color: "var(--acc)" }}>🎓 Generalprobe</span>
          <span className="small muted">Frage {i + 1} von {exam.length}</span>
          <span className="exampts mono">{results.reduce((a, r) => a + r.pts, 0)} PKT</span>
        </div>
        <Question key={q.id} q={q} worldName={WNAME[q.w]} color={WCOLOR[q.w]} onDone={done} />
      </div>
    </div>
  );
}
