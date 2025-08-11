# Wompify

Replace every verb with “womp” — but make it tense-aware and case-matched. Chrome extension. Minimal. Mischievous. Womptastic.

- walked → womped
- RUNNING → WOMPING
- Run → Womp

## Why?

Because verbs are serious. Wompify makes them less so. It’s a compact sandbox for DOM mutation, offline lexical mapping, and delightfully dumb linguistic mischief.

## Features

- 🧠 Tense-aware replacement:  
  Maps `-ed`, `-ing`, `-s/es`, and common irregular verbs to `womped`, `womping`, `womps`, etc.

- 🎩 Case preservation:  
  Keeps original case — ALL CAPS, Title Case, or lowercase.

- 🖌️ Styled and swappable:  
  Verbs are wrapped in bold, underlined `<span>` elements. Hover to reveal the original word.

- 🛡️ Sensible guardrails:  
  Skips inputs, textareas, code blocks, editable regions, and secure domains like banking or docs.

- 🧨 Manual activation:  
  Click the “WOMPIFY!” button that floats in the corner. No background script or auto-run.

## Install (Dev mode)

1. Clone this repo
2. Run: `npm i`
3. Build with Vite: `npm run build`
4. Go to `chrome://extensions` → Enable Dev Mode → “Load unpacked” → select `dist/`

## Usage

- Navigate to any webpage
- Click “WOMPIFY!” in the top-right corner
- Verbs get womped.
- Hover any womped word to swap back to the original

## Design choices

- Uses a curated list of common verbs with suffix heuristics and basic case mapping.
- Morphology only — no heavy NLP or sentence parsing.
- Replacements happen in the DOM via span injection; nothing breaks layout.
- Offline-only. No tracking. All logic runs locally.

## Roadmap

- Womp‑O‑Meter slider (probabilistic replacement)
- Per‑site toggle and autosettings
- Expanded verb list (contributions welcome)
- Optional keyboard shortcut
- Light/dark theme options

## Contributing

- Want to add more verbs? Extend `src/verbs.ts`
- Bug or idea? Open an issue or pull request
- Stay playful, stay lightweight

## License

MIT © Brandon Werner 2025

## A.I. Disclosure

Developed with assistance from Copilot
