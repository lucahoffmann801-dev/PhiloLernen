import React from "react";
import { useStore, QUESTS, todayKey } from "../lib/store.jsx";
import { Ring } from "../lib/ui.jsx";
import { LEVELS, PLAN } from "../data/meta.js";
import { WORLDS } from "../data/content.js";
import { TERMS } from "../data/begriffe.js";
import { QUESTIONS } from "../data/questions.js";
import { EXAM_TS } from "../data/meta.js";

const OWL_TIPS = [
  "Kleine Schritte zählen doppelt. Eine Lektion reicht, um den Tag zu gewinnen.",
  "Sichere Fehler sind Gold wert. Trau dich, „Sicher“ zu tippen!",
  "Die Klausur fragt Zusammenhänge. Der Rote Faden ist dein Freund.",
  "Erst raten, dann lernen: Dein Gehirn merkt sich Auflösungen besser.",
  "Begründung laut sagen schlägt stilles Nicken. Immer.",
];

function owlState({ d, s, frozenOnLoad }) {
  if (frozenOnLoad > 0) return ["🧊", `Ich habe deine Serie mit ${frozenOnLoad === 1 ? "einem Schoner" : frozenOnLoad + " Schonern"} gerettet. Weiter geht's, als wäre nichts gewesen!`];
  if (frozenOnLoad === -1) return ["🤗", "Die Serie ist neu gestartet. Völlig okay, dein Wissen ist ja noch da. Heute zählt nur der nächste kleine Schritt."];
  if (d.todayXp >= d.dailyGoal) return ["🥳", "Tagesziel geschafft! Alles ab jetzt ist Bonus. Ich bin stolz wie Bolle."];
  if (d.todayStats.t === 0 && d.todayStats.l === 0) return ["😴", "Ich döse noch... Ein Warmstart mit 3 Karten und wir sind beide wach."];
  const day = new Date().getDate();
  return ["🦉", OWL_TIPS[day % OWL_TIPS.length]];
}

export default function Home({ openPlayer, openBlitz, openExam, openDojo, openArcade, goto, openTimer, startPreset }) {
  const { s, d, toggleCheck, frozenOnLoad } = useStore();
  const next = d.next;
  const lvl = LEVELS[d.level];
  const nxtLvl = d.nextLevel;
  const [owlFace, owlLine] = owlState({ d, s, frozenOnLoad });

  const start = new Date(2026, 7, 18).getTime();
  const idx = Math.max(0, Math.min(PLAN.length - 1, Math.round((Date.now() - start) / 864e5)));
  const plan = PLAN[idx];
  // Tagesdosis: fällige + schwache Karten + Verbindungen, fertig gemischt (~12 Stück)
  function buildDose() {
    const seen = QUESTIONS.filter(q => q.w !== "wx" && (s.cards[q.id]?.seen ?? 0) > 0);
    const due = seen.filter(q => d.isDue(q.id)).sort((a, b) => d.mastery(a.id) - d.mastery(b.id)).slice(0, 6).map(q => q.id);
    const inbox = d.inbox.filter(id => !due.includes(id)).slice(0, 2);
    const wx = QUESTIONS.filter(q => q.w === "wx").sort(() => Math.random() - 0.5).slice(0, 2).map(q => q.id);
    const fresh = QUESTIONS.filter(q => q.w !== "wx" && !(s.cards[q.id]?.seen))
      .sort(() => Math.random() - 0.5).slice(0, Math.max(0, 12 - due.length - inbox.length - wx.length)).map(q => q.id);
    return [...due, ...inbox, ...fresh, ...wx];
  }

  return (
    <div className="view wrap">
      <div className="owlrow">
        <span className="owl">{owlFace}</span>
        <span className="bubble">{owlLine}</span>
      </div>

      <button className="dosecard" onClick={() => startPreset({
          ids: buildDose(),
          label: "🍊 Tagesdosis",
          sub: "Fällige, Fehler, Verbindungen und etwas Neues, fertig gemischt. Etwa 10 Minuten." })}>
        <span className="em">🍊</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <b>Tagesdosis · ~10 Minuten</b>
          <span>{d.todayStats.t === 0 ? "Der leichteste Einstieg: einfach drücken, ich stelle alles zusammen." : "Noch eine Runde? Ich mische wieder das Wichtigste."}</span>
        </span>
        <span style={{ fontSize: 18 }}>→</span>
      </button>

      <div className="hero-next">
        <span className="tag">Dein nächster Schritt</span>
        {next ? (
          <>
            <h1>{next.type === "boss" ? `Boss-Check: ${next.world.title}` : next.lesson.title}</h1>
            <p className="muted small">
              {next.type === "boss"
                ? "8 Fragen im Klausurformat. Ab 70 % gibt es die Krone."
                : `${next.world.emoji} ${next.world.title} · ca. ${next.lesson.mins} Min`}
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
            <p className="muted small">Jetzt zählt Wiederholung: Training, Blitzrunden und die Generalprobe.</p>
            <button className="btn" style={{ marginTop: 16 }} onClick={() => goto("training")}>Ins Training →</button>
          </>
        )}
      </div>

      <div className="quests">
        {QUESTS.map(q => {
          const cur = Math.min(d.todayStats[q.id] ?? 0, q.target);
          const done = cur >= q.target;
          return (
            <div key={q.id} className={"quest" + (done ? " done" : "")}>
              <span className="qic">{done ? "✅" : q.emoji}</span>
              <span className="qt">
                <b>{q.label}</b>
                <span className="pbar"><i style={{ width: (cur / q.target * 100) + "%", background: done ? "var(--ok)" : "var(--acc)" }} /></span>
              </span>
              <span className="qxp">{done ? "erledigt" : `+${q.xp} XP`}</span>
            </div>
          );
        })}
      </div>

      <DojoCard s={s} openDojo={openDojo} />

      <button className="arcadecard" onClick={openArcade}>
        <span className="em">🎮</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <b>Arcade</b>
          <span>Millionär, Boss-Kampf, Lüge-Suche, Memory — spielen ist hier lernen</span>
        </span>
        <span style={{ fontSize: 18 }}>→</span>
      </button>

      <div className="actionrow">
        <button className="action" onClick={openBlitz}>
          <span className="em">⚡</span><b>Blitzrunde</b>
          <span>90 Sek., automatisch geprüft</span>
        </button>
        <button className="action" onClick={openExam}>
          <span className="em">🎓</span><b>Generalprobe</b>
          <span>20 Fragen, 25 Min, echte Punkte{s.probeBest ? ` · Best: ${Math.round(s.probeBest.pct * 100)} %` : ""}</span>
        </button>
        <button className="action" onClick={openTimer}>
          <span className="em">🎯</span><b>Fokus-Timer</b>
          <span>Kurzer Block, sichtbare Zeit</span>
        </button>
        <button className="action" onClick={() => goto("training")}
          style={d.inbox.length ? { borderColor: "#f3c6c8" } : {}}>
          <span className="em">📮</span><b>Fehler-Postfach</b>
          <span>{d.inbox.length ? `${d.inbox.length} Karten warten` : "leer, stark!"}</span>
        </button>
      </div>

      <div className="ringrow">
        <div className="ringcard">
          <Ring size={52} stroke={7} pct={d.todayXp / d.dailyGoal} color="var(--mint)">
            <span className="mono" style={{ fontSize: 11 }}>{Math.min(99, Math.round(d.todayXp / d.dailyGoal * 100))}%</span>
          </Ring>
          <div className="txt"><b className="mono">{d.todayXp}/{d.dailyGoal} XP</b><span>Tagesziel</span></div>
        </div>
        <div className="ringcard">
          <Ring size={52} stroke={7} pct={nxtLvl ? (s.xp - lvl.xp) / (nxtLvl.xp - lvl.xp) : 1} color="var(--gold)">
            <span style={{ fontSize: 15 }}>⚡</span>
          </Ring>
          <div className="txt"><b>{lvl.title}</b>
            <span>{nxtLvl ? `${nxtLvl.xp - s.xp} XP bis ${nxtLvl.title}` : "Maximallevel"}</span></div>
        </div>
      </div>

      {d.dueCount > 0 && (
        <button className="card" style={{ width: "100%", textAlign: "left", display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}
          onClick={() => goto("training")}>
          <span style={{ fontSize: 22 }}>🃏</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <b>{d.dueCount} Karten fällig</b>
            <span className="small muted" style={{ display: "block" }}>Kurz wiederholen. 5 Minuten reichen.</span>
          </span>
          <span className="muted">→</span>
        </button>
      )}

      <div className="card" style={{ marginBottom: 12 }}>
        <Coach s={s} d={d} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 15 }}>Heute laut Plan: {plan.h}</h3>
          {plan.m && <span className="mile">{plan.m}</span>}
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {plan.t.map((t, j) => {
            const k = idx + "-" + j;
            return (
              <label key={k} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13, color: "var(--tx2)", cursor: "pointer" }}>
                <input type="checkbox" checked={!!s.checks[k]} onChange={() => toggleCheck(k)}
                  style={{ marginTop: 2, accentColor: "var(--mint)", width: 16, height: 16, flex: "none" }} />
                <span style={s.checks[k] ? { textDecoration: "line-through", color: "var(--tx3)" } : {}}>{t}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <h3 style={{ fontSize: 15 }}>Deine 13 Tage</h3>
          <span className="small muted mono">{Math.round(d.globalMastery * 100)} % sitzt</span>
        </div>
        <div className="pbar" style={{ height: 9 }}>
          <i style={{ width: d.globalMastery * 100 + "%", background: "linear-gradient(90deg,var(--acc),var(--mint))" }} />
        </div>
        <Heatmap dayXp={s.dayXp} />
        <p className="small muted" style={{ marginTop: 10 }}>
          {WORLDS.filter(w => d.worldProgress(w).mastered).length}/{WORLDS.length} Kapitel gemeistert ·
          Serie {s.streak} {s.streak > 0 && "🔥"} · {d.freezesLeft} Serien-Schoner 🧊 übrig
        </p>
        <p className="small muted" style={{ marginTop: 4 }}>
          Heute: {d.todayStats.t} Karten · {d.todayStats.l} Lektionen · {d.todayStats.b} Blitzrunden · {d.todayXp} XP
        </p>
      </div>
    </div>
  );
}

// Adaptiver Rest-Coach: rechnet täglich, was bei DEINEM Tempo heute nötig ist.
function Coach({ s, d }) {
  const daysLeft = Math.max(1, Math.ceil((EXAM_TS - Date.now()) / 864e5));
  const crownsOpen = WORLDS.filter(w => !d.worldProgress(w).mastered);
  const termsOpen = TERMS.filter(t => (s.terms?.[t.id]?.typedOk ?? 0) < 2).length;
  const lessonsOpen = WORLDS.reduce((a, w) => a + w.lessons.filter(l => !s.lessonsDone[l.id]).length, 0);
  const parts = [];
  if (crownsOpen.length) {
    const perDay = Math.ceil(crownsOpen.length / Math.max(1, daysLeft - 2)); // 2 Puffertage vor der Klausur
    parts.push(`${perDay > 1 ? perDay + " Kronen" : "1 Krone"} (als Nächstes: ${crownsOpen[0].title})`);
  }
  if (termsOpen) parts.push(`${Math.ceil(termsOpen / Math.max(1, daysLeft - 1))} Begriffe im Dojo`);
  if (d.dueCount) parts.push(`${Math.min(d.dueCount, 25)} fällige Karten`);
  return (
    <div className="coachline">
      <b>Rest-Coach:</b> Noch {daysLeft} {daysLeft === 1 ? "Tag" : "Tage"} · offen: {crownsOpen.length} Kronen, {termsOpen} Begriffe{lessonsOpen ? `, ${lessonsOpen} Lektionen` : ""}. {parts.length
        ? <>Dein Soll heute: {parts.join(" + ")}. Schaffbar.</>
        : <>Alles offen Geübte ist im Plan. Heute zählt Wiederholung.</>}
    </div>
  );
}

function DojoCard({ s, openDojo }) {
  const mastered = TERMS.filter(t => (s.terms?.[t.id]?.typedOk ?? 0) >= 2).length;
  return (
    <button className="dojocard" onClick={openDojo}>
      <span className="em">🧠</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <b>Begriffs-Dojo</b>
        <span>Eselsbrücken ankern, dann selbst tippen · {mastered}/{TERMS.length} gemeistert</span>
        <span className="pbar"><i style={{ width: (mastered / TERMS.length * 100) + "%", background: "#fff" }} /></span>
      </span>
      <span style={{ fontSize: 18 }}>→</span>
    </button>
  );
}

// 13-Tage-Aktivitätskalender: das Muster zählt, nicht der einzelne Tag.
function Heatmap({ dayXp }) {
  const days = Array.from({ length: 13 }, (_, i) => {
    const dt = new Date(2026, 7, 18 + i);
    const key = dt.toISOString().slice(0, 10);
    const xp = dayXp[key] ?? 0;
    const lvl = xp >= 80 ? 4 : xp >= 50 ? 3 : xp >= 20 ? 2 : xp > 0 ? 1 : 0;
    return { d: dt.getDate(), key, lvl, today: key === todayKey() };
  });
  return (
    <div className="heatmap">
      {days.map(x => (
        <div key={x.key} className={"hd l" + x.lvl + (x.today ? " today" : "")} title={x.key}>
          <span>{x.d}</span>
        </div>
      ))}
    </div>
  );
}
