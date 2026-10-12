# Asset and font licences

Every asset shipped with the client must be listed here with its origin and licence.

| Asset | Origin | Licence |
| --- | --- | --- |
| Baloo 2 (headings, buttons) | npm package `@fontsource/baloo-2`, Latin subset, self-hosted | SIL Open Font License 1.1 |
| Nunito (body text) | npm package `@fontsource/nunito`, Latin subset, self-hosted | SIL Open Font License 1.1 |
| `public/favicon.svg` | Drawn for this project | Project original |
| Card icons, cat and robot avatars, logo | Original inline SVG drawn for this project (`features/game/art/CardIcon.tsx`, `AvatarArt.tsx`, `components/common/Logo.tsx`). Simple flat shapes; replace with commissioned illustrations later (UI/UX section A3) | Project original |
| Confetti and a few decorative glyphs | Unicode emoji rendered by the visitor's system font (no files shipped) | n/a |
| Sound effects | Generated at runtime with the Web Audio API (no audio files) | Project original |
| `qrcode-generator` | npm package, loaded lazily when the host shows a QR code | MIT |

No asset is loaded from a third-party origin.

## Naming note

Card names (Exploding Kitten, Defuse, Skip, See the Future, Shuffle, Attack, Favor, Cat cards) follow the Exploding Kittens set by product-owner decision. No Exploding Kittens artwork, logo, or card text is used. A trademark check is still advised before any public release (OQ-01).
