// Vorlesefunktion: Piper (clientseitig, OPFS-Cache) mit stillem Fallback auf
// window.speechSynthesis. Kein Servercall. Läuft komplett unauffällig an.
import { getCtx, nodes, duck, unlock } from "./audio.js";

export const VOICE = "de_DE-thorsten-medium";
const WASM_PATHS = {
  onnxWasm: "/piper/",                            // ORT-Runtime, selbst gehostet
  piperWasm: "/piper/piper_phonemize.wasm",
  piperData: "/piper/piper_phonemize.data",
};

const state = {
  engine: "fallback",        // "fallback" | "piper"
  phase: "idle",             // idle | lade | bereit | fallback-only
  progress: 0,
  playingId: null,
  session: null,
  listeners: new Set(),
};
const wavCache = new Map();  // itemId -> AudioBuffer (zweites Antippen spielt sofort)
const CACHE_MAX = 40;
let currentSource = null;    // AudioBufferSourceNode
let currentUtterance = null; // SpeechSynthesisUtterance

export function subscribe(fn) { state.listeners.add(fn); return () => state.listeners.delete(fn); }
function emit() { state.listeners.forEach(fn => fn(snapshot())); }
export function snapshot() {
  return { engine: state.engine, phase: state.phase, progress: state.progress, playingId: state.playingId };
}

function envSupported() {
  try {
    return typeof WebAssembly !== "undefined" &&
      !!(navigator.storage && navigator.storage.getDirectory) &&
      typeof Worker !== "undefined";
  } catch { return false; }
}

let ttsMod = null;
async function lib() { return ttsMod ??= await import("@mintplex-labs/piper-tts-web"); }

// Hintergrund-Setup ab App-Start: kein Modal, kein Blocker, keine Fehlermeldung.
let initStarted = false;
export async function initBackground() {
  if (initStarted) return; initStarted = true;
  if (!envSupported()) { state.phase = "fallback-only"; emit(); return; }
  try {
    const tts = await lib();
    const stored = await tts.stored().catch(() => []);
    if (!stored.includes(VOICE)) {
      state.phase = "lade"; emit();
      await tts.download(VOICE, p => {
        state.progress = p.total ? p.loaded / p.total : 0;
        emit();
      });
    }
    state.session = await tts.TtsSession.create({ voiceId: VOICE, wasmPaths: WASM_PATHS });
    await state.session.waitReady;
    state.engine = "piper"; state.phase = "bereit"; state.progress = 1; emit();
  } catch {
    // Still weiter mit Fallback; beim nächsten App-Start automatisch neuer Versuch.
    state.phase = "fallback-only"; emit();
  }
}

// ---- Fallback: speechSynthesis, Stimme über voiceschanged mit Timeout ----
let voicePromise = null;
function getGermanVoice() {
  voicePromise ??= new Promise(resolve => {
    const synth = window.speechSynthesis;
    if (!synth) return resolve(null);
    const pick = () => {
      const vs = synth.getVoices();
      return vs.find(v => v.lang === "de-DE") || vs.find(v => (v.lang || "").startsWith("de")) || null;
    };
    const now = pick();
    if (now) return resolve(now);
    const t = setTimeout(() => resolve(pick()), 1500);
    synth.addEventListener("voiceschanged", () => { clearTimeout(t); resolve(pick()); }, { once: true });
  });
  return voicePromise;
}

export function stop() {
  if (currentSource) { try { currentSource.onended = null; currentSource.stop(); } catch {} currentSource = null; }
  if (window.speechSynthesis && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
  if (state.playingId) { state.playingId = null; duck(false); emit(); }
}

// Es läuft immer nur ein Vorlese-Audio: neues Play stoppt das alte.
export async function speak(id, text, rate = 1) {
  if (state.playingId === id) { stop(); return; }   // Toggle: Play -> Stop
  stop();
  unlock();
  state.playingId = id; emit();
  duck(true);
  const done = () => { if (state.playingId === id) { state.playingId = null; duck(false); emit(); } };

  if (state.engine === "piper" && state.session) {
    try {
      let buf = wavCache.get(id);
      if (!buf) {
        const blob = await state.session.predict(text);
        const arr = await blob.arrayBuffer();
        buf = await getCtx().decodeAudioData(arr);
        if (wavCache.size >= CACHE_MAX) wavCache.delete(wavCache.keys().next().value);
        wavCache.set(id, buf);
      }
      if (state.playingId !== id) return;           // inzwischen gestoppt/ersetzt
      const src = getCtx().createBufferSource();
      src.buffer = buf; src.playbackRate.value = rate;
      src.connect(nodes.speech);
      src.onended = done;
      currentSource = src;
      src.start();
      return;
    } catch { /* still zum Fallback dieser einen Wiedergabe */ }
  }

  // Fallback: nur nach Nutzerinteraktion aufgerufen (Button-Tap), also erlaubt.
  try {
    const synth = window.speechSynthesis;
    if (!synth) { done(); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE"; u.rate = rate;
    const v = await getGermanVoice();
    if (v) u.voice = v;
    u.onend = done; u.onerror = done;
    currentUtterance = u;
    if (state.playingId === id) synth.speak(u);
  } catch { done(); }
}
