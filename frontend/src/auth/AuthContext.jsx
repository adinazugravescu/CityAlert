import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, setAuthToken } from "../lib/api";

const STORAGE_KEY = "cityalert.auth";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    const token = auth?.accessToken ?? null;
    setAuthToken(token);
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  const value = useMemo(
    () => ({
      auth,
      user: auth?.user ?? null,
      isAuthenticated: Boolean(auth?.accessToken),
      hasAnyRole: (...roles) => roles.some((role) => auth?.user?.roles?.includes(role)),
      async login(payload) {
        const data = await apiRequest("/auth/login", {
          method: "POST",
          body: payload,
        });
        setAuth(data);
        return data;
      },
      async register(payload) {
        const data = await apiRequest("/auth/register", {
          method: "POST",
          body: payload,
        });
        setAuth(data);
        return data;
      },
      logout() {
        setAuth(null);
      },
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
