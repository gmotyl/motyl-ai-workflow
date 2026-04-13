# End Session Command

Saves session progress, commits, and optionally creates follow-up Todoist tasks.

## Usage

- `/end-session [project]` — end session for a project (projectname optional if set via `/resume-session` this conversation)
- `/end-session` — reuse project from the current session

## Behavior

**Project resolution:**
- If `[project]` is provided, use it
- If omitted, reuse the project set by `/resume-session` earlier in this conversation
- If neither applies, ask: "Which project are you ending the session for?" and wait for reply

**Then follow the session end logic from `commands/resume.md`:**

1. **Create new** `projects/[project]/progress/[date]-slug.md` (always a fresh file, never update existing)
2. **Progress file content:**
   - Context of tasks completed this session
   - Results/outcomes achieved
   - Next steps or blockers discovered
   - Useful context for smooth pickup on next resume
   - Do NOT duplicate info already in PROJECT.md or AGENTS.md
   - Focus on what's unique to this session
   - **At the end, add a `## Notatka` section** — a narrative paragraph in Polish, written in a casual blog-like tone for Greg to read. Summarize what happened in the session as a story: what we set out to do, what problems we hit, how we solved them, and where things stand now. Keep it 4–8 sentences, natural and readable.
3. **Commit and push** to the projects repo
4. **Ask the user** before creating any Todoist tasks. Propose tasks for remaining work (format: `[project-name] Task description`) but wait for explicit approval before adding them
5. Clear context and start a new session automatically

## Rules

- Always create a **new** progress file — never edit an existing one
- Slug should be descriptive of the main session theme (max 4 words, kebab-case)
- Do not add Todoist tasks without explicit user approval
