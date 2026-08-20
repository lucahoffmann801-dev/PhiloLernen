import React, { useMemo, useState } from "react";
import { TERMS, PAIRS } from "../data/begriffe.js";
import { PHILS } from "../data/ref.js";
import { WORLDS } from "../data/content.js";
import { norm } from "../lib/esel.js";
import SpeakButton from "../lib/SpeakButton.jsx";
import { COMPARES, CASES } from "../data/vergleiche.js";

const WMAP = Object.fromEntries(WORLDS.map(w => [w.id, w]));
const wname = id => WMAP[id] ? (WMAP[id].nr === "GV" ? "Gastvortrag" : "Kapitel " + WMAP[id].nr) : "";
const wcolor = id => WMAP[id]?.color ?? "var(--acc)";

// Beispiel ("Stell dir vor") aus den Konzeptkarten zum Begriff finden.
const CARD_BY_TERM = (() => {
  const map = {};
  WORLDS.forEach(w => w.lessons.forEach(l => l.cards.forEach(c => { map[norm(c.term)] = c; })));
  return term => {
    const k = norm(term.term);
    if (map[k]) return map[k];
    // tolerante Suche: Kartenname enthält den Begriff
    const hit = Object.keys(map).find(key => key.includes(k) || k.includes(key));
    return hit ? map[hit] : null;
  };
})();

// Verwechslungspartner aus den Kontrastpaaren.
function partnerOf(term) {
  for (const p of PAIRS) {
    if (norm(p.a) === norm(term.term)) return { partner: p.b, kontrast: p.kontrast };
    if (norm(p.b) === norm(term.term)) return { partner: p.a, kontrast: p.kontrast };
  }
  return null;
}

// Lexikon: jeder Fachbegriff als schöner Steckbrief. Suchen, filtern, antippen.
export default function Lexikon() {
  const [sub, setSub] = useState("begriffe");
  const [query, setQuery] = useState("");
  const [wf, setWf] = useState(null);
  const [openId, setOpenId] = useState(null);

  const list = useMemo(() => {
    let ts = [...TERMS].sort((a, b) => a.term.localeCompare(b.term, "de"));
    if (wf) ts = ts.filter(t => t.w === wf);
    const q = norm(query);
    if (q) ts = ts.filter(t =>
      norm(t.term).includes(q) || norm(t.kurz).includes(q) || norm(t.esel).includes(q) ||
      (t.aka ?? []).some(a => norm(a).includes(q)));
    return ts;
  }, [query, wf]);

  const openTerm = TERMS.find(t => t.id === openId);

  return (
    <>
      <h2>Lexikon</h2>
      <div className="subseg" role="tablist">
        {[["begriffe", "Begriffe"], ["vergleiche", "Vergleiche"], ["koepfe", "Köpfe"]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={sub === k}
            className={sub === k ? "on" : ""} onClick={() => setSub(k)}>{l}</button>
        ))}
      </div>

      {sub === "vergleiche" && <Vergleiche />}
      {sub === "koepfe" && (
        <>
          <p className="sub">Alle {PHILS.length} Denkerinnen und Denker mit Theorie und Schlüsselidee.</p>
          <div className="lexgrid">
            {PHILS.map(p => (
              <div key={p[0]} className="lexcard" style={{ "--wc": "var(--purple)", cursor: "default" }}>
                <span className="lexletter" aria-hidden="true">{p[0].split(" ").pop()[0]}</span>
                <b>{p[0]}</b>
                <span className="lexdef">{p[2]}</span>
                <span className="lexchip" style={{ color: "var(--purple)" }}>{p[1]} · {p[3]}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {sub === "begriffe" && <>
      <p className="sub">Alle {TERMS.length} Fachbegriffe als Steckbriefe: kurz erklärt, mit Wortbaustein, Eselsbrücke und Verwechslungswarnung. Antippen für die volle Karte.</p>

      <input className="lexsearch" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="🔍 Begriff, Definition oder Eselsbrücke suchen …" aria-label="Lexikon durchsuchen" />

      <div className="chips" style={{ margin: "10px 0 14px" }}>
        <button className={"chip" + (!wf ? " on" : "")} onClick={() => setWf(null)}>Alle</button>
        {WORLDS.filter(w => TERMS.some(t => t.w === w.id)).map(w => (
          <button key={w.id} className={"chip" + (wf === w.id ? " on" : "")}
            style={wf === w.id ? { background: w.color, borderColor: w.color } : { color: w.color }}
            onClick={() => setWf(wf === w.id ? null : w.id)}>{w.nr === "GV" ? "GV" : w.nr}</button>
        ))}
      </div>

      {list.length === 0 && <div className="card empty"><b>Nichts gefunden.</b>Anders schreiben oder Filter lösen.</div>}

      <div className="lexgrid">
        {list.map(t => (
          <button key={t.id} className="lexcard" style={{ "--wc": wcolor(t.w) }}
            onClick={() => setOpenId(t.id)}>
            <span className="lexletter" aria-hidden="true">{t.term[0]}</span>
            <b>{t.term}</b>
            <span className="lexdef">{t.kurz}</span>
            <span className="lexchip" style={{ color: wcolor(t.w) }}>{wname(t.w)}</span>
          </button>
        ))}
      </div>

      </>}

      {openTerm && <TermSheet t={openTerm} onClose={() => setOpenId(null)} />}
    </>
  );
}

// Vergleiche: dieselben Dinge nebeneinander. Aufklappbare Gegenüberstellungen,
// pro Merkmal ein Block, pro Position eine farbcodierte Zeile — kein Gequetsche.
function Vergleiche() {
  const [open, setOpen] = useState(COMPARES[0].id);
  return (
    <>
      <p className="sub">Einzeln ist alles schwerer zu verstehen als im Kontrast. Hier stehen die Dinge nebeneinander, Merkmal für Merkmal.</p>
      {COMPARES.map(c => {
        const isOpen = open === c.id;
        return (
          <div key={c.id} className={"fadecard" + (isOpen ? " open" : "")}>
            <button className="head" onClick={() => setOpen(isOpen ? null : c.id)}>
              <span className="ic">{c.emoji}</span>
              <span className="tt"><b>{c.title}</b><span>{c.w} · {c.items.length} im Vergleich</span></span>
              <span className="arw" style={{ color: "var(--tx3)" }}>{isOpen ? "▾" : "▸"}</span>
            </button>
            <div className="bd">
              <p className="small muted" style={{ margin: "12px 0 4px" }}>{c.intro}</p>
              <div className="vslegend">
                {c.items.map(it => (
                  <span key={it.n} className="vsitem" style={{ "--wc": it.c }}>{it.n}</span>
                ))}
              </div>
              {c.attrs.map(a => (
                <div className="vsblock" key={a.label}>
                  <h4>{a.label}</h4>
                  {a.vals.map((v, i) => (
                    <div className="vsrow" key={i}>
                      <span className="vsdot" style={{ background: c.items[i].c }} aria-hidden="true" />
                      <span className="vsname" style={{ color: c.items[i].c }}>{c.items[i].n}</span>
                      <span className="vsval">{v}</span>
                    </div>
                  ))}
                </div>
              ))}
              <CaseLens c={c} />
              {c.merke && <div className="merke"><b>Merke</b>{c.merke}</div>}
            </div>
          </div>
        );
      })}
    </>
  );
}

// Ein Fall, alle Blickwinkel: ein wählbares Beispiel, durch jede Position
// betrachtet. Immer nur EIN Fall sichtbar — Chips schalten um, nichts erschlägt.
function CaseLens({ c }) {
  const cases = CASES[c.id];
  const [sel, setSel] = useState(0);
  if (!cases || !cases.length) return null;
  const f = cases[Math.min(sel, cases.length - 1)];
  return (
    <div className="fallbox">
      <h4><span aria-hidden="true">🔍</span> Ein Fall, alle Blickwinkel</h4>
      <div className="fallchips" role="tablist" aria-label="Fallbeispiel wählen">
        {cases.map((k, i) => (
          <button key={k.name} role="tab" aria-selected={i === sel}
            className={"fallchip" + (i === sel ? " on" : "")}
            onClick={() => setSel(i)}>{k.name}</button>
        ))}
      </div>
      {f.desc && <p className="falldesc">{f.desc}</p>}
      <div className="fallviews">
        {f.views.map((v, i) => (
          <div className="vsrow" key={c.items[i].n}>
            <span className="vsdot" style={{ background: c.items[i].c }} aria-hidden="true" />
            <span className="vsname" style={{ color: c.items[i].c }}>{c.items[i].n}</span>
            <span className="vsval">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Der Steckbrief: alles über einen Begriff an einem Ort.
function TermSheet({ t, onClose }) {
  const card = CARD_BY_TERM(t);
  const pair = partnerOf(t);
  const speak = `${t.term}. ${t.kurz} ${t.wort ? "Wortherkunft: " + t.wort + "." : ""} Eselsbrücke: ${t.esel}`;
  return (
    <>
      <div className="sheetbg" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label={t.term} style={{ maxHeight: "82vh", overflowY: "auto" }}>
        <div className="grab" />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="tag" style={{ background: wcolor(t.w) + "22", color: wcolor(t.w) }}>{wname(t.w)}</span>
            <h2 style={{ marginTop: 8 }}>{t.term}</h2>
          </div>
          <SpeakButton id={"lex-" + t.id} text={speak} />
        </div>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, margin: "10px 0 14px" }}>{t.kurz}</p>
        {t.wort && (
          <div className="cbsp" style={{ marginBottom: 12 }}>
            <div className="h">Wortbaustein</div><p>{t.wort}</p>
          </div>
        )}
        <div className="eselbox" style={{ marginBottom: 12 }}>
          <div className="h">🧠 Eselsbrücke</div><p>{t.esel}</p>
        </div>
        {card?.bsp && (
          <div className="cbsp" style={{ marginBottom: 12, background: "#fdf3e2", borderLeftColor: "var(--gold)" }}>
            <div className="h" style={{ color: "#b57708" }}>Stell dir vor</div>
            <p style={{ color: "#6b5117" }}>{card.bsp}</p>
          </div>
        )}
        {pair && (
          <div className="warnpair">
            <div className="h">⚔️ Nicht verwechseln mit: {pair.partner}</div>
            <p>{pair.kontrast}</p>
          </div>
        )}
        <button className="btn sec" style={{ marginTop: 14 }} onClick={onClose}>Schließen</button>
      </div>
    </>
  );
}
