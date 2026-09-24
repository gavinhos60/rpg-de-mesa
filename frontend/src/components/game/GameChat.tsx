import { useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatRollPart } from "../../types/game";

interface GameChatProps {
  messages: ChatMessage[];
  onSend: (text: string) => Promise<void> | void;
  compact?: boolean;
}

function formatRollBreakdown(part: ChatRollPart): string {
  const rollsText =
    part.rolls.length === 1
      ? String(part.rolls[0])
      : `[${part.rolls.join(", ")}]`;
  const modText =
    part.modifier > 0
      ? ` + ${part.modifier}`
      : part.modifier < 0
        ? ` − ${Math.abs(part.modifier)}`
        : "";
  return `${part.formula}: ${rollsText}${modText} = ${part.total}`;
}

/** Resultado natural de um d20 (considera vantagem 2d20kh1). */
export function naturalD20(part: {
  formula: string;
  rolls: number[];
}): number | null {
  if (!/d20/i.test(part.formula) || part.rolls.length === 0) return null;
  if (part.rolls.length >= 2 || /kh1|2d20/i.test(part.formula)) {
    return Math.max(...part.rolls);
  }
  return part.rolls[0] ?? null;
}

function rollCritTone(part: ChatRollPart): "crit" | "fumble" | null {
  const nat = naturalD20(part);
  if (nat === 20) return "crit";
  if (nat === 1) return "fumble";
  return null;
}

function RollTotalBadge({ part }: { part: ChatRollPart }) {
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const tone = rollCritTone(part);

  function showTip(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    setTip({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }

  const badgeStyle: React.CSSProperties =
    tone === "crit"
      ? {
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          background: "linear-gradient(160deg, #3F8F4A 0%, #2F6B38 55%, #1A3F20 100%)",
          borderColor: "#5CB86A",
          color: "#F3F8F0",
          boxShadow:
            "inset 0 1px 0 rgba(243,230,196,0.2), 0 0 12px rgba(63,143,74,0.45)",
        }
      : tone === "fumble"
        ? {
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            background: "linear-gradient(160deg, #C44A55 0%, #8F2E3A 55%, #4A1218 100%)",
            borderColor: "#E06A72",
            color: "#F8F0F0",
            boxShadow:
              "inset 0 1px 0 rgba(243,230,196,0.2), 0 0 12px rgba(196,74,85,0.5)",
          }
        : {
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            background:
              "linear-gradient(160deg, var(--color-crimson) 0%, var(--color-crimson-deep) 55%, #3F1410 100%)",
            borderColor: "var(--color-border)",
            color: "var(--color-ink-inverse)",
            boxShadow:
              "inset 0 1px 0 rgba(243,230,196,0.25), 0 2px 4px rgba(26,20,15,0.35)",
          };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={(event) => showTip(event.currentTarget)}
      onMouseLeave={() => setTip(null)}
      onFocus={(event) => showTip(event.currentTarget)}
      onBlur={() => setTip(null)}
    >
      <span
        className="inline-flex min-w-[2.75rem] cursor-help items-center justify-center border-2 px-3 py-1 text-lg tracking-wide shadow"
        style={badgeStyle}
        tabIndex={0}
        title={
          tone === "crit"
            ? "Crítico (20)"
            : tone === "fumble"
              ? "Falha crítica (1)"
              : undefined
        }
      >
        {part.total}
      </span>
      {tip && (
        <span
          role="tooltip"
          className="pointer-events-none fixed z-[80] w-max max-w-[16rem] -translate-x-1/2 -translate-y-full px-3 py-2 text-left"
          style={{
            left: tip.x,
            top: tip.y - 10,
            backgroundColor: "#1A140F",
            border: "2px solid var(--color-border)",
            boxShadow:
              "0 0 0 1px var(--color-border-subtle), 0 8px 20px rgba(0,0,0,0.45), inset 0 0 24px rgba(192,154,90,0.12)",
          }}
        >
          <span
            className="mb-1 block text-[10px] uppercase tracking-[0.14em] text-[var(--color-border)]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {part.label || "Conta"}
          </span>
          <span
            className="block whitespace-pre-wrap text-sm text-[var(--color-ink-inverse)]"
            style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
          >
            {formatRollBreakdown(part)}
          </span>
          <span
            className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[7px] border-x-transparent"
            style={{ borderTopColor: "var(--color-border)" }}
          />
        </span>
      )}
    </span>
  );
}

function RollMessageBody({ message }: { message: ChatMessage }) {
  const roll = message.roll;
  if (!roll) {
    return (
      <p
        className="whitespace-pre-wrap text-[var(--color-crimson)]"
        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
      >
        {message.text}
      </p>
    );
  }

  const parts =
    roll.parts && roll.parts.length > 0
      ? roll.parts
      : [
          {
            label: roll.label,
            formula: roll.formula,
            rolls: roll.rolls,
            modifier: roll.modifier,
            total: roll.total,
          },
        ];

  return (
    <div className="space-y-2">
      {message.text && (
        <p
          className="whitespace-pre-wrap text-[var(--color-ink)]"
          style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
        >
          {message.text}
        </p>
      )}
      <div className="flex flex-wrap items-end gap-3">
        {parts.map((part, index) => (
          <div key={`${part.label || part.formula}-${index}`} className="flex flex-col items-center gap-1">
            {part.label && (
              <span
                className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-soft)]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {part.label}
              </span>
            )}
            <RollTotalBadge part={part} />
          </div>
        ))}
      </div>
      <p className="text-[10px] italic text-[var(--color-ink-soft)]">
        Passe o mouse no valor para ver a conta
      </p>
    </div>
  );
}

export function GameChat({ messages, onSend, compact = false }: GameChatProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const raw = sessionStorage.getItem("rpg-chat-input-history");
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string").slice(-80)
        : [];
    } catch {
      return [];
    }
  });
  /** -1 = rascunho atual; 0 = último enviado; 1 = anterior… */
  const [historyIndex, setHistoryIndex] = useState(-1);
  const draftRef = useRef("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function focusInput() {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  useEffect(() => {
    try {
      sessionStorage.setItem(
        "rpg-chat-input-history",
        JSON.stringify(history.slice(-80))
      );
    } catch {
      /* ignore quota */
    }
  }, [history]);

  function rememberSent(value: string) {
    setHistory((prev) => {
      if (prev[prev.length - 1] === value) return prev;
      return [...prev, value].slice(-80);
    });
    setHistoryIndex(-1);
    draftRef.current = "";
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    if (history.length === 0) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyIndex < 0) {
        draftRef.current = text;
      }
      const nextIndex = Math.min(
        historyIndex < 0 ? 0 : historyIndex + 1,
        history.length - 1
      );
      setHistoryIndex(nextIndex);
      setText(history[history.length - 1 - nextIndex] ?? "");
      return;
    }

    if (historyIndex < 0) return;
    event.preventDefault();
    const nextIndex = historyIndex - 1;
    if (nextIndex < 0) {
      setHistoryIndex(-1);
      setText(draftRef.current);
      return;
    }
    setHistoryIndex(nextIndex);
    setText(history[history.length - 1 - nextIndex] ?? "");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = text.trim();
    if (!value || sending) return;
    try {
      setSending(true);
      await onSend(value);
      rememberSent(value);
      setText("");
    } finally {
      setSending(false);
      focusInput();
    }
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col border"
      style={{ borderColor: "var(--color-border-strong)", backgroundColor: "var(--color-surface)" }}
    >
      <div
        className={[
          "border-b text-[var(--color-ink)]",
          compact ? "px-2 py-1.5 text-xs" : "px-4 py-3 text-sm",
        ].join(" ")}
        style={{ borderColor: "var(--color-border)", fontFamily: "'Cinzel', serif", fontWeight: 600 }}
      >
        Chat & Dados
      </div>

      <div
        className={[
          "flex-1 overflow-y-auto",
          compact ? "space-y-1 px-2 py-1.5" : "space-y-2 px-3 py-3",
        ].join(" ")}
      >
        {messages.length === 0 && (
          <p className="text-sm italic text-[var(--color-ink-soft)]">
            Digite uma mensagem ou use /R 1d20+5
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className="border px-3 py-2 text-sm"
            style={{
              backgroundColor:
                message.type === "roll"
                  ? "var(--color-parchment)"
                  : message.type === "system"
                    ? "var(--color-parchment-soft)"
                    : "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="mb-1 flex items-center justify-between gap-2 text-[11px] text-[var(--color-ink-soft)]">
              <span>{message.userName}</span>
              <span>{new Date(message.at).toLocaleTimeString()}</span>
            </div>
            {message.type === "roll" ? (
              <RollMessageBody message={message} />
            ) : (
              <p className="whitespace-pre-wrap text-[var(--color-ink)]">{message.text}</p>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className={compact ? "border-t p-1.5" : "border-t p-3"}
        style={{ borderColor: "var(--color-border)" }}
      >
        <input
          ref={inputRef}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (historyIndex >= 0) {
              setHistoryIndex(-1);
              draftRef.current = event.target.value;
            }
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Mensagem ou /R 1d20+9 · ↑ histórico"
          className={[
            "w-full border text-[var(--color-ink)] outline-none focus:border-[var(--color-crimson)]",
            compact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm",
          ].join(" ")}
          style={{ backgroundColor: "var(--color-parchment)", borderColor: "var(--color-border)" }}
          autoComplete="off"
        />
      </form>
    </div>
  );
}
