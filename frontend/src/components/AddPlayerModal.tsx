import { useState } from "react";

import { addPlayerByEmail } from "../services/campaign.service";

interface AddPlayerModalProps {
  campaignId: number;
  onClose: () => void;
  onAdded: () => void;
}

export function AddPlayerModal({
  campaignId,
  onClose,
  onAdded,
}: AddPlayerModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Informe o email do jogador.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await addPlayerByEmail(
        campaignId,
        email.trim()
      );

      onAdded();
      onClose();
    } catch (error: any) {
      console.error(error);

      if (error?.response?.status === 404) {
        setError("Usuário não encontrado.");
      } else if (
        error?.response?.status === 409
      ) {
        setError(
          "Este usuário já faz parte da campanha."
        );
      } else {
        setError(
          "Não foi possível adicionar o jogador."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Adicionar jogador
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Informe o email de um usuário cadastrado.
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
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="player-email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email do jogador
            </label>

            <input
              id="player-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="jogador@email.com"
              autoFocus
              required
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-950 border border-red-800 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
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
                ? "Adicionando..."
                : "Adicionar jogador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}