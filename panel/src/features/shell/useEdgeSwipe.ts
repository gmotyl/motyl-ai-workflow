import { useEffect } from "react";

interface Options {
  /** Open left sidebar: left edge → right */
  onSwipeRightFromLeftEdge?: () => void;
  /** Close left sidebar: anywhere → right-to-left once left is open (not used) */
  /** Open right sidebar: right edge → left */
  onSwipeLeftFromRightEdge?: () => void;
  /** Close left sidebar if open: swipe right-to-left (from > edgePx, big delta) */
  onSwipeLeftAnywhere?: () => void;
  /** Close right sidebar if open: swipe left-to-right (from < innerWidth - edgePx, big delta) */
  onSwipeRightAnywhere?: () => void;
  /** Pixels from the edge where a gesture counts as "from edge". Default 24. */
  edgePx?: number;
  /** Minimum horizontal movement to fire. Default 60. */
  minDeltaPx?: number;
  /** Max vertical drift ratio (|dy|/|dx|). Default 0.7. */
  maxSlope?: number;
}

/**
 * Attach mobile swipe gestures on the whole document.
 *
 * Fires the matching callback when a finger starts near an edge and
 * moves far enough horizontally before lifting. Ignored on desktop
 * where pointer input is usually a mouse (single-touch only).
 */
export function useEdgeSwipe(opts: Options): void {
  const {
    onSwipeRightFromLeftEdge,
    onSwipeLeftFromRightEdge,
    onSwipeLeftAnywhere,
    onSwipeRightAnywhere,
    edgePx = 24,
    minDeltaPx = 60,
    maxSlope = 0.7,
  } = opts;

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startedNearLeft = false;
    let startedNearRight = false;
    let active = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        active = false;
        return;
      }
      active = true;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startedNearLeft = startX <= edgePx;
      startedNearRight = startX >= window.innerWidth - edgePx;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!active) return;
      active = false;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (absDx < minDeltaPx) return;
      if (absDx > 0 && absDy / absDx > maxSlope) return;

      if (dx > 0) {
        // rightward
        if (startedNearLeft) {
          onSwipeRightFromLeftEdge?.();
        } else {
          onSwipeRightAnywhere?.();
        }
      } else {
        // leftward
        if (startedNearRight) {
          onSwipeLeftFromRightEdge?.();
        } else {
          onSwipeLeftAnywhere?.();
        }
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    onSwipeRightFromLeftEdge,
    onSwipeLeftFromRightEdge,
    onSwipeLeftAnywhere,
    onSwipeRightAnywhere,
    edgePx,
    minDeltaPx,
    maxSlope,
  ]);
}
