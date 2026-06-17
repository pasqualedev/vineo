#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Subindo Postgres (Docker)…"
docker compose up -d --wait db

echo "→ Sincronizando schema (prisma db push)…"
npm run db:push --workspace=@vineo/api --silent

echo "→ Iniciando API + mobile…"
exec npx turbo dev --filter=@vineo/api --filter=@vineo/mobile
