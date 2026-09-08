import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useSocket } from "../../hooks/useSocket";

export default function NotificationBell() {
  const socketData = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Defensive fallback — if context isn't ready for any reason, don't crash
  const notifications = socketData?.notifications || [];
  const markAllRead = socketData?.markAllRead || (() => {});
  const clearNotifications = socketData?.clearNotifications || (() => {});
  const isConnected = socketData?.isConnected || false;

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) markAllRead();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg text-white/90 hover:text-sage hover:bg-white/10 transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell size={19} />
        <span
          className={`absolute bottom-1 right-1 w-2 h-2 rounded-full border border-dark ${
            isConnected ? "bg-green-400" : "bg-gray-400"
          }`}
          title={isConnected ? "Connected" : "Disconnected"}
        />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-xl border border-sage/60 overflow-hidden z-50 animate-scale-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-sage/40">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-dark text-sm">Notifications</h3>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  isConnected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {isConnected ? "Live" : "Offline"}
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-fern hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-forest text-sm py-8">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 border-b border-sage/20 last:border-0 hover:bg-sage/10 transition-colors duration-150"
                >
                  <p className="text-sm text-dark">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}