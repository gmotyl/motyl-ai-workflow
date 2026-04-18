import { useState, useEffect, useCallback } from "react";

interface AuthStatus {
  authRequired: boolean;
  authenticated: boolean;
  loading: boolean;
}

export function useAuthStatus() {
  const [state, setState] = useState<AuthStatus>({
    authRequired: false,
    authenticated: true,
    loading: true,
  });

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      setState({
        authRequired: !!data.authRequired,
        authenticated: !!data.authenticated,
        loading: false,
      });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  return { ...state, recheck: check };
}
