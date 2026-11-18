import { createContext, useContext, useEffect, useState } from "react";

import api from "../../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");

        setAdmin(response.data.admin);
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    setAdmin(response.data.admin);

    return response.data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(admin),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
