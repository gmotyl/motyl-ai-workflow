import { useContext, useEffect, type ReactNode } from "react";
import { FloatingActionContext } from "./FloatingActionProvider";

/**
 * Pages call this to render a floating action button at the bottom-right of the content area.
 */
export function useFloatingAction(node: ReactNode, deps: unknown[]) {
  const { setAction } = useContext(FloatingActionContext);

  useEffect(() => {
    setAction(node);

    return () => setAction(null);
  }, deps);
}