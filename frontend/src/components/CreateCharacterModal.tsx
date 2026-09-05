import { useState } from "react";
import {
  createCharacter,
} from "../services/campaign.service";

interface CreateCharacterModalProps {
  campaignId: number;
  playerId: number;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateCharacterModal({
  campaignId,
  playerId,
  onClose,
  onCreated,
}: CreateCharacterModalProps) {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [race, setRace] = useState("");
  const [level, setLevel] = useState(1);
  const [avatar, setAvatar] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Informe o nome do personagem.");
      return;
    }

    if (!className.trim()) {
      setError("Informe a classe.");
      return;
    }

    if (!race.trim()) {
      setError("Informe a raça.");
      return;
    }

    if (level < 1) {
      setError("O nível deve ser maior que zero.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createCharacter({
        name: name.trim(),
        className: className.trim(),
        race: race.trim(),
        level,
        avatar: avatar.trim() || undefined,
        playerId,
        campaignId,
      });

      onCreated();
      onClose();
    } catch (error) {
      console.error(error);

      setError(
        "Não foi possível criar o personagem."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Novo personagem
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Crie um personagem para esta campanha.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="character-name"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Nome
            </label>

            <input
              id="character-name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Ex.: Arannis"
              autoFocus
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="character-class"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Classe
              </label>

              <input
                id="character-class"
                value={className}
                onChange={(event) =>
                  setClassName(event.target.value)
                }
                placeholder="Ex.: Guerreiro"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="character-race"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Raça
              </label>

              <input
                id="character-race"
                value={race}
                onChange={(event) =>
                  setRace(event.target.value)
                }
                placeholder="Ex.: Humano"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="character-level"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Nível
            </label>

            <input
              id="character-level"
              type="number"
              min={1}
              value={level}
              onChange={(event) =>
                setLevel(Number(event.target.value))
              }
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="character-avatar"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              URL do avatar
            </label>

            <input
              id="character-avatar"
              type="url"
              value={avatar}
              onChange={(event) =>
                setAvatar(event.target.value)
              }
              placeholder="https://..."
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-950 border border-red-800 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-slate-300 hover:bg-slate-800 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 font-medium disabled:opacity-50 transition"
            >
              {loading
                ? "Criando..."
                : "Criar personagem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}