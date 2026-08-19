import React, { useEffect, useMemo, useRef, useState } from "react";
import * as tts from "../lib/tts.js";
import { useStore } from "../lib/store.jsx";
import { findEsel } from "../lib/esel.js";

// Hör-Modus: ein Kapitel als Audio-Strecke. Begriff -> Klartext -> Eselsbrücke,
// automatisch weiter. Fürs Mitlaufen ohne Bildschirmfokus (Display an lassen).
export default function Listen({ world, onClose }) {
  const { s } = useStore();
  const cards = useMemo(() => world.lessons.flatMap(l => l.cards), [world]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const cancelRef = useRef(false);
  const rate = s.settings?.ttsRate ?? 1;

  const speakText = c => {
    const e = findEsel(c.term);
    return `${c.term}. ${c.klar} ${e ? "Eselsbrücke: " + e.esel : ""}`;
  };

  async function playFrom(idx) {
    cancelRef.current = false;
    setPlaying(true);
    for (let k = idx; k < cards.length; k++) {
      if (cancelRef.current) return;
      setI(k);
      await tts.speak("listen-" + world.id + "-" + k, speakText(cards[k]), rate);
      // warten bis das Audio wirklich fertig ist
      await new Promise(res => {
        const un = tts.subscribe(st => { if (st.playingId === null) { un(); res(); } });
        // Sicherheitsnetz, falls das Ende-Event verloren geht
        setTimeout(() => { un(); res(); }, 90000);
      });
      if (cancelRef.current) return;
      await new Promise(res => setTimeout(res, 600)); // kurze Atempause
    }
    setPlaying(false);
  }

  function pause() { cancelRef.current = true; tts.stop(); setPlaying(false); }
  function jump(delta) {
    const n = Math.max(0, Math.min(cards.length - 1, i + delta));
    pause(); setI(n);
    setTimeout(() => playFrom(n), 150);
  }
  useEffect(() => () => { cancelRef.current = true; tts.stop(); }, []);

  const c = cards[i];
  const e = findEsel(c.term);

  return (
    <div className="player">
      <div className="ptop">
        <button className="x" onClick={() => { pause(); onClose(); }} aria-label="Schließen">✕</button>
        <div className="pbar"><i style={{ width: ((i + (playing ? 1 : 0)) / cards.length * 100) + "%", background: world.color }} /></div>
        <span className="small muted mono">{i + 1}/{cards.length}</span>
      </div>
      <div className="body">
        <div className="listenbig">
          <div style={{ fontSize: 40 }}>{world.emoji}</div>
          <div className="lphase">{world.nr === "GV" ? "Gastvortrag" : "Kapitel " + world.nr} · Hör-Modus</div>
          <div className="lterm">{c.term}</div>
          <p className="ltext">{c.klar}</p>
          {e && <p className="ltext" style={{ marginTop: 10, color: "var(--purple)" }}>🧠 {e.esel}</p>}
          <div className="listenctl">
            <button className="side" onClick={() => jump(-1)} aria-label="Zurück">⏮</button>
            <button className="big" onClick={() => playing ? pause() : playFrom(i)}
              aria-label={playing ? "Pause" : "Abspielen"}>{playing ? "⏸" : "▶"}</button>
            <button className="side" onClick={() => jump(1)} aria-label="Weiter">⏭</button>
          </div>
          <p className="small muted" style={{ marginTop: 18 }}>
            Läuft automatisch durch das ganze Kapitel. Display anlassen, iOS pausiert Web-Audio sonst.
          </p>
        </div>
      </div>
    </div>
  );
}
