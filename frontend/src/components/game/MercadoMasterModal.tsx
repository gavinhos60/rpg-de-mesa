import { useEffect, useState } from "react";
import type { CampaignCharacterLite } from "../../types/game";
import type { Shop, ShopItem } from "../../types/mercado";
import { isItemSoldOut } from "../../types/mercado";
import {
  createShopItem,
  deleteShop,
  deleteShopItem,
  updateShop,
  updateShopItem,
} from "../../services/mercado.service";
import { DeliverItemModal } from "./DeliverItemModal";
import { RibbonButton } from "../icons/MedievalIcons";

const fieldStyle = {
  backgroundColor: "var(--color-parchment)",
  borderColor: "var(--color-border)",
  color: "var(--color-ink)",
} as const;

const CATEGORIES = [
  { value: "weapon", label: "Arma" },
  { value: "armor", label: "Armadura" },
  { value: "shield", label: "Escudo" },
  { value: "ammunition", label: "Munição" },
  { value: "pack", label: "Pacote" },
  { value: "tool", label: "Ferramenta" },
  { value: "focus", label: "Foco" },
  { value: "gear", label: "Equipamento" },
  { value: "accessory", label: "Acessório" },
] as const;

interface MercadoMasterModalProps {
  campaignId: number;
  shops: Shop[];
  characters: CampaignCharacterLite[];
  initialShopId?: number | null;
  busy?: boolean;
  onRefresh: () => Promise<void>;
  onClose: () => void;
  onCharacterUpdated?: (character: CampaignCharacterLite) => void;
  onMessage?: (text: string) => void;
}

export function MercadoMasterModal({
  campaignId,
  shops,
  characters,
  initialShopId = null,
  busy: busyProp,
  onRefresh,
  onClose,
  onCharacterUpdated,
  onMessage,
}: MercadoMasterModalProps) {
  const [selectedShopId, setSelectedShopId] = useState<number | null>(
    initialShopId
  );
  const [busy, setBusy] = useState(false);
  const locked = busy || Boolean(busyProp);

  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("50 PO");
  const [itemCategory, setItemCategory] = useState<string>("gear");
  const [itemDescription, setItemDescription] = useState("");
  const [itemQty, setItemQty] = useState("1");
  const [itemUnlimited, setItemUnlimited] = useState(false);
  const [itemExtra, setItemExtra] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [showAddItem, setShowAddItem] = useState(false);

  const [deliverTarget, setDeliverTarget] = useState<{
    shop: Shop;
    item: ShopItem;
  } | null>(null);

  useEffect(() => {
    if (initialShopId != null) {
      setSelectedShopId(initialShopId);
      return;
    }
    setSelectedShopId((current) => {
      if (current != null && shops.some((s) => s.id === current)) return current;
      return shops[0]?.id ?? null;
    });
  }, [initialShopId, shops]);

  const selectedShop =
    shops.find((s) => s.id === selectedShopId) ?? shops[0] ?? null;

  async function handleToggleOpen(shop: Shop) {
    try {
      setBusy(true);
      await updateShop(campaignId, shop.id, { isOpen: !shop.isOpen });
      await onRefresh();
      onMessage?.(
        shop.isOpen
          ? `Loja "${shop.name}" fechada para jogadores.`
          : `Loja "${shop.name}" aberta para jogadores.`
      );
    } catch (err) {
      console.error(err);
      onMessage?.("Erro ao abrir/fechar loja.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteShop(shop: Shop) {
    if (!window.confirm(`Excluir a loja "${shop.name}"?`)) return;
    try {
      setBusy(true);
      await deleteShop(campaignId, shop.id);
      setSelectedShopId(null);
      await onRefresh();
      onMessage?.("Loja excluída.");
    } catch (err) {
      console.error(err);
      onMessage?.("Erro ao excluir loja.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAddItem() {
    if (!selectedShop) return;
    if (!itemName.trim()) {
      onMessage?.("Nome do item é obrigatório.");
      return;
    }
    try {
      setBusy(true);
      await createShopItem(campaignId, selectedShop.id, {
        name: itemName.trim(),
        price: itemPrice.trim() || "—",
        category: itemCategory,
        description: itemDescription.trim() || null,
        extraInfo: itemExtra.trim() || null,
        imageUrl: itemImageUrl.trim() || null,
        unlimitedStock: itemUnlimited,
        quantity: itemUnlimited
          ? null
          : Math.max(0, Math.floor(Number(itemQty) || 0)),
        available: true,
      });
      setItemName("");
      setItemDescription("");
      setItemExtra("");
      setItemImageUrl("");
      setItemQty("1");
      setItemUnlimited(false);
      setShowAddItem(false);
      await onRefresh();
      onMessage?.("Item adicionado à loja.");
    } catch (err) {
      console.error(err);
      onMessage?.("Erro ao adicionar item.");
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleItemAvailable(shop: Shop, item: ShopItem) {
    try {
      setBusy(true);
      await updateShopItem(campaignId, shop.id, item.id, {
        available: !item.available,
      });
      await onRefresh();
    } catch (err) {
      console.error(err);
      onMessage?.("Erro ao atualizar item.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteItem(shop: Shop, item: ShopItem) {
    if (!window.confirm(`Excluir "${item.name}"?`)) return;
    try {
      setBusy(true);
      await deleteShopItem(campaignId, shop.id, item.id);
      await onRefresh();
    } catch (err) {
      console.error(err);
      onMessage?.("Erro ao excluir item.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-6"
        style={{ backgroundColor: "var(--color-overlay)" }}
        role="dialog"
        aria-modal
        aria-label="Mercado"
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div
          className="relative flex max-h-[min(94vh,46rem)] w-full max-w-4xl flex-col overflow-hidden border-2"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-wood)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
            minHeight: "min(72vh, 36rem)",
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <header
            className="flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3 sm:px-5"
            style={{
              borderColor: "var(--color-border)",
              background:
                "linear-gradient(180deg, var(--color-parchment-soft) 0%, var(--color-surface) 100%)",
            }}
          >
            <div className="min-w-0">
              <p
                className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-soft)]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Balcão · Mercado
              </p>
              <h2
                className="truncate text-xl text-[var(--color-ink)] sm:text-2xl"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
              >
                {selectedShop ? selectedShop.name : "Lojas da campanha"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 border px-3 py-1.5 text-xs text-[var(--color-ink-inverse)]"
              style={{
                fontFamily: "'Cinzel', serif",
                borderColor: "var(--color-crimson)",
                backgroundColor: "var(--color-crimson)",
              }}
            >
              Fechar
            </button>
          </header>

          <div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-[14rem_minmax(0,1fr)]">
            <aside
              className="min-h-0 overflow-y-auto border-b p-3 lg:border-b-0 lg:border-r"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-parchment-soft)",
              }}
            >
              <p
                className="mb-2 text-[11px] text-[var(--color-ink)]"
                style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
              >
                Lojas ({shops.length})
              </p>
              {shops.length === 0 ? (
                <p className="text-xs italic text-[var(--color-ink-soft)]">
                  Nenhuma loja ainda.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {shops.map((shop) => (
                    <li key={shop.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedShopId(shop.id);
                          setShowAddItem(false);
                        }}
                        className="w-full border px-2 py-2 text-left text-xs"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          borderColor:
                            selectedShop?.id === shop.id
                              ? "var(--color-crimson)"
                              : "var(--color-border)",
                          backgroundColor:
                            selectedShop?.id === shop.id
                              ? "color-mix(in srgb, var(--color-crimson) 14%, var(--color-parchment))"
                              : "var(--color-parchment)",
                          color: "var(--color-ink)",
                        }}
                      >
                        <span className="block truncate font-semibold">
                          {shop.name}
                        </span>
                        <span
                          className="text-[10px]"
                          style={{
                            color: shop.isOpen
                              ? "var(--color-crimson)"
                              : "var(--color-ink-soft)",
                          }}
                        >
                          {shop.isOpen ? "Aberta aos jogadores" : "Fechada"}
                          {" · "}
                          {shop.items.length} itens
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </aside>

            <section className="min-h-0 overflow-y-auto p-3 sm:p-4">
              {!selectedShop ? (
                <p className="text-sm italic text-[var(--color-ink-soft)]">
                  Selecione ou crie uma loja para gerenciar o catálogo.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedShop.description ? (
                    <p className="text-sm text-[var(--color-ink-muted)]">
                      {selectedShop.description}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => void handleToggleOpen(selectedShop)}
                      className="border px-2.5 py-1.5 text-[11px]"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        borderColor: "var(--color-crimson)",
                        backgroundColor: selectedShop.isOpen
                          ? "var(--color-crimson)"
                          : "var(--color-parchment)",
                        color: selectedShop.isOpen
                          ? "var(--color-ink-inverse)"
                          : "var(--color-crimson)",
                      }}
                    >
                      {selectedShop.isOpen
                        ? "Ocultar dos jogadores"
                        : "Mostrar aos jogadores"}
                    </button>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => setShowAddItem((v) => !v)}
                      className="border px-2.5 py-1.5 text-[11px] text-[var(--color-ink)]"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-parchment)",
                      }}
                    >
                      {showAddItem ? "Cancelar item" : "Adicionar item"}
                    </button>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => void handleDeleteShop(selectedShop)}
                      className="border px-2.5 py-1.5 text-[11px] text-[var(--color-crimson)]"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-parchment)",
                      }}
                    >
                      Excluir loja
                    </button>
                  </div>

                  {showAddItem ? (
                    <div
                      className="space-y-1.5 border p-2.5"
                      style={{
                        borderColor: "var(--color-border-wood)",
                        backgroundColor: "var(--color-parchment-soft)",
                      }}
                    >
                      <p
                        className="text-[11px] text-[var(--color-ink)]"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontWeight: 600,
                        }}
                      >
                        Novo item
                      </p>
                      <input
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Nome"
                        className="w-full border px-2 py-1 text-sm outline-none"
                        style={fieldStyle}
                      />
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          value={itemPrice}
                          onChange={(e) => setItemPrice(e.target.value)}
                          placeholder="Preço"
                          className="border px-2 py-1 text-sm outline-none"
                          style={fieldStyle}
                        />
                        <select
                          value={itemCategory}
                          onChange={(e) => setItemCategory(e.target.value)}
                          className="border px-2 py-1 text-sm outline-none"
                          style={fieldStyle}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        placeholder="Descrição"
                        rows={2}
                        className="w-full border px-2 py-1 text-sm outline-none"
                        style={fieldStyle}
                      />
                      <input
                        value={itemExtra}
                        onChange={(e) => setItemExtra(e.target.value)}
                        placeholder="Info extra"
                        className="w-full border px-2 py-1 text-sm outline-none"
                        style={fieldStyle}
                      />
                      <label className="flex items-center gap-2 text-[11px] text-[var(--color-ink-muted)]">
                        <input
                          type="checkbox"
                          checked={itemUnlimited}
                          onChange={(e) => setItemUnlimited(e.target.checked)}
                        />
                        Estoque ilimitado
                      </label>
                      {!itemUnlimited && (
                        <input
                          type="number"
                          min={0}
                          value={itemQty}
                          onChange={(e) => setItemQty(e.target.value)}
                          placeholder="Quantidade"
                          className="w-full border px-2 py-1 text-sm outline-none"
                          style={fieldStyle}
                        />
                      )}
                      <input
                        value={itemImageUrl}
                        onChange={(e) => setItemImageUrl(e.target.value)}
                        placeholder="URL da imagem"
                        className="w-full border px-2 py-1 text-sm outline-none"
                        style={fieldStyle}
                      />
                      <RibbonButton
                        type="button"
                        className="w-full"
                        disabled={locked}
                        onClick={() => void handleAddItem()}
                      >
                        Salvar item
                      </RibbonButton>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <p
                      className="text-[11px] text-[var(--color-ink)]"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontWeight: 600,
                      }}
                    >
                      Itens à venda ({selectedShop.items.length})
                    </p>
                    {selectedShop.items.length === 0 ? (
                      <p className="text-xs italic text-[var(--color-ink-soft)]">
                        Nenhum item nesta loja. Adicione o primeiro.
                      </p>
                    ) : null}
                    {selectedShop.items.map((item) => {
                      const soldOut = isItemSoldOut(item);
                      return (
                        <div
                          key={item.id}
                          className="flex gap-2 border p-2"
                          style={{
                            borderColor: "var(--color-border)",
                            backgroundColor: "var(--color-parchment)",
                            opacity: soldOut ? 0.72 : 1,
                          }}
                        >
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="h-14 w-14 shrink-0 object-cover"
                              style={{
                                border: "1px solid var(--color-border)",
                              }}
                            />
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-sm text-[var(--color-ink)]"
                              style={{
                                fontFamily: "'Cinzel', serif",
                                fontWeight: 600,
                              }}
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
                              {item.unlimitedStock
                                ? " · ∞"
                                : ` · estoque ${item.quantity ?? 0}`}
                              {!item.available ? " · oculto" : ""}
                            </p>
                            {item.description ? (
                              <p className="text-xs text-[var(--color-ink-muted)]">
                                {item.description}
                              </p>
                            ) : null}
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              <button
                                type="button"
                                disabled={locked || soldOut}
                                onClick={() =>
                                  setDeliverTarget({
                                    shop: selectedShop,
                                    item,
                                  })
                                }
                                className="border px-2 py-1 text-[10px] text-[var(--color-ink-inverse)]"
                                style={{
                                  fontFamily: "'Cinzel', serif",
                                  borderColor: "var(--color-crimson)",
                                  backgroundColor: "var(--color-crimson)",
                                  opacity: soldOut ? 0.5 : 1,
                                }}
                              >
                                Entregar
                              </button>
                              <button
                                type="button"
                                disabled={locked}
                                onClick={() =>
                                  void handleToggleItemAvailable(
                                    selectedShop,
                                    item
                                  )
                                }
                                className="border px-2 py-1 text-[10px]"
                                style={fieldStyle}
                              >
                                {item.available ? "Ocultar" : "Disponibilizar"}
                              </button>
                              <button
                                type="button"
                                disabled={locked}
                                onClick={() =>
                                  void handleDeleteItem(selectedShop, item)
                                }
                                className="border px-2 py-1 text-[10px] text-[var(--color-crimson)]"
                                style={fieldStyle}
                              >
                                Excluir
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {deliverTarget ? (
        <DeliverItemModal
          campaignId={campaignId}
          shop={deliverTarget.shop}
          item={deliverTarget.item}
          characters={characters}
          onClose={() => setDeliverTarget(null)}
          onDelivered={async (result) => {
            setDeliverTarget(null);
            onCharacterUpdated?.(result.character);
            await onRefresh();
            onMessage?.("Item entregue ao personagem.");
          }}
        />
      ) : null}
    </>
  );
}
