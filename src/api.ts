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

export interface GameSession {
  id: string;
  userId: string;
  pcId: string;
  durationHours: number;
  startTime: string;
  endTime: string;
  status: "ACTIVE" | "ENDED";
}

const api = axios.create({
  baseURL: "https://cybershell-api.onrender.com/api",
});

const getAdminKey = () => import.meta.env.VITE_ADMIN_SECRET_KEY || "";

export const computerApi = {
  getAll: () => api.get<Computer[]>("/computers").then((res) => res.data),
  getByZone: (zone: string) =>
    api.get<Computer[]>(`/computers/zone/${zone}`).then((res) => res.data),
  create: (pc: any) =>
    api
      .post<Computer>("/computers", pc, {
        headers: { "x-admin-key": getAdminKey() },
      })
      .then((res) => res.data),

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
  UpUserBalance: (userId: string, amount: number) =>
    api
      .post<User>(
        `/users/${userId}/topup`,
        { amount },
        { headers: { "x-admin-key": getAdminKey() } },
      )
      .then((res) => res.data),

  ban: (userId: string) =>
    api
      .post<User>(
        `/users/${userId}/ban`,
        {},
        { headers: { "x-admin-key": getAdminKey() } },
      )
      .then((res) => res.data),
};
export const sessionApi = {
  getAll: () =>
    api
      .get<
        GameSession[]
      >("/sessions", { headers: { "x-admin-key": getAdminKey() } })
      .then((res) => res.data),

  create: (sessionData: {
    userId: string;
    pcId: string;
    durationHours: number;
  }) =>
    api
      .post<GameSession>("/sessions", sessionData, {
        headers: { "x-admin-key": getAdminKey() },
      })
      .then((res) => res.data),
};
