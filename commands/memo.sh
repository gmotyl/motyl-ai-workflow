#!/bin/bash
# /memo - Quick memo/note capture command

set -e

PROJECT_ROOT="${PROJECT_ROOT:-.}"
NOTES_DIR="$PROJECT_ROOT/notes/notes"

# Create notes directory if it doesn't exist
mkdir -p "$NOTES_DIR"

# Check if we have a memo file or create new one
MEMO_FILE="$NOTES_DIR/$(date +%Y-%m-%d)-memos.md"

# If no arguments, prompt for input
if [ $# -eq 0 ]; then
    echo "📝 Quick Memo"
    echo "============="
    echo "Type your memo (Ctrl+D to save):"
    MEMO_TEXT=$(cat)
else
    MEMO_TEXT="$@"
fi

if [ -z "$MEMO_TEXT" ]; then
    echo "Empty memo, skipping..."
    exit 0
fi

# Add to memo file with timestamp
cat >> "$MEMO_FILE" << EOF

## $(date '+%H:%M:%S') - Quick Memo

$MEMO_TEXT

---
EOF

echo "✅ Memo saved to: $MEMO_FILE"
