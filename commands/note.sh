#!/bin/bash
# /note - Process and save session notes

set -e

PROJECT_ROOT="${PROJECT_ROOT:-.}"
NOTES_DIR="$PROJECT_ROOT/notes/notes"

# Create notes directory if it doesn't exist
mkdir -p "$NOTES_DIR"

# Get session date/topic from argument or use today
TOPIC="${1:-$(date +%Y-%m-%d)-session}"
NOTE_FILE="$NOTES_DIR/${TOPIC}.md"

# Check if file exists
if [ -f "$NOTE_FILE" ]; then
    echo "📝 Appending to: $NOTE_FILE"
else
    echo "📝 Creating new note: $NOTE_FILE"
    cat > "$NOTE_FILE" << EOF
# $TOPIC

**Created:** $(date)

## Summary

[Your summary here]

## Key Points

-

## Decisions Made

-

## Next Steps

-

---
EOF
fi

echo ""
echo "📄 Note file: $NOTE_FILE"
echo ""
echo "Add your notes to this file, or continue in the session and end with: session end"
echo ""

# Open in editor if available
if command -v $EDITOR &> /dev/null; then
    $EDITOR "$NOTE_FILE"
elif command -v nano &> /dev/null; then
    nano "$NOTE_FILE"
elif command -v vi &> /dev/null; then
    vi "$NOTE_FILE"
else
    echo "No editor found. Edit $NOTE_FILE manually."
fi

echo "✅ Note saved"
