import React, { useState } from "react";
import { fxCorrect, fxWrong } from "./fx.js";
import SpeakButton from "./SpeakButton.jsx";

// Musterbegründung in prüfbare Kernelemente zerlegen (Satz-/Semikolonweise).
export function clauses(b) {
  return b.split(/(?<=[.;!?])\s+/).map(x => x.trim()).filter(x => x.length > 12).slice(0, 3);
}

// Eine Frage im Klausurformat mit Sicherheits-Check (Hypercorrection).
// onDone(grade, conf) — grade: 0/1/2, conf: 0 geraten / 1 unsicher / 2 sicher.
const CONF = [["🎲", "Geraten"], ["🤔", "Unsicher"], ["💪", "Sicher"]];

export default function Question({ q, worldName, color, onDone, simple, pretest }) {
  const [conf, setConf] = useState(1);
  const [picked, setPicked] = useState(null);
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);

  const isTf = q.typ === "tf";
  const hit = isTf && picked !== null && picked === q.wahr;
  const ahaMoment = isTf && revealed && !hit && conf === 2 && !pretest;

  function reveal(p) {
    if (revealed) return;
    if (isTf) { setPicked(p); (p === q.wahr ? fxCorrect : fxWrong)(); }
    setRevealed(true);
  }

  return (
    <div className="qcard">
      <div className="qmeta">
        <span className="tag" style={{ background: color + "22", color }}>{worldName}</span>
        <span className="small muted">
          {pretest ? "Kaltstart · erst raten, dann lernen" : isTf ? "Wahr/Falsch · 2 PKT" : "Ein-Satz-Frage · 3 PKT"}
        </span>
      </div>
      <div className="these">{q.t}</div>

      {!revealed && !simple && !pretest && (
        <div className="confrow">
          <span className="small muted">Wie sicher?</span>
          {CONF.map(([em, label], i) => (
            <button key={i} className={"confchip" + (conf === i ? " on" : "")}
              onClick={() => setConf(i)}>{em} {label}</button>
          ))}
        </div>
      )}

      {isTf ? (
        <>
          {!revealed && !pretest && <p className="hint">Erst entscheiden, dann die Begründung laut sagen oder denken. Ohne Begründung gibt es in der Klausur keinen Punkt.</p>}
          {!revealed && pretest && <p className="hint">Du hast das noch nicht gelernt, einfach raten! Falsch raten ist hier ausdrücklich Teil der Methode.</p>}
          <div className="tf">
            <button className={revealed && q.wahr ? "hit" : revealed && picked === true ? "missed" : ""}
              disabled={revealed} onClick={() => reveal(true)}>WAHR</button>
            <button className={revealed && !q.wahr ? "hit" : revealed && picked === false ? "missed" : ""}
              disabled={revealed} onClick={() => reveal(false)}>FALSCH</button>
          </div>
        </>
      ) : (
        !revealed && (
          <div className="answerbox">
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="In einem Satz antworten. Das Tippen zwingt zum Formulieren, genau das verlangt die Klausur." />
            <button className="btn" style={{ marginTop: 10 }} onClick={() => reveal(null)}>Aufdecken</button>
          </div>
        )
      )}

      {revealed && (
        <div className={"reveal " + (ahaMoment ? "aha" : isTf ? (hit ? "good" : "bad") : "good")}>
          <div className="verdict" style={{ color: ahaMoment ? "var(--purple)" : isTf ? (hit ? "var(--ok)" : "var(--no)") : "var(--acc)" }}>
            {ahaMoment ? "💜 Perfekter Lernmoment!" : isTf ? (hit ? "Wahrheitswert richtig" : "Wahrheitswert falsch") : "Musterantwort"}
          </div>
          {ahaMoment && <p className="small" style={{ marginBottom: 8 }}>
            Du warst dir sicher und lagst daneben. Genau diese Fehler merkt man sich nachweislich am besten. Lies die Begründung zweimal, die Karte kommt gleich nochmal.
          </p>}
          <div className="lbl" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Musterbegründung <SpeakButton id={"b-" + q.id} text={q.b} />
          </div>
          <p>{q.b}</p>
          {text.trim() && (<><div className="lbl">Deine Antwort</div><p className="muted">{text}</p></>)}
          {pretest ? (
            <div className="sr3" style={{ gridTemplateColumns: "1fr" }}>
              <button onClick={() => onDone(undefined)}>Okay, jetzt lernen →</button>
            </div>
          ) : simple ? (
            <div className="sr3" style={{ gridTemplateColumns: "1fr" }}>
              <button onClick={() => onDone(isTf ? (hit ? 2 : 0) : 2, conf)}>Weiter</button>
            </div>
          ) : (
            <Checklist b={q.b} onDone={g => onDone(g, conf)} />
          )}
        </div>
      )}
    </div>
  );
}

// Ehrliche Selbstbewertung: Kernelemente der Musterbegründung abhaken statt Bauchgefühl.
function Checklist({ b, onDone }) {
  const items = clauses(b);
  const [checked, setChecked] = useState(() => items.map(() => false));
  const ratio = items.length ? checked.filter(Boolean).length / items.length : 0;
  const grade = ratio === 1 ? 2 : ratio >= 0.5 ? 1 : 0;
  const label = grade === 2 ? "Saß ✓ · Abstand wächst" : grade === 1 ? "Halb · kommt bald wieder" : "Daneben · kommt morgen wieder";
  return (
    <div style={{ marginTop: 14, borderTop: "1.5px dashed var(--line)", paddingTop: 12 }}>
      <p className="small muted" style={{ marginBottom: 8 }}>Ehrlich abhaken: Welche Kernelemente hatte DEINE Begründung?</p>
      <div style={{ display: "grid", gap: 7 }}>
        {items.map((it, i) => (
          <label key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13.5, cursor: "pointer", lineHeight: 1.45 }}>
            <input type="checkbox" checked={checked[i]}
              onChange={() => setChecked(c => c.map((x, j) => j === i ? !x : x))}
              style={{ marginTop: 2, width: 17, height: 17, accentColor: "var(--ok)", flex: "none" }} />
            <span>{it}</span>
          </label>
        ))}
      </div>
      <button className="btn" style={{ marginTop: 12, background: grade === 2 ? "var(--ok)" : grade === 1 ? "var(--warn)" : "var(--no)" }}
        onClick={() => onDone(grade)}>{label}</button>
    </div>
  );
}
