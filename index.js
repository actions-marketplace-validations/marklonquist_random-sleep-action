// Random Sleep — a GitHub Action that sleeps for a random whole number of
// seconds between `minimum` and `maximum` (inclusive) and exposes the chosen
// duration as the `wait_time` output.
//
// Implemented with Node.js built-ins only, so the action runs directly with no
// dependencies and no build step. Inputs arrive as INPUT_* environment
// variables; the output is written to the $GITHUB_OUTPUT file.

const fs = require('node:fs')
const { setTimeout: sleep } = require('node:timers/promises')

const DEFAULT_MINIMUM = 1
const DEFAULT_MAXIMUM = 10

// Read an action input by name, falling back when it is unset or blank.
function getInput(name, fallback) {
    const raw = process.env[`INPUT_${name.toUpperCase()}`]
    return raw === undefined || raw.trim() === '' ? fallback : Number(raw)
}

// Write `name=value` to the step's outputs file (when running inside Actions).
function setOutput(name, value) {
    if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`)
    }
}

// Emit a GitHub Actions error annotation and fail the step.
function fail(message) {
    process.stdout.write(`::error::${message}\n`)
    process.exit(1)
}

function validate(minimum, maximum) {
    if (!Number.isInteger(minimum) || !Number.isInteger(maximum)) {
        return 'minimum and maximum must be integers.'
    }
    if (minimum < 0 || maximum < 0) {
        return 'minimum and maximum must be non-negative.'
    }
    if (minimum > maximum) {
        return 'minimum cannot be greater than maximum.'
    }
    return null
}

async function run() {
    const minimum = getInput('minimum', DEFAULT_MINIMUM)
    const maximum = getInput('maximum', DEFAULT_MAXIMUM)

    const error = validate(minimum, maximum)
    if (error) {
        fail(error)
        return
    }

    const waitTime = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum

    console.log(`Sleeping for ${waitTime} second(s)...`)
    await sleep(waitTime * 1000)

    setOutput('wait_time', waitTime)
    console.log(`Done — waited ${waitTime} second(s).`)
}

run().catch(err => fail(err instanceof Error ? err.message : String(err)))
