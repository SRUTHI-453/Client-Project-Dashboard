import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notification.api";
import type { Notification } from "../types";
import Header from "../components/Header";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  function load() {
    fetchNotifications()
      .then(setNotifications)
      .finally(() => setLoading(false));
  }

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    load();
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    load();
  }

  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-content">
        <div className="notifications-header">
          <h1>Notifications</h1>
          <button onClick={handleMarkAllRead}>Mark all as read</button>
        </div>
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p style={{ color: "#94a3c4" }}>No notifications yet.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((n) => (
              <li key={n.id} className={n.isRead ? "read" : "unread"}>
                <p>{n.message}</p>
                <span>{new Date(n.createdAt).toLocaleString()}</span>
                {!n.isRead && (
                  <button onClick={() => handleMarkRead(n.id)}>Mark read</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
