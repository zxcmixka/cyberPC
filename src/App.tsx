import { useEffect, useState } from "react";
import { computerApi, userApi } from "./api";

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

export default function App() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    Promise.all([computerApi.getAll(), userApi.getAll()])
      .then(([computersData, usersData]) => {
        setComputers(computersData);
        setUsers(usersData);
      })
      .catch((err) => {
        console.error("Ошибка загрузки данных системы:", err);
      });
  }, []);

  return (
    <div className="bg-slate-900 text-slate-100 p-6 font-sans">
      <h1 className="text-2xl uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-4 mb-8">
        Список всех компьютеров
      </h1>
      <ul className="">
        {computers.map((pc) => (
          <li className="" key={pc.id || Math.random()}>
            <b>{pc.name}</b> — Зона: {pc.zone} | Статус: {pc.status} | Цена: $
            {pc.pricePerHour} /hr
          </li>
        ))}
      </ul>

      <ul className="">
        {users.map((user) => (
          <li className="" key={user.id || Math.random()}>
                <span>
                  @{user.username}
                </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
