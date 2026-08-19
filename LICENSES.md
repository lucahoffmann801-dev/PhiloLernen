# Lizenzen der Audio-Inhalte

## Vorlesestimme (Text-to-Speech)
- **Stimme:** `de_DE-thorsten-medium` (Piper / Rhasspy)
- **Datensatz:** Thorsten-Voice-Projekt, https://github.com/thorstenMueller/Thorsten-Voice
- **Lizenz laut MODEL_CARD:** CC0 (Public Domain) — geprüft am 19.08.2026 unter
  https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD
- **Inferenz-Bibliothek:** @mintplex-labs/piper-tts-web (MIT), Piper-Modelle (MIT)
- Das Stimmmodell wird zur Laufzeit von Hugging Face geladen und im OPFS des
  Browsers gespeichert; es liegt nicht in diesem Repository.

## Fokus-Sounds
- **Rauschen (weiß / rosa / braun / braun-sanft):** zur Laufzeit per Web Audio API
  generiert, keine Assets, keine Lizenzfragen.
- **`public/audio/focus-tasten.mp3` („Sanfte Tasten")** und
  **`public/audio/focus-raum.mp3` („Weiter Raum")**: eigens für dieses Projekt
  synthetisch erzeugt (NumPy-Klangsynthese, 19.08.2026). Es wurde kein fremdes
  Material verwendet. Beide Dateien werden hiermit unter **CC0 1.0 Universal**
  (Public Domain Dedication) freigegeben.

Hinweis: Die ursprünglich angedachten Lofi-Tracks von HoliznaCC0 (Album „Public
Domain Lofi", Free Music Archive, CC0) können jederzeit ergänzt werden: MP3 nach
`public/audio/` legen, Eintrag in `LOFI_URLS` in `src/lib/focus.js`, Lizenz hier
dokumentieren. Nichts mit CC BY-NC oder unklarer Lizenz aufnehmen.

## Runtime-Dateien in `public/piper/`
- `ort-wasm*.wasm`: ONNX Runtime Web 1.18.0, MIT-Lizenz (Microsoft)
- `piper_phonemize.wasm` / `.data`: @diffusionstudio/piper-wasm 1.0.0, MIT-Lizenz
