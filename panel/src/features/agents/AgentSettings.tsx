import { useState, useEffect, useCallback, useRef } from "react";
import { ExternalLink, Copy, Check, FileText, ChevronDown, ChevronRight, Save, Pencil, X } from "lucide-react";

interface SettingsFile {
  name: string;
  path: string;
  exists: boolean;
  size?: number;
  modified?: number;
  editable?: boolean;
}

interface AgentConfig {
  agent: string;
  icon: string;
  files: SettingsFile[];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function FileViewer({ file }: { file: SettingsFile }) {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/agent-settings/read?path=${encodeURIComponent(file.path)}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        setDraft(data.content);
      } else {
        setContent(`Error: ${res.status}`);
      }
    } catch {
      setContent("Failed to load file");
    }
    setLoading(false);
  }, [file.path]);

  const toggle = useCallback(async () => {
    if (expanded) { setExpanded(false); setEditing(false); return; }
    setExpanded(true);
    if (content !== null) return;
    fetchContent();
  }, [expanded, content, fetchContent]);

  const startEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDraft(content ?? "");
    setEditing(true);
    if (!expanded) {
      setExpanded(true);
      if (content === null) fetchContent();
    }
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [content, expanded, fetchContent]);

  const cancelEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(false);
    setDraft(content ?? "");
    setSaveStatus("idle");
  }, [content]);

  const save = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/agent-settings/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: file.path, content: draft }),
      });
      if (res.ok) {
        setContent(draft);
        setEditing(false);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
    setSaving(false);
  }, [file.path, draft]);

  const openInVSCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`vscode://file/${file.path}`, "_self");
  };

  const copyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(file.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isAgent = file.editable;

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border-subtle)" }}>
      <button
        onClick={toggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
        style={{ background: expanded ? "var(--bg-active)" : "var(--bg-surface)" }}
        onMouseEnter={(e) => { if (!expanded) e.currentTarget.style.background = "var(--bg-hover)"; }}
        onMouseLeave={(e) => { if (!expanded) e.currentTarget.style.background = "var(--bg-surface)"; }}
      >
        {expanded ? <ChevronDown size={14} style={{ color: "var(--text-muted)" }} /> : <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />}
        <FileText size={14} style={{ color: isAgent ? "var(--accent)" : "var(--text-tertiary)" }} />
        <span className="text-sm font-medium flex-1" style={{ color: "var(--text-primary)" }}>
          {file.name}
          {isAgent && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded" style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}>agent</span>}
        </span>
        {saveStatus === "saved" && <span className="text-[11px]" style={{ color: "var(--green)" }}>Saved</span>}
        {saveStatus === "error" && <span className="text-[11px]" style={{ color: "var(--red)" }}>Error</span>}
        {file.size != null && (
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{formatSize(file.size)}</span>
        )}
        {file.modified != null && (
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{formatDate(file.modified)}</span>
        )}
        {isAgent && !editing && (
          <button
            onClick={startEditing}
            className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors"
            style={{ color: "var(--accent)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <Pencil size={11} />
            Edit
          </button>
        )}
        <button
          onClick={openInVSCode}
          className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <ExternalLink size={11} />
          VS Code
        </button>
        <button
          onClick={copyPath}
          className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors"
          style={{ color: copied ? "var(--green)" : "var(--text-secondary)" }}
          onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}}
          onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = copied ? "var(--green)" : "var(--text-secondary)"; }}}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied" : "Path"}
        </button>
      </button>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-base)" }}>
          <div className="flex items-center px-2 py-1" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <span className="text-[11px] font-mono flex-1" style={{ color: "var(--text-muted)" }}>{file.path}</span>
            {editing && (
              <div className="flex items-center gap-1">
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors"
                  style={{ color: "var(--green)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <Save size={11} />
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEditing}
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <X size={11} />
                  Cancel
                </button>
              </div>
            )}
          </div>
          {editing ? (
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full text-xs font-mono p-4 outline-none resize-y"
              style={{ color: "var(--text-secondary)", background: "var(--bg-base)", minHeight: "300px", maxHeight: "70vh", border: "none" }}
              spellCheck={false}
            />
          ) : (
            <pre
              className="text-xs font-mono p-4 overflow-auto"
              style={{ color: "var(--text-secondary)", maxHeight: "400px" }}
            >
              {loading ? "Loading..." : content}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default function AgentSettings() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agent-settings")
      .then((r) => r.json())
      .then(setAgents)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6" style={{ color: "var(--text-muted)" }}>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Agent Settings</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Configuration files for your AI coding agents. Click to expand and view, or open in VS Code to edit.
      </p>

      <div className="space-y-8">
        {agents.map((agent) => (
          <section key={agent.agent}>
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              {agent.agent}
            </h2>
            <div className="space-y-2">
              {agent.files.map((file) => (
                <FileViewer key={file.path} file={file} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {agents.length === 0 && (
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          No agent configuration files found on this system.
        </div>
      )}
    </div>
  );
}
