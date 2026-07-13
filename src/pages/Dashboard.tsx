import { useEffect, useState } from "react";
import { computerApi } from "../api";

export interface Computer {
  id: string;
  name: string;
  zone: string;
  status: string;
  pricePerHour: number;
}

export default function Dashboard() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [zone, setZone] = useState("COMMON");
  const [price, setPrice] = useState(1);

  const loadComputers = () => {
    computerApi.getAll().then(setComputers).catch(console.error);
  };

  useEffect(() => {
    loadComputers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await computerApi.create({
        name,
        zone,
        status: "AVAILABLE",
        pricePerHour: Number(price),
      });

      setName("");
      setZone("COMMON");
      setPrice(1);
      setShowForm(false);
      loadComputers();
    } catch (err) {
      console.error("Ошибка создания ПК:", err);
    }
  };

  return (
    <div className="space-y-6 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-emerald-400">
            Мониторинг игровых зон
          </h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-mono">
            [Режим суперпользователя / Администратор]
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black px-5 py-3 rounded-2xl text-xs transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/10 uppercase tracking-wider"
        >
          {showForm ? "✕ Закрыть терминал" : "＋ Добавить станцию"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-4 gap-5 items-end max-w-5xl shadow-xl shadow-black/30 animate-fade-in"
        >
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest font-mono">
              Имя ПК (Hostname)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="PC-09"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest font-mono">
              Игровая зона
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50 shortcut-select cursor-pointer font-mono"
            >
              <option value="COMMON">COMMON</option>
              <option value="VIP">VIP</option>
              <option value="STREAMER">STREAMER</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest font-mono">
              Тариф ($/Hr)
            </label>
            <input
              type="number"
              min="1"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md"
          >
            Инициализировать
          </button>
        </form>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-0 m-0 list-none">
        {computers.map((pc) => {
          const isAvailable = pc.status === "AVAILABLE" || pc.status === "FREE";
          const isBusy = pc.status === "BUSY";

          return (
            <li
              key={pc.id || Math.random()}
              className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/20 hover:-translate-y-1 shadow-md shadow-black/40 group"
            >
              <div>
                {/* Карточка: Заголовок и зона */}
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xl font-black text-zinc-100 tracking-tight group-hover:text-emerald-400 transition-colors">
                    {pc.name}
                  </span>
                  <span className="text-[9px] tracking-widest uppercase bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800 text-zinc-400 font-black font-mono">
                    {pc.zone}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono text-zinc-400">
                  <p className="flex items-center gap-2">
                    <span className="text-zinc-600 font-bold">● СТАТУС:</span>{" "}
                    <span
                      className={`font-black uppercase tracking-wider ${
                        isAvailable
                          ? "text-emerald-400"
                          : isBusy
                            ? "text-amber-500"
                            : "text-red-500"
                      }`}
                    >
                      {pc.status === "AVAILABLE" || pc.status === "FREE"
                        ? "Свободен"
                        : pc.status}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-zinc-600 font-bold">● ТАРИФ:</span>{" "}
                    <span className="text-amber-400 font-black">
                      {pc.pricePerHour} $/Hr
                    </span>
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
