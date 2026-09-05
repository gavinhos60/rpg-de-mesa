import { useEffect, useState } from "react";
import { api } from "../services/api";

interface HealthResponse {
  status: string;
  message: string;
}

export function Home() {
  const [apiStatus, setApiStatus] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function checkApi() {
      try {
        const response = await api.get<HealthResponse>("/health");

        setApiStatus(response.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    checkApi();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">
          ⚔️ RPG Hub
        </h1>

        <p className="text-slate-400 mb-8">
          Plataforma de RPG de mesa
        </p>

        {loading && (
          <p className="text-yellow-400">
            Conectando com a API...
          </p>
        )}

        {!loading && apiStatus && (
          <div className="rounded-lg border border-green-700 bg-green-950/30 p-6">
            <p className="text-green-400 text-xl">
              🟢 API conectada
            </p>

            <p className="text-slate-300 mt-2">
              {apiStatus.message}
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-700 bg-red-950/30 p-6">
            <p className="text-red-400 text-xl">
              🔴 API offline
            </p>

            <p className="text-slate-300 mt-2">
              Não foi possível conectar ao backend.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}