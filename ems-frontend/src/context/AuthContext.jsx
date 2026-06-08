import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ems-user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("ems-token") || null,
  );

  const login = useCallback((userData, token, refreshToken) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem("ems-user", JSON.stringify(userData));
    localStorage.setItem("ems-token", token);
    localStorage.setItem("ems-refresh-token", refreshToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("ems-user");
    localStorage.removeItem("ems-token");
    localStorage.removeItem("ems-refresh-token");
  }, []);

  const updateToken = useCallback((token) => {
    setAccessToken(token);
    localStorage.setItem("ems-token", token);
  }, []);
  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("ems-user", JSON.stringify(userData));
  }, []);
  const isAuthenticated = !!user && !!accessToken;
  const role = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        role,
        login,
        logout,
        updateToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
