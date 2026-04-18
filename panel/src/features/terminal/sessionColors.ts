import type { SessionMeta } from "./useTerminalSessions";

export const PALETTE: string[] = [
  "#f0c674", // Gold
  "#e06c75", // Coral
  "#c678dd", // Purple
  "#61afef", // Blue
  "#56b6c2", // Teal
  "#98c379", // Green
];

/**
 * Return the color to render for a session. If the user has picked a
 * specific color it wins; otherwise we auto-assign by project-order so no
 * session is ever gray by default. Sort key is createdAt so colors stay
 * stable across re-renders (new sessions get the next color in the cycle
 * rather than shuffling existing ones).
 */
export function displayColor(
  session: SessionMeta,
  projectSessions: SessionMeta[],
): string {
  if (session.color) return session.color;
  const ordered = [...projectSessions].sort((a, b) => {
    if (a.createdAt === b.createdAt) return a.id.localeCompare(b.id);
    return a.createdAt < b.createdAt ? -1 : 1;
  });
  const idx = ordered.findIndex((s) => s.id === session.id);
  return PALETTE[(idx < 0 ? 0 : idx) % PALETTE.length];
}

/**
 * Group by the session's project. Used to color each session by its
 * position within its own project's session list.
 */
export function groupByProject(
  sessions: SessionMeta[],
): Map<string, SessionMeta[]> {
  const map = new Map<string, SessionMeta[]>();
  for (const s of sessions) {
    const list = map.get(s.project) ?? [];
    list.push(s);
    map.set(s.project, list);
  }
  return map;
}
