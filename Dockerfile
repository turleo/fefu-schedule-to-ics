FROM oven/bun:latest AS builder
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile --production
RUN bun run build.ts

FROM oven/bun:latest AS runner
WORKDIR /app
COPY --from=builder /app/out /app
VOLUME "/config"

USER bun
ENTRYPOINT [ "bun", "run", "index.js", "--config", "/config/config.toml" ]