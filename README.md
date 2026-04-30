# Claude Test Sandbox

A deliberately tiny ToDo app whose **real purpose is exercising Claude Code automation primitives** before transferring proven patterns to production projects.

## Stack

- Vite 8 + React 19 + TypeScript 6
- Vitest 4 + Testing Library + jsdom (unit)
- Playwright (e2e)
- ESLint flat config + Prettier

## Scripts

```bash
npm run dev          # vite dev server (http://localhost:5173)
npm run build        # tsc -b && vite build
npm run typecheck    # tsc -b --noEmit
npm run lint         # eslint .
npm run format       # prettier --write .
npm run format:check # prettier --check .
npm test             # vitest run
npm run test:watch   # vitest watch mode
npm run e2e          # playwright test
```

## Layout

```
src/
  components/TodoList.tsx   # the only UI component
  hooks/useTodos.ts         # add/toggle/delete/clearCompleted + persistence
  hooks/useTodos.test.ts    # vitest unit tests
  lib/storage.ts            # localStorage adapter + Todo type
  test/setup.ts             # vitest setup (jest-dom matchers)
e2e/todo.spec.ts            # playwright spec
```

## Claude Code workflows exercised here

See `CLAUDE.md` for the full list. Highlights:

- Custom subagents in `.claude/agents/`
- Slash commands in `.claude/commands/`
- Hooks in `.claude/settings.json` (auto-format on edit, safety hook, session log)
- Project-scoped MCPs in `.mcp.json` (Excalidraw, Playwright)
- Anthropic GitHub Action (PR reviews)
- Dependabot triage workflow
- Scheduled routines (dep audit, stale branches)

## Setup steps (manual)

The repo is scaffolded locally and tests/lint/build are green. The remaining steps need your hands at the keyboard:

1. **Install GitHub CLI** (one-time, machine-wide)

   ```bash
   winget install --id GitHub.cli      # Windows
   gh auth login
   ```

2. **Create the GitHub repo and push**

   ```bash
   gh repo create todo-sandbox --public --source . --remote origin --push
   ```

3. **Install the Claude Code GitHub App** — from inside Claude Code in this directory, run:

   ```
   /install-github-app
   ```

   It will: (a) install the app on `todo-sandbox`, (b) prompt for your `ANTHROPIC_API_KEY` and add it as a repo secret, (c) commit `.github/workflows/claude.yml`. After it generates the file, look at the action version it pins (e.g. `anthropics/claude-code-action@v1`) and update `.github/workflows/dependabot-triage.yml` to match.

4. **Branch protection on `main`** — in the repo Settings → Branches, require a PR and the following status checks before merging:
   - `Lint` · `Format check` · `Typecheck` · `Unit tests` · `Build` · `E2E (Playwright)`

5. **Optional MCPs** — verify the Excalidraw MCP package name in `.mcp.json` matches a package you actually want to use; the placeholder there is illustrative.

## Validation exercises

Run these to prove each piece works end-to-end:

| What                        | How                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------- |
| CLAUDE.md is loaded         | New Claude session, ask "what is this project?" — should answer from `CLAUDE.md`      |
| Format-on-edit hook         | Edit a `.tsx` file via Claude — Prettier should run automatically                     |
| `rm -rf` block hook         | Ask Claude to run `rm -rf foo` — should be blocked with the hook's message            |
| Code reviewer subagent      | Add `const x: any = 1` somewhere, run `/review-local` — should be flagged             |
| Coverage gaps slash command | Run `/coverage-gaps` — lists files in `src/` without tests                            |
| PR review GH Action         | Open a PR, comment `@claude review` — Claude should reply                             |
| Dependabot triage workflow  | Wait for a Dependabot PR (or run the workflow manually) — sticky comment with verdict |
| Scheduled routine           | `/schedule` a weekly dep audit — confirm it shows up in `/schedule list`              |
| Playwright MCP              | `npm run dev`, ask Claude to add/toggle/delete a todo via the MCP                     |
| Excalidraw MCP              | Ask Claude to diagram the dependabot-triage flow                                      |
