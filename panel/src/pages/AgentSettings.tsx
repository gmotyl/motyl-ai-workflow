import { useState, useEffect, useCallback } from "react";
import { ExternalLink, Copy, Check, FileText, ChevronDown, ChevronRight } from "lucide-react";

interface SettingsFile {
  name: string;
  path: string;
  exists: boolean;
  size?: number;
  modified?: number;
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

  const toggle = useCallback(async () => {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    if (content !== null) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/agent-settings/read?path=${encodeURIComponent(file.path)}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
      } else {
        setContent(`Error: ${res.status}`);
      }
    } catch {
      setContent("Failed to load file");
    }
    setLoading(false);
  }, [expanded, content, file.path]);

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
        <FileText size={14} style={{ color: "var(--text-tertiary)" }} />
        <span className="text-sm font-medium flex-1" style={{ color: "var(--text-primary)" }}>{file.name}</span>
        {file.size != null && (
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{formatSize(file.size)}</span>
        )}
        {file.modified != null && (
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{formatDate(file.modified)}</span>
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
          <div className="px-2 py-1 text-[11px] font-mono" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}>
            {file.path}
          </div>
          <pre
            className="text-xs font-mono p-4 overflow-auto"
            style={{ color: "var(--text-secondary)", maxHeight: "400px" }}
          >
            {loading ? "Loading..." : content}
          </pre>
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
