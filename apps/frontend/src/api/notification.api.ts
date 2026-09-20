import api from "./axios";
import type { Notification } from "../types";

export async function fetchNotifications() {
  const res = await api.get("/notifications");
  return res.data.data as Notification[];
}

export async function fetchUnreadCount() {
  const res = await api.get("/notifications/unread-count");
  return res.data.data as { unreadCount: number };
}

export async function markNotificationRead(id: string) {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data.data as Notification;
}

export async function markAllNotificationsRead() {
  const res = await api.patch("/notifications/read-all");
  return res.data.data as { updatedCount: number };
}
