#!/bin/bash
set -e

UPSTREAM_REMOTE="${1:-upstream}"

echo "Pulling updates from motyl-ai-workflow upstream ($UPSTREAM_REMOTE)..."
echo ""

# Stash uncommitted changes so git subtree can run
STASHED=0
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Stashing local changes..."
  git stash push -m "update.sh auto-stash"
  STASHED=1
fi

git subtree pull --prefix panel "$UPSTREAM_REMOTE" main --squash
git subtree pull --prefix commands "$UPSTREAM_REMOTE" main --squash
git subtree pull --prefix scripts "$UPSTREAM_REMOTE" main --squash

# Restore stashed changes
if [ "$STASHED" -eq 1 ]; then
  echo ""
  echo "Restoring stashed changes..."
  git stash pop
fi

echo ""
echo "Done. panel/, commands/, scripts/ updated from upstream."
echo ""
echo "Note: AGENTS.md and CLAUDE.md are manually maintained."
echo "Check https://github.com/gmotyl/motyl-ai-workflow for changes and cherry-pick as needed."
