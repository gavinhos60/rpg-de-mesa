import { useAuth } from "../contexts/AuthContext";
import { EmblemIcon, WaxSealIcon } from "./icons/MedievalIcons";

export function Header() {
    const { user } = useAuth();

    return (
        <header
            className="h-16 flex items-center justify-between px-8 border-b-2"
            style={{ backgroundColor: "#1A120B", borderColor: "#A67C3D" }}
        >
            <div className="flex items-center gap-3">
                
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm text-[#EBDFC4]" style={{ fontFamily: "'Cinzel', serif" }}>
                        {user?.name}
                    </p>

                    <p className="text-xs text-[#8A7860]">
                        {user?.email}
                    </p>
                </div>

                <WaxSealIcon
                    className="w-10 h-10 shrink-0"
                    label={user?.name?.charAt(0).toUpperCase() ?? "?"}
                />
            </div>
        </header>
    );
}