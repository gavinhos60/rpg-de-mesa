import { useEffect, useMemo, useRef, useState } from "react";

export type DiceFxDie = {
  sides: number;
  value: number;
};

interface DiceRollOverlayProps {
  visible: boolean;
  label?: string;
  total?: number;
  /** Faces finais de cada dado (ex.: 5d10 → 5 valores). */
  dice?: DiceFxDie[];
  /** Face natural do d20 principal (crítico / falha). */
  natural?: number | null;
  onDone?: () => void;
}

type FlyingDie = DiceFxDie & {
  id: string;
  startX: number;
  endX: number;
  endY: number;
  spin: number;
  delayMs: number;
  durationMs: number;
  size: number;
};

const MAX_VISIBLE_DICE = 12;

function buildFlyingDice(dice: DiceFxDie[]): FlyingDie[] {
  const list = dice.slice(0, MAX_VISIBLE_DICE);
  const n = Math.max(1, list.length);
  return list.map((die, index) => {
    const lane = (index + 0.5) / n;
    const jitter = (Math.random() - 0.5) * 12;
    return {
      ...die,
      id: `die-${index}`,
      startX: 8 + Math.random() * 84,
      endX: Math.min(90, Math.max(10, lane * 80 + 10 + jitter)),
      endY: 42 + Math.random() * 22,
      spin: 540 + Math.floor(Math.random() * 540),
      delayMs: index * 90 + Math.floor(Math.random() * 40),
      durationMs: 1100 + Math.floor(Math.random() * 350),
      size: list.length >= 8 ? 48 : list.length >= 4 ? 56 : 72,
    };
  });
}

function dieTone(
  die: DiceFxDie,
  settled: boolean
): "crit" | "fumble" | null {
  if (!settled || die.sides !== 20) return null;
  if (die.value === 20) return "crit";
  if (die.value === 1) return "fumble";
  return null;
}

function dieColors(tone: "crit" | "fumble" | null) {
  if (tone === "crit") {
    return {
      bg: "#2F6B38",
      border: "#7AD48A",
      text: "#F3F8F0",
      glow: "0 0 18px rgba(63,143,74,0.55)",
    };
  }
  if (tone === "fumble") {
    return {
      bg: "#8F2E3A",
      border: "#E06A72",
      text: "#F8F0F0",
      glow: "0 0 18px rgba(196,74,85,0.55)",
    };
  }
  return {
    bg: "var(--color-parchment)",
    border: "var(--color-crimson)",
    text: "var(--color-crimson)",
    glow: "0 8px 18px rgba(0,0,0,0.35)",
  };
}

function FlyingDieView({
  die,
  face,
  settled,
}: {
  die: FlyingDie;
  face: number;
  settled: boolean;
}) {
  const tone = dieTone(die, settled);
  const colors = dieColors(tone);

  return (
    <div
      className="dice-fall-anim absolute will-change-transform"
      style={{
        width: die.size,
        height: die.size,
        // Variáveis só no wrapper da animação — não mudam a cada face.
        ["--sx" as string]: `${die.startX}vw`,
        ["--mx" as string]: `${(die.startX + die.endX) / 2}vw`,
        ["--ex" as string]: `${die.endX}vw`,
        ["--ey" as string]: `${die.endY}vh`,
        ["--spin" as string]: `${die.spin}deg`,
        animationDuration: `${die.durationMs}ms`,
        animationDelay: `${die.delayMs}ms`,
      }}
    >
      <div
        className="flex h-full w-full items-center justify-center border-2 font-bold shadow-lg"
        style={{
          fontSize: die.size >= 64 ? 28 : die.size >= 52 ? 22 : 18,
          fontFamily: "'Cinzel', serif",
          backgroundColor: colors.bg,
          borderColor: colors.border,
          color: colors.text,
          boxShadow: colors.glow,
          borderRadius: die.sides <= 4 ? 4 : die.sides >= 20 ? "18%" : "12%",
        }}
      >
        {face}
      </div>
      <span
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] tracking-wide opacity-80"
        style={{ fontFamily: "'Cinzel', serif", color: colors.text }}
      >
        d{die.sides}
      </span>
    </div>
  );
}

/** Animação de dados caindo e rolando pela tela. */
export function DiceRollOverlay({
  visible,
  label,
  total,
  dice,
  natural,
  onDone,
}: DiceRollOverlayProps) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const diceKey = useMemo(() => {
    if (dice && dice.length > 0) {
      return dice.map((d) => `${d.sides}:${d.value}`).join("|");
    }
    if (typeof natural === "number") return `20:${natural}`;
    if (typeof total === "number") return `t:${total}`;
    return "empty";
  }, [dice, natural, total]);

  const sourceDice = useMemo<DiceFxDie[]>(() => {
    if (dice && dice.length > 0) return dice;
    if (typeof natural === "number") return [{ sides: 20, value: natural }];
    if (typeof total === "number") {
      return [{ sides: 20, value: Math.max(1, Math.min(20, total)) }];
    }
    return [{ sides: 20, value: 1 }];
  }, [dice, natural, total]);

  const [flying, setFlying] = useState<FlyingDie[]>([]);
  const [faces, setFaces] = useState<number[]>([]);
  const [settled, setSettled] = useState(false);
  const runIdRef = useRef(0);

  useEffect(() => {
    if (!visible) {
      setFlying([]);
      setFaces([]);
      setSettled(false);
      return;
    }

    const runId = ++runIdRef.current;
    const next = buildFlyingDice(sourceDice);
    setFlying(next);
    setFaces(next.map((die) => 1 + Math.floor(Math.random() * die.sides)));
    setSettled(false);

    const tumble = window.setInterval(() => {
      if (runIdRef.current !== runId) return;
      setFaces((prev) =>
        prev.map((_, index) => {
          const sides = next[index]?.sides ?? 20;
          return 1 + Math.floor(Math.random() * sides);
        })
      );
    }, 70);

    const maxDuration =
      Math.max(...next.map((die) => die.delayMs + die.durationMs), 1200) + 80;

    const settleTimer = window.setTimeout(() => {
      if (runIdRef.current !== runId) return;
      window.clearInterval(tumble);
      setFaces(next.map((die) => die.value));
      setSettled(true);
    }, maxDuration);

    const doneTimer = window.setTimeout(() => {
      if (runIdRef.current !== runId) return;
      onDoneRef.current?.();
    }, maxDuration + 1100);

    return () => {
      window.clearInterval(tumble);
      window.clearTimeout(settleTimer);
      window.clearTimeout(doneTimer);
    };
    // Só reinicia quando a rolagem muda / fica visível — não a cada render do pai.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, diceKey]);

  if (!visible || flying.length === 0) return null;

  const anyCrit = settled && flying.some((die) => dieTone(die, true) === "crit");
  const anyFumble =
    settled && flying.some((die) => dieTone(die, true) === "fumble");

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: settled
            ? anyCrit
              ? "radial-gradient(ellipse at center, rgba(47,107,56,0.28), transparent 65%)"
              : anyFumble
                ? "radial-gradient(ellipse at center, rgba(143,46,58,0.32), transparent 65%)"
                : "radial-gradient(ellipse at center, rgba(0,0,0,0.2), transparent 70%)"
            : "radial-gradient(ellipse at center, rgba(0,0,0,0.18), transparent 70%)",
          transition: "background 0.35s ease",
        }}
      />

      {flying.map((die, index) => (
        <FlyingDieView
          key={die.id}
          die={die}
          face={faces[index] ?? die.value}
          settled={settled}
        />
      ))}

      <div
        className="absolute bottom-10 left-1/2 w-[min(92vw,28rem)] -translate-x-1/2 border-2 px-4 py-3 text-center shadow-xl"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: anyCrit
            ? "#5CB86A"
            : anyFumble
              ? "#E06A72"
              : "var(--color-border-strong)",
          animation: "dice-label-in 0.4s ease-out 0.55s both",
        }}
      >
        {label ? (
          <p
            className="text-sm text-[var(--color-ink)]"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
          >
            {label}
          </p>
        ) : null}
        {typeof total === "number" && (
          <p
            className="mt-1 text-2xl text-[var(--color-crimson)]"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
          >
            {total}
          </p>
        )}
        {flying.length > 1 && (
          <p className="mt-1 text-[11px] text-[var(--color-ink-soft)]">
            {flying.length} dados
            {sourceDice.length > MAX_VISIBLE_DICE
              ? ` (mostrando ${MAX_VISIBLE_DICE})`
              : ""}
          </p>
        )}
        {anyCrit && (
          <p
            className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5CB86A]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Crítico
          </p>
        )}
        {anyFumble && !anyCrit && (
          <p
            className="mt-1 text-xs uppercase tracking-[0.16em] text-[#E06A72]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Falha crítica
          </p>
        )}
      </div>

      <style>{`
        .dice-fall-anim {
          animation-name: dice-fall-roll;
          animation-timing-function: cubic-bezier(0.22, 0.82, 0.28, 1);
          animation-fill-mode: both;
        }
        @keyframes dice-fall-roll {
          0% {
            transform: translate(var(--sx), -18vh) rotate(0deg) scale(0.7);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          55% {
            transform: translate(var(--mx), calc(var(--ey) + 8vh))
              rotate(calc(var(--spin) * 0.75)) scale(1.05);
          }
          72% {
            transform: translate(var(--ex), calc(var(--ey) - 4vh))
              rotate(calc(var(--spin) * 0.9)) scale(0.96);
          }
          84% {
            transform: translate(var(--ex), calc(var(--ey) + 2vh))
              rotate(calc(var(--spin) * 0.97)) scale(1.02);
          }
          100% {
            transform: translate(var(--ex), var(--ey)) rotate(var(--spin))
              scale(1);
            opacity: 1;
          }
        }
        @keyframes dice-label-in {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

/** Monta a lista de dados visuais a partir de uma rolagem do chat. */
export function diceFromChatRoll(roll: {
  formula: string;
  rolls: number[];
  parts?: Array<{ formula: string; rolls: number[] }>;
}): DiceFxDie[] {
  const parts =
    roll.parts && roll.parts.length > 0
      ? roll.parts
      : [{ formula: roll.formula, rolls: roll.rolls }];

  const out: DiceFxDie[] = [];
  for (const part of parts) {
    const match = part.formula.match(/d(\d+)/i);
    const sides = match ? Number(match[1]) : 20;
    for (const value of part.rolls) {
      if (!Number.isFinite(value)) continue;
      out.push({
        sides: Number.isFinite(sides) && sides >= 2 ? sides : 20,
        value: Math.max(1, Math.round(value)),
      });
    }
  }
  return out;
}
