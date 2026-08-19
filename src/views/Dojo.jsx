import React, { useMemo, useRef, useState } from "react";
import { useStore } from "../lib/store.jsx";
import { Confetti } from "../lib/ui.jsx";
import { fxCorrect, fxWrong } from "../lib/fx.js";
import { TERMS, PAIRS } from "../data/begriffe.js";
import { WORLDS } from "../data/content.js";
import { answerMatches } from "../lib/esel.js";
import SpeakButton from "../lib/SpeakButton.jsx";

const WCOLOR = Object.fromEntries(WORLDS.map(w => [w.id, w.color]));
const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const kdef = t => t.kurz;

// Begriffs-Dojo: Anker (Eselsbrücke) -> Zuordnen (Aufwärmen) -> Abrufen (selbst tippen).
// Reihenfolge folgt der Lernforschung: Wiedererkennen wärmt auf, erst das eigene
// Produzieren des Begriffs zählt als "sitzt". Tipp-Buchstaben nur als Fallback.
export default function Dojo({ onClose }) {
  const { s, dojo } = useStore();
  const [mode, setMode] = useState(null); // null | "runde" | "duell"

  const mastered = TERMS.filter(t => (s.terms?.[t.id]?.typedOk ?? 0) >= 2).length;

  if (mode === "runde") return <Runde onClose={() => setMode(null)} onExit={onClose} />;
  if (mode === "duell") return <Duell onClose={() => setMode(null)} onExit={onClose} />;

  return (
    <div className="player">
      <div className="ptop">
        <button className="x" onClick={onClose} aria-label="Schließen">✕</button>
        <span style={{ fontWeight: 800 }}>🧠 Begriffs-Dojo</span>
      </div>
      <div className="body">
        <div style={{ margin: "auto 0" }}>
          <p className="sub" style={{ textAlign: "center" }}>
            Fachbegriffe sitzen erst, wenn du sie selbst SAGEN kannst, nicht nur wiedererkennst.
            Deshalb: Eselsbrücke ankern, warm werden, dann den Begriff aus dem Kopf tippen.
          </p>
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <b style={{ fontSize: 14 }}>Getippt gemeistert</b>
              <span className="small muted mono">{mastered}/{TERMS.length}</span>
            </div>
            <div className="pbar"><i style={{ width: (mastered / TERMS.length * 100) + "%", background: "var(--purple)" }} /></div>
            <p className="small muted" style={{ marginTop: 8 }}>Gemeistert heißt: zweimal ohne Hilfe selbst getippt.</p>
          </div>
          <button className="btn" style={{ background: "var(--purple)", marginBottom: 10 }}
            onClick={() => setMode("runde")}>
            🧠 Begriffs-Runde · 4 Begriffe, 3 Stufen
          </button>
          <button className="btn sec" onClick={() => setMode("duell")}>
            ⚔️ Kontrast-Duell · Verwechslungspaare knacken
          </button>
          <p className="small muted" style={{ marginTop: 14, textAlign: "center" }}>
            Das Duell übt gezielt die fiesen Paare wie Egalitarismus/Prioritarismus, immer direkt nebeneinander.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- Begriffs-Runde: 4 schwächste Begriffe, 3 Stufen ----------
function Runde({ onClose, onExit }) {
  const { s, dojo } = useStore();
  const set = useMemo(() => {
    const scored = shuffle(TERMS).map(t => {
      const st = s.terms?.[t.id] ?? {};
      return { t, score: (st.typedOk ?? 0) * 2 + (st.seen ?? 0) * 0.3 - (st.fails ?? 0) };
    });
    scored.sort((a, b) => a.score - b.score);
    return scored.slice(0, 4).map(x => x.t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [phase, setPhase] = useState(0); // 0 Anker, 1 Zuordnen, 2 Abrufen, 3 fertig
  const [anchorI, setAnchorI] = useState(0);
  const [recallI, setRecallI] = useState(0);
  const [xp, setXp] = useState(0);
  const perfect = useRef(0);

  const progress = phase === 0 ? anchorI / 12 : phase === 1 ? 0.35 : phase === 2 ? 0.5 + recallI / 8 : 1;

  return (
    <div className="player">
      <Confetti on={phase === 3 && perfect.current >= 3} />
      <div className="ptop">
        <button className="x" onClick={onClose} aria-label="Zurück">✕</button>
        <div className="pbar"><i style={{ width: progress * 100 + "%", background: "var(--purple)" }} /></div>
        <span className="small muted">{["Anker", "Zuordnen", "Abrufen", "Fertig"][phase]}</span>
      </div>
      <div className="body">
        {phase === 0 && (
          <AnchorCard t={set[anchorI]}
            onNext={() => anchorI + 1 < set.length ? setAnchorI(anchorI + 1) : setPhase(1)} />
        )}
        {phase === 1 && <Matching set={set} onDone={ok => { setXp(x => x + ok); setPhase(2); }} />}
        {phase === 2 && (
          <Recall key={set[recallI].id} t={set[recallI]}
            onDone={lvl => {
              dojo(set[recallI].id, lvl);
              if (lvl === 2) perfect.current++;
              setXp(x => x + (lvl === 2 ? 4 : lvl === 1 ? 2 : 0));
              recallI + 1 < set.length ? setRecallI(recallI + 1) : setPhase(3);
            }} />
        )}
        {phase === 3 && (
          <div className="lend">
            <div className="big">{perfect.current >= 3 ? "🥋" : "💪"}</div>
            <h1>{perfect.current}/4 aus dem Kopf getippt</h1>
            <div className="xp">+{xp + 5} XP</div>
            <p>{perfect.current >= 3
              ? "Die Begriffe gehören jetzt dir. Morgen nochmal, dann sitzen sie doppelt."
              : "Völlig normal beim ersten Mal. Die Eselsbrücken arbeiten jetzt für dich, beim nächsten Durchgang klappt mehr."}</p>
          </div>
        )}
      </div>
      <div className="foot">
        {phase === 3 && <button className="btn" onClick={onClose}>Weiter</button>}
      </div>
    </div>
  );
}

function AnchorCard({ t, onNext }) {
  return (
    <>
      <div className="ccard">
        <div className="ctag" style={{ color: WCOLOR[t.w] ?? "var(--purple)" }}>
          <span>🧠</span><span>Anker setzen</span>
          <span style={{ marginLeft: "auto" }}>
            <SpeakButton id={"dojo-" + t.id} text={`${t.term}. ${t.kurz} Eselsbrücke: ${t.esel}`} />
          </span>
        </div>
        <h1>{t.term}</h1>
        <p className="klar">{t.kurz}</p>
        {t.wort && <div className="cbsp"><div className="h">Wortbaustein</div><p>{t.wort}</p></div>}
        <div className="eselbox"><div className="h">🧠 Eselsbrücke</div><p>{t.esel}</p></div>
      </div>
      <div style={{ paddingTop: 12 }}>
        <button className="btn" style={{ background: "var(--purple)" }} onClick={onNext}>Anker sitzt, weiter</button>
      </div>
    </>
  );
}

// Aufwärmstufe: Begriff -> Definition zuordnen (Wiedererkennen).
function Matching({ set, onDone }) {
  const [left] = useState(() => shuffle(set));
  const [right] = useState(() => shuffle(set));
  const [selL, setSelL] = useState(null);
  const [done, setDone] = useState({});
  const [wrongFlash, setWrongFlash] = useState(null);
  const [errs, setErrs] = useState(0);

  function pickRight(t) {
    if (selL === null || done[t.id]) return;
    if (t.id === selL) {
      fxCorrect();
      const nd = { ...done, [t.id]: true };
      setDone(nd); setSelL(null);
      if (Object.keys(nd).length === set.length) setTimeout(() => onDone(Math.max(0, 4 - errs)), 500);
    } else {
      fxWrong(); setErrs(e => e + 1);
      setWrongFlash(t.id); setTimeout(() => setWrongFlash(null), 500);
    }
  }

  return (
    <div className="qcard">
      <div className="qmeta"><span className="tag" style={{ background: "#f6f0fc", color: "var(--purple)" }}>Aufwärmen</span>
        <span className="small muted">Begriff antippen, dann die passende Definition</span></div>
      <div className="matchgrid">
        <div>
          {set.map(t => (
            <button key={t.id} disabled={done[t.id]}
              className={"mbtn term" + (selL === t.id ? " sel" : "") + (done[t.id] ? " ok" : "")}
              onClick={() => setSelL(selL === t.id ? null : t.id)}>{t.term}</button>
          ))}
        </div>
        <div>
          {useMemo(() => right, [right]).map(t => (
            <button key={t.id} disabled={done[t.id]}
              className={"mbtn def" + (done[t.id] ? " ok" : "") + (wrongFlash === t.id ? " bad" : "")}
              onClick={() => pickRight(t)}>{kdef(t)}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Abruf-Stufe: Definition sehen, Begriff SELBST tippen. Buchstaben-Tipps nur als Fallback.
function Recall({ t, onDone }) {
  const [val, setVal] = useState("");
  const [hints, setHints] = useState(0); // 0 keine, 1 erster Buchstabe, 2 halbes Wort
  const [state, setState] = useState("ask"); // ask | right | solved
  const [wrongOnce, setWrongOnce] = useState(false);

  const hintText = hints === 0 ? null
    : hints === 1 ? t.term.slice(0, 1) + "…"
    : t.term.slice(0, Math.ceil(t.term.length / 2)) + "…";

  function check() {
    if (answerMatches(val, t)) {
      fxCorrect(); setState("right");
    } else {
      fxWrong(); setWrongOnce(true);
      if (hints < 2) setHints(h => h + 1); // gescheiterter Versuch schaltet den nächsten Tipp frei
    }
  }

  return (
    <div className="qcard">
      <div className="qmeta"><span className="tag" style={{ background: "#f6f0fc", color: "var(--purple)" }}>Abrufen</span>
        <span className="small muted">Wie heißt der Begriff? Selbst tippen zählt doppelt.</span></div>
      <div className="these" style={{ fontSize: 16.5 }}>{t.kurz}</div>
      {wrongOnce && state === "ask" && <p className="hint">🧠 {t.esel}</p>}
      {hintText && state === "ask" && <p style={{ marginTop: 10, fontWeight: 800, letterSpacing: 2, color: "var(--purple)" }}>{hintText}</p>}

      {state === "ask" ? (
        <div className="answerbox">
          <textarea rows={1} style={{ minHeight: 52 }} value={val} autoFocus
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); check(); } }}
            placeholder="Begriff eintippen …" aria-label="Begriff eingeben" />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn" style={{ background: "var(--purple)" }} onClick={check}>Prüfen</button>
            <button className="btn sec" style={{ width: "auto", padding: "14px 16px" }}
              onClick={() => hints < 2 ? setHints(h => h + 1) : setState("solved")}>
              {hints < 2 ? "Tipp" : "Auflösen"}
            </button>
          </div>
        </div>
      ) : (
        <div className={"reveal " + (state === "right" ? "good" : "bad")}>
          <div className="verdict" style={{ color: state === "right" ? "var(--ok)" : "var(--no)" }}>
            {state === "right" ? (hints === 0 ? "Aus dem Kopf! 🥋" : "Richtig, mit Anlauf") : t.term}
          </div>
          <p><b>{t.term}</b> — {t.kurz}</p>
          <p className="small muted" style={{ marginTop: 6 }}>🧠 {t.esel}</p>
          <div className="sr3" style={{ gridTemplateColumns: "1fr" }}>
            <button onClick={() => onDone(state === "solved" ? 0 : hints === 0 ? 2 : 1)}>Weiter</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Kontrast-Duell: Verwechslungspaare nebeneinander ----------
function Duell({ onClose, onExit }) {
  const { quickXp } = useStore();
  const [pair] = useState(() => shuffle(PAIRS)[0]);
  const [items] = useState(() => shuffle(pair.items));
  const [i, setI] = useState(-1); // -1 = Kontrastkarte
  const [picked, setPicked] = useState(null);
  const [hits, setHits] = useState(0);
  const [done, setDone] = useState(false);

  const item = i >= 0 ? items[i] : null;

  function pick(side) {
    if (picked) return;
    const ok = side === item.ans;
    setPicked({ side, ok });
    (ok ? fxCorrect : fxWrong)();
    if (ok) setHits(h => h + 1);
  }
  function next() {
    setPicked(null);
    if (i + 1 < items.length) setI(i + 1);
    else { quickXp(hits * 2 + 3); setDone(true); }
  }

  return (
    <div className="player">
      <Confetti on={done && hits === items.length} />
      <div className="ptop">
        <button className="x" onClick={onClose} aria-label="Zurück">✕</button>
        <div className="pbar"><i style={{ width: ((i + 1) / (items.length + 1)) * 100 + "%", background: "var(--warn)" }} /></div>
        <span className="small muted">⚔️ Duell</span>
      </div>
      <div className="body">
        {done ? (
          <div className="lend">
            <div className="big">{hits === items.length ? "🏆" : "⚔️"}</div>
            <h1>{hits}/{items.length} richtig zugeordnet</h1>
            <div className="xp">+{hits * 2 + 3} XP</div>
            <p>{pair.kontrast}</p>
          </div>
        ) : i === -1 ? (
          <>
            <div className="ccard">
              <div className="ctag" style={{ color: "var(--warn)" }}><span>⚔️</span><span>Verwechslungspaar</span></div>
              <h1 style={{ fontSize: 21 }}>{pair.a} vs. {pair.b}</h1>
              <div className="eselbox"><div className="h">Der Unterschied in einem Satz</div><p>{pair.kontrast}</p></div>
              <p className="small muted">Gleich kommen vier Aussagen. Tippe jeweils, zu wem sie gehört.</p>
            </div>
            <div style={{ paddingTop: 12 }}>
              <button className="btn" style={{ background: "var(--warn)" }} onClick={() => setI(0)}>Los geht's</button>
            </div>
          </>
        ) : (
          <div className="qcard">
            <div className="qmeta"><span className="tag" style={{ background: "#fdf3e2", color: "#b57708" }}>Aussage {i + 1}/{items.length}</span></div>
            <div className="these" style={{ fontSize: 17 }}>{item.t}</div>
            <div className="tf" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <button className={picked ? (item.ans === "a" ? "hit" : picked.side === "a" ? "missed" : "") : ""}
                disabled={!!picked} onClick={() => pick("a")} style={{ fontSize: 13.5 }}>{pair.a}</button>
              <button className={picked ? (item.ans === "b" ? "hit" : picked.side === "b" ? "missed" : "") : ""}
                disabled={!!picked} onClick={() => pick("b")} style={{ fontSize: 13.5 }}>{pair.b}</button>
            </div>
            {picked && (
              <div className={"reveal " + (picked.ok ? "good" : "bad")}>
                <div className="verdict" style={{ color: picked.ok ? "var(--ok)" : "var(--no)" }}>
                  {picked.ok ? "Richtig" : "Gehört zu: " + (item.ans === "a" ? pair.a : pair.b)}
                </div>
                {!picked.ok && <p className="small">{pair.kontrast}</p>}
                <div className="sr3" style={{ gridTemplateColumns: "1fr" }}>
                  <button onClick={next}>Weiter</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
