# US-050 — Project scaffold and design tokens

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must (enabler)
- **Epic:** Foundation
- **User story:** As a developer, I want a runnable web-app scaffold with design tokens, linting, and a test runner, so that features can be built and verified consistently.
- **Context:** The repository has no application code, build configuration, server, or tests. This story is the prerequisite for all others. Stack choice is OQ-07 (proposed: React + TypeScript client and a Node.js + TypeScript server sharing the engine).
- **Acceptance criteria:**
  - Given a fresh clone, when the documented install and start commands are run, then the client and the server both start locally and the client shows a placeholder Home that can reach the server.
  - Given the project, when lint, type-check, and unit-test commands run, then each completes without errors for both client and server (even if only a sample test exists).
  - Given `styles/tokens`, then the colour, typography, spacing, radius, and elevation tokens from [ui-ux.md §B](../../ui-ux.md#b-design-system) exist as CSS variables.
  - Given fonts are used, then they are self-hosted and **no third-party network request** is made on first load (DAC-27).
  - Given the asset folder, then an `assets/LICENSES.md` records the origin and licence of each asset; no Exploding Kittens artwork, logos, or card text are present; card names are the permitted exception (DAC-30).
  - Negative: Given an unsupported Node/tool version, then the install step fails with a clear message.
- **Dependencies:** OQ-07 decision.
- **Notes:** Follow `instructions/react/*` if React is chosen. Do not install or change anything until this story is scheduled.
