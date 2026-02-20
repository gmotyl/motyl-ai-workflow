# Notes Organization Structure

## Directory Layout

```
project-name/
├── notes/
│   ├── log/                    # Raw transcripts
│   │   └── 2026-02-20.txt
│   ├── 2026-02-20-standup.md   # Daily standups
│   ├── 2026-02-21-planning.md  # Planning sessions
│   ├── decisions/              # Decision records
│   │   └── 2026-02-20-architecture.md
│   └── meetings/               # Meeting summaries
│       └── 2026-02-20-all-hands.md
│
└── progress/                   # Session tracking
    ├── 2026-02-20-setup.md     # What was done this session
    ├── 2026-02-21-features.md  # Feature implementation session
    └── 2026-02-22-bugs.md      # Bug fixing session
```

## File Naming Convention

- **Session notes:** `YYYY-MM-DD-slug.md`
  - `2026-02-20-initial-setup.md`
  - `2026-02-21-feature-auth.md`

- **Raw transcripts:** `YYYY-MM-DD.txt` (in `log/`)
  - `log/2026-02-20.txt`

## Note Structure

Each session note should contain:

```markdown
# [Session Title]

**Date:** 2026-02-20
**Participant(s):** [Names]
**Duration:** 2 hours

## Objectives

- Objective 1
- Objective 2

## Accomplishments

- [ ] Task 1 - completed
- [ ] Task 2 - blocked by X

## Decisions Made

- Decision 1: [Result]
- Decision 2: [Result]

## Blockers

- Blocker 1: [Description]
- Blocker 2: [Description]

## Next Steps

- [ ] Task 1 (assign: person)
- [ ] Task 2 (assign: person)

## Relevant Files

- `src/components/Auth.tsx`
- `docs/ARCHITECTURE.md`
```

## Progress Session Format

Used for tracking what was accomplished in a work session:

```markdown
# Session: [Date] - [Topic]

**Context:** [What was the goal]
**Time spent:** 2 hours

## What was done

- Implemented feature X
- Fixed bug Y
- Reviewed PR Z

## Code changes

- `src/auth.ts:1-50` - Refactored authentication
- `tests/auth.test.ts` - Added tests

## Notes

- Need to handle edge case on line 42
- Performance could be improved with caching

## Next session

- Complete edge case handling
- Write documentation for new API
```

## Organizing by Context

Option 1: **Time-based**
```
notes/
├── 2026-02-20-standup.md
├── 2026-02-20-planning.md
├── 2026-02-21-standup.md
```

Option 2: **Topic-based**
```
notes/
├── standup/
│   ├── 2026-02-20.md
│   └── 2026-02-21.md
├── planning/
│   ├── 2026-02-20-quarterly.md
│   └── 2026-02-21-sprints.md
├── decisions/
│   ├── architecture.md
│   └── tech-stack.md
```

Choose whichever works for your workflow. Both are valid!
