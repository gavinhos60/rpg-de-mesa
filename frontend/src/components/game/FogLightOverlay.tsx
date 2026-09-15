import { useEffect, useRef } from "react";
import type { FogLightSource } from "../../types/game";

interface FogLightOverlayProps {
  width: number;
  height: number;
  lights: FogLightSource[];
}

/**
 * Névoa escura com buracos de luz radial suave + leve cintilar.
 */
export function FogLightOverlay({ width, height, lights }: FogLightOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lightsRef = useRef(lights);
  lightsRef.current = lights;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let running = true;

    const draw = (time: number) => {
      if (!running) return;
      const sources = lightsRef.current;
      // Cintilar suave e irregular (tocha).
      const flicker =
        0.96 +
        Math.sin(time * 0.0042) * 0.025 +
        Math.sin(time * 0.011) * 0.015 +
        Math.sin(time * 0.029) * 0.01;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);

      // Escuridão total fora da visão
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Recorta a luz (núcleo claro, borda que some rápido no preto)
      ctx.globalCompositeOperation = "destination-out";
      for (const light of sources) {
        const radius = Math.max(8, light.radiusPx * flicker);
        const gradient = ctx.createRadialGradient(
          light.x,
          light.y,
          radius * 0.12,
          light.x,
          light.y,
          radius
        );
        gradient.addColorStop(0, "rgba(0,0,0,1)");
        gradient.addColorStop(0.4, "rgba(0,0,0,0.95)");
        gradient.addColorStop(0.68, "rgba(0,0,0,0.45)");
        gradient.addColorStop(0.88, "rgba(0,0,0,0.08)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(light.x, light.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Brilho quente só no núcleo iluminado
      ctx.globalCompositeOperation = "screen";
      for (const light of sources) {
        const radius = Math.max(8, light.radiusPx * flicker * 0.72);
        const glow = ctx.createRadialGradient(
          light.x,
          light.y,
          0,
          light.x,
          light.y,
          radius
        );
        glow.addColorStop(0, "rgba(255, 196, 110, 0.18)");
        glow.addColorStop(0.45, "rgba(232, 160, 70, 0.08)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(light.x, light.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="pointer-events-none absolute left-0 top-0"
      style={{ zIndex: 5, width, height }}
    />
  );
}
