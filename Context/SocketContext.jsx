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
  const [adminNotifications, setAdminNotifications] = useState([]);

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

    socket.on("newOrderAdmin", (data) => {
      setAdminNotifications((prev) => [
        {
          id: Date.now(),
          message: `New order #${data.orderId.toString().slice(-6).toUpperCase()} from ${data.customerName} — $${data.total}`,
          read: false,
        },
        ...prev,
      ]);
    });
socket.on("newContactMessage", (data) => {
  setAdminNotifications((prev) => [
    {
      id: Date.now(),
      message: `New contact message from ${data.name}: "${data.subject}"`,
      read: false,
    },
    ...prev,
  ]);
});
    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Operate on whichever list matches the current user's role
  const markAllRead = () => {
    if (user?.role === "admin") {
      setAdminNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } else {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const clearNotifications = () => {
    if (user?.role === "admin") {
      setAdminNotifications([]);
    } else {
      setNotifications([]);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        notifications,
        adminNotifications,
        markAllRead,
        clearNotifications,
        socket: socketRef.current,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}