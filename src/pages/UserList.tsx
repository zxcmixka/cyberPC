import { useEffect, useState } from "react";
import { userApi } from "../api";

export interface User {
  id: string;
  username: string;
  balance: number;
  isBanned: boolean;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    userApi.getAll().then(setUsers).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black uppercase tracking-wider text-fuchsia-400 border-b border-slate-900 pb-3">
        База данных игроков
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-0 m-0 list-none">
        {users.map((user) => (
          <li
            key={user.id || Math.random()}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-fuchsia-500 hover:-translate-y-1"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-white">
                @{user.username}
              </span>
              <span
                className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded font-extrabold border ${user.isBanned ? "bg-rose-950/40 border-rose-500 text-rose-400" : "bg-emerald-950/40 border-emerald-500 text-emerald-400"}`}
              >
                {user.isBanned ? "BANNED" : "ACTIVE"}
              </span>
            </div>
            <p className="text-sm font-mono text-slate-400">
              Баланс:{" "}
              <span className="text-emerald-400 font-bold">
                {user.balance} ₽
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
