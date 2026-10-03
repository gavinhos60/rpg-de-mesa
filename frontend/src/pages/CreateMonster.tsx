import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MonsterForm, type MonsterFormValue } from "../components/monster/MonsterForm";
import { emptyCustomMonsterSheet } from "../types/customMonster";
import {
  createMonster,
  getMonsterById,
  updateMonster,
} from "../services/monster.service";

export function CreateMonster() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editId = id && id !== "new" ? Number(id) : null;
  const isEdit = editId != null && Number.isFinite(editId);

  const [initial, setInitial] = useState<MonsterFormValue | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isEdit || editId == null) {
      setInitial({
        name: "",
        avatar: null,
        sheet: emptyCustomMonsterSheet(),
      });
      return;
    }
    void (async () => {
      try {
        setLoading(true);
        const monster = await getMonsterById(editId);
        setInitial({
          name: monster.name,
          avatar: monster.avatar ?? null,
          sheet: {
            ...emptyCustomMonsterSheet(),
            ...(monster.sheet ?? {}),
            abilities: {
              ...emptyCustomMonsterSheet().abilities,
              ...(monster.sheet?.abilities ?? {}),
            },
            traits: monster.sheet?.traits ?? [],
            actions: monster.sheet?.actions ?? [],
          },
        });
      } catch (err) {
        console.error(err);
        alert("Monstro não encontrado.");
        navigate("/monsters");
      } finally {
        setLoading(false);
      }
    })();
  }, [editId, isEdit, navigate]);

  async function handleSubmit(value: MonsterFormValue) {
    setBusy(true);
    try {
      if (isEdit && editId != null) {
        await updateMonster(editId, {
          name: value.name,
          avatar: value.avatar,
          sheet: value.sheet,
        });
        navigate(`/monsters/${editId}`);
      } else {
        const created = await createMonster({
          name: value.name,
          avatar: value.avatar,
          sheet: value.sheet,
        });
        navigate(`/monsters/${created.id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Não foi possível salvar o monstro.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !initial) {
    return (
      <div
        className="p-10 text-[var(--color-ink-muted)]"
        style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
      >
        Carregando formulário...
      </div>
    );
  }

  return (
    <div
      className="min-h-full text-[var(--color-ink)]"
      style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        backgroundColor: "var(--color-parchment)",
      }}
    >
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-6 border-b border-[var(--color-border-strong)] pb-4">
          <h1
            className="text-2xl text-[var(--color-ink)]"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
          >
            {isEdit ? "Editar monstro" : "Novo monstro"}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Preencha a ficha como no manual — o mestre poderá colocar o token na
            mesa.
          </p>
        </header>
        <MonsterForm
          key={isEdit ? `edit-${editId}` : "new"}
          initial={initial}
          submitLabel={isEdit ? "Salvar alterações" : "Criar monstro"}
          busy={busy}
          onSubmit={handleSubmit}
          onCancel={() => navigate(isEdit ? `/monsters/${editId}` : "/monsters")}
        />
      </div>
    </div>
  );
}
