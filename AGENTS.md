# AGENTS

This repository is a library of reusable agents, instructions, prompts, hooks, and skills. Use these links as the primary map; avoid duplicating guidance that already exists elsewhere in the repo.

## Start here

- README: Catalog and navigation for the library.
- Agents: Ready-made specialist agents for common roles and stacks.
- Instructions: Deep, domain-specific guidance for BA, React, testing, and project setup.
- Hooks: Deterministic automation (pre-tool and prompt-submit).

## Key references

- README: [README.md](README.md)
- Agents: [agents/](agents/)
- BA agent set: [instructions/BA/](instructions/BA/)
- React guidance: [instructions/react/](instructions/react/)
- Testing guidance (Playwright): [instructions/testing/copilot-instructions.md](instructions/testing/copilot-instructions.md)
- Project setup templates: [instructions/ProjectSetup/GithubCopilot/StandardInstructions/](instructions/ProjectSetup/GithubCopilot/StandardInstructions/)
- Hooks: [hooks/hooks.json](hooks/hooks.json)

## Usage notes

- Prefer linking to existing instruction files instead of duplicating content.
- If you add new skills, keep them narrow and task-focused, with clear triggers.
- Game app (Whisker Boom): a pnpm workspace in `working-artifacts/src/` (`packages/`, `apps/`; run pnpm from that folder). Use `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`. Details are in the root README. Dependency rules (engine imports nothing; the client never imports `applyAction`) are enforced by `pnpm lint`.
