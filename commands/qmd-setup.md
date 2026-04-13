# QMD Setup & Auto-Indexing

This project uses QMD for semantic search and knowledge management across project notes. Collections have been created for each project folder.

## Collections

Collections are set up for:
- **alokai** - 13 documents indexed
- **ch** - 28 documents indexed
- **doterra** - 10 documents indexed
- **metro** - 34 documents indexed
- **openclaw** - 4 documents indexed

## Auto-Reindexing

A **post-commit hook** is configured to automatically reindex the qmd collections whenever markdown files are modified and committed.

### How It Works

The hook (`.git/hooks/post-commit`) runs after each commit and:
1. Checks if any `.md` files were changed
2. If yes, runs `qmd update` to refresh the search index
3. Runs `qmd embed` to generate embeddings for semantic search
4. Logs success/failure to the console

### Manual Commands

If you need to manually reindex:

```bash
# Update all collections
qmd update

# List all collections with their status
qmd collection list

# Add a new collection for a new project folder
qmd collection add projects/projectname --name projectname --mask "**/*.md"

# Generate embeddings (needed after initial collection creation)
qmd embed
```

### Migrating collections after notes/ → projects/ rename

If collections were registered with the old `notes/` path, re-register them:

```bash
qmd collection add projects/alokai --name alokai --mask "**/*.md"
qmd collection add projects/ch --name ch --mask "**/*.md"
qmd collection add projects/doterra --name doterra --mask "**/*.md"
qmd collection add projects/metro --name metro --mask "**/*.md"
qmd collection add projects/openclaw --name openclaw --mask "**/*.md"
qmd embed
```

### What Gets Indexed

The collections index all markdown files (`**/*.md`) in each project folder. This includes:
- Memos and notes
- Meeting notes
- Decision records
- Documentation

The index is used for semantic search and knowledge retrieval across the project notes.
