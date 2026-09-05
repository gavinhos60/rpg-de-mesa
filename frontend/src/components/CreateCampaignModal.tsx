import { useState } from "react";
import { createCampaign } from "../services/campaign.service";

interface CreateCampaignModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateCampaignModal({
  onClose,
  onCreated,
}: CreateCampaignModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Informe o nome da campanha.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createCampaign(name.trim());

      onCreated();
      onClose();
    } catch (error) {
      console.error(error);
      setError("Não foi possível criar a campanha.");
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
              Nova campanha
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Crie uma nova aventura.
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

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="campaign-name"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Nome da campanha
          </label>

          <input
            id="campaign-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Ex.: As Minas de Phandelver"
            autoFocus
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          {error && (
            <p className="mt-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-6">
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
              className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? "Criando..." : "Criar campanha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}