import React, { useMemo, useState } from "react";
import { useStore } from "../lib/store.jsx";
import { Confetti } from "../lib/ui.jsx";
import { fxCorrect, fxWrong, fxLevel } from "../lib/fx.js";
import { QUESTIONS } from "../data/questions.js";
import { TERMS } from "../data/begriffe.js";
import { PHILS } from "../data/ref.js";
import { WORLDS } from "../data/content.js";
import { findEsel } from "../lib/esel.js";

const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const short = (t, n = 90) => t.length > n ? t.slice(0, n - 1) + "…" : t;
const WNAME = Object.fromEntries(WORLDS.map(w => [w.id, w.nr === "GV" ? "Gastvortrag" : "Kap. " + w.nr]));

// Bosse pro Kapitel: derselbe Stoff, aber mit Duell-Dramaturgie.
const BOSSES = {
  w1: { name: "Meister Kant", em: "🎩", taunt: "Handle nur so, dass du meine Fragen bestehen kannst!" },
  w2: { name: "Dr. QALY", em: "🩺", taunt: "Deine Antworten werden streng rationiert." },
  w3: { name: "Professor Embryo", em: "🧬", taunt: "Bist du schon eine Person, oder nur potentiell klug?" },
  w4: { name: "Der Paternalist", em: "🧔", taunt: "Ich weiß besser als du, was gut für dich ist." },
  w5: { name: "Richterin Grauzone", em: "⚖️", taunt: "Tun oder Unterlassen? Entscheide dich!" },
  w6: { name: "Singer der Strenge", em: "🌊", taunt: "Jede falsche Antwort lässt ein Argument ertrinken." },
  w7: { name: "Die Öko-Sphinx", em: "🦉", taunt: "Wer zählt moralisch? Antworte weise." },
  w8: { name: "General CO2", em: "🌪️", taunt: "Mein Ausstoß ist grenzenlos, dein Wissen auch?" },
  w9: { name: "Der Algorithmus", em: "🤖", taunt: "Meine Fehlerrate ist niedriger als deine." },
  w10: { name: "Käpt'n Trittbrett", em: "🚲", taunt: "Auf dich kommt es doch eh nicht an!" },
  w11: { name: "Homo Oeconomicus", em: "💼", taunt: "Ich stimme immer für mich selbst." },
};

// ---------- MC-Fragen-Fabrik (alle automatisch prüfbar) ----------
function mcTermDef() {
  const t = shuffle(TERMS)[0];
  const distract = shuffle(TERMS.filter(x => x.id !== t.id)).slice(0, 3);
  return { text: `Was bedeutet „${t.term}“?`, opts: shuffle([{ t: short(t.kurz), ok: true },
    ...distract.map(d => ({ t: short(d.kurz), ok: false }))]), hint: t.esel };
}
function mcDefTerm() {
  const t = shuffle(TERMS)[0];
  const distract = shuffle(TERMS.filter(x => x.id !== t.id)).slice(0, 3);
  return { text: short(t.kurz, 140) + " — welcher Begriff ist das?", opts: shuffle([{ t: t.term, ok: true },
    ...distract.map(d => ({ t: d.term, ok: false }))]), hint: t.esel };
}
function mcPhil() {
  const p = shuffle(PHILS)[0];
  const distract = shuffle(PHILS.filter(x => x[0] !== p[0])).slice(0, 3);
  return { text: `Zu wem gehört: „${short(p[2], 110)}“?`, opts: shuffle([{ t: p[0], ok: true },
    ...distract.map(d => ({ t: d[0], ok: false }))]), hint: p[1] + " · " + p[3] };
}
// Die Königsdisziplin: die falsche These unter echten Klausurthesen finden.
function mcLie(worldId) {
  const pool = QUESTIONS.filter(q => q.typ === "tf" && q.w !== "wx" && (!worldId || q.w === worldId));
  const byW = {};
  pool.forEach(q => (byW[q.w] ??= []).push(q));
  const ws = shuffle(Object.keys(byW).filter(w =>
    byW[w].some(q => !q.wahr) && byW[w].filter(q => q.wahr).length >= 2));
  const w = ws[0];
  const lie = shuffle(byW[w].filter(q => !q.wahr))[0];
  const truths = shuffle(byW[w].filter(q => q.wahr)).slice(0, 2);
  return { text: `${WNAME[w]}: Welche dieser Thesen ist FALSCH?`,
    opts: shuffle([{ t: lie.t, ok: true, b: lie.b }, ...truths.map(q => ({ t: q.t, ok: false, b: q.b }))]),
    hint: "Zwei stimmen wörtlich, eine ist die klassische Klausurfalle.", lieB: lie.b, world: w };
}

// ---------- Arcade-Hub ----------
export default function Arcade({ onClose }) {
  const { s } = useStore();
  const [game, setGame] = useState(null);
  const a = { mill: 0, boss: {}, luege: 0, memory: null, ...(s.arcade || {}) };
  const trophies = Object.keys(a.boss).length;

  if (game === "mill") return <Millionaer onClose={() => setGame(null)} />;
  if (game === "boss") return <BossPick onClose={() => setGame(null)} />;
  if (game === "luege") return <Luege onClose={() => setGame(null)} />;
  if (game === "memory") return <Memory onClose={() => setGame(null)} />;

  const games = [
    { id: "mill", em: "🎰", name: "Ethik-Millionär", sub: "15 Fragen, 3 Joker, Sicherheitsstufen",
      best: a.mill ? `Beste Stufe: ${a.mill}/15` : "Noch nie gespielt" },
    { id: "boss", em: "⚔️", name: "Boss-Kampf", sub: "Kapitel-Endgegner mit Lebensbalken",
      best: trophies ? `${trophies}/${WORLDS.length} Trophäen 🏆` : "Noch keine Trophäe" },
    { id: "luege", em: "🕵️", name: "Zwei Wahrheiten, eine Lüge", sub: "Die falsche These finden — pures Klausurtraining",
      best: a.luege ? `Beste Serie: ${a.luege}` : "Noch nie gespielt" },
    { id: "memory", em: "🃏", name: "Begriffs-Memory", sub: "8 Paare, entspannt aufdecken",
      best: a.memory != null ? `Bestleistung: ${a.memory} Züge` : "Noch nie gespielt" },
  ];

  return (
    <div className="player">
      <div className="ptop">
        <button className="x" onClick={onClose} aria-label="Schließen">✕</button>
        <span style={{ fontWeight: 800 }}>🎮 Arcade</span>
      </div>
      <div className="body">
        <div style={{ margin: "auto 0" }}>
          <p className="sub" style={{ textAlign: "center" }}>Spielen IST hier lernen: Alle Fragen kommen aus deinem echten Klausurstoff.</p>
          {games.map(g => (
            <button key={g.id} className="gamecard" onClick={() => setGame(g.id)}>
              <span className="em">{g.em}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <b>{g.name}</b>
                <span>{g.sub}</span>
                <span className="best">{g.best}</span>
              </span>
              <span style={{ fontSize: 18 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- MC-Frage (gemeinsame Optik) ----------
function McQ({ q, tag, tagStyle, onAnswer, killed = [], showHint }) {
  const [picked, setPicked] = useState(null);
  function pick(j) {
    if (picked !== null || killed.includes(j)) return;
    setPicked(j);
    (q.opts[j].ok ? fxCorrect : fxWrong)();
    setTimeout(() => onAnswer(q.opts[j].ok, j), q.opts[j].ok ? 700 : 1400);
  }
  return (
    <div className="qcard">
      <div className="qmeta"><span className="tag" style={tagStyle}>{tag}</span></div>
      <div className="these" style={{ fontSize: 16.5 }}>{q.text}</div>
      {showHint && q.hint && <p className="hint">🧠 {q.hint}</p>}
      <div className="mc">
        {q.opts.map((o, j) => (
          <button key={j} disabled={picked !== null || killed.includes(j)}
            style={killed.includes(j) ? { opacity: 0.25 } : {}}
            className={picked !== null ? (o.ok ? "hit" : j === picked ? "missed" : "") : ""}
            onClick={() => pick(j)}>{o.t}</button>
        ))}
      </div>
    </div>
  );
}

// ---------- 1) Ethik-Millionär ----------
const LADDER = [50, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 500000, 1000000];
function buildMillQ(level) {
  if (level < 4) return Math.random() < 0.5 ? mcTermDef() : mcDefTerm();
  if (level < 8) return Math.random() < 0.5 ? mcPhil() : mcDefTerm();
  return Math.random() < 0.6 ? mcLie() : mcPhil();
}
function Millionaer({ onClose }) {
  const { arcadeResult } = useStore();
  const [level, setLevel] = useState(0);
  const [q, setQ] = useState(() => buildMillQ(0));
  const [jokers, setJokers] = useState({ fifty: true, esel: true, skip: true });
  const [killed, setKilled] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [over, setOver] = useState(null); // {won, reached}
  const doneRef = React.useRef(false);

  function nextQ(lvl) { setQ(buildMillQ(lvl)); setKilled([]); setShowHint(false); }
  function finish(reached, won) {
    if (doneRef.current) return; doneRef.current = true;
    const xp = reached >= 15 ? 50 : reached >= 10 ? 25 : reached >= 5 ? 12 : 4;
    arcadeResult({ mill: reached }, xp);
    setOver({ won, reached, xp });
    if (won) fxLevel();
  }
  function answer(ok) {
    if (ok) {
      const nl = level + 1;
      if (nl >= 15) { finish(15, true); return; }
      setLevel(nl); nextQ(nl);
    } else {
      const safe = level >= 10 ? 10 : level >= 5 ? 5 : 0;
      finish(safe, false);
    }
  }
  function useJoker(k) {
    if (!jokers[k]) return;
    setJokers(j => ({ ...j, [k]: false }));
    if (k === "fifty") {
      const wrong = q.opts.map((o, j) => (!o.ok ? j : null)).filter(x => x !== null);
      setKilled(shuffle(wrong).slice(0, 2));
    }
    if (k === "esel") setShowHint(true);
    if (k === "skip") nextQ(level);
  }

  if (over) {
    return (
      <div className="player"><Confetti on={over.won} />
        <div className="ptop"><button className="x" onClick={onClose}>✕</button></div>
        <div className="body"><div className="lend">
          <div className="big">{over.won ? "👑" : over.reached >= 5 ? "💰" : "🪙"}</div>
          <h1>{over.won ? "MILLIONÄR!" : `Stufe ${over.reached} gesichert`}</h1>
          <div className="xp">+{over.xp} XP</div>
          <p>{over.won ? "Alle 15 Fragen. Die Klausur kann kommen." :
            over.reached >= 5 ? "Sicherheitsstufe gehalten. Die Fragen oben werden fieser, genau wie in der Klausur." :
            "Früh erwischt. Nochmal? Die Fragen wechseln jedes Mal."}</p>
        </div></div>
        <div className="foot"><button className="btn" onClick={onClose}>Fertig</button></div>
      </div>
    );
  }

  return (
    <div className="player">
      <div className="ptop">
        <button className="x" onClick={() => finish(level >= 10 ? 10 : level >= 5 ? 5 : 0, false)} aria-label="Aussteigen">✕</button>
        <div className="pbar"><i style={{ width: (level / 15 * 100) + "%", background: "var(--gold)" }} /></div>
        <span className="mono" style={{ fontWeight: 800, color: "var(--gold)" }}>{LADDER[level].toLocaleString("de-DE")} €</span>
      </div>
      <div className="body">
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 }}>
          {[["fifty", "50:50"], ["esel", "🧠 Joker"], ["skip", "⏭ Skip"]].map(([k, label]) => (
            <button key={k} className="chip" disabled={!jokers[k]}
              style={!jokers[k] ? { opacity: 0.3, textDecoration: "line-through" } : { fontWeight: 800 }}
              onClick={() => useJoker(k)}>{label}</button>
          ))}
        </div>
        <McQ key={level + q.text} q={q} tag={`Frage ${level + 1} von 15`}
          tagStyle={{ background: "#fdf3e2", color: "#b57708" }}
          onAnswer={answer} killed={killed} showHint={showHint} />
        <p className="small muted" style={{ textAlign: "center", marginTop: 10 }}>
          Sicherheitsstufen: Frage 5 und 10 · falsche Antwort fällt dorthin zurück
        </p>
      </div>
    </div>
  );
}

// ---------- 2) Boss-Kampf ----------
function BossPick({ onClose }) {
  const { s } = useStore();
  const [world, setWorld] = useState(null);
  if (world) return <BossFight world={world} onClose={() => setWorld(null)} onExit={onClose} />;
  return (
    <div className="player">
      <div className="ptop"><button className="x" onClick={onClose}>✕</button>
        <span style={{ fontWeight: 800 }}>⚔️ Wähle deinen Gegner</span></div>
      <div className="body">
        <div style={{ paddingTop: 6 }}>
          {WORLDS.map(w => {
            const b = BOSSES[w.id];
            const beaten = !!s.arcade?.boss?.[w.id];
            return (
              <button key={w.id} className="gamecard" style={{ padding: 13 }} onClick={() => setWorld(w)}>
                <span className="em">{b.em}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <b>{b.name} {beaten && "🏆"}</b>
                  <span>{WNAME[w.id]} · {w.title}</span>
                </span>
                <span style={{ fontSize: 16 }}>→</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function BossFight({ world, onClose, onExit }) {
  const { arcadeResult } = useStore();
  const boss = BOSSES[world.id];
  const MAXHP = 10;
  const [hp, setHp] = useState(MAXHP);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [over, setOver] = useState(null);
  const pool = useMemo(() => shuffle(QUESTIONS.filter(q => q.typ === "tf" && q.w === world.id)), [world]);
  const [qi, setQi] = useState(0);
  const q = pool[qi % pool.length];
  const [picked, setPicked] = useState(null);

  function pick(val) {
    if (picked !== null || over) return;
    const ok = val === q.wahr;
    setPicked(val);
    (ok ? fxCorrect : fxWrong)();
    setTimeout(() => {
      if (ok) {
        const nCombo = combo + 1;
        const dmg = nCombo >= 3 ? 2 : 1; // Combo-Crit
        const nhp = Math.max(0, hp - dmg);
        setCombo(nCombo); setHp(nhp);
        if (nhp <= 0) { arcadeResult({ bossWorld: world.id }, 25); fxLevel(); setOver("won"); return; }
      } else {
        setCombo(0);
        const nh = hearts - 1;
        setHearts(nh);
        if (nh <= 0) { setOver("lost"); return; }
      }
      setPicked(null); setQi(i => i + 1);
    }, ok ? 650 : 1500);
  }

  if (over) {
    return (
      <div className="player"><Confetti on={over === "won"} />
        <div className="ptop"><button className="x" onClick={onExit}>✕</button></div>
        <div className="body"><div className="lend">
          <div className="big">{over === "won" ? "🏆" : "💔"}</div>
          <h1>{over === "won" ? `${boss.name} besiegt!` : `${boss.name} war stärker`}</h1>
          {over === "won" && <div className="xp">+25 XP · Trophäe gesichert</div>}
          <p>{over === "won" ? "Die Trophäe bleibt für immer in deiner Sammlung." : "Seine Musterbegründungen findest du im Training. Revanche jederzeit."}</p>
        </div></div>
        <div className="foot">
          <button className="btn sec" onClick={onClose}>Anderer Gegner</button>
          <button className="btn" onClick={onExit}>Fertig</button>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      {combo >= 2 && <div className="combo" key={combo}>{combo}er-Combo {combo >= 3 ? "· CRIT! 💥" : "✨"}</div>}
      <div className="ptop">
        <button className="x" onClick={onClose}>✕</button>
        <span style={{ fontSize: 14 }}>{"❤️".repeat(hearts)}{"🖤".repeat(3 - hearts)}</span>
        <div className="pbar" style={{ flex: 1 }}><i style={{ width: (hp / MAXHP * 100) + "%", background: "var(--no)", transition: "width .4s" }} /></div>
        <span className="mono small" style={{ fontWeight: 800 }}>{hp}/{MAXHP}</span>
      </div>
      <div className="body">
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 44, display: "inline-block", transform: picked !== null && picked === q.wahr ? "translateX(6px) rotate(6deg)" : "none", transition: ".2s" }}>{boss.em}</span>
          <p className="small muted" style={{ fontStyle: "italic" }}>„{boss.taunt}“</p>
        </div>
        <div className="qcard" style={{ margin: 0 }}>
          <div className="qmeta"><span className="tag" style={{ background: "#fdecec", color: "var(--no)" }}>⚔️ {boss.name}</span>
            <span className="small muted">Wahr oder falsch?</span></div>
          <div className="these" style={{ fontSize: 16.5 }}>{q.t}</div>
          <div className="tf">
            <button className={picked !== null ? (q.wahr ? "hit" : picked === true ? "missed" : "") : ""}
              disabled={picked !== null} onClick={() => pick(true)}>WAHR</button>
            <button className={picked !== null ? (!q.wahr ? "hit" : picked === false ? "missed" : "") : ""}
              disabled={picked !== null} onClick={() => pick(false)}>FALSCH</button>
          </div>
          {picked !== null && picked !== q.wahr && (
            <p className="small" style={{ marginTop: 10, color: "var(--no)" }}>{q.b}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- 3) Zwei Wahrheiten, eine Lüge ----------
function Luege({ onClose }) {
  const { s, arcadeResult, quickXp } = useStore();
  const [q, setQ] = useState(() => mcLie());
  const [streak, setStreak] = useState(0);
  const [picked, setPicked] = useState(null);
  const best = s.arcade?.luege ?? 0;

  function pick(j) {
    if (picked !== null) return;
    setPicked(j);
    const ok = q.opts[j].ok;
    (ok ? fxCorrect : fxWrong)();
    if (ok) { setStreak(x => x + 1); quickXp(3); }
  }
  function next() {
    const ok = q.opts[picked].ok;
    if (!ok) { arcadeResult({ luege: streak }, streak >= 3 ? 5 : 0); setStreak(0); }
    setPicked(null); setQ(mcLie());
  }

  return (
    <div className="player">
      <div className="ptop">
        <button className="x" onClick={() => { arcadeResult({ luege: streak }, 0); onClose(); }}>✕</button>
        <span style={{ fontWeight: 800 }}>🕵️ Serie: {streak}</span>
        <span className="small muted" style={{ marginLeft: "auto" }}>Rekord: {Math.max(best, streak)}</span>
      </div>
      <div className="body">
        <div className="qcard">
          <div className="qmeta"><span className="tag" style={{ background: "#f6f0fc", color: "var(--purple)" }}>🕵️ Finde die Lüge</span></div>
          <div className="these" style={{ fontSize: 15 }}>{q.text}</div>
          <div className="mc">
            {q.opts.map((o, j) => (
              <button key={j} disabled={picked !== null}
                className={picked !== null ? (o.ok ? (j === picked ? "hit" : "") : j === picked ? "missed" : "") : ""}
                style={picked !== null && o.ok && j !== picked ? { borderColor: "var(--warn)" } : {}}
                onClick={() => pick(j)}>{o.t}</button>
            ))}
          </div>
          {picked !== null && (
            <div className={"reveal " + (q.opts[picked].ok ? "good" : "bad")}>
              <div className="verdict" style={{ color: q.opts[picked].ok ? "var(--ok)" : "var(--no)" }}>
                {q.opts[picked].ok ? "Lüge entlarvt! 🕵️" : "Das war eine der Wahrheiten"}
              </div>
              <p className="small"><b>Warum die Lüge falsch ist:</b> {q.lieB}</p>
              <div className="sr3" style={{ gridTemplateColumns: "1fr" }}>
                <button onClick={next}>{q.opts[picked].ok ? "Nächste Runde →" : "Neue Serie starten"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- 4) Begriffs-Memory ----------
function Memory({ onClose }) {
  const { arcadeResult } = useStore();
  const deck = useMemo(() => {
    const terms = shuffle(TERMS).slice(0, 8);
    return shuffle(terms.flatMap(t => [
      { key: t.id + "-t", id: t.id, label: t.term, kind: "term" },
      { key: t.id + "-d", id: t.id, label: short(t.kurz, 64), kind: "def" },
    ]));
  }, []);
  const [open, setOpen] = useState([]);      // aktuell aufgedeckte keys (max 2)
  const [found, setFound] = useState({});    // id -> true
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  function flip(card) {
    if (done || open.length === 2 || open.includes(card.key) || found[card.id]) return;
    const no = [...open, card.key];
    setOpen(no);
    if (no.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = no.map(k => deck.find(c => c.key === k));
      if (a.id === b.id && a.kind !== b.kind) {
        fxCorrect();
        setTimeout(() => {
          const nf = { ...found, [a.id]: true };
          setFound(nf); setOpen([]);
          if (Object.keys(nf).length === 8) {
            const total = moves + 1;
            arcadeResult({ memory: total }, total <= 14 ? 20 : 12);
            setDone(true);
          }
        }, 450);
      } else {
        setTimeout(() => setOpen([]), 900);
      }
    }
  }

  return (
    <div className="player">
      <Confetti on={done} />
      <div className="ptop">
        <button className="x" onClick={onClose}>✕</button>
        <span style={{ fontWeight: 800 }}>🃏 Memory</span>
        <span className="small muted mono" style={{ marginLeft: "auto" }}>{moves} Züge · {Object.keys(found).length}/8</span>
      </div>
      <div className="body">
        {done ? (
          <div className="lend">
            <div className="big">🃏</div>
            <h1>Alle 8 Paare in {moves} Zügen!</h1>
            <div className="xp">+{moves <= 14 ? 20 : 12} XP</div>
            <p>{moves <= 14 ? "Starkes Gedächtnis. Perfekt wären 8." : "Jedes Aufdecken war eine Mini-Wiederholung, die zählt."}</p>
          </div>
        ) : (
          <div className="memgrid">
            {deck.map(c => {
              const up = open.includes(c.key) || found[c.id];
              return (
                <button key={c.key} className={"memcard" + (up ? " up" : "") + (found[c.id] ? " done" : "") + (c.kind === "term" ? " term" : "")}
                  onClick={() => flip(c)} aria-label={up ? c.label : "Verdeckte Karte"}>
                  {up ? c.label : "?"}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="foot">{done && <button className="btn" onClick={onClose}>Fertig</button>}</div>
    </div>
  );
}
