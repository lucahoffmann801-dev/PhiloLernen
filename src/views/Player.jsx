import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "../lib/store.jsx";
import { Confetti } from "../lib/ui.jsx";
import Question from "../lib/Question.jsx";
import { QUESTIONS } from "../data/questions.js";
import { fxCorrect, fxWrong } from "../lib/fx.js";
import SpeakButton from "../lib/SpeakButton.jsx";
import { findEsel } from "../lib/esel.js";
import { focusState, onFocusChange } from "../lib/focus.js";

const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const firstSentence = t => {
  const m = t.match(/^[^.!?]+[.!?]/);
  const s = m ? m[0] : t;
  return s.length > 130 ? s.slice(0, 127) + "…" : s;
};

// Automatisch prüfbare Zwischenfrage: Begriff -> richtige Klartext-Definition.
function makeMc(world, lesson) {
  const all = world.lessons.flatMap(l => l.cards);
  if (all.length < 4) return [];
  return shuffle(lesson.cards).slice(0, 2).map(card => {
    const distractors = shuffle(all.filter(c => c.term !== card.term)).slice(0, 3);
    return {
      kind: "mc",
      prompt: card.term,
      opts: shuffle([{ t: firstSentence(card.klar), ok: true },
        ...distractors.map(d => ({ t: firstSentence(d.klar), ok: false }))]),
      expl: card.merk || card.pruef || "",
    };
  });
}

export default function Player({ session, onClose, onOpenFocus }) {
  const { world, lesson, boss } = session;
  const store = useStore();

  const steps = useMemo(() => {
    if (boss) {
      const pool = QUESTIONS.filter(q => q.w === world.id);
      return shuffle(pool).slice(0, 8).map(q => ({ kind: "q", q, boss: true }));
    }
    const cards = lesson.cards.map(c => ({ kind: "card", c }));
    const mcs = makeMc(world, lesson);
    const checkQs = lesson.checks.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean);
    const qs = checkQs.map(q => ({ kind: "q", q }));
    // Kaltstart (Pretesting): Lektion noch nie gemacht -> erst 2 Thesen blind raten,
    // dann lernen, dann dieselben Thesen als echter Check. Falsch raten ist erwünscht.
    const fresh = !store.s.lessonsDone[lesson.id] &&
      checkQs.every(q => (store.s.cards[q.id]?.seen ?? 0) === 0);
    const pre = fresh ? checkQs.filter(q => q.typ === "tf").slice(0, 2)
      .map(q => ({ kind: "q", q, pretest: true })) : [];
    return [...pre, ...cards, ...mcs, ...qs];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world, lesson, boss]);

  const [i, setI] = useState(0);
  const [hits, setHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const total = steps.length;
  const step = steps[i];
  const nQ = steps.filter(s => s.kind !== "card" && !s.pretest).length;

  function advance(grade, conf) {
    let nHits = hits, nCombo = combo;
    if (step.pretest) { setI(i + 1); return; }
    if (grade !== undefined) {
      if (step.kind === "q" && !boss) store.grade(step.q.id, grade, conf);
      if (step.kind === "mc") store.quickXp(grade === 2 ? 2 : 0);
      if (grade === 2) { nHits = hits + 1; nCombo = combo + 1; }
      else nCombo = 0;
      setHits(nHits); setCombo(nCombo);
    }
    if (i + 1 < total) { setI(i + 1); return; }
    if (boss) {
      const score = nQ ? nHits / nQ : 0;
      store.finishBoss(world.id, score);
      if (score >= 0.7) setCelebrate(true);
    } else {
      store.finishLesson(lesson.id, nHits);
      setCelebrate(true);
    }
    setDone(true);
  }

  const score = nQ ? hits / nQ : 1;
  const wname = world.nr === "GV" ? "Gastvortrag" : "Kapitel " + world.nr;

  return (
    <div className="player">
      <Confetti on={celebrate} />
      {combo >= 2 && !done && <div className="combo" key={combo}>{combo}er-Serie {combo >= 4 ? "🔥" : "✨"}</div>}
      <div className="ptop">
        <button className="x" onClick={onClose} aria-label="Schließen">✕</button>
        <FocusMini onOpen={onOpenFocus} />
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
              ? <p>{Math.round(score * 100)} % richtig. {score >= 0.7 ? "Die Krone gehört dir." : "Ab 70 % gibt es die Krone. Schau die Lektionen nochmal an und komm wieder, das ist völlig normal."}</p>
              : <p>{nQ ? `${hits} von ${nQ} Checks saßen. ` : ""}Kleine Einheiten, oft wiederholt. Genau so bleibt es hängen.</p>}
          </div>
        ) : step.kind === "card" ? (
          <ConceptCard c={step.c} world={world} wname={wname} />
        ) : step.kind === "mc" ? (
          <McCard key={i} step={step} world={world} wname={wname} onDone={advance} />
        ) : (
          <Question key={step.q.id + (step.pretest ? "-pre" : "")} q={step.q} worldName={wname}
            color={world.color} onDone={advance} simple={boss} pretest={step.pretest} />
        )}
      </div>

      <div className="foot">
        {done ? (
          <button className="btn" onClick={onClose}>Zurück zum Pfad</button>
        ) : step.kind === "card" ? (
          <button className="btn" style={{ background: world.color }}
            onClick={() => advance()}>Verstanden, weiter</button>
        ) : null}
      </div>
    </div>
  );
}

function FocusMini({ onOpen }) {
  const [on, setOn] = useState(focusState() !== "off");
  useEffect(() => onFocusChange(id => setOn(id !== "off")), []);
  if (!onOpen) return null;
  return (
    <button className={"speakbtn" + (on ? " playing" : "")} style={{ width: 30, height: 30 }}
      aria-label="Fokus-Sound" onClick={onOpen}>{on ? "🎵" : "🎧"}</button>
  );
}

function ConceptCard({ c, world, wname }) {
  const speakText = `${c.term}. ${c.klar} ${c.bsp ? "Stell dir vor: " + c.bsp : ""}`;
  const esel = findEsel(c.term);
  return (
    <div className="ccard" key={c.term}>
      <div className="ctag" style={{ color: world.color }}>
        <span>{world.emoji}</span><span>{wname}</span>
        <span style={{ marginLeft: "auto" }}><SpeakButton id={"card-" + c.term} text={speakText} /></span>
      </div>
      <h1>{c.term}</h1>
      <p className="klar">{c.klar}</p>
      {c.bsp && <div className="cbsp"><div className="h">Stell dir vor</div><p>{c.bsp}</p></div>}
      {esel && <div className="eselbox"><div className="h">🧠 Eselsbrücke</div><p>{esel.esel}{esel.wort ? " (" + esel.wort + ")" : ""}</p></div>}
      {c.merk && <div className="cmerk"><div className="h">Merk dir</div><p>{c.merk}</p></div>}
      {c.pruef && <div className="cpruef"><div className="h">In Prüfungssprache</div><p>{c.pruef}</p></div>}
    </div>
  );
}

// Automatisch geprüfte Multiple-Choice-Karte: Antwort wird objektiv bestätigt.
function McCard({ step, world, wname, onDone }) {
  const [picked, setPicked] = useState(null);
  const ok = picked !== null && step.opts[picked].ok;
  function pick(j) { setPicked(j); (step.opts[j].ok ? fxCorrect : fxWrong)(); }
  return (
    <div className="qcard">
      <div className="qmeta">
        <span className="tag" style={{ background: world.color + "22", color: world.color }}>{wname}</span>
        <span className="small muted">Schnell-Check · automatisch geprüft</span>
      </div>
      <div className="these">Was bedeutet „{step.prompt}“?</div>
      <div className="mc">
        {step.opts.map((o, j) => (
          <button key={j} disabled={picked !== null}
            className={picked !== null ? (o.ok ? "hit" : j === picked ? "missed" : "") : ""}
            onClick={() => pick(j)}>{o.t}</button>
        ))}
      </div>
      {picked !== null && (
        <div className={"reveal " + (ok ? "good" : "bad")}>
          <div className="verdict" style={{ color: ok ? "var(--ok)" : "var(--no)" }}>
            {ok ? "Richtig ✓" : "Nicht ganz"}
          </div>
          {!ok && <p>Die grün markierte Antwort ist die richtige.</p>}
          {step.expl && <p className="small muted" style={{ marginTop: 6 }}>{step.expl}</p>}
          <div className="sr3" style={{ gridTemplateColumns: "1fr" }}>
            <button onClick={() => onDone(ok ? 2 : 0)}>Weiter</button>
          </div>
        </div>
      )}
    </div>
  );
}
