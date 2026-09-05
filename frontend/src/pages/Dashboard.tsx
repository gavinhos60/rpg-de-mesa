import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";

import {
    getCampaigns,
    type Campaign,
} from "../services/campaign.service";

import { CreateCampaignModal } from "../components/CreateCampaignModal";
import { useNavigate } from "react-router-dom";

import {
    EmblemIcon,
    WaxSealIcon,
    BrokenSealIcon,
    QuillIcon,
    RibbonButton,
} from "../components/icons/MedievalIcons";

export function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    async function loadCampaigns() {
        try {
            setLoading(true);

            const data = await getCampaigns();

            setCampaigns(data);
        } catch (error) {
            console.error(
                "Erro ao carregar campanhas",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCampaigns();
    }, []);

    return (
        <div
            className="relative min-h-[calc(100vh-4rem)] text-[#2A1D14]"
            style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                backgroundColor: "#EBDFC4",
                backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(107,68,35,0.03) 0px, rgba(107,68,35,0.03) 1px, transparent 1px, transparent 5px)",
            }}
        >
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Cabeçalho — banner de manuscrito */}
                <header className="mb-10 border-t-2 border-b border-[#6B4423] pt-5 pb-6">
                    <div className="flex items-center gap-4">
                        <EmblemIcon className="w-10 h-10 text-[#6B4423] shrink-0" />
                        <div>
                            <h1
                                className="text-3xl text-[#2A1D14] leading-tight"
                                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                            >
                                Saudações, {user?.name}
                            </h1>
                            <p className="text-[#5C4A38] mt-1 italic">
                                Bem-vindo ao seu refúgio de campanhas.
                            </p>
                        </div>
                    </div>
                </header>

                {/* Título da seção + ação principal */}
                <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
                    <div className="border-l-2 border-[#A67C3D] pl-4">
                        <h2
                            className="text-2xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Suas campanhas
                        </h2>
                        <p className="text-[#5C4A38] mt-1">
                            Aventure-se pelas histórias que você construiu.
                        </p>
                    </div>

                    <RibbonButton onClick={() => setShowCreateModal(true)}>
                        Nova campanha
                    </RibbonButton>
                </div>

                {/* Conteúdo */}
                {loading ? (
                    <div className="flex items-center gap-3 text-[#5C4A38] py-10">
                        <QuillIcon className="w-5 h-5 animate-pulse" />
                        <span className="italic">Consultando os arquivos do reino...</span>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div
                        className="relative border border-[#6B4423] p-12 text-center"
                        style={{ backgroundColor: "#DCCBA0" }}
                    >
                        <BrokenSealIcon className="w-16 h-16 mx-auto mb-4" />

                        <h3
                            className="text-xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Nenhuma campanha registrada
                        </h3>

                        <p className="text-[#5C4A38] mt-2 max-w-md mx-auto">
                            Os arquivos estão em branco. Crie sua primeira campanha
                            para começar a escrever esta história.
                        </p>

                        <RibbonButton
                            className="mt-6"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Criar campanha
                        </RibbonButton>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                onClick={() => navigate(`/campaigns/${campaign.id}`)}
                                className="group relative pl-5 pr-5 pt-5 pb-4 border border-[#6B4423] hover:border-[#A67C3D] transition-colors cursor-pointer"
                                style={{ backgroundColor: "#DCCBA0" }}
                            >
                                {/* Lombada */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-2"
                                    style={{
                                        backgroundColor: "#4A2F18",
                                        backgroundImage:
                                            "repeating-linear-gradient(0deg, rgba(233,220,180,0.15) 0px, rgba(233,220,180,0.15) 2px, transparent 2px, transparent 8px)",
                                    }}
                                />

                                <div className="flex items-start justify-between">
                                    <EmblemIcon className="w-8 h-8 text-[#6B4423]" />
                                    <WaxSealIcon className="w-9 h-9" label={campaign.id} />
                                </div>

                                <h3
                                    className="text-xl text-[#2A1D14] mt-4"
                                    style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                >
                                    {campaign.name}
                                </h3>

                                <p className="text-[#5C4A38] text-sm mt-2">
                                    {campaign.characters.length} personagem
                                    {campaign.characters.length !== 1 ? "ns" : ""} nesta jornada
                                </p>

                                <div className="mt-5 pt-3 border-t border-[#A67C3D]/50">
                                    <span className="text-sm text-[#7A2530] group-hover:text-[#5C1D26]">
                                        Abrir campanha
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal de criação */}
                {showCreateModal && (
                    <CreateCampaignModal
                        onClose={() => setShowCreateModal(false)}
                        onCreated={loadCampaigns}
                    />
                )}
            </div>
        </div>
    );
}