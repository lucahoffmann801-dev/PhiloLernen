# PhiloLernen

Lern-App für die Klausur „Einführung in die Angewandte Ethik" (Prof. Gesang, Uni Mannheim, 31.08.2026).

## Stack
- Vite + React (SPA, kein Router, kein SSR)
- Supabase (Tabelle `progress`) für Fortschritts-Sync zwischen Geräten via Sync-Code
- Fallback: localStorage, die App funktioniert auch komplett offline

## Entwickeln
```
npm install
npm run dev
```

## Deploy
Push auf main → Vercel baut automatisch (Framework-Preset: Vite).

## Inhalte
- `src/data/content.js` – Kapitel, Lektionen, Konzeptkarten, Nachschlagewerk
- `src/data/questions.js` – Fragenpool im Klausurformat (Wahr/Falsch + Ein-Satz-Fragen)
- `src/data/meta.js` – Lernplan, Philosophen, Verbindungen, Klausurformat

Quellen: Klausurübersicht + Klausurhinweise + Merkblatt (Prof. Gesang) sowie der
Gastvortrag „KI-Ethik" (Sebastian Zezulka, 13.05.2026). Noch offen: VL 10
Klimaethik-Vertiefung Teil 1/2 und VL 11 Demokratie (Folien lagen bei Redaktion
nicht in lesbarer Form vor).
