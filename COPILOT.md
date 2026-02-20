# GitHub Copilot Configuration

This file contains instructions for GitHub Copilot integration with your project workspace.

## Quick Reference

**Resume:** Type "resume [project-name]" in chat to load last session context
**Session End:** Type "session end" or "end session" to save progress
**Progress:** Stored in `[project]/progress/` directory

## Project Structure

```
[project]/
├── notes/
│   ├── notes/          # Session notes & decisions
│   └── log/            # Meeting transcripts & logs
├── progress/           # Session progress tracking
├── .agent/
│   ├── config.json     # Provider configuration
│   └── copilot.md      # This file
├── PROJECT.md          # Project overview
└── DECISIONS.md        # Key architectural decisions
```

## Working with Projects

### Start a Session

When you open a project folder in your IDE (VS Code, JetBrains, etc.):

1. Open the project directory
2. Open GitHub Copilot chat
3. Type: `resume [project-name]`

### Available Commands

**Session Management:**
- `resume [project-name]` - Load last session context
- `session end` - Save session progress to `progress/[date]-slug.md`

**Project Commands:**
- `@workspace` - Reference project files in Copilot chat
- `#file-reference` - Link to specific project files

### Project Registry

See `AGENTS.md` in the workspace root for:
- List of all projects
- Project types and providers
- Repository locations
- Integration information

## Session Tracking

When you type `session end` in Copilot chat:

1. A progress file is created: `[project]/progress/[date]-slug.md`
2. It contains:
   - What was accomplished
   - Results and outcomes
   - Next steps and blockers
   - Context for resuming work

When you resume later, Copilot will load this progress file and understand your work context.

## Provider Configuration

Copilot respects the `.agent/config.json` file:

```json
{
  "provider": "copilot",
  "provider_options": {
    "ide": "vscode",
    "chat_model": "gpt-4"
  },
  "features": [
    "code-completion",
    "inline-chat",
    "pull-request-review"
  ],
  "notifications": {
    "enabled": true,
    "style": "ide-notifications"
  }
}
```

**Available Options:**
- `ide`: vscode, jetbrains, visual-studio, neovim
- `chat_model`: gpt-4, gpt-3.5-turbo (based on your subscription)
- `features`: code-completion, inline-chat, pull-request-review, command-palette

## IDE-Specific Setup

### VS Code

1. Install [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
2. Install [GitHub Copilot Chat extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)
3. Sign in with your GitHub account
4. Open project folder
5. Use `cmd+shift+l` (macOS) or `ctrl+shift+l` (Windows/Linux) for chat

### JetBrains IDE (IntelliJ, WebStorm, etc.)

1. Install [GitHub Copilot plugin](https://plugins.jetbrains.com/plugin/17718-github-copilot)
2. Sign in with GitHub account
3. Use `cmd+k` (macOS) or `ctrl+k` (Windows/Linux) for chat

### Visual Studio

1. Install [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
2. Sign in with GitHub account
3. Use chat window from IDE

## Multi-Project Workspace

When managing multiple projects with Copilot:

1. Open workspace folder (parent directory)
2. Copilot can see all projects via `AGENTS.md`
3. Use `resume [project-name]` to switch context
4. Each project's session tracking is independent

## Tips for Effective Use

✅ **Provide context:** Reference files using `@workspace` to give Copilot project knowledge
✅ **Use session tracking:** End sessions with `session end` for continuity
✅ **Leverage workspace:** Copilot can see multiple projects if workspace is open
✅ **Check AGENTS.md:** Understand your project structure before asking Copilot questions

## Troubleshooting

**Copilot doesn't understand project context:**
- Make sure you're working in the project directory
- Type `resume [project-name]` to load context
- Use `@workspace` to reference project files

**Session files not created:**
- Type `session end` exactly as shown
- Make sure you're in the IDE's integrated terminal

**Can't find project:**
- Check `AGENTS.md` for project name spelling
- Make sure project directory exists at `[project]/`

---

**Configuration file for:** GitHub Copilot
**Location:** Repository root + `[project]/.agent/copilot.md`
**Auto-loaded:** When opening project in supported IDE
