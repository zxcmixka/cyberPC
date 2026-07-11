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
  const [price, setPrice] = useState(150);

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
      setShowForm(false);
      loadComputers();
    } catch (err) {
      console.error("Ошибка создания ПК:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-cyan-400">
            Мониторинг игровых зон
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Режим суперпользователя (Администратор)
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
        >
          {showForm ? "Закрыть форму" : "+ Добавить ПК"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end max-w-4xl"
        >
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Имя ПК
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="PC-09"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Зона
            </label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value as ZoneType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="COMMON">COMMON</option>
              <option value="VIP">VIP</option>
              <option value="STREAMER">STREAMER</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Цена (₽/ч)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold py-2 rounded-lg text-sm cursor-pointer hover:from-cyan-400"
          >
            Создать ПК
          </button>
        </form>
      )}

      {/* Сетка компьютеров */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-0 m-0 list-none">
        {computers.map((pc) => (
          <li
            key={pc.id || Math.random()}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500 hover:-translate-y-1"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-black text-white tracking-tight">
                  {pc.name}
                </span>
                <span className="text-[10px] tracking-wider uppercase bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-slate-400 font-bold">
                  {pc.zone}
                </span>
              </div>
              <div className="space-y-1 text-sm font-mono text-slate-400">
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
                  Цена:{" "}
                  <span className="text-amber-400 font-bold">
                    ${pc.pricePerHour}/Hr
                  </span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
