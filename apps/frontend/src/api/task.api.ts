import api from "./axios";
import type { Task } from "../types";

export async function fetchTasks() {
  const res = await api.get("/tasks");
  return res.data.data as Task[];
}

export async function fetchTaskById(id: string) {
  const res = await api.get(`/tasks/${id}`);
  return res.data.data as Task;
}

export async function createTask(data: {
  projectId: string;
  title: string;
  description?: string;
  assignedDeveloperId?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}) {
  const res = await api.post("/tasks", data);
  return res.data.data as Task;
}

export async function updateTaskStatus(id: string, status: string) {
  const res = await api.patch(`/tasks/${id}`, { status });
  return res.data.data as Task;
}

export async function patchTask(id: string, data: Partial<Task>) {
  const res = await api.patch(`/tasks/${id}`, data);
  return res.data.data as Task;
}

export async function deleteTask(id: string) {
  const res = await api.delete(`/tasks/${id}`);
  return res.data.data;
}
