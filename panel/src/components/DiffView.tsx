export type DiffMode = "inline" | "side-by-side";

interface DiffViewProps {
  diff: string;
  mode: DiffMode;
}

export default function DiffView({ diff, mode }: DiffViewProps) {
  if (!diff) return <p className="text-xs" style={{ color: "var(--text-muted)" }}>No changes (binary or new file)</p>;

  const lines = diff.split("\n");

  if (mode === "inline") {
    return (
      <pre className="text-xs font-mono overflow-auto rounded-lg p-3 leading-relaxed" style={{ background: "var(--bg-base)" }}>
        {lines.map((line, i) => {
          let cls = "";
          if (line.startsWith("+") && !line.startsWith("+++")) cls = "diff-line-add";
          else if (line.startsWith("-") && !line.startsWith("---")) cls = "diff-line-remove";
          else if (line.startsWith("@@")) cls = "diff-line-header";
          return (
            <div key={i} className={`px-2 ${cls}`}>
              {line}
            </div>
          );
        })}
      </pre>
    );
  }

  // Side-by-side
  const left: { line: string; type: string }[] = [];
  const right: { line: string; type: string }[] = [];
  let li = 0, ri = 0;

  for (const line of lines) {
    if (line.startsWith("@@")) {
      while (li < ri) { left.push({ line: "", type: "pad" }); li++; }
      while (ri < li) { right.push({ line: "", type: "pad" }); ri++; }
      left.push({ line, type: "header" }); li++;
      right.push({ line, type: "header" }); ri++;
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      left.push({ line: line.slice(1), type: "remove" }); li++;
    } else if (line.startsWith("+") && !line.startsWith("+++")) {
      right.push({ line: line.slice(1), type: "add" }); ri++;
    } else if (!line.startsWith("diff ") && !line.startsWith("index ") && !line.startsWith("---") && !line.startsWith("+++")) {
      while (li < ri) { left.push({ line: "", type: "pad" }); li++; }
      while (ri < li) { right.push({ line: "", type: "pad" }); ri++; }
      left.push({ line: line.slice(1) || line, type: "context" }); li++;
      right.push({ line: line.slice(1) || line, type: "context" }); ri++;
    }
  }
  while (li < ri) { left.push({ line: "", type: "pad" }); li++; }
  while (ri < li) { right.push({ line: "", type: "pad" }); ri++; }

  const typeClass = (t: string) =>
    t === "add" ? "diff-line-add" : t === "remove" ? "diff-line-remove" : t === "header" ? "diff-line-header" : "";

  return (
    <div className="flex gap-0 overflow-auto rounded-lg" style={{ background: "var(--bg-base)" }}>
      <pre className="text-xs font-mono flex-1 min-w-0 leading-relaxed p-2" style={{ borderRight: "1px solid var(--border-subtle)" }}>
        {left.map((l, i) => (
          <div key={i} className={`px-2 ${typeClass(l.type)}`}>{l.line || " "}</div>
        ))}
      </pre>
      <pre className="text-xs font-mono flex-1 min-w-0 leading-relaxed p-2">
        {right.map((l, i) => (
          <div key={i} className={`px-2 ${typeClass(l.type)}`}>{l.line || " "}</div>
        ))}
      </pre>
    </div>
  );
}
