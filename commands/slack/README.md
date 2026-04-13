# Slack Operations from Claude Code

Use your Slack workspace directly without MCP. Send/read/search messages via the helper script using your bot token.

## Quick Start

```bash
# Setup (one-time)
chmod +x ./slack-helper.sh

# Test that it works
./slack-helper.sh test

# Send a message to general-en
./slack-helper.sh list-channels | grep "general-en"  # Get channel ID
./slack-helper.sh send-message C0170ESN2R4 "Hello!"
```

## The Pattern

1. **Get IDs first** - Slack requires channel IDs (C123...) and user IDs (U123...), not names
2. **Execute operation** - Use the helper script with the ID
3. **Done** - Messages sent, data read, searches completed

## Files

- **slack-helper.sh** - Helper script for common Slack operations
- **SKILL.md** - Full skill guide (read this for details)
- **SLACK-API-GUIDE.md** - Complete API reference for advanced use

## Usage

```bash
./slack-helper.sh <command> [args]
```

### Commands

| Command | Purpose |
|---------|---------|
| `test` | Verify authentication |
| `list-channels` | Get all channels with IDs |
| `list-users` | Get all users with IDs |
| `send-message <ID> <text>` | Send message to channel or user |
| `get-messages <ID> [limit]` | Read messages (default 20) |
| `channel-info <ID>` | Get channel metadata |
| `search <query>` | Search messages |

## Examples

```bash
# Send to a channel
./slack-helper.sh send-message C0170ESN2R4 "Claude Code deployed!"

# Read recent messages
./slack-helper.sh get-messages C0170ESN2R4 50

# Send a DM
./slack-helper.sh list-users | grep "username"
./slack-helper.sh send-message U123456789 "Direct message"

# Search
./slack-helper.sh search "bug report"
```

## Setup

1. **Create `.claude/slack-config.json`:**
   ```json
   {
     "botToken": "xoxb-your-bot-token-here",
     "appToken": "xapp-your-app-token-here"
   }
   ```

2. **Set permissions:**
   ```bash
   chmod 600 .claude/slack-config.json
   chmod +x ./slack-helper.sh
   ```

3. **Test:**
   ```bash
   ./slack-helper.sh test
   ```

## Key Facts

- **Use bot tokens** (`xoxb-...`) for API access, not app tokens
- **Always get IDs first** - `list-channels` to find channel ID before sending
- **No MCP needed** - Direct Slack REST API calls via helper
- **Token is automatic** - Helper loads from `.claude/slack-config.json`
- **Rate limits** - ~20 requests/minute, stagger for batch operations

## For Complete Details

Read `SKILL.md` for the full guide including:
- Common mistakes and how to fix them
- Advanced workflows and batch operations
- Direct API call examples
- Authentication and security details
