# motyl-ai-workflow

**Use ANY AI provider for ANY project. Same workflow structure. Infinite flexibility.**

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/motyl-ai/motyl-ai-workflow
cd motyl-ai-workflow

# Setup with your providers
npm run setup:all

# Review examples to understand the pattern
# examples/example-personal-project/
# examples/example-work-project/

# Create your first project
npm run create-project
```

## ⚠️ IMPORTANT: This is a Template for PRIVATE Use

**This template is designed for personal/private projects - NOT for public repositories with notes.**

When you fork this template:
- ✅ The template code itself is safe to version-control
- ❌ **Your actual `notes/` folder should be PRIVATE or in `.gitignore`**
- ❌ **Do NOT push your project notes, decisions, meeting transcripts to public repos**
- ✅ Your code/source files can be public - just keep notes private

### Recommended Setup

```bash
# Option 1: Private Git Repository (Recommended)
git clone https://github.com/motyl-ai/motyl-ai-workflow
# Use as PRIVATE repo for your work
# Push only code, keep notes/ in .gitignore or separate branch

# Option 2: .gitignore Notes (Good)
# Add to .gitignore:
notes/                    # All project notes
progress/                 # Session tracking
# Push template code only, notes stay local

# Option 3: Separate Branch
git checkout -b private
# Keep main branch with template code
# Work on private branch with notes
# Never push private branch
```

### What Should Stay Private

❌ Don't commit to public repos:
- Project notes and decisions (`notes/*/`)
- Session progress files (`progress/*/`)
- Meeting transcripts from Quill
- Team discussions and architectural decisions
- Client/project-specific information

✅ Safe to commit:
- Template code and scripts
- Configuration examples (without secrets)
- Documentation for other developers
- Setup guides and instructions

---

## 🎯 What is motyl-ai-workflow?

A **provider-agnostic** project management template designed for developers managing multiple projects (personal, work, freelance).

Choose **any AI provider for any project** based on your needs, budget, and preferences:
- Personal project with Kilocode? ✓ Your choice
- Personal project with Claude? ✓ Your choice
- Work project with Copilot? ✓ Your choice
- Work project with Gemini? ✓ Your choice

**Same workflow structure. Infinite provider flexibility.** Switch providers anytime—just update one config file.

## 🤔 Why motyl-ai-workflow?

### The Problem

Managing multiple projects across different contexts is complex:
- You have personal projects you want to explore freely
- You have work projects your company sponsors tools for
- You want to leverage AI agents, but not be locked into one provider
- You need a consistent workflow across all projects, regardless of the AI tool

### The Solution

**One workflow structure. Any AI provider.**

- **Provider-agnostic:** Works with Claude Code, Kilocode CLI, GitHub Copilot, QWEN, Gemini, and any future AI agent
- **Project-level configuration:** Choose your provider per project in `.agent/config.json`
- **Easy switching:** Change providers by updating one config file—no workflow changes
- **Full integration:** Todoist, GitHub, Azure DevOps, Jira, and NotebookLM support
- **Clear examples:** See how to organize projects with different providers

## 📁 What You Get

- **Folder structure** for organizing notes, decisions, progress tracking
- **Example projects** showing how to use the workflow
- **Project generator** (`create-project.sh`) to scaffold new projects quickly
- **Setup scripts** for each provider and integration
- **Comprehensive documentation** on provider selection, switching, and daily workflow
- **NotebookLM integration** for architectural analysis and planning
- **Sound notifications** support for your chosen AI agent

## 🚀 Supported Providers

First-class support:
- ✅ Claude Code (with peon-ping notifications)
- ✅ Kilocode CLI
- ✅ GitHub Copilot

Additional providers:
- ✅ QWEN
- ✅ Gemini
- ✅ Custom/Any other agent

**Not locked to any provider.** Add support for your favorite tools.

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Step-by-step setup guide
- **[docs/workflow.md](./docs/workflow.md)** - Day-to-day usage patterns
- **[docs/provider-selection.md](./docs/provider-selection.md)** - How to choose the right provider for YOUR projects
- **[docs/switching-providers.md](./docs/switching-providers.md)** - Migrate from one provider to another
- **[docs/notebooklm-integration.md](./docs/notebooklm-integration.md)** - Export projects to NotebookLM for architectural analysis
- **[agents/README.md](./agents/README.md)** - Provider setup guides

## 🎨 Example Projects

Two example projects demonstrate the flexibility:

```
examples/
├── example-personal-project/     # Your choice of provider
│   ├── .agent/config.json        # { "provider": "kilocode" }
│   └── ...
│
└── example-work-project/         # Your choice of provider
    ├── .agent/config.json        # { "provider": "claude" }
    └── ...
```

Review these to understand the folder structure and workflow patterns.

## 📋 Project Registry & Multi-Provider Support

This workspace supports **ANY AI provider** with proper configuration files in the right locations.

**Core files (workspace root):**
- **`AGENTS.md`** - Project registry + provider overview
- **`docs/PROVIDER-SETUP.md`** - COMPLETE setup guide for ALL providers
- **`docs/PROJECT-SETUP-GUIDE.md`** - General project setup guide
- **`templates/`** - Configuration templates for each provider

**When you create a project**, the correct files are generated for your chosen provider:

| Provider | Files Generated | Session Tracking |
|----------|-----------------|-----------------|
| **Claude Code** | `CLAUDE.md` + `.claude/settings.json` | ✅ Automatic |
| **Kilocode** | `opencode.json` | ✅ Automatic |
| **GitHub Copilot** | `.github/copilot-instructions.md` | Manual |
| **QWEN** | `.qwen/settings.json` | Manual |
| **Google Gemini** | `.gemini/settings.json` | Manual |

**Key Point:** Each provider expects config files in **specific locations** with **specific formats**. This template generates them correctly.

See [**PROVIDER-SETUP.md**](docs/PROVIDER-SETUP.md) for:
- Exact file locations for each provider
- Configuration file examples
- Session tracking setup
- Global vs project-level settings
- How to switch providers mid-project

## 🛠️ Quick Commands

### Project Setup
```bash
# Create a new project (interactive)
npm run create-project

# Register an existing project in AGENTS.md
npm run register-project
```

### Commands (Slash Commands in Claude/Copilot)
```
/memo                    # Quick note capture
/note topic              # Create session notes
/note meeting-name       # Create note FROM Quill meeting minutes
/question What is X?     # Search project knowledge
/bootstrap              # Initialize project structure
```

# Setup provider of choice
npm run setup:claude-code
npm run setup:kilocode-cli
npm run setup:copilot

# Setup integrations
npm run setup:todoist
npm run setup:github
npm run setup:jira

# Export project to NotebookLM for analysis
npm run export-project

# Install Claude Code skills (if using Claude)
npm run install-skills
```

## 📊 Features

### 1. Provider-Agnostic Design
Choose any AI provider. No lock-in. Switch anytime.

### 2. Per-Project Configuration
Each project has `.agent/config.json` specifying which provider to use.

### 3. Project Scaffolding
`create-project.sh` generates new projects with the correct folder structure and config.

### 4. Integration Support
- **Todoist** - Task management
- **GitHub** - Code management
- **Azure DevOps** - Team collaboration
- **Jira** - Enterprise tracking
- **NotebookLM** - Architectural analysis

### 5. Session Tracking
Track your work sessions, resume projects, prepare standups.

### 6. Sound Notifications
Get audio notifications from your AI agent (customizable per provider).

## 🔄 Daily Workflow (With Session Tracking)

### First Time: Create & Initialize Project

```
❯ /note landingpage

⚠️  Project "landingpage" not found in AGENTS.md

❓ Would you like to initialize "landingpage" as a new project?

→ Yes

  1. Project type? → Work
  2. Provider? → Claude Code

✅ Project "landingpage" initialized!
   - Created: notes/landingpage/notes/, progress/, PROJECT.md
   - Registered in AGENTS.md
   - Ready for work

[Editor opens for note editing]
```

### Morning: Start Work Session

```
❯ resume landingpage

🚀 Resume: landingpage
  Status: Ready for Development
  Type: Work | Provider: Claude Code
  Last Session: 2026-02-20 - Project initialization

  What would you like to work on?
```

### During Session: Create Notes & Memos

```
❯ /note landingpage

✓ Found project in AGENTS.md
✓ Creating note in notes/landingpage/notes/

[Editor opens - add session notes, decisions, next steps]

❯ /memo "Fixed navbar layout issue, need to review responsive design"

✓ Memo saved to notes/landingpage/notes/[date]-memos.md
```

### End of Session: Save Progress

```
❯ session end

✓ Reading project context from PROJECT.md
✓ Reading AGENTS.md registry

Session Summary:
  Project: landingpage
  Time: ~2 hours of development
  Tasks: Navbar layout, responsive testing
  Next: CSS optimization

✓ Created: notes/landingpage/progress/2026-02-20-navbar-layout.md
✓ Committed to git (branch main)

Ready for next session!
```

### Later: Resume & Continue Work

```
❯ resume landingpage

🚀 Resume: landingpage
  Last Session (2026-02-20):
    - ✅ Navbar layout fixed
    - ⏳ Next: CSS optimization

  Session Notes:
    - Fixed responsive breakpoints
    - Need to review on mobile devices

  Ready to continue!

❯ /note landingpage

[Create today's session note]
[Document: Tested on iPhone, added media queries]

❯ session end

✓ Progress tracked: notes/landingpage/progress/2026-02-21-mobile-testing.md
✓ Session committed
```

### Next Morning: Daily Standup Prep

```
❯ standup landingpage

📊 Standup Report: landingpage

  ✅ What I did (yesterday):
    - Fixed navbar layout responsive design
    - Tested on multiple mobile devices
    - CSS optimization in progress

  🚀 What I'm doing (today):
    - Continue CSS optimization
    - Test on tablet sizes
    - Performance review

  🚧 Blockers:
    - None currently

  📝 Last 2 sessions:
    1. 2026-02-21 - Mobile testing (1.5h)
    2. 2026-02-20 - Navbar layout (2h)

  📋 Open tasks: [from Todoist if integrated]
```

### Key Commands Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `/note [project]` | Create session note (auto-initializes if needed) | `/note landingpage` |
| `/memo "text"` | Quick thought capture | `/memo "Fix navbar bug"` |
| `resume [project]` | Load project context + last session | `resume landingpage` |
| `session end` | Save progress + commit | `session end` |
| `standup [project]` | Daily standup preparation | `standup landingpage` |
| `/question` | Search project knowledge | `/question "How was navbar built?"` |

## 🔀 Switching Providers

```bash
# 1. Update project config
cd my-awesome-project
# Edit .agent/config.json
# { "provider": "kilocode" } → { "provider": "claude" }

# 2. Run setup for new provider (first time only)
npm run setup:claude-code

# 3. Start using the new provider
# No workflow changes needed
```

## 📝 License

MIT - See [LICENSE](./LICENSE)

## 👤 Author

Created by Greg Motyl
[https://github.com/motyl-ai](https://github.com/motyl-ai)

---

**Start managing your projects with any AI provider you choose.**
