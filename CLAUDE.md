# Claude Code Configuration

## Instructions for Every Session

**IMPORTANT: Start every conversation by reading AGENTS.md**

At the beginning of each session:

1. Read `AGENTS.md` to understand:
   - Project registry and their tracking
   - Session tracking rules and commands
   - Available commands
   - Code style guidelines

2. If the user says "resume [project]" or "resume":
   - Look up the most recent progress file in `notes/[project]/progress/`
   - Display the appropriate formatted response
   - Never skip this - it's how work continuity is maintained

3. If the user says "session end" or "end session":
   - Create/update `notes/[project]/progress/[date]-slug.md`
   - Commit and push to remote if configured
   - Start a new session automatically

4. Follow all project knowledge and commands documented in AGENTS.md

## Quick Reference

**Resume Usage:** `resume [project-name]` → Get project context

**Commands:** memo, note, question/q, bootstrap

**Session Tracking:** Active - write "session end" to finalize

## Folder Structure

```
notes/
  [project]/
    /notes - session notes, decisions
    /progress - session tracking files
      [date]-slug.md
    PROJECT.md - project overview
    DECISIONS.md - key architectural decisions
.agent/
  config.json - provider configuration
```

## How to Add New Projects

Use the project creation script:

```bash
./scripts/create-project.sh
```

This will:
1. Ask for project name, type, and provider
2. Create directory structure
3. Generate PROJECT.md and DECISIONS.md
4. Update AGENTS.md registry (optional)
5. Create CLAUDE.md configuration for the project

---

**Configuration file for:** Claude Code sessions
**Location:** Repository root
**Auto-loaded:** Before each Claude Code session
