import { Link, useParams } from "react-router-dom";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";

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
    <div className="space-y-8">

      <PageHeader
        title={character.name}
        description={`Ficha de personagem • ${character.campaign}`}
      />

      {/* Voltar */}
      <div>
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

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-600/20 text-4xl">
              {character.avatar}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold">
                  {character.name}
                </h2>

                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                  Nível {character.level}
                </span>
              </div>

              <p className="mt-2 text-slate-400">
                {character.race} • {character.className}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">

                <div>
                  <p className="text-xs text-slate-500">
                    Jogador
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {character.player}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Classe
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {character.className}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Raça
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {character.race}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Antecedente
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {character.background}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-slate-400">
            Alinhamento
          </p>

          <p className="mt-2 text-xl font-semibold">
            {character.alignment}
          </p>

          <div className="mt-6 border-t border-slate-800 pt-5">
            <p className="text-sm font-medium text-slate-400">
              Campanha
            </p>

            <Link
              to="/campaign/1"
              className="mt-2 block text-indigo-400 transition hover:text-indigo-300"
            >
              {character.campaign}
            </Link>
          </div>
        </Card>

      </section>

      {/* Atributos */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Atributos
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Valores principais do personagem.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">

          {attributes.map((attribute) => (
            <Card
              key={attribute.name}
              className="p-5 text-center"
            >
              <p className="text-sm text-slate-400">
                {attribute.name}
              </p>

              <p className="mt-3 text-3xl font-bold">
                {attribute.value}
              </p>

              <div className="mt-2 inline-flex rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                {attribute.modifier >= 0
                  ? `+${attribute.modifier}`
                  : attribute.modifier}
              </div>
            </Card>
          ))}

        </div>
      </section>

      {/* Combate */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Combate
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Informações de combate do personagem.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card className="p-5">
            <p className="text-sm text-slate-400">
              Classe de Armadura
            </p>

            <p className="mt-2 text-3xl font-bold">
              15
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-400">
              Pontos de Vida
            </p>

            <p className="mt-2 text-3xl font-bold">
              38
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-400">
              Iniciativa
            </p>

            <p className="mt-2 text-3xl font-bold">
              +3
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-400">
              Deslocamento
            </p>

            <p className="mt-2 text-3xl font-bold">
              9m
            </p>
          </Card>

        </div>
      </section>

      {/* Ações */}
      <section>
        <Card className="flex flex-wrap items-center justify-between gap-4 p-6">

          <div>
            <h2 className="font-semibold">
              Gerenciar personagem
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Edite ou gerencie os dados desta ficha.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary">
              Editar ficha
            </Button>

            <Button>
              Salvar alterações
            </Button>
          </div>

        </Card>
      </section>

    </div>
  );
}