import type { CharacterFormData } from "../types/character";

/** PV da ficha salva; fallback 10 se ainda não houver valor. */
export function hitPointsFromSheet(sheet: unknown): {
  hpMax: number;
  hpCurrent: number;
} {
  const data =
    sheet && typeof sheet === "object" ? (sheet as CharacterFormData) : null;
  const raw = data?.hitPoints;
  const hp =
    typeof raw === "number" && Number.isFinite(raw) && raw > 0
      ? Math.round(raw)
      : 10;
  return { hpMax: hp, hpCurrent: hp };
}
