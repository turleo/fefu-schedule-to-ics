# 🗓️ FEFU schedule to .ics files

This project's goal is fetching the schedule from univer.dvfu.ru and putting the schedule into CalDav compatible calendar.

## ⚡️ Prerequisites

- [Bun](https://bun.sh/) (Runtime)

## ⬇️ Installation

```bash
bun install --frozen-lockfile --production
```

## Configuration

Example configuration is located at [config.example.toml](./config.example.toml).

You should specify

- `groupIds` – you can get it from requests in devtools in [Univer](https://univer.dvfu.ru/schedule)
- `appAccess` – can be taken found in mobile app, good luck
- `requestForWeeks` – how many weeks do you want to update every run
- `calendarAuth` – authorization for CalDav calendar shaped like [this type](https://github.com/natelindev/tsdav/blob/master/src/client.ts#L54)
- `calendarByGroups` – list of subgroups and calendars for them. `default` group for everything without and subgroup assigned (eg. lectures)

After that you should run

```bash
bun run run --username [your univer.dvfu.ru email before @]
```

Script will update calendars for first time and save credentials.

## ⏳️ Running

```
Usage: run [...args]

  --username [username] - univer.dvfu.ru password
  --password [password] - univer.dvfu.ru password
  --config [./config.toml] - path to config

if no arguments specified, refresh token from ./config.toml will be used
```
