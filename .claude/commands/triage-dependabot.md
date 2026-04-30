---
description: Run the dependabot-triage agent against a Dependabot PR (defaults to current branch's PR)
argument-hint: '[optional: PR number]'
allowed-tools: Bash(gh:*), Bash(git:*), Read, Grep, Glob, WebFetch
---

Triage a Dependabot PR locally.

Steps:

1. If `$ARGUMENTS` is a number, use that as the PR number. Otherwise run `gh pr view --json number,headRefName -q .number` for the current branch's PR.
2. Run `gh pr view <number> --json title,body,author,files,headRefName` and check `author.login == "dependabot[bot]"`. If not, abort with a clear message.
3. Run `gh pr diff <number>` to get the diff.
4. Run `gh pr checks <number>` to get CI status.
5. Invoke the `dependabot-triage` subagent with all the above.
6. Print the agent's verdict comment verbatim.

Do not actually post the comment to GitHub — that's the GH Action's job. This command is for local rehearsal.
