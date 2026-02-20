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
mkdir -p "$PROJECT_NAME"/.agent
mkdir -p "$PROJECT_NAME"/notes/{notes,log}
mkdir -p "$PROJECT_NAME"/progress

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
touch "$PROJECT_NAME/notes/notes/.gitkeep"
touch "$PROJECT_NAME/notes/log/.gitkeep"
touch "$PROJECT_NAME/progress/.gitkeep"

# Generate Claude-specific config if using Claude
if [ "$PROVIDER" = "claude" ]; then
    cat > "$PROJECT_NAME/.agent/claude.md" << EOFCLAUDE
# Claude Code Configuration for $PROJECT_NAME

## Quick Reference

**Resume:** \`resume $PROJECT_NAME\`
**Session End:** Type "session end" or "end session"
**Progress:** Stored in \`progress/\` directory

## Folder Structure

- \`notes/notes/\` - Session notes and decisions
- \`notes/log/\` - Meeting transcripts (if applicable)
- \`progress/\` - Session progress tracking (auto-created on session end)
- \`PROJECT.md\` - Project overview
- \`DECISIONS.md\` - Key architectural decisions
- \`.agent/config.json\` - Provider configuration

## Available Commands

- \`/memo\` - Quick capture thoughts
- \`/note\` - Process meeting transcripts
- \`/question\` or \`/q\` - Query project knowledge
- \`/bootstrap\` - Initialize advanced indexing

## Sessions

Sessions auto-track when you work. Use \`session end\` to finalize and save progress.

---

Auto-generated for: $PROJECT_NAME
Type: $PROJECT_TYPE
Created: $(date +%Y-%m-%d)
EOFCLAUDE
fi

echo ""
echo "✅ Project created: $PROJECT_NAME/"
echo ""
echo "Project structure:"
echo "  $PROJECT_NAME/"
echo "  ├── notes/"
echo "  │   ├── notes/          # Session notes & decisions"
echo "  │   └── log/            # Transcripts & logs"
echo "  ├── progress/           # Session tracking (auto-populated)"
echo "  ├── .agent/config.json  # Provider configuration"
echo "  ├── PROJECT.md          # Project overview"
echo "  └── DECISIONS.md        # Key decisions"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. Update PROJECT.md with your project description"
if [ "$PROVIDER" = "claude" ]; then
    echo "3. Review .agent/claude.md for Claude Code setup"
fi
echo ""
echo "To register in AGENTS.md (project registry):"
read -p "Register this project in AGENTS.md? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Add entry to AGENTS.md if it exists in parent directory
    if [ -f "../AGENTS.md" ]; then
        cd ..
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
        cd "$PROJECT_NAME"
    else
        echo "⚠️  Parent AGENTS.md not found. Register manually:"
        echo "   Run: ../scripts/register-project.sh"
    fi
fi
echo ""
