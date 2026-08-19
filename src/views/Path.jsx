import React, { useState } from "react";
import { useStore } from "../lib/store.jsx";
import { WORLDS, PENDING_WORLDS } from "../data/content.js";

export default function Path({ openPlayer, openListen }) {
  const { s, d } = useStore();
  const nextId = d.next ? (d.next.lesson ? d.next.lesson.id : "boss-" + d.next.world.id) : null;
  const [open, setOpen] = useState(() => d.next ? d.next.world.id : WORLDS[0].id);

  return (
    <div className="view wrap">
      <h2>Lernpfad</h2>
      <p className="sub">Ein Kapitel pro Vorlesung, kleine Lektionen, am Ende der Boss-Check. Empfohlene Reihenfolge von oben nach unten, aber nichts ist verschlossen.</p>

      {WORLDS.map(w => {
        const pr = d.worldProgress(w);
        const isOpen = open === w.id;
        return (
          <div key={w.id} className={"world" + (isOpen ? " open" : "")}>
            <button className="head" onClick={() => setOpen(isOpen ? null : w.id)}>
              <span className="wbadge" style={{ background: w.color }}>
                {w.emoji}
                {pr.mastered && <span className="crown">👑</span>}
              </span>
              <span className="tt">
                <b>{w.nr === "GV" ? "Gastvortrag" : "Kapitel " + w.nr}: {w.title}</b>
                <span>{pr.done}/{pr.total} · {w.intro}</span>
              </span>
              <span className="arw">▶</span>
            </button>
            <div className="lessons">
              <div className="pbar" style={{ margin: "12px 0" }}>
                <i style={{ width: pr.pct + "%", background: w.color }} />
              </div>
              {w.lessons.map((l, li) => {
                const done = !!s.lessonsDone[l.id];
                const isNext = nextId === l.id;
                return (
                  <button key={l.id} className={"lrow" + (done ? " done" : "") + (isNext ? " next" : "")}
                    onClick={() => openPlayer({ world: w, lesson: l })}>
                    <span className="ldot">{done ? "✓" : li + 1}</span>
                    <span className="lt">
                      <b>{l.title}</b>
                      <span>{l.cards.length} Konzepte · {l.checks.length} Checks · ca. {l.mins} Min</span>
                    </span>
                    <span className="go-ic">{done ? "↻" : "→"}</span>
                  </button>
                );
              })}
              <button className="lrow" onClick={() => openListen(w)}>
                <span className="ldot">🎧</span>
                <span className="lt"><b>Kapitel anhören</b>
                  <span>Alle Konzepte als Audio-Strecke, automatisch weiter</span></span>
                <span className="go-ic">→</span>
              </button>
              <button className={"lrow boss" + ((s.bossDone[w.id] ?? 0) >= 0.7 ? " done" : "") + (nextId === "boss-" + w.id ? " next" : "")}
                onClick={() => openPlayer({ world: w, boss: true })}>
                <span className="ldot">👑</span>
                <span className="lt">
                  <b>Boss-Check</b>
                  <span>{(s.bossDone[w.id] ?? 0) > 0
                    ? `Bester Lauf: ${Math.round((s.bossDone[w.id]) * 100)} %`
                    : "8 Fragen im Klausurformat, ab 70 % gemeistert"}</span>
                </span>
                <span className="go-ic">→</span>
              </button>
            </div>
          </div>
        );
      })}

      {PENDING_WORLDS.map(p => (
        <div key={p.nr} className="world locked">
          <div className="head">
            <span className="wbadge" style={{ background: "var(--bg3)", color: "var(--tx3)" }}>🔒</span>
            <span className="tt">
              <b>Kapitel {p.nr}: {p.title}</b>
              <span>{p.note}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
