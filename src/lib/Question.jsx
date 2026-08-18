import React, { useState } from "react";
import { fxCorrect, fxWrong } from "./fx.js";

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
          <div className="lbl">Musterbegründung</div>
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
            <>
              <p className="small muted" style={{ marginTop: 12 }}>Und deine eigene Begründung, wie nah dran war sie?</p>
              <div className="sr3">
                <button style={{ color: "var(--no)" }} onClick={() => onDone(0, conf)}>Daneben<small>kommt bald wieder</small></button>
                <button style={{ color: "var(--warn)" }} onClick={() => onDone(1, conf)}>Halb<small>bald wieder</small></button>
                <button style={{ color: "var(--ok)" }} onClick={() => onDone(2, conf)}>Saß<small>Abstand wächst</small></button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
