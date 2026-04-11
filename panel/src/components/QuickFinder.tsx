import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { Search, FileText } from "lucide-react";
import { useFileIndex } from "../hooks/useFileIndex";

const PROJECT_COLORS = [
  { bg: "rgba(96,165,250,0.15)", fg: "#60a5fa" },
  { bg: "rgba(74,222,128,0.15)", fg: "#4ade80" },
  { bg: "rgba(168,85,247,0.15)", fg: "#a855f7" },
  { bg: "rgba(251,146,60,0.15)", fg: "#fb923c" },
  { bg: "rgba(244,114,182,0.15)", fg: "#f472b6" },
  { bg: "rgba(34,211,238,0.15)", fg: "#22d3ee" },
  { bg: "rgba(250,204,21,0.15)", fg: "#facc15" },
  { bg: "rgba(248,113,113,0.15)", fg: "#f87171" },
  { bg: "rgba(45,212,191,0.15)", fg: "#2dd4bf" },
];

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function QuickFinder() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const files = useFileIndex();

  const projectColorMap = useMemo(() => {
    const map = new Map<string, typeof PROJECT_COLORS[0]>();
    const projects = [...new Set(files.map((f) => f.project))].sort();
    projects.forEach((p, i) => map.set(p, PROJECT_COLORS[i % PROJECT_COLORS.length]));
    return map;
  }, [files]);

  const fuse = useMemo(() => new Fuse(files, { keys: ["relativePath"], threshold: 0.4 }), [files]);

  const isSemanticMode = query.startsWith("?");

  const fuzzyResults = useMemo(() => {
    if (isSemanticMode || !query) return files.slice(0, 20);
    return fuse.search(query).slice(0, 20).map((r) => r.item);
  }, [query, fuse, files, isSemanticMode]);

  useEffect(() => {
    if (!isSemanticMode) { setSearchResults(null); setSearching(false); return; }
    const q = query.slice(1).trim();
    if (!q) { setSearchResults(null); setSearching(false); return; }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/qmd?q=${encodeURIComponent(q)}`);
        setSearchResults(res.ok ? await res.text() : res.status === 404 ? "Search API not available yet" : `Error: ${res.status}`);
      } catch { setSearchResults("Search API not available yet"); }
      finally { setSearching(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, isSemanticMode]);

  useEffect(() => { setSelectedIndex(0); }, [query]);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
    else { setQuery(""); setSearchResults(null); setSearching(false); }
  }, [open]);
  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current.querySelector("[data-selected='true']");
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "p") { e.preventDefault(); setOpen((p) => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openFile = useCallback((relativePath: string, _abs?: string, useVSCode = false) => {
    if (useVSCode) window.open(`vscode://file/${relativePath}`);
    else navigate(`/view/${relativePath}`);
    setOpen(false);
  }, [navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (isSemanticMode) return;
    const count = fuzzyResults.length;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => (i + 1) % count); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => (i - 1 + count) % count); }
    else if (e.key === "Enter") {
      const file = fuzzyResults[selectedIndex];
      if (file) openFile(file.relativePath, undefined, e.metaKey || e.ctrlKey);
    }
  }, [fuzzyResults, selectedIndex, isSemanticMode, openFile]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <Search size={16} style={{ color: "var(--text-tertiary)" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Search files... or type "?" for semantic search'
            className="flex-1 bg-transparent text-base outline-none"
            style={{ color: "var(--text-primary)" }}
            spellCheck={false}
            autoComplete="off"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-xs" style={{ color: "var(--text-muted)" }}>
              ESC
            </button>
          )}
        </div>

        <div ref={listRef} className="overflow-y-auto" style={{ maxHeight: "55vh" }}>
          {isSemanticMode ? (
            <div className="p-4">
              {searching && <div className="text-sm animate-pulse" style={{ color: "var(--text-tertiary)" }}>Searching...</div>}
              {!searching && searchResults && (
                <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {searchResults}
                </pre>
              )}
              {!searching && !searchResults && query === "?" && (
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>Type a query after "?"</div>
              )}
            </div>
          ) : fuzzyResults.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No files found</div>
          ) : (
            fuzzyResults.map((file, i) => {
              const isSelected = i === selectedIndex;
              const colors = projectColorMap.get(file.project) ?? PROJECT_COLORS[0];
              return (
                <button
                  key={file.relativePath}
                  data-selected={isSelected}
                  onClick={() => openFile(file.relativePath)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left transition-colors duration-75"
                  style={{ background: isSelected ? "var(--bg-active)" : "transparent" }}
                >
                  <FileText size={14} style={{ color: "var(--text-muted)" }} />
                  <span
                    className="text-[11px] px-1.5 py-0.5 rounded font-medium shrink-0"
                    style={{ background: colors.bg, color: colors.fg }}
                  >
                    {file.project}
                  </span>
                  <span className="text-sm font-mono truncate flex-1 min-w-0" style={{ color: "var(--text-primary)" }}>
                    {file.relativePath}
                  </span>
                  {file.modified > 0 && (
                    <span className="text-[11px] shrink-0 ml-2" style={{ color: "var(--text-muted)" }}>
                      {formatDate(file.modified)}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 flex gap-4 text-[11px]" style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>⌘↵ VS Code</span>
          <span>esc close</span>
          <span className="ml-auto" style={{ color: "var(--text-tertiary)" }}>? semantic search</span>
        </div>
      </div>
    </div>
  );
}
