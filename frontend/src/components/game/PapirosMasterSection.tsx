import { useCallback, useEffect, useState } from "react";
import type { CampaignCharacterLite } from "../../types/game";
import type { Papyrus } from "../../types/papiros";
import type { Shop, ShopDelivery } from "../../types/mercado";
import {
  createPapyrus,
  deletePapyrus,
  listPapiros,
  publishPapyrus,
  updatePapyrus,
} from "../../services/papiros.service";
import {
  createShop,
  listDeliveries,
  listShops,
} from "../../services/mercado.service";
import { MercadoMasterModal } from "./MercadoMasterModal";
import { RibbonButton } from "../icons/MedievalIcons";

const fieldStyle = {
  backgroundColor: "var(--color-parchment)",
  borderColor: "var(--color-border)",
} as const;

type SubSection = "documentos" | "mercado";

interface PapirosMasterSectionProps {
  campaignId: number;
  characters: CampaignCharacterLite[];
  onCharacterUpdated?: (character: CampaignCharacterLite) => void;
  onPreviewPapyrus?: (papyrus: Papyrus) => void;
}

function readImageAsDataUrl(file: File, maxSize = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const src = String(reader.result || "");
      const img = new Image();
      img.onerror = () => reject(new Error("image decode failed"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

export function PapirosMasterSection({
  campaignId,
  characters,
  onCharacterUpdated,
  onPreviewPapyrus,
}: PapirosMasterSectionProps) {
  const [sub, setSub] = useState<SubSection>("documentos");
  const [papyri, setPapyri] = useState<Papyrus[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [deliveries, setDeliveries] = useState<ShopDelivery[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [marketOpen, setMarketOpen] = useState(false);
  const [marketFocusShopId, setMarketFocusShopId] = useState<number | null>(
    null
  );

  const refresh = useCallback(async () => {
    const [nextPapyri, nextShops, nextDeliveries] = await Promise.all([
      listPapiros(campaignId),
      listShops(campaignId),
      listDeliveries(campaignId).catch(() => [] as ShopDelivery[]),
    ]);
    setPapyri(nextPapyri);
    setShops(nextShops);
    setDeliveries(nextDeliveries);
  }, [campaignId]);

  useEffect(() => {
    void refresh().catch((err) => {
      console.error(err);
      setMessage("Falha ao carregar papiros/mercado.");
    });
  }, [refresh]);

  function resetPapyrusForm() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setImageUrl("");
  }

  async function handleSavePapyrus() {
    if (!title.trim() || !body.trim()) {
      setMessage("Título e texto são obrigatórios.");
      return;
    }
    try {
      setBusy(true);
      setMessage("");
      if (editingId != null) {
        await updatePapyrus(campaignId, editingId, {
          title: title.trim(),
          body: body.trim(),
          imageUrl: imageUrl.trim() || null,
        });
      } else {
        await createPapyrus(campaignId, {
          title: title.trim(),
          body: body.trim(),
          imageUrl: imageUrl.trim() || null,
          published: false,
        });
      }
      resetPapyrusForm();
      await refresh();
      setMessage(editingId != null ? "Papiro atualizado." : "Papiro criado.");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao salvar papiro.");
    } finally {
      setBusy(false);
    }
  }

  async function handleTogglePublish(papyrus: Papyrus) {
    try {
      setBusy(true);
      await publishPapyrus(campaignId, papyrus.id, !papyrus.published);
      await refresh();
    } catch (err) {
      console.error(err);
      setMessage("Erro ao publicar/recolher.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeletePapyrus(id: number) {
    if (!window.confirm("Excluir este papiro?")) return;
    try {
      setBusy(true);
      await deletePapyrus(campaignId, id);
      if (editingId === id) resetPapyrusForm();
      await refresh();
    } catch (err) {
      console.error(err);
      setMessage("Erro ao excluir papiro.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateShop() {
    if (!shopName.trim()) {
      setMessage("Nome da loja é obrigatório.");
      return;
    }
    try {
      setBusy(true);
      const shop = await createShop(campaignId, {
        name: shopName.trim(),
        description: shopDescription.trim() || null,
        isOpen: false,
      });
      setShopName("");
      setShopDescription("");
      await refresh();
      setMarketFocusShopId(shop.id);
      setMarketOpen(true);
      setMessage(`Loja "${shop.name}" criada.`);
    } catch (err) {
      console.error(err);
      setMessage("Erro ao criar loja.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {(
          [
            { id: "documentos", label: "Documentos" },
            { id: "mercado", label: "Mercado" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSub(tab.id)}
            className="flex-1 border px-2 py-1.5 text-[11px]"
            style={{
              fontFamily: "'Cinzel', serif",
              borderColor:
                sub === tab.id ? "var(--color-crimson)" : "var(--color-border)",
              backgroundColor:
                sub === tab.id
                  ? "color-mix(in srgb, var(--color-crimson) 14%, var(--color-parchment))"
                  : "var(--color-parchment)",
              color:
                sub === tab.id ? "var(--color-crimson)" : "var(--color-ink-muted)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message ? (
        <p className="text-xs text-[var(--color-ink-soft)]">{message}</p>
      ) : null}

      {sub === "documentos" && (
        <div className="space-y-3">
          <section
            className="rounded border p-2.5"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-parchment-soft)",
            }}
          >
            <h4
              className="mb-2 text-xs tracking-wide text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              {editingId != null ? "Editar papiro" : "Novo papiro"}
            </h4>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              className="mb-2 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Texto do documento…"
              rows={5}
              className="mb-2 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
            />
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL da imagem (opcional)"
              className="mb-2 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
            />
            <label className="mb-2 block text-[11px] text-[var(--color-ink-soft)]">
              Ou enviar imagem
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-xs"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  void readImageAsDataUrl(file)
                    .then(setImageUrl)
                    .catch(() => setMessage("Falha ao ler imagem."));
                }}
              />
            </label>
            <div className="flex gap-2">
              <RibbonButton
                type="button"
                className="flex-1"
                disabled={busy}
                onClick={() => void handleSavePapyrus()}
              >
                {editingId != null ? "Salvar" : "Criar"}
              </RibbonButton>
              {editingId != null ? (
                <button
                  type="button"
                  onClick={resetPapyrusForm}
                  className="border px-2 py-1 text-xs"
                  style={fieldStyle}
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </section>

          <section className="space-y-2">
            <h4
              className="text-xs tracking-wide text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              Biblioteca ({papyri.length})
            </h4>
            {papyri.length === 0 && (
              <p className="text-xs italic text-[var(--color-ink-soft)]">
                Nenhum papiro ainda.
              </p>
            )}
            {papyri.map((papyrus) => (
              <div
                key={papyrus.id}
                className="rounded border p-2"
                style={{
                  borderColor: papyrus.published
                    ? "var(--color-crimson)"
                    : "var(--color-border)",
                  backgroundColor: "var(--color-parchment)",
                }}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div>
                    <p
                      className="text-sm text-[var(--color-ink)]"
                      style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                    >
                      {papyrus.title}
                    </p>
                    <p className="text-[10px] text-[var(--color-ink-soft)]">
                      {papyrus.published ? "Publicado" : "Rascunho"}
                    </p>
                  </div>
                </div>
                <p className="mb-2 line-clamp-2 text-xs text-[var(--color-ink-muted)]">
                  {papyrus.body}
                </p>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleTogglePublish(papyrus)}
                    className="border px-2 py-1 text-[10px]"
                    style={{
                      borderColor: "var(--color-crimson)",
                      backgroundColor: papyrus.published
                        ? "var(--color-crimson)"
                        : "var(--color-parchment)",
                      color: papyrus.published
                        ? "var(--color-ink-inverse)"
                        : "var(--color-crimson)",
                      fontFamily: "'Cinzel', serif",
                    }}
                  >
                    {papyrus.published ? "Recolher" : "Publicar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onPreviewPapyrus?.(papyrus)}
                    className="border px-2 py-1 text-[10px]"
                    style={fieldStyle}
                  >
                    Prévia
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(papyrus.id);
                      setTitle(papyrus.title);
                      setBody(papyrus.body);
                      setImageUrl(papyrus.imageUrl ?? "");
                    }}
                    className="border px-2 py-1 text-[10px]"
                    style={fieldStyle}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleDeletePapyrus(papyrus.id)}
                    className="border px-2 py-1 text-[10px] text-[var(--color-crimson)]"
                    style={fieldStyle}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {sub === "mercado" && (
        <div className="space-y-3">
          <section
            className="rounded border p-2.5"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-parchment-soft)",
            }}
          >
            <h4
              className="mb-2 text-xs tracking-wide text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              Nova loja
            </h4>
            <input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Nome da loja"
              className="mb-2 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
            />
            <input
              value={shopDescription}
              onChange={(e) => setShopDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              className="mb-2 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
            />
            <RibbonButton
              type="button"
              className="w-full"
              disabled={busy}
              onClick={() => void handleCreateShop()}
            >
              Criar loja
            </RibbonButton>
          </section>

          <RibbonButton
            type="button"
            className="w-full"
            disabled={busy}
            onClick={() => {
              setMarketFocusShopId(shops[0]?.id ?? null);
              setMarketOpen(true);
            }}
          >
            Ver lojas ({shops.length})
          </RibbonButton>

          <section
            className="rounded border p-2.5"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-parchment-soft)",
            }}
          >
            <h4
              className="mb-2 text-xs tracking-wide text-[var(--color-ink)]"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              Histórico de entregas
            </h4>
            {deliveries.length === 0 && (
              <p className="text-xs italic text-[var(--color-ink-soft)]">
                Nenhuma entrega registrada.
              </p>
            )}
            <ul className="max-h-48 space-y-1.5 overflow-y-auto">
              {deliveries.slice(0, 40).map((d) => (
                <li
                  key={d.id}
                  className="border-b pb-1 text-[11px] text-[var(--color-ink-muted)]"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span className="text-[var(--color-ink)]">
                    {d.shopItemName} ×{d.quantity}
                  </span>
                  {" → "}
                  {d.characterName}
                  <span className="block text-[10px] text-[var(--color-ink-soft)]">
                    {d.shopName} · {d.deliveredByName} ·{" "}
                    {new Date(d.createdAt).toLocaleString("pt-BR")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {marketOpen ? (
        <MercadoMasterModal
          campaignId={campaignId}
          shops={shops}
          characters={characters}
          initialShopId={marketFocusShopId}
          busy={busy}
          onRefresh={refresh}
          onClose={() => setMarketOpen(false)}
          onCharacterUpdated={onCharacterUpdated}
          onMessage={setMessage}
        />
      ) : null}
    </div>
  );
}
