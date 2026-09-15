import { useEffect, useState } from "react";
import { api } from "../services/api";

import {
    EmblemIcon,
    WaxSealIcon,
    BrokenSealIcon,
    QuillIcon,
} from "../components/icons/MedievalIcons";

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
        <main
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                backgroundColor: "var(--color-shell-deep)",
                backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(184,147,78,0.035) 0px, rgba(184,147,78,0.035) 1px, transparent 1px, transparent 5px)",
                color: "var(--color-ink-inverse)",
            }}
        >
            <div className="text-center max-w-lg">
                <EmblemIcon className="w-14 h-14 mx-auto mb-5 text-[#B8934E]" />

                <h1
                    className="text-5xl"
                    style={{ fontFamily: "'Cinzel', serif", fontWeight: 600, color: "var(--color-ink-inverse)" }}
                >
                    RPG Hub
                </h1>

                <p className="text-[#B8A98A] italic mt-4">
                    Plataforma de RPG de mesa
                </p>

                <div className="mt-10 border-t border-[var(--color-border-wood)] pt-8">
                    {loading && (
                        <div className="flex items-center justify-center gap-3 text-[#B8934E]">
                            <QuillIcon className="w-5 h-5 animate-pulse" />
                            <span className="italic">Consultando os arquivos do reino...</span>
                        </div>
                    )}

                    {!loading && apiStatus && (
                        <div
                            className="inline-flex flex-col items-center border border-[var(--color-border-strong)] px-8 py-6"
                            style={{ backgroundColor: "var(--color-surface)", color: "var(--color-ink)" }}
                        >
                            <WaxSealIcon className="w-10 h-10" label="✓" />

                            <p
                                className="mt-3 text-lg"
                                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                            >
                                Arquivos conectados
                            </p>

                            <p className="text-[var(--color-ink-muted)] mt-1 text-sm">
                                {apiStatus.message}
                            </p>
                        </div>
                    )}

                    {!loading && error && (
                        <div
                            className="inline-flex flex-col items-center border border-[var(--color-border-strong)] px-8 py-6"
                            style={{ backgroundColor: "var(--color-surface)", color: "var(--color-ink)" }}
                        >
                            <BrokenSealIcon className="w-10 h-10" color="var(--color-crimson)" />

                            <p
                                className="mt-3 text-lg"
                                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                            >
                                O selo foi rompido
                            </p>

                            <p className="text-[var(--color-ink-muted)] mt-1 text-sm">
                                Não foi possível conectar ao backend.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}