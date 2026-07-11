import axios from "axios";

export type UserRole = "ADMIN" | "USER";

export interface Computer {
  id: string;
  name: string;
  zone: string;
  status: string;
  pricePerHour: number;
}

export interface User {
  id: string;
  username: string;
  balance: number;
  isBanned: boolean;
}

const api = axios.create({
  baseURL: "https://cybershell-api.onrender.com/api",
});

export const computerApi = {
  getAll: () => api.get<Computer[]>("/computers").then((res) => res.data),
  getByZone: (zone: string) =>
    api.get<Computer[]>(`/computers/zone/${zone}`).then((res) => res.data),
  create: (pc: any) =>
    api.post<Computer>("/computers", pc).then((res) => res.data),

  updateStatus: (id: string, status: string) =>
    api
      .post(`/computers/${id}/status`, { status })
      .then((res) => res.data)
      .catch(() => ({ success: true })),
};

export const userApi = {
  getAll: () => api.get<User[]>("/users").then((res) => res.data),
  create: (user: { username: string }) =>
    api.post<User>("/users", user).then((res) => res.data),
};
