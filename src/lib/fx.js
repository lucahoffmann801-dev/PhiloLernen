// Mikro-Feedback (richtig/falsch/Level) über die gemeinsame Audio-Ebene.
import { getCtx, nodes } from "./audio.js";

let cfg = { sound: true, haptics: true };
export const setFx = c => { cfg = { ...cfg, ...c }; };

function beep(freqs, dur = 0.09, type = "sine", gain = 0.12) {
  if (!cfg.sound) return;
  try {
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0, ctx.currentTime + i * dur);
      g.gain.linearRampToValueAtTime(gain, ctx.currentTime + i * dur + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 1) * dur + 0.05);
      o.connect(g); g.connect(nodes.fx);
      o.start(ctx.currentTime + i * dur); o.stop(ctx.currentTime + (i + 1) * dur + 0.06);
    });
  } catch {}
}
const vibrate = p => { if (cfg.haptics && navigator.vibrate) try { navigator.vibrate(p); } catch {} };

export const fxCorrect = () => { beep([660, 880]); vibrate(12); };
export const fxWrong = () => { beep([196], 0.14, "triangle", 0.10); vibrate([30, 40, 30]); };
export const fxLevel = () => { beep([523, 659, 784, 1047], 0.09); vibrate([20, 30, 20, 30, 60]); };
