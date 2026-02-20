# Choosing Your AI Provider

How to choose the right provider for your project.

## Quick Decision Tree

```
┌─ Is it a personal/hobby project?
│  ├─ YES → Budget matters
│  │         ├─ Want free?       → Kilocode (free tier)
│  │         ├─ Don't mind paid? → Claude or Copilot
│  │         └─ Enterprise?      → QWEN
│  │
│  └─ NO (Work/Team project)
│     ├─ Company pays?
│     │  ├─ Claude subscription? → Claude Code
│     │  ├─ GitHub Copilot?      → GitHub Copilot
│     │  ├─ Neither?             → QWEN or Kilocode
│     │  └─ Flexible?            → Your choice (or Copilot)
│     │
│     └─ Need integrations?
│        ├─ GitHub + Jira?       → Claude (best integration)
│        ├─ IDE-first?           → Copilot
│        └─ Terminal-first?      → Kilocode
```

## Provider Comparison

| Factor | Claude | Kilocode | Copilot | QWEN | Gemini |
|--------|--------|----------|---------|------|--------|
| **Cost** | Paid | Free tier | Paid | Free tier | Free |
| **Interface** | CLI/Interactive | Terminal | IDE | API | Web |
| **Speed** | Fast | Varies | Fast | Fast | Fast |
| **Accuracy** | High | High | High | Good | Good |
| **Local** | No | Yes | Partial | Yes | No |
| **Offline** | No | No | Partial | Yes | No |

## Scenarios

### Solo Developer, Personal Projects

**Best:** Kilocode CLI (free tier)
- Free to start
- No subscription limits
- Terminal-first (fast)
- Good for learning
- Can switch to Claude later if needed

Setup:
```bash
npm run setup:kilocode-cli
npm run create-project
# Choose: kilocode
```

### Solo Developer, Work + Personal

**Best:** Dual setup
- Work: Claude Code (company pays)
- Personal: Kilocode (free)

Setup:
```bash
npm run setup:all  # Both providers

npm run create-project  # Create work project
# Choose: claude

npm run create-project  # Create personal project
# Choose: kilocode
```

**Example workflow:**
```bash
# Morning: Work on company project
cd work-project
claude-code

# Afternoon: Side project
cd personal-project
kilo ask "How should I implement this?"
```

### Team Lead, Mixed Projects

**Best:** Copilot + Claude + Integrations
- GitHub Copilot for team (widely available)
- Claude for architectural decisions
- Integration with Jira/Azure DevOps

Setup:
```bash
npm run setup:all  # All providers
npm run setup:jira  # Add Jira integration

npm run create-project  # Team project
# Choose: copilot  (everyone has it)

npm run create-project  # Architecture project
# Choose: claude  (for planning)
```

### Enterprise/Corporate

**Best:** QWEN or Copilot (depending on company)
- QWEN if on-premise required
- Copilot if Microsoft/GitHub Shop
- Claude if technology-forward

Setup:
```bash
npm run setup:[provider]  # Your choice

npm run create-project
# Choose: your-provider
```

## Feature-Based Selection

### Need Architectural Planning?
→ **Claude Code** (best for design discussions)

### Want Real-Time Code Suggestions?
→ **GitHub Copilot** (fastest suggestions)

### Debugging Issues?
→ **Kilocode CLI** (debug mode is excellent)

### Quick Answers About Code?
→ **Kilocode CLI** (ask mode is quick)

### IDE Integration?
→ **GitHub Copilot** (VS Code, JetBrains)

### Terminal-First Workflow?
→ **Kilocode CLI** (perfect for CLI users)

### Cost-Sensitive?
→ **Kilocode** (free tier) or **Gemini** (free)

## Making Your Decision

### Questions to Ask

1. **Budget:** Can you afford a subscription?
   - No: Kilocode, QWEN, or Gemini
   - Yes: Claude or Copilot

2. **Interface:** How do you code?
   - Mostly IDE: Copilot
   - Terminal: Kilocode
   - Interactive CLI: Claude

3. **Company:** What's your situation?
   - Employer pays: Use their tool
   - Self-funded: Kilocode (free)
   - Mixed: Dual setup

4. **Integration:** What tools do you use?
   - GitHub+Jira: Claude
   - Microsoft stack: Copilot
   - Flexible: Any

5. **Performance:** What matters most?
   - Speed: Copilot
   - Quality: Claude
   - Flexibility: Kilocode

### Test Before Committing

Most providers offer trials:

```bash
# Test Claude
npm run setup:claude-code
npm run create-project
# Create test project, try it out

# Test Kilocode
npm run setup:kilocode-cli
npm run create-project
# Create test project, try it out

# Test Copilot
npm run setup:copilot
npm run create-project
# Create test project, try it out

# Keep the one you like best
```

## Switching Later

You can always switch later! See [switching-providers.md](./switching-providers.md)

```bash
# Current setup
cd my-project
cat .agent/config.json  # { "provider": "kilocode" }

# Want to switch?
# 1. Update config
# 2. Run new setup script
# 3. Done! Same project, different provider
```

---

Still undecided? Start with **Kilocode** (free, no commitment).
