#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Garantindo packages/api/.env…"
if [ ! -f packages/api/.env ]; then
  cp packages/api/.env.example packages/api/.env
  echo "  .env criado a partir de .env.example"
fi

echo "→ Subindo Postgres (Docker)…"
docker compose up -d --wait db

echo "→ Gerando Prisma Client…"
npm run db:generate --workspace=@vineo/api --silent

echo "→ Sincronizando schema (prisma db push)…"
npm run db:push --workspace=@vineo/api --silent

echo "→ Iniciando API + mobile…"
exec npx turbo dev --filter=@vineo/api --filter=@vineo/mobile
