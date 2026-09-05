import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
    EmblemIcon,
    CastleIcon,
    CompassIcon,
    ScrollIcon,
    DoorIcon,
} from "./icons/MedievalIcons";

export function Sidebar() {
    const { logout } = useAuth();

    const links = [
        { label: "Dashboard", path: "/dashboard", Icon: CastleIcon },
        { label: "Campanhas", path: "/campaigns", Icon: CompassIcon },
        { label: "Personagens", path: "/characters", Icon: ScrollIcon },
    ];

    const tabClip = "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)";

    return (
        <aside
            className="fixed left-0 top-0 h-screen w-64 flex flex-col"
            style={{ backgroundColor: "#1A120B" }}
        >
            {/* Marca */}
            <div className="px-6 pt-6 pb-5">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border"
                        style={{ borderColor: "#A67C3D" }}
                    >
                        <EmblemIcon className="w-6 h-6 text-[#A67C3D]" />
                    </div>

                    <h1
                        className="text-xl text-[#EBDFC4]"
                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                    >
                        SUA MESA!
                    </h1>
                </div>

                <div
                    className="mt-5 h-[3px]"
                    style={{
                        backgroundImage:
                            "linear-gradient(90deg, #A67C3D 0%, #A67C3D 70%, transparent 70%, transparent 76%, #A67C3D 76%, #A67C3D 100%)",
                    }}
                />
            </div>

            {/* Navegação — abas de marcador */}
            <nav className="flex-1 px-0 py-4 space-y-2">
                {links.map(({ label, path, Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        style={({ isActive }) => ({
                            clipPath: tabClip,
                            backgroundColor: isActive ? "#7A2530" : "transparent",
                            fontFamily: "'Cinzel', serif",
                        })}
                        className={({ isActive }) =>
                            `flex items-center gap-3 pl-6 pr-8 py-3.5 mr-4 transition-colors ${
                                isActive
                                    ? "text-[#EBDFC4]"
                                    : "text-[#8A7860] hover:text-[#EBDFC4] hover:bg-[#2A1D14]"
                            }`
                        }
                    >
                        <Icon className="w-6 h-6 shrink-0" />
                        <span className="text-base">{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Sair */}
            <div className="px-6 py-5 border-t border-[#3A2A1E]">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 text-[#8A7860] hover:text-[#B33A47] transition-colors"
                    style={{ fontFamily: "'Cinzel', serif" }}
                >
                    <DoorIcon className="w-6 h-6 shrink-0" />
                    <span className="text-base">Sair</span>
                </button>
            </div>
        </aside>
    );
}