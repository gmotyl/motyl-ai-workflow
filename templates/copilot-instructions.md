# GitHub Copilot Instructions

**Project:** {{PROJECT_NAME}}
**Type:** {{PROJECT_TYPE}}
**Created:** {{DATE}}

## Project Context

[Describe your project and its goals]

## Code Style Guidelines

- Use consistent formatting
- Follow language-specific conventions
- Add meaningful comments
- Keep functions small and focused

## Important Patterns

[Document any important coding patterns or conventions]

## Key Files

- `PROJECT.md` - Project overview
- `DECISIONS.md` - Architectural decisions
- `progress/` - Session progress tracking
- `notes/notes/` - Notes and documentation

## Session Tracking

Since GitHub Copilot CLI uses global settings only, manually save progress:

```bash
cat > progress/$(date +%Y-%m-%d)-session.md << EOF
# Session Summary
- [What was accomplished]
- [Next steps]
EOF
```

## Team Guidelines

[Add team-specific guidelines for Copilot usage]

## References

- See `CLAUDE.md` in workspace root for Claude Code instructions
- See `docs/PROVIDER-SETUP.md` for provider configuration details
