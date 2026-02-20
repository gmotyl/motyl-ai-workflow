#!/bin/bash
# /question or /q - Query project knowledge

set -e

PROJECT_ROOT="${PROJECT_ROOT:-.}"

# Join all arguments as the query
QUERY="$@"

if [ -z "$QUERY" ]; then
    echo "❓ Project Knowledge Query"
    echo "=========================="
    echo "Usage: /question [your question]"
    echo "       /q [your question]"
    echo ""
    echo "Example: /question What is the project architecture?"
    exit 0
fi

echo "❓ Searching project knowledge for: $QUERY"
echo ""

# Look for relevant files
echo "📄 Relevant Project Files:"
echo ""

# Search in key documentation files
for file in "$PROJECT_ROOT/PROJECT.md" "$PROJECT_ROOT/DECISIONS.md" "$PROJECT_ROOT/CLAUDE.md" "$PROJECT_ROOT/README.md"; do
    if [ -f "$file" ]; then
        if grep -q -i "$QUERY" "$file" 2>/dev/null; then
            echo "✓ $(basename $file) - contains relevant information"
            # Show matching lines with context
            echo ""
            grep -i "$QUERY" "$file" -C 2 | head -20
            echo ""
        fi
    fi
done

# Search in notes
if [ -d "$PROJECT_ROOT/notes/notes" ]; then
    echo "📝 Notes mentioning query:"
    for note_file in "$PROJECT_ROOT/notes/notes"/*.md; do
        if [ -f "$note_file" ] && grep -q -i "$QUERY" "$note_file" 2>/dev/null; then
            echo "✓ $(basename $note_file)"
        fi
    done
fi

echo ""
echo "For comprehensive search, use: grep -r '$QUERY' ."
echo "Or ask Claude directly for analysis."
