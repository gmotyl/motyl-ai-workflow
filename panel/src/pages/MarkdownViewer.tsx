import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ExternalLink, Copy, FileText, Check } from "lucide-react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useActiveFile } from "../hooks/useActiveFile";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ImageDropZone from "../components/ImageDropZone";

export default function MarkdownViewer() {
  const location = useLocation();
  const filePath = location.pathname.replace(/^\/view\//, "");
  const { setActiveFile } = useActiveFile();

  // Clear context active file — URL is the source of truth here
  useEffect(() => { setActiveFile(null); }, [filePath]);

  const [content, setContent] = useState("");
  const [absolutePath, setAbsolutePath] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { lastMessage } = useWebSocket();

  const fetchContent = async () => {
    const res = await fetch(`/api/files/read/${filePath}`);
    if (res.ok) {
      const data = await res.json();
      setContent(data.content);
      setAbsolutePath(data.absolutePath);
    }
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, [filePath]);

  useEffect(() => {
    if (lastMessage?.type === "file-change") {
      const changedPath = lastMessage.path as string;
      if (changedPath?.includes(filePath)) fetchContent();
    }
  }, [lastMessage]);

  const openInVSCode = () => {
    window.open(`vscode://file/${absolutePath}`, "_self");
  };

  const copyPath = () => {
    navigator.clipboard.writeText(absolutePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) return <div className="p-6" style={{ color: "var(--text-muted)" }}>Loading...</div>;

  const isMarkdown = filePath.endsWith(".md");
  const isJson = filePath.endsWith(".json");

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <FileText className="w-4 h-4 shrink-0" style={{ color: "var(--text-tertiary)" }} />
        <span className="text-sm flex-1 font-mono truncate" style={{ color: "var(--text-tertiary)" }}>{filePath}</span>
        <button
          onClick={openInVSCode}
          className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-md transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          VS Code
        </button>
        <button
          onClick={copyPath}
          className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-md transition-colors"
          style={{ color: copied ? "var(--green)" : "var(--text-secondary)" }}
          onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}}
          onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Path"}
        </button>
      </div>

      {/* Content */}
      <ImageDropZone targetMarkdown={filePath}>
        {isMarkdown ? (
          <MarkdownRenderer content={content} />
        ) : isJson ? (
          <pre className="text-sm font-mono p-4 rounded-lg overflow-auto" style={{ background: "var(--bg-surface)", color: "var(--text-primary)" }}>
            {JSON.stringify(JSON.parse(content), null, 2)}
          </pre>
        ) : (
          <pre className="text-sm font-mono whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{content}</pre>
        )}
      </ImageDropZone>
    </div>
  );
}
