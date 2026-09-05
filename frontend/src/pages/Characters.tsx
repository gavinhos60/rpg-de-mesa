import { useNavigate } from "react-router-dom";

import {
    ScrollIcon,
    RibbonButton,
} from "../components/icons/MedievalIcons";

export function Characters() {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-full text-[#2A1D14]"
            style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                backgroundColor: "#EBDFC4",
                backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(107,68,35,0.03) 0px, rgba(107,68,35,0.03) 1px, transparent 1px, transparent 5px)",
            }}
        >
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Cabeçalho */}
                <div className="mb-8 flex items-end justify-between gap-4 flex-wrap border-b border-[#6B4423] pb-5">
                    <div>
                        <h1
                            className="text-3xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Meus personagens
                        </h1>

                        <p className="mt-2 text-[#5C4A38]">
                            Crie e gerencie seus personagens de RPG.
                        </p>
                    </div>

                    <RibbonButton onClick={() => navigate("/characters/new")}>
                        Novo personagem
                    </RibbonButton>
                </div>

                {/* Estado vazio */}
                <div
                    className="border border-[#6B4423] p-12 text-center"
                    style={{ backgroundColor: "#DCCBA0" }}
                >
                    <ScrollIcon className="w-16 h-12 mx-auto mb-4 text-[#6B4423]" />

                    <h2
                        className="text-xl text-[#2A1D14]"
                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                    >
                        Nenhum personagem registrado
                    </h2>

                    <p className="mt-2 text-[#5C4A38]">
                        Você ainda não escreveu nenhuma página nesta coleção.
                    </p>

                    <RibbonButton
                        className="mt-6"
                        onClick={() => navigate("/characters/new")}
                    >
                        Criar personagem
                    </RibbonButton>
                </div>
            </div>
        </div>
    );
}