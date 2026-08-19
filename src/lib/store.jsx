import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { QUESTIONS } from "../data/questions.js";
import { WORLDS } from "../data/content.js";
import { LEVELS, DAILY_GOAL } from "../data/meta.js";
import { pullProgress, pushProgress } from "./supabase.js";
import { setFx } from "./fx.js";

const KEY = "philo-lernen-v2";
const DAY = 864e5;
export const todayKey = () => new Date().toISOString().slice(0, 10);
const dayKeyOf = ts => new Date(ts).toISOString().slice(0, 10);
const todayTs = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };

// Gestauchte Wiederholungsintervalle (Tage je Box).
const BOX = [0, 1, 1, 2, 3];
const QMAP = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
export const FREEZE_MAX = 2;

export const QUESTS = [
  { id: "l", emoji: "📖", label: "1 Lektion abschließen", target: 1, xp: 10 },
  { id: "t", emoji: "🃏", label: "10 Karten im Training", target: 10, xp: 10 },
  { id: "b", emoji: "⚡", label: "1 Blitzrunde spielen", target: 1, xp: 10 },
];

function freshState() {
  return {
    xp: 0,
    lessonsDone: {}, bossDone: {}, cards: {}, checks: {}, terms: {},
    dayXp: {}, dayStats: {}, questsAwarded: {},
    streak: 0, lastStreakDay: null, bestStreak: 0,
    freezesUsed: 0,          // sanfte Streak: 2 Schoner für Lücken-Tage
    probeBest: null,         // bestes Generalproben-Ergebnis {pct, pts, max, date}
    settings: { sound: true, haptics: true, ttsRate: 1, focusChoice: "off", focusVol: 0.5, focusHintSeen: false },
    syncCode: null, stamp: 0,
  };
}

function loadLocal() {
  try { const r = localStorage.getItem(KEY); if (r) { const p = JSON.parse(r);
    return { ...freshState(), ...p, settings: { ...freshState().settings, ...(p.settings || {}) } }; } } catch {}
  return freshState();
}

function genCode() {
  const abc = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  const a = new Uint32Array(10); crypto.getRandomValues(a);
  for (let i = 0; i < 10; i++) s += abc[a[i] % abc.length];
  return "luca-" + s;
}

function mergeCard(o, c) {
  return {
    box: Math.max(o.box ?? 0, c.box ?? 0), due: Math.max(o.due ?? 0, c.due ?? 0),
    seen: Math.max(o.seen ?? 0, c.seen ?? 0), miss: Math.max(o.miss ?? 0, c.miss ?? 0),
    heal: Math.max(o.heal ?? 0, c.heal ?? 0), cw: Math.max(o.cw ?? 0, c.cw ?? 0),
    winDays: [...new Set([...(o.winDays || []), ...(c.winDays || [])])].sort(),
  };
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
    out.cards[id] = out.cards[id] ? mergeCard(out.cards[id], c) : c;
  });
  out.checks = { ...(b.checks || {}), ...(a.checks || {}) };
  out.terms = { ...(b.terms || {}) };
  Object.entries(a.terms || {}).forEach(([id, t]) => {
    const o = out.terms[id] || {};
    out.terms[id] = { seen: Math.max(o.seen ?? 0, t.seen ?? 0),
      typedOk: Math.max(o.typedOk ?? 0, t.typedOk ?? 0), fails: Math.max(o.fails ?? 0, t.fails ?? 0) };
  });
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
  out.freezesUsed = Math.max(a.freezesUsed || 0, b.freezesUsed || 0);
  out.probeBest = (a.probeBest?.pct ?? -1) >= (b.probeBest?.pct ?? -1) ? a.probeBest : b.probeBest;
  out.settings = a.settings || b.settings;
  if ((b.stamp || 0) > (a.stamp || 0)) { out.streak = b.streak; out.lastStreakDay = b.lastStreakDay; }
  out.stamp = Math.max(a.stamp || 0, b.stamp || 0);
  out.syncCode = a.syncCode || b.syncCode;
  return out;
}

// Sanfte Streak: Lücken-Tage werden mit Schonern überbrückt statt hart zu resetten.
function reconcileStreak(st) {
  if (!st.lastStreakDay || !st.streak) return { st, frozen: 0 };
  const last = new Date(st.lastStreakDay + "T12:00:00").getTime();
  const gap = Math.round((todayTs() + 12 * 36e5 - last) / DAY) - 1; // volle Tage ohne Aktivität
  if (gap <= 0) return { st, frozen: 0 };
  const avail = FREEZE_MAX - (st.freezesUsed || 0);
  if (gap <= avail) {
    return { st: { ...st, freezesUsed: (st.freezesUsed || 0) + gap }, frozen: gap };
  }
  return { st: { ...st, streak: 0 }, frozen: -1 }; // -1 = Streak sanft beendet
}

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }) {
  const [init] = useState(() => reconcileStreak(loadLocal()));
  const [s, setS] = useState(init.st);
  const [syncState, setSyncState] = useState("aus");
  const pushTimer = useRef(null);
  const sRef = useRef(s); sRef.current = s;

  useEffect(() => { setFx(s.settings); }, [s.settings]);

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
        const y = dayKeyOf(Date.now() - DAY);
        st.streak = (st.lastStreakDay === y || st.streak > 0) ? st.streak + 1 : 1;
        if (st.streak === 0) st.streak = 1;
        st.lastStreakDay = tk;
        st.bestStreak = Math.max(st.bestStreak, st.streak);
      }
      return st;
    };

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
      // g: 0 daneben / 1 halb / 2 sass · conf: 0 geraten / 1 unsicher / 2 sicher
      grade(qid, g, conf = 1) {
        up(st => {
          const c = { box: 0, due: 0, seen: 0, miss: 0, heal: 0, cw: 0, winDays: [], ...(st.cards[qid] || {}) };
          const n = { ...c, seen: c.seen + 1, winDays: [...c.winDays] };
          if (g === 2) {
            n.box = Math.min(4, c.box + 1);
            n.heal = (c.heal ?? 0) + 1;
            const tk = todayKey();
            if (!n.winDays.includes(tk)) n.winDays.push(tk); // Sitzt-Zähler: verschiedene Tage
          } else {
            n.box = g === 1 ? Math.max(0, c.box - 1) : 0;
            n.miss = c.miss + 1; n.heal = 0;
            if (g === 0 && conf === 2) n.cw = (c.cw ?? 0) + 1; // sicher-aber-falsch: Hypercorrection-Kandidat
          }
          // Sicher-falsch kommt sofort wieder, sonst normales Intervall
          n.due = (g === 0 && conf === 2) ? todayTs() : todayTs() + BOX[n.box] * DAY;
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
      finishBlitz(correct) { up(st => { addXp(st, correct * 2); return bump(st, "b"); }); },
      // Begriffs-Dojo: lvl 2 = ohne Hilfe getippt, 1 = mit Tipp, 0 = aufgelöst
      dojo(termId, lvl) {
        up(st => {
          const t = { seen: 0, typedOk: 0, fails: 0, ...(st.terms?.[termId] || {}) };
          t.seen++;
          if (lvl === 2) t.typedOk++;
          if (lvl === 0) t.fails++;
          st.terms = { ...st.terms, [termId]: t };
          return addXp(st, lvl === 2 ? 4 : lvl === 1 ? 2 : 1);
        });
      },
      finishProbe(pts, max) {
        up(st => {
          const pct = max ? pts / max : 0;
          if (!st.probeBest || pct > st.probeBest.pct)
            st.probeBest = { pct, pts, max, date: todayKey() };
          return addXp(st, 20);
        });
      },
      toggleCheck(k) { up(st => { st.checks = { ...st.checks, [k]: !st.checks[k] }; return st; }); },
      setSetting(k, v) { up(st => { st.settings = { ...st.settings, [k]: v }; return st; }); },
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
    // Sitzt-wirklich: 3 korrekte Abrufe an verschiedenen Tagen (Successive Relearning)
    const sitzt = id => Math.min(3, (s.cards[id]?.winDays?.length ?? 0));
    const mastery = id => {
      const c = s.cards[id]; if (!c) return 0;
      return 0.5 * (c.box / 4) + 0.5 * (sitzt(id) / 3);
    };
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
    // Fehler-Postfach: schon mal falsch, noch nicht 2x in Folge geheilt. Sicher-falsch zuerst.
    const inbox = QUESTIONS.filter(q => { const c = s.cards[q.id]; return c && c.miss > 0 && (c.heal ?? 0) < 2; })
      .sort((a, b) => (s.cards[b.id].cw ?? 0) - (s.cards[a.id].cw ?? 0) || s.cards[b.id].miss - s.cards[a.id].miss)
      .map(q => q.id);
    const level = LEVELS.reduce((acc, l, i) => (s.xp >= l.xp ? i : acc), 0);
    const nextLevel = LEVELS[level + 1] ?? null;
    const tk = todayKey();
    const todayXp = s.dayXp[tk] ?? 0;
    const todayStats = { l: 0, t: 0, b: 0, ...(s.dayStats[tk] || {}) };
    const globalMastery = QUESTIONS.reduce((a, q) => a + mastery(q.id), 0) / QUESTIONS.length;
    // Warmstart: die 3 wackligsten bereits gesehenen Karten
    const warmstart = QUESTIONS.filter(q => q.w !== "wx" && (s.cards[q.id]?.seen ?? 0) > 0)
      .sort((a, b) => mastery(a.id) - mastery(b.id)).slice(0, 3).map(q => q.id);
    const freezesLeft = Math.max(0, FREEZE_MAX - (s.freezesUsed || 0));
    return { isDue, mastery, sitzt, worldProgress, next, dueCount, inbox, level, nextLevel,
      todayXp, todayStats, dailyGoal: DAILY_GOAL, globalMastery, warmstart, freezesLeft, qmap: QMAP };
  }, [s]);

  return <Ctx.Provider value={{ s, ...api, d: derived, syncState, frozenOnLoad: init.frozen }}>{children}</Ctx.Provider>;
}
