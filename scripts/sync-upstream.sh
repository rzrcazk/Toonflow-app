#!/bin/bash
# ============================================================
# Sync upstream latest code for both app and web sources
# ============================================================
# Usage:
#   ./scripts/sync-upstream.sh                    # default: develop + master
#   APP_BRANCH=master ./scripts/sync-upstream.sh  # sync app master
#   WEB_BRANCH=develop ./scripts/sync-upstream.sh # sync web develop
# ============================================================

set -e

UPSTREAM_APP="${UPSTREAM_APP:-upstream}"
UPSTREAM_WEB="${UPSTREAM_WEB:-upstream-web}"
APP_BRANCH="${APP_BRANCH:-develop}"
WEB_BRANCH="${WEB_BRANCH:-master}"

echo "📡 Syncing app upstream ($UPSTREAM_APP/$APP_BRANCH)..."
git fetch "$UPSTREAM_APP"
git merge "$UPSTREAM_APP/$APP_BRANCH" --no-edit

echo ""
echo "📡 Syncing web upstream ($UPSTREAM_WEB/$WEB_BRANCH)..."
git fetch "$UPSTREAM_WEB"
git subtree pull --prefix=packages/web "$UPSTREAM_WEB" "$WEB_BRANCH" --squash --no-edit

echo ""
echo "✅ Sync complete!"
echo ""
echo "Your custom changes:"
echo "  Backend: git log $UPSTREAM_APP/$APP_BRANCH..HEAD"
echo "  Frontend: git log --oneline -- packages/web/"
