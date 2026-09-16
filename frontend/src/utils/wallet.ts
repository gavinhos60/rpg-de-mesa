import type { CharacterFormData, CharacterWallet } from "../types/character";
import { DND_BACKGROUNDS } from "../data/dnd/backgrounds";

/** 50 moedas de qualquer tipo = 1 libra (regra D&D 5e). */
export const COINS_PER_POUND = 50;

export type CoinKey = keyof CharacterWallet;

export type CoinDefinition = {
  key: CoinKey;
  label: string;
  short: string;
  /** Valor em peças de ouro (PO). */
  valueInPo: number;
};

/** Ordem de exibição: maior valor → menor. */
export const COIN_DEFINITIONS: CoinDefinition[] = [
  { key: "pl", label: "Peças de platina", short: "PL", valueInPo: 10 },
  { key: "po", label: "Peças de ouro", short: "PO", valueInPo: 1 },
  { key: "pp", label: "Peças de prata", short: "PP", valueInPo: 0.1 },
];

export function emptyWallet(): CharacterWallet {
  return { pl: 0, po: 0, pp: 0 };
}

export function normalizeWallet(
  wallet?: Partial<CharacterWallet> | null
): CharacterWallet {
  return {
    pl: Math.max(0, Math.floor(Number(wallet?.pl) || 0)),
    po: Math.max(0, Math.floor(Number(wallet?.po) || 0)),
    pp: Math.max(0, Math.floor(Number(wallet?.pp) || 0)),
  };
}

/** Carteira da ficha; se ausente, usa o ouro inicial do antecedente como PO. */
export function resolveCharacterWallet(data: CharacterFormData): CharacterWallet {
  if (data.wallet) return normalizeWallet(data.wallet);
  const background = DND_BACKGROUNDS.find((item) => item.id === data.backgroundId);
  return {
    ...emptyWallet(),
    po: background?.startingGoldGp ?? 0,
  };
}

export function totalCoinCount(wallet: CharacterWallet): number {
  return COIN_DEFINITIONS.reduce((sum, coin) => sum + wallet[coin.key], 0);
}

/** Peso em libras (50 moedas = 1 lb). */
export function walletWeightLb(wallet: CharacterWallet): number {
  return totalCoinCount(wallet) / COINS_PER_POUND;
}

/** Valor total convertido em PO. */
export function walletValueInPo(wallet: CharacterWallet): number {
  return COIN_DEFINITIONS.reduce(
    (sum, coin) => sum + wallet[coin.key] * coin.valueInPo,
    0
  );
}

export function formatPoValue(value: number): string {
  if (Number.isInteger(value)) return `${value} PO`;
  const rounded = Math.round(value * 100) / 100;
  return `${rounded} PO`;
}

export function formatWallet(wallet: CharacterWallet): string {
  const parts = COIN_DEFINITIONS.filter((coin) => wallet[coin.key] > 0).map(
    (coin) => `${wallet[coin.key]} ${coin.short}`
  );
  return parts.length > 0 ? parts.join(" · ") : "0 PO";
}
