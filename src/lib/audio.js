// Gemeinsame Audio-Ebene: EIN AudioContext als Singleton außerhalb von React.
// Getrennte GainNodes für Sprache und Fokus-Sound, Ducking über sanfte Rampen.
let ctx = null;
let speechGain = null, focusGain = null, fxGain = null;
let focusBaseVol = 0.5;     // gewünschte Fokus-Lautstärke (0..1)
let focusActive = false;    // spielt gerade ein Fokus-Sound?
let ducked = false;         // Sprache aktiv -> Fokus leiser

export function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    speechGain = ctx.createGain(); speechGain.gain.value = 1;
    focusGain = ctx.createGain(); focusGain.gain.value = 0;
    fxGain = ctx.createGain(); fxGain.gain.value = 1;
    speechGain.connect(ctx.destination);
    focusGain.connect(ctx.destination);
    fxGain.connect(ctx.destination);
  }
  return ctx;
}
export const nodes = {
  get speech() { getCtx(); return speechGain; },
  get focus() { getCtx(); return focusGain; },
  get fx() { getCtx(); return fxGain; },
};

// iOS: Audio erst nach Nutzergeste. Beim ersten Tap einmal aufsperren.
export function unlock() {
  const c = getCtx();
  if (c.state === "suspended") c.resume().catch(() => {});
}
if (typeof document !== "undefined") {
  const once = () => { unlock(); document.removeEventListener("pointerdown", once); };
  document.addEventListener("pointerdown", once, { passive: true });
}

function applyFocusGain() {
  const c = getCtx();
  const target = focusActive ? focusBaseVol * (ducked ? 0.25 : 1) : 0;
  const g = focusGain.gain;
  g.cancelScheduledValues(c.currentTime);
  g.setValueAtTime(g.value, c.currentTime);
  g.linearRampToValueAtTime(target, c.currentTime + 0.3); // nie hart an/aus
}
export function setFocusActive(on) { focusActive = on; applyFocusGain(); }
export function setFocusVolume(v) { focusBaseVol = Math.max(0, Math.min(1, v)); applyFocusGain(); }
export function duck(on) { ducked = on; applyFocusGain(); }
