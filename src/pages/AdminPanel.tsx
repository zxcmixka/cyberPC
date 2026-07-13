import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi, computerApi, sessionApi } from "../api";

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

export default function AdminPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [computers, setComputers] = useState<Computer[]>([]);

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "sessions"
  >("dashboard");

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPcId, setSelectedPcId] = useState("");
  const [sessionHours, setSessionHours] = useState(1);

  const [topUpAmounts, setTopUpAmounts] = useState<{
    [key: string]: number;
  }>({});

  const [logMessage, setLogMessage] = useState("");

  const refreshData = async () => {
    try {
      const [allUsers, allComputers] = await Promise.all([
        userApi.getAll(),
        computerApi.getAll(),
      ]);

      setUsers(allUsers);
      setComputers(allComputers);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    }
  };

  useEffect(() => {
    refreshData();

    const interval = setInterval(refreshData, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTopUp = async (userId: string) => {
    const amount = topUpAmounts[userId] || 0;

    if (amount <= 0) {
      alert("Введите сумму больше 0");
      return;
    }

    try {
      await userApi.UpUserBalance(userId, amount);

      setLogMessage(`✅ Баланс пополнен на ${amount} $`);

      setTopUpAmounts((prev) => ({
        ...prev,
        [userId]: 0,
      }));

      refreshData();
    } catch (err: any) {
      setLogMessage(`❌ Ошибка: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleBan = async (userId: string) => {
    if (!window.confirm("Изменить статус пользователя?")) {
      return;
    }

    try {
      await userApi.ban(userId);

      setLogMessage("✅ Статус изменён");

      refreshData();
    } catch (err: any) {
      setLogMessage(`❌ Ошибка: ${err.response?.data?.message || err.message}`);
    }
  };
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId || !selectedPcId) {
      alert("Выберите пользователя и ПК");
      return;
    }

    try {
      await sessionApi.create({
        userId: selectedUserId,
        pcId: selectedPcId,
        durationHours: sessionHours,
      });

      setLogMessage(`🚀 Сессия запущена на ${sessionHours} ч.`);

      setSelectedUserId("");
      setSelectedPcId("");
      setSessionHours(1);

      refreshData();
    } catch (err: any) {
      setLogMessage(
        `❌ Ошибка запуска: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-4 mb-6 gap-4">
        <div>
          <span className="text-xs text-lime-400 font-mono uppercase">
            Панель управления
          </span>

          <h1 className="text-2xl font-black text-white">
            CyberShell Admin 🛠️
          </h1>
        </div>

        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === "dashboard"
                ? "bg-lime-400 text-black font-bold"
                : "text-zinc-400"
            }`}
          >
            Карта ПК
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === "users"
                ? "bg-lime-400 text-black font-bold"
                : "text-zinc-400"
            }`}
          >
            Игроки
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sessions")}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === "sessions"
                ? "bg-lime-400 text-black font-bold"
                : "text-zinc-400"
            }`}
          >
            Сессии
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm"
        >
          Выйти
        </button>
      </header>
      {logMessage && (
        <div className="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-lime-400 flex justify-between">
          <span>{logMessage}</span>

          <button type="button" onClick={() => setLogMessage("")}>
            ✕
          </button>
        </div>
      )}{" "}
      {activeTab === "dashboard" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-black text-lime-400 mb-5 uppercase">
            Мониторинг игровых станций
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {computers.map((pc) => (
              <div
                key={pc.id}
                className={`p-4 border rounded-xl h-28 flex flex-col justify-between ${
                  pc.status === "AVAILABLE"
                    ? "border-zinc-800 bg-zinc-950"
                    : pc.status === "BUSY" || pc.status === "OCCUPIED"
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-red-500/40 bg-red-950/20"
                }`}
              >
                <span className="font-bold text-white">{pc.name}</span>

                <span className="text-xs uppercase text-zinc-400">
                  ● {pc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === "users" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-black text-violet-400 mb-5 uppercase">
            Управление игроками
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500">
                  <th className="pb-3">Игрок</th>

                  <th className="pb-3">Баланс</th>

                  <th className="pb-3">Статус</th>

                  <th className="pb-3 text-right">Действия</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-4 font-bold">@{user.username}</td>

                    <td className="py-4 text-emerald-400">{user.balance} $</td>

                    <td className="py-4">
                      {user.isBanned ? (
                        <span className="text-red-400 font-bold">BANNED</span>
                      ) : (
                        <span className="text-lime-400 font-bold">ACTIVE</span>
                      )}
                    </td>

                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <input
                          type="number"
                          placeholder="+ $"
                          min="0"
                          value={topUpAmounts[user.id] || ""}
                          onChange={(e) =>
                            setTopUpAmounts((prev) => ({
                              ...prev,
                              [user.id]: Number(e.target.value),
                            }))
                          }
                          className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-center"
                        />

                        <button
                          type="button"
                          onClick={() => handleTopUp(user.id)}
                          className="bg-lime-400 text-black px-3 py-1 rounded-lg font-bold"
                        >
                          Пополнить
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBan(user.id)}
                          className={`px-3 py-1 rounded-lg font-bold border ${
                            user.isBanned
                              ? "text-lime-400 border-lime-900"
                              : "text-red-400 border-red-900"
                          }`}
                        >
                          {user.isBanned ? "Разбан" : "Бан"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}{" "}
      {activeTab === "sessions" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-xl">
          <h2 className="text-lg font-black text-lime-400 mb-5 uppercase">
            Инициализация сессии
          </h2>

          <form onSubmit={handleCreateSession} className="space-y-4">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl"
              required
            >
              <option value="">-- Выбрать игрока --</option>

              {users
                .filter((user) => !user.isBanned)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    @{user.username} ({user.balance} $)
                  </option>
                ))}
            </select>

            <select
              value={selectedPcId}
              onChange={(e) => setSelectedPcId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl"
              required
            >
              <option value="">-- Выбрать ПК --</option>

              {computers.map((pc) => (
                <option
                  key={pc.id}
                  value={pc.id}
                  disabled={pc.status !== "AVAILABLE"}
                >
                  {pc.name} ({pc.status})
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              max="24"
              value={sessionHours}
              onChange={(e) => setSessionHours(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl"
              required
            />

            <button
              type="submit"
              className="w-full bg-lime-400 text-black py-3 rounded-xl font-black"
            >
              Запустить сессию
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
