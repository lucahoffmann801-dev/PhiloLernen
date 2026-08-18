import React, { useState } from "react";
import { THREADS } from "../data/meta.js";
import { PHILS } from "../data/ref.js";

export default function Threads() {
  const [open, setOpen] = useState(THREADS[0].id);
  const [philOpen, setPhilOpen] = useState(false);

  return (
    <div className="view wrap">
      <h2>Roter Faden</h2>
      <p className="sub">Die Klausur fragt Zusammenhänge, keine Details. Hier siehst du, wie dieselben Ideen quer durch die Vorlesungen wandern. Wer die Fäden kennt, kann jede These einsortieren.</p>

      {THREADS.map(t => {
        const isOpen = open === t.id;
        return (
          <div key={t.id} className={"fadecard" + (isOpen ? " open" : "")}>
            <button className="head" onClick={() => setOpen(isOpen ? null : t.id)}>
              <span className="ic">{t.emoji}</span>
              <span className="tt"><b>{t.title}</b><span>{t.sub}</span></span>
              <span className="arw" style={{ color: "var(--tx3)" }}>{isOpen ? "▾" : "▸"}</span>
            </button>
            <div className="bd">
              <div className="chain">
                {t.nodes.map((n, i) => (
                  <div className="node" key={i}>
                    <div className="nb">
                      <span className="pt" style={{ borderColor: "var(--acc)", background: i === 0 ? "var(--acc)" : "transparent" }} />
                      {i < t.nodes.length - 1 && <span className="ln" />}
                    </div>
                    <div className="nx">
                      <span className="w">{n.w}</span>
                      <b> · {n.t}</b>
                      <p>{n.p}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      <div className={"fadecard" + (philOpen ? " open" : "")} style={{ marginTop: 20 }}>
        <button className="head" onClick={() => setPhilOpen(!philOpen)}>
          <span className="ic">🧑‍🏫</span>
          <span className="tt"><b>Alle Philosophen auf einen Blick</b><span>Wer, welche Theorie, wo relevant</span></span>
          <span className="arw" style={{ color: "var(--tx3)" }}>{philOpen ? "▾" : "▸"}</span>
        </button>
        <div className="bd">
          <div className="kv" style={{ marginTop: 12 }}>
            {PHILS.map(p => (
              <div className="row" key={p[0]}>
                <b>{p[0]}<br /><span style={{ fontWeight: 500, fontSize: 11.5, color: "var(--tx3)" }}>{p[1]} · {p[3]}</span></b>
                <span>{p[2]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
