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
import {
    getActiveGameSession,
    startGameSession,
} from "../services/game.service";
import { removeCharacterFromCampaign } from "../services/character.service";
import type { GameSessionSummary } from "../types/game";

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

const sectionTitleClass = "text-2xl text-[var(--color-ink)]";
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

    const [activeSession, setActiveSession] =
        useState<GameSessionSummary | null>(null);
    const [sessionLoading, setSessionLoading] = useState(false);

    async function loadCampaign() {
        try {
            setLoading(true);
            setError("");

            const data = await getCampaignById(
                Number(id)
            );

            setCampaign(data);

            try {
                const session = await getActiveGameSession(Number(id));
                setActiveSession(session);
            } catch {
                setActiveSession(null);
            }
        } catch (error) {
            console.error(error);

            setError(
                "Não foi possível carregar a campanha."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleStartGame() {
        if (!campaign) return;
        try {
            setSessionLoading(true);
            const session = await startGameSession(campaign.id);
            setActiveSession(session);
            navigate(`/campaigns/${campaign.id}/play`);
        } catch (error) {
            console.error(error);
            alert("Não foi possível iniciar a sessão de jogo.");
        } finally {
            setSessionLoading(false);
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

    async function handleRemoveCharacter(characterId: number, name: string) {
        if (!campaign) return;
        const confirmed = window.confirm(
            `Remover "${name}" desta campanha?\n\nA ficha não será apagada; apenas sai da mesa.`
        );
        if (!confirmed) return;
        try {
            await removeCharacterFromCampaign(characterId);
            await loadCampaign();
        } catch (error) {
            console.error(error);
            alert("Não foi possível remover o personagem da campanha.");
        }
    }

    useEffect(() => {
        loadCampaign();
    }, [id]);

    const pageShellStyle = {
        fontFamily: "'EB Garamond', Georgia, serif",
        backgroundColor: "var(--color-parchment)",
        backgroundImage:
            "repeating-linear-gradient(115deg, rgba(107,68,35,0.03) 0px, rgba(107,68,35,0.03) 1px, transparent 1px, transparent 5px)",
    };

    if (loading) {
        return (
            <div
                className="min-h-[calc(100vh-4rem)] text-[var(--color-ink)]"
                style={pageShellStyle}
            >
                <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
                    <div className="flex items-center gap-3 text-[var(--color-ink-muted)] py-10">
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
                className="min-h-[calc(100vh-4rem)] text-[var(--color-ink)]"
                style={pageShellStyle}
            >
                <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
                    <button
                        onClick={() => navigate("/campaigns")}
                        className="text-sm text-[var(--color-crimson)] hover:text-[#5C1D26] mb-6 transition-colors"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        ← Voltar
                    </button>

                    <div
                        className="flex items-center gap-4 border p-6"
                        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-crimson)" }}
                    >
                        <BrokenSealIcon className="w-10 h-10 shrink-0" color="var(--color-crimson)" />
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
            className="min-h-[calc(100vh-4rem)] text-[var(--color-ink)]"
            style={pageShellStyle}
        >
            <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-10">

                {/* Voltar */}
                <button
                    onClick={() => navigate("/campaigns")}
                    className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] mb-6 transition-colors"
                >
                    ← Voltar para campanhas
                </button>

                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-5 flex-wrap mb-8 border-b border-[var(--color-border-strong)] pb-6">
                    <div className="flex items-start gap-4">
                        <WaxSealIcon className="w-14 h-14 shrink-0" label={campaign.id} />

                        <div>
                            <h1
                                className="text-2xl text-[var(--color-ink)] sm:text-3xl"
                                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                            >
                                {campaign.name}
                            </h1>

                            <p className="text-[var(--color-ink-muted)] mt-1 italic">
                                Registro oficial desta campanha
                            </p>
                        </div>
                    </div>

                    {currentUserIsMaster && (
                        <div className="flex flex-wrap items-center gap-3">
                            <RibbonButton
                                onClick={handleStartGame}
                                disabled={sessionLoading}
                            >
                                {sessionLoading
                                    ? "Iniciando..."
                                    : activeSession
                                      ? "Reiniciar jogo"
                                      : "Iniciar jogo"}
                            </RibbonButton>
                            {activeSession && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(`/campaigns/${campaign.id}/play`)
                                    }
                                    className="border px-4 py-2 text-sm text-[var(--color-ink)] transition-colors hover:border-[var(--color-crimson)]"
                                    style={{
                                        borderColor: "var(--color-border)",
                                        backgroundColor: "var(--color-parchment)",
                                        fontFamily: "'Cinzel', serif",
                                    }}
                                >
                                    Entrar na sala
                                </button>
                            )}
                            <button
                                onClick={handleDeleteCampaign}
                                className="flex items-center gap-2 border px-4 py-2 text-sm text-[var(--color-crimson)] hover:bg-[var(--color-crimson)] hover:text-[var(--color-ink-inverse)] transition-colors"
                                style={{ borderColor: "var(--color-crimson)", fontFamily: "'Cinzel', serif" }}
                            >
                                <BrokenSealIcon className="w-5 h-5 shrink-0" color="currentColor" />
                                Excluir campanha
                            </button>
                        </div>
                    )}

                    {!currentUserIsMaster && activeSession && (
                        <RibbonButton
                            onClick={() =>
                                navigate(`/campaigns/${campaign.id}/play`)
                            }
                        >
                            Entrar na sala
                        </RibbonButton>
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
                    <div className="border-l-2 border-[var(--color-border)] pl-4 mb-4 flex items-center gap-2">
                        <CrownIcon className="w-6 h-6 text-[var(--color-border-strong)]" />
                        <h2 className={sectionTitleClass} style={sectionTitleStyle}>
                            Mestres
                        </h2>
                    </div>

                    {masters.length === 0 ? (
                        <p className="text-[var(--color-ink-soft)] italic pl-4">
                            Nenhum mestre cadastrado.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {masters.map((member) => (
                                <div
                                    key={member.id}
                                    className="border border-[var(--color-border-strong)] p-5"
                                    style={{ backgroundColor: "var(--color-surface)" }}
                                >
                                    <p
                                        className="text-[var(--color-ink)]"
                                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                    >
                                        {member.user.name}
                                    </p>

                                    <p className="text-sm text-[var(--color-ink-muted)] mt-1">
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
                        <div className="border-l-2 border-[var(--color-border)] pl-4 flex items-center gap-2">
                            <GroupIcon className="w-6 h-6 text-[var(--color-border-strong)]" />
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
                        <p className="text-[var(--color-ink-soft)] italic pl-4">
                            Nenhum jogador cadastrado.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {players.map((member) => (
                                <div
                                    key={member.id}
                                    className="border border-[var(--color-border-strong)] p-5"
                                    style={{ backgroundColor: "var(--color-surface)" }}
                                >
                                    <p
                                        className="text-[var(--color-ink)]"
                                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                    >
                                        {member.user.name}
                                    </p>

                                    <p className="text-sm text-[var(--color-ink-muted)] mt-1">
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
                        <div className="border-l-2 border-[var(--color-border)] pl-4 flex items-center gap-2">
                            <ScrollIcon className="w-6 h-6 text-[var(--color-border-strong)]" />
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
                                    className="border px-4 py-2 text-sm text-[var(--color-ink-muted)] transition-colors hover:border-[var(--color-crimson)] hover:text-[var(--color-ink)]"
                                    style={{
                                        borderColor: "var(--color-border)",
                                        fontFamily: "'Cinzel', serif",
                                        backgroundColor: "var(--color-parchment)",
                                    }}
                                >
                                    Criar nova ficha
                                </button>
                            </div>
                        )}
                    </div>

                    {campaign.characters.length === 0 ? (
                        <div
                            className="border border-[var(--color-border-strong)] p-10 text-center"
                            style={{ backgroundColor: "var(--color-surface)" }}
                        >
                            <p className="text-[var(--color-ink-muted)]">
                                Nenhum personagem nesta campanha.
                            </p>
                            {currentUserIsMember && (
                                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                                    Jogadores podem adicionar fichas já criadas ou criar uma
                                    nova para esta mesa.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                            {campaign.characters.map((character) => (
                                <div
                                    key={character.id}
                                    className="border border-[var(--color-border-strong)] overflow-hidden"
                                    style={{ backgroundColor: "var(--color-surface)" }}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(`/characters/${character.id}`)
                                        }
                                        className="w-full text-left transition-colors hover:opacity-95"
                                    >
                                        <div
                                            className="flex h-36 w-full items-center justify-center overflow-hidden"
                                            style={{ backgroundColor: "#1A140F" }}
                                        >
                                            {character.avatar ? (
                                                <img
                                                    src={character.avatar}
                                                    alt={character.name}
                                                    className="h-full w-full max-w-full object-contain"
                                                />
                                            ) : (
                                                <PortraitIcon className="w-10 h-10 text-[var(--color-border)]" />
                                            )}
                                        </div>

                                        <div className="p-3 pb-2">
                                            <h3
                                                className="truncate text-base text-[var(--color-ink)]"
                                                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                            >
                                                {character.name}
                                            </h3>

                                            <p className="truncate text-sm text-[var(--color-crimson)] mt-0.5">
                                                {character.className}
                                            </p>

                                            <p className="text-xs text-[var(--color-ink-muted)] mt-1">
                                                {character.race} • Nv. {character.level}
                                            </p>

                                            <div className="mt-2 pt-2 border-t border-[var(--color-border)]/50">
                                                <p className="text-[10px] text-[var(--color-ink-soft)]">
                                                    Jogador
                                                </p>

                                                <p className="truncate text-xs text-[var(--color-ink)]">
                                                    {character.player.name}
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    {(currentUserIsMaster ||
                                        character.playerId === user?.id) && (
                                        <div className="px-3 pb-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveCharacter(
                                                        character.id,
                                                        character.name
                                                    )
                                                }
                                                className="w-full border px-2 py-1.5 text-xs text-[var(--color-crimson)]"
                                                style={{
                                                    borderColor: "var(--color-crimson)",
                                                    backgroundColor: "var(--color-parchment-soft)",
                                                }}
                                            >
                                                Remover da campanha
                                            </button>
                                        </div>
                                    )}
                                </div>
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