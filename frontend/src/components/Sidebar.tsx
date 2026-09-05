import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Sidebar() {
    const { logout } = useAuth();

    const links = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: "🏠",
        },
        {
            label: "Campanhas",
            path: "/campaigns",
            icon: "⚔️",
        },
        {
            label: "Personagens",
            path: "/characters",
            icon: "👤",
        },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <h1 className="text-xl font-bold text-white">
                    ⚔ RPG Hub
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                ? "bg-indigo-600 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`
                        }
                    >
                        <span>{link.icon}</span>
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-950 hover:text-red-400 transition"
                >
                    <span>🚪</span>
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
}