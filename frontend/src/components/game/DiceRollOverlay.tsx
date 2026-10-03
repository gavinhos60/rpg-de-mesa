import { useEffect, useMemo, useRef, useState } from "react";
import DiceBox from "@3d-dice/dice-box";
import "@3d-dice/dice-box/dist/style.css";

export type DiceFxDie = {
  sides: number;
  value: number;
};

interface DiceRollOverlayProps {
  visible: boolean;
  label?: string;
  total?: number;
  dice?: DiceFxDie[];
  natural?: number | null;
  onDone?: () => void;
}

const DICE_HOST_ID = "rpg-dice-box-host";
const MAX_VISIBLE_DICE = 12;
const ASSET_PATH = `${import.meta.env.BASE_URL}assets/`;

function clearDiceHost() {
  const host = document.getElementById(DICE_HOST_ID);
  host?.querySelectorAll("canvas").forEach((node) => node.remove());
}

/** DiceBox só redimensiona no evento resize — força layout após show/init. */
function bumpDiceBoxLayout() {
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });
}

function buildRollNotation(dice: DiceFxDie[]): string {
  const limited = dice.slice(0, MAX_VISIBLE_DICE);
  const bySide = new Map<number, number>();
  for (const die of limited) {
    const sides = die.sides >= 2 ? die.sides : 20;
    bySide.set(sides, (bySide.get(sides) ?? 0) + 1);
  }
  const parts = [...bySide.entries()].map(([sides, qty]) => `${qty}d${sides}`);
  return parts.length > 0 ? parts.join("+") : "1d20";
}

function critTone(
  dice: DiceFxDie[],
  natural?: number | null
): "crit" | "fumble" | null {
  if (typeof natural === "number") {
    if (natural === 20) return "crit";
    if (natural === 1) return "fumble";
  }
  for (const die of dice) {
    if (die.sides === 20) {
      if (die.value === 20) return "crit";
      if (die.value === 1) return "fumble";
    }
  }
  return null;
}

/** Dados 3D (estilo Roll20 / Fantastic Dice) + resultado da rolagem do chat. */
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

  const boxRef = useRef<DiceBox | null>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);
  const initOkRef = useRef(false);
  const initStartedRef = useRef(false);
  const runIdRef = useRef(0);
  const doneTimerRef = useRef<number | null>(null);

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

  const [settled, setSettled] = useState(false);
  const [useFallbackFx, setUseFallbackFx] = useState(false);

  function scheduleDone(ms: number) {
    if (doneTimerRef.current != null) {
      window.clearTimeout(doneTimerRef.current);
    }
    doneTimerRef.current = window.setTimeout(() => {
      doneTimerRef.current = null;
      onDoneRef.current?.();
    }, ms);
  }

  useEffect(() => {
    if (!visible || initStartedRef.current) return;
    initStartedRef.current = true;

    let cancelled = false;
    clearDiceHost();

    const box = new DiceBox({
      container: `#${DICE_HOST_ID}`,
      assetPath: ASSET_PATH,
      theme: "default",
      themeColor: "#7A2530",
      sounds: false,
      soundVolume: 0,
      onRollComplete: () => {
        if (cancelled) return;
        setSettled(true);
        scheduleDone(1200);
      },
    });

    boxRef.current = box;
    initPromiseRef.current = box
      .init()
      .then(() => {
        if (cancelled) return;
        initOkRef.current = true;
        box.show();
        bumpDiceBoxLayout();
      })
      .catch((err) => {
        console.error("DiceBox init failed:", err);
        if (cancelled) return;
        initOkRef.current = false;
        setUseFallbackFx(true);
      });

    return () => {
      cancelled = true;
      initStartedRef.current = false;
      initOkRef.current = false;
      if (doneTimerRef.current != null) {
        window.clearTimeout(doneTimerRef.current);
      }
      try {
        box.clear();
        box.hide();
      } catch {
        /* ignore teardown */
      }
      clearDiceHost();
      boxRef.current = null;
      initPromiseRef.current = null;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setSettled(false);
      setUseFallbackFx(false);
      boxRef.current?.clear();
      boxRef.current?.hide();
      if (doneTimerRef.current != null) {
        window.clearTimeout(doneTimerRef.current);
        doneTimerRef.current = null;
      }
      return;
    }

    const runId = ++runIdRef.current;
    setSettled(false);

    void (async () => {
      try {
        await initPromiseRef.current;
        if (runIdRef.current !== runId) return;

        const box = boxRef.current;
        if (!box || !initOkRef.current) {
          setUseFallbackFx(true);
          scheduleDone(2200);
          return;
        }

        box.show();
        bumpDiceBoxLayout();
        await box.roll(buildRollNotation(sourceDice));
        bumpDiceBoxLayout();
      } catch (err) {
        console.error("DiceBox roll failed:", err);
        setUseFallbackFx(true);
        setSettled(true);
        scheduleDone(1800);
      }
    })();
  }, [visible, diceKey]);

  const tone = settled ? critTone(sourceDice, natural) : null;

  return (
    <>
      {/* Host sempre no DOM — DiceBox exige seletor CSS e init na montagem. */}
      <div
        id={DICE_HOST_ID}
        className="rpg-dice-box-host pointer-events-none fixed inset-0 z-[100]"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.25s ease",
        }}
        aria-hidden={!visible}
      />

      {visible && useFallbackFx ? (
        <FallbackDiceFx
          key={diceKey}
          dice={sourceDice}
          onSettled={() => setSettled(true)}
          onDone={() => scheduleDone(900)}
        />
      ) : null}

      {visible ? (
        <div className="pointer-events-none fixed inset-0 z-[101] overflow-hidden">
          <div
            className="absolute inset-0 transition-colors duration-300"
            style={{
              background: settled
                ? tone === "crit"
                  ? "radial-gradient(ellipse at center, rgba(47,107,56,0.22), transparent 70%)"
                  : tone === "fumble"
                    ? "radial-gradient(ellipse at center, rgba(143,46,58,0.26), transparent 70%)"
                    : "radial-gradient(ellipse at center, rgba(0,0,0,0.15), transparent 72%)"
                : "radial-gradient(ellipse at center, rgba(0,0,0,0.12), transparent 75%)",
            }}
          />

          <div
            className="absolute bottom-10 left-1/2 w-[min(92vw,28rem)] -translate-x-1/2 border-2 px-4 py-3 text-center shadow-xl"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor:
                tone === "crit"
                  ? "#5CB86A"
                  : tone === "fumble"
                    ? "#E06A72"
                    : "var(--color-border-strong)",
              animation: "dice-label-in 0.4s ease-out 0.35s both",
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
            {sourceDice.length > 1 && (
              <p className="mt-1 text-[11px] text-[var(--color-ink-soft)]">
                {sourceDice.length} dados
                {sourceDice.length > MAX_VISIBLE_DICE
                  ? ` (mostrando ${MAX_VISIBLE_DICE})`
                  : ""}
              </p>
            )}
            {tone === "crit" && (
              <p
                className="mt-1 text-xs uppercase tracking-[0.16em] text-[#5CB86A]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Crítico
              </p>
            )}
            {tone === "fumble" && (
              <p
                className="mt-1 text-xs uppercase tracking-[0.16em] text-[#E06A72]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Falha crítica
              </p>
            )}
          </div>

          <style>{`
            .rpg-dice-box-host,
            .rpg-dice-box-host canvas,
            .rpg-dice-box-host .dice-box-canvas {
              width: 100% !important;
              height: 100% !important;
              display: block;
            }
            @keyframes dice-label-in {
              from { opacity: 0; transform: translate(-50%, 12px); }
              to { opacity: 1; transform: translate(-50%, 0); }
            }
          `}</style>
        </div>
      ) : null}
    </>
  );
}

function FallbackDiceFx({
  dice,
  onSettled,
  onDone,
}: {
  dice: DiceFxDie[];
  onSettled: () => void;
  onDone: () => void;
}) {
  useEffect(() => {
    const settle = window.setTimeout(() => onSettled(), 1100);
    const done = window.setTimeout(() => onDone(), 2000);
    return () => {
      window.clearTimeout(settle);
      window.clearTimeout(done);
    };
  }, [dice, onDone, onSettled]);

  const show = dice.slice(0, 6);
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {show.map((die, index) => (
        <div
          key={`${die.sides}-${index}`}
          className="dice-fallback-tumble absolute flex items-center justify-center border-2 font-bold shadow-lg"
          style={{
            width: 64,
            height: 64,
            left: `${15 + index * 12}%`,
            ["--spin" as string]: `${480 + index * 90}deg`,
            animationDelay: `${index * 80}ms`,
            fontFamily: "'Cinzel', serif",
            fontSize: 24,
            color: "var(--color-crimson)",
            backgroundColor: "var(--color-parchment)",
            borderColor: "var(--color-crimson)",
            borderRadius: die.sides >= 20 ? "18%" : "12%",
          }}
        >
          {die.value}
        </div>
      ))}
      <style>{`
        .dice-fallback-tumble {
          animation: dice-fallback-drop 1.1s cubic-bezier(0.22, 0.82, 0.28, 1) both;
        }
        @keyframes dice-fallback-drop {
          0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translateY(38vh) rotate(var(--spin)); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

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
