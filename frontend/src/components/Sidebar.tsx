import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
    EmblemIcon,
    CastleIcon,
    CompassIcon,
    ScrollIcon,
    DoorIcon,
} from "./icons/MedievalIcons";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    /** Always off-canvas (e.g. game room needs full width). */
    drawerOnly?: boolean;
}

export function Sidebar({ open, onClose, drawerOnly = false }: SidebarProps) {
    const { logout } = useAuth();

    const links = [
        { label: "Dashboard", path: "/dashboard", Icon: CastleIcon },
        { label: "Campanhas", path: "/campaigns", Icon: CompassIcon },
        { label: "Personagens", path: "/characters", Icon: ScrollIcon },
    ];

    const tabClip = "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)";

    return (
        <aside
            className={`fixed left-0 top-0 z-50 flex h-screen w-64 max-w-[85vw] flex-col transition-transform duration-200 ease-out ${
                open ? "translate-x-0" : "-translate-x-full"
            } ${drawerOnly ? "" : "lg:translate-x-0"}`}
            style={{ backgroundColor: "var(--color-shell)" }}
        >
            <div className="flex items-start justify-between gap-2 px-6 pt-6 pb-5">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
                            style={{ borderColor: "var(--color-border)" }}
                        >
                            <EmblemIcon className="h-6 w-6 text-[var(--color-border)]" />
                        </div>

                        <h1
                            className="truncate text-xl text-[var(--color-ink-inverse)]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            SUA MESA!
                        </h1>
                    </div>

                    <div
                        className="mt-5 h-[3px]"
                        style={{
                            backgroundImage:
                                "linear-gradient(90deg, var(--color-border) 0%, var(--color-border) 70%, transparent 70%, transparent 76%, var(--color-border) 76%, var(--color-border) 100%)",
                        }}
                    />
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className={`mt-1 shrink-0 border px-2 py-1 text-sm text-[var(--color-ink-inverse)] ${
                        drawerOnly ? "" : "lg:hidden"
                    }`}
                    style={{ borderColor: "var(--color-border)" }}
                    aria-label="Fechar menu"
                >
                    ×
                </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-0 py-4">
                {links.map(({ label, path, Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        onClick={onClose}
                        style={({ isActive }) => ({
                            clipPath: tabClip,
                            backgroundColor: isActive
                                ? "var(--color-crimson)"
                                : "transparent",
                            fontFamily: "'Cinzel', serif",
                        })}
                        className={({ isActive }) =>
                            `mr-4 flex items-center gap-3 py-3.5 pl-6 pr-8 transition-colors ${
                                isActive
                                    ? "text-[var(--color-ink-inverse)]"
                                    : "text-[var(--color-ink-soft)] hover:bg-[var(--color-panel)] hover:text-[var(--color-ink-inverse)]"
                            }`
                        }
                    >
                        <Icon className="h-6 w-6 shrink-0" />
                        <span className="text-base">{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div
                className="border-t px-6 py-5"
                style={{ borderColor: "var(--color-border-subtle)" }}
            >
                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        logout();
                    }}
                    className="flex items-center gap-3 text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-danger)]"
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    <DoorIcon className="h-6 w-6 shrink-0" />
                    <span className="text-base">Sair</span>
                </button>
            </div>
        </aside>
    );
}
