# 🗓️ FEFU schedule to .ics files

This project's goal is tacking schedule from univer.dvfu.ru once a week, generating proper .ics file and putting it into S3 (probably).

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run run
```

## Mocking

In order not to anger FEFU IT team, mock files should be used instead of fetch.
Currently there are:

- `src/mocking/events.json`: example of object, returned by `requestEvents` function. Can be disabled by setting `REQUEST_EVENTS` environment variable.

To generate all mock data run

```bash
bun run generate-mock
```
