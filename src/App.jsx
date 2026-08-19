import React, { useEffect, useRef, useState } from "react";
import { useStore } from "./lib/store.jsx";
import { useToast, Ring } from "./lib/ui.jsx";
import { EXAM_TS, LEVELS } from "./data/meta.js";
import Home from "./views/Home.jsx";
import Path from "./views/Path.jsx";
import Training from "./views/Training.jsx";
import Threads from "./views/Threads.jsx";
import More from "./views/More.jsx";
import Player from "./views/Player.jsx";
import Blitz from "./views/Blitz.jsx";
import Exam from "./views/Exam.jsx";
import { fxLevel } from "./lib/fx.js";
import { initBackground as ttsInit } from "./lib/tts.js";
import FocusSheet from "./lib/FocusSheet.jsx";
import { focusState, onFocusChange } from "./lib/focus.js";

const NAV = [
  ["home", "Heute", "M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3z"],
  ["path", "Pfad", "M6 3a3 3 0 100 6c4 0 8 1 8 4s-4 4-8 4m12 2a3 3 0 100-6c-2 0-3 .3-4 .8"],
  ["training", "Training", "M4 8h3v8H4zm13 0h3v8h-3zM8 6h3v12H8zm5 0h3v12h-3z"],
  ["threads", "Faden", "M5 5a2 2 0 104 0 2 2 0 10-4 0zm10 14a2 2 0 104 0 2 2 0 10-4 0zM7 7c0 6 10 6 10 10"],
  ["more", "Mehr", "M5 12a2 2 0 104 0 2 2 0 10-4 0zm6 0a2 2 0 104 0 2 2 0 10-4 0zm6 0a2 2 0 104 0 2 2 0 10-4 0z"],
];

export default function App() {
  const { s, d } = useStore();
  const [view, setView] = useState("home");
  const [session, setSession] = useState(null);
  const [blitz, setBlitz] = useState(false);
  const [exam, setExam] = useState(false);
  const [trainPreset, setTrainPreset] = useState(null);
  const [toastNode, toast] = useToast();
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick(x => x + 1), 30000); return () => clearInterval(t); }, []);

  // Bessere Vorlesestimme still im Hintergrund vorbereiten (kein Blocker, kein Modal).
  useEffect(() => { const t = setTimeout(ttsInit, 3000); return () => clearTimeout(t); }, []);
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusOn, setFocusOn] = useState(false);
  useEffect(() => onFocusChange(id => setFocusOn(id !== "off")), []);

  // Level-Up-Overlay
  const [levelUp, setLevelUp] = useState(null);
  const prevLevel = useRef(d.level);
  useEffect(() => {
    if (d.level > prevLevel.current) { setLevelUp(LEVELS[d.level].title); fxLevel(); }
    prevLevel.current = d.level;
  }, [d.level]);

  // Fokus-Timer (app-weit, oben immer sichtbar wenn er läuft)
  const [timerOpen, setTimerOpen] = useState(false);
  const [tMin, setTMin] = useState(15);
  const [tLeft, setTLeft] = useState(null); // Sekunden oder null
  const [tPause, setTPause] = useState(false);
  useEffect(() => {
    if (tLeft === null) return;
    if (tLeft <= 0) {
      if (!tPause) { setTPause(true); setTLeft(5 * 60); toast("Block geschafft! 5 Minuten Pause, weg vom Bildschirm. 🌿"); }
      else { setTPause(false); setTLeft(null); toast("Pause vorbei. Bereit für den nächsten Block?"); setTimerOpen(true); }
      return;
    }
    const t = setTimeout(() => setTLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [tLeft, tPause]);

  const ms = EXAM_TS - Date.now();
  const days = Math.max(0, Math.floor(ms / 864e5));
  const hours = Math.max(0, Math.floor(ms / 36e5) % 24);
  const fmt = sec => String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");

  return (
    <div className="shell">
      <header className="topbar">
        <div className="wrap">
          <div className="brand">PhiloLernen<small>Angewandte Ethik</small></div>
          <div className="statbar">
            <button className={"speakbtn" + (focusOn ? " playing" : "")} style={{ width: 30, height: 30 }}
              aria-label="Fokus-Sound" onClick={() => setFocusOpen(true)}>
              {focusOn ? "🎵" : "🎧"}
            </button>
            {tLeft !== null && (
              <button className="timerchip" style={tPause ? { background: "var(--ok)" } : {}}
                onClick={() => setTimerOpen(true)}>
                {tPause ? "☕" : "🎯"} <span className="mono">{fmt(tLeft)}</span>
              </button>
            )}
            <span className="stat" title="Serie & XP">🔥<span className="mono">{s.streak}</span>
              <span style={{ color: "var(--line)" }}>·</span>⚡<span className="mono">{s.xp}</span></span>
            <div className={"daysleft" + (days < 4 ? " urg" : "")}>
              <b className="mono">{days}T {hours}h</b><span>bis Klausur</span>
            </div>
          </div>
        </div>
      </header>

      {view === "home" && <Home openPlayer={setSession} openBlitz={() => setBlitz(true)}
        openExam={() => setExam(true)} goto={setView} openTimer={() => setTimerOpen(true)}
        startWarmstart={() => { setTrainPreset({ ids: d.warmstart }); setView("training"); }} />}
      {view === "path" && <Path openPlayer={setSession} />}
      {view === "training" && <Training key={trainPreset ? "warm" : "std"} openBlitz={() => setBlitz(true)}
        preset={trainPreset} onPresetUsed={() => setTrainPreset(null)} />}
      {view === "threads" && <Threads />}
      {view === "more" && <More toast={toast} />}

      {session && <Player session={session} onClose={() => setSession(null)} onOpenFocus={() => setFocusOpen(true)} />}
      {blitz && <Blitz onClose={() => setBlitz(false)} />}
      {exam && <Exam onClose={() => setExam(false)} />}
      {focusOpen && <FocusSheet onClose={() => setFocusOpen(false)} />}

      {timerOpen && (
        <>
          <div className="sheetbg" onClick={() => setTimerOpen(false)} />
          <div className="sheet">
            <div className="grab" />
            <h3 style={{ textAlign: "center", fontSize: 17 }}>Fokus-Timer</h3>
            <p className="small muted" style={{ textAlign: "center", marginTop: 4 }}>
              Kurze Blöcke schlagen lange Sessions. Die Zeit läuft oben sichtbar mit, egal wo du in der App bist.
            </p>
            {tLeft === null ? (
              <>
                <div className="presets">
                  {[10, 15, 20, 25].map(m => (
                    <button key={m} className={tMin === m ? "on" : ""} onClick={() => setTMin(m)}>{m}′</button>
                  ))}
                </div>
                <div className="tctl">
                  <button className="btn" style={{ background: "var(--mint)" }}
                    onClick={() => { setTPause(false); setTLeft(tMin * 60); setTimerOpen(false); }}>
                    Block starten
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "grid", placeItems: "center", margin: "16px 0" }}>
                  <Ring size={110} stroke={10} pct={tLeft / ((tPause ? 5 : tMin) * 60)}
                    color={tPause ? "var(--ok)" : "var(--mint)"}>
                    <b className="mono" style={{ fontSize: 22 }}>{fmt(tLeft)}</b>
                  </Ring>
                </div>
                <div className="tctl">
                  <button className="btn sec" onClick={() => { setTLeft(null); setTPause(false); setTimerOpen(false); }}>
                    Beenden
                  </button>
                  <button className="btn" onClick={() => setTimerOpen(false)}>Weiter lernen</button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {levelUp && !session && !blitz && !exam && (
        <div className="levelup" onClick={() => setLevelUp(null)}>
          <div className="box">
            <div className="big">🎓</div>
            <h1>Level-Up!</h1>
            <p>Du bist jetzt <b>{levelUp}</b>. Weiter so.</p>
            <button className="btn" style={{ marginTop: 18, width: "auto", padding: "12px 30px" }}
              onClick={() => setLevelUp(null)}>Nice!</button>
          </div>
        </div>
      )}

      <nav className="bnav">
        <div className="row">
          {NAV.map(([id, label, path]) => (
            <button key={id} className={view === id ? "on" : ""}
              onClick={() => { setSession(null); setBlitz(false); setExam(false); if (id !== "training") setTrainPreset(null); setView(id); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {toastNode}
    </div>
  );
}
