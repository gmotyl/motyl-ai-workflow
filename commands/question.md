# Question Command

**Purpose:** Search project documentation and notes for answers to questions.

## Usage

```
/question What is the project architecture?
/q How do I set up the development environment?
/question API endpoints  # Short query
```

## What It Does

1. Searches PROJECT.md, DECISIONS.md, CLAUDE.md for relevant information
2. Scans notes/notes/*.md for matching content
3. Returns matching sections with context
4. Provides file names and line numbers

## Search Scope

- `PROJECT.md` - Project overview, structure, tech stack
- `DECISIONS.md` - Architectural decisions and rationale
- `CLAUDE.md` - Project context and instructions
- `README.md` - General information
- `notes/notes/*.md` - Session notes and documentation

## Example

```
$ /question What is the project architecture?

❓ Searching project knowledge for: What is the project architecture?

📄 Relevant Project Files:

✓ PROJECT.md - contains relevant information
## Architecture

The system uses microservices architecture with:
- API Gateway for routing
- Microservices for each domain
- PostgreSQL for primary data
- Redis for caching
```

## Implementation

### For Claude Code (Built-in)
Use `/q` or `/question` - built-in skill that searches knowledge base.

### For GitHub Copilot
Copilot reads this `.md` file and understands to:
1. Parse the question from user input
2. Search PROJECT.md, DECISIONS.md, CLAUDE.md
3. Search notes/notes/ directory
4. Return matching content with file context
5. Suggest related files or further search if needed

### For Command Line
```bash
./commands/question.sh "What is the authentication flow?"
```

## Notes

- Case-insensitive search
- Returns context around matches (2-3 lines before/after)
- Searches both file names and content
- Suggests grep for more comprehensive search if needed
- Useful before asking agent for analysis or implementation
