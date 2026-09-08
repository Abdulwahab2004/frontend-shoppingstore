import { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { requestNotificationPermission } from "../firebase";
import { saveFcmToken } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

const login = async (userData) => {
  setUser(userData);
  const fcmToken = await requestNotificationPermission();
  if (fcmToken) {
    try {
      await saveFcmToken(fcmToken);
    } catch (err) {
      // non-critical, don't block login if this fails
    }
  }
};

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}