# Bootstrap Command

**Purpose:** Initialize new project with PROJECT.md, DECISIONS.md, and proper directory structure.

## Usage

```
/bootstrap  # Initialize current project
```

## What It Does

1. Creates PROJECT.md (project overview template)
2. Creates DECISIONS.md (architectural decisions template)
3. Creates directory structure:
   - `notes/notes/` - For session notes
   - `notes/log/` - For transcripts
   - `progress/` - For session tracking
4. Confirms existing files (doesn't overwrite)

## Output Files

- `PROJECT.md` - Comprehensive project overview template
- `DECISIONS.md` - Architectural decisions template
- `notes/notes/` - Directory for structured notes
- `notes/log/` - Directory for transcripts/logs
- `progress/` - Directory for session progress files

## Template Contents

### PROJECT.md Includes
- Project metadata (type, created date, team)
- Quick summary
- Goals
- Architecture
- Technology stack
- Getting started guide
- Project structure
- Key files reference
- Status and useful commands

### DECISIONS.md Includes
- Key decision template
- Context documentation
- Decision rationale
- Consequences and tradeoffs

## Example

```
$ /bootstrap

🚀 Project Bootstrap
===================

Creating PROJECT.md...
✅ PROJECT.md created

Creating DECISIONS.md...
✅ DECISIONS.md created

✅ Bootstrap complete!

Next steps:
1. Edit PROJECT.md with your project details
2. Edit DECISIONS.md with your architectural decisions
3. Use /memo for quick notes
4. Use /note to save session notes
```

## Implementation

### For Claude Code (Built-in)
Use `/bootstrap` - built-in skill that initializes projects.

### For GitHub Copilot
Copilot reads this `.md` file and understands to:
1. Check if PROJECT.md and DECISIONS.md exist
2. Create them if missing (with templates)
3. Create directory structure (notes/notes, notes/log, progress)
4. Report what was created
5. Suggest next steps

### For Command Line
```bash
./commands/bootstrap.sh
```

## Notes

- Safe to run multiple times (doesn't overwrite existing files)
- Use at project start for consistency
- Provides templates with standard structure
- Enables team workflows with consistent documentation
- Required before session tracking works properly
