import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.BACKEND_URL || "http://localhost:3000/api";

  // Set auth token for axios requests
  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
      localStorage.removeItem("token");
    }
  };

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      setAuthToken(token);

      try {
        const res = await axios.get(`${API_URL}/auth/user`);
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error loading user:", err);
        setAuthToken(null);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      const { token } = res.data;
      setAuthToken(token);

      const userRes = await axios.get(`${API_URL}/auth/user`);
      setUser(userRes.data);
      setIsAuthenticated(true);
    } catch (err) {
      setAuthToken(null);
      setError("Registration failed. Please try again.");
      console.error("Register error:", err);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token } = res.data;
      setAuthToken(token);

      const userRes = await axios.get(`${API_URL}/auth/user`);
      setUser(userRes.data);
      setIsAuthenticated(true);
    } catch (err) {
      setAuthToken(null);
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
