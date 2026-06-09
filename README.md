# Random Sleep Action

A GitHub Action that pauses a job for a random number of seconds between a
minimum and a maximum. Useful for staggering scheduled jobs, jittering retries,
or spreading load across matrix runs.

No dependencies, no build step — it's a single `index.js` that runs directly on
Node.js 24.

## Usage

```yaml
- name: Random sleep
  id: sleep
  uses: marklonquist/random-sleep-action@v1
  with:
      minimum: 5
      maximum: 30

- name: Use the result
  run: echo "Slept for ${{ steps.sleep.outputs.wait_time }} seconds"
```

With no inputs, it sleeps a random 1–10 seconds:

```yaml
- uses: marklonquist/random-sleep-action@v1
```

## Inputs

| Name      | Required | Default | Description                    |
| --------- | -------- | ------- | ------------------------------ |
| `minimum` | No       | `1`     | Minimum sleep time in seconds. |
| `maximum` | No       | `10`    | Maximum sleep time in seconds. |

Both must be non-negative integers, and `minimum` must not exceed `maximum`.

## Outputs

| Name        | Description                          |
| ----------- | ------------------------------------ |
| `wait_time` | The number of seconds actually slept |

## License

[MIT](LICENSE)
