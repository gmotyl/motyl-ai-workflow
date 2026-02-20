# Claude Code Commands

This directory contains command scripts for use with Claude Code slash commands.

## Available Commands

### `/memo` - Quick Note Capture
Captures quick thoughts and memos into your project's notes directory.

**Usage:**
```
/memo Your quick thought here
/memo  # Opens interactive input
```

**Output:** Creates/appends to `notes/notes/[date]-memos.md`

---

### `/note` - Save Session Notes
Create or update session notes with structured information.

**Usage:**
```
/note                    # Creates today's session note
/note my-topic-name      # Create specific topic note
```

**Output:** Creates/opens `notes/notes/[topic].md`

Template includes:
- Summary section
- Key points
- Decisions made
- Next steps

---

### `/question` or `/q` - Query Project Knowledge
Search project documentation and notes for answers.

**Usage:**
```
/question What is the project architecture?
/q How do I set up the environment?
```

**Searches:** PROJECT.md, DECISIONS.md, CLAUDE.md, notes/

---

### `/bootstrap` - Initialize Project Structure
Sets up PROJECT.md, DECISIONS.md, and directory structure.

**Usage:**
```
/bootstrap
```

**Creates:**
- PROJECT.md (project overview and quick start)
- DECISIONS.md (key architectural decisions)
- notes/notes/ (for session notes)
- notes/log/ (for transcripts)
- progress/ (for session tracking)

---

## Implementation

These commands are shell scripts stored in the `commands/` directory.

To use them with Claude Code, Claude reads this directory and makes them available as slash commands.

### Command File Format

Each command is a `.sh` file:
- Executable with `#!/bin/bash`
- Takes command arguments
- Can prompt for input
- Should provide clear feedback

### Adding New Commands

Create a new `.sh` file in this directory:

```bash
#!/bin/bash
# /mycommand - Description

# Your implementation
echo "Command executed"
```

Make it executable:
```bash
chmod +x commands/mycommand.sh
```

---

## Environment Variables

Commands have access to:
- `PROJECT_ROOT` - Project root directory (default: `.`)
- `NOTES_DIR` - Notes directory (usually `notes/notes`)
- Standard shell variables (PWD, HOME, etc.)

---

## Tips

- Use `/memo` for quick captures during work
- Use `/note [topic]` at the end of sessions
- Use `/question` to find answers without leaving Claude
- Use `/bootstrap` to initialize new projects properly

---

For more information, see `CLAUDE.md` in the project root.
