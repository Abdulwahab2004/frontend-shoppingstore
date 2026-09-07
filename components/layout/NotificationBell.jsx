import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useSocket } from "../../hooks/useSocket";
import { useAuth } from "../../hooks/useauth";
export default function NotificationBell() {
    const { notifications, adminNotifications, markAllRead, clearNotifications } = useSocket();
const { user } = useAuth();
  const displayNotifications = user.role === "admin" ? adminNotifications : notifications;
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close the dropdown when clicking anywhere outside it
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
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-xl border border-sage/60 overflow-hidden z-50 animate-scale-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-sage/40">
            <h3 className="font-semibold text-dark text-sm">Notifications</h3>
            {displayNotifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-fern hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <p className="text-center text-forest text-sm py-8">No notifications yet</p>
            ) : (
              displayNotifications.map((n) => (
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