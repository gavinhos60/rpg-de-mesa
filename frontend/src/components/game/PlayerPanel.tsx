import { useCallback, useEffect, useState } from "react";
import type { CampaignCharacterLite } from "../../types/game";
import type { BoardTool } from "./GameBoard";
import { RibbonButton } from "../icons/MedievalIcons";
import { ShopBrowser } from "./ShopBrowser";
import { NotesPlayerModal } from "./NotesPlayerModal";
import type { Shop } from "../../types/mercado";
import type { PlayerNote } from "../../types/notes";
import {
  createNote,
  deleteNote,
  listNotes,
  updateNote,
} from "../../services/notes.service";

const fieldStyle = {
  backgroundColor: "var(--color-parchment)",
  borderColor: "var(--color-border)",
  color: "var(--color-ink)",
} as const;

type PlayerTab = "jogo" | "anotacoes";

interface PlayerPanelProps {
  campaignId: number;
  tool: BoardTool;
  myCharacters: CampaignCharacterLite[];
  onToolChange: (tool: BoardTool) => void;
  onOpenSheet: (character: CampaignCharacterLite) => void;
  onClearMyAnnotations?: () => void;
  shops?: Shop[];
  onOpenShops?: () => void;
}

export function PlayerPanel({
  campaignId,
  tool,
  myCharacters,
  onToolChange,
  onOpenSheet,
  onClearMyAnnotations,
  shops = [],
  onOpenShops,
}: PlayerPanelProps) {
  const [tab, setTab] = useState<PlayerTab>("jogo");
  const [notes, setNotes] = useState<PlayerNote[]>([]);
  const [notesOpen, setNotesOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const tools: Array<{ id: BoardTool; label: string }> = [
    { id: "select", label: "Mover" },
    { id: "ruler", label: "Régua" },
    { id: "effect", label: "Efeitos" },
    { id: "draw", label: "Desenhar" },
  ];

  const refreshNotes = useCallback(async () => {
    const items = await listNotes(campaignId);
    setNotes(items);
  }, [campaignId]);

  useEffect(() => {
    void refreshNotes().catch((err) => {
      console.error(err);
      setMessage("Falha ao carregar anotações.");
    });
  }, [refreshNotes]);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setBody("");
  }

  async function handleSaveNote() {
    if (!body.trim()) {
      setMessage("Escreva o texto da anotação.");
      return;
    }
    try {
      setBusy(true);
      setMessage("");
      if (editingId != null) {
        await updateNote(campaignId, editingId, {
          title: title.trim(),
          body: body.trim(),
        });
        setMessage("Anotação atualizada.");
      } else {
        await createNote(campaignId, {
          title: title.trim(),
          body: body.trim(),
        });
        setMessage("Anotação salva.");
      }
      resetForm();
      await refreshNotes();
    } catch (err) {
      console.error(err);
      setMessage("Erro ao salvar anotação.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteNote(note: PlayerNote) {
    if (!window.confirm("Excluir esta anotação?")) return;
    try {
      setBusy(true);
      await deleteNote(campaignId, note.id);
      if (editingId === note.id) resetForm();
      await refreshNotes();
      setMessage("Anotação excluída.");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao excluir anotação.");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(note: PlayerNote) {
    setEditingId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setNotesOpen(false);
    setTab("anotacoes");
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col border"
      style={{
        borderColor: "var(--color-border-strong)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div>
          <h3
            className="text-lg text-[var(--color-ink)]"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
          >
            Painel do Jogador
          </h3>
          <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
            Arraste sua ficha para o mapa para criar um token (pode ter vários).
            A Régua abre o painel Medir (formas, snap e transmissão).
          </p>
        </div>

        <div className="flex gap-1">
          {(
            [
              { id: "jogo", label: "Jogo" },
              { id: "anotacoes", label: "Anotações" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className="flex-1 border px-2 py-1.5 text-[11px]"
              style={{
                fontFamily: "'Cinzel', serif",
                borderColor:
                  tab === item.id
                    ? "var(--color-crimson)"
                    : "var(--color-border)",
                backgroundColor:
                  tab === item.id
                    ? "color-mix(in srgb, var(--color-crimson) 14%, var(--color-parchment))"
                    : "var(--color-parchment)",
                color:
                  tab === item.id
                    ? "var(--color-crimson)"
                    : "var(--color-ink-muted)",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "jogo" ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onToolChange(item.id)}
                  className="border px-2 py-2 text-sm"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    borderColor:
                      tool === item.id
                        ? "var(--color-crimson)"
                        : "var(--color-border)",
                    backgroundColor:
                      tool === item.id
                        ? "var(--color-crimson)"
                        : "var(--color-parchment)",
                    color:
                      tool === item.id
                        ? "var(--color-ink-inverse)"
                        : "var(--color-ink-muted)",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {onClearMyAnnotations && (
              <button
                type="button"
                onClick={onClearMyAnnotations}
                className="w-full border px-3 py-2 text-sm text-[var(--color-ink-muted)]"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-parchment)",
                }}
              >
                Remover minhas marcações
              </button>
            )}

            <div className="space-y-3">
              <p className="text-xs text-[var(--color-ink-soft)]">
                Arraste a ficha até o mapa (ou clique para abrir).
              </p>
              {myCharacters.length === 0 && (
                <p className="text-sm italic text-[var(--color-ink-soft)]">
                  Você ainda não tem ficha nesta campanha.
                </p>
              )}
              {myCharacters.map((character) => (
                <div
                  key={character.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData(
                      "application/x-rpg-character",
                      String(character.id)
                    );
                    event.dataTransfer.effectAllowed = "copy";
                  }}
                  className="flex cursor-grab flex-col items-center gap-2 active:cursor-grabbing"
                >
                  <RibbonButton
                    type="button"
                    className="w-full"
                    onClick={() => onOpenSheet(character)}
                  >
                    Minha ficha: {character.name}
                  </RibbonButton>
                  {character.avatar ? (
                    <div
                      className="flex h-40 w-28 items-center justify-center overflow-hidden"
                      style={{
                        border: "1px solid #A67C3D",
                        backgroundColor: "#1A140F",
                      }}
                    >
                      <img
                        src={character.avatar}
                        alt={character.name}
                        draggable={false}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex h-40 w-28 items-center justify-center text-sm text-[var(--color-ink-soft)]"
                      style={{
                        border: "1px solid #A67C3D",
                        backgroundColor: "var(--color-parchment)",
                        fontFamily: "'Cinzel', serif",
                      }}
                    >
                      Sem foto
                    </div>
                  )}
                </div>
              ))}
            </div>

            {shops.some((s) => s.isOpen) ? (
              <div className="space-y-2">
                <RibbonButton
                  type="button"
                  className="w-full"
                  onClick={() => onOpenShops?.()}
                >
                  Ver mercado
                </RibbonButton>
                <div
                  className="rounded border"
                  style={{
                    borderColor: "var(--color-border-strong)",
                    backgroundColor: "var(--color-parchment-soft)",
                  }}
                >
                  <ShopBrowser shops={shops} compact />
                </div>
              </div>
            ) : null}
          </>
        ) : (
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
                {editingId != null ? "Editar anotação" : "Nova anotação"}
              </h4>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título (opcional)"
                className="mb-2 w-full border px-2 py-1.5 text-sm outline-none"
                style={fieldStyle}
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Escreva sua anotação da campanha…"
                rows={6}
                className="mb-2 w-full resize-y border px-2 py-1.5 text-sm outline-none"
                style={fieldStyle}
              />
              <div className="flex gap-2">
                <RibbonButton
                  type="button"
                  className="flex-1"
                  disabled={busy}
                  onClick={() => void handleSaveNote()}
                >
                  {editingId != null ? "Salvar" : "Adicionar"}
                </RibbonButton>
                {editingId != null ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="border px-2 py-1 text-xs"
                    style={fieldStyle}
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
              {message ? (
                <p className="mt-2 text-[11px] text-[var(--color-ink-muted)]">
                  {message}
                </p>
              ) : null}
            </section>

            <p className="text-xs text-[var(--color-ink-soft)]">
              {notes.length === 0
                ? "Você ainda não tem anotações nesta campanha."
                : `${notes.length} anotação(ões) salva(s).`}
            </p>

            <RibbonButton
              type="button"
              className="w-full"
              onClick={() => setNotesOpen(true)}
            >
              Ver todas as anotações
            </RibbonButton>
          </div>
        )}
      </div>

      {notesOpen ? (
        <NotesPlayerModal
          notes={notes}
          busy={busy}
          onClose={() => setNotesOpen(false)}
          onEdit={startEdit}
          onDelete={(note) => void handleDeleteNote(note)}
        />
      ) : null}
    </div>
  );
}
