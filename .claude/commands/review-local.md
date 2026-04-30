---
description: Run the code-reviewer agent against uncommitted local changes
argument-hint: '[optional: --staged | <ref>]'
allowed-tools: Bash(git:*), Read, Grep, Glob
---

Review local changes using the `code-reviewer` subagent.

Steps:

1. If `$ARGUMENTS` contains `--staged`, use `git diff --staged`. If it contains a ref (e.g., `main`), use `git diff <ref>...HEAD`. Otherwise use `git diff HEAD` (working tree + staged).
2. Run `git status` first so you know which files are touched.
3. For each touched file, read it (the reviewer needs full context, not just the diff).
4. Invoke the `code-reviewer` subagent with the diff and the file contents. Tell it to follow its standard output format.
5. Print the agent's review verbatim. Do not paraphrase or summarise.

If the diff is empty, say so and stop.
