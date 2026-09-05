import { useNavigate } from "react-router-dom";

export function Characters() {
    const navigate = useNavigate();

    return (
        <div>
            {/* Cabeçalho */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Meus personagens
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Crie e gerencie seus personagens de RPG.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/characters/new")
                    }
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                >
                    + Novo personagem
                </button>
            </div>

            {/* Estado vazio */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
                <div className="mb-4 text-5xl">
                    🧙
                </div>

                <h2 className="text-xl font-semibold text-white">
                    Nenhum personagem
                </h2>

                <p className="mt-2 text-slate-400">
                    Você ainda não criou nenhum personagem.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/characters/new")
                    }
                    className="mt-5 rounded-lg bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700"
                >
                    Criar personagem
                </button>
            </div>
        </div>
    );
}