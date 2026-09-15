import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import {
    EmblemIcon,
    KeyIcon,
    BrokenSealIcon,
    RibbonButton,
} from "../components/icons/MedievalIcons";
import { ThemeToggle } from "../components/ThemeToggle";

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
        "w-full border px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-crimson)] transition-colors";
    const fieldStyle = { backgroundColor: "var(--color-parchment)", borderColor: "var(--color-border)" };
    const labelStyle = { fontFamily: "'Cinzel', serif" } as const;

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                backgroundColor: "var(--color-shell-deep)",
                backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(184,147,78,0.035) 0px, rgba(184,147,78,0.035) 1px, transparent 1px, transparent 5px)",
            }}
        >
            <div className="absolute right-4 top-4">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-md">
                <div
                    className="border-2 p-8"
                    style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-wood)" }}
                >
                    <div className="text-center mb-6">
                        <EmblemIcon className="w-10 h-10 mx-auto mb-3 text-[var(--color-border-strong)]" />

                        <h1
                            className="text-3xl text-[var(--color-ink)]"
                            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                        >
                            SUA MESA!
                        </h1>

                        <p className="text-[var(--color-ink-muted)] mt-2">
                            {tab === "login"
                                ? "Entre para continuar sua jornada"
                                : "Crie sua conta de aventureiro"}
                        </p>
                    </div>

                    <div
                        className="mb-6 grid grid-cols-2 border"
                        style={{ borderColor: "var(--color-border-strong)" }}
                    >
                        <button
                            type="button"
                            onClick={() => switchTab("login")}
                            className="px-4 py-3 text-sm transition-colors"
                            style={{
                                fontFamily: "'Cinzel', serif",
                                backgroundColor: tab === "login" ? "var(--color-crimson)" : "transparent",
                                color: tab === "login" ? "var(--color-ink-inverse)" : "var(--color-ink-muted)",
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
                                backgroundColor: tab === "register" ? "var(--color-crimson)" : "transparent",
                                color: tab === "register" ? "var(--color-ink-inverse)" : "var(--color-ink-muted)",
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
                                    className="block text-sm text-[var(--color-ink-muted)] mb-2"
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
                                className="block text-sm text-[var(--color-ink-muted)] mb-2"
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
                                className="block text-sm text-[var(--color-ink-muted)] mb-2"
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
                                <KeyIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-border)]" />
                            </div>
                        </div>

                        {tab === "register" && (
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-sm text-[var(--color-ink-muted)] mb-2"
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
                                    backgroundColor: "var(--color-parchment-soft)",
                                    borderColor: "var(--color-crimson)",
                                    color: "var(--color-crimson-deep)",
                                }}
                            >
                                <BrokenSealIcon className="w-8 h-8 shrink-0" color="var(--color-crimson)" />
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
