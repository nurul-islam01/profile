#!/usr/bin/env bash
# Pull, install, build, reload PM2. Run on the server as the `nurul` user.
# Usage:  ./deploy/deploy.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/nurul}"
APP_NAME="${APP_NAME:-nurul}"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"

echo "==> Fetching $BRANCH"
git fetch --prune origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "==> Installing dependencies"
npm ci

echo "==> Building"
npm run build

echo "==> Reloading PM2 ($APP_NAME)"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$APP_NAME" --update-env
else
  pm2 start deploy/ecosystem.config.cjs
fi
pm2 save

echo "==> Status"
pm2 status "$APP_NAME"

echo "==> Done."
