import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-lime-400 selection:text-zinc-950">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 p-6 gap-4 bg-zinc-900/20 backdrop-blur-md sticky top-0 z-50">
        <div>
          <span className="text-[10px] text-lime-400 font-mono uppercase tracking-widest block font-bold">
            Панель управления
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            CyberShell Admin
          </h1>
        </div>

        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
          <Link
            to="/admin"
            className="px-4 py-2 rounded-lg transition-all duration-200 uppercase tracking-wider font-bold text-zinc-400 hover:text-white"
          >
            Карта ПК
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-lg transition-all duration-200 uppercase tracking-wider font-bold text-zinc-400 hover:text-white"
          >
            База Игроков
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="bg-zinc-900 border border-zinc-800 text-xs font-mono uppercase tracking-wider font-bold px-4 py-2.5 rounded-xl text-zinc-400 hover:text-red-400 transition-colors cursor-pointer self-stretch sm:self-auto text-center"
        >
          🗙 Выйти
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-6 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
