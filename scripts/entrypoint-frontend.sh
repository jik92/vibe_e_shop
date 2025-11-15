#!/bin/sh
set -euo pipefail

sync_dir() {
  src="$1"
  dest="$2"
  label="$3"

  if [ -d "$src" ]; then
    echo "▶ Syncing ${label} sources..."
    rsync -a --delete --exclude node_modules --exclude dist --exclude dist-ssr "$src"/ "$dest"/
  fi
}

sync_dir "/workspace/frontend" "/app/frontend" "frontend"
sync_dir "/workspace/shared" "/app/shared" "shared"

cd /app/frontend
pnpm install --frozen-lockfile
pnpm run build

exec pnpm run preview --host 0.0.0.0 --port 3000
