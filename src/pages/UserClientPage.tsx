import { useEffect, useState } from "react";
import { computerApi, sessionApi } from "../api";
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
  const [rentingPcId, setRentingPcId] = useState<string | null>(null);
  const [selectedHours, setSelectedHours] = useState<Record<string, number>>(
    {},
  );

  const username = localStorage.getItem("cybershell_user") || "Игрок";
  const userId = localStorage.getItem("cybershell_user_id") || "";
  const navigate = useNavigate();

  const loadData = (showLoader = false) => {
    if (showLoader) setLoading(true);
    computerApi
      .getAll()
      .then(setComputers)
      .catch(console.error)
      .finally(() => {
        if (showLoader) setLoading(false);
      });
  };

  useEffect(() => {
    loadData(true);

    const interval = setInterval(() => {
      loadData(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRent = async (pc: Computer) => {
    console.log("=== Клик по кнопке аренды ===");
    const hours = selectedHours[pc.id] || 1;

    if (pc.status !== "AVAILABLE" && pc.status !== "FREE") {
      console.warn("Бронирование отклонено: ПК занят");
      return;
    }

    if (!userId) {
      alert(
        "Ошибка: Не удалось определить ваш ID пользователя. Перезайдите в систему.",
      );
      return;
    }

    setRentingPcId(pc.id);

    try {
      await sessionApi.create({
        userId: userId,
        pcId: pc.id,
        durationHours: hours,
      });

      alert(`Компьютер ${pc.name} успешно забронирован на ${hours} ч.!`);
      loadData(false);
    } catch (error: any) {
      console.error("❌ Ошибка при отправке запроса:", error);
      const serverMessage =
        error.response?.data?.message || "Не удалось запустить сессию";
      alert(`Ошибка бронирования: ${serverMessage}`);
    } finally {
      setRentingPcId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const handleHoursChange = (pcId: string, hours: number) => {
    setSelectedHours((prev) => ({ ...prev, [pcId]: hours }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-lime-400 selection:text-zinc-950">
      <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest block">
            Личный кабинет игрока
          </span>
          <h1 className="text-lg font-black text-white">
            Добро пожаловать, @{username}!
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-bold text-zinc-400 hover:text-red-400 border border-zinc-800 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
        >
          Выйти
        </button>
      </nav>

      {/* Контент */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-emerald-400">
            Доступные игровые места
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Выберите свободный ПК и время для инициализации игровой сессии
          </p>
        </div>

        {loading ? (
          <div className="text-sm font-mono text-lime-400 animate-pulse">
            Сканирование сети клуба...
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-0 m-0 list-none">
            {computers.map((pc) => {
              const currentHours = selectedHours[pc.id] || 1;
              const isAvailable =
                pc.status === "FREE" || pc.status === "AVAILABLE";
              const isRentingThis = rentingPcId === pc.id;

              return (
                <li
                  key={pc.id || Math.random()}
                  className={`bg-zinc-900 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl ${
                    isAvailable
                      ? "border-zinc-800 hover:border-lime-400 hover:shadow-lime-400/5"
                      : "border-zinc-900 opacity-60"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-black text-white">
                        {pc.name}
                      </span>
                      <span className="text-[10px] tracking-wider uppercase bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 text-zinc-400 font-bold">
                        {pc.zone}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono text-zinc-400 mb-4">
                      <p>
                        Статус:{" "}
                        <span
                          className={
                            isAvailable
                              ? "text-lime-400 font-bold"
                              : pc.status === "BUSY" || pc.status === "OCCUPIED"
                                ? "text-amber-500 font-bold"
                                : "text-red-500 font-bold"
                          }
                        >
                          {pc.status}
                        </span>
                      </p>
                      <p>
                        Тариф:{" "}
                        <span className="text-emerald-400 font-bold">
                          {pc.pricePerHour} $/ч
                        </span>
                      </p>
                    </div>

                    {isAvailable && (
                      <div className="mb-6">
                        <label className="text-[10px] text-zinc-500 block mb-1.5 font-mono uppercase tracking-wider">
                          Время сессии:
                        </label>
                        <select
                          value={currentHours}
                          onChange={(e) =>
                            handleHoursChange(pc.id, Number(e.target.value))
                          }
                          className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-300 focus:outline-none focus:border-lime-400 cursor-pointer"
                        >
                          <option value={1}>
                            1 час ({pc.pricePerHour * 1} $)
                          </option>
                          <option value={2}>
                            2 часа ({pc.pricePerHour * 2} $)
                          </option>
                          <option value={3}>
                            3 часа ({pc.pricePerHour * 3} $)
                          </option>
                          <option value={5}>
                            5 часов ({pc.pricePerHour * 5} $)
                          </option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button
                    disabled={!isAvailable || isRentingThis}
                    onClick={() => handleRent(pc)}
                    className={`w-full font-bold py-2.5 rounded-xl text-xs tracking-wide transition-all cursor-pointer ${
                      isAvailable
                        ? "bg-lime-400 text-zinc-950 hover:bg-lime-300 shadow-lg shadow-lime-500/10"
                        : "bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed"
                    }`}
                  >
                    {isRentingThis
                      ? "Запуск..."
                      : isAvailable
                        ? "Занять этот ПК"
                        : `Место ${pc.status}`}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Кнопки быстрой отладки (DEV панель) */}
        <div className="pt-8 border-t border-zinc-900 flex flex-wrap gap-2">
          <button
            onClick={() => {
              localStorage.setItem("cybershell_role", "ADMIN");
              window.location.href = "/admin";
            }}
            className="text-xs font-bold text-emerald-400 border border-lime-900/30 bg-zinc-900 px-4 py-2 rounded-xl hover:bg-lime-400 hover:text-zinc-950 transition-all cursor-pointer"
          >
            Войти как Админ (DEV)
          </button>
          <button
            onClick={() => {
              if (!localStorage.getItem("cybershell_user")) {
                localStorage.setItem("cybershell_user", "dev_admin");
              }
              localStorage.setItem("cybershell_user_role", "ADMIN");
              localStorage.setItem("cybershell_role", "ADMIN");
              window.location.href = "/admin/users";
            }}
            className="text-xs font-bold text-emerald-400 border border-lime-900/30 bg-zinc-900 px-4 py-2 rounded-xl hover:bg-lime-400 hover:text-zinc-950 transition-all cursor-pointer"
          >
            Войти как Админ (DEV users)
          </button>
        </div>
      </main>
    </div>
  );
}
