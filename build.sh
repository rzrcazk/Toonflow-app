#!/bin/bash
# ============================================================
# Build backend Docker image (only if source changed)
# ============================================================
# Usage: cd toonflow-app && ./build.sh
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../toonflow-docker"
COMPOSE_FILE="$DOCKER_DIR/docker-compose.yml"

HASH_FILE="$SCRIPT_DIR/.last-backend-build"

echo "🔍 Checking if backend rebuild is needed..."

# Calculate hash of backend source files
CURRENT_HASH=$(find "$SCRIPT_DIR/src" "$SCRIPT_DIR/data/vendor" "$SCRIPT_DIR/data/skills" \
  "$SCRIPT_DIR/package.json" "$SCRIPT_DIR/yarn.lock" "$SCRIPT_DIR/tsconfig.json" \
  -type f 2>/dev/null | sort | xargs md5sum 2>/dev/null | md5sum | awk '{print $1}')

# Read last build hash
LAST_HASH=""
if [ -f "$HASH_FILE" ]; then
  LAST_HASH=$(cat "$HASH_FILE")
fi

if [ "$CURRENT_HASH" = "$LAST_HASH" ]; then
  echo "✅ Backend source unchanged, skipping rebuild."
  echo "   Last build: $(date -r "$HASH_FILE" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo 'unknown')"
  exit 0
fi

echo "📦 Backend source changed, rebuilding Docker image..."

docker compose -f "$COMPOSE_FILE" build

# Save new hash
echo "$CURRENT_HASH" > "$HASH_FILE"

echo ""
echo "✅ Backend build complete!"
echo "   Start container: cd ../toonflow-docker && ./start.sh"
