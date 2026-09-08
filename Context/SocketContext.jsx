import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useauth";

export const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (!SOCKET_URL) {
      console.error("VITE_SOCKET_URL is not set — socket cannot connect");
      return;
    }

    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      socket.emit("join", user.id);
      if (user.role === "admin") {
        socket.emit("joinAdmin");
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setIsConnected(false);
    });

    socket.on("orderStatusUpdate", (data) => {
      console.log("Received orderStatusUpdate:", data);
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `Your order #${data.orderId.slice(-6).toUpperCase()} is now ${data.status}`,
          read: false,
        },
        ...prev,
      ]);
    });

    socket.on("newOrder", (data) => {
      console.log("Received newOrder:", data);
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
      value={{ notifications, markAllRead, clearNotifications, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
}