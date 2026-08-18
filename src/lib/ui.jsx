import React, { useEffect, useState } from "react";

export function Ring({ size = 56, stroke = 7, pct = 0, color = "var(--acc)", children }) {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg3)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - Math.min(1, pct))}
          style={{ transition: "stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div className="cen">{children}</div>
    </div>
  );
}

export function Confetti({ on }) {
  if (!on) return null;
  const bits = Array.from({ length: 60 }, (_, i) => {
    const colors = ["#7aa2ff","#4ecdc4","#ffd166","#ff8fa3","#c792ea","#8ce99a"];
    return <i key={i} style={{
      left: Math.random()*100 + "%",
      background: colors[i % colors.length],
      animationDuration: 1.6 + Math.random()*1.6 + "s",
      animationDelay: Math.random()*0.4 + "s",
      width: 6+Math.random()*7, height: 6+Math.random()*7,
    }} />;
  });
  return <div className="confetti">{bits}</div>;
}

export function useToast() {
  const [msg, setMsg] = useState(null);
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(null), 3000); return () => clearTimeout(t); }, [msg]);
  const node = <div className={"toast" + (msg ? " on" : "")}>{msg}</div>;
  return [node, setMsg];
}

export function Countdown() {
  const [, force] = useState(0);
  useEffect(() => { const t = setInterval(() => force(x => x+1), 30000); return () => clearInterval(t); }, []);
  return null;
}
