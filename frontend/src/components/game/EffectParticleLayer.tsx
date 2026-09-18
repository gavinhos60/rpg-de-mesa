import { useEffect, useRef } from "react";
import type { BoardEffect } from "../../types/game";
import {
  fxElementColor,
  type FxPingElement,
  type FxPingKind,
} from "./effectPing";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  sizeEnd: number;
  r: number;
  g: number;
  b: number;
  a: number;
  aEnd: number;
  rot: number;
  rotSpeed: number;
};

type Emitter = {
  id: string;
  kind: FxPingKind;
  element: FxPingElement;
  x: number;
  y: number;
  toX: number;
  toY: number;
  radius: number;
  particles: Particle[];
  emitAcc: number;
  age: number;
  /** Instantâneo: encerra emissão após duration. */
  duration: number;
  sticky: boolean;
  /** Fase do foguete: travel | burst */
  phase: "travel" | "burst" | "emit";
  travelT: number;
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const raw = hex.replace("#", "").trim();
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return { r: 180, g: 136, b: 255 };
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** Paleta estilo Roll20: start → end com núcleo claro. */
function elementPalette(element: FxPingElement): {
  core: { r: number; g: number; b: number };
  mid: { r: number; g: number; b: number };
  edge: { r: number; g: number; b: number };
} {
  const mid = hexToRgb(fxElementColor(element));
  switch (element) {
    case "fire":
      return {
        core: { r: 255, g: 240, b: 180 },
        mid: { r: 255, g: 120, b: 30 },
        edge: { r: 180, g: 20, b: 0 },
      };
    case "frost":
      return {
        core: { r: 240, g: 250, b: 255 },
        mid: { r: 120, g: 210, b: 255 },
        edge: { r: 40, g: 120, b: 200 },
      };
    case "holy":
      return {
        core: { r: 255, g: 255, b: 255 },
        mid: { r: 255, g: 230, b: 120 },
        edge: { r: 220, g: 180, b: 40 },
      };
    case "death":
      return {
        core: { r: 200, g: 160, b: 255 },
        mid: { r: 90, g: 30, b: 130 },
        edge: { r: 20, g: 0, b: 40 },
      };
    case "smoke":
      return {
        core: { r: 200, g: 200, b: 200 },
        mid: { r: 120, g: 120, b: 120 },
        edge: { r: 50, g: 50, b: 50 },
      };
    case "blood":
      return {
        core: { r: 255, g: 80, b: 80 },
        mid: { r: 160, g: 10, b: 30 },
        edge: { r: 60, g: 0, b: 10 },
      };
    case "acid":
      return {
        core: { r: 220, g: 255, b: 120 },
        mid: { r: 160, g: 220, b: 20 },
        edge: { r: 40, g: 100, b: 0 },
      };
    case "slime":
      return {
        core: { r: 200, g: 255, b: 160 },
        mid: { r: 50, g: 220, b: 40 },
        edge: { r: 10, g: 80, b: 10 },
      };
    case "water":
      return {
        core: { r: 200, g: 240, b: 255 },
        mid: { r: 40, g: 140, b: 255 },
        edge: { r: 0, g: 40, b: 140 },
      };
    case "charm":
      return {
        core: { r: 255, g: 220, b: 255 },
        mid: { r: 255, g: 100, b: 180 },
        edge: { r: 160, g: 20, b: 100 },
      };
    case "magic":
    default:
      return {
        core: { r: 240, g: 220, b: 255 },
        mid: mid,
        edge: { r: 80, g: 40, b: 160 },
      };
  }
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeSoftSprite(): HTMLCanvasElement {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(255,255,255,0.85)");
  g.addColorStop(0.45, "rgba(255,255,255,0.35)");
  g.addColorStop(0.75, "rgba(255,255,255,0.08)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

const tintCache = new Map<string, HTMLCanvasElement>();

function tintedSprite(
  base: HTMLCanvasElement,
  r: number,
  g: number,
  b: number
): HTMLCanvasElement {
  const key = `${r >> 0},${g >> 0},${b >> 0}`;
  const cached = tintCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = base.width;
  canvas.height = base.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(base, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  tintCache.set(key, canvas);
  if (tintCache.size > 64) {
    const first = tintCache.keys().next().value;
    if (first) tintCache.delete(first);
  }
  return canvas;
}

function spawnParticle(
  emitter: Emitter,
  override?: Partial<Particle> & { x?: number; y?: number }
): Particle {
  const pal = elementPalette(emitter.element);
  const pick =
    Math.random() < 0.35 ? pal.core : Math.random() < 0.7 ? pal.mid : pal.edge;
  return {
    x: override?.x ?? emitter.x,
    y: override?.y ?? emitter.y,
    vx: override?.vx ?? 0,
    vy: override?.vy ?? 0,
    life: override?.life ?? 1,
    maxLife: override?.maxLife ?? 1,
    size: override?.size ?? 12,
    sizeEnd: override?.sizeEnd ?? 4,
    r: override?.r ?? pick.r,
    g: override?.g ?? pick.g,
    b: override?.b ?? pick.b,
    a: override?.a ?? 0.85,
    aEnd: override?.aEnd ?? 0,
    rot: override?.rot ?? rand(0, Math.PI * 2),
    rotSpeed: override?.rotSpeed ?? rand(-2, 2),
  };
}

function emitForKind(emitter: Emitter, dt: number, scale: number) {
  const dirX = emitter.toX - emitter.x;
  const dirY = emitter.toY - emitter.y;
  const dist = Math.max(1, Math.hypot(dirX, dirY));
  const ux = dirX / dist;
  const uy = dirY / dist;
  const baseAngle = Math.atan2(uy, ux);

  const push = (p: Particle) => {
    if (emitter.particles.length < 900) emitter.particles.push(p);
  };

  switch (emitter.kind) {
    case "beam": {
      // Roll20 beam: fluxo denso ao longo da linha
      emitter.emitAcc += 90 * dt * (1 + dist / (scale * 40));
      while (emitter.emitAcc >= 1) {
        emitter.emitAcc -= 1;
        const t = Math.random();
        const px = emitter.x + ux * dist * t;
        const py = emitter.y + uy * dist * t;
        const spread = rand(-5, 5);
        const nx = -uy;
        const ny = ux;
        const speed = rand(100, 220) * (scale / 50);
        push(
          spawnParticle(emitter, {
            x: px + nx * spread,
            y: py + ny * spread,
            vx: ux * speed + rand(-8, 8),
            vy: uy * speed + rand(-8, 8),
            life: rand(0.25, 0.55),
            maxLife: rand(0.25, 0.55),
            size: rand(10, 18) * (scale / 50),
            sizeEnd: rand(2, 6) * (scale / 50),
            a: 0.95,
            aEnd: 0,
          })
        );
      }
      break;
    }
    case "breathe": {
      // Cone na direção do arraste; alcance = radius (definido pelo arraste).
      const reach = Math.max(emitter.radius, scale * 1.2);
      const cone = dist > scale * 0.25;
      const sizeScale = reach / (scale * 1.35);
      emitter.emitAcc += (28 + 40 * Math.min(3, sizeScale)) * dt;
      while (emitter.emitAcc >= 1) {
        emitter.emitAcc -= 1;
        const angle = cone
          ? baseAngle + rand(-0.5, 0.5)
          : rand(0, Math.PI * 2);
        const life = rand(0.55, 0.95);
        // Velocidade para as partículas morrerem perto da borda do alcance.
        const speed = (reach / life) * rand(0.75, 1.15);
        push(
          spawnParticle(emitter, {
            x: emitter.x,
            y: emitter.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life,
            maxLife: life,
            size: rand(12, 24) * Math.sqrt(sizeScale) * (scale / 50),
            sizeEnd: rand(22, 44) * Math.sqrt(sizeScale) * (scale / 50),
            a: 0.8,
            aEnd: 0,
          })
        );
      }
      break;
    }
    case "burn": {
      emitter.emitAcc += 36 * dt;
      while (emitter.emitAcc >= 1) {
        emitter.emitAcc -= 1;
        const angle = -Math.PI / 2 + rand(-0.55, 0.55);
        const speed = rand(30, 95) * (scale / 50);
        push(
          spawnParticle(emitter, {
            x: emitter.x + rand(-emitter.radius * 0.35, emitter.radius * 0.35),
            y: emitter.y + rand(-emitter.radius * 0.1, emitter.radius * 0.2),
            vx: Math.cos(angle) * speed * 0.35,
            vy: Math.sin(angle) * speed,
            life: rand(0.35, 0.8),
            maxLife: rand(0.35, 0.8),
            size: rand(18, 40) * (scale / 50),
            sizeEnd: rand(4, 12) * (scale / 50),
            a: 0.9,
            aEnd: 0,
          })
        );
      }
      break;
    }
    case "glow": {
      // Brilho + faíscas subindo (bubbling/glow híbrido)
      emitter.emitAcc += 24 * dt;
      while (emitter.emitAcc >= 1) {
        emitter.emitAcc -= 1;
        if (Math.random() < 0.35) {
          // núcleo pulsante
          push(
            spawnParticle(emitter, {
              x: emitter.x + rand(-6, 6),
              y: emitter.y + rand(-6, 6),
              vx: rand(-8, 8),
              vy: rand(-8, 8),
              life: rand(0.4, 0.7),
              maxLife: rand(0.4, 0.7),
              size: rand(28, 55) * (scale / 50),
              sizeEnd: rand(40, 70) * (scale / 50),
              a: 0.35,
              aEnd: 0,
            })
          );
        } else {
          const angle = -Math.PI / 2 + rand(-0.8, 0.8);
          const speed = rand(15, 45) * (scale / 50);
          push(
            spawnParticle(emitter, {
              x: emitter.x + rand(-emitter.radius * 0.4, emitter.radius * 0.4),
              y: emitter.y + rand(-emitter.radius * 0.2, emitter.radius * 0.3),
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: rand(0.5, 1.1),
              maxLife: rand(0.5, 1.1),
              size: rand(4, 10) * (scale / 50),
              sizeEnd: rand(1, 3) * (scale / 50),
              a: 1,
              aEnd: 0,
            })
          );
        }
      }
      break;
    }
    case "rocket": {
      if (emitter.phase === "travel") {
        emitter.travelT = Math.min(1, emitter.travelT + dt * 2.4);
        const hx = emitter.x + ux * dist * emitter.travelT;
        const hy = emitter.y + uy * dist * emitter.travelT;
        emitter.emitAcc += 90 * dt;
        while (emitter.emitAcc >= 1) {
          emitter.emitAcc -= 1;
          push(
            spawnParticle(emitter, {
              x: hx + rand(-3, 3),
              y: hy + rand(-3, 3),
              vx: -ux * rand(20, 60) + rand(-20, 20),
              vy: -uy * rand(20, 60) + rand(-20, 20),
              life: rand(0.15, 0.35),
              maxLife: rand(0.15, 0.35),
              size: rand(8, 16) * (scale / 50),
              sizeEnd: 2,
              a: 0.95,
              aEnd: 0,
            })
          );
        }
        if (emitter.travelT >= 1) {
          emitter.phase = "burst";
          // Explosão (explode-like)
          for (let i = 0; i < 70; i++) {
            const a = rand(0, Math.PI * 2);
            const speed = rand(40, 200) * (scale / 50);
            push(
              spawnParticle(emitter, {
                x: emitter.toX,
                y: emitter.toY,
                vx: Math.cos(a) * speed,
                vy: Math.sin(a) * speed,
                life: rand(0.35, 0.75),
                maxLife: rand(0.35, 0.75),
                size: rand(12, 28) * (scale / 50),
                sizeEnd: rand(2, 8) * (scale / 50),
                a: 1,
                aEnd: 0,
              })
            );
          }
        }
      } else if (emitter.phase === "burst") {
        // faíscas residuais curtas no impacto
        if (emitter.age < emitter.duration * 0.45) {
          emitter.emitAcc += 20 * dt;
          while (emitter.emitAcc >= 1) {
            emitter.emitAcc -= 1;
            const a = rand(0, Math.PI * 2);
            const speed = rand(10, 50) * (scale / 50);
            push(
              spawnParticle(emitter, {
                x: emitter.toX,
                y: emitter.toY,
                vx: Math.cos(a) * speed,
                vy: Math.sin(a) * speed,
                life: rand(0.2, 0.45),
                maxLife: rand(0.2, 0.45),
                size: rand(8, 18) * (scale / 50),
                sizeEnd: 1,
                a: 0.8,
                aEnd: 0,
              })
            );
          }
        }
      }
      break;
    }
  }
}

function syncEmitters(
  previous: Map<string, Emitter>,
  effects: BoardEffect[],
  now: number
): Map<string, Emitter> {
  const next = new Map<string, Emitter>();
  for (const effect of effects) {
    if (!effect.fxKind) continue;
    const existing = previous.get(effect.id);
    const sticky = !effect.expiresAt;
    const duration = sticky
      ? Number.POSITIVE_INFINITY
      : Math.max(0.4, ((effect.expiresAt ?? now + 3800) - now) / 1000);
    if (existing) {
      existing.x = effect.x;
      existing.y = effect.y;
      existing.toX = effect.toX ?? effect.x;
      existing.toY = effect.toY ?? effect.y;
      existing.radius = effect.radius;
      existing.kind = effect.fxKind;
      existing.element = (effect.fxElement || "magic") as FxPingElement;
      existing.sticky = sticky;
      if (!sticky && Number.isFinite(duration)) {
        existing.duration = duration;
      }
      next.set(effect.id, existing);
    } else {
      next.set(effect.id, {
        id: effect.id,
        kind: effect.fxKind,
        element: (effect.fxElement || "magic") as FxPingElement,
        x: effect.x,
        y: effect.y,
        toX: effect.toX ?? effect.x,
        toY: effect.toY ?? effect.y,
        radius: Math.max(16, effect.radius || 40),
        particles: [],
        emitAcc: 0,
        age: 0,
        duration,
        sticky,
        phase: effect.fxKind === "rocket" ? "travel" : "emit",
        travelT: 0,
      });
    }
  }
  return next;
}

interface EffectParticleLayerProps {
  effects: BoardEffect[];
  width: number;
  height: number;
  gridSize: number;
  selectedId?: string | null;
}

/**
 * Camada de partículas estilo Roll20 (sprites suaves + blend aditivo).
 */
export function EffectParticleLayer({
  effects,
  width,
  height,
  gridSize,
  selectedId,
}: EffectParticleLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emittersRef = useRef<Map<string, Emitter>>(new Map());
  const spriteRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(performance.now());

  useEffect(() => {
    spriteRef.current = makeSoftSprite();
  }, []);

  useEffect(() => {
    emittersRef.current = syncEmitters(
      emittersRef.current,
      effects,
      Date.now()
    );
  }, [effects]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = Math.max(1, Math.floor(width));
        canvas.height = Math.max(1, Math.floor(height));
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      const sprite = spriteRef.current;
      const scale = gridSize || 50;

      for (const emitter of emittersRef.current.values()) {
        emitter.age += dt;
        const stillEmitting =
          emitter.sticky || emitter.age < emitter.duration * 0.85;
        if (stillEmitting || emitter.kind === "rocket") {
          if (emitter.kind === "rocket" || stillEmitting) {
            emitForKind(emitter, dt, scale);
          }
        }

        const alive: Particle[] = [];
        for (const p of emitter.particles) {
          p.life -= dt;
          if (p.life <= 0) continue;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          // leve “drag” para parecer fumaça/fogo do Roll20
          p.vx *= 1 - 0.6 * dt;
          p.vy *= 1 - 0.45 * dt;
          if (emitter.kind === "burn" || emitter.kind === "glow") {
            p.vy -= 18 * dt * (scale / 50);
          }
          p.rot += p.rotSpeed * dt;
          alive.push(p);

          const t = 1 - p.life / p.maxLife;
          const size = p.size + (p.sizeEnd - p.size) * t;
          const alpha = Math.max(0, p.a + (p.aEnd - p.a) * t);
          if (alpha <= 0.01 || size <= 0.5) continue;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = alpha;
          if (sprite) {
            const tinted = tintedSprite(sprite, p.r, p.g, p.b);
            ctx.drawImage(tinted, -size / 2, -size / 2, size, size);
          } else {
            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        emitter.particles = alive;

        if (selectedId === emitter.id) {
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = "rgba(240,208,128,0.9)";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.arc(
            emitter.x,
            emitter.y,
            Math.max(emitter.radius, 24) + 8,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalCompositeOperation = "lighter";
        }
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [width, height, gridSize, selectedId]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute left-0 top-0"
      style={{ width, height }}
      width={Math.max(1, Math.floor(width))}
      height={Math.max(1, Math.floor(height))}
    />
  );
}

/** Áreas clicáveis invisíveis para selecionar FX persistentes. */
export function EffectHitAreas({
  effects,
  interactive,
  selectedId,
  onSelect,
}: {
  effects: BoardEffect[];
  interactive: boolean;
  selectedId?: string | null;
  onSelect: (id: string) => void;
}) {
  if (!interactive) return null;
  return (
    <g>
      {effects.map((effect) => {
        if (!effect.fxKind) return null;
        const r = Math.max(20, effect.radius || 40);
        const selected = selectedId === effect.id;
        return (
          <g key={`hit-${effect.id}`}>
            {effect.fxKind === "beam" || effect.fxKind === "rocket" ? (
              <line
                x1={effect.x}
                y1={effect.y}
                x2={effect.toX ?? effect.x}
                y2={effect.toY ?? effect.y}
                stroke={selected ? "rgba(240,208,128,0.01)" : "transparent"}
                strokeWidth={Math.max(28, r)}
                style={{ cursor: "pointer" }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  onSelect(effect.id);
                }}
              />
            ) : null}
            <circle
              cx={effect.fxKind === "rocket" ? effect.toX ?? effect.x : effect.x}
              cy={effect.fxKind === "rocket" ? effect.toY ?? effect.y : effect.y}
              r={r}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onPointerDown={(event) => {
                event.stopPropagation();
                onSelect(effect.id);
              }}
            />
          </g>
        );
      })}
    </g>
  );
}
