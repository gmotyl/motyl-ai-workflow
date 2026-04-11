# motyl-ai-workflow

AI-assisted multi-project workspace with local dashboard.

A starter kit for managing multiple projects with AI coding agents. Includes a local web panel for viewing notes, tracking agent activity, managing git, and searching across project knowledge. Fork it, configure it, and start working.

## Features

- **Dashboard** with auto-discovered project cards (reads `PROJECT.md` from each project folder)
- **Markdown viewer** with direct Open in VS Code integration
- **Cmd+P fuzzy file finder** + semantic search via `qmd`
- **AI agent monitoring** — live sidebar showing Claude Code, OpenCode, and Qwen sessions
- **Git panel** — status, stage, commit, and push with smart commit message templates
- **Image optimization** — drag and drop images, auto-converted to WebP via sharp
- **Real-time updates** via WebSocket (file changes reflect instantly)
- **Three-column layout** — agents sidebar, content area, file tree

## Recommended Skills — Superpowers

This workflow is designed to work with **[Superpowers](https://github.com/obra/superpowers)** — a set of AI agent skills that enforce structured brainstorming, planning, and execution workflows. Installing Superpowers transforms your AI agent from a code autocompleter into a disciplined engineering partner.

### Install

Follow the instructions at **https://github.com/obra/superpowers**

### Key Skills

| Skill | When to Use |
|-------|------------|
| `superpowers:brainstorming` | Before any implementation — collaborative design with approval gate |
| `superpowers:writing-plans` | Turn approved designs into detailed step-by-step plans |
| `superpowers:executing-plans` | Task-by-task plan execution with review checkpoints |
| `superpowers:requesting-code-review` | After completing a feature or task |
| `superpowers:systematic-debugging` | When tracing bugs methodically |

### Session Workflow

```
resume [project]
  → superpowers:brainstorming  (design before coding)
  → superpowers:writing-plans  (turn design into tasks)
  → superpowers:executing-plans (build task by task)
  → end-session                (commit progress, propose todos)
```

Skills are optional — the panel and scripts work without them — but they make the biggest difference in the quality and consistency of AI-assisted work.

## Quick Start

```bash
# Fork this repo, then:
git clone git@github.com:YOUR_USERNAME/motyl-ai-workflow.git my-workspace
cd my-workspace
cp panel/panel.config.ts panel/panel.config.local.ts
# Edit panel.config.local.ts with your paths
cd panel && npm install && npm run dev
# Open http://localhost:3010
```

## Project Structure

```
my-workspace/
├── panel/               # Local web dashboard (Vite + React + Express)
├── projects/            # Your project data (auto-discovered)
│   └── my-project/
│       ├── PROJECT.md   # Project overview (required for discovery)
│       ├── _index.json  # Machine-readable index
│       ├── notes/       # Meeting notes
│       │   └── log/     # Raw transcripts
│       ├── progress/    # Session progress tracking
│       └── plans/       # Design docs + implementation plans
├── commands/            # CLI command definitions
├── scripts/             # Utility scripts (cc, oc, backup, etc.)
├── AGENTS.md            # Agent instructions
└── CLAUDE.md            # Claude Code configuration
```

## Configuration

The panel uses a layered config approach:

- `panel/panel.config.ts` — committed defaults, safe to share
- `panel/panel.config.local.ts` — your local overrides, gitignored

Key settings:

```ts
// panel.config.local.ts
export default {
  projectsDir: "/Users/you/workspace/projects",
  port: 3010,
  agentRegistryPath: "/Users/you/.agent-registry.json",
};
```

`panel.config.local.ts` is in `.gitignore` — your paths never leak into the repo.

## Agent Tracking

The `scripts/cc` and `scripts/oc` wrapper scripts launch Claude Code and OpenCode while registering the session in a shared registry file.

How it works:

1. Run `cc` instead of `claude` — the wrapper captures the PID and writes an entry to `~/.agent-registry.json`
2. On exit, the wrapper removes the entry automatically
3. The panel sidebar polls the registry and shows live agent status

Registry format (`~/.agent-registry.json`):

```json
[
  {
    "pid": 12345,
    "agent": "claude",
    "project": "my-project",
    "startedAt": "2025-04-09T10:00:00Z"
  }
]
```

## Panel Features

### Dashboard

Lists all discovered projects. A project is discovered when its folder contains a `PROJECT.md` file. Shows project name, last activity, and open agent count.

### Markdown Viewer

Click any `.md` file to read it in the panel. The "Open in VS Code" button opens the file at the exact line in your editor. Drag and drop images into the viewer to optimize and embed them.

### Cmd+P Finder

Press `Cmd+P` anywhere in the panel to open the fuzzy file finder. Searches filenames across all projects. For semantic search across note content, use `qmd` from the terminal.

### Git Panel

Shows `git status` for each project. Stage files, write a commit message, and push — all from the browser. Commit templates pull context from the current project and session.

### File Tree

Right-hand sidebar showing the file tree for the active project. Click to navigate, right-click for basic file operations.

## Using as Your Upstream

If you've forked this repo as the foundation for your private workspace, use git subtree to track improvements one-directionally.

### One-Time Setup (in your private repo)

```bash
# Add upstream remote
git remote add upstream git@github.com:gmotyl/motyl-ai-workflow.git

# Link panel, commands, and scripts as tracked subtrees
git subtree add --prefix panel upstream main --squash
git subtree add --prefix commands upstream main --squash
git subtree add --prefix scripts upstream main --squash
```

### Upgrading

```bash
bash scripts/update.sh
```

This pulls the latest `panel/`, `commands/`, and `scripts/` from upstream. Your private project data and config are never touched.

### Private Config

After setup, copy the templates for your private data:

```bash
cp AGENTS.md.example .projects.local.md
# Edit .projects.local.md with your actual projects
```

`.projects.local.md` is gitignored — your project names never leak into upstream.

### Rules

- **Never** run `git subtree push` from your private repo — improvements go into `motyl-ai-workflow` directly
- `AGENTS.md` and `CLAUDE.md` are manually maintained — cherry-pick relevant upstream changes as needed

## Creating a New Project

```bash
mkdir -p projects/my-project
cat > projects/my-project/PROJECT.md <<'EOF'
# My Project

## Overview

Brief description here.
EOF
# Panel auto-discovers it on next refresh
```

The only required file is `PROJECT.md`. The panel picks it up on the next polling cycle (no restart needed).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 19 + TypeScript |
| API server | Express |
| Real-time | WebSocket |
| Image optimization | sharp |
| Fuzzy search | fuse.js |
| Markdown rendering | react-markdown |
| File watching | chokidar |
| Styling | Tailwind CSS |

## Desktop App (Future)

The architecture — Vite frontend + Express backend — maps directly to a standard Electron or Tauri setup. The static build becomes the renderer process and the Express server runs as the main process. No structural changes required to convert this into a native desktop app.

## License

MIT — see [LICENSE](./LICENSE)

## Author

Created by Greg Motyl — [github.com/gmotyl](https://github.com/gmotyl)

[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/motyl.dev)
