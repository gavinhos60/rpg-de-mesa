import type { BoardEffect } from "../../types/game";

const PING_LABEL = "__ping__";
const PING_MS = 1400;

export function isMapPingEffect(effect: BoardEffect): boolean {
  return effect.label === PING_LABEL;
}

export function createMapPingEffect(
  x: number,
  y: number,
  color: string
): Omit<BoardEffect, "id" | "byUserId"> & { id?: string } {
  return {
    x,
    y,
    radius: 56,
    color,
    label: PING_LABEL,
    expiresAt: Date.now() + PING_MS,
  };
}

interface MapPingRipplesProps {
  effects: BoardEffect[];
}

export function MapPingRipples({ effects }: MapPingRipplesProps) {
  const pings = effects.filter(isMapPingEffect);
  if (pings.length === 0) return null;

  return (
    <g pointerEvents="none" className="map-ping-layer">
      {pings.map((ping) => (
        <g key={ping.id} transform={`translate(${ping.x} ${ping.y})`}>
          <circle
            r={ping.radius ?? 48}
            fill="none"
            stroke={ping.color || "#3DDCFF"}
            strokeWidth={3}
            className="map-ping-ring map-ping-ring--a"
          />
          <circle
            r={ping.radius ?? 48}
            fill="none"
            stroke={ping.color || "#3DDCFF"}
            strokeWidth={2}
            className="map-ping-ring map-ping-ring--b"
          />
          <circle
            r={8}
            fill={ping.color || "#3DDCFF"}
            opacity={0.85}
          />
        </g>
      ))}
    </g>
  );
}
