import React, { useMemo, useState } from "react";
import { useStore } from "../lib/store.jsx";
import { Confetti } from "../lib/ui.jsx";
import Question from "../lib/Question.jsx";
import { QUESTIONS } from "../data/questions.js";

// Lektions-Player: Konzeptkarten einzeln, dann Check-Fragen, dann Abschluss.
// Boss-Modus: nur Fragen (8 Stück aus dem Kapitel-Pool), Score am Ende.
export default function Player({ session, onClose }) {
  const { world, lesson, boss } = session;
  const store = useStore();

  const steps = useMemo(() => {
    if (boss) {
      const pool = QUESTIONS.filter(q => q.w === world.id);
      const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
      return shuffled.map(q => ({ kind: "q", q, boss: true }));
    }
    const cards = lesson.cards.map(c => ({ kind: "card", c }));
    const qs = lesson.checks.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean)
      .map(q => ({ kind: "q", q }));
    return [...cards, ...qs];
  }, [world, lesson, boss]);

  const [i, setI] = useState(0);
  const [hits, setHits] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const total = steps.length;
  const step = steps[i];

  function advance(grade) {
    const nHits = hits + (grade === 2 ? 1 : 0);
    if (grade !== undefined) {
      if (!boss) store.grade(step.q.id, grade);
      if (grade === 2) setHits(nHits);
    }
    if (i + 1 < total) { setI(i + 1); return; }
    // fertig
    if (boss) {
      const score = total ? nHits / total : 0;
      store.finishBoss(world.id, score);
      if (score >= 0.7) setCelebrate(true);
    } else {
      store.finishLesson(lesson.id, nHits);
      setCelebrate(true);
    }
    setDone(true);
  }

  const nQ = steps.filter(s => s.kind === "q").length;
  const score = nQ ? hits / nQ : 1;

  return (
    <div className="player">
      <Confetti on={celebrate} />
      <div className="ptop">
        <button className="x" onClick={onClose} aria-label="Schließen">✕</button>
        <div className="pbar"><i style={{
          width: ((done ? total : i) / total * 100) + "%",
          background: boss ? "var(--gold)" : world.color }} /></div>
        <span className="small muted mono">{Math.min(i + 1, total)}/{total}</span>
      </div>

      <div className="body">
        {done ? (
          <div className="lend">
            <div className="big">{boss ? (score >= 0.7 ? "👑" : "💪") : "🎉"}</div>
            <h1>{boss ? (score >= 0.7 ? "Kapitel gemeistert!" : "Fast!") : "Lektion geschafft"}</h1>
            <div className="xp">+{boss ? (score >= 0.7 ? 25 : 8) : 10 + hits} XP</div>
            {boss
              ? <p>{Math.round(score * 100)} % richtig. {score >= 0.7 ? "Die Krone gehört dir." : "Ab 70 % gibt es die Krone. Schau dir die Lektionen nochmal an und komm wieder."}</p>
              : <p>{nQ ? `${hits} von ${nQ} Checks saßen.` : ""} Kleine Einheiten, oft wiederholt. Genau so bleibt es hängen.</p>}
          </div>
        ) : step.kind === "card" ? (
          <ConceptCard c={step.c} world={world} />
        ) : (
          <Question key={step.q.id} q={step.q} worldName={world.nr === "GV" ? "Gastvortrag" : "Kapitel " + world.nr}
            color={world.color} onDone={advance} simple={boss} />
        )}
      </div>

      <div className="foot">
        {done ? (
          <button className="btn" onClick={onClose}>Zurück zum Pfad</button>
        ) : step.kind === "card" ? (
          <button className="btn" style={{ background: world.color, color: "#08101f" }}
            onClick={() => advance()}>Verstanden, weiter</button>
        ) : null}
      </div>
    </div>
  );
}

function ConceptCard({ c, world }) {
  return (
    <div className="ccard" key={c.term}>
      <div className="ctag" style={{ color: world.color }}>
        <span>{world.emoji}</span><span>{world.nr === "GV" ? "Gastvortrag" : "Kapitel " + world.nr}</span>
      </div>
      <h1>{c.term}</h1>
      <p className="klar">{c.klar}</p>
      {c.bsp && (
        <div className="cbsp">
          <div className="h">Stell dir vor</div>
          <p>{c.bsp}</p>
        </div>
      )}
      {c.merk && (
        <div className="cmerk">
          <div className="h">Merk dir</div>
          <p>{c.merk}</p>
        </div>
      )}
      {c.pruef && (
        <div className="cpruef">
          <div className="h">In Prüfungssprache</div>
          <p>{c.pruef}</p>
        </div>
      )}
    </div>
  );
}
