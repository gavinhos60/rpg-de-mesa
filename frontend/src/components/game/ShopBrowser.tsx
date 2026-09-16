import type { Shop } from "../../types/mercado";
import { isItemSoldOut } from "../../types/mercado";

interface ShopBrowserProps {
  shops: Shop[];
  onClose?: () => void;
  compact?: boolean;
}

export function ShopBrowser({ shops, onClose, compact }: ShopBrowserProps) {
  const openShops = shops.filter((s) => s.isOpen);

  if (openShops.length === 0) {
    return (
      <div className={compact ? "" : "p-3"}>
        <p className="text-xs italic text-[var(--color-ink-soft)]">
          Nenhum mercado aberto no momento.
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-3 p-3"}>
      {!compact && (
        <div className="flex items-center justify-between gap-2">
          <h3
            className="text-base text-[var(--color-ink)]"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
          >
            Mercado
          </h3>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="border px-2 py-1 text-[10px]"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-parchment)",
              }}
            >
              Fechar
            </button>
          ) : null}
        </div>
      )}

      {openShops.map((shop) => (
        <section
          key={shop.id}
          className="rounded border p-2.5"
          style={{
            borderColor: "var(--color-border-strong)",
            backgroundColor: "var(--color-parchment-soft)",
          }}
        >
          <h4
            className="text-sm text-[var(--color-ink)]"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
          >
            {shop.name}
          </h4>
          {shop.description ? (
            <p className="mb-2 text-xs text-[var(--color-ink-soft)]">
              {shop.description}
            </p>
          ) : null}

          <ul className="space-y-2">
            {shop.items.length === 0 && (
              <li className="text-xs italic text-[var(--color-ink-soft)]">
                Sem itens disponíveis.
              </li>
            )}
            {shop.items.map((item) => {
              const soldOut = isItemSoldOut(item);
              return (
                <li
                  key={item.id}
                  className="flex gap-2 border-b pb-2 last:border-0"
                  style={{
                    borderColor: "var(--color-border)",
                    opacity: soldOut ? 0.55 : 1,
                  }}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-12 w-12 shrink-0 object-cover"
                      style={{ border: "1px solid var(--color-border)" }}
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm text-[var(--color-ink)]"
                      style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                    >
                      {item.name}
                      {soldOut ? (
                        <span className="ml-1 text-[10px] text-[var(--color-crimson)]">
                          ESGOTADO
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[11px] text-[var(--color-crimson)]">
                      {item.price}
                      {!soldOut && !item.unlimitedStock
                        ? ` · ${item.quantity ?? 0} em estoque`
                        : ""}
                    </p>
                    {item.description ? (
                      <p className="text-xs text-[var(--color-ink-muted)]">
                        {item.description}
                      </p>
                    ) : null}
                    {item.extraInfo ? (
                      <p className="text-[10px] italic text-[var(--color-ink-soft)]">
                        {item.extraInfo}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
