import React, { useEffect, useState } from "react";
import { useStore } from "./lib/store.jsx";
import { useToast } from "./lib/ui.jsx";
import { EXAM_TS } from "./data/meta.js";
import Home from "./views/Home.jsx";
import Path from "./views/Path.jsx";
import Training from "./views/Training.jsx";
import Threads from "./views/Threads.jsx";
import More from "./views/More.jsx";
import Player from "./views/Player.jsx";

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
  const [session, setSession] = useState(null); // {world, lesson} | {world, boss:true}
  const [toastNode, toast] = useToast();
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick(x => x + 1), 30000); return () => clearInterval(t); }, []);

  const ms = EXAM_TS - Date.now();
  const days = Math.max(0, Math.floor(ms / 864e5));
  const hours = Math.max(0, Math.floor(ms / 36e5) % 24);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="wrap">
          <div className="brand">PhiloLernen<small>Angewandte Ethik · Gesang</small></div>
          <div className="statbar">
            <span className="stat" title="Tages-Serie">🔥<span className="mono">{s.streak}</span></span>
            <span className="stat" title="XP">⚡<span className="mono">{s.xp}</span></span>
            <div className={"daysleft" + (days < 4 ? " urg" : "")}>
              <b className="mono">{days}T {hours}h</b><span>bis Klausur</span>
            </div>
          </div>
        </div>
      </header>

      {view === "home" && <Home openPlayer={setSession} goto={setView} />}
      {view === "path" && <Path openPlayer={setSession} />}
      {view === "training" && <Training />}
      {view === "threads" && <Threads />}
      {view === "more" && <More toast={toast} />}

      {session && <Player session={session} onClose={() => setSession(null)} />}

      <nav className="bnav">
        <div className="row">
          {NAV.map(([id, label, path]) => (
            <button key={id} className={view === id ? "on" : ""} onClick={() => { setSession(null); setView(id); }}>
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
