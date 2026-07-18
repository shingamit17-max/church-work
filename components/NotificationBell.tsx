"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 15 seconds for real-time feel
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already
    if (!notification.isRead) {
      try {
        await fetch(`/api/notifications/${notification._id}/read`, {
          method: "PATCH",
        });
        // Update local state instantly for snappy UI
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error("Failed to mark as read", error);
      }
    }

    // Redirect if there's a link
    if (notification.link) {
      setIsOpen(false);
      router.push(notification.link);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-card border-2 border-border shadow-[3px_3px_0px_var(--neo-border)] hover:-translate-y-0.5 active:translate-y-0 transition-all text-foreground"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-border shadow-[1px_1px_0px_var(--neo-border)]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border-[3px] border-border shadow-[8px_8px_0px_var(--neo-border)] rounded-2xl overflow-hidden z-[100]">
          <div className="p-4 border-b-[3px] border-border bg-muted flex items-center justify-between">
            <h3 className="font-black text-lg text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-muted-foreground">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-medium">
                You have no notifications yet.
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b-2 border-border/50 cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notification.isRead ? "bg-amber-100/30" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-bold text-sm ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-foreground/80 mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground font-bold">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
