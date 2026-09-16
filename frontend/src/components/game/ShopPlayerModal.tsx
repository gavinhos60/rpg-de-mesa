import { createPortal } from "react-dom";
import type { Shop } from "../../types/mercado";
import { isItemSoldOut } from "../../types/mercado";
import { ShopBrowser } from "./ShopBrowser";

interface ShopPlayerModalProps {
  shops: Shop[];
  initialShopId?: number | null;
  onClose: () => void;
}

export function ShopPlayerModal({
  shops,
  initialShopId = null,
  onClose,
}: ShopPlayerModalProps) {
  const openShops = shops.filter((s) => s.isOpen);
  const focused =
    openShops.find((s) => s.id === initialShopId) ?? openShops[0] ?? null;

  if (openShops.length === 0) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-overlay)" }}
      role="dialog"
      aria-modal
      aria-label="Mercado"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="flex max-h-[min(90vh,44rem)] w-full max-w-2xl flex-col border-2"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border-wood)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header
          className="flex shrink-0 items-start justify-between gap-3 border-b px-5 py-4"
          style={{
            borderColor: "var(--color-border)",
            background:
              "linear-gradient(180deg, var(--color-parchment-soft) 0%, var(--color-surface) 100%)",
          }}
        >
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-soft)]"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Balcão · Mercado
            </p>
            <h2
              className="text-xl text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              {focused?.name ?? "Lojas abertas"}
            </h2>
            {focused?.description ? (
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                {focused.description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-[var(--color-border-strong)] hover:text-[var(--color-crimson)]"
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {openShops.length === 1 ? (
            <ShopItemsList shop={focused!} />
          ) : (
            <ShopBrowser shops={openShops} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function ShopItemsList({ shop }: { shop: Shop }) {
  const items = shop.items.filter((item) => item.available !== false);

  return (
    <ul className="space-y-2 p-3">
      {items.length === 0 ? (
        <li className="text-sm italic text-[var(--color-ink-soft)]">
          Sem itens disponíveis.
        </li>
      ) : null}
      {items.map((item) => {
        const soldOut = isItemSoldOut(item);
        return (
          <li
            key={item.id}
            className="flex gap-3 border p-3"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-parchment)",
              opacity: soldOut ? 0.6 : 1,
            }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt=""
                className="h-16 w-16 shrink-0 object-cover"
                style={{ border: "1px solid var(--color-border)" }}
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p
                className="text-base text-[var(--color-ink)]"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
              >
                {item.name}
                {soldOut ? (
                  <span className="ml-2 text-[10px] text-[var(--color-crimson)]">
                    ESGOTADO
                  </span>
                ) : null}
              </p>
              <p className="text-sm text-[var(--color-crimson)]">
                {item.price}
                {!soldOut && !item.unlimitedStock
                  ? ` · ${item.quantity ?? 0} em estoque`
                  : item.unlimitedStock
                    ? " · estoque ∞"
                    : ""}
              </p>
              {item.description ? (
                <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                  {item.description}
                </p>
              ) : null}
              {item.extraInfo ? (
                <p className="text-xs italic text-[var(--color-ink-soft)]">
                  {item.extraInfo}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
