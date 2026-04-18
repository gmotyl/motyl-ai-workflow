import { FolderTree, Terminal } from "lucide-react";
import CommandsList from "../commands/CommandsList";
import FileTree from "../explorer/FileTree";

export default function RightSidebar() {
  return (
    <div className="p-3 overflow-auto h-full pt-10 flex flex-col gap-5">
      <section>
        <div className="flex items-center gap-2 mb-2 px-1">
          <FolderTree size={12} style={{ color: "var(--text-tertiary)" }} />
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-tertiary)" }}
          >
            Explorer
          </h2>
        </div>
        <FileTree />
      </section>
      <section>
        <div className="flex items-center gap-2 mb-2 px-1">
          <Terminal size={12} style={{ color: "var(--text-tertiary)" }} />
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-tertiary)" }}
          >
            Commands
          </h2>
        </div>
        <CommandsList />
      </section>
    </div>
  );
}
