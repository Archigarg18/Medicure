import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../hooks/useSocket";
import { safeLocalStorageGet } from "../lib/browser";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  type: "appointment" | "doctor" | "ambulance" | "blood" | "message";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

/**
 * Real-time Notifications Component
 * Demonstrates Socket.io usage for receiving real-time notifications
 */
export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = safeLocalStorageGet("userId") || "user-default";
  const userType = (safeLocalStorageGet("userType") as any) || "patient";

  const { isConnected, onNotification } = useSocket({
    userId,
    userType,
    room: `user-${userId}`,
    autoConnect: true,
  });

  // Listen for notifications
  useEffect(() => {
    onNotification((data) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: data.type || "message",
        title: data.title || "New Notification",
        message: data.message,
        timestamp: new Date(data.timestamp),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);
      setUnreadCount((prev) => prev + 1);

      console.log("📢 Notification received:", newNotification);
    });
  }, [onNotification]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      appointment: "📅",
      doctor: "🏥",
      ambulance: "🚑",
      blood: "🩸",
      message: "💬",
    };
    return icons[type] || "📢";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Real-time Notifications
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
            </Badge>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No notifications yet
            </p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  notif.read
                    ? "bg-gray-50 border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getNotificationIcon(notif.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{notif.title}</h4>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notif.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RealtimeNotifications;
