import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCampaigns,
  type Campaign,
} from "../services/campaign.service";

import { CreateCampaignModal } from "../components/CreateCampaignModal";

export function Campaigns() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] =
    useState<Campaign[]>([]);

  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] =
    useState(false);

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
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Campanhas
          </h1>

          <p className="text-slate-400 mt-2">
            Gerencie suas campanhas de RPG.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Nova campanha
        </button>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <div className="text-slate-400">
          Carregando campanhas...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
          <div className="text-4xl mb-4">
            ⚔️
          </div>

          <h2 className="text-xl font-semibold text-white">
            Nenhuma campanha
          </h2>

          <p className="text-slate-400 mt-2">
            Crie sua primeira campanha para começar.
          </p>

          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
          >
            Criar campanha
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() =>
                navigate(`/campaigns/${campaign.id}`)
              }
              className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-indigo-600/20 flex items-center justify-center text-2xl">
                  ⚔️
                </div>

                <span className="text-xs text-slate-500">
                  #{campaign.id}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-white mt-5">
                {campaign.name}
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                {campaign.characters.length}{" "}
                personagem
                {campaign.characters.length !== 1
                  ? "s"
                  : ""}
              </p>

              <div className="mt-5 pt-4 border-t border-slate-800">
                <span className="text-sm text-indigo-400 group-hover:text-indigo-300">
                  Abrir campanha →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onCreated={loadCampaigns}
        />
      )}
    </div>
  );
}