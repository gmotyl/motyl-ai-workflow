#!/bin/bash

# Slack API Helper Script
# Usage: ./slack-helper.sh <command> <args>

set -e

# Load token from config
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/slack-config.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Error: $CONFIG_FILE not found"
  exit 1
fi

# Allow override via environment variable
if [ -z "$SLACK_TOKEN_TYPE" ]; then
  SLACK_TOKEN_TYPE="botToken"
fi

TOKEN=$(jq -r ".${SLACK_TOKEN_TYPE}" "$CONFIG_FILE")
if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Error: ${SLACK_TOKEN_TYPE} not found in config"
  exit 1
fi

BOT_TOKEN="$TOKEN"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Commands

list_channels() {
  echo -e "${BLUE}📋 Listing all channels...${NC}"
  curl -s https://slack.com/api/conversations.list \
    -H "Authorization: Bearer ${BOT_TOKEN}" | \
    jq -r '.channels[]? | "\(.id) | \(.name) (members: \(.num_members))"'
}

get_messages() {
  local channel=$1
  local limit=${2:-20}

  if [ -z "$channel" ]; then
    echo "Usage: slack-helper.sh get-messages <channel_id> [limit]"
    exit 1
  fi

  echo -e "${BLUE}📨 Getting $limit messages from channel $channel...${NC}"
  curl -s https://slack.com/api/conversations.history \
    -H "Authorization: Bearer ${BOT_TOKEN}" \
    -d "channel=${channel}&limit=${limit}" | \
    jq -r '.messages[] | "\(.ts) | \(.user // "system") | \(.text // "[no text]")"' | \
    tail -20
}

send_message() {
  local channel=$1
  local message=$2

  if [ -z "$channel" ] || [ -z "$message" ]; then
    echo "Usage: slack-helper.sh send-message <channel_id> <message>"
    exit 1
  fi

  echo -e "${BLUE}📤 Sending message to $channel...${NC}"
  response=$(curl -s -X POST https://slack.com/api/chat.postMessage \
    -H "Authorization: Bearer ${BOT_TOKEN}" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "channel=${channel}&text=${message}")

  if echo "$response" | jq -e '.ok' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Message sent!${NC}"
    echo "$response" | jq '{ok: .ok, ts: .ts, channel: .channel}'
  else
    echo -e "${RED}❌ Failed to send message${NC}"
    echo "$response" | jq .
  fi
}

test_auth() {
  echo -e "${BLUE}🔐 Testing authentication...${NC}"
  response=$(curl -s https://slack.com/api/auth.test \
    -H "Authorization: Bearer ${BOT_TOKEN}")

  if echo "$response" | jq -e '.ok' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Authentication successful!${NC}"
    echo "$response" | jq '{ok: .ok, team: .team, user: .user, team_id: .team_id, user_id: .user_id}'
  else
    echo -e "${RED}❌ Authentication failed${NC}"
    echo "$response" | jq .
  fi
}

get_channel_info() {
  local channel=$1

  if [ -z "$channel" ]; then
    echo "Usage: slack-helper.sh channel-info <channel_id>"
    exit 1
  fi

  echo -e "${BLUE}ℹ️  Getting info for channel $channel...${NC}"
  curl -s https://slack.com/api/conversations.info \
    -H "Authorization: Bearer ${BOT_TOKEN}" \
    -d "channel=${channel}" | \
    jq '.channel | {id: .id, name: .name, topic: .topic.value, created: .created, num_members: .num_members}'
}

list_users() {
  echo -e "${BLUE}👥 Listing users...${NC}"
  curl -s https://slack.com/api/users.list \
    -H "Authorization: Bearer ${BOT_TOKEN}" | \
    jq -r '.members[] | select(.is_bot == false) | "\(.id) | \(.name) (\(.real_name))"' | \
    head -20
}

search_messages() {
  local query=$1

  if [ -z "$query" ]; then
    echo "Usage: slack-helper.sh search <query>"
    exit 1
  fi

  echo -e "${BLUE}🔍 Searching for: $query${NC}"
  curl -s https://slack.com/api/search.messages \
    -H "Authorization: Bearer ${BOT_TOKEN}" \
    -d "query=${query}&sort=timestamp&sort_dir=desc&count=10" | \
    jq -r '.messages.matches[]? | "\(.ts) | \(.channel) | \(.text)"'
}

help() {
  cat << EOF
${BLUE}Slack API Helper${NC}

Usage: slack-helper.sh <command> [args]

Commands:
  ${GREEN}test${NC}                    Test authentication
  ${GREEN}list-channels${NC}           List all channels
  ${GREEN}get-messages${NC}            Get messages: <channel_id> [limit]
  ${GREEN}send-message${NC}            Send message: <channel_id> <message>
  ${GREEN}channel-info${NC}            Get channel info: <channel_id>
  ${GREEN}list-users${NC}              List users
  ${GREEN}search${NC}                  Search messages: <query>
  ${GREEN}help${NC}                    Show this help

Examples:
  ./slack-helper.sh test
  ./slack-helper.sh list-channels
  ./slack-helper.sh get-messages C1234567890
  ./slack-helper.sh send-message C1234567890 "Hello Slack!"
  ./slack-helper.sh search "bug report"

EOF
}

# Main
command=$1
shift || true

case "$command" in
  test)
    test_auth
    ;;
  list-channels)
    list_channels
    ;;
  get-messages)
    get_messages "$@"
    ;;
  send-message)
    send_message "$@"
    ;;
  channel-info)
    get_channel_info "$@"
    ;;
  list-users)
    list_users
    ;;
  search)
    search_messages "$@"
    ;;
  help|"")
    help
    ;;
  *)
    echo -e "${RED}Unknown command: $command${NC}"
    help
    exit 1
    ;;
esac
