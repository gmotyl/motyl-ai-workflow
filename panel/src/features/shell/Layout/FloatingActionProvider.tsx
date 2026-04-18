import { createContext, useState, type ReactNode } from "react";

interface FloatingActionContextValue {
  action: ReactNode;
  setAction: (node: ReactNode) => void;
}

export const FloatingActionContext = createContext<FloatingActionContextValue>({
  action: null,
  setAction: () => {},
});

export function FloatingActionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [action, setAction] = useState<ReactNode>(null);

  return (
    <FloatingActionContext.Provider value={{ action, setAction }}>
      {children}
    </FloatingActionContext.Provider>
  );
}