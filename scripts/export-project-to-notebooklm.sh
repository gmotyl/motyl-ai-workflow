#!/bin/bash

set -e

echo "📤 Export Project to NotebookLM"
echo "==============================="
echo ""

# Get project name
if [ -z "$1" ]; then
    read -p "Project name (or use --project flag): " PROJECT_NAME
else
    PROJECT_NAME="$1"
fi

# Allow --project flag
if [ "$PROJECT_NAME" = "--project" ]; then
    PROJECT_NAME="$2"
fi

if [ ! -d "$PROJECT_NAME" ]; then
    echo "❌ Project directory not found: $PROJECT_NAME"
    exit 1
fi

# Create export directory
EXPORT_DIR="$PROJECT_NAME/exports"
mkdir -p "$EXPORT_DIR"

EXPORT_FILE="$EXPORT_DIR/export-$(date +%Y%m%d-%H%M%S).md"

echo "📝 Creating export file..."
echo ""

# Start export file
cat > "$EXPORT_FILE" << 'EOFMD'
# Project Export for NotebookLM

This file contains the project structure, configuration, notes, and decisions for analysis in NotebookLM.

## How to Use

1. Copy the content of this file
2. Go to https://notebooklm.google.com/
3. Create a new notebook
4. Paste this content
5. Ask questions:
   - "What's the project architecture?"
   - "How should we refactor X?"
   - "What are the key decisions?"
   - "What's missing from the implementation?"

---

EOFMD

# Add PROJECT.md
if [ -f "$PROJECT_NAME/PROJECT.md" ]; then
    echo "## PROJECT.md" >> "$EXPORT_FILE"
    echo "" >> "$EXPORT_FILE"
    cat "$PROJECT_NAME/PROJECT.md" >> "$EXPORT_FILE"
    echo "" >> "$EXPORT_FILE"
fi

# Add DECISIONS.md
if [ -f "$PROJECT_NAME/DECISIONS.md" ]; then
    echo "## DECISIONS.md" >> "$EXPORT_FILE"
    echo "" >> "$EXPORT_FILE"
    cat "$PROJECT_NAME/DECISIONS.md" >> "$EXPORT_FILE"
    echo "" >> "$EXPORT_FILE"
fi

# Add agent config
if [ -f "$PROJECT_NAME/.agent/config.json" ]; then
    echo "## Agent Configuration" >> "$EXPORT_FILE"
    echo "" >> "$EXPORT_FILE"
    echo '```json' >> "$EXPORT_FILE"
    cat "$PROJECT_NAME/.agent/config.json" >> "$EXPORT_FILE"
    echo '```' >> "$EXPORT_FILE"
    echo "" >> "$EXPORT_FILE"
fi

# Add recent session notes
echo "## Recent Session Notes" >> "$EXPORT_FILE"
echo "" >> "$EXPORT_FILE"
if [ -d "$PROJECT_NAME/progress" ] && [ "$(ls -A "$PROJECT_NAME/progress")" ]; then
    for file in "$PROJECT_NAME/progress"/*.md; do
        if [ -f "$file" ]; then
            echo "### $(basename "$file")" >> "$EXPORT_FILE"
            echo "" >> "$EXPORT_FILE"
            cat "$file" >> "$EXPORT_FILE"
            echo "" >> "$EXPORT_FILE"
        fi
    done
fi

echo "✅ Export created: $EXPORT_FILE"
echo ""
echo "To use with NotebookLM:"
echo "1. Copy the export file content"
echo "2. Go to https://notebooklm.google.com/"
echo "3. Create new notebook and paste content"
echo "4. Ask architectural questions"
echo ""
