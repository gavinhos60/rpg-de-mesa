import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import {
    EmblemIcon,
    KeyIcon,
    BrokenSealIcon,
    RibbonButton,
} from "../components/icons/MedievalIcons";

type AuthTab = "login" | "register";

export function Login() {
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const [tab, setTab] = useState<AuthTab>("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function switchTab(next: AuthTab) {
        setTab(next);
        setError("");
        setPassword("");
        setConfirmPassword("");
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            if (tab === "login") {
                await login(email, password);
            } else {
                if (!name.trim()) {
                    setError("Informe seu nome.");
                    return;
                }
                if (password.length < 6) {
                    setError("A senha deve ter pelo menos 6 caracteres.");
                    return;
                }
                if (password !== confirmPassword) {
                    setError("As senhas não coincidem.");
                    return;
                }

                await register(name.trim(), email, password);
            }

            navigate("/dashboard");
        } catch (err: unknown) {
            const status =
                err &&
                typeof err === "object" &&
                "response" in err
                    ? (err as { response?: { status?: number } }).response
                          ?.status
                    : undefined;

            if (tab === "register" && status === 409) {
                setError("Este email já está cadastrado.");
            } else if (tab === "login") {
                setError("Email ou senha inválidos");
            } else {
                setError("Não foi possível criar a conta. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    }

    const fieldClass =
        "w-full border px-4 py-3 text-[#2A1D14] outline-none focus:border-[#7A2530] transition-colors";
    const fieldStyle = { backgroundColor: "#EBDFC4", borderColor: "#A67C3D" };
    const labelStyle = { fontFamily: "'Cinzel', serif" } as const;

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
                <div
                    className="border-2 p-8"
                    style={{ backgroundColor: "#DCCBA0", borderColor: "#4A2F18" }}
                >
                    <div className="text-center mb-6">
                        <EmblemIcon className="w-10 h-10 mx-auto mb-3 text-[#6B4423]" />

                        <h1
                            className="text-3xl text-[#2A1D14]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            SUA MESA!
                        </h1>

                        <p className="text-[#5C4A38] mt-2">
                            {tab === "login"
                                ? "Entre para continuar sua jornada"
                                : "Crie sua conta de aventureiro"}
                        </p>
                    </div>

                    <div
                        className="mb-6 grid grid-cols-2 border"
                        style={{ borderColor: "#6B4423" }}
                    >
                        <button
                            type="button"
                            onClick={() => switchTab("login")}
                            className="px-4 py-3 text-sm transition-colors"
                            style={{
                                fontFamily: "'Cinzel', serif",
                                backgroundColor: tab === "login" ? "#7A2530" : "transparent",
                                color: tab === "login" ? "#F3E6C4" : "#5C4A38",
                            }}
                        >
                            Entrar
                        </button>
                        <button
                            type="button"
                            onClick={() => switchTab("register")}
                            className="px-4 py-3 text-sm transition-colors"
                            style={{
                                fontFamily: "'Cinzel', serif",
                                backgroundColor: tab === "register" ? "#7A2530" : "transparent",
                                color: tab === "register" ? "#F3E6C4" : "#5C4A38",
                            }}
                        >
                            Cadastrar
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {tab === "register" && (
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm text-[#5C4A38] mb-2"
                                    style={labelStyle}
                                >
                                    Nome
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Seu nome"
                                    required
                                    className={fieldClass}
                                    style={fieldStyle}
                                />
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm text-[#5C4A38] mb-2"
                                style={labelStyle}
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
                                className={fieldClass}
                                style={fieldStyle}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm text-[#5C4A38] mb-2"
                                style={labelStyle}
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
                                    minLength={tab === "register" ? 6 : undefined}
                                    className={`${fieldClass} pr-11`}
                                    style={fieldStyle}
                                />
                                <KeyIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#A67C3D]" />
                            </div>
                        </div>

                        {tab === "register" && (
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-sm text-[#5C4A38] mb-2"
                                    style={labelStyle}
                                >
                                    Confirmar senha
                                </label>

                                <input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className={fieldClass}
                                    style={fieldStyle}
                                />
                            </div>
                        )}

                        {error && (
                            <div
                                className="flex items-center gap-3 border px-4 py-3 text-sm"
                                style={{
                                    backgroundColor: "#E8D4C4",
                                    borderColor: "#7A2530",
                                    color: "#5C1D26",
                                }}
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
                            {loading
                                ? tab === "login"
                                    ? "Entrando..."
                                    : "Cadastrando..."
                                : tab === "login"
                                  ? "Entrar"
                                  : "Criar conta"}
                        </RibbonButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
