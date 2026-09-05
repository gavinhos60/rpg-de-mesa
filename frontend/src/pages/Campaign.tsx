import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getCampaignById,
    deleteCampaign,
    type CampaignDetails,
} from "../services/campaign.service";

import { CreateCharacterModal } from "../components/CreateCharacterModal";
import { AddPlayerModal } from "../components/AddPlayerModal";

import { useAuth } from "../contexts/AuthContext";

export function Campaign() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [campaign, setCampaign] =
        useState<CampaignDetails | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateCharacterModal, setShowCreateCharacterModal] =
        useState(false);

    const [showAddPlayerModal, setShowAddPlayerModal] =
        useState(false);

    async function loadCampaign() {
        try {
            setLoading(true);
            setError("");

            const data = await getCampaignById(
                Number(id)
            );

            setCampaign(data);
        } catch (error) {
            console.error(error);

            setError(
                "Não foi possível carregar a campanha."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteCampaign() {
        if (!campaign) {
            return;
        }

        const confirmed = window.confirm(
            `Tem certeza que deseja excluir a campanha "${campaign.name}"?\n\nTodos os jogadores e personagens dessa campanha serão removidos. Esta ação não pode ser desfeita.`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteCampaign(campaign.id);

            navigate("/campaigns");
        } catch (error) {
            console.error(error);

            alert(
                "Não foi possível excluir a campanha."
            );
        }
    }

    useEffect(() => {
        loadCampaign();
    }, [id]);

    if (loading) {
        return (
            <div className="text-slate-400">
                Carregando campanha...
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div>
                <button
                    onClick={() => navigate("/campaigns")}
                    className="text-indigo-400 hover:text-indigo-300 mb-6"
                >
                    ← Voltar
                </button>

                <div className="rounded-xl border border-red-900 bg-red-950/40 p-6 text-red-300">
                    {error || "Campanha não encontrada."}
                </div>
            </div>
        );
    }

    const masters = campaign.members.filter(
        (member) => member.role === "MASTER"
    );

    const players = campaign.members.filter(
        (member) => member.role === "PLAYER"
    );

    const currentUserIsMaster = campaign.members.some(
        (member) =>
            member.userId === user?.id &&
            member.role === "MASTER"
    );

    return (
        <div>
            {/* Cabeçalho */}
            <div className="mb-8">
                <button
                    onClick={() => navigate("/campaigns")}
                    className="text-sm text-slate-400 hover:text-white mb-5 transition"
                >
                    ← Voltar para campanhas
                </button>

                <div className="flex items-start justify-between gap-5">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-xl bg-indigo-600/20 flex items-center justify-center text-3xl">
                            ⚔️
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {campaign.name}
                            </h1>

                            <p className="text-slate-400 mt-1">
                                Campanha #{campaign.id}
                            </p>
                        </div>
                    </div>

                    {/* Excluir campanha */}
                    {currentUserIsMaster && (
                        <button
                            onClick={handleDeleteCampaign}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            🗑️ Excluir campanha
                        </button>
                    )}
                </div>
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <p className="text-sm text-slate-400">
                        Membros
                    </p>

                    <p className="text-3xl font-bold text-white mt-2">
                        {campaign.members.length}
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <p className="text-sm text-slate-400">
                        Jogadores
                    </p>

                    <p className="text-3xl font-bold text-white mt-2">
                        {players.length}
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <p className="text-sm text-slate-400">
                        Personagens
                    </p>

                    <p className="text-3xl font-bold text-white mt-2">
                        {campaign.characters.length}
                    </p>
                </div>
            </div>

            {/* Mestres */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                    👑 Mestres
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {masters.length === 0 ? (
                        <p className="text-slate-500">
                            Nenhum mestre cadastrado.
                        </p>
                    ) : (
                        masters.map((member) => (
                            <div
                                key={member.id}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                            >
                                <p className="font-semibold text-white">
                                    {member.user.name}
                                </p>

                                <p className="text-sm text-slate-400 mt-1">
                                    {member.user.email}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Jogadores */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">
                        👥 Jogadores
                    </h2>

                    {currentUserIsMaster && (
                        <button
                            onClick={() =>
                                setShowAddPlayerModal(true)
                            }
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            + Adicionar jogador
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {players.length === 0 ? (
                        <p className="text-slate-500">
                            Nenhum jogador cadastrado.
                        </p>
                    ) : (
                        players.map((member) => (
                            <div
                                key={member.id}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                            >
                                <p className="font-semibold text-white">
                                    {member.user.name}
                                </p>

                                <p className="text-sm text-slate-400 mt-1">
                                    {member.user.email}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Personagens */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">
                        ⚔️ Personagens
                    </h2>

                    <button
                        onClick={() =>
                            setShowCreateCharacterModal(true)
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        + Novo personagem
                    </button>
                </div>

                {campaign.characters.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                        <p className="text-slate-400">
                            Nenhum personagem nesta campanha.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {campaign.characters.map((character) => (
                            <div
                                key={character.id}
                                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500 transition"
                            >
                                {character.avatar ? (
                                    <img
                                        src={character.avatar}
                                        alt={character.name}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-slate-800 flex items-center justify-center text-5xl">
                                        🧙
                                    </div>
                                )}

                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-white">
                                        {character.name}
                                    </h3>

                                    <p className="text-indigo-400 mt-1">
                                        {character.className}
                                    </p>

                                    <p className="text-sm text-slate-400 mt-2">
                                        {character.race} • Nível{" "}
                                        {character.level}
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-slate-800">
                                        <p className="text-xs text-slate-500">
                                            Jogador
                                        </p>

                                        <p className="text-sm text-slate-300">
                                            {character.player.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Modal de criação de personagem */}
            {showCreateCharacterModal &&
                user &&
                campaign && (
                    <CreateCharacterModal
                        campaignId={campaign.id}
                        playerId={user.id}
                        onClose={() =>
                            setShowCreateCharacterModal(false)
                        }
                        onCreated={loadCampaign}
                    />
                )}

            {/* Modal de adicionar jogador */}
            {showAddPlayerModal &&
                campaign && (
                    <AddPlayerModal
                        campaignId={campaign.id}
                        onClose={() =>
                            setShowAddPlayerModal(false)
                        }
                        onAdded={loadCampaign}
                    />
                )}
        </div>
    );
}