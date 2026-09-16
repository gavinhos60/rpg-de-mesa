import { useEffect, useState } from "react";
import { api } from "../services/api";

import {
    CrowMark,
    WaxSealIcon,
    BrokenSealIcon,
    QuillIcon,
} from "../components/icons/MedievalIcons";
import { KenkuAtmosphere } from "../components/KenkuAtmosphere";

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
        <main className="kenku-shell relative flex min-h-screen items-end justify-start px-6 pb-16 pt-24 sm:px-12 sm:pb-20">
            <KenkuAtmosphere density="normal" showArt artFocus="right" />
            <div className="relative z-10 max-w-xl">
                <CrowMark className="mb-6 h-12 w-12 text-[var(--color-crow-soft)]" />

                <h1
                    className="text-5xl text-[var(--color-ink-inverse)] sm:text-6xl"
                    style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                >
                    SUA MESA!
                </h1>

                <p className="mt-4 max-w-md text-lg italic text-[var(--color-crow-soft)]">
                    Ecoando histórias no ninho kenku.
                </p>

                <div className="mt-10 border-t border-[var(--color-border-wood)]/60 pt-8">
                    {loading && (
                        <div className="flex items-center gap-3 text-[var(--color-crow-soft)]">
                            <QuillIcon className="h-5 w-5 animate-pulse" />
                            <span className="italic">Consultando os arquivos do reino...</span>
                        </div>
                    )}

                    {!loading && apiStatus && (
                        <div
                            className="inline-flex flex-col border px-6 py-5"
                            style={{
                                backgroundColor:
                                    "color-mix(in srgb, var(--color-surface) 92%, transparent)",
                                borderColor: "var(--color-border-strong)",
                                color: "var(--color-ink)",
                            }}
                        >
                            <WaxSealIcon className="h-9 w-9" label="✓" />
                            <p
                                className="mt-3 text-lg"
                                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                            >
                                Arquivos conectados
                            </p>
                            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                                {apiStatus.message}
                            </p>
                        </div>
                    )}

                    {!loading && error && (
                        <div
                            className="inline-flex flex-col border px-6 py-5"
                            style={{
                                backgroundColor:
                                    "color-mix(in srgb, var(--color-surface) 92%, transparent)",
                                borderColor: "var(--color-border-strong)",
                                color: "var(--color-ink)",
                            }}
                        >
                            <BrokenSealIcon className="h-9 w-9" color="var(--color-crimson)" />
                            <p
                                className="mt-3 text-lg"
                                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                            >
                                O selo foi rompido
                            </p>
                            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                                Não foi possível conectar ao backend.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}