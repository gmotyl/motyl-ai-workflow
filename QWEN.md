# QWEN Configuration

This file contains instructions for QWEN (Alibaba) integration with your project workspace.

## Quick Reference

**Resume:** Use project context from progress files in prompts
**Session End:** Type "session end" to save progress
**Progress:** Stored in `[project]/progress/` directory
**Config:** `[project]/.agent/config.json`
**API:** Requires DashScope API key

## Installation

### Prerequisites

```bash
# Requires Node.js 18+ or Python 3.8+
node --version
python3 --version

# Install QWEN CLI (if available in your region)
npm install -g qwen-cli
```

### Get API Key

1. Create account at [DashScope](https://dashscope.aliyun.com)
2. Create API key in dashboard
3. Set environment variable:
   ```bash
   export DASHSCOPE_API_KEY="your-api-key-here"
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
│   └── qwen.md         # This file
├── PROJECT.md          # Project overview
└── DECISIONS.md        # Key architectural decisions
```

## Working with Projects

### Setup for Session

```bash
cd [project]

# Set API key (if not already set globally)
export DASHSCOPE_API_KEY="your-api-key"

# View last session context
cat progress/$(ls -t progress/*.md | head -1)

# Start interactive session
qwen-cli
```

### Basic Usage

```bash
# Single prompt (non-interactive)
qwen-cli "Help me understand the architecture in PROJECT.md"

# Interactive mode
qwen-cli --interactive
```

## Configuration

QWEN respects `.agent/config.json`:

```json
{
  "provider": "qwen",
  "provider_options": {
    "model": "qwen-plus",
    "temperature": 0.7,
    "max_tokens": 2048,
    "api_key": "$DASHSCOPE_API_KEY",
    "timeout": 120
  },
  "features": [
    "text-generation",
    "code-analysis",
    "translation",
    "qa"
  ],
  "notifications": {
    "enabled": true,
    "style": "terminal-output"
  }
}
```

**Available Models:**
- `qwen-turbo` - Fastest, lower latency (good for real-time)
- `qwen-plus` - Balanced (recommended)
- `qwen-max` - Most capable (higher cost)
- `qwen-72b` - Largest open model (good for complex tasks)

**Configuration Options:**
- `temperature`: 0-2 (0=deterministic, 2=creative)
- `max_tokens`: 128-8000 (output length limit)
- `timeout`: Milliseconds to wait for response

## Session Tracking Workflow

### Manual Session Management

```bash
# 1. Load last session context
$ cat progress/2026-02-20-feature-work.md

# 2. Start working
$ qwen-cli
> I'm continuing work on the authentication feature. Here's the context from my last session:
> [paste relevant parts from progress file]
> [your prompt]

# 3. Save progress manually
$ cat > progress/2026-02-21-continued-auth.md << EOF
# Session: 2026-02-21 - Continued Auth Implementation

## Accomplishments
- Added JWT validation
- Implemented refresh tokens
- 90% test coverage

## Next Steps
- Add password reset functionality
- Deploy to staging
EOF
```

### Scripted Session Management

Create a wrapper script for automated tracking:

```bash
#!/bin/bash
# scripts/qwen-session.sh

PROJECT=$1
TASK=$2

if [ -z "$TASK" ]; then
  echo "Usage: ./qwen-session.sh [project] [task]"
  exit 1
fi

# Load context
CONTEXT=$(cat progress/$(ls -t progress/*.md 2>/dev/null | head -1))

# Run QWEN with context
qwen-cli --interactive << EOF
Project: $PROJECT
Task: $TASK

Context from last session:
$CONTEXT

$TASK
EOF

# Save session manually or use git to track changes
```

## Integration with Project Registry

QWEN can work within the multi-project structure:

1. Check `AGENTS.md` for project information
2. Navigate to project directory: `cd [project]`
3. Load context from `progress/` directory
4. Include `PROJECT.md` and `DECISIONS.md` in prompts

## Using QWEN for Code Analysis

### Example: Architecture Review

```bash
# Prepare prompt with context
cat << EOF | qwen-cli

Review the architecture described in PROJECT.md and DECISIONS.md:

## PROJECT.md
$(cat PROJECT.md)

## DECISIONS.md
$(cat DECISIONS.md)

## My Code
$(cat src/main.py)

Provide:
1. Architecture assessment
2. Recommendations for improvement
3. Potential risks

EOF
```

### Example: Test Generation

```bash
# Generate tests from code
cat << EOF | qwen-cli

Generate comprehensive unit tests for this code:

$(cat src/authentication.py)

Requirements:
- Use pytest framework
- Minimum 90% coverage
- Include edge cases
- Add docstrings

EOF
```

## Tips for Effective Use

✅ **Include context:** Paste relevant parts of PROJECT.md and DECISIONS.md in prompts
✅ **Use progress files:** Reference your last session notes when continuing work
✅ **Save manually:** Create progress files documenting what was accomplished
✅ **Version control:** Commit progress files to git for history
✅ **Iterative refinement:** Break complex tasks into smaller prompts

## Example Workflow

```bash
# Day 1: Start new feature
$ cd my-project
$ cat progress/$(ls -t progress/*.md | head -1)
# [Review last session context]

$ qwen-cli
> I'm implementing user authentication. Here's the project context:
> [paste PROJECT.md summary]
>
> Can you help me design the JWT authentication flow?
[QWEN generates design]

# Manually save progress
$ cat > progress/2026-02-20-auth-design.md << EOF
# Session: 2026-02-20 - Auth Design

## Accomplishments
- Designed JWT flow with QWEN
- Documented security considerations
- Planned implementation steps

## Next Steps
- Implement auth module
- Add unit tests
- Create user registration endpoint
EOF

---

# Day 2: Continue work
$ qwen-cli
> Continuing from yesterday's auth design work. Context:
> [paste content of progress/2026-02-20-auth-design.md]
>
> Now I need to implement the JWT token generation. Here's my attempt:
> [paste code]
>
> Can you review this and suggest improvements?
[QWEN provides feedback and improvements]
```

## Regional Availability

QWEN is available in:
- ✅ China (primary region)
- ✅ Singapore
- ✅ Japan
- ✅ Global via API

Check [DashScope](https://dashscope.aliyun.com) for your region's endpoints.

## Cost Considerations

QWEN pricing (as of 2024):
- **qwen-turbo**: ¥0.001 per 1K tokens
- **qwen-plus**: ¥0.002 per 1K tokens
- **qwen-max**: ¥0.02 per 1K tokens
- **qwen-72b**: Custom pricing

Set limits in `.agent/config.json` to control costs.

## Troubleshooting

**API key not found:**
```bash
export DASHSCOPE_API_KEY="your-key"
# Or add to ~/.bashrc or ~/.zshrc
```

**Timeout errors:**
- Increase `timeout` in config.json
- Check internet connection
- Reduce `max_tokens` to get faster responses

**Rate limiting:**
- Stagger requests with delays
- Use `qwen-turbo` for frequent calls
- Check DashScope dashboard for usage

**Session context too long:**
- Summarize old progress files
- Keep only relevant context in prompts
- Use `max_tokens` to limit output

---

**Configuration file for:** QWEN / DashScope API
**Location:** Repository root + `[project]/.agent/qwen.md`
**Authentication:** DashScope API key (DASHSCOPE_API_KEY)
**Primary use:** Code analysis, generation, documentation
