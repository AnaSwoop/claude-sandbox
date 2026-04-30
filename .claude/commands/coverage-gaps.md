---
description: Find source files in src/ that have no matching .test file and recommend tests to add
argument-hint: '[optional: directory under src/]'
allowed-tools: Glob, Read, Grep
---

Find untested files and recommend tests.

Steps:

1. Glob `src/**/*.{ts,tsx}` (excluding `*.test.{ts,tsx}` and `src/test/**`).
2. For each, check whether a sibling `*.test.{ts,tsx}` exists.
3. Skip files that are pure type definitions (only `export type`/`export interface`) — they don't need tests.
4. Skip `main.tsx` and `App.tsx` — they're entry points.
5. For each remaining file without a test:
   - Read it briefly
   - Output one line: `<path> — <one-sentence test gap>` (e.g., "no test asserts loadTodos returns [] on malformed JSON")
6. End with a numbered priority list of the top 3 to test first, based on logic complexity / risk.

If everything is tested, say so and stop. Do not write tests in this command — that's for the `test-writer` subagent, which the user can invoke separately if they like.
