import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RibbonButton, ShieldIcon } from "../components/icons/MedievalIcons";
import {
  deleteMonster,
  getMyMonsters,
  type SavedCustomMonster,
} from "../services/monster.service";
import { customMonsterToMonster } from "../utils/customMonsterAdapter";

export function Monsters() {
  const navigate = useNavigate();
  const [monsters, setMonsters] = useState<SavedCustomMonster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      setMonsters(await getMyMonsters());
    } catch (err) {
      console.error(err);
      setError(
        "Não foi possível carregar seus monstros. Faça login e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete(monster: SavedCustomMonster) {
    const confirmed = window.confirm(
      `Excluir permanentemente "${monster.name}"?\n\nEsta ação não pode ser desfeita.`
    );
    if (!confirmed) return;
    try {
      await deleteMonster(monster.id);
      setMonsters((prev) => prev.filter((item) => item.id !== monster.id));
    } catch (err) {
      console.error(err);
      alert("Não foi possível excluir o monstro.");
    }
  }

  return (
    <div
      className="min-h-full text-[var(--color-ink)]"
      style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        backgroundColor: "var(--color-parchment)",
        backgroundImage:
          "repeating-linear-gradient(115deg, rgba(107,68,35,0.03) 0px, rgba(107,68,35,0.03) 1px, transparent 1px, transparent 5px)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-border-strong)] pb-5">
          <div>
            <h1
              className="text-3xl text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              Meus monstros
            </h1>
            <p className="mt-2 text-[var(--color-ink-muted)]">
              Crie e gerencie seus monstros de RPG.
            </p>
          </div>
          <RibbonButton onClick={() => navigate("/monsters/new")}>
            Novo monstro
          </RibbonButton>
        </div>

        {loading && (
          <p className="text-[var(--color-ink-muted)]">Carregando fichas...</p>
        )}

        {!loading && error && (
          <div
            className="border border-[var(--color-crimson)] p-6 text-[var(--color-crimson)]"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            {error}
          </div>
        )}

        {!loading && !error && monsters.length === 0 && (
          <div
            className="border border-[var(--color-border-strong)] p-12 text-center"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <ShieldIcon className="mx-auto mb-4 h-12 w-12 text-[var(--color-border-strong)]" />
            <h2
              className="text-xl text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              Nenhum monstro registrado
            </h2>
            <p className="mt-2 text-[var(--color-ink-muted)]">
              Crie a ficha de uma criatura para usar na mesa.
            </p>
            <RibbonButton
              className="mt-6"
              onClick={() => navigate("/monsters/new")}
            >
              Criar monstro
            </RibbonButton>
          </div>
        )}

        {!loading && !error && monsters.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {monsters.map((monster) => {
              const view = customMonsterToMonster(monster);
              return (
                <div
                  key={monster.id}
                  className="border border-[var(--color-border-strong)] text-left"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/monsters/${monster.id}`)}
                    className="w-full cursor-pointer p-5 text-left transition-colors hover:border-[var(--color-crimson)]"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      {monster.avatar ? (
                        <img
                          src={monster.avatar}
                          alt={monster.name}
                          className="h-12 w-12 shrink-0 rounded-full object-cover"
                          style={{
                            boxShadow: "0 0 0 2px #C09A5A",
                            backgroundColor: "#1A140F",
                          }}
                        />
                      ) : (
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs text-[var(--color-ink-inverse)]"
                          style={{
                            backgroundColor: "var(--color-crimson)",
                            fontFamily: "'Cinzel', serif",
                          }}
                        >
                          {monster.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h2
                          className="truncate text-xl text-[var(--color-ink)]"
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontWeight: 600,
                          }}
                        >
                          {monster.name}
                        </h2>
                        <p className="text-sm text-[var(--color-ink-muted)]">
                          {view.sizeLabel} · {view.type}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--color-ink)]">
                      CA {view.ac} · PV {view.hp}
                      {view.cr !== "—" ? ` · ND ${view.cr}` : ""}
                    </p>
                  </button>
                  <div
                    className="flex gap-2 border-t px-5 py-3"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/monsters/${monster.id}/edit`)
                      }
                      className="flex-1 border px-3 py-2 text-sm text-[var(--color-ink-muted)]"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-parchment)",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(monster)}
                      className="flex-1 border px-3 py-2 text-sm text-[var(--color-crimson)]"
                      style={{
                        borderColor: "var(--color-crimson)",
                        backgroundColor: "var(--color-parchment-soft)",
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
