# Switching Providers

How to migrate between AI providers.

## Quick Guide

**To switch providers for a project:**

```bash
cd my-project

# 1. Update config
vim .agent/config.json
# Change: { "provider": "kilocode" } → { "provider": "claude" }

# 2. Setup new provider (first time only)
npm run setup:claude-code

# 3. Done! Continue working
```

That's it! No workflow changes needed.

## Step-by-Step Example

### Switch from Kilocode to Claude

```bash
# 1. Navigate to project
cd my-awesome-app

# 2. Check current config
cat .agent/config.json
# Output: { "provider": "kilocode", ... }

# 3. Update provider
# Edit .agent/config.json
# OLD: { "provider": "kilocode" }
# NEW: { "provider": "claude" }

# 4. Setup Claude (first time)
npm run setup:claude-code

# 5. Start using Claude
claude-code

# Your session history stays intact:
# - notes/ directory unchanged
# - progress/ directory unchanged
# - DECISIONS.md unchanged
# - PROJECT.md unchanged
```

## Switching Between Multiple Projects

You can have different projects using different providers:

```bash
# Work project with Claude
cd work-project
claude-code

# Personal project with Kilocode
cd personal-project
kilo ask "What should I work on?"

# Freelance project with Copilot
cd freelance-project
# Use VS Code with Copilot

# Switch back to work project
cd work-project
claude-code  # Still using Claude
```

## What Happens to Your Work?

When you switch providers, all your work stays intact:

✅ **Preserved:**
- `notes/` - All session notes
- `progress/` - All session tracking
- `DECISIONS.md` - All decisions
- `PROJECT.md` - Project overview
- All your code files
- Git history

❌ **Changes:**
- Only `.agent/config.json` changes
- Only the AI agent changes
- Workflow stays identical

## Common Switches

### Kilocode → Claude

```bash
# Update config
vim .agent/config.json
# { "provider": "kilocode" } → { "provider": "claude" }

# Setup
npm run setup:claude-code

# Use
claude-code
```

### Claude → Copilot

```bash
# Update config
vim .agent/config.json
# { "provider": "claude" } → { "provider": "copilot" }

# Setup
npm run setup:copilot

# Use
# Open project in VS Code
# Start using Copilot (Ctrl/Cmd+I for chat)
```

### Copilot → Kilocode

```bash
# Update config
vim .agent/config.json
# { "provider": "copilot" } → { "provider": "kilocode" }

# Setup
npm run setup:kilocode-cli

# Use
kilo ask "Let's continue from yesterday"
```

### Temporary Switch

Want to use a different provider just for today?

```bash
# Backup current config
cp .agent/config.json .agent/config.json.backup

# Switch temporarily
vim .agent/config.json
# { "provider": "claude" } → { "provider": "kilocode" }

npm run setup:kilocode-cli
kilo ask "Quick question"

# Switch back
cp .agent/config.json.backup .agent/config.json
```

## Migration Checklist

When switching providers:

- [ ] Update `.agent/config.json`
- [ ] Run setup script for new provider: `npm run setup:[provider]`
- [ ] Test the new provider: `cd my-project && [start command]`
- [ ] Review `.agent/config.json` is correct
- [ ] Make a commit (optional): `git commit -am "switch: use new provider"`
- [ ] Continue working

## Troubleshooting

### "New provider not working"

```bash
# 1. Verify setup ran correctly
npm run setup:[provider]

# 2. Check config
cat .agent/config.json

# 3. Check environment variables
env | grep [PROVIDER]

# 4. Try setup again
npm run setup:[provider]
```

### "Can't find my old work"

Don't worry! It's still there:

```bash
# Check your notes are safe
ls progress/
ls notes/

# Check your decisions
cat DECISIONS.md

# They never change when switching providers
```

### "Old provider still being used"

```bash
# Verify config updated
cat .agent/config.json

# If not updated, edit again
vim .agent/config.json

# Commit if using git
git add .agent/config.json
git commit -m "switch: use new provider"
```

## When to Switch

**Good reasons:**
- Company changes tools
- Trial period ended, want to try different
- Need features only another provider has
- Cost reasons
- Performance reasons
- Team standardization

**Bad reasons:**
- Just trying tools constantly (pick one, give it time)
- Switching every project (standardize on one or two)
- Chasing hype (all modern providers are good)

## Recommendations

- **Pick one and use it for a week** before switching
- **Keep 1-2 providers** if doing solo work
- **Standardize on one per team** for consistency
- **Easy to switch later** so don't overthink initial choice

---

See [provider-selection.md](./provider-selection.md) to choose your provider.
