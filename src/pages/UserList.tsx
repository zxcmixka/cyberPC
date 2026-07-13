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
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadUsers = () => {
    userApi.getAll().then(setUsers).catch(console.error);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBanToggle = async (userId: string, username: string) => {
    if (
      !window.confirm(
        `Вы уверены, что хотите изменить статус блокировки для @${username}?`,
      )
    )
      return;

    setActionLoading(userId);
    try {
      await userApi.ban(userId);
      alert(`Статус блокировки пользователя @${username} успешно изменен!`);
      loadUsers();
    } catch (err: any) {
      console.error(err);
      alert(
        `Ошибка при изменении статуса бана: ${err.response?.data?.message || err.message}`,
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleTopUp = async (userId: string, username: string) => {
    const amount = amounts[userId] || 0;
    if (amount <= 0) {
      alert("Введите сумму пополнения больше нуля!");
      return;
    }

    setActionLoading(userId);
    try {
      await userApi.UpUserBalance(userId, amount);
      alert(
        `Баланс пользователя @${username} успешно пополнен на ${amount} $!`,
      );

      setAmounts((prev) => ({ ...prev, [userId]: 0 }));
      loadUsers();
    } catch (err: any) {
      console.error(err);
      alert(`Ошибка пополнения: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAmountChange = (userId: string, value: number) => {
    setAmounts((prev) => ({ ...prev, [userId]: value }));
  };

  return (
    <div className="space-y-6 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <h2 className="text-2xl font-black uppercase tracking-wider text-emerald-400 border-b border-zinc-900 pb-4">
        База данных игроков
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-0 m-0 list-none">
        {users.map((user) => {
          const currentAmount = amounts[user.id] || "";
          const isLoading = actionLoading === user.id;

          return (
            <li
              key={user.id || Math.random()}
              className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/20 hover:-translate-y-1 shadow-md shadow-black/40 group"
            >
              <div>
                <div className="flex justify-between items-center mb-5">
                  <span className="text-lg font-black text-zinc-100 truncate max-w-[150px] group-hover:text-emerald-400 transition-colors">
                    @{user.username}
                  </span>
                  <span
                    className={`text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-xl font-black border font-mono ${
                      user.isBanned
                        ? "bg-red-950/20 border-red-500/30 text-red-400"
                        : "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                    }`}
                  >
                    {user.isBanned ? "Блокирован" : "Активен"}
                  </span>
                </div>

                <p className="text-xs font-mono text-zinc-400 mb-6 flex items-center gap-1.5">
                  <span className="text-zinc-600 font-bold">● БАЛАНС:</span>{" "}
                  <span className="text-amber-400 font-black text-sm">
                    {user.balance} $
                  </span>
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Сумма $"
                    value={currentAmount}
                    onChange={(e) =>
                      handleAmountChange(user.id, Number(e.target.value))
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    disabled={isLoading}
                  />

                  <button
                    disabled={isLoading}
                    onClick={() => handleTopUp(user.id, user.username)}
                    className="bg-lime-500 hover:bg-lime-400 text-zinc-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider shadow-md"
                  >
                    ＋ Баланс
                  </button>
                </div>

                <button
                  disabled={isLoading}
                  onClick={() => handleBanToggle(user.id, user.username)}
                  className={`w-full text-xs font-black py-3 rounded-xl transition-all cursor-pointer border uppercase tracking-widest ${
                    user.isBanned
                      ? "bg-emerald-950/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950"
                      : "bg-red-950/10 border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white"
                  }`}
                >
                  {isLoading
                    ? "Синхронизация..."
                    : user.isBanned
                      ? "Cнять блокировку"
                      : "Заблокировать"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
