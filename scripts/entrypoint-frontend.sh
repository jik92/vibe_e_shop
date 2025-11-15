#!/bin/sh
set -euo pipefail

export CI="${CI:-true}"

MODE="${FRONTEND_MODE:-build}"
FRONTEND_DIR="/app/frontend"
WORKSPACE_DIR="/workspace/frontend"
WORKSPACE_SHARED_DIR="/workspace/shared"

sync_dir() {
  src="$1"
  dest="$2"
  label="$3"

  if [ -d "$src" ]; then
    echo "▶ Syncing ${label} sources..."
    rsync -a --delete --exclude node_modules --exclude dist --exclude dist-ssr "$src"/ "$dest"/
  fi
}

run_dev() {
  WORK_DIR="$WORKSPACE_DIR"
  if [ ! -d "$WORK_DIR" ]; then
    echo "ℹ Workspace mount not detected, falling back to baked sources."
    WORK_DIR="$FRONTEND_DIR"
  else
    echo "▶ Using live workspace at $WORK_DIR"
  fi

  cd "$WORK_DIR"
  pnpm install --frozen-lockfile
  exec pnpm run dev --host 0.0.0.0 --port 3000
}

if [ "$MODE" = "dev" ]; then
  run_dev
  exit 0
fi

sync_dir "/workspace/frontend" "$FRONTEND_DIR" "frontend"
sync_dir "/workspace/shared" "/app/shared" "shared"

cd "$FRONTEND_DIR"
pnpm install --frozen-lockfile
pnpm run build

exec pnpm run preview --host 0.0.0.0 --port 3000
