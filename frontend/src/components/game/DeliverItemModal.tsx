import { useEffect, useState } from "react";
import type { CampaignCharacterLite } from "../../types/game";
import type { Shop, ShopDelivery, ShopItem } from "../../types/mercado";
import { isItemSoldOut } from "../../types/mercado";
import { deliverShopItem } from "../../services/mercado.service";

interface DeliverItemModalProps {
  campaignId: number;
  shop: Shop;
  item: ShopItem;
  characters: CampaignCharacterLite[];
  onClose: () => void;
  onDelivered: (result: {
    item: ShopItem;
    character: CampaignCharacterLite;
    delivery: ShopDelivery;
  }) => void;
}

export function DeliverItemModal({
  campaignId,
  shop,
  item,
  characters,
  onClose,
  onDelivered,
}: DeliverItemModalProps) {
  const [characterId, setCharacterId] = useState(
    String(characters[0]?.id ?? "")
  );
  const [quantity, setQuantity] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!characterId && characters[0]) {
      setCharacterId(String(characters[0].id));
    }
  }, [characterId, characters]);

  const soldOut = isItemSoldOut(item);
  const maxQty = item.unlimitedStock
    ? 99
    : Math.max(0, item.quantity ?? 0);

  async function handleDeliver() {
    const cid = Number(characterId);
    const qty = Math.max(1, Math.floor(Number(quantity) || 1));
    if (!cid) {
      setError("Selecione um personagem.");
      return;
    }
    if (soldOut) {
      setError("Item esgotado.");
      return;
    }
    if (!item.unlimitedStock && qty > maxQty) {
      setError(`Estoque insuficiente (máx. ${maxQty}).`);
      return;
    }

    try {
      setBusy(true);
      setError("");
      const result = await deliverShopItem(campaignId, shop.id, item.id, {
        characterId: cid,
        quantity: qty,
      });
      onDelivered({
        item: result.item,
        character: result.character as CampaignCharacterLite,
        delivery: result.delivery,
      });
      onClose();
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { error?: string } } }).response?.data
          ?.error;
      setError(message || "Falha ao entregar item.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(20, 12, 8, and 0.65)".replace(" and ", "") }}
      role="dialog"
      aria-modal
    >
      <div
        className="w-full max-w-md border p-4"
        style={{
          borderColor: "var(--color-border-strong)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <h3
          className="mb-1 text-base text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          Entregar item
        </h3>
        <p className="mb-3 text-xs text-[var(--color-ink-soft)]">
          {shop.name} · {item.name} ({item.price})
          {soldOut ? " · ESGOTADO" : item.unlimitedStock ? " · estoque ∞" : ` · estoque ${item.quantity ?? 0}`}
        </p>

        <label className="mb-2 block text-xs text-[var(--color-ink-muted)]">
          Personagem
          <select
            value={characterId}
            onChange={(e) => setCharacterId(e.target.value)}
            className="mt-1 w-full border px-2 py-1.5 text-sm"
            style={{
              backgroundColor: "var(--color-parchment)",
              borderColor: "var(--color-border)",
            }}
          >
            {characters.length === 0 && (
              <option value="">Nenhum personagem</option>
            )}
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="mb-3 block text-xs text-[var(--color-ink-muted)]">
          Quantidade
          <input
            type="number"
            min={1}
            max={maxQty || 1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 w-full border px-2 py-1.5 text-sm"
            style={{
              backgroundColor: "var(--color-parchment)",
              borderColor: "var(--color-border)",
            }}
          />
        </label>

        {error ? (
          <p className="mb-2 text-xs text-[var(--color-crimson)]">{error}</p>
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border px-3 py-1.5 text-xs"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-parchment)",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={busy || soldOut || !characterId}
            onClick={() => void handleDeliver()}
            className="border px-3 py-1.5 text-xs disabled:opacity-50"
            style={{
              fontFamily: "'Cinzel', serif",
              borderColor: "var(--color-crimson)",
              backgroundColor: "var(--color-crimson)",
              color: "var(--color-ink-inverse)",
            }}
          >
            {busy ? "Entregando…" : "Entregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
