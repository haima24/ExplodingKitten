# Dev spec — US-050 Project scaffold and design tokens

| Item | Value |
| --- | --- |
| Story | [US-050](../user-stories/release-1.0.1/US-050-project-scaffold-and-design-tokens.md) · Must (enabler) · Foundation |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-17, DAC-27, DAC-30, [UI/UX §B](../../ui-ux.md#b-design-system) |
| Area | Repository, tooling, client shell, token CSS |

## 1. Goal

Create a runnable monorepo with a client and a server that start together, lint, type-check, and test, with the design tokens and self-hosted fonts in place. Nothing else is built here.

## 2. Technical design

### 2.1 Modules and files

| Path | Content |
| --- | --- |
| `package.json`, `pnpm-workspace.yaml`, `.nvmrc` | Workspace root; `engines` pins Node and pnpm; `engine-strict` so a wrong version fails the install with a clear message |
| `tsconfig.base.json` | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, project references |
| `eslint.config.*`, `.prettierrc` | Lint and format; `no-restricted-imports` rules implement the dependency rules in [README §2.1](README.md#21-stack-and-repository-layout) |
| `packages/engine`, `packages/protocol` | Empty packages with `src/index.ts`, `exports` map (engine: `.`, `./cards`, `./types`), Vitest config, one sample test each |
| `apps/server` | Entry point that opens `/ws` (accepts a connection, answers `hello`) and `GET /healthz`; reads config from env |
| `apps/client` | Vite app; routes render placeholder pages; dev server proxies `/ws` to the server |
| `apps/client/src/styles/tokens.css` | All design tokens as CSS custom properties (see 2.2) |
| `apps/client/src/assets/fonts/` | Self-hosted WOFF2 subsets (Baloo 2 for headings and buttons, Nunito for body; both SIL OFL) with `@font-face` and `font-display: swap` |
| `apps/client/src/assets/LICENSES.md` | Origin and licence of every asset and font |
| `tests/e2e` | Playwright project skeleton with one smoke test (see Verification) |

### 2.2 Token contract (from UI/UX §B)

| Group | Custom properties |
| --- | --- |
| Colour | `--color-bg #FFF8EC`, `--color-surface #FFFFFF`, `--color-surface-alt #F1ECFF`, `--color-ink #1F1A3D`, `--color-ink-soft #4A4468`, `--color-primary #5B3FD9`, `--color-primary-pressed #4A31B8`, `--color-accent #FFC83D`, `--color-boom #C93217`, `--color-success #17784A`, `--color-info #0F6E8C`, `--color-border #8A84A8`, `--color-focus #1F1A3D`, `--color-disabled-bg #E6E2F0`, `--color-disabled-text #5E5880` |
| Type | `--font-heading`, `--font-body`, `--text-display/h1/h2/h3/body/small` (rem, from the UI/UX table), `--text-scale` (default 1, used by US-039) |
| Space | `--space-1..8` = 4, 8, 12, 16, 24, 32, 48, 64 px |
| Shape | `--radius-sm 8px`, `--radius-md 16px`, `--radius-lg 24px`, `--radius-full 999px`, `--outline-sticker` |
| Elevation | `--elev-1`, `--elev-2`, `--elev-3`, `--scrim` |
| Motion | `--dur-press 120ms`, `--dur-select 200ms`, `--dur-move 400ms`, `--dur-celebrate 1200ms`, `--ease-standard` |
| Targets | `--target-min 48px`, `--target-primary 56px` |

Colour values are *proposed* and must be re-verified by the contrast test (US-037).

### 2.3 Scripts (root)

`dev` (client and server), `build`, `lint`, `typecheck`, `test` (all unit and integration), `e2e`, `format`. Each package exposes the same script names.

## 3. Edge cases and errors

- Unsupported Node or pnpm version: install stops with the message produced by `engine-strict`.
- No third-party requests: fonts, icons, and scripts are bundled; `index.html` has no external `<link>` or `<script>`.
- Missing server at dev time: the client still renders; the connection attempt fails cleanly (handled in US-001).

## 4. Verification

| Check | Level |
| --- | --- |
| `pnpm install && pnpm dev` starts both apps; placeholder Home loads | E (smoke) |
| `lint`, `typecheck`, `test` pass for every package | CI |
| First page load makes zero third-party requests and sets no cookies | E (network assertion), DAC-27 |
| Tokens present with the contract names | U (CSS parse test) |
| `assets/LICENSES.md` lists every asset; no Exploding Kittens artwork, logo, or card text in the repo (card names are allowed) | CI script (grep for logo and artwork file names), DAC-30 |
| Dependency rule violations fail lint | U (lint fixture) |

## 5. Tasks

1. Create the workspace, `tsconfig.base.json`, lint, format, and version pinning.
2. Add the four package skeletons with `exports` and sample tests.
3. Add the minimal server (`/ws` hello, `/healthz`) and config loader.
4. Add the Vite client, router with placeholder pages, dev proxy.
5. Add `tokens.css`, font files, and `LICENSES.md`.
6. Add the Playwright skeleton and the smoke and no-third-party tests.
7. Document install, run, and test commands in the root `README`.

## 6. Dependencies and risks

- Depends on decision OQ-07 (stack). If the stack changes, the layout and rules still apply.
- Risk: font licences or file sizes. Mitigation: subset to Latin and measure against the 200 KB JS budget (fonts are separate).
