import { Link, useParams } from "react-router-dom";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { PageHeader } from "../components/PageHeader";
import {
    ShieldIcon,
    BoltIcon,
    BootIcon,
    HeartVineIcon,
} from "../components/icons/MedievalIcons";

export function CharacterSheet() {
    const { id } = useParams();

    const character = {
        id,
        name: "Arthen",
        player: "Administrador",
        className: "Bardo",
        race: "Humano",
        level: 5,
        campaign: "Crônicas de Eldoria",
        background: "Artista",
        alignment: "Caótico e Bom",
        avatar: "🎵",
    };

    const attributes = [
        { name: "Força", value: 10, modifier: 0 },
        { name: "Destreza", value: 16, modifier: 3 },
        { name: "Constituição", value: 12, modifier: 1 },
        { name: "Inteligência", value: 14, modifier: 2 },
        { name: "Sabedoria", value: 10, modifier: 0 },
        { name: "Carisma", value: 18, modifier: 4 },
    ];

    return (
        <div
            className="min-h-[calc(100vh-4rem)] text-[#2A1D14]"
            style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                backgroundColor: "#EBDFC4",
                backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(107,68,35,0.03) 0px, rgba(107,68,35,0.03) 1px, transparent 1px, transparent 5px)",
            }}
        >
            <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

                <PageHeader
                    title={character.name}
                    description={`Ficha de personagem • ${character.campaign}`}
                />

                {/* Voltar */}
                <div className="-mt-6">
                    <Link to="/characters">
                        <Button variant="ghost">
                            ← Voltar para personagens
                        </Button>
                    </Link>
                </div>

                {/* Informações principais */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    <Card className="p-6 lg:col-span-2">
                        <div className="flex items-start gap-5">

                            <div
                                className="flex h-20 w-20 shrink-0 items-center justify-center border-2 text-4xl"
                                style={{ borderColor: "#6B4423", backgroundColor: "#EBDFC4" }}
                            >
                                {character.avatar}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2
                                        className="text-2xl text-[#2A1D14]"
                                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                    >
                                        {character.name}
                                    </h2>

                                    <Badge variant="info">Nível {character.level}</Badge>
                                </div>

                                <p className="mt-2 text-[#5C4A38]">
                                    {character.race} • {character.className}
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div>
                                        <p className="text-xs text-[#8A7860]">Jogador</p>
                                        <p className="mt-1 text-sm text-[#2A1D14]">{character.player}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-[#8A7860]">Classe</p>
                                        <p className="mt-1 text-sm text-[#2A1D14]">{character.className}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-[#8A7860]">Raça</p>
                                        <p className="mt-1 text-sm text-[#2A1D14]">{character.race}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-[#8A7860]">Antecedente</p>
                                        <p className="mt-1 text-sm text-[#2A1D14]">{character.background}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <p className="text-sm text-[#5C4A38]">Alinhamento</p>

                        <p
                            className="mt-2 text-xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            {character.alignment}
                        </p>

                        <div className="mt-6 border-t border-[#A67C3D]/50 pt-5">
                            <p className="text-sm text-[#5C4A38]">Campanha</p>

                            <Link
                                to="/campaign/1"
                                className="mt-2 block text-[#7A2530] hover:text-[#5C1D26] transition-colors"
                            >
                                {character.campaign}
                            </Link>
                        </div>
                    </Card>

                </section>

                {/* Atributos */}
                <section>
                    <div className="mb-4 border-l-2 border-[#A67C3D] pl-4">
                        <h2
                            className="text-2xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Atributos
                        </h2>

                        <p className="mt-1 text-sm text-[#5C4A38]">
                            Valores principais do personagem.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                        {attributes.map((attribute) => (
                            <Card key={attribute.name} className="p-5 text-center">
                                <p className="text-sm text-[#5C4A38]">{attribute.name}</p>

                                <p
                                    className="mt-3 text-3xl text-[#2A1D14]"
                                    style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                >
                                    {attribute.value}
                                </p>

                                <div className="mt-2">
                                    <Badge variant="neutral">
                                        {attribute.modifier >= 0
                                            ? `+${attribute.modifier}`
                                            : attribute.modifier}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Combate */}
                <section>
                    <div className="mb-4 border-l-2 border-[#A67C3D] pl-4">
                        <h2
                            className="text-2xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            Combate
                        </h2>

                        <p className="mt-1 text-sm text-[#5C4A38]">
                            Informações de combate do personagem.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[#5C4A38]">Classe de Armadura</p>
                                    <p
                                        className="mt-2 text-3xl text-[#2A1D14]"
                                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                    >
                                        15
                                    </p>
                                </div>
                                <ShieldIcon className="w-7 h-7 text-[#6B4423] shrink-0" />
                            </div>
                        </Card>

                        <Card className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[#5C4A38]">Pontos de Vida</p>
                                    <p
                                        className="mt-2 text-3xl text-[#2A1D14]"
                                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                    >
                                        38
                                    </p>
                                </div>
                                <HeartVineIcon className="w-7 h-7 text-[#6B4423] shrink-0" />
                            </div>
                        </Card>

                        <Card className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[#5C4A38]">Iniciativa</p>
                                    <p
                                        className="mt-2 text-3xl text-[#2A1D14]"
                                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                    >
                                        +3
                                    </p>
                                </div>
                                <BoltIcon className="w-7 h-7 text-[#6B4423] shrink-0" />
                            </div>
                        </Card>

                        <Card className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-[#5C4A38]">Deslocamento</p>
                                    <p
                                        className="mt-2 text-3xl text-[#2A1D14]"
                                        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                                    >
                                        9m
                                    </p>
                                </div>
                                <BootIcon className="w-7 h-7 text-[#6B4423] shrink-0" />
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Ações */}
                <section>
                    <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
                        <div>
                            <h2
                                className="text-[#2A1D14]"
                                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                            >
                                Gerenciar personagem
                            </h2>

                            <p className="mt-1 text-sm text-[#5C4A38]">
                                Edite ou gerencie os dados desta ficha.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="secondary">Editar ficha</Button>
                            <Button variant="primary">Salvar alterações</Button>
                        </div>
                    </Card>
                </section>

            </div>
        </div>
    );
}