import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import {
    EmblemIcon,
    KeyIcon,
    BrokenSealIcon,
    RibbonButton,
} from "../components/icons/MedievalIcons";

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(email, password);

            navigate("/dashboard");
        } catch {
            setError("Email ou senha inválidos");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                backgroundColor: "#150E09",
                backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(184,147,78,0.035) 0px, rgba(184,147,78,0.035) 1px, transparent 1px, transparent 5px)",
            }}
        >
            <div className="w-full max-w-md">
                {/* Capa do grimório */}
                <div
                    className="border-2 p-8"
                    style={{ backgroundColor: "#DCCBA0", borderColor: "#4A2F18" }}
                >
                    <div className="text-center mb-8">
                        <EmblemIcon className="w-10 h-10 mx-auto mb-3 text-[#6B4423]" />

                        <h1
                            className="text-3xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            SUA MESA!
                        </h1>

                        <p className="text-[#5C4A38] mt-2">
                            Faça Login
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm text-[#5C4A38] mb-2"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="w-full border px-4 py-3 text-[#2A1D14] outline-none focus:border-[#7A2530] transition-colors"
                                style={{ backgroundColor: "#EBDFC4", borderColor: "#A67C3D" }}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm text-[#5C4A38] mb-2"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                Senha
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full border px-4 py-3 pr-11 text-[#2A1D14] outline-none focus:border-[#7A2530] transition-colors"
                                    style={{ backgroundColor: "#EBDFC4", borderColor: "#A67C3D" }}
                                />
                                <KeyIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#A67C3D]" />
                            </div>
                        </div>

                        {error && (
                            <div
                                className="flex items-center gap-3 border px-4 py-3 text-sm"
                                style={{ backgroundColor: "#E8D4C4", borderColor: "#7A2530", color: "#5C1D26" }}
                            >
                                <BrokenSealIcon className="w-8 h-8 shrink-0" color="#7A2530" />
                                {error}
                            </div>
                        )}

                        <RibbonButton
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </RibbonButton>
                    </form>
                </div>
            </div>
        </div>
    );
}