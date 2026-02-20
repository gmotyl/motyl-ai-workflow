# Note Command

**Purpose:** Create and manage structured session notes with context, decisions, and next steps. Integrates with Quill for meeting minutes and transcripts. **Project-aware: automatically uses correct project directory.**

## Usage

```
/note                    # Creates today's session note (generic)
/note my-session-topic   # Create specific topic note (generic)
/note my-app             # Create note in my-app project (if registered in AGENTS.md)
/note my-project         # Search Quill for "my-project" meeting, create note from minutes
```

## What It Does

1. **Checks if topic is a registered project** in AGENTS.md
   - If yes: Create note in `[project-notes-path]/notes/`
   - If no: Create note in `notes/notes/`
2. Auto-initializes project directory structure if needed
3. Creates structured note file with sections for summary, points, decisions, and next steps
4. Opens in default editor for quick editing
5. **QUILL INTEGRATION:** Search for meetings by name/topic
6. **QUILL INTEGRATION:** Extract meeting minutes and create notes from them
7. Preserves session context for continuity

## Output Location

**Smart routing based on AGENTS.md:**
- `/note my-app` → Uses project path from AGENTS.md → `notes/my-app/notes/[date]-slug.md`
- `/note my-project` → Uses project path from AGENTS.md → `notes/my-project/notes/[date]-slug.md`
- `/note my-topic` → Generic note → `notes/notes/my-topic.md`

## Template Structure

Used for both generic notes and project-specific notes:

```markdown
# [Topic or Meeting Title]

**Created:** [Date and time]
**Project:** [Project name, if project-aware]

## Summary
[Your summary here]

## Key Points
- [Point 1]
- [Point 2]

## Decisions Made
- [Decision 1]
- [Decision 2]

## Next Steps
- [Step 1]
- [Step 2]
```

**Stored in:**
- Generic: `notes/notes/[topic].md`
- Project: `notes/[project-path]/notes/[date]-slug.md`

## Example: Generic Topic

```
$ /note auth-implementation

📝 Creating new note: notes/notes/auth-implementation.md
✅ Note saved

[Editor opens for editing]
```

## Example: Registered Project

```
$ /note my-app

✓ Found project "my-app" in AGENTS.md
✓ Project notes path: notes/my-app/
✓ Auto-initializing directory structure...

📝 Creating new note: notes/my-app/notes/2026-02-20-session.md
✅ Note saved

[Editor opens for editing]
```

## Quill Integration

When using `/note [meeting-name]`, the system:

1. **First checks AGENTS.md** - Is this a registered project?
   - If yes: Use project's notes path
   - If no: Continue to Quill search
2. **Searches Quill** for meetings matching the name
3. **Retrieves minutes** from most recent matching meeting
4. **Extracts key information:**
   - Meeting title and participants
   - Key decisions
   - Action items
   - Important context
5. **Creates note** with:
   - Meeting metadata
   - Minutes summary
   - Key decisions and action items
   - Links to Quill meeting ID for reference

### Example: `/note my-project` (Project)

```
❯ /note my-project

✓ Found project "my-project" in AGENTS.md
✓ Project notes path: notes/my-project/notes/

🔍 Searching Quill for meetings: "my-project"
✓ Found: Team Sync - Project Planning (2025-11-19)

📋 Retrieving minutes...
✓ Meeting ID: 96e27c27-5957-472f-8938-324f952c880f

📝 Creating note: notes/my-project/notes/2026-02-20-project-planning.md

## Team Sync - Project Planning

**Meeting Date:** November 19, 2025
**Participants:** [extracted from Quill]

### Key Decisions
- [Extracted from meeting minutes]

### Action Items
- [ ] [Action 1]
- [ ] [Action 2]

### Important Context
[Meeting summary]

**Quill Link:** [Meeting ID]

✅ Note created from Quill meeting minutes in project directory
```

## Implementation

### For Claude Code (Built-in)
Use `/note` command directly - it's a built-in skill that:
1. **Reads AGENTS.md** to check if topic is a registered project
2. If found: Uses project's notes path from AGENTS.md
3. If not: Uses generic `notes/notes/` path
4. Integrates with Quill for meeting search and minutes extraction
5. Auto-initializes directory structure as needed

### For GitHub Copilot
Copilot reads this `.md` file and understands to:
1. Parse the topic from user input (or use date as default)
2. **CRITICAL: Read AGENTS.md and check if topic is a registered project**
   - If yes: Get notes path from project registry
   - If no: Use `notes/notes/`
3. **If topic matches a Quill meeting:**
   - Search Quill for matching meetings
   - Retrieve minutes from most recent match
   - Extract key decisions and action items
   - Create note with Quill content in project directory
4. **If no Quill match:**
   - Create blank note with template structure
   - Use project directory if registered, else `notes/notes/`
5. Auto-create directory structure if needed (notes/, notes/notes/, etc.)
6. Open in editor if available (EDITOR env var, nano, vi)
7. Confirm save location and Quill integration status

### For Command Line
```bash
./commands/note.sh auth-implementation      # Generic note
./commands/note.sh my-app                   # Project note (if registered)
./commands/note.sh my-project               # Project note + Quill search
```

## Notes

- Use at end of development sessions for continuity
- Complements `/memo` for structured information
- Editor used: `$EDITOR`, then nano, then vi
- Appends to existing note if it already exists
- Template provides consistent structure across team
