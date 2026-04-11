# Projects Panel

Local web dashboard for the motyl-ai-workflow workspace. Built with Vite + React + Express on port 3010.

## Features

- Project dashboard with auto-discovered project cards (reads PROJECT.md)
- Markdown viewer with VS Code integration
- Cmd+P fuzzy file finder across all projects
- AI agent monitoring sidebar (Claude Code, OpenCode sessions)
- Git panel — status, stage, commit, push
- Image optimization via drag-and-drop (sharp → WebP)
- Real-time updates via WebSocket

## Setup

```bash
cd panel
npm install
npm run dev
# Open http://localhost:3010
```

## Configuration

`panel.config.ts` — committed defaults using relative paths, safe for all users.

To override locally (gitignored, never committed):

```ts
// panel/panel.config.local.ts
import type { PanelConfig } from "./panel.config";

const overrides: Partial<PanelConfig> = {
  projectsDir: "/absolute/path/to/your/projects",
  port: 3010,
  agentRegistryPath: "/Users/you/.agent-registry.json",
};

export default overrides;
```

## Agent Tracking

Use `scripts/cc` instead of `claude` and `scripts/oc` instead of `opencode`. The wrapper scripts register/deregister sessions in `~/.agent-registry.json`, which the panel sidebar reads to show live agent status.

## Contributing

Make improvements directly in [motyl-ai-workflow](https://github.com/gmotyl/motyl-ai-workflow). If you're using this as an upstream for a private workspace, run `scripts/update.sh` to pull the latest changes — never push from your private repo back here.
