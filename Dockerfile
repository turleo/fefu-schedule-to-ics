FROM oven/bun:latest AS base
WORKDIR /app

FROM base
COPY . .
RUN bun install --frozen-lockfile --production
VOLUME "/config"

USER bun
ENTRYPOINT [ "bun", "run", "src/index.ts", "--config", "/config/config.toml" ]