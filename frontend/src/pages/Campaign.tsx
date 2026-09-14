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

import { AddPlayerModal } from "../components/AddPlayerModal";
import { AddCharacterToCampaignModal } from "../components/AddCharacterToCampaignModal";
import { StatCard } from "../components/StatCard";

import { useAuth } from "../contexts/AuthContext";

import {
    EmblemIcon,
    WaxSealIcon,
    BrokenSealIcon,
    QuillIcon,
    CrownIcon,
    GroupIcon,
    ScrollIcon,
    PortraitIcon,
    RibbonButton,
} from "../components/icons/MedievalIcons";

const sectionTitleClass = "text-2xl text-[#2A1D14]";
const sectionTitleStyle = { fontFamily: "'Cinzel', serif", fontWeight: 600 } as const;

export function Campaign() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [campaign, setCampaign] =
        useState<CampaignDetails | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAddPlayerModal, setShowAddPlayerModal] =
        useState(false);

    const [showAddCharacterModal, setShowAddCharacterModal] =
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

    const pageShellStyle = {
        fontFamily: "'EB Garamond', Georgia, serif",
        backgroundColor: "#EBDFC4",
        backgroundImage:
            "repeating-linear-gradient(115deg, rgba(107,68,35,0.03) 0px, rgba(107,68,35,0.03) 1px, transparent 1px, transparent 5px)",
    };

    if (loading) {
        return (
            <div
                className="min-h-[calc(100vh-4rem)] text-[#2A1D14]"
                style={pageShellStyle}
            >
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="flex items-center gap-3 text-[#5C4A38] py-10">
                        <QuillIcon className="w-5 h-5 animate-pulse" />
                        <span className="italic">Consultando os arquivos do reino...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div
                className="min-h-[calc(100vh-4rem)] text-[#2A1D14]"
                style={pageShellStyle}
            >
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <button
                        onClick={() => navigate("/campaigns")}
                        className="text-sm text-[#7A2530] hover:text-[#5C1D26] mb-6 transition-colors"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        ← Voltar
                    </button>

                    <div
                        className="flex items-center gap-4 border p-6"
                        style={{ backgroundColor: "#DCCBA0", borderColor: "#7A2530" }}
                    >
                        <BrokenSealIcon className="w-10 h-10 shrink-0" color="#7A2530" />
                        <p className="text-[#5C1D26]">
                            {error || "Campanha não encontrada."}
                        </p>
                    </div>
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

    const currentUserIsMember = campaign.members.some(
        (member) => member.userId === user?.id
    );

    return (
        <div
            className="min-h-[calc(100vh-4rem)] text-[#2A1D14]"
            style={pageShellStyle}
        >
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Voltar */}
                <button
                    onClick={() => navigate("/campaigns")}
                    className="text-sm text-[#5C4A38] hover:text-[#2A1D14] mb-6 transition-colors"
                >
                    ← Voltar para campanhas
                </button>

                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-5 flex-wrap mb-8 border-b border-[#6B4423] pb-6">
                    <div className="flex items-start gap-4">
                        <WaxSealIcon className="w-14 h-14 shrink-0" label={campaign.id} />

                        <div>
                            <h1
                                className="text-3xl text-[#2A1D14]"
                                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                            >
                                {campaign.name}
                            </h1>

                            <p className="text-[#5C4A38] mt-1 italic">
                                Registro oficial desta campanha
                            </p>
                        </div>
                    </div>

                    {currentUserIsMaster && (
                        <button
                            onClick={handleDeleteCampaign}
                            className="flex items-center gap-2 border px-4 py-2 text-sm text-[#7A2530] hover:bg-[#7A2530] hover:text-[#EBDFC4] transition-colors"
                            style={{ borderColor: "#7A2530", fontFamily: "'Cinzel', serif" }}
                        >
                            <BrokenSealIcon className="w-5 h-5 shrink-0" color="currentColor" />
                            Excluir campanha
                        </button>
                    )}
                </div>

                {/* Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                    <StatCard label="Membros" value={campaign.members.length} Icon={EmblemIcon} />
                    <StatCard label="Jogadores" value={players.length} Icon={GroupIcon} />
                    <StatCard label="Personagens" value={campaign.characters.length} Icon={ScrollIcon} />
                </div>

                {/* Mestres */}
                <section className="mb-10">
                    <div className="border-l-2 border-[#A67C3D] pl-4 mb-4 flex items-center gap-2">
                        <CrownIcon className="w-6 h-6 text-[#6B4423]" />
                        <h2 className={sectionTitleClass} style={sectionTitleStyle}>
                            Mestres
                        </h2>
                    </div>

                    {masters.length === 0 ? (
                        <p className="text-[#8A7860] italic pl-4">
                            Nenhum mestre cadastrado.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {masters.map((member) => (
                                <div
                                    key={member.id}
                                    className="border border-[#6B4423] p-5"
                                    style={{ backgroundColor: "#DCCBA0" }}
                                >
                                    <p
                                        className="text-[#2A1D14]"
                                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                    >
                                        {member.user.name}
                                    </p>

                                    <p className="text-sm text-[#5C4A38] mt-1">
                                        {member.user.email}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Jogadores */}
                <section className="mb-10">
                    <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
                        <div className="border-l-2 border-[#A67C3D] pl-4 flex items-center gap-2">
                            <GroupIcon className="w-6 h-6 text-[#6B4423]" />
                            <h2 className={sectionTitleClass} style={sectionTitleStyle}>
                                Jogadores
                            </h2>
                        </div>

                        {currentUserIsMaster && (
                            <RibbonButton onClick={() => setShowAddPlayerModal(true)}>
                                Adicionar jogador
                            </RibbonButton>
                        )}
                    </div>

                    {players.length === 0 ? (
                        <p className="text-[#8A7860] italic pl-4">
                            Nenhum jogador cadastrado.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {players.map((member) => (
                                <div
                                    key={member.id}
                                    className="border border-[#6B4423] p-5"
                                    style={{ backgroundColor: "#DCCBA0" }}
                                >
                                    <p
                                        className="text-[#2A1D14]"
                                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                    >
                                        {member.user.name}
                                    </p>

                                    <p className="text-sm text-[#5C4A38] mt-1">
                                        {member.user.email}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Personagens */}
                <section>
                    <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
                        <div className="border-l-2 border-[#A67C3D] pl-4 flex items-center gap-2">
                            <ScrollIcon className="w-6 h-6 text-[#6B4423]" />
                            <h2 className={sectionTitleClass} style={sectionTitleStyle}>
                                Personagens
                            </h2>
                        </div>

                        {currentUserIsMember && (
                            <div className="flex flex-wrap items-center gap-3">
                                <RibbonButton onClick={() => setShowAddCharacterModal(true)}>
                                    Adicionar ficha
                                </RibbonButton>
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/characters/new?campaignId=${campaign.id}`
                                        )
                                    }
                                    className="border px-4 py-2 text-sm text-[#5C4A38] transition-colors hover:border-[#7A2530] hover:text-[#2A1D14]"
                                    style={{
                                        borderColor: "#A67C3D",
                                        fontFamily: "'Cinzel', serif",
                                        backgroundColor: "#EBDFC4",
                                    }}
                                >
                                    Criar nova ficha
                                </button>
                            </div>
                        )}
                    </div>

                    {campaign.characters.length === 0 ? (
                        <div
                            className="border border-[#6B4423] p-10 text-center"
                            style={{ backgroundColor: "#DCCBA0" }}
                        >
                            <p className="text-[#5C4A38]">
                                Nenhum personagem nesta campanha.
                            </p>
                            {currentUserIsMember && (
                                <p className="mt-2 text-sm text-[#8A7860]">
                                    Jogadores podem adicionar fichas já criadas ou criar uma
                                    nova para esta mesa.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {campaign.characters.map((character) => (
                                <button
                                    key={character.id}
                                    type="button"
                                    onClick={() =>
                                        navigate(`/characters/${character.id}`)
                                    }
                                    className="border border-[#6B4423] hover:border-[#A67C3D] transition-colors overflow-hidden text-left"
                                    style={{ backgroundColor: "#DCCBA0" }}
                                >
                                    {character.avatar ? (
                                        <img
                                            src={character.avatar}
                                            alt={character.name}
                                            className="w-full h-44 object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-44 flex items-center justify-center"
                                            style={{ backgroundColor: "#4A2F18" }}
                                        >
                                            <PortraitIcon className="w-16 h-16 text-[#A67C3D]" />
                                        </div>
                                    )}

                                    <div className="p-5">
                                        <h3
                                            className="text-xl text-[#2A1D14]"
                                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                        >
                                            {character.name}
                                        </h3>

                                        <p className="text-[#7A2530] mt-1">
                                            {character.className}
                                        </p>

                                        <p className="text-sm text-[#5C4A38] mt-2">
                                            {character.race} • Nível {character.level}
                                        </p>

                                        <div className="mt-4 pt-4 border-t border-[#A67C3D]/50">
                                            <p className="text-xs text-[#8A7860]">
                                                Jogador
                                            </p>

                                            <p className="text-sm text-[#2A1D14]">
                                                {character.player.name}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {showAddCharacterModal && campaign && (
                    <AddCharacterToCampaignModal
                        campaignId={campaign.id}
                        onClose={() => setShowAddCharacterModal(false)}
                        onAdded={loadCampaign}
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
        </div>
    );
}