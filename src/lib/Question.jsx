import React, { useState } from "react";

// Eine Frage im Klausurformat. tf: erst Wahr/Falsch tippen, dann Begründung
// selbst formulieren und mit der Musterbegründung vergleichen. q: Freitext.
// onDone(grade) mit 0 daneben / 1 halb / 2 sass.
export default function Question({ q, worldName, color, onDone, simple }) {
  const [picked, setPicked] = useState(null);
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);

  const isTf = q.typ === "tf";
  const hit = isTf && picked !== null && picked === q.wahr;

  function reveal(p) {
    if (revealed) return;
    if (isTf) setPicked(p);
    setRevealed(true);
  }

  return (
    <div className="qcard">
      <div className="qmeta">
        <span className="tag" style={{ background: color + "22", color }}>{worldName}</span>
        <span className="small muted">{isTf ? "Wahr/Falsch · 2 PKT" : "Ein-Satz-Frage · 3 PKT"}</span>
      </div>
      <div className="these">{q.t}</div>

      {isTf ? (
        <>
          {!revealed && <p className="hint">Erst entscheiden, dann die Begründung laut sagen oder denken. Ohne Begründung gibt es in der Klausur keinen Punkt.</p>}
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
        <div className={"reveal " + (isTf ? (hit ? "good" : "bad") : "good")}>
          <div className="verdict" style={{ color: isTf ? (hit ? "var(--ok)" : "var(--no)") : "var(--acc)" }}>
            {isTf ? (hit ? "Wahrheitswert richtig" : "Wahrheitswert falsch") : "Musterantwort"}
          </div>
          <div className="lbl">Musterbegründung</div>
          <p>{q.b}</p>
          {text.trim() && (<><div className="lbl">Deine Antwort</div><p className="muted">{text}</p></>)}
          {simple ? (
            <div className="sr3" style={{ gridTemplateColumns: "1fr" }}>
              <button onClick={() => onDone(isTf ? (hit ? 2 : 0) : 2)}>Weiter</button>
            </div>
          ) : (
            <>
              <p className="small muted" style={{ marginTop: 12 }}>Und deine eigene Begründung, wie nah dran war sie?</p>
              <div className="sr3">
                <button style={{ color: "var(--no)" }} onClick={() => onDone(0)}>Daneben<small>morgen wieder</small></button>
                <button style={{ color: "var(--warn)" }} onClick={() => onDone(1)}>Halb<small>bald wieder</small></button>
                <button style={{ color: "var(--ok)" }} onClick={() => onDone(2)}>Saß<small>Abstand wächst</small></button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
