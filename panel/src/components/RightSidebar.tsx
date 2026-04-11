import { FolderTree } from "lucide-react";
import FileTree from "./FileTree";

export default function RightSidebar() {
  return (
    <div className="p-3 overflow-auto h-full pt-10">
      <div className="flex items-center gap-2 mb-2 px-1">
        <FolderTree size={12} style={{ color: "var(--text-tertiary)" }} />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
          Explorer
        </h2>
      </div>
      <FileTree />
    </div>
  );
}
