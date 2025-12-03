FROM oven/bun:latest AS builder
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile --production
VOLUME "/config"

USER bun
ENTRYPOINT [ "bun", "run", "src/index.tx", "--config", "/config/config.toml" ]