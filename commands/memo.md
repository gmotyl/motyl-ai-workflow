# Memo Command

**Purpose:** Quick capture of thoughts, ideas, and notes during work sessions.

## Usage

```
/memo Your quick thought here
/memo  # Opens interactive input mode
```

## What It Does

1. Captures brief notes/thoughts without formal structure
2. Appends to `notes/notes/[date]-memos.md` with timestamp
3. Preserves continuity across multiple captures

## Output Location

`notes/notes/[YYYY-MM-DD]-memos.md`

## Example

```
$ /memo Implement user authentication with JWT tokens

✅ Memo saved to: notes/notes/2026-02-20-memos.md
```

## Implementation

### For Claude Code (Built-in)
Use `/memo` command directly - it's a built-in skill.

### For GitHub Copilot
Copilot reads this `.md` file and understands to:
1. Read the user's input after `/memo`
2. Create/append to `notes/notes/[date]-memos.md`
3. Add timestamp and content
4. Confirm save location

### For Command Line
```bash
./commands/memo.sh "Your thought"
```

## Notes

- No formal structure required—just capture what's on your mind
- Useful for quick ideas during development
- For structured notes, use `/note` instead
- Memos auto-timestamp for reference
