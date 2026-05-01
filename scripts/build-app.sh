#!/bin/bash
# ============================================================
# Build backend Docker image (only if source changed)
# ============================================================
# Usage: ./scripts/build-app.sh
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

HASH_FILE="$PROJECT_DIR/.last-backend-build"

echo "🔍 Checking if backend rebuild is needed..."

# Calculate hash of backend source files
CURRENT_HASH=$(find "$PROJECT_DIR/src" "$PROJECT_DIR/data/vendor" "$PROJECT_DIR/data/skills" \
  "$PROJECT_DIR/package.json" "$PROJECT_DIR/yarn.lock" "$PROJECT_DIR/tsconfig.json" \
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

cd "$PROJECT_DIR"
docker compose -f infra/docker-compose.yml build

# Save new hash
echo "$CURRENT_HASH" > "$HASH_FILE"

echo ""
echo "✅ Backend build complete!"
echo "   Start container: ./scripts/start-docker.sh"
