import type { CampaignCharacterLite } from "../../types/game";
import type { BoardTool } from "./GameBoard";
import { RibbonButton } from "../icons/MedievalIcons";

interface PlayerPanelProps {
  tool: BoardTool;
  myCharacters: CampaignCharacterLite[];
  onToolChange: (tool: BoardTool) => void;
  onOpenSheet: (character: CampaignCharacterLite) => void;
  onClearMyAnnotations?: () => void;
}

export function PlayerPanel({
  tool,
  myCharacters,
  onToolChange,
  onOpenSheet,
  onClearMyAnnotations,
}: PlayerPanelProps) {
  const tools: Array<{ id: BoardTool; label: string }> = [
    { id: "select", label: "Mover" },
    { id: "ruler", label: "Régua" },
    { id: "draw", label: "Desenhar" },
  ];

  return (
    <div
      className="flex h-full min-h-0 flex-col border"
      style={{ borderColor: "var(--color-border-strong)", backgroundColor: "var(--color-surface)" }}
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

        <div className="grid grid-cols-2 gap-2">
          {tools.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onToolChange(item.id)}
              className="border px-2 py-2 text-sm"
              style={{
                fontFamily: "'Cinzel', serif",
                borderColor: tool === item.id ? "var(--color-crimson)" : "var(--color-border)",
                backgroundColor: tool === item.id ? "var(--color-crimson)" : "var(--color-parchment)",
                color: tool === item.id ? "var(--color-ink-inverse)" : "var(--color-ink-muted)",
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
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment)" }}
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
              className="flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing"
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
      </div>
    </div>
  );
}
