"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id?: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  guestUser: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setGuestUser: (user: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [guestUser, setGuestUserInternal] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedGuest = localStorage.getItem("guestUser");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    if (savedGuest) {
      setGuestUserInternal(JSON.parse(savedGuest));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    
    if (newUser.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const setGuestUser = (newUser: User) => {
    setGuestUserInternal(newUser);
    localStorage.setItem("guestUser", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setGuestUserInternal(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("guestUser");
    router.push("/");
  };

  const isAuthenticated = !!token || !!guestUser;

  return (
    <AuthContext.Provider value={{ user, token, guestUser, login, logout, setGuestUser, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
