# Production image for Kickstart (Nuxt 4 SSR, Nitro node-server preset).
# Multi-stage build: install + build → minimal runtime image.

FROM node:24-bookworm-slim AS build

WORKDIR /app

# pnpm via corepack (version pinned by package.json "packageManager")
RUN corepack enable

# Native toolchain, in case any dependency compiles from source. sharp and the
# libSQL client ship prebuilt binaries, so this is a safety margin for the
# (discarded) build stage only — it does not affect the runtime image.
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 build-essential libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies first for better layer caching.
# --ignore-scripts skips this repo's own lifecycle scripts (`postinstall` runs
# `nuxt prepare` + the local `db:init`; `prepare` runs the dev-only `skilld`
# CLI) — none of those can or should run before the sources are copied.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# A frozen-lockfile install is reproducible and already vetted in source
# control, so disable pnpm's time-based "minimum release age" supply-chain gate
# for the build — it would otherwise reject a build run within 24h of any
# dependency publish. (We keep the real workspace file so its `overrides` still
# match the lockfile; this only appends the gate override for the build stage.)
RUN printf '\nminimumReleaseAge: 0\n' >> pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build. Production uses a remote Turso database, so `db:init` is intentionally
# not run here (provision the schema against your Turso instance separately).
# Invoke the Nuxt binary directly instead of `pnpm run build`: pnpm 11 runs a
# dependency-status check before scripts, which re-validates the lockfile
# against the time-based release-age policy and fails for a build run within 24h
# of a dependency publish. Deps are already installed, so no check is needed.
COPY . .
ARG NODE_BUILD_HEAP_MB=8192
RUN NODE_OPTIONS="--max-old-space-size=${NODE_BUILD_HEAP_MB}" node_modules/.bin/nuxt build

# Nitro's static tracer can't follow libSQL's dynamic, platform-specific
# require() for its native binding, so it's omitted from .output and the server
# crashes at boot ("Cannot find module @libsql/<platform>"). Copy the installed
# Linux binding from the pnpm store into the server bundle. The glob matches
# whichever arch built the image (linux-arm64-gnu, linux-x64-gnu, ...).
RUN for d in node_modules/.pnpm/@libsql+linux-*/node_modules/@libsql/*/; do \
      [ -d "$d" ] || continue; \
      name="$(basename "$d")"; \
      mkdir -p ".output/server/node_modules/@libsql/$name"; \
      cp -R "$d." ".output/server/node_modules/@libsql/$name/"; \
      echo "bundled native binding: @libsql/$name"; \
    done

# --- Runtime: ship only the built server output ---
FROM node:24-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=build /app/.output .output

# The DB layer falls back to a local SQLite file (file:.data/auth.db) when Turso
# isn't configured. Create the directory so a bare `docker run` boots with an
# ephemeral local database (tables are auto-created on first import). For
# production set BOTH TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to use a
# persistent remote database instead.
RUN mkdir -p .data

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
