import { createContext, useState, type ReactNode } from "react";

interface BreadcrumbActionsContextValue {
  actions: ReactNode;
  setActions: (node: ReactNode) => void;
}

export const BreadcrumbActionsContext =
  createContext<BreadcrumbActionsContextValue>({
    actions: null,
    setActions: () => {},
  });

export function BreadcrumbActionsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [actions, setActions] = useState<ReactNode>(null);

  return (
    <BreadcrumbActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </BreadcrumbActionsContext.Provider>
  );
}