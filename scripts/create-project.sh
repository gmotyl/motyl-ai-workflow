#!/bin/bash

set -e

echo "🚀 Create New Project"
echo "===================="
echo ""

# Get project name
read -p "Project name: " PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Project name required"
    exit 1
fi

if [ -d "$PROJECT_NAME" ]; then
    echo "❌ Project directory already exists"
    exit 1
fi

# Get project type
echo ""
echo "Project type:"
echo "1) personal"
echo "2) work"
echo "3) freelance"
read -p "Choose (1-3): " PROJECT_TYPE_CHOICE

case $PROJECT_TYPE_CHOICE in
    1) PROJECT_TYPE="personal" ;;
    2) PROJECT_TYPE="work" ;;
    3) PROJECT_TYPE="freelance" ;;
    *) echo "Invalid choice"; exit 1 ;;
esac

# Get provider
echo ""
echo "AI Provider:"
echo "1) claude"
echo "2) kilocode"
echo "3) copilot"
echo "4) qwen"
echo "5) gemini"
echo "6) custom"
read -p "Choose (1-6): " PROVIDER_CHOICE

case $PROVIDER_CHOICE in
    1) PROVIDER="claude" ;;
    2) PROVIDER="kilocode" ;;
    3) PROVIDER="copilot" ;;
    4) PROVIDER="qwen" ;;
    5) PROVIDER="gemini" ;;
    6) read -p "Enter provider name: " PROVIDER ;;
    *) echo "Invalid choice"; exit 1 ;;
esac

# Get team (optional)
read -p "Team name (optional, press Enter to skip): " TEAM
if [ -z "$TEAM" ]; then
    TEAM="Solo"
fi

# Create project structure
mkdir -p "$PROJECT_NAME"/{notes,progress,.agent}

# Generate PROJECT.md
cat > "$PROJECT_NAME/PROJECT.md" << EOFMD
# $PROJECT_NAME

**Type:** $PROJECT_TYPE
**Provider:** $PROVIDER
**Created:** $(date +%Y-%m-%d)
**Team:** $TEAM

## Overview

[Describe your project here]

## Folder Structure

- \`notes/\` - Session notes, decisions, discussions
- \`progress/\` - Session tracking
- \`.agent/\` - AI provider configuration
- \`PROJECT.md\` - This file
- \`DECISIONS.md\` - Key architectural decisions

## Getting Started

Review DECISIONS.md for key decisions and project architecture.

---

Happy coding! 🚀
EOFMD

# Generate DECISIONS.md
cat > "$PROJECT_NAME/DECISIONS.md" << 'EOFDEC'
# Key Decisions

[Document your architectural and project decisions here]

---

Add decisions as the project evolves.
EOFDEC

# Generate .agent/config.json
cat > "$PROJECT_NAME/.agent/config.json" << EOFJSON
{
  "provider": "$PROVIDER",
  "provider_options": {},
  "features": [],
  "notifications": {
    "enabled": true,
    "style": "system-sounds"
  }
}
EOFJSON

# Create placeholders
touch "$PROJECT_NAME/notes/.gitkeep"
touch "$PROJECT_NAME/progress/.gitkeep"

echo ""
echo "✅ Project created: $PROJECT_NAME/"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. Update PROJECT.md with your project description"
echo "3. Start coding with your configured provider"
echo ""
