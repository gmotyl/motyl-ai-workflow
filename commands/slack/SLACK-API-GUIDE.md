# Direct Slack API Usage Guide

Quick reference for using your Slack app directly without MCP.

## Setup

Your credentials are in `.claude/slack-config.json`:
```bash
BOT_TOKEN=$(jq -r '.botToken' .claude/slack-config.json)
export SLACK_BOT_TOKEN="${BOT_TOKEN}"
```

## Common Operations

### 1. List All Channels

```bash
curl -s https://slack.com/api/conversations.list \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" | jq .
```

**Response includes:** channel IDs, names, topic, etc.

### 2. Read Messages from a Channel

```bash
# Get channel ID first
CHANNEL_ID="C123456789"

curl -s https://slack.com/api/conversations.history \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -d "channel=${CHANNEL_ID}&limit=50" | jq .
```

**Parameters:**
- `channel` - Channel ID (required)
- `limit` - Number of messages (default 20, max 100)
- `oldest` - Timestamp to start from
- `latest` - Timestamp to end at

**Response includes:** messages with user, text, timestamp, reactions, etc.

### 3. Get User Info

```bash
USER_ID="U123456789"

curl -s https://slack.com/api/users.info \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -d "user=${USER_ID}" | jq .
```

### 4. Send a Message to Channel

```bash
CHANNEL_ID="C123456789"
MESSAGE="Hello from Claude Code!"

curl -s -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "channel=${CHANNEL_ID}&text=${MESSAGE}" | jq .
```

**Advanced:** Send formatted messages with blocks

```bash
curl -s -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "C123456789",
    "text": "Important update",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Bold message* with details"
        }
      }
    ]
  }' | jq .
```

### 5. Send Direct Message (DM)

```bash
USER_ID="U123456789"

# First open DM channel
DM_CHANNEL=$(curl -s https://slack.com/api/conversations.open \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -d "users=${USER_ID}" | jq -r '.channel.id')

# Then send message
curl -s -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -d "channel=${DM_CHANNEL}&text=Direct message here" | jq .
```

### 6. Get Channel Info

```bash
CHANNEL_ID="C123456789"

curl -s https://slack.com/api/conversations.info \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -d "channel=${CHANNEL_ID}" | jq .
```

**Response includes:** members, topic, description, created date, etc.

### 7. List All Users

```bash
curl -s https://slack.com/api/users.list \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" | jq '.members[] | {id, name, real_name}'
```

### 8. Search Messages

```bash
QUERY="bug report"

curl -s https://slack.com/api/search.messages \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -d "query=${QUERY}&sort=timestamp&sort_dir=desc" | jq .
```

### 9. React to a Message

```bash
CHANNEL_ID="C123456789"
TIMESTAMP="1234567890.123456"
EMOJI="thumbsup"

curl -s -X POST https://slack.com/api/reactions.add \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -d "channel=${CHANNEL_ID}&timestamp=${TIMESTAMP}&name=${EMOJI}" | jq .
```

### 10. Get Message Replies (Thread)

```bash
CHANNEL_ID="C123456789"
TIMESTAMP="1234567890.123456"

curl -s https://slack.com/api/conversations.replies \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" \
  -d "channel=${CHANNEL_ID}&ts=${TIMESTAMP}" | jq .
```

---

## Receiving Messages: Event Webhooks

To **receive** new messages (not just read history), set up Slack Events API:

1. **Go to your Slack App settings** → Event Subscriptions
2. **Enable Events** → Request URL
3. **Add your URL** where Slack will POST events:
   ```
   https://your-server.com/slack/events
   ```
4. **Subscribe to bot events:**
   - `message.channels` (messages in public channels)
   - `message.groups` (messages in private channels)
   - `message.im` (direct messages)
   - `message.mpim` (group DMs)
5. **Reinstall your app**

Slack will POST JSON like:
```json
{
  "type": "event_callback",
  "event": {
    "type": "message",
    "user": "U123456789",
    "text": "Hello!",
    "channel": "C123456789",
    "ts": "1234567890.123456"
  }
}
```

---

## Helper Script: Fetch Channel Messages

```bash
#!/bin/bash

BOT_TOKEN=$(jq -r '.botToken' .claude/slack-config.json)

get_channel_messages() {
  local channel=$1
  local limit=${2:-50}

  echo "Fetching $limit messages from $channel..."

  curl -s https://slack.com/api/conversations.history \
    -H "Authorization: Bearer ${BOT_TOKEN}" \
    -d "channel=${channel}&limit=${limit}" | \
    jq -r '.messages[] | "\(.ts) |\(.user)| \(.text)"'
}

get_channel_messages "$@"
```

Usage:
```bash
bash get-messages.sh C123456789 10
```

---

## Helper Script: Send Message

```bash
#!/bin/bash

BOT_TOKEN=$(jq -r '.botToken' .claude/slack-config.json)

send_message() {
  local channel=$1
  local message=$2

  curl -s -X POST https://slack.com/api/chat.postMessage \
    -H "Authorization: Bearer ${BOT_TOKEN}" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "channel=${channel}&text=${message}" | \
    jq '{ok, ts, channel}'
}

send_message "$@"
```

Usage:
```bash
bash send-message.sh C123456789 "Hello Slack!"
```

---

## API Reference

**Base URL:** `https://slack.com/api/`

**Authentication:** `Authorization: Bearer ${SLACK_BOT_TOKEN}`

**Key Endpoints:**
- `conversations.list` - Get channels
- `conversations.info` - Get channel details
- `conversations.history` - Read messages
- `conversations.replies` - Get thread replies
- `conversations.open` - Open/create DM
- `chat.postMessage` - Send message
- `users.list` - Get all users
- `users.info` - Get user details
- `search.messages` - Search messages
- `reactions.add` - React to message
- `reactions.get` - Get message reactions

**Full Docs:** https://api.slack.com/methods

---

## Testing Endpoints

Quick test to verify your token works:

```bash
curl -s https://slack.com/api/auth.test \
  -H "Authorization: Bearer ${SLACK_BOT_TOKEN}" | jq .
```

Expected response:
```json
{
  "ok": true,
  "url": "https://workspace.slack.com/",
  "team": "Team Name",
  "user": "bot-name",
  "team_id": "T123456789",
  "user_id": "U123456789"
}
```

---

## Error Handling

Common errors:

| Error | Cause | Fix |
|-------|-------|-----|
| `invalid_auth` | Bad token | Check `SLACK_BOT_TOKEN` value |
| `not_in_channel` | Bot not in channel | Add bot to channel in Slack |
| `channel_not_found` | Invalid channel ID | Verify channel ID with `conversations.list` |
| `restricted_action` | Missing scope | Add required scopes in App settings |
| `missing_scope` | Scope not enabled | Enable scope and reinstall app |

---

## Tips

1. **Use `jq` for parsing:** `curl ... | jq .` to pretty-print JSON
2. **Extract values:** `curl ... | jq -r '.channel.id'` to get just the ID
3. **Test in curl first:** Before building automation, test endpoints manually
4. **Rate limits:** Slack has rate limits (20 req/min for most endpoints). Stagger requests if needed
5. **Timestamp format:** Slack uses seconds since epoch, sometimes with decimal (e.g., `1234567890.123456`)

---

You're good to go! Use this guide to directly interact with your Slack workspace.
