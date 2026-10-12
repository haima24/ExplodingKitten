# Dev spec — US-052 Sound effects (muted by default)

| Item | Value |
| --- | --- |
| Story | [US-052](../user-stories/release-1.0.1/US-052-sound-effects-muted-by-default.md) · **Could** · Responsive UI and accessibility |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-30, OQ-09 |
| Area | `apps/client` (`lib/audio`) |

## 1. Goal

Optional short sounds for draw, play, Boom, and victory. Off by default, never preloaded while off, and never the only carrier of information.

## 2. Technical design

- `AudioManager` is a lazily imported module. It is **not loaded** unless `settings.sound === true`; no audio files are fetched or preloaded while sound is off.
- Turning sound on (a user gesture) creates or resumes the audio context and then fetches the small effect files (same origin, compressed, a few KB each). Autoplay restrictions are respected: playback starts only after that gesture.
- Event mapping (from public engine events and local events): `CARD_DRAWN` (own draw), `CARD_PLAYED`, `BOOM_DRAWN`, `PLAYER_OUT`, `GAME_FINISHED`. Low default volume (about 40 %); a volume control is optional.
- Every sound has a visible or textual equivalent already (toasts, banners, announcements).
- Sound is independent of the reduced-motion setting, but no sound plays while the tab is hidden.
- Settings (US-038): the toggle is enabled only when this feature ships.
- Assets are original or licensed; origins recorded in `assets/LICENSES.md`.

## 3. Edge cases and errors

- Audio decoding or fetch fails: silently disable sound for the session; no error UI.
- Autoplay blocked: the first user gesture resumes the context.
- Many events at once: at most one sound per 150 ms, priority order Boom > win > play > draw.

## 4. Verification

| Check | Level |
| --- | --- |
| With sound off: no audio request in the network log, audio module not loaded | E |
| Turning on loads assets after the gesture and plays on events | C (mocked audio), E |
| Failure path stays silent | C |
| No sound while the tab is hidden | C |

## 5. Tasks

1. Implement `AudioManager` with lazy loading and event mapping.
2. Enable the Settings toggle.
3. Add licences and tests.

## 6. Dependencies and risks

- Depends on US-038. Needs original or licensed audio (OQ-09).
- Risk: surprise noise in shared spaces. Mitigation: off by default and low volume.
