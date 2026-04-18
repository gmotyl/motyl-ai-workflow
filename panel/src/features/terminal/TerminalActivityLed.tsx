import { useTerminalActivity } from "./useTerminalActivity";

interface Props {
  sessionId: string;
  size?: "sm" | "lg";
  title?: string;
}

const LABEL: Record<string, string> = {
  idle: "Idle",
  busy: "Busy",
  attention: "Needs attention",
};

/**
 * Tri-state activity LED rendered next to every session reference.
 * See index.css for the per-state colors and pulse animations.
 */
export function TerminalActivityLed({
  sessionId,
  size = "sm",
  title,
}: Props) {
  const state = useTerminalActivity(sessionId);
  return (
    <span
      className={`terminal-led ${size === "lg" ? "terminal-led-lg" : ""}`}
      data-state={state}
      title={title ?? LABEL[state]}
      aria-label={LABEL[state]}
    />
  );
}

export default TerminalActivityLed;
