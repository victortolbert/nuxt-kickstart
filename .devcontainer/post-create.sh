#!/usr/bin/env bash
set -e

# Copy .env.example to .env if .env doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env

  # Generate a random BETTER_AUTH_SECRET so auth works locally out of the box
  SECRET=$(openssl rand -base64 32)
  sed -i "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=${SECRET}|" .env

  echo "Created .env from .env.example (with generated BETTER_AUTH_SECRET)"
fi

# Install dependencies (postinstall runs `nuxt prepare` + local `db:init`)
pnpm install

echo "Dev container ready. Run 'pnpm dev' to start."
