import { useContext, useEffect, type ReactNode } from "react";
import { BreadcrumbActionsContext } from "./BreadcrumbActionsProvider";

/** Call from any page to inject actions into the breadcrumb bar's right side. */
export function useBreadcrumbActions(node: ReactNode, deps: unknown[]) {
  const { setActions } = useContext(BreadcrumbActionsContext);

  useEffect(() => {
    setActions(node);

    return () => setActions(null);
  }, deps);
}