#!/bin/bash

set -e

echo "📝 Register Project in AGENTS.md"
echo "================================"
echo ""

# Check if AGENTS.md exists
if [ ! -f "AGENTS.md" ]; then
    echo "❌ AGENTS.md not found in current directory"
    exit 1
fi

# Get project details
read -p "Project name: " PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Project name required"
    exit 1
fi

read -p "Project type (personal/work/freelance): " PROJECT_TYPE
read -p "AI Provider (claude/kilocode/copilot/qwen/gemini/other): " PROVIDER
read -p "Repository/Resources (comma-separated, e.g., 'git/my-app, git/my-app-backend'): " REPOS

if [ -z "$PROJECT_TYPE" ] || [ -z "$PROVIDER" ] || [ -z "$REPOS" ]; then
    echo "❌ All fields required"
    exit 1
fi

# Create the new registry entry
NEW_ENTRY="| $PROJECT_NAME | $PROJECT_TYPE | $PROVIDER | \`notes/$PROJECT_NAME/\` | $REPOS |"

# Check if project already exists in registry
if grep -q "^| $PROJECT_NAME " AGENTS.md; then
    echo "⚠️  Project already registered in AGENTS.md"
    read -p "Update existing entry? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted"
        exit 1
    fi
    # Remove old entry and add new one
    sed -i '' "/^| $PROJECT_NAME /d" AGENTS.md
fi

# Add new entry after the example entry line
if grep -q "^| \[Add your projects here\]" AGENTS.md; then
    # Insert after the placeholder
    sed -i '' "/^\| \[Add your projects here\]/a\\
| $PROJECT_NAME | $PROJECT_TYPE | $PROVIDER | \`notes/$PROJECT_NAME/\` | $REPOS |
" AGENTS.md
else
    # Find the projects registry table and append
    line_num=$(grep -n "^|" AGENTS.md | tail -1 | cut -d: -f1)
    if [ ! -z "$line_num" ]; then
        sed -i '' "${line_num}a\\
$NEW_ENTRY
" AGENTS.md
    else
        echo "$NEW_ENTRY" >> AGENTS.md
    fi
fi

echo ""
echo "✅ Project registered in AGENTS.md"
echo ""
echo "Entry:"
echo "$NEW_ENTRY"
echo ""
echo "Next steps:"
echo "1. Update notes/$PROJECT_NAME/PROJECT.md with description"
echo "2. Run: git add AGENTS.md && git commit -m 'docs: register $PROJECT_NAME project'"
echo ""
