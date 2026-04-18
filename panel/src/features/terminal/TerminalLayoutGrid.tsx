import React, { useEffect, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { TerminalView } from "./TerminalView";
import type { TerminalHandle } from "./TerminalView";
import type { SessionMeta } from "./useTerminalSessions";
import { displayColor } from "./sessionColors";
import { TerminalActivityLed } from "./TerminalActivityLed";

interface Props {
  sessions: SessionMeta[];
  focusedId: string | null;
  maximized: boolean;
  onFocus: (id: string) => void;
  onExit: (id: string) => void;
  onToggleMaximize: () => void;
  onReady?: (sessionId: string, handle: TerminalHandle) => void;
}

export function TerminalLayoutGrid({
  sessions,
  focusedId,
  maximized,
  onFocus,
  onExit,
  onToggleMaximize,
  onReady,
}: Props) {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const count = sessions.length;

  if (count === 0) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ color: "var(--text-muted)" }}
      >
        <div className="text-center space-y-2">
          <div
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--text-tertiary)" }}
          >
            No terminals
          </div>
          <div className="text-[13px]">
            Use <span className="font-mono">New Terminal</span> above to start
          </div>
        </div>
      </div>
    );
  }

  const cell = (session: SessionMeta, style?: React.CSSProperties) => (
    <TerminalCell
      key={session.id}
      session={session}
      allSessions={sessions}
      focused={session.id === focusedId}
      maximized={maximized}
      onFocus={onFocus}
      onExit={onExit}
      onToggleMaximize={onToggleMaximize}
      onReady={onReady}
      style={{ height: "100%", ...style }}
    />
  );

  // Mobile OR explicit maximize: render only focused (or first) fullscreen.
  // Keep ALL other sessions mounted (hidden) so their terminal state survives.
  if (isMobile || maximized) {
    const visible = focusedId
      ? sessions.find((s) => s.id === focusedId) ?? sessions[0]
      : sessions[0];
    return (
      <div className="relative w-full h-full">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="absolute inset-0"
            style={{
              visibility: s.id === visible.id ? "visible" : "hidden",
              pointerEvents: s.id === visible.id ? "auto" : "none",
            }}
          >
            {cell(s)}
          </div>
        ))}
      </div>
    );
  }

  if (count === 1) {
    return <div className="w-full h-full">{cell(sessions[0])}</div>;
  }

  if (count === 2) {
    return (
      <div className="h-full grid grid-cols-2" style={{ gap: "4px" }}>
        {cell(sessions[0])}
        {cell(sessions[1])}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="h-full grid grid-cols-2" style={{ gap: "4px" }}>
        {cell(sessions[0], { gridRow: "1 / 3" })}
        {cell(sessions[1])}
        {cell(sessions[2])}
      </div>
    );
  }

  if (count === 4) {
    return (
      <div
        className="h-full grid grid-cols-2 grid-rows-2"
        style={{ gap: "4px" }}
      >
        {sessions.map((s) => cell(s))}
      </div>
    );
  }

  if (count === 5) {
    return (
      <div
        className="h-full grid grid-cols-2"
        style={{ gap: "4px", gridTemplateRows: "1fr 1fr 1fr" }}
      >
        {cell(sessions[0], { gridRow: "1 / 2" })}
        {cell(sessions[2], { gridRow: "1 / 2" })}
        {cell(sessions[1], { gridRow: "2 / 4" })}
        {cell(sessions[3], { gridRow: "2 / 3" })}
        {cell(sessions[4], { gridRow: "3 / 4" })}
      </div>
    );
  }

  if (count === 6) {
    return (
      <div
        className="h-full grid grid-cols-3 grid-rows-2"
        style={{ gap: "4px" }}
      >
        {sessions.map((s) => cell(s))}
      </div>
    );
  }

  return (
    <div
      className="h-full grid grid-cols-3"
      style={{ gap: "4px", gridAutoRows: "1fr" }}
    >
      {sessions.map((s) => cell(s))}
    </div>
  );
}

interface CellProps {
  session: SessionMeta;
  allSessions: SessionMeta[];
  focused: boolean;
  maximized: boolean;
  onFocus: (id: string) => void;
  onExit: (id: string) => void;
  onToggleMaximize: () => void;
  onReady?: (id: string, handle: TerminalHandle) => void;
  style?: React.CSSProperties;
}

function TerminalCell({
  session,
  allSessions,
  focused,
  maximized,
  onFocus,
  onExit,
  onToggleMaximize,
  onReady,
  style,
}: CellProps) {
  const accentColor = displayColor(session, allSessions);
  return (
    <div
      className="relative w-full overflow-hidden rounded-md group"
      style={{
        height: "100%",
        ...style,
        cursor: "pointer",
        outline: focused
          ? `1.5px solid ${accentColor}`
          : "1px solid var(--border-subtle)",
        outlineOffset: focused ? "-1.5px" : "-1px",
        transition: "outline-color 150ms, outline-width 150ms",
      }}
      onClick={() => onFocus(session.id)}
    >
      <TerminalView
        sessionId={session.id}
        focused={focused}
        onExit={() => onExit(session.id)}
        onReady={(h) => onReady?.(session.id, h)}
      />
      {/* Cell header — visible on hover or when focused */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-2 py-1 pointer-events-none transition-opacity"
        style={{
          opacity: focused ? 0.95 : 0,
          background:
            "linear-gradient(180deg, rgba(26,27,38,0.92) 0%, rgba(26,27,38,0) 100%)",
        }}
      >
        <TerminalActivityLed sessionId={session.id} />
        <span
          className="text-[10.5px] font-mono tracking-wide uppercase truncate flex-1"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.08em" }}
        >
          {session.name}
        </span>
        <div className="flex gap-0.5 pointer-events-auto">
          <CellIconButton
            title={maximized ? "Restore" : "Maximize"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize();
            }}
          >
            {maximized ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
          </CellIconButton>
          <CellIconButton
            title="Kill session"
            onClick={(e) => {
              e.stopPropagation();
              onExit(session.id);
            }}
            hoverColor="var(--red, #f7768e)"
          >
            <X size={11} />
          </CellIconButton>
        </div>
      </div>
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          // on hover of a non-focused cell, show a faint overlay so user sees it's interactive
          background: focused
            ? "transparent"
            : "radial-gradient(ellipse at top, rgba(240,198,116,0.04) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

function CellIconButton({
  children,
  onClick,
  title,
  hoverColor,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  hoverColor?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="p-1 rounded transition-colors"
      style={{ color: "var(--text-muted)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor || "var(--text-primary)";
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--text-muted)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}

export default TerminalLayoutGrid;
