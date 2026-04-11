import { useState, useEffect } from "react";
import { GitBranch, Upload, Check, ExternalLink, ArrowLeft, Columns2, AlignJustify } from "lucide-react";
import DiffView, { type DiffMode } from "./DiffView";

interface GitFile {
  status: string;
  path: string;
}

interface GitChangesProps {
  /** Absolute repo path, or undefined for the workspace repo */
  repo?: string;
  /** Repo display name */
  title?: string;
  /** Show commit/push controls */
  showCommit?: boolean;
}

function statusLabel(s: string) {
  if (s === "??") return "U";
  if (s === "M") return "M";
  if (s === "D") return "D";
  if (s === "A") return "A";
  return s;
}

function statusColor(s: string) {
  if (s === "??") return "var(--green)";
  if (s === "M") return "var(--yellow)";
  if (s === "D") return "var(--red)";
  return "var(--text-tertiary)";
}

export default function GitChanges({ repo, title, showCommit = true }: GitChangesProps) {
  const [files, setFiles] = useState<GitFile[]>([]);
  const [branch, setBranch] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [commitMsg, setCommitMsg] = useState("");
  const [loading, setLoading] = useState("");
  const [activeDiff, setActiveDiff] = useState<string | null>(null);
  const [diffContent, setDiffContent] = useState("");
  const [diffMode, setDiffMode] = useState<DiffMode>("inline");
  const [diffLoading, setDiffLoading] = useState(false);

  const qs = repo ? `?repo=${encodeURIComponent(repo)}` : "";

  const fetchStatus = async () => {
    const [statusRes, branchRes, suggestRes] = await Promise.all([
      fetch(`/api/git/status${qs}`),
      fetch(`/api/git/branch${qs}`),
      fetch(`/api/git/suggest-message${qs}`),
    ]);
    if (statusRes.ok) setFiles(await statusRes.json());
    if (branchRes.ok) setBranch((await branchRes.json()).branch);
    if (suggestRes.ok) setSuggestion((await suggestRes.json()).suggestion);
  };

  useEffect(() => { fetchStatus(); }, [repo]);
  useEffect(() => { setCommitMsg(suggestion); }, [suggestion]);

  const toggleFile = (path: string) => {
    const next = new Set(selected);
    next.has(path) ? next.delete(path) : next.add(path);
    setSelected(next);
  };

  const openDiff = async (path: string) => {
    if (activeDiff === path) { setActiveDiff(null); return; }
    setActiveDiff(path);
    setDiffLoading(true);
    try {
      const res = await fetch(`/api/git/diff?file=${encodeURIComponent(path)}${repo ? `&repo=${encodeURIComponent(repo)}` : ""}`);
      if (res.ok) setDiffContent((await res.json()).diff);
    } catch { setDiffContent(""); }
    setDiffLoading(false);
  };

  const stageFiles = async (filesToStage: string[]) => {
    setLoading("staging");
    await fetch("/api/git/stage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files: filesToStage, repo }),
    });
    setSelected(new Set());
    await fetchStatus();
    setLoading("");
  };

  const commit = async (push = false) => {
    if (!commitMsg.trim()) return;
    setLoading("committing");
    await fetch("/api/git/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: commitMsg, repo }),
    });
    if (push) {
      setLoading("pushing");
      await fetch("/api/git/push", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repo }) });
    }
    setCommitMsg("");
    setActiveDiff(null);
    await fetchStatus();
    setLoading("");
  };

  const isDimmed = (path: string) => path.endsWith(".DS_Store");

  // Diff detail view
  if (activeDiff) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setActiveDiff(null)}
            className="flex items-center gap-1.5 text-sm rounded-md px-2 py-1 transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <span className="text-sm font-mono flex-1 truncate" style={{ color: "var(--text-secondary)" }}>{activeDiff}</span>
          <div className="flex rounded-md overflow-hidden" style={{ border: "1px solid var(--border-default)" }}>
            <button
              onClick={() => setDiffMode("inline")}
              className="p-1.5 transition-colors"
              style={{ background: diffMode === "inline" ? "var(--bg-active)" : "transparent", color: diffMode === "inline" ? "var(--text-primary)" : "var(--text-tertiary)" }}
              title="Inline diff"
            >
              <AlignJustify size={14} />
            </button>
            <button
              onClick={() => setDiffMode("side-by-side")}
              className="p-1.5 transition-colors"
              style={{ background: diffMode === "side-by-side" ? "var(--bg-active)" : "transparent", color: diffMode === "side-by-side" ? "var(--text-primary)" : "var(--text-tertiary)", borderLeft: "1px solid var(--border-default)" }}
              title="Side by side"
            >
              <Columns2 size={14} />
            </button>
          </div>
        </div>
        {diffLoading ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading diff...</p>
        ) : (
          <DiffView diff={diffContent} mode={diffMode} />
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <GitBranch className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
        {title && <span className="text-sm font-semibold">{title}</span>}
        {branch && (
          <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
            {branch}
          </span>
        )}
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {files.length} changed
        </span>
      </div>

      {files.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>No changes</p>
      ) : (
        <>
          {/* File list */}
          <div className="space-y-0.5 mb-4">
            {files.map((f) => (
              <div
                key={f.path}
                className={`flex items-center gap-2 py-1.5 px-2 rounded-md group transition-colors ${isDimmed(f.path) ? "opacity-35" : ""}`}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {showCommit && (
                  <input
                    type="checkbox"
                    checked={selected.has(f.path)}
                    onChange={() => toggleFile(f.path)}
                    className="shrink-0"
                  />
                )}
                <span className="text-[11px] font-mono font-semibold w-4 text-center shrink-0" style={{ color: statusColor(f.status) }}>
                  {statusLabel(f.status)}
                </span>
                <button
                  onClick={() => openDiff(f.path)}
                  className="text-[13px] font-mono truncate flex-1 text-left"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {f.path}
                </button>
                {!repo && f.path.startsWith("projects/") && (
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(`/view/${f.path.replace(/^projects\//, "")}`, "_self"); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                    style={{ color: "var(--text-tertiary)" }}
                    title="Open file"
                  >
                    <ExternalLink size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Stage + Commit */}
          {showCommit && (
            <>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => stageFiles([...selected])}
                  disabled={selected.size === 0 || !!loading}
                  className="px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-30"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                >
                  Stage selected ({selected.size})
                </button>
                <button
                  onClick={() => stageFiles(files.map((f) => f.path))}
                  disabled={!!loading}
                  className="px-3 py-1.5 text-sm rounded-md transition-colors disabled:opacity-30"
                  style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                >
                  Stage all
                </button>
              </div>

              <div className="pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <textarea
                  value={commitMsg}
                  onChange={(e) => setCommitMsg(e.target.value)}
                  placeholder="Commit message..."
                  className="w-full rounded-lg p-3 text-sm font-mono resize-none h-20 focus:outline-none transition-colors"
                  style={{ background: "var(--bg-base)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => commit(false)}
                    disabled={!commitMsg.trim() || !!loading}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md font-medium transition-colors disabled:opacity-30"
                    style={{ background: "var(--accent)", color: "var(--bg-base)" }}
                  >
                    <Check className="w-3.5 h-3.5" />
                    Commit
                  </button>
                  <button
                    onClick={() => commit(true)}
                    disabled={!commitMsg.trim() || !!loading}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md transition-colors disabled:opacity-30"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Commit & Push
                  </button>
                </div>
                {loading && <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{loading}...</p>}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
