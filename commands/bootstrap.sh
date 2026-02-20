#!/bin/bash
# /bootstrap - Initialize PROJECT.md and project structure

set -e

PROJECT_ROOT="${PROJECT_ROOT:-.}"

echo "🚀 Project Bootstrap"
echo "===================="
echo ""

# Check if PROJECT.md exists
if [ -f "$PROJECT_ROOT/PROJECT.md" ]; then
    echo "✓ PROJECT.md already exists"
    echo "  Update it manually with your project details"
else
    echo "Creating PROJECT.md..."
    cat > "$PROJECT_ROOT/PROJECT.md" << 'EOF'
# Project Overview

**Created:** $(date +%Y-%m-%d)

## Quick Summary

[One paragraph describing your project]

## Goals

- [ ] [Goal 1]
- [ ] [Goal 2]
- [ ] [Goal 3]

## Architecture

[Describe the system architecture]

### Key Components

- **Component 1** - Description
- **Component 2** - Description

## Technology Stack

- Language: [Your language]
- Framework: [Your framework]
- Database: [Your database]
- Tools: [Your tools]

## Getting Started

### Prerequisites

```bash
# List requirements
- Node.js 18+
- [Other requirements]
```

### Installation

```bash
# Setup steps
git clone ...
cd project
npm install
```

### Running

```bash
# How to run
npm run dev
```

## Project Structure

```
.
├── src/              # Source code
├── tests/            # Test files
├── docs/             # Documentation
├── DECISIONS.md      # Key decisions
└── README.md         # Project readme
```

## Key Files

- **PROJECT.md** - This file
- **DECISIONS.md** - Architectural decisions
- **progress/** - Session tracking
- **notes/notes/** - Session notes

## Useful Commands

- `/memo` - Quick note capture
- `/note` - Save session notes
- `/question` - Query project knowledge
- `session end` - Save session progress

## Status

**Last Updated:** $(date +%Y-%m-%d)
**Active Development:** Yes

---

See DECISIONS.md for key architectural decisions.
EOF
    echo "✅ PROJECT.md created"
fi

# Check if DECISIONS.md exists
if [ -f "$PROJECT_ROOT/DECISIONS.md" ]; then
    echo "✓ DECISIONS.md already exists"
else
    echo "Creating DECISIONS.md..."
    cat > "$PROJECT_ROOT/DECISIONS.md" << 'EOF'
# Key Decisions

## Architecture Decisions

### Decision 1: [Topic]
- **Date:** $(date +%Y-%m-%d)
- **Context:** [Why this decision was needed]
- **Decision:** [What was decided]
- **Consequences:** [What this enables/restricts]

---

Add decisions as the project evolves.
Each decision should document the context, choice, and reasoning.
EOF
    echo "✅ DECISIONS.md created"
fi

# Create necessary directories
mkdir -p "$PROJECT_ROOT/notes/notes"
mkdir -p "$PROJECT_ROOT/notes/log"
mkdir -p "$PROJECT_ROOT/progress"

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "Next steps:"
echo "1. Edit PROJECT.md with your project details"
echo "2. Edit DECISIONS.md with your architectural decisions"
echo "3. Use /memo for quick notes"
echo "4. Use /note to save session notes"
echo ""
