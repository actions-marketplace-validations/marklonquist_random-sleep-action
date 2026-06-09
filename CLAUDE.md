# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A GitHub Action that sleeps for a random whole number of seconds between `minimum` and `maximum` (inclusive) and exposes the chosen value as the `wait_time` output. Single-file, zero-dependency, no build step.

## Architecture

- `action.yml` — action metadata. Runtime is `node24`, entrypoint is `index.js` directly (no `dist/` bundle). Declares inputs (`minimum`, `maximum`) with string defaults and the `wait_time` output.
- `index.js` — the entire implementation, using only Node built-ins (`node:fs`, `node:timers/promises`). The Actions runtime contract is handled manually:
  - Inputs read from `INPUT_<NAME>` env vars (`getInput`), blank/unset falls back to defaults (`DEFAULT_MINIMUM`/`DEFAULT_MAXIMUM`).
  - Output written by appending `name=value` to the `$GITHUB_OUTPUT` file (`setOutput`).
  - Errors emit a `::error::` annotation and `process.exit(1)` (`fail`).
  - Defaults are duplicated in two places by design: `action.yml` (string) and `index.js` constants (the fallback when run outside Actions). Keep them in sync when changing.
- `.github/workflows/test.yml` — CI smoke test. Runs the action via `uses: ./` with a custom range and with defaults, asserting `wait_time` is non-empty.

## Commands

```bash
# Run locally (simulates the Actions environment)
INPUT_MINIMUM=2 INPUT_MAXIMUM=5 GITHUB_OUTPUT=/tmp/out node index.js

# Run with defaults (1–10s)
node index.js
```

There is no test runner, linter, or package.json — validation is the CI smoke test only.

## Conventions

- 4-space indentation, no semicolons, single quotes (match existing `index.js` style).
- Keep it dependency-free and single-file; do not introduce a build/bundle step or `node_modules`.
