# Google Gemini Configuration

This file contains instructions for Google Gemini integration with your project workspace.

## Quick Reference

**Resume:** Use project context from progress files in prompts
**Session End:** Manually save progress to `progress/` directory
**Progress:** Stored in `[project]/progress/` directory
**Config:** `[project]/.agent/config.json`
**API:** Requires Google AI API key

## Installation

### Prerequisites

```bash
# Requires Python 3.9+ or Node.js 18+
python3 --version
node --version

# Install Gemini Python client
pip install google-generativeai

# Or Node.js client
npm install -g @google/generative-ai
```

### Get API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create new API key
4. Set environment variable:
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
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
│   └── gemini.md       # This file
├── PROJECT.md          # Project overview
└── DECISIONS.md        # Key architectural decisions
```

## Working with Projects

### Python Setup

```bash
cd [project]

# Set API key
export GEMINI_API_KEY="your-api-key"

# Create Python script for session
cat > .agent/session.py << 'EOF'
import google.generativeai as genai
import os

# Configure API
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-pro')

# Load context
with open('PROJECT.md', 'r') as f:
    context = f.read()

# Start conversation
chat = model.start_chat()
response = chat.send_message(f"Context:\n{context}\n\n[Your prompt here]")
print(response.text)
EOF

# Run session
python .agent/session.py
```

### Node.js Setup

```bash
cd [project]

# Create Node.js script
cat > .agent/session.js << 'EOF'
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Load context
const context = fs.readFileSync("PROJECT.md", "utf-8");

async function runSession() {
  const chat = model.startChat();
  const result = await chat.sendMessage(`Context:\n${context}\n\n[Your prompt]`);
  console.log(result.response.text());
}

runSession();
EOF

# Run session
node .agent/session.js
```

## Configuration

Gemini respects `.agent/config.json`:

```json
{
  "provider": "gemini",
  "provider_options": {
    "model": "gemini-pro",
    "temperature": 0.7,
    "max_output_tokens": 2048,
    "api_key": "$GEMINI_API_KEY",
    "timeout": 60,
    "safety_settings": {
      "HARM_CATEGORY_UNSPECIFIED": "BLOCK_NONE",
      "HARM_CATEGORY_DEROGATORY": "BLOCK_MEDIUM_AND_ABOVE",
      "HARM_CATEGORY_VIOLENCE": "BLOCK_MEDIUM_AND_ABOVE"
    }
  },
  "features": [
    "text-generation",
    "code-generation",
    "image-understanding",
    "document-analysis"
  ],
  "notifications": {
    "enabled": true,
    "style": "terminal-output"
  }
}
```

**Available Models:**
- `gemini-pro` - Text-only model (recommended for most tasks)
- `gemini-pro-vision` - Can analyze images and documents
- `gemini-1.5-pro` - Latest, most capable model
- `gemini-1.5-flash` - Faster, lighter version

**Configuration Options:**
- `temperature`: 0-2 (0=deterministic, 2=creative)
- `max_output_tokens`: 1-100000 (output length limit)
- `timeout`: Seconds to wait for response

## Session Tracking Workflow

### Manual Session Management

```bash
# 1. Review last session
$ cat progress/$(ls -t progress/*.md | head -1)

# 2. Create session script with context
$ cat > .agent/current-session.py << 'EOF'
import google.generativeai as genai
import os

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-pro')

# Load all context files
with open('PROJECT.md', 'r') as f:
    project = f.read()
with open('DECISIONS.md', 'r') as f:
    decisions = f.read()
with open('progress/2026-02-20-last-session.md', 'r') as f:
    last_session = f.read()

# Initialize chat with full context
chat = model.start_chat()
system_context = f"""
# Project Context
{project}

# Key Decisions
{decisions}

# Last Session
{last_session}
"""

# Send your prompt
user_prompt = """Continue implementing the authentication feature.
Next step is to add password reset functionality."""

response = chat.send_message(system_context + "\n\n" + user_prompt)
print(response.text)

# Save conversation history
with open(f'progress/2026-02-21-session.md', 'w') as f:
    f.write(f"# Session: 2026-02-21\n\n## Prompt\n{user_prompt}\n\n## Response\n{response.text}\n")
EOF

$ python .agent/current-session.py
```

### Vision Capabilities (Analyze Images/Docs)

```python
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-pro-vision")

# Analyze architecture diagram
with open("docs/architecture.png", "rb") as f:
    image_data = f.read()

response = model.generate_content([
    "Analyze this architecture diagram and provide insights:",
    {"mime_type": "image/png", "data": image_data}
])

print(response.text)
```

## Tips for Effective Use

✅ **Use start_chat():** Maintain conversation context with multi-turn chats
✅ **Include full context:** Paste PROJECT.md and DECISIONS.md in initial prompt
✅ **Reference files:** Use multimodal input to include diagrams and screenshots
✅ **Save sessions:** Create progress files to document what Gemini helped with
✅ **Iterate:** Use multi-turn conversations to refine ideas

## Example Workflow

```python
# Day 1: Architecture Design
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-pro")

chat = model.start_chat()

# Load context
with open('PROJECT.md', 'r') as f:
    project = f.read()

# Turn 1: Ask for architecture
response1 = chat.send_message(f"""
Given this project:
{project}

Design a microservices architecture that:
1. Scales horizontally
2. Handles real-time updates
3. Minimizes data duplication
""")

print("Turn 1 - Architecture Design:")
print(response1.text)

# Turn 2: Ask for implementation details (has full context)
response2 = chat.send_message("""
Now provide a step-by-step implementation plan:
1. Which services should we build first?
2. What databases for each service?
3. How should services communicate?
""")

print("\nTurn 2 - Implementation Plan:")
print(response2.text)

# Save results
with open('progress/2026-02-20-architecture-session.md', 'w') as f:
    f.write(f"""# Session: 2026-02-20 - Architecture Design

## Architecture
{response1.text}

## Implementation Plan
{response2.text}
""")
```

## Multi-Modal Features

### Analyze Code Complexity

```python
model = genai.GenerativeModel("gemini-pro")

# Load code files
code = open('src/main.py').read()

response = model.generate_content(f"""
Analyze this code for:
1. Time complexity
2. Space complexity
3. Security vulnerabilities
4. Performance bottlenecks

Code:
{code}
""")

print(response.text)
```

### Review Designs

```python
model = genai.GenerativeModel("gemini-pro-vision")

# Analyze design mockup
with open("designs/ui-mockup.png", "rb") as f:
    image = f.read()

response = model.generate_content([
    """Review this UI design for:
    1. Usability issues
    2. Accessibility problems
    3. Modern design practices
    4. Responsive design concerns""",
    {"mime_type": "image/png", "data": image}
])

print(response.text)
```

## Rate Limiting & Quotas

Free tier (Generative AI API):
- 60 calls per minute
- 1,500 calls per day
- Free tier quota limits

Paid tier:
- 100+ calls per minute
- No daily limit
- Pay per request

Check [Google AI Console](https://console.cloud.google.com) for quotas.

## Troubleshooting

**API key not found:**
```bash
export GEMINI_API_KEY="your-key"
# Verify
echo $GEMINI_API_KEY
```

**Rate limiting (429 errors):**
- Add delays between requests: `time.sleep(0.5)`
- Use batch processing
- Upgrade to paid tier

**Timeout errors:**
- Increase timeout in config.json
- Reduce `max_output_tokens`
- Try with `gemini-1.5-flash` (faster)

**Session too long:**
- Start a new chat periodically
- Summarize long conversations
- Keep context files separate

---

**Configuration file for:** Google Gemini
**Location:** Repository root + `[project]/.agent/gemini.md`
**Authentication:** Google AI API key (GEMINI_API_KEY)
**Primary use:** Code analysis, architecture design, documentation
**Vision capability:** Images, documents, diagrams
