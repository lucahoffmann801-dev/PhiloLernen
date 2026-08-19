// Fokus-Sound: generiertes Rauschen (weiß/rosa/braun/sanft) + Ambient-Loops.
// Loops laufen über Fragenwechsel hinweg durch; Start immer erst nach Antippen.
import { getCtx, nodes, setFocusActive, setFocusVolume, unlock } from "./audio.js";

export const FOCUS_OPTIONS = [
  { id: "off",   emoji: "🔇", label: "Aus",              sub: "Standard" },
  { id: "brown", emoji: "🟤", label: "Braunes Rauschen", sub: "tief und gleichmäßig" },
  { id: "soft",  emoji: "🤎", label: "Braun, sanft",     sub: "extra weich, wenig Zischen" },
  { id: "pink",  emoji: "🌸", label: "Rosa Rauschen",    sub: "ausgewogen" },
  { id: "white", emoji: "⚪", label: "Weißes Rauschen",  sub: "hell, wie Radiorauschen" },
  { id: "lofi1", emoji: "🎹", label: "Sanfte Tasten",    sub: "ruhiger Ambient-Loop" },
  { id: "lofi2", emoji: "🌌", label: "Weiter Raum",      sub: "warmer Drone-Loop" },
];
const LOFI_URLS = { lofi1: "/audio/focus-tasten.mp3", lofi2: "/audio/focus-raum.mp3" };

let current = { id: "off", source: null };
let filterNode = null;
const bufCache = new Map();
const listeners = new Set();
export const onFocusChange = fn => { listeners.add(fn); return () => listeners.delete(fn); };
export const focusState = () => current.id;
function emit() { listeners.forEach(fn => fn(current.id)); }

// ~10s Rausch-Buffer, einmal erzeugt, dann als Loop. Kein ScriptProcessorNode.
function makeNoiseBuffer(kind) {
  const ctx = getCtx();
  const len = ctx.sampleRate * 10;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    if (kind === "white") {
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    } else if (kind === "pink") {
      // Paul-Kellet-Filter auf weißem Rauschen
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.96900 * b2 + w * 0.1538520;
        b3 = 0.86650 * b3 + w * 0.3104856;
        b4 = 0.55000 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.0168980;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    } else { // brown: integriertes weißes Rauschen
      let last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
    }
    // Loop-Naht glätten (kurzes Crossfade)
    const x = Math.floor(ctx.sampleRate * 0.05);
    for (let i = 0; i < x; i++) {
      const f = i / x;
      d[i] = d[i] * f + d[len - x + i] * (1 - f);
    }
  }
  return buf;
}

async function getBuffer(id) {
  if (bufCache.has(id)) return bufCache.get(id);
  let buf;
  if (LOFI_URLS[id]) {
    const res = await fetch(LOFI_URLS[id]);
    buf = await getCtx().decodeAudioData(await res.arrayBuffer());
  } else {
    buf = makeNoiseBuffer(id === "soft" ? "brown" : id);
  }
  bufCache.set(id, buf);
  return buf;
}

export function stopFocus() {
  setFocusActive(false); // sanfte Rampe auf 0 …
  const old = current.source;
  current = { id: "off", source: null };
  if (old) setTimeout(() => { try { old.stop(); } catch {} }, 400); // … dann erst stoppen
  emit();
}

// Nur nach Nutzergeste aufrufen (Button-Tap im Sheet).
export async function playFocus(id, volume) {
  if (id === "off") { stopFocus(); return; }
  unlock();
  const buf = await getBuffer(id);
  const ctx = getCtx();
  if (current.source) { try { current.source.stop(); } catch {} }
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  if (id === "soft") {
    filterNode = ctx.createBiquadFilter();
    filterNode.type = "lowpass"; filterNode.frequency.value = 400; filterNode.Q.value = 0.5;
    src.connect(filterNode); filterNode.connect(nodes.focus);
  } else {
    src.connect(nodes.focus);
  }
  src.start();
  current = { id, source: src };
  setFocusVolume(volume);
  setFocusActive(true);
  emit();
}
