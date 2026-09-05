import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
      <div>
        <h2 className="text-lg font-semibold text-white">
          RPG Hub
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-white">
            {user?.name}
          </p>

          <p className="text-xs text-slate-400">
            {user?.email}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}