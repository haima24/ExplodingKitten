# Asset and font licences

Every asset shipped with the client must be listed here with its origin and licence.

| Asset | Origin | Licence |
| --- | --- | --- |
| Baloo 2 (headings, buttons) | npm package `@fontsource/baloo-2`, Latin and Vietnamese subsets, self-hosted | SIL Open Font License 1.1 |
| Nunito (body text) | npm package `@fontsource/nunito`, Latin and Vietnamese subsets, self-hosted | SIL Open Font License 1.1 |
| `public/favicon.svg` | Drawn for this project | Project original |
| Card icons, cat and robot avatars, logo | Original inline SVG drawn for this project (`features/game/art/CardIcon.tsx`, `AvatarArt.tsx`, `components/common/Logo.tsx`). Redrawn in 1.0.2 (US-068): Skip, Attack, Favor and a bigger Exploding Kitten burst. Simple flat shapes; replace with commissioned illustrations later (UI/UX section A3) | Project original |
| Explosion and trophy animation art (bomb, blast, trophy, confetti) | Original inline SVG and CSS drawn for this project (`features/game/art/AnimArt.tsx`, US-069) | Project original |
| Confetti and a few decorative glyphs | Unicode emoji rendered by the visitor's system font (no files shipped) | n/a |
| Sound effects (one per card, warning, timeout; new in 1.0.2: fuse, bigger blast, skip, attack and favor sounds) | Generated at runtime with the Web Audio API (no audio files) | Project original |
| Spoken lines (English and Vietnamese), `public/voice/` | 46 small MP3 (six Vietnamese lines re-made in 1.0.2: V06, V06a, V07, V08, V10, V13) files rendered by `scripts/generate-voice.py` with Microsoft neural voices (`en-US-JennyNeural`, `vi-VN-HoaiMyNeural`) through the `edge-tts` package. Text is project original; Vietnamese wording is a draft for native review | **Check Microsoft's terms before a commercial release**, or replace the files with recordings or licensed audio (same file names) |
| `qrcode-generator` | npm package, loaded lazily when the host shows a QR code | MIT |

No asset is loaded from a third-party origin.

## Naming note

Card names (Exploding Kitten, Defuse, Skip, See the Future, Shuffle, Attack, Favor, Cat cards) follow the Exploding Kittens set by product-owner decision. No Exploding Kittens artwork, logo, or card text is used. A trademark check is still advised before any public release (OQ-01).
