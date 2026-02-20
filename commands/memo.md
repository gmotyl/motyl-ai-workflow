# Memo Command

**Purpose:** Quick capture of thoughts, ideas, and notes during work sessions.

## Usage

```
/memo Your quick thought here
/memo  # Opens interactive input mode
```

## What It Does

1. **Detects current project context** from your working session
   - If in a project session: Uses project's notes directory
   - If generic: Uses `notes/notes/`
2. Captures brief notes/thoughts without formal structure
3. Appends to `[project-path]/notes/[date]-memos.md` with timestamp
4. Preserves continuity across multiple captures

## Output Location

**Project-aware routing:**
- In `landingpage` project → `notes/landingpage/notes/[YYYY-MM-DD]-memos.md`
- In `my-app` project → `notes/my-app/notes/[YYYY-MM-DD]-memos.md`
- Generic session → `notes/notes/[YYYY-MM-DD]-memos.md`

## Example: Project Context

```
❯ resume landingpage
❯ /memo Fixed navbar layout, need to test on tablet sizes

✅ Memo saved to: notes/landingpage/notes/2026-02-20-memos.md
```

## Example: Generic Context

```
❯ /memo Quick thought about authentication approach

✅ Memo saved to: notes/notes/2026-02-20-memos.md
```

## Implementation

### For Claude Code (Built-in)
Use `/memo` command directly - it's a built-in skill that:
1. **Detects project context** from current session
2. If in a project: Uses that project's notes directory
3. If generic: Uses `notes/notes/`
4. Appends memo with timestamp to correct location

### For GitHub Copilot
Copilot reads this `.md` file and understands to:
1. **Check CLAUDE.md and PROJECT.md** to detect current project
2. If project context found: Use `notes/[project]/notes/[date]-memos.md`
3. If no project: Use generic `notes/notes/[date]-memos.md`
4. Read the user's input after `/memo`
5. Create/append memo with timestamp
6. Confirm save location

### For Command Line
```bash
./commands/memo.sh "Your thought"
./commands/memo.sh --project landingpage "Your thought"  # Explicit project
```

## Notes

- No formal structure required—just capture what's on your mind
- Useful for quick ideas during development
- For structured notes, use `/note` instead
- Memos auto-timestamp for reference
