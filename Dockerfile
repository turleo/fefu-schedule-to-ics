FROM oven/bun:latest AS builder
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile --production
VOLUME "/config"

USER bun
ENTRYPOINT [ "bun", "run", "src/index.ts", "--config", "/config/config.toml" ]