import React, { useEffect, useState } from "react";
import { useStore } from "./store.jsx";
import { FOCUS_OPTIONS, playFocus, stopFocus, focusState, onFocusChange } from "./focus.js";
import { setFocusVolume } from "./audio.js";

// Bottom-Sheet für den Fokus-Sound. Kein Autoplay: Auswahl ist persistiert,
// gespielt wird immer erst nach Antippen einer Option.
export default function FocusSheet({ onClose }) {
  const { s, setSetting } = useStore();
  const [active, setActive] = useState(focusState());
  useEffect(() => onFocusChange(setActive), []);
  const vol = s.settings?.focusVol ?? 0.5;
  // Hinweis nur beim allerersten Öffnen zeigen (Flag wird danach persistiert)
  const [showHint] = useState(() => !s.settings?.focusHintSeen);

  useEffect(() => {
    if (!s.settings?.focusHintSeen) setSetting("focusHintSeen", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function choose(id) {
    setSetting("focusChoice", id);
    if (id === "off") stopFocus();
    else await playFocus(id, vol);
  }

  return (
    <>
      <div className="sheetbg" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label="Fokus-Sound">
        <div className="grab" />
        <h3 style={{ textAlign: "center", fontSize: 17 }}>Fokus-Sound</h3>
        <p className="small muted" style={{ textAlign: "center", margin: "4px 0 14px" }}>
          Manche lernen mit gleichmäßigem Hintergrundgeräusch besser, andere schlechter. Einfach ausprobieren.
        </p>
        {showHint && (
          <div className="hintbox">📱 Auf dem iPhone: Der seitliche Stummschalter muss aus sein, sonst bleibt es still.</div>
        )}
        <div style={{ maxHeight: "42vh", overflowY: "auto", paddingBottom: 2 }}>
          {FOCUS_OPTIONS.map(o => {
            const on = (active === "off" ? "off" : active) === o.id;
            return (
              <button key={o.id} className={"focusopt" + (on ? " on" : "")}
                aria-pressed={on} onClick={() => choose(o.id)}>
                <span className="fem" aria-hidden="true">{o.emoji}</span>
                <span>{o.label}<small>{o.sub}</small></span>
                {on && <span className="check">✓</span>}
              </button>
            );
          })}
        </div>
        <div className="volrow">
          <span aria-hidden="true">🔉</span>
          <input type="range" min="0" max="1" step="0.05" value={vol}
            aria-label="Lautstärke Fokus-Sound"
            onChange={e => { const v = +e.target.value; setSetting("focusVol", v); setFocusVolume(v); }} />
          <span aria-hidden="true">🔊</span>
        </div>
        <button className="btn sec" style={{ marginTop: 14 }} onClick={onClose}>Fertig</button>
      </div>
    </>
  );
}
