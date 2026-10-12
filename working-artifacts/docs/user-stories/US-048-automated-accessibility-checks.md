# US-048 — Automated accessibility checks

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Should
- **Epic:** Testing and quality
- **User story:** As a tester, I want automated accessibility scans, so that obvious issues are caught on every change.
- **Context:** F-28, M6, DAC-22. Manual checks follow `.github/skills/testing-accessibility-testing/`.
- **Acceptance criteria:**
  - Given each MVP screen and dialog, then an automated accessibility scan reports 0 serious or critical violations.
  - Given the CI pipeline, then a failing scan fails the build.
  - Given the manual checklist (keyboard, NVDA, VoiceOver, TalkBack, 200 % zoom), then results are recorded before each release.
  - Negative: Given a newly introduced low-contrast colour, then the scan fails.
- **Dependencies:** [US-047](US-047-multi-device-end-to-end-tests-host-and-players.md).
- **Notes:** Automated tools find only part of the issues; the manual pass remains required.
