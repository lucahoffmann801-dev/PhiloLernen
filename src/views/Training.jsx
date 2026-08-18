import React, { useMemo, useState } from "react";
import { useStore } from "../lib/store.jsx";
import Question from "../lib/Question.jsx";
import { QUESTIONS } from "../data/questions.js";
import { WORLDS } from "../data/content.js";

const WNAME = Object.fromEntries(WORLDS.map(w => [w.id, w.nr === "GV" ? "Gastvortrag" : "Kap. " + w.nr]));
WNAME.wx = "Roter Faden";
const WCOLOR = Object.fromEntries(WORLDS.map(w => [w.id, w.color]));
WCOLOR.wx = "#c792ea";

const MODES = [["due", "Fällig"], ["mixed", "Gemischt"], ["wrong", "Nur Fehler"], ["x", "Verbindungen"]];

export default function Training({ openBlitz }) {
  const { s, d, grade } = useStore();
  const [mode, setMode] = useState("due");
  const [wf, setWf] = useState(null); // world filter
  const [seed, setSeed] = useState(0);
  const [pos, setPos] = useState(0);
  const [sessionHits, setSessionHits] = useState(0);

  const pool = useMemo(() => {
    let ids = QUESTIONS.map(q => q.id);
    if (mode === "x") ids = ids.filter(id => d.qmap[id].w === "wx");
    else {
      if (wf) ids = ids.filter(id => d.qmap[id].w === wf);
      else if (mode !== "mixed") ids = ids.filter(id => d.qmap[id].w !== "wx");
      if (mode === "due") { let seen = ids.filter(id => d.isDue(id) && (s.cards[id]?.seen ?? 0) > 0); ids = seen.length ? seen : ids.filter(id => d.isDue(id)); }
      if (mode === "wrong") ids = ids.filter(id => (s.cards[id]?.miss ?? 0) > 0 && (s.cards[id]?.box ?? 0) < 3);
    }
    // schwächste zuerst, Rest gemischt
    const shuffled = [...ids].sort(() => Math.random() - 0.5);
    shuffled.sort((a, b) => d.mastery(a) - d.mastery(b));
    return shuffled.slice(0, 30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, wf, seed]);

  const qid = pool[pos];
  const q = qid ? d.qmap[qid] : null;

  function done(g) {
    grade(qid, g);
    if (g === 2) setSessionHits(h => h + 1);
    setPos(p => p + 1);
  }

  function restart(m, w) {
    if (m !== undefined) setMode(m);
    if (w !== undefined) setWf(w);
    setSeed(x => x + 1); setPos(0); setSessionHits(0);
  }

  return (
    <div className="view wrap">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2 style={{ flex: 1 }}>Training</h2>
        <button className="chip" style={{ background: "#fdf3e2", borderColor: "#f3dcb2", color: "#b57708", fontWeight: 800 }}
          onClick={openBlitz}>⚡ Blitzrunde</button>
      </div>
      <p className="sub">Das Klausurformat pur. Kurze Runden, sofortiges Feedback, schwache Karten kommen automatisch früher wieder.</p>

      <div className="chips" style={{ marginBottom: 8 }}>
        {MODES.map(([m, label]) => (
          <button key={m} className={"chip" + (mode === m ? " on" : "")} onClick={() => restart(m, m === "x" ? null : wf)}>
            {label}{m === "due" && d.dueCount > 0 ? ` (${d.dueCount})` : ""}
          </button>
        ))}
      </div>
      {mode !== "x" && (
        <div className="chips" style={{ marginBottom: 16 }}>
          <button className={"chip" + (!wf ? " on" : "")} onClick={() => restart(undefined, null)}>Alle</button>
          {WORLDS.map(w => (
            <button key={w.id} className={"chip" + (wf === w.id ? " on" : "")}
              style={wf === w.id ? { background: w.color, borderColor: w.color } : { color: w.color }}
              onClick={() => restart(undefined, w.id)}>{w.nr === "GV" ? "GV" : w.nr}</button>
          ))}
        </div>
      )}

      {q ? (
        <>
          <Question key={qid + "-" + seed} q={q} worldName={WNAME[q.w]} color={WCOLOR[q.w]} onDone={done} />
          <div className="qbar">
            <span className="mono">{pos + 1}/{pool.length}</span>
            <div className="pbar"><i style={{ width: (pos / pool.length * 100) + "%", background: "var(--mint)" }} /></div>
            {sessionHits > 1 && <span className="streak-fire">{sessionHits} saßen 🔥</span>}
          </div>
        </>
      ) : (
        <div className="card empty">
          <b>{pool.length === 0 ? "Hier ist gerade nichts offen." : "Runde geschafft! 🎉"}</b>
          {pool.length > 0 && <p className="small" style={{ marginBottom: 12 }}>{sessionHits} von {pool.length} saßen beim ersten Anlauf.</p>}
          <button className="btn sec" style={{ width: "auto", padding: "10px 22px", marginTop: 8 }}
            onClick={() => restart()}>Neue Runde</button>
        </div>
      )}
    </div>
  );
}
