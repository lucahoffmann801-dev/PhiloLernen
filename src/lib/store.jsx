import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { QUESTIONS } from "../data/questions.js";
import { WORLDS } from "../data/content.js";
import { LEVELS, DAILY_GOAL } from "../data/meta.js";
import { pullProgress, pushProgress } from "./supabase.js";

const KEY = "philo-lernen-v2";
const DAY = 864e5;
export const todayKey = () => new Date().toISOString().slice(0, 10);
const todayTs = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };

// Auf die kurze Zeit bis zur Klausur gestauchte Wiederholungsintervalle (Tage je Box).
const BOX = [0, 1, 1, 2, 3];
const QMAP = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));

// Tagesquests: kleine, sicher erreichbare Ziele mit Bonus-XP.
export const QUESTS = [
  { id: "l", emoji: "📖", label: "1 Lektion abschließen", target: 1, xp: 10 },
  { id: "t", emoji: "🃏", label: "10 Karten im Training", target: 10, xp: 10 },
  { id: "b", emoji: "⚡", label: "1 Blitzrunde spielen", target: 1, xp: 10 },
];

function freshState() {
  return {
    xp: 0,
    lessonsDone: {}, bossDone: {}, cards: {}, checks: {},
    dayXp: {},                // yyyy-mm-dd -> xp
    dayStats: {},             // yyyy-mm-dd -> {l,t,b}
    questsAwarded: {},        // yyyy-mm-dd -> {l:true,...}
    streak: 0, lastStreakDay: null, bestStreak: 0,
    syncCode: null, stamp: 0,
  };
}

function loadLocal() {
  try { const r = localStorage.getItem(KEY); if (r) return { ...freshState(), ...JSON.parse(r) }; } catch {}
  return freshState();
}

function genCode() {
  const abc = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  const a = new Uint32Array(10); crypto.getRandomValues(a);
  for (let i = 0; i < 10; i++) s += abc[a[i] % abc.length];
  return "luca-" + s;
}

function merge(a, b) {
  if (!b) return a;
  const out = { ...a };
  out.xp = Math.max(a.xp || 0, b.xp || 0);
  out.lessonsDone = { ...b.lessonsDone, ...a.lessonsDone };
  out.bossDone = {};
  new Set([...Object.keys(a.bossDone || {}), ...Object.keys(b.bossDone || {})])
    .forEach(k => out.bossDone[k] = Math.max(a.bossDone?.[k] ?? 0, b.bossDone?.[k] ?? 0));
  out.cards = { ...(b.cards || {}) };
  Object.entries(a.cards || {}).forEach(([id, c]) => {
    const o = out.cards[id];
    out.cards[id] = !o ? c : {
      box: Math.max(o.box, c.box), due: Math.max(o.due, c.due),
      seen: Math.max(o.seen, c.seen), miss: Math.max(o.miss, c.miss),
    };
  });
  out.checks = { ...(b.checks || {}), ...(a.checks || {}) };
  out.dayXp = { ...(b.dayXp || {}) };
  Object.entries(a.dayXp || {}).forEach(([d, v]) => out.dayXp[d] = Math.max(out.dayXp[d] ?? 0, v));
  out.dayStats = { ...(b.dayStats || {}) };
  Object.entries(a.dayStats || {}).forEach(([d, st]) => {
    const o = out.dayStats[d] || {};
    out.dayStats[d] = { l: Math.max(o.l ?? 0, st.l ?? 0), t: Math.max(o.t ?? 0, st.t ?? 0), b: Math.max(o.b ?? 0, st.b ?? 0) };
  });
  out.questsAwarded = { ...(b.questsAwarded || {}) };
  Object.entries(a.questsAwarded || {}).forEach(([d, qa]) =>
    out.questsAwarded[d] = { ...(out.questsAwarded[d] || {}), ...qa });
  out.bestStreak = Math.max(a.bestStreak || 0, b.bestStreak || 0);
  if ((b.stamp || 0) > (a.stamp || 0)) { out.streak = b.streak; out.lastStreakDay = b.lastStreakDay; }
  out.stamp = Math.max(a.stamp || 0, b.stamp || 0);
  out.syncCode = a.syncCode || b.syncCode;
  return out;
}

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [s, setS] = useState(loadLocal);
  const [syncState, setSyncState] = useState("aus");
  const pushTimer = useRef(null);
  const sRef = useRef(s); sRef.current = s;

  useEffect(() => {
    const code = s.syncCode;
    if (!code) return;
    setSyncState("lade");
    pullProgress(code).then(remote => {
      if (remote) setS(cur => ({ ...merge(cur, remote), syncCode: code }));
      setSyncState("ok");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
    if (!s.syncCode) return;
    clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(async () => {
      const ok = await pushProgress(sRef.current.syncCode, sRef.current);
      setSyncState(ok ? "ok" : "fehler");
    }, 1500);
    return () => clearTimeout(pushTimer.current);
  }, [s]);

  const api = useMemo(() => {
    const up = fn => setS(cur => ({ ...fn({ ...cur }), stamp: (cur.stamp || 0) + 1 }));

    const addXp = (st, n) => {
      st.xp += n;
      const tk = todayKey();
      st.dayXp = { ...st.dayXp, [tk]: (st.dayXp[tk] ?? 0) + n };
      if (st.lastStreakDay !== tk) {
        const y = new Date(Date.now() - DAY).toISOString().slice(0, 10);
        st.streak = st.lastStreakDay === y ? st.streak + 1 : 1;
        st.lastStreakDay = tk;
        st.bestStreak = Math.max(st.bestStreak, st.streak);
      }
      return st;
    };

    // Quest-Zähler erhöhen; erreichtes Ziel schüttet einmalig Bonus-XP aus.
    const bump = (st, key, n = 1) => {
      const tk = todayKey();
      const cur = { l: 0, t: 0, b: 0, ...(st.dayStats[tk] || {}) };
      cur[key] = (cur[key] ?? 0) + n;
      st.dayStats = { ...st.dayStats, [tk]: cur };
      const quest = QUESTS.find(q => q.id === key);
      const awarded = st.questsAwarded[tk] || {};
      if (quest && cur[key] >= quest.target && !awarded[key]) {
        st.questsAwarded = { ...st.questsAwarded, [tk]: { ...awarded, [key]: true } };
        addXp(st, quest.xp);
      }
      return st;
    };

    return {
      grade(qid, g) {
        up(st => {
          const c = st.cards[qid] ?? { box: 0, due: 0, seen: 0, miss: 0 };
          const n = { ...c, seen: c.seen + 1 };
          if (g === 0) { n.box = 0; n.miss = c.miss + 1; }
          else if (g === 1) { n.box = Math.max(0, c.box - 1); n.miss = c.miss + 1; }
          else n.box = Math.min(4, c.box + 1);
          n.due = todayTs() + BOX[n.box] * DAY;
          st.cards = { ...st.cards, [qid]: n };
          addXp(st, g === 2 ? 3 : 1);
          return bump(st, "t");
        });
      },
      quickXp(n) { up(st => addXp(st, n)); },
      finishLesson(lessonId, bonus) {
        up(st => { st.lessonsDone = { ...st.lessonsDone, [lessonId]: true }; addXp(st, 10 + (bonus || 0)); return bump(st, "l"); });
      },
      finishBoss(worldId, score) {
        up(st => {
          st.bossDone = { ...st.bossDone, [worldId]: Math.max(st.bossDone[worldId] ?? 0, score) };
          return addXp(st, score >= 0.7 ? 25 : 8);
        });
      },
      finishBlitz(correct) {
        up(st => { addXp(st, correct * 2); return bump(st, "b"); });
      },
      toggleCheck(k) { up(st => { st.checks = { ...st.checks, [k]: !st.checks[k] }; return st; }); },
      setSyncCode(code) {
        const c = (code ?? "").trim() || null;
        setS(cur => ({ ...cur, syncCode: c, stamp: (cur.stamp || 0) + 1 }));
        if (c) { setSyncState("lade"); pullProgress(c).then(r => { if (r) setS(cur => ({ ...merge(cur, r), syncCode: c })); setSyncState("ok"); }); }
        else setSyncState("aus");
      },
      genAndSetCode() { const c = genCode(); api.setSyncCode(c); return c; },
      reset() { setS({ ...freshState(), syncCode: sRef.current.syncCode }); },
    };
  }, []);

  const derived = useMemo(() => {
    const isDue = id => { const c = s.cards[id]; return !c || c.due <= todayTs(); };
    const mastery = id => { const c = s.cards[id]; return c ? c.box / 4 : 0; };
    const worldProgress = w => {
      const total = w.lessons.length + 1;
      const done = w.lessons.filter(l => s.lessonsDone[l.id]).length + ((s.bossDone[w.id] ?? 0) >= 0.7 ? 1 : 0);
      return { done, total, pct: Math.round(100 * done / total), mastered: (s.bossDone[w.id] ?? 0) >= 0.7 };
    };
    let next = null;
    outer: for (const w of WORLDS) {
      for (const l of w.lessons) if (!s.lessonsDone[l.id]) { next = { type: "lesson", world: w, lesson: l }; break outer; }
      if ((s.bossDone[w.id] ?? 0) < 0.7) { next = { type: "boss", world: w }; break outer; }
    }
    const dueCount = QUESTIONS.filter(q => q.w !== "wx" && isDue(q.id) && (s.cards[q.id]?.seen ?? 0) > 0).length;
    const level = LEVELS.reduce((acc, l, i) => (s.xp >= l.xp ? i : acc), 0);
    const nextLevel = LEVELS[level + 1] ?? null;
    const tk = todayKey();
    const todayXp = s.dayXp[tk] ?? 0;
    const todayStats = { l: 0, t: 0, b: 0, ...(s.dayStats[tk] || {}) };
    const globalMastery = QUESTIONS.reduce((a, q) => a + mastery(q.id), 0) / QUESTIONS.length;
    return { isDue, mastery, worldProgress, next, dueCount, level, nextLevel, todayXp, todayStats,
      dailyGoal: DAILY_GOAL, globalMastery, qmap: QMAP };
  }, [s]);

  return <Ctx.Provider value={{ s, ...api, d: derived, syncState }}>{children}</Ctx.Provider>;
}
