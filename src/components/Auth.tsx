import { useState } from "react";
import { userApi } from "../api";

export interface User {
  id: string;
  username: string;
  balance: number;
  isBanned: boolean;
}

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername) return;

    setLoading(true);
    setError(null);

    try {
      const allUsers = await userApi.getAll();

      const existingUser = allUsers.find(
        (u) => u.username.toLowerCase() === cleanUsername.toLowerCase(),
      );

      if (isLoginView) {
        if (existingUser) {
          if (existingUser.isBanned) {
            setError("Данный аккаунт заблокирован администрацией.");
            setLoading(false);
            return;
          }
          onAuthSuccess(existingUser);
        } else {
          setError(
            "Пользователь с таким никнеймом не найден. Зарегистрируйтесь.",
          );
        }
      } else {
        if (existingUser) {
          setError("Этот никнейм уже занят. Выберите другой.");
        } else {
          const newUser = await userApi.create({ username: cleanUsername });
          setLoading(false);
          onAuthSuccess(newUser);
          return;
        }
      }
    } catch (err: any) {
      console.error(err);
      if (loading) {
        setError("Ошибка соединения с сервером Render. Попробуйте еще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans selection:bg-emerald-500 selection:text-zinc-950 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative transition-all duration-300 hover:border-emerald-500/20 shadow-black/80">
        <div className="absolute top-5 right-5 flex items-center gap-1.5 font-mono text-[9px] text-zinc-500 tracking-widest uppercase select-none">
          <span
            className={`w-1.5 h-1.5 rounded-full ${loading ? "bg-amber-400 animate-pulse" : "bg-emerald-400"} inline-block`}
          />
          {loading ? "pending" : "secure"}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tighter uppercase bg-gradient-to-r from-zinc-100 via-emerald-400 to-amber-500 bg-clip-text text-transparent select-none">
            CyberShell
          </h2>
          <div className="h-[1px] w-16 bg-gradient-to-r from-emerald-500 to-amber-500 mx-auto mt-2 rounded-full" />
          <p className="text-[9px] text-zinc-400 mt-4 uppercase tracking-widest font-mono font-black select-none">
            {isLoginView
              ? "Идентификация пользователя"
              : "Регистрация новой сессии"}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/20 border border-red-500/20 text-red-400 p-3.5 rounded-2xl text-xs font-mono flex gap-2 items-start">
            <span className="font-bold shrink-0">[КРИТ_СБОЙ]:</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2 tracking-wider font-mono select-none">
              Игровой никнейм (ID)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-sm select-none">
                #
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="system_access_key"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-9 pr-4 py-3.5 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/10 transition-all text-sm font-mono"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black py-4 rounded-2xl text-xs transition-all duration-200 shadow-xl shadow-emerald-950/10 cursor-pointer disabled:opacity-40 uppercase tracking-widest"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                Синхронизация...
              </span>
            ) : isLoginView ? (
              "Получить доступ"
            ) : (
              "Внести запись в БД"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500 font-medium font-mono select-none">
          {isLoginView ? "Нет учетной записи? " : "Запись уже существует? "}
          <button
            type="button"
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError(null);
              setUsername("");
            }}
            className="text-amber-500 hover:text-amber-400 font-bold cursor-pointer transition-colors underline underline-offset-4"
          >
            {isLoginView ? "Создать профиль" : "Вернуться к входу"}
          </button>
        </div>
      </div>
    </div>
  );
}
