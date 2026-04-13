import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FileText, ExternalLink, Copy, Check, ArrowLeft, GitFork } from "lucide-react";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ImageDropZone from "../components/ImageDropZone";
import GitChanges from "../components/GitChanges";
import { useFileIndex } from "../hooks/useFileIndex";
import { useProjects } from "../hooks/useProjects";
import { useWebSocket } from "../hooks/useWebSocket";
import { useActiveFile } from "../hooks/useActiveFile";

export default function ProjectView() {
  const { name, section } = useParams<{ name: string; section?: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [absolutePath, setAbsolutePath] = useState("");
  const [error, setError] = useState<string | null>(null);
  const files = useFileIndex();
  const projects = useProjects();
  const { lastMessage } = useWebSocket();
  const { setActiveFile } = useActiveFile();

  const project = projects.find((p) => p.name === name);
  const hasRepos = (project?.repos?.length ?? 0) > 0;

  // Selected file within a section (inline view)
  const [selectedFile, setSelectedFileState] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [fileAbsPath, setFileAbsPath] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Wrap setSelectedFile to also update the shared context
  const setSelectedFile = (path: string | null) => {
    setSelectedFileState(path);
    setActiveFile(path);
  };

  // Reset selected file when section changes
  useEffect(() => { setSelectedFile(null); }, [name, section]);

  // Fetch PROJECT.md for overview
  useEffect(() => {
    if (!name || section) return;
    setContent(null);
    setError(null);
    fetch(`/api/files/read/${name}/PROJECT.md`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Not found (${res.status})`);
        const data = await res.json();
        setContent(data.content);
        setAbsolutePath(data.absolutePath || "");
      })
      .catch((err) => setError(err.message));
  }, [name, section]);

  // Fetch selected file content
  useEffect(() => {
    if (!selectedFile) return;
    setFileLoading(true);
    fetch(`/api/files/read/${selectedFile}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setFileContent(data.content);
          setFileAbsPath(data.absolutePath || "");
        }
      })
      .finally(() => setFileLoading(false));
  }, [selectedFile]);

  // Auto-refresh selected file
  useEffect(() => {
    if (!selectedFile || lastMessage?.type !== "file-change") return;
    const changedPath = lastMessage.path as string;
    if (changedPath?.includes(selectedFile)) {
      fetch(`/api/files/read/${selectedFile}`)
        .then(async (res) => { if (res.ok) setFileContent((await res.json()).content); });
    }
  }, [lastMessage, selectedFile]);

  const sectionFiles = section && section !== "repos"
    ? files
        .filter((f) => f.project === name && f.relativePath.split("/")[1] === section)
        .sort((a, b) => b.modified - a.modified)
    : [];

  const sections = ["plans", "notes", "memo", "progress"];
  if (hasRepos) sections.push("repos");

  const openInVSCode = (path: string) => window.open(`vscode://file/${path}`, "_self");

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isMarkdown = (p: string) => p.endsWith(".md");
  const isJson = (p: string) => p.endsWith(".json");

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-semibold mb-4 capitalize">{name}</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 text-sm">
        {[{ label: "Overview", to: `/project/${name}`, active: !section }, ...sections.map((s) => ({ label: s, to: `/project/${name}/${s}`, active: section === s }))].map(
          (tab) => (
            <Link
              key={tab.label}
              to={tab.to}
              className="px-3 py-1.5 rounded-md capitalize transition-colors"
              style={{
                background: tab.active ? "var(--bg-active)" : "transparent",
                color: tab.active ? "var(--text-primary)" : "var(--text-tertiary)",
              }}
              onMouseEnter={(e) => { if (!tab.active) e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { if (!tab.active) e.currentTarget.style.background = tab.active ? "var(--bg-active)" : "transparent"; }}
            >
              {tab.label}
            </Link>
          )
        )}
      </div>

      {/* Repos tab */}
      {section === "repos" && project?.repos && (
        <div className="space-y-6">
          {project.repos.map((repo) => (
            <div key={repo.path} className="rounded-lg p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-2 mb-3">
                <GitFork size={14} style={{ color: "var(--accent)" }} />
                <span className="text-sm font-semibold">{repo.name}</span>
                <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{repo.path}</span>
              </div>
              <GitChanges repo={repo.path} showCommit />
            </div>
          ))}
        </div>
      )}

      {/* File section listing */}
      {section && section !== "repos" && !selectedFile && (
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-tertiary)" }}>
            {section} ({sectionFiles.length} files)
          </h2>
          {sectionFiles.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No files in this section.</p>
          ) : (
            <div className="space-y-0.5">
              {sectionFiles.map((file) => {
                const fileName = file.relativePath.split("/").pop() ?? file.relativePath;
                const date = new Date(file.modified).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                return (
                  <button
                    key={file.relativePath}
                    onClick={() => setSelectedFile(file.relativePath)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-left transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <FileText size={14} className="shrink-0" style={{ color: "var(--text-tertiary)" }} />
                    <span className="text-sm truncate flex-1" style={{ color: "var(--text-secondary)" }}>{fileName}</span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{date}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Inline file viewer */}
      {section && section !== "repos" && selectedFile && (
        <div>
          <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <button
              onClick={() => setSelectedFile(null)}
              className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-md transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <span className="text-sm font-mono truncate flex-1" style={{ color: "var(--text-tertiary)" }}>{selectedFile.split("/").pop()}</span>
            {fileAbsPath && (
              <>
                <button onClick={() => openInVSCode(fileAbsPath)} className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-md transition-colors" style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                  <ExternalLink className="w-3.5 h-3.5" /> VS Code
                </button>
                <button onClick={() => copyPath(fileAbsPath)} className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-md transition-colors"
                  style={{ color: copied ? "var(--green)" : "var(--text-secondary)" }}>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Path"}
                </button>
              </>
            )}
          </div>
          {fileLoading ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>
          ) : (
            <ImageDropZone targetMarkdown={selectedFile}>
              {isMarkdown(selectedFile) ? <MarkdownRenderer content={fileContent} basePath={selectedFile} />
                : isJson(selectedFile) ? (
                  <pre className="text-sm font-mono p-4 rounded-lg overflow-auto" style={{ background: "var(--bg-surface)" }}>
                    {(() => { try { return JSON.stringify(JSON.parse(fileContent), null, 2); } catch { return fileContent; } })()}
                  </pre>
                ) : <pre className="text-sm font-mono whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{fileContent}</pre>}
            </ImageDropZone>
          )}
        </div>
      )}

      {/* Overview */}
      {!section && (
        <>
          {absolutePath && (
            <div className="flex gap-2 mb-4">
              <button onClick={() => openInVSCode(absolutePath)} className="flex items-center gap-1.5 text-sm px-2 py-1 rounded-md transition-colors" style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                <ExternalLink className="w-3.5 h-3.5" /> Open in VS Code
              </button>
            </div>
          )}
          {error && <p className="text-sm" style={{ color: "var(--red)" }}>Failed to load PROJECT.md: {error}</p>}
          {!error && content === null && <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading...</p>}
          {content !== null && <MarkdownRenderer content={content} basePath={`${name}/PROJECT.md`} />}
        </>
      )}
    </div>
  );
}
