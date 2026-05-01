#!/bin/bash
# ============================================================
# Build frontend and copy to data/web/ for Docker volume mount
# ============================================================
# Usage: ./scripts/build-web.sh
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR/packages/web"

echo "📦 Building frontend..."

# Patch build to skip vue-tsc (auto-import types are incomplete)
sed -i.bak 's/"build": "vue-tsc --build --force && vite build"/"build": "vite build"/' package.json
rm -f package.json.bak

# Remove deprecated tsconfig options
sed -i.bak '/"ignoreDeprecations"/d' tsconfig.app.json tsconfig.node.json 2>/dev/null || true
rm -f tsconfig.app.json.bak tsconfig.node.json.bak

yarn build

echo ""
echo "📋 Copying dist to data/web/..."

# Clean old dist
rm -rf "$PROJECT_DIR/data/web"
cp -r dist "$PROJECT_DIR/data/web"

echo ""
echo "✅ Frontend build complete!"
echo "   Restart container to apply: ./scripts/start-docker.sh"
