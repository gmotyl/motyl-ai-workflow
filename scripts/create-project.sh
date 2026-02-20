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

if [ -d "notes/$PROJECT_NAME" ]; then
    echo "❌ Project directory already exists at notes/$PROJECT_NAME"
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

# Create project structure in notes/ folder
mkdir -p "notes/$PROJECT_NAME"/.agent
mkdir -p "notes/$PROJECT_NAME"/notes/{notes,log}
mkdir -p "notes/$PROJECT_NAME"/progress

# Generate PROJECT.md
cat > "notes/$PROJECT_NAME/PROJECT.md" << EOFMD
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
cat > "notes/$PROJECT_NAME/DECISIONS.md" << 'EOFDEC'
# Key Decisions

[Document your architectural and project decisions here]

---

Add decisions as the project evolves.
EOFDEC

# Generate .agent/config.json
cat > "notes/$PROJECT_NAME/.agent/config.json" << EOFJSON
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
touch "notes/$PROJECT_NAME/notes/notes/.gitkeep"
touch "notes/$PROJECT_NAME/notes/log/.gitkeep"
touch "notes/$PROJECT_NAME/progress/.gitkeep"

# Get script directory for template access
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TEMPLATE_DIR="$(dirname "$SCRIPT_DIR")/templates"

# Generate provider-specific configuration files in CORRECT locations
case $PROVIDER in
    claude)
        # Claude uses: CLAUDE.md (memory) + .claude/settings.json (config)
        mkdir -p "notes/$PROJECT_NAME/.claude"

        # Create CLAUDE.md from template
        cat "$TEMPLATE_DIR/claude-memory.md" | \
            sed "s|{{PROJECT_NAME}}|$PROJECT_NAME|g" | \
            sed "s|{{PROJECT_TYPE}}|$PROJECT_TYPE|g" | \
            sed "s|{{DATE}}|$(date +%Y-%m-%d)|g" | \
            sed "s|{{TEAM}}|$TEAM|g" > "notes/$PROJECT_NAME/CLAUDE.md"

        # Create .claude/settings.json from template
        cat "$TEMPLATE_DIR/claude-settings.json" > "notes/$PROJECT_NAME/.claude/settings.json"
        ;;

    kilocode)
        # Kilocode uses: opencode.json in project root
        cat "$TEMPLATE_DIR/kilocode-opencode.json" | \
            sed "s|{{PROJECT_NAME}}|$PROJECT_NAME|g" | \
            sed "s|{{PROJECT_TYPE}}|$PROJECT_TYPE|g" | \
            sed "s|{{TEAM}}|$TEAM|g" > "notes/$PROJECT_NAME/opencode.json"
        ;;

    copilot)
        # Copilot uses: .github/copilot-instructions.md (GitHub-specific instructions)
        mkdir -p "notes/$PROJECT_NAME/.github"
        cat "$TEMPLATE_DIR/copilot-instructions.md" | \
            sed "s|{{PROJECT_NAME}}|$PROJECT_NAME|g" | \
            sed "s|{{PROJECT_TYPE}}|$PROJECT_TYPE|g" | \
            sed "s|{{DATE}}|$(date +%Y-%m-%d)|g" > "notes/$PROJECT_NAME/.github/copilot-instructions.md"
        ;;

    qwen)
        # Qwen uses: .qwen/settings.json in project root
        mkdir -p "notes/$PROJECT_NAME/.qwen"
        cat "$TEMPLATE_DIR/qwen-settings.json" | \
            sed "s|{{PROJECT_NAME}}|$PROJECT_NAME|g" | \
            sed "s|{{PROJECT_TYPE}}|$PROJECT_TYPE|g" | \
            sed "s|{{TEAM}}|$TEAM|g" > "notes/$PROJECT_NAME/.qwen/settings.json"
        ;;

    gemini)
        # Gemini uses: .gemini/settings.json in project root
        mkdir -p "notes/$PROJECT_NAME/.gemini"
        cat "$TEMPLATE_DIR/gemini-settings.json" | \
            sed "s|{{PROJECT_NAME}}|$PROJECT_NAME|g" | \
            sed "s|{{PROJECT_TYPE}}|$PROJECT_TYPE|g" | \
            sed "s|{{TEAM}}|$TEAM|g" > "notes/$PROJECT_NAME/.gemini/settings.json"
        ;;

    *)
        # Custom provider - create generic config directory
        mkdir -p "notes/$PROJECT_NAME/.$PROVIDER"
        cat > "notes/$PROJECT_NAME/.$PROVIDER/README.md" << EOF
# $PROVIDER Configuration

Configure your $PROVIDER provider settings here.

See \`docs/PROVIDER-SETUP.md\` in workspace root for setup instructions.
EOF
        ;;
esac

echo ""
echo "✅ Project created: notes/$PROJECT_NAME/"
echo ""
echo "Project structure:"
echo "  notes/$PROJECT_NAME/"
echo "  ├── notes/"
echo "  │   ├── notes/          # Session notes & decisions"
echo "  │   └── log/            # Transcripts & logs"
echo "  ├── progress/           # Session tracking (auto-populated)"
echo "  ├── .agent/config.json  # Provider configuration"
echo "  ├── PROJECT.md          # Project overview"
echo "  └── DECISIONS.md        # Key decisions"
echo ""
echo "Next steps:"
echo "1. cd notes/$PROJECT_NAME"
echo "2. Update PROJECT.md with your project description"
if [ "$PROVIDER" = "claude" ]; then
    echo "3. Review CLAUDE.md for Claude Code setup"
fi
echo ""
echo "To register in AGENTS.md (project registry):"
read -p "Register this project in AGENTS.md? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Add entry to AGENTS.md if it exists in current directory
    if [ -f "AGENTS.md" ]; then
        echo ""
        REPOS="$PROJECT_NAME"
        if [ ! -z "$TEAM" ] && [ "$TEAM" != "Solo" ]; then
            REPOS="$PROJECT_NAME (Team: $TEAM)"
        fi

        # Add to AGENTS.md
        NEW_ENTRY="| $PROJECT_NAME | $PROJECT_TYPE | $PROVIDER | \`notes/$PROJECT_NAME/\` | git/$PROJECT_NAME |"

        # Check if placeholder exists
        if grep -q "^\| \[Add your projects here\]" AGENTS.md; then
            sed -i '' "/^| \[Add your projects here\]/d" AGENTS.md
        fi

        # Append to table
        echo "$NEW_ENTRY" >> AGENTS.md

        echo "✅ Registered in AGENTS.md"
        echo ""
    else
        echo "⚠️  AGENTS.md not found in current directory. Register manually:"
        echo "   Edit AGENTS.md and add this row to the Projects Registry table:"
        echo "   $NEW_ENTRY"
    fi
fi
echo ""
