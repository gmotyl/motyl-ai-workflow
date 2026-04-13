import { useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useActiveFile } from "../hooks/useActiveFile";
import { useBreadcrumbActions } from "../components/Breadcrumbs";
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

  const openInVSCode = useCallback(() => {
    window.open(`vscode://file/${absolutePath}`, "_self");
  }, [absolutePath]);

  const copyPath = useCallback(() => {
    navigator.clipboard.writeText(absolutePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [absolutePath]);

  // Inject VS Code + Path buttons into the breadcrumb bar
  useBreadcrumbActions(
    absolutePath ? (
      <>
        <button
          onClick={openInVSCode}
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <ExternalLink className="w-3 h-3" />
          VS Code
        </button>
        <button
          onClick={copyPath}
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors"
          style={{ color: copied ? "var(--green)" : "var(--text-secondary)" }}
          onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}}
          onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Path"}
        </button>
      </>
    ) : null,
    [absolutePath, copied, openInVSCode, copyPath]
  );

  if (loading) return <div className="p-6" style={{ color: "var(--text-muted)" }}>Loading...</div>;

  const isMarkdown = filePath.endsWith(".md");
  const isJson = filePath.endsWith(".json");

  return (
    <div className="p-6">
      <ImageDropZone targetMarkdown={filePath}>
        {isMarkdown ? (
          <MarkdownRenderer content={content} basePath={filePath} />
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
