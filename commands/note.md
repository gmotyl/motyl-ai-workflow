# Note Command

**Purpose:** Create and manage structured session notes with context, decisions, and next steps.

## Usage

```
/note                    # Creates today's session note
/note my-session-topic   # Create specific topic note
```

## What It Does

1. Creates structured note file with sections for summary, points, decisions, and next steps
2. Opens in default editor for quick editing
3. Stores in `notes/notes/[topic].md`
4. Preserves session context for continuity

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

## Implementation

### For Claude Code (Built-in)
Use `/note` command directly - it's a built-in skill.

### For GitHub Copilot
Copilot reads this `.md` file and understands to:
1. Parse the topic from user input (or use date as default)
2. Create `notes/notes/[topic].md` with template structure
3. Open in editor if available (EDITOR env var, nano, vi)
4. Confirm save location

### For Command Line
```bash
./commands/note.sh auth-implementation
```

## Notes

- Use at end of development sessions for continuity
- Complements `/memo` for structured information
- Editor used: `$EDITOR`, then nano, then vi
- Appends to existing note if it already exists
- Template provides consistent structure across team
