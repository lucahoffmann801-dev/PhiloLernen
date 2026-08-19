import React, { useMemo, useRef, useState } from "react";
import { useStore } from "../lib/store.jsx";
import Question from "../lib/Question.jsx";
import Cloze from "../lib/Cloze.jsx";
import { QUESTIONS } from "../data/questions.js";
import { WORLDS } from "../data/content.js";

const WNAME = Object.fromEntries(WORLDS.map(w => [w.id, w.nr === "GV" ? "Gastvortrag" : "Kap. " + w.nr]));
WNAME.wx = "Roter Faden";
const WCOLOR = Object.fromEntries(WORLDS.map(w => [w.id, w.color]));
WCOLOR.wx = "#8f5cc9";

const MODES = [["due", "Fällig"], ["mixed", "Gemischt"], ["inbox", "Postfach"], ["luecken", "Lücken"], ["x", "Verbindungen"]];
const shuffle = a => [...a].sort(() => Math.random() - 0.5);

export default function Training({ openBlitz, openDojo, preset, onPresetUsed }) {
  const { s, d, grade } = useStore();
  const [mode, setMode] = useState(preset ? "preset" : "due");
  const [wf, setWf] = useState(null);
  const [seed, setSeed] = useState(0);
  const [pos, setPos] = useState(0);
  const [sessionHits, setSessionHits] = useState(0);
  const recent = useRef([]); // letzte Ergebnisse für die 80–85%-Steuerung
  const requeue = useRef([]); // Nachklapp: Fehler kommen in derselben Runde wieder
  const [presetIds] = useState(preset ? preset.ids : null);

  const pool = useMemo(() => {
    if (mode === "preset" && presetIds) return presetIds;
    let ids = QUESTIONS.map(q => q.id);
    if (mode === "x") ids = ids.filter(id => d.qmap[id].w === "wx");
    else if (mode === "inbox") ids = d.inbox;
    else if (mode === "luecken") {
      // Lückentext nur auf schon gesehenen Karten (erst verstehen, dann produzieren)
      const seenIds = ids.filter(id => (s.cards[id]?.seen ?? 0) > 0 && d.qmap[id].w !== "wx");
      ids = seenIds.length >= 5 ? seenIds : ids.filter(id => d.qmap[id].w !== "wx");
    }
    else {
      if (wf) ids = ids.filter(id => d.qmap[id].w === wf);
      else if (mode !== "mixed") ids = ids.filter(id => d.qmap[id].w !== "wx");
      if (mode === "due") {
        const seen = ids.filter(id => d.isDue(id) && (s.cards[id]?.seen ?? 0) > 0);
        ids = seen.length ? seen : ids.filter(id => d.isDue(id));
      }
    }
    if (mode === "inbox") return ids.slice(0, 30); // bleibt priorisiert sortiert
    const sh = shuffle(ids);
    sh.sort((a, b) => d.mastery(a) - d.mastery(b));
    return sh.slice(0, 30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, wf, seed]);

  // Frust-Schutz (85-%-Heuristik): Läuft es gerade schlecht, kommt eine
  // stabilere Karte zum Auffangen; läuft es sehr gut, eine härtere.
  const order = useMemo(() => {
    const remaining = pool.slice(pos);
    if (remaining.length < 3) return remaining;
    const acc = recent.current.length >= 3
      ? recent.current.reduce((a, x) => a + x, 0) / recent.current.length : 0.8;
    const sorted = [...remaining];
    if (acc < 0.6) sorted.sort((a, b) => d.mastery(b) - d.mastery(a));
    else if (acc > 0.9) sorted.sort((a, b) => d.mastery(a) - d.mastery(b));
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, pos, sessionHits]);

  // Nachklapp einschieben: fällige Wiederholung verdrängt die nächste neue Frage
  const due = requeue.current.find(r => r.at <= pos);
  const qid = due ? due.id : order[0];
  const q = qid ? d.qmap[qid] : null;

  function done(g, conf) {
    grade(qid, g, conf);
    recent.current = [...recent.current.slice(-4), g === 2 ? 1 : 0];
    if (g === 2) setSessionHits(h => h + 1);
    if (due) requeue.current = requeue.current.filter(r => r !== due);
    else if (g < 2 && !requeue.current.some(r => r.id === qid)) {
      requeue.current.push({ id: qid, at: pos + 3 }); // gleich nochmal, solange es frisch ist
    }
    setPos(p => p + 1);
  }

  function restart(m, w) {
    if (m !== undefined) setMode(m);
    if (w !== undefined) setWf(w);
    if (m !== "preset" && onPresetUsed) onPresetUsed();
    recent.current = [];
    setSeed(x => x + 1); setPos(0); setSessionHits(0);
  }

  const card = qid ? s.cards[qid] : null;

  return (
    <div className="view wrap">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2 style={{ flex: 1 }}>{mode === "preset" ? (preset?.label ?? "☀️ Warmstart") : "Training"}</h2>
        <button className="chip" style={{ background: "#f6f0fc", borderColor: "#ddc7f2", color: "var(--purple)", fontWeight: 800 }}
          onClick={openDojo}>🧠 Dojo</button>
        <button className="chip" style={{ background: "#fdf3e2", borderColor: "#f3dcb2", color: "#b57708", fontWeight: 800 }}
          onClick={openBlitz}>⚡ Blitzrunde</button>
      </div>
      <p className="sub">{mode === "preset"
        ? (preset?.sub ?? "Deine wackligsten Karten. Kurz und gezielt.")
        : mode === "luecken"
        ? "Die Musterbegründung mit eigenen Worten vervollständigen. Genau das gibt in der Klausur die Punkte."
        : "Das Klausurformat pur. Sag vor dem Aufdecken, wie sicher du bist: Sichere Fehler sind die wertvollsten."}</p>

      {mode !== "preset" && (
        <>
          <div className="chips" style={{ marginBottom: 8 }}>
            {MODES.map(([m, label]) => (
              <button key={m} className={"chip" + (mode === m ? " on" : "")} onClick={() => restart(m, m === "x" ? null : wf)}>
                {label}{m === "due" && d.dueCount > 0 ? ` (${d.dueCount})` : ""}{m === "inbox" && d.inbox.length > 0 ? ` (${d.inbox.length})` : ""}
              </button>
            ))}
          </div>
          {mode !== "x" && mode !== "inbox" && (
            <div className="chips" style={{ marginBottom: 16 }}>
              <button className={"chip" + (!wf ? " on" : "")} onClick={() => restart(undefined, null)}>Alle</button>
              {WORLDS.map(w => (
                <button key={w.id} className={"chip" + (wf === w.id ? " on" : "")}
                  style={wf === w.id ? { background: w.color, borderColor: w.color } : { color: w.color }}
                  onClick={() => restart(undefined, w.id)}>{w.nr === "GV" ? "GV" : w.nr}</button>
              ))}
            </div>
          )}
          {mode === "inbox" && (
            <p className="small muted" style={{ marginBottom: 14 }}>
              📮 Alles, was mal daneben ging. Eine Karte verlässt das Postfach nach zweimal Richtig in Folge. 💜 markiert sichere Fehler.
            </p>
          )}
        </>
      )}

      {q ? (
        <>
          {mode === "luecken"
            ? <Cloze key={qid + "-" + seed + "-" + pos} q={q} onDone={g => done(g, 1)} />
            : <Question key={qid + "-" + seed + "-" + pos} q={q} worldName={WNAME[q.w]} color={WCOLOR[q.w]} onDone={done} />}
          <div className="qbar">
            <span className="mono">{pos + 1}/{pool.length}</span>
            <div className="pbar"><i style={{ width: (pos / pool.length * 100) + "%", background: "var(--mint)" }} /></div>
            {due && <span style={{ fontSize: 11, fontWeight: 800, color: "var(--warn)" }}>Nachklapp</span>}
          {mode === "inbox" && (card?.cw ?? 0) > 0 && <span style={{ fontSize: 13 }}>💜</span>}
            <span className="sitzt" title="Sitzt-Zähler: 3x richtig an verschiedenen Tagen">
              {[0, 1, 2].map(k => <i key={k} className={d.sitzt(qid) > k ? "on" : ""} />)}
            </span>
            {sessionHits > 1 && <span className="streak-fire">{sessionHits} ✓</span>}
          </div>
        </>
      ) : (
        <div className="card empty">
          <b>{pool.length === 0 ? (mode === "inbox" ? "Postfach leer. Stark! 📭" : "Hier ist gerade nichts offen.") : "Runde geschafft! 🎉"}</b>
          {pool.length > 0 && <p className="small" style={{ marginBottom: 12 }}>{sessionHits} von {pool.length} saßen beim ersten Anlauf.</p>}
          <button className="btn sec" style={{ width: "auto", padding: "10px 22px", marginTop: 8 }}
            onClick={() => restart(mode === "preset" ? "due" : undefined)}>
            {mode === "preset" ? "Weiter ins Training" : "Neue Runde"}</button>
        </div>
      )}
    </div>
  );
}
