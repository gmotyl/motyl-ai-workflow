import { type ReactNode } from "react";
import { PanelLeft, PanelRight } from "lucide-react";
import { useSidebarState } from "../hooks/useSidebarState";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Breadcrumbs from "./Breadcrumbs";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const left = useSidebarState("leftSidebar");
  const right = useSidebarState("rightSidebar");

  return (
    <div className="layout-container flex h-screen overflow-hidden relative" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Left toggle */}
      <button
        onClick={left.toggle}
        className={`sidebar-toggle ${!left.expanded ? "visible" : ""}`}
        style={{ left: left.expanded ? 228 : 8 }}
        title={left.expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        <PanelLeft size={14} />
      </button>

      {/* Left sidebar */}
      <aside
        className={`sidebar flex-shrink-0 ${!left.expanded ? "sidebar-collapsed" : ""}`}
        style={{
          width: left.expanded ? "var(--sidebar-width)" : "0",
          borderRight: left.expanded ? "1px solid var(--border-subtle)" : "none",
          background: "var(--bg-surface)",
        }}
      >
        <LeftSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto min-w-0">
        <Breadcrumbs />
        {children}
      </main>

      {/* Right toggle */}
      <button
        onClick={right.toggle}
        className={`sidebar-toggle ${!right.expanded ? "visible" : ""}`}
        style={{ right: right.expanded ? 252 : 8 }}
        title={right.expanded ? "Collapse file tree" : "Expand file tree"}
      >
        <PanelRight size={14} />
      </button>

      {/* Right sidebar */}
      <aside
        className={`sidebar flex-shrink-0 ${!right.expanded ? "sidebar-collapsed" : ""}`}
        style={{
          width: right.expanded ? "264px" : "0",
          borderLeft: right.expanded ? "1px solid var(--border-subtle)" : "none",
          background: "var(--bg-surface)",
        }}
      >
        <RightSidebar />
      </aside>
    </div>
  );
}
