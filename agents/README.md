# AI Provider Guides

Choose your AI provider and follow the setup guide below.

## Supported Providers

First-class support (fully documented):
- **Claude Code** - Interactive coding, planning, debugging
- **Kilocode CLI** - Terminal-first, multiple modes
- **GitHub Copilot** - IDE integration, pair programming

Additional providers:
- **QWEN** - Alibaba's generative AI
- **Gemini** - Google's generative AI
- **Custom** - Any other AI agent (use template)

## Quick Links

- [Claude Code Setup](./claude-code.md)
- [Kilocode CLI Setup](./kilocode-cli.md)
- [GitHub Copilot Setup](./github-copilot.md)
- [QWEN Setup](./qwen.md)
- [Gemini Setup](./gemini.md)
- [Custom Agent Template](./custom-agent-template.md)

## How to Use These Guides

1. Choose your provider above
2. Follow the setup guide
3. Create a project with `npm run create-project`
4. Select your provider during project creation
5. Configure `.agent/config.json` in your project
6. Start using your chosen provider

## Sound Notifications

Each provider can be configured with custom sound notifications:
- **Claude Code**: Uses peon-ping (ready, done, question sounds)
- **Kilocode CLI**: Custom wrapper script with notifications
- **GitHub Copilot**: IDE-based notifications
- **Others**: System sounds or custom setup

See individual provider guides for notification setup.

## Switching Providers

To switch providers for a project:

1. Edit `my-project/.agent/config.json`
2. Change `"provider"` field
3. Run setup script for new provider (if first time)
4. Continue working - no workflow changes

Example:
```bash
cd my-project
# Edit .agent/config.json: { "provider": "kilocode" } → { "provider": "claude" }
npm run setup:claude-code  # First time only
```

## Adding a New Provider

To add support for a new provider:

1. Create `agents/[provider-name].md` with setup guide
2. Create `scripts/setup:[provider-name]` script
3. Update `scripts/create-project.sh` to include new provider
4. Update main README.md to mention new provider

See `custom-agent-template.md` for the recommended format.

---

Ready to get started? Choose your provider above!
