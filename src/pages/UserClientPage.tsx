import { useEffect, useState } from "react";
import { computerApi } from "../api";
import { useNavigate } from "react-router-dom";

export interface Computer {
  id: string;
  name: string;
  zone: string;
  status: string;
  pricePerHour: number;
}

export default function UserClientPage() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("cybershell_user") || "Игрок";
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    computerApi
      .getAll()
      .then(setComputers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRent = async (pc: Computer) => {
    if (pc.status !== "AVAILABLE") return;

    // Имитация аренды (фронтенд-логика)
    alert(`Компьютер ${pc.name} успешно забронирован под вашу сессию!`);

    // Оптимистично обновляем статус на клиенте
    setComputers((prev) =>
      prev.map((p) => (p.id === pc.id ? { ...p, status: "OCCUPIED" } : p)),
    );
    await computerApi.updateStatus(pc.id, "OCCUPIED");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Шапка клиента */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest block">
            Личный кабинет игрока
          </span>
          <h1 className="text-lg font-black text-white">
            Добро пожаловать, @{username}!
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-bold text-slate-400 hover:text-rose-400 border border-slate-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          Выйти
        </button>
      </nav>

      {/* Контент */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-cyan-400">
            Доступные игровые места
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Выберите свободный ПК для инициализации игровой сессии
          </p>
        </div>

        {loading ? (
          <div className="text-sm font-mono text-cyan-500 animate-pulse">
            Сканирование сети клуба...
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-0 m-0 list-none">
            {computers.map((pc) => (
              <li
                key={pc.id || Math.random()}
                className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${
                  pc.status === "AVAILABLE"
                    ? "border-slate-800 hover:border-cyan-500"
                    : "border-slate-900 opacity-60"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-black text-white">
                      {pc.name}
                    </span>
                    <span className="text-[10px] tracking-wider uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400 font-bold">
                      {pc.zone}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-mono text-slate-400 mb-6">
                    <p>
                      Статус:{" "}
                      <span
                        className={
                          pc.status === "AVAILABLE"
                            ? "text-emerald-400 font-bold"
                            : "text-rose-500"
                        }
                      >
                        {pc.status}
                      </span>
                    </p>
                    <p>
                      Тариф:{" "}
                      <span className="text-amber-400 font-bold">
                        {pc.pricePerHour} ₽/ч
                      </span>
                    </p>
                  </div>
                </div>

                {/* Интерактивная кнопка аренды */}
                <button
                  disabled={pc.status !== "AVAILABLE"}
                  onClick={() => handleRent(pc)}
                  className={`w-full font-bold py-2.5 rounded-xl text-xs tracking-wide transition-all cursor-pointer ${
                    pc.status === "AVAILABLE"
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed"
                  }`}
                >
                  {pc.status === "AVAILABLE"
                    ? "Занять этот ПК"
                    : "Место занято"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
