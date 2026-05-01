#!/bin/bash
# ============================================================
# Start Docker container using existing image (no build)
# ============================================================
# Usage: ./scripts/start-docker.sh
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 Starting Toonflow container (using existing image)..."

cd "$PROJECT_DIR"
docker compose -f infra/docker-compose.yml up -d

echo ""
echo "✅ Container started!"
echo "   API: http://localhost:10588"
echo "   Web: http://localhost:10588"
echo ""
echo "   View logs: docker logs -f toonflow-app"
echo "   Stop:      docker compose -f infra/docker-compose.yml down"
