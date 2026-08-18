import React from "react";
import { useStore } from "../lib/store.jsx";
import { Ring } from "../lib/ui.jsx";
import { LEVELS, PLAN, EXAM_TS } from "../data/meta.js";
import { WORLDS } from "../data/content.js";

export default function Home({ openPlayer, goto }) {
  const { s, d, toggleCheck } = useStore();
  const next = d.next;
  const lvl = LEVELS[d.level];
  const nxtLvl = d.nextLevel;

  // Heutiger Plan-Tag
  const start = new Date(2026, 7, 18).getTime();
  const idx = Math.max(0, Math.min(PLAN.length - 1, Math.round((Date.now() - start) / 864e5)));
  const plan = PLAN[idx];

  return (
    <div className="view wrap">
      <div className="hero-next">
        <span className="tag">Dein nächster Schritt</span>
        {next ? (
          <>
            <h1>{next.type === "boss"
              ? `Boss-Check: ${next.world.title}`
              : next.lesson.title}</h1>
            <p className="muted small">
              {next.type === "boss"
                ? "8 Fragen im Klausurformat. Ab 70 % gibt es die Krone."
                : `${next.world.emoji} ${next.world.title} · ca. ${next.lesson.mins} Min · ${next.lesson.cards.length} Konzepte + ${next.lesson.checks.length} Checks`}
            </p>
            <button className="btn" style={{ marginTop: 16 }}
              onClick={() => openPlayer(next.type === "boss"
                ? { world: next.world, boss: true }
                : { world: next.world, lesson: next.lesson })}>
              {next.type === "boss" ? "Boss-Check starten" : "Lektion starten"} →
            </button>
          </>
        ) : (
          <>
            <h1>Alles durchgespielt 👑</h1>
            <p className="muted small">Jetzt zählt Wiederholung: Das Training hält alles frisch bis zur Klausur.</p>
            <button className="btn" style={{ marginTop: 16 }} onClick={() => goto("training")}>Ins Training →</button>
          </>
        )}
      </div>

      <div className="ringrow">
        <div className="ringcard">
          <Ring size={54} stroke={7} pct={d.todayXp / d.dailyGoal} color="var(--mint)">
            <span className="mono" style={{ fontSize: 11 }}>{Math.min(99, Math.round(d.todayXp / d.dailyGoal * 100))}%</span>
          </Ring>
          <div className="txt"><b className="mono">{d.todayXp}/{d.dailyGoal} XP</b><span>Tagesziel</span></div>
        </div>
        <div className="ringcard">
          <Ring size={54} stroke={7} pct={nxtLvl ? (s.xp - lvl.xp) / (nxtLvl.xp - lvl.xp) : 1} color="var(--gold)">
            <span style={{ fontSize: 15 }}>⚡</span>
          </Ring>
          <div className="txt"><b>{lvl.title}</b>
            <span>{nxtLvl ? `${nxtLvl.xp - s.xp} XP bis ${nxtLvl.title}` : "Maximallevel"}</span></div>
        </div>
      </div>

      {d.dueCount > 0 && (
        <button className="card" style={{ width: "100%", textAlign: "left", display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}
          onClick={() => goto("training")}>
          <span style={{ fontSize: 22 }}>📬</span>
          <span style={{ flex: 1 }}>
            <b>{d.dueCount} Karten fällig</b>
            <span className="small muted" style={{ display: "block" }}>Kurz wiederholen, bevor es Neues gibt. 5 Minuten reichen.</span>
          </span>
          <span className="muted">→</span>
        </button>
      )}

      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <h3 style={{ fontSize: 15 }}>Heute laut Plan: {plan.h}</h3>
          {plan.m && <span className="mile">{plan.m}</span>}
        </div>
        <div className="tasks" style={{ display: "grid", gap: 6 }}>
          {plan.t.map((t, j) => {
            const k = idx + "-" + j;
            return (
              <label key={k} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13, color: "var(--tx2)", cursor: "pointer" }}>
                <input type="checkbox" checked={!!s.checks[k]} onChange={() => toggleCheck(k)}
                  style={{ marginTop: 2, accentColor: "var(--mint)", width: 15, height: 15, flex: "none" }} />
                <span style={s.checks[k] ? { textDecoration: "line-through", color: "var(--tx3)" } : {}}>{t}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <h3 style={{ fontSize: 15 }}>Gesamtfortschritt</h3>
          <span className="small muted mono">{Math.round(d.globalMastery * 100)} % gefestigt</span>
        </div>
        <div className="pbar" style={{ height: 9 }}>
          <i style={{ width: d.globalMastery * 100 + "%", background: "linear-gradient(90deg,var(--acc),var(--mint))" }} />
        </div>
        <p className="small muted" style={{ marginTop: 10 }}>
          {WORLDS.filter(w => d.worldProgress(w).mastered).length} von {WORLDS.length} Kapiteln gemeistert ·
          Serie {s.streak} {s.streak > 0 && "🔥"} · Rekord {s.bestStreak}
        </p>
      </div>
    </div>
  );
}
