#!/usr/bin/env node
// PostToolUse hook for Edit|Write: runs Prettier on the touched file if it's a formattable type.
// Reads the hook payload from stdin (Claude Code sends JSON), extracts tool_input.file_path,
// and silently exits if it's not a file we format. Errors are logged but never block the tool.

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { extname } from 'node:path'

const FORMATTABLE = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.css',
  '.html',
  '.yml',
  '.yaml',
])

let payload
try {
  payload = JSON.parse(readFileSync(0, 'utf8'))
} catch {
  process.exit(0)
}

const file = payload?.tool_input?.file_path
if (!file || !FORMATTABLE.has(extname(file).toLowerCase())) process.exit(0)

const result = spawnSync('npx', ['prettier', '--write', '--log-level', 'warn', file], {
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true,
})

if (result.status !== 0) {
  // Non-fatal: log to stderr but exit 0 so the edit is not blocked
  console.error(`[format-on-edit] prettier failed for ${file}:`, result.stderr?.toString())
}
process.exit(0)
