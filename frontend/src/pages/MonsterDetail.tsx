import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MonsterSheetDrawer } from "../components/game/MonsterSheetDrawer";
import { RibbonButton } from "../components/icons/MedievalIcons";
import { getMonsterById, type SavedCustomMonster } from "../services/monster.service";
import { customMonsterToMonster } from "../utils/customMonsterAdapter";

export function MonsterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const monsterId = Number(id);
  const [saved, setSaved] = useState<SavedCustomMonster | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(monsterId)) {
      navigate("/monsters");
      return;
    }
    void (async () => {
      try {
        setLoading(true);
        setSaved(await getMonsterById(monsterId));
      } catch (err) {
        console.error(err);
        alert("Monstro não encontrado.");
        navigate("/monsters");
      } finally {
        setLoading(false);
      }
    })();
  }, [monsterId, navigate]);

  if (loading || !saved) {
    return (
      <div
        className="p-10 text-[var(--color-ink-muted)]"
        style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
      >
        Carregando ficha...
      </div>
    );
  }

  const monster = customMonsterToMonster(saved);

  return (
    <div
      className="min-h-full text-[var(--color-ink)]"
      style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        backgroundColor: "var(--color-parchment)",
      }}
    >
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <RibbonButton onClick={() => navigate(`/monsters/${saved.id}/edit`)}>
            Editar
          </RibbonButton>
          <button
            type="button"
            onClick={() => navigate("/monsters")}
            className="border px-4 py-2 text-sm"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-parchment)",
            }}
          >
            Voltar à lista
          </button>
        </div>
      </div>
      <MonsterSheetDrawer
        monster={monster}
        canRoll={false}
        onClose={() => navigate("/monsters")}
      />
    </div>
  );
}
