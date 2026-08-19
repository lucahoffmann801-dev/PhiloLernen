import React, { useEffect, useState } from "react";
import { useStore } from "./store.jsx";
import * as tts from "./tts.js";

// Vorlese-Button: idle -> lädt -> spielt, ohne Layout-Sprung (feste Größe).
export default function SpeakButton({ id, text, dark }) {
  const { s } = useStore();
  const [snap, setSnap] = useState(tts.snapshot);
  const [busy, setBusy] = useState(false);
  useEffect(() => tts.subscribe(st => { setSnap(st); if (st.playingId !== id) setBusy(false); }), [id]);
  // Karte verlassen -> eigenes Audio stoppen
  useEffect(() => () => { if (tts.snapshot().playingId === id) tts.stop(); }, [id]);

  const playing = snap.playingId === id;
  const rate = s.settings?.ttsRate ?? 1;

  async function toggle(e) {
    e.stopPropagation();
    if (!playing) setBusy(true);
    await tts.speak(id, text, rate);
    setBusy(false);
  }

  return (
    <button className={"speakbtn" + (playing ? " playing" : "") + (dark ? " dark" : "")}
      onClick={toggle}
      aria-label={playing ? "Vorlesen stoppen" : "Vorlesen"}
      aria-pressed={playing}
      title={playing ? "Stoppen" : "Vorlesen"}>
      {playing ? (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/>
        </svg>
      ) : busy ? (
        <span className="dots" aria-hidden="true"><i/><i/><i/></span>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z"/>
          <path d="M16 8.5a5 5 0 010 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M18.5 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
}
