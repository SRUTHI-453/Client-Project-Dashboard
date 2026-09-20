import api from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PROJECT_MANAGER" | "DEVELOPER";
}

export async function login(payload: LoginPayload) {
  const res = await api.post("/auth/login", payload);
  return res.data.data as { accessToken: string; user: AuthUser };
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data.data as AuthUser;
}

export async function logout() {
  await api.post("/auth/logout");
}