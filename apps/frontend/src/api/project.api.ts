import api from "./axios";
import type { Project } from "../types";

export async function fetchProjects() {
  const res = await api.get("/projects");
  return res.data.data as Project[];
}

export async function fetchProjectById(id: string) {
  const res = await api.get(`/projects/${id}`);
  return res.data.data as Project;
}

export async function createProject(data: {
  name: string;
  description?: string;
  clientId: string;
}) {
  const res = await api.post("/projects", data);
  return res.data.data as Project;
}

export async function updateProject(
  id: string,
  data: { name: string; description: string; clientId: string }
) {
  const res = await api.put(`/projects/${id}`, data);
  return res.data.data as Project;
}

export async function deleteProject(id: string) {
  const res = await api.delete(`/projects/${id}`);
  return res.data.data;
}
