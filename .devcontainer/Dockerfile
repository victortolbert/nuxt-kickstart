FROM node:24-bookworm

# Native build dependencies for sharp and Playwright browsers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    git \
    curl \
    ca-certificates \
    libvips-dev \
    libc6 \
    && rm -rf /var/lib/apt/lists/*

# Enable pnpm via corepack (version pinned by package.json "packageManager")
RUN corepack enable && corepack prepare pnpm@11.5.3 --activate

# Verify installations
RUN node --version && pnpm --version && git --version
