# Note Command

**Purpose:** Create and manage structured session notes with context, decisions, and next steps. Integrates with Quill for meeting minutes and transcripts.

## Usage

```
/note                    # Creates today's session note
/note my-session-topic   # Create specific topic note
/note metro              # Search Quill for "metro" meeting, create note from minutes
```

## What It Does

1. Creates structured note file with sections for summary, points, decisions, and next steps
2. Opens in default editor for quick editing
3. Stores in `notes/notes/[topic].md`
4. **QUILL INTEGRATION:** Search for meetings by name/topic
5. **QUILL INTEGRATION:** Extract meeting minutes and create notes from them
6. Preserves session context for continuity

## Output Location

`notes/notes/[topic].md`

## Template Structure

```markdown
# [Topic]

**Created:** [Date and time]

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

## Example

```
$ /note auth-implementation

📝 Creating new note: notes/notes/auth-implementation.md
✅ Note saved

[Editor opens for editing]
```

## Quill Integration

When using `/note [meeting-name]`, the system:

1. **Searches Quill** for meetings matching the name
2. **Retrieves minutes** from most recent matching meeting
3. **Extracts key information:**
   - Meeting title and participants
   - Key decisions
   - Action items
   - Important context
4. **Creates note** in `notes/notes/[meeting-name].md` with:
   - Meeting metadata
   - Minutes summary
   - Key decisions and action items
   - Links to Quill meeting ID for reference

### Example: `/note metro`

```
❯ note metro

🔍 Searching Quill for meetings: "metro"
✓ Found: Growth Eng & Engineering Support sync (2025-11-19)

📋 Retrieving minutes...
✓ Meeting ID: 96e27c27-5957-472f-8938-324f952c880f

📝 Creating note: notes/notes/metro.md

## Growth Eng & Engineering Support sync

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

✅ Note created from Quill meeting minutes
```

## Implementation

### For Claude Code (Built-in)
Use `/note` command directly - it's a built-in skill that integrates with Quill.

### For GitHub Copilot
Copilot reads this `.md` file and understands to:
1. Parse the topic from user input (or use date as default)
2. **If topic matches a Quill meeting:**
   - Search Quill for matching meetings
   - Retrieve minutes from most recent match
   - Extract key decisions and action items
   - Create note with Quill content + project template
3. **If no Quill match:**
   - Create blank `notes/notes/[topic].md` with template structure
4. Open in editor if available (EDITOR env var, nano, vi)
5. Confirm save location and Quill integration status

### For Command Line
```bash
./commands/note.sh auth-implementation
./commands/note.sh metro   # Searches Quill
```

## Notes

- Use at end of development sessions for continuity
- Complements `/memo` for structured information
- Editor used: `$EDITOR`, then nano, then vi
- Appends to existing note if it already exists
- Template provides consistent structure across team
