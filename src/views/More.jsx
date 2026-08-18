import React, { useState } from "react";
import { useStore } from "../lib/store.jsx";
import { REF } from "../data/ref.js";
import { FORMAT, PLAN } from "../data/meta.js";

export default function More({ toast }) {
  const [tab, setTab] = useState("ref");
  return (
    <div className="view wrap">
      <div className="chips" style={{ marginBottom: 18 }}>
        {[["ref", "Nachschlagen"], ["plan", "13-Tage-Plan"], ["format", "Klausurformat"], ["sync", "Sync"]].map(([t, l]) => (
          <button key={t} className={"chip" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>
      {tab === "ref" && <Ref />}
      {tab === "plan" && <Plan />}
      {tab === "format" && <Format />}
      {tab === "sync" && <Sync toast={toast} />}
    </div>
  );
}

function Ref() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <h2>Nachschlagewerk</h2>
      <p className="sub">Der komplette Stoff kompakt: Begriffstabellen, Argumentkarten, Vergleiche und Merksätze pro Vorlesung. Zum Nachschlagen, nicht zum Durchlesen am Stück.</p>
      {REF.map((v, i) => (
        <div key={v.id} className={"acc" + (open === i ? " open" : "")}>
          <button onClick={() => setOpen(open === i ? null : i)}>
            <span className="dot" style={{ background: v.hex }} />
            <span style={{ color: v.hex, fontSize: 12, letterSpacing: 1 }}>{v.nr}</span> {v.t}
            <span className="arw">▸</span>
          </button>
          <div className="body">
            <div className="blk"><h4>Zentrale Begriffe</h4>
              <div className="kv">{v.begriffe.map(b => (
                <div className="row" key={b[0]}><b>{b[0]}</b><span>{b[1]}</span></div>))}</div>
            </div>
            <div className="blk"><h4>Argumentkarte</h4>
              <div className="argmap">
                <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>{v.arg.t}</div>
                {v.arg.steps.map((st, j) => (
                  <div key={j} className={"step " + (st.k === 1 ? "k" : st.k === 2 ? "x" : "")}>
                    <span className="pill">{st.p}</span><span className="txt">{st.x}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="blk"><h4>{v.cmp.t}</h4>
              <div className="cmp">
                <div className="col"><h5 style={{ color: v.hex }}>{v.cmp.a.h}</h5>
                  <ul>{v.cmp.a.i.map((x, j) => <li key={j}>{x}</li>)}</ul></div>
                <div className="col"><h5 style={{ color: v.hex }}>{v.cmp.b.h}</h5>
                  <ul>{v.cmp.b.i.map((x, j) => <li key={j}>{x}</li>)}</ul></div>
              </div>
            </div>
            <div className="merke"><b>Merke</b>{v.merke}</div>
          </div>
        </div>
      ))}
    </>
  );
}

function Plan() {
  const { s, toggleCheck } = useStore();
  const start = new Date(2026, 7, 18).getTime();
  const t0 = new Date(); const today = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate()).getTime();
  return (
    <>
      <h2>13 Lerntage bis zur Klausur</h2>
      <p className="sub">Jeder Tag hat ein eigenes Fälligkeitsdatum, damit der 31.08. nie gefühlt weit weg ist. Abhaken erlaubt und erwünscht.</p>
      <div className="card">
        {PLAN.map((p, i) => {
          const dt = start + i * 864e5;
          const cls = dt === today ? "today" : dt < today ? "past" : "";
          return (
            <div key={i} className={"day " + cls}>
              <div className="dbox"><b>{p.d.slice(0, 2)}</b><span>{p.w}</span></div>
              <div>
                <h4>{p.h}{p.m && <span className="mile">{p.m}</span>}</h4>
                <div className="tasks">
                  {p.t.map((t, j) => {
                    const k = i + "-" + j;
                    return (
                      <label key={k}>
                        <input type="checkbox" checked={!!s.checks[k]} onChange={() => toggleCheck(k)} />
                        <span>{t}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Format() {
  return (
    <>
      <h2>Was in der Klausur passiert</h2>
      <p className="sub">Aus dem offiziellen Hinweisblatt von Prof. Gesang.</p>
      {[FORMAT.typ1, FORMAT.typ2].map((t, i) => (
        <div className="card" key={i} style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>{t.title}</h3>
          <p className="small muted">{t.text}</p>
          <div className="merke"><b>Original-Beispiele</b>
            {t.bsp.map((b, j) => (
              <p key={j} style={{ marginTop: j ? 10 : 0 }}>„{b[0]}“ → {b[1]}</p>
            ))}
          </div>
        </div>
      ))}
      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 10 }}>Rahmenbedingungen</h3>
        <ul style={{ listStyle: "none", display: "grid", gap: 8 }}>
          {FORMAT.regeln.map((r, i) => <li key={i} className="small muted">→ {r}</li>)}
        </ul>
      </div>
    </>
  );
}

function Sync({ toast }) {
  const { s, setSyncCode, genAndSetCode, reset, syncState } = useStore();
  const [val, setVal] = useState(s.syncCode ?? "");
  return (
    <>
      <h2>Geräte-Sync</h2>
      <p className="sub">Ein Sync-Code verbindet Laptop und Handy: gleicher Code, gleicher Fortschritt. Ohne Code bleibt alles nur auf diesem Gerät gespeichert.</p>
      <div className="card" style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 15 }}>Dein Sync-Code</h3>
        <div className="syncbox">
          <input value={val} onChange={e => setVal(e.target.value)} placeholder="z. B. luca-k3m9x2p4w7" />
          <button className="btn sec" style={{ width: "auto", padding: "10px 16px" }}
            onClick={() => { setSyncCode(val); toast(val.trim() ? "Sync aktiv. Gleichen Code am anderen Gerät eingeben." : "Sync aus."); }}>
            Verbinden
          </button>
        </div>
        {!s.syncCode && (
          <button className="btn" style={{ marginTop: 10 }}
            onClick={() => { const c = genAndSetCode(); setVal(c); toast("Code erzeugt und aktiviert."); }}>
            Neuen Code erzeugen
          </button>
        )}
        <p className="small muted" style={{ marginTop: 10 }}>
          Status: {s.syncCode ? (syncState === "ok" ? "verbunden ✓" : syncState === "lade" ? "lädt …" : syncState === "fehler" ? "Verbindungsfehler, lokal gespeichert" : "aktiv") : "aus"}
        </p>
      </div>
      <div className="card">
        <h3 style={{ fontSize: 15, marginBottom: 8 }}>Gefahrenzone</h3>
        <button className="btn ghost" onClick={() => { if (confirm("Wirklich allen Fortschritt löschen?")) { reset(); toast("Zurückgesetzt."); } }}>
          Fortschritt zurücksetzen
        </button>
      </div>
    </>
  );
}
