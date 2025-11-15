#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$REPO_ROOT"

if command -v uv >/dev/null 2>&1; then
  echo 'Running Ruff formatter via uv…'
  uv tool run ruff format backend
else
  echo 'uv not found, falling back to local ruff (if installed)…'
  ruff format backend
fi

echo 'Running Prettier in frontend…'
(cd frontend && pnpm run format)
