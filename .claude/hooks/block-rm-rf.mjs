#!/usr/bin/env node
// PreToolUse hook for Bash: blocks `rm -rf` patterns.
// Exits 2 with a stderr message to signal Claude that the command is denied.
// This is intentionally aggressive — adjust the regex if you need to do real cleanup.

import { readFileSync } from 'node:fs'

let payload
try {
  payload = JSON.parse(readFileSync(0, 'utf8'))
} catch {
  process.exit(0)
}

const cmd = String(payload?.tool_input?.command ?? '')

// Match: rm -rf, rm -fr, rm -Rf, rm -fR, rm --recursive --force, etc.
const rmDangerous =
  /\brm\s+(-[a-zA-Z]*[rR][a-zA-Z]*[fF]|-[a-zA-Z]*[fF][a-zA-Z]*[rR]|--recursive\s+--force|--force\s+--recursive)\b/

if (rmDangerous.test(cmd)) {
  console.error(
    `[block-rm-rf] Refusing to run a recursive force-delete command in this sandbox.\n` +
      `Command: ${cmd}\n` +
      `If you really mean to delete recursively, do it manually outside Claude or edit .claude/hooks/block-rm-rf.mjs.`,
  )
  process.exit(2)
}

process.exit(0)
