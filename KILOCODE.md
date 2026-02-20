# Kilocode CLI Configuration

This file contains instructions for Kilocode CLI integration with your project workspace.

## Quick Reference

**Resume:** `kilocode [project-name] resume`
**Session End:** Type "session end" or "end session" to save progress
**Progress:** Stored in `[project]/progress/` directory
**Config:** `[project]/.agent/config.json`

## Installation

```bash
# Install Kilocode CLI globally
npm install -g kilocode

# Or use with npx
npx kilocode --help
```

## Project Structure

```
[project]/
├── notes/
│   ├── notes/          # Session notes & decisions
│   └── log/            # Meeting transcripts & logs
├── progress/           # Session progress tracking
├── .agent/
│   ├── config.json     # Provider configuration
│   └── kilocode.md     # This file
├── PROJECT.md          # Project overview
└── DECISIONS.md        # Key architectural decisions
```

## Working with Projects

### Start a Session

```bash
cd [project]
kilocode resume
```

Kilocode will:
1. Load the last session progress
2. Display context from `progress/[date]-slug.md`
3. Initialize the AI session with project knowledge

### Available Commands

**Session Management:**
```bash
kilocode resume [project-name]    # Resume last session
kilocode new                        # Start new project session
kilocode session list              # List recent sessions
```

**Interactive Mode:**
```bash
kilocode                           # Start interactive mode
# Then in the CLI:
> resume [project-name]
> session end
> help
```

## Using Kilocode in Interactive Mode

```bash
$ cd my-project
$ kilocode

Kilocode CLI v1.x.x
Type "help" for commands

> resume
✅ Session context loaded from: progress/2026-02-20-feature-work.md

> [your prompt here]
Generating response...

> session end
✅ Session saved to: progress/2026-02-21-continued-work.md
```

## Configuration

Kilocode respects `.agent/config.json`:

```json
{
  "provider": "kilocode",
  "provider_options": {
    "mode": "interactive",
    "timeout": 300,
    "context_window": "4k"
  },
  "features": [
    "code-generation",
    "debugging",
    "test-writing",
    "documentation"
  ],
  "notifications": {
    "enabled": true,
    "style": "terminal-bell"
  }
}
```

**Available Options:**
- `mode`: interactive, batch, watch
- `context_window`: 2k, 4k, 8k, 16k
- `timeout`: Seconds to wait for response (default: 300)
- `stream_output`: true/false - stream responses as they're generated

## Session Tracking

When you type `session end`:

1. Kilocode saves the conversation to: `[project]/progress/[date]-slug.md`
2. The file contains:
   - Conversation transcript
   - Decisions made
   - Code generated
   - Next steps and blockers
3. Next session, `kilocode resume` loads this context

## Autonomous Mode (Optional)

Kilocode can run autonomously with instructions:

```bash
# Run specific task file
kilocode run --task ./tasks/feature-implementation.md

# With auto-session management
kilocode run --task ./tasks/feature-implementation.md --session-end
```

Create a task file in your project:

```yaml
# tasks/feature-implementation.md
---
project: my-project
task: Implement user authentication
context_files:
  - PROJECT.md
  - DECISIONS.md
---

## Requirements
1. Add login form
2. Implement JWT tokens
3. Write unit tests

## Deliverables
- [ ] Authentication form
- [ ] Token generation
- [ ] Unit tests (>80% coverage)
```

## Multi-Project Workspace

Managing multiple projects with Kilocode:

```bash
# List all projects
kilocode projects list

# Resume specific project from anywhere
kilocode [project-name] resume

# See all recent sessions
kilocode sessions list --all
```

## Integration with Project Registry

Kilocode reads `AGENTS.md` to understand:
- Available projects and their types
- Provider assignments
- Repository locations
- Integration information

Use project names from AGENTS.md when running Kilocode commands.

## Tips for Effective Use

✅ **Use resume:** Always start with `kilocode resume` to load context
✅ **End sessions:** Type `session end` to save progress for next session
✅ **Keep notes:** Store important decisions in `notes/notes/` directory
✅ **Update DECISIONS.md:** Document architectural choices for continuity
✅ **Leverage context_files:** Reference PROJECT.md and DECISIONS.md in sessions

## Example Workflow

```bash
# Day 1: Start new feature
$ cd my-project
$ kilocode
> resume
✅ Context loaded

> Implement user authentication feature as outlined in PROJECT.md
[Kilocode generates code and explanations]

> session end
✅ Saved to progress/2026-02-20-auth-implementation.md

---

# Day 2: Continue work
$ kilocode my-project resume
✅ Context loaded: progress/2026-02-20-auth-implementation.md

> Continue from where I left off, add password reset functionality
[Kilocode has full context from previous session]

> session end
✅ Saved to progress/2026-02-21-password-reset.md
```

## Troubleshooting

**Kilocode doesn't find project:**
- Make sure you're in the project directory
- Check that project name matches AGENTS.md entry
- Run `kilocode projects list` to verify registration

**Session not saved:**
- Type `session end` exactly (not "session-end" or variations)
- Make sure `progress/` directory exists and is writable
- Check disk space

**Context not loading:**
- Verify progress files exist in `[project]/progress/`
- Check file dates with `ls -ltr [project]/progress/`
- Run `kilocode sessions list` to see available sessions

**Timeout issues:**
- Increase timeout in `.agent/config.json`: `"timeout": 600`
- Check internet connection
- Try batch mode instead of interactive

---

**Configuration file for:** Kilocode CLI
**Location:** Repository root + `[project]/.agent/kilocode.md`
**Default mode:** Interactive with session tracking
**Authentication:** GitHub account (or API key)
