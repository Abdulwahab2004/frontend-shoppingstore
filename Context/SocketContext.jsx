import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useauth";
import { API_BASE_URL } from "../utils/constant";

export const SocketContext = createContext();

const SOCKET_URL = API_BASE_URL.replace(/\/api$/, "");

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.emit("join", user.id);
    if (user.role === "admin") {
      socket.emit("joinAdmin");
    }

    socket.on("orderStatusUpdate", (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `Your order #${data.orderId.slice(-6).toUpperCase()} is now ${data.status}`,
          read: false,
        },
        ...prev,
      ]);
    });

    // Admin-only event — a fresh order just came in
    socket.on("newOrder", (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `New order received — $${data.totalAmount.toFixed(2)}`,
          read: false,
        },
        ...prev,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider
      value={{ notifications, markAllRead, clearNotifications, socket: socketRef.current }}
    >
      {children}
    </SocketContext.Provider>
  );
}