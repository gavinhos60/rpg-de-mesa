import { useEffect, useMemo, useState } from "react";
import type { CharacterFormData } from "../../types/character";
import { DND_CLASSES } from "../../data/dnd/classes";
import { CharacterAsiChoices } from "./CharacterAsiChoices";
import { CharacterSpells } from "./CharacterSpells";
import { CharacterWarlockChoices } from "./CharacterWarlockChoices";
import {
  applyClassLevelIncrease,
  applyNewClass,
  getAvailableNewClassIds,
  getLeveledClassLabel,
  getLevelUpIssues,
  getNewAbilitiesAtClassLevel,
  getNewAsiMilestones,
  getTotalLevel,
  levelUpEligibleClassIndices,
  needsSubclassChoice,
} from "../../utils/levelUp";
import {
  getFourElementsDisciplineLimit,
  getSelectedElementalDisciplines,
  getChoosableElementalDisciplines,
  getFixedElementalDisciplines,
  getElementalDiscipline,
  FOUR_ELEMENTS_DISCIPLINE_KEY,
} from "../../data/dnd/elementalDisciplines";

interface CharacterLevelUpModalProps {
  open: boolean;
  data: CharacterFormData;
  busy?: boolean;
  onClose: () => void;
  onConfirm: (updated: CharacterFormData) => Promise<void>;
}

type Step = "class" | "subclass" | "rewards";

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = {
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-border-strong)",
};

export function CharacterLevelUpModal({
  open,
  data,
  busy = false,
  onClose,
  onConfirm,
}: CharacterLevelUpModalProps) {
  const [draft, setDraft] = useState(data);
  const [step, setStep] = useState<Step>("class");
  const [classIndex, setClassIndex] = useState<number | null>(null);
  const [baseData, setBaseData] = useState(data);

  useEffect(() => {
    if (!open) return;
    setBaseData(data);
    setDraft(data);
    setStep("class");
    setClassIndex(null);
  }, [open, data]);

  const eligible = levelUpEligibleClassIndices(data);
  const newClassIds = getAvailableNewClassIds(data);
  const issues = useMemo(
    () => (classIndex != null ? getLevelUpIssues(baseData, draft) : []),
    [baseData, draft, classIndex]
  );

  const leveledSelection =
    classIndex != null ? draft.classes[classIndex] : undefined;
  const newAbilities =
    leveledSelection && classIndex != null
      ? getNewAbilitiesAtClassLevel(
          leveledSelection.classId,
          leveledSelection.subclassId,
          leveledSelection.level
        )
      : [];
  const newAsi = getNewAsiMilestones(baseData, draft);
  const needsSpells = issues.some(
    (issue) =>
      issue.includes("truques") ||
      issue.includes("magias") ||
      issue.includes("grimório") ||
      issue.includes("Prepare") ||
      issue.includes("Arcano")
  );
  const needsFourElements = issues.some((issue) =>
    issue.includes("Discípulo dos Elementos")
  );
  const needsWarlockChoices = issues.some(
    (issue) =>
      issue.includes("Invocação") ||
      issue.includes("Invocações") ||
      issue.includes("Dádiva de Pacto") ||
      issue.includes("Pacto da Lâmina") ||
      issue.includes("Pacto do Tomo") ||
      issue.includes("Livro dos Segredos") ||
      issue.includes("Bebedor de Vida") ||
      issue.includes("Guerreiro Hexagonal") ||
      issue.includes("arma de pacto") ||
      issue.includes("Truques do Tomo")
  );
  const monkFourElements = draft.classes.find(
    (item) =>
      item.classId === "monk" && item.subclassId === "way-of-four-elements"
  );
  const warlockSelection = draft.classes.find((item) => item.classId === "warlock");

  if (!open) return null;

  function proceedAfterClassPick(next: CharacterFormData, index: number) {
    setDraft(next);
    setClassIndex(index);
    const selection = next.classes[index];
    setStep(needsSubclassChoice(selection) ? "subclass" : "rewards");
  }

  function pickClass(index: number) {
    proceedAfterClassPick(applyClassLevelIncrease(baseData, index), index);
  }

  function pickNewClass(classId: string) {
    const next = applyNewClass(baseData, classId);
    proceedAfterClassPick(next, next.classes.length - 1);
  }

  function updateSubclass(subclassId: string) {
    if (classIndex == null) return;
    setDraft((previous) => ({
      ...previous,
      classes: previous.classes.map((selection, index) =>
        index === classIndex ? { ...selection, subclassId } : selection
      ),
    }));
    setStep("rewards");
  }

  function goBackToClassPick() {
    setDraft(baseData);
    setClassIndex(null);
    setStep("class");
  }

  async function handleSave() {
    if (issues.length > 0) return;
    await onConfirm(draft);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[color:var(--color-overlay)] px-4 py-6">
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col border-2"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-wood)" }}
      >
        <div
          className="flex items-start justify-between gap-3 border-b px-5 py-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            <h3
              className="text-xl text-[var(--color-ink)]"
              style={{ ...cinzel, fontWeight: 600 }}
            >
              Subir de nível
            </h3>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Nível {getTotalLevel(baseData)} → {getTotalLevel(draft) || getTotalLevel(baseData) + 1}
            </p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="text-xl text-[var(--color-border-strong)]"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {step === "class" && (
            <section className="space-y-6">
              <p className="text-sm text-[var(--color-ink-muted)]">
                Escolha subir uma classe que o personagem já possui ou adicionar uma
                nova classe (multiclasse).
              </p>

              {eligible.length > 0 && (
                <div>
                  <h4
                    className="mb-3 text-sm uppercase tracking-wide text-[var(--color-ink-soft)]"
                    style={cinzel}
                  >
                    Subir classe existente
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {eligible.map((index) => {
                      const selection = data.classes[index];
                      const label = getLeveledClassLabel(selection);
                      const willPickSubclass = needsSubclassChoice({
                        ...selection,
                        level: selection.level + 1,
                      });

                      return (
                        <button
                          key={index}
                          type="button"
                          disabled={busy}
                          onClick={() => pickClass(index)}
                          className="border p-4 text-left transition-colors hover:border-[var(--color-crimson)] disabled:opacity-50"
                          style={card}
                        >
                          <p
                            className="text-lg text-[var(--color-ink)]"
                            style={{ ...cinzel, fontWeight: 600 }}
                          >
                            {label}
                          </p>
                          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                            Nível {selection.level} → {selection.level + 1}
                            {willPickSubclass ? " · escolher subclasse" : ""}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {newClassIds.length > 0 && (
                <div>
                  <h4
                    className="mb-3 text-sm uppercase tracking-wide text-[var(--color-ink-soft)]"
                    style={cinzel}
                  >
                    Adicionar nova classe
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {newClassIds.map((classId) => {
                      const characterClass = DND_CLASSES.find(
                        (item) => item.id === classId
                      );
                      const needsPatron =
                        characterClass?.subclasses.some(
                          (subclass) => subclass.level <= 1
                        ) ?? false;

                      return (
                        <button
                          key={classId}
                          type="button"
                          disabled={busy}
                          onClick={() => pickNewClass(classId)}
                          className="border p-4 text-left transition-colors hover:border-[var(--color-crimson)] disabled:opacity-50"
                          style={card}
                        >
                          <p
                            className="text-lg text-[var(--color-ink)]"
                            style={{ ...cinzel, fontWeight: 600 }}
                          >
                            {characterClass?.name ?? classId}
                          </p>
                          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                            Entrar no nível 1
                            {needsPatron ? " · escolher subclasse/patrono" : ""}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {eligible.length === 0 && newClassIds.length === 0 && (
                <p className="text-sm text-[var(--color-crimson)]">
                  Nenhuma opção de progressão disponível.
                </p>
              )}
            </section>
          )}

          {step === "subclass" && classIndex != null && (
            <section>
              <p className="mb-4 text-sm text-[var(--color-ink-muted)]">
                {draft.classes[classIndex].level === 1
                  ? "Escolha a subclasse ou patrono desta classe."
                  : "Este nível desbloqueia a escolha de subclasse."}
              </p>
              <p
                className="mb-4 text-sm text-[var(--color-ink)]"
                style={{ ...cinzel, fontWeight: 600 }}
              >
                {getLeveledClassLabel(draft.classes[classIndex])} — nível{" "}
                {draft.classes[classIndex].level}
              </p>
              <div className="grid gap-2">
                {(DND_CLASSES.find((item) => item.id === draft.classes[classIndex].classId)
                  ?.subclasses.filter(
                    (subclass) => draft.classes[classIndex].level >= subclass.level
                  ) ?? []
                ).map((subclass) => (
                  <button
                    key={subclass.id}
                    type="button"
                    disabled={busy}
                    onClick={() => updateSubclass(subclass.id)}
                    className="border p-3 text-left transition-colors hover:border-[var(--color-crimson)] disabled:opacity-50"
                    style={card}
                  >
                    <p className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                      {subclass.name}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === "rewards" && (
            <section className="space-y-5">
              {newAbilities.length > 0 && (
                <div className="border p-4" style={card}>
                  <h4 className="mb-3 text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Novas habilidades
                  </h4>
                  <ul className="space-y-2">
                    {newAbilities.map((ability) => (
                      <li
                        key={ability.id}
                        className="border px-3 py-2"
                        style={{
                          borderColor: "var(--color-border)",
                          backgroundColor: "var(--color-parchment)",
                        }}
                      >
                        <p className="text-sm text-[var(--color-ink)]" style={cinzel}>
                          {ability.name}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[var(--color-ink-muted)]">
                          {ability.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {newAsi.length > 0 && (
                <CharacterAsiChoices data={draft} onChange={setDraft} />
              )}

              {needsFourElements && monkFourElements && (
                <FourElementsPicker
                  data={draft}
                  monkLevel={monkFourElements.level}
                  onChange={setDraft}
                />
              )}

              {needsWarlockChoices && warlockSelection && (
                <CharacterWarlockChoices
                  data={draft}
                  onChange={setDraft}
                  warlockLevel={warlockSelection.level}
                />
              )}

              {needsSpells && (
                <div className="border p-4" style={card}>
                  <h4 className="mb-3 text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Magias do nível
                  </h4>
                  <CharacterSpells data={draft} onChange={setDraft} />
                </div>
              )}

              {issues.length > 0 && (
                <ul className="space-y-1 text-sm text-[var(--color-crimson)]">
                  {issues.map((issue) => (
                    <li key={issue}>• {issue}</li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        <div
          className="flex items-center justify-between gap-3 border-t px-5 py-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={onClose}
              className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            >
              Cancelar
            </button>
            {(step === "subclass" || step === "rewards") && (
              <button
                type="button"
                disabled={busy}
                onClick={goBackToClassPick}
                className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              >
                ← Voltar
              </button>
            )}
          </div>
          {step === "rewards" && (
            <button
              type="button"
              disabled={busy || issues.length > 0}
              onClick={() => void handleSave()}
              className="border px-5 py-2 text-sm disabled:opacity-50"
              style={{
                ...cinzel,
                borderColor: "var(--color-crimson)",
                backgroundColor: "var(--color-crimson)",
                color: "var(--color-ink-inverse)",
                fontWeight: 600,
              }}
            >
              {busy ? "Salvando…" : "Confirmar e salvar ficha"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FourElementsPicker({
  data,
  monkLevel,
  onChange,
}: {
  data: CharacterFormData;
  monkLevel: number;
  onChange: (data: CharacterFormData) => void;
}) {
  const limit = getFourElementsDisciplineLimit(monkLevel);
  const selected = getSelectedElementalDisciplines(data.featureChoices);
  const fixed = getFixedElementalDisciplines();
  const options = getChoosableElementalDisciplines(monkLevel);

  function toggle(disciplineId: string) {
    const current = getSelectedElementalDisciplines(data.featureChoices);
    const next = current.includes(disciplineId)
      ? current.filter((id) => id !== disciplineId)
      : current.length >= limit
        ? current
        : [...current, disciplineId];

    onChange({
      ...data,
      featureChoices: {
        ...data.featureChoices,
        [FOUR_ELEMENTS_DISCIPLINE_KEY]: next,
      },
    });
  }

  return (
    <div className="border p-4" style={card}>
      <h4 className="mb-2 text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
        Discípulo dos Elementos
      </h4>
      <p className="mb-3 text-sm text-[var(--color-ink-muted)]">
        Escolha {limit} disciplina{limit === 1 ? "" : "s"} ({selected.length}/{limit}).
      </p>
      <div className="mb-3 space-y-2">
        {fixed.map((discipline) => (
          <div
            key={discipline.id}
            className="border px-3 py-2 text-xs"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-parchment)" }}
          >
            {discipline.name} (fixa)
          </div>
        ))}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {options.map((discipline) => {
          const isSelected = selected.includes(discipline.id);
          const disabled = !isSelected && selected.length >= limit;
          return (
            <button
              key={discipline.id}
              type="button"
              disabled={disabled}
              onClick={() => toggle(discipline.id)}
              className="border p-3 text-left disabled:opacity-40"
              style={{
                borderColor: isSelected ? "var(--color-crimson)" : "var(--color-border)",
                backgroundColor: isSelected ? "var(--color-surface)" : "var(--color-parchment)",
              }}
            >
              <span className="text-sm" style={cinzel}>
                {discipline.name}
              </span>
              <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                {getElementalDiscipline(discipline.id)?.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
