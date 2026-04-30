#!/usr/bin/env node
// Stop hook: appends a tiny entry to .claude/session-log.md so you can see how often Claude
// finishes a turn. Useful as a learning aid; remove or extend as you like.

import { readFileSync, appendFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

let payload = {}
try {
  payload = JSON.parse(readFileSync(0, 'utf8'))
} catch {
  // ignore
}

const log = '.claude/session-log.md'
mkdirSync(dirname(log), { recursive: true })

const ts = new Date().toISOString()
const sessionId = payload?.session_id ?? 'unknown'
const cwd = payload?.cwd ?? process.cwd()

appendFileSync(log, `- ${ts} session=${sessionId} cwd=${cwd}\n`)
process.exit(0)
