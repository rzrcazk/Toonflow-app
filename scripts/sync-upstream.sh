#!/bin/bash
# ============================================================
# Sync upstream latest master, then merge into feature branch
# ============================================================
# Usage:
#   ./scripts/sync-upstream.sh
#
# Logic:
#   1. Save current branch
#   2. Commit any uncommitted changes
#   3. Fetch upstream master
#   4. Force local master to match upstream/master exactly
#   5. Switch back to feature branch
#   6. Merge master into feature branch (conflict → keep feature)
# ============================================================

set -e

UPSTREAM_APP="${UPSTREAM_APP:-upstream}"
FEATURE_BRANCH="${FEATURE_BRANCH:-feature/animal-science-video}"

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)

# Commit uncommitted changes if any
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  echo "📦 Committing uncommitted changes on $CURRENT_BRANCH..."
  git add -A
  git commit -m "chore: auto-commit before sync-upstream"
fi

echo "📡 Fetching upstream master ($UPSTREAM_APP/master)..."
git fetch "$UPSTREAM_APP"

echo ""
echo "📥 Forcing local master to match upstream/master..."
git checkout master
git reset --hard "$UPSTREAM_APP/master"

echo ""
echo "🔀 Merging master into $FEATURE_BRANCH..."
git checkout "$FEATURE_BRANCH"
git merge master --no-edit || {
  echo ""
  echo "⚠️  Merge conflicts detected. Resolving with feature branch versions..."
  # Accept feature branch (--ours) for content conflicts
  git diff --name-only --diff-filter=U | while read f; do
    if [[ -f "$f" ]]; then
      git checkout --ours "$f"
    fi
    git add "$f"
  done
  git commit --no-edit -m "Merge branch 'master' into $FEATURE_BRANCH (conflicts resolved)"
}

echo ""
echo "✅ Sync complete!"
echo ""
echo "Feature branch is now up to date with upstream master."
echo "Your custom changes on $FEATURE_BRANCH:"
echo "  git log master..HEAD"

# Switch back to original branch if different
if [ "$CURRENT_BRANCH" != "$FEATURE_BRANCH" ] && [ "$CURRENT_BRANCH" != "master" ]; then
  echo "🔄 Switching back to $CURRENT_BRANCH..."
  git checkout "$CURRENT_BRANCH"
fi
