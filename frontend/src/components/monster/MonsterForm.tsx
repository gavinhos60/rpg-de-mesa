import { useRef, useState } from "react";
import type { MonsterSize } from "../../data/dnd/monsters";
import {
  emptyCustomMonsterAction,
  emptyCustomMonsterSheet,
  normalizeMonsterOptionList,
  type CustomMonsterActionForm,
  type CustomMonsterSheet,
} from "../../types/customMonster";
import { ABILITIES } from "../../data/dnd/abilities";
import { DND_CONDITIONS } from "../../data/dnd/conditions";
import { DND_SKILLS } from "../../data/dnd/skills";
import {
  computeMonsterSkillTotal,
  monsterSkillAbilityMod,
  proficiencyBonusFromCr,
} from "../../utils/monsterSkillBonuses";
import type { MonsterSkillEntry } from "../../types/customMonster";
import {
  MONSTER_DAMAGE_TYPES,
  MONSTER_LANGUAGES,
} from "../../data/dnd/monsterSheetOptions";
import { RibbonButton } from "../icons/MedievalIcons";

const fieldStyle = {
  backgroundColor: "var(--color-parchment)",
  borderColor: "var(--color-border)",
} as const;

const SIZES: MonsterSize[] = [
  "Tiny",
  "Small",
  "Medium",
  "Large",
  "Huge",
  "Gargantuan",
];

const SIZE_LABELS: Record<MonsterSize, string> = {
  Tiny: "Minúsculo",
  Small: "Pequeno",
  Medium: "Médio",
  Large: "Grande",
  Huge: "Enorme",
  Gargantuan: "Imenso",
};

const ABILITY_KEYS = [
  ["strength", "Força"],
  ["dexterity", "Destreza"],
  ["constitution", "Constituição"],
  ["intelligence", "Inteligência"],
  ["wisdom", "Sabedoria"],
  ["charisma", "Carisma"],
] as const;

function readImageAsDataUrl(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const src = String(reader.result ?? "");
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
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

function normalizeSheetInput(sheet: CustomMonsterSheet): CustomMonsterSheet {
  return {
    ...emptyCustomMonsterSheet(),
    ...sheet,
    abilities: {
      ...emptyCustomMonsterSheet().abilities,
      ...sheet.abilities,
    },
    traits: sheet.traits ?? [],
    actions: sheet.actions ?? [],
    reactions: sheet.reactions ?? [],
    legendaryActions: sheet.legendaryActions ?? [],
    skillProficiencies: { ...(sheet.skillProficiencies ?? {}) },
    damageResistances: normalizeMonsterOptionList(sheet.damageResistances),
    damageImmunities: normalizeMonsterOptionList(sheet.damageImmunities),
    conditionImmunities: normalizeMonsterOptionList(sheet.conditionImmunities),
    languages: normalizeMonsterOptionList(sheet.languages),
  };
}

function OptionMultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option]
    );
  }

  return (
    <fieldset
      className="block rounded border p-2 sm:col-span-2"
      style={{ borderColor: "var(--color-border)" }}
    >
      <legend className="px-1 text-xs text-[var(--color-ink-soft)]">{label}</legend>
      <div className="flex max-h-36 flex-wrap gap-x-3 gap-y-1 overflow-y-auto text-xs">
        {options.map((option) => (
          <label key={option} className="inline-flex cursor-pointer items-center gap-1">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
            />
            <span className="text-[var(--color-ink)]">{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function MonsterSkillsEditor({
  sheet,
  onChangeProficiencies,
}: {
  sheet: CustomMonsterSheet;
  onChangeProficiencies: (next: Record<string, MonsterSkillEntry>) => void;
}) {
  const profBonus = proficiencyBonusFromCr(sheet.cr);
  const entries = sheet.skillProficiencies ?? {};

  function patchSkill(skillId: string, patch: Partial<MonsterSkillEntry>) {
    const merged: MonsterSkillEntry = { ...(entries[skillId] ?? {}), ...patch };
    const next = { ...entries, [skillId]: merged };
    if (
      !merged.proficient &&
      !merged.advantage &&
      (merged.extraBonus == null || merged.extraBonus === 0)
    ) {
      delete next[skillId];
    }
    onChangeProficiencies(next);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--color-ink-soft)]">
        Marque proficiência, vantagem e/ou bônus extra. O total usa o modificador
        do atributo (+{profBonus} se proficiente, conforme o ND).
      </p>
      <div
        className="overflow-x-auto rounded border"
        style={{ borderColor: "var(--color-border)" }}
      >
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead
            className="text-[var(--color-ink-soft)]"
            style={{ backgroundColor: "var(--color-parchment-soft)" }}
          >
            <tr>
              <th className="px-2 py-1.5 font-normal">Perícia</th>
              <th className="px-2 py-1.5 font-normal">Mod. attr.</th>
              <th className="px-2 py-1.5 font-normal">Proficiente</th>
              <th className="px-2 py-1.5 font-normal">Vantagem</th>
              <th className="px-2 py-1.5 font-normal">Bônus extra</th>
              <th className="px-2 py-1.5 font-normal">Total</th>
            </tr>
          </thead>
          <tbody>
            {DND_SKILLS.map((skill) => {
              const entry = entries[skill.id];
              const mod = monsterSkillAbilityMod(sheet.abilities, skill.id);
              const modLabel = mod >= 0 ? `+${mod}` : String(mod);
              const total = computeMonsterSkillTotal(sheet, skill.id, entry);
              const totalLabel =
                total != null ? (total >= 0 ? `+${total}` : String(total)) : "—";
              return (
                <tr
                  key={skill.id}
                  className="border-t"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <td className="px-2 py-1 text-[var(--color-ink)]">{skill.name}</td>
                  <td className="px-2 py-1 text-[var(--color-ink-muted)]">{modLabel}</td>
                  <td className="px-2 py-1">
                    <input
                      type="checkbox"
                      checked={Boolean(entry?.proficient)}
                      onChange={(e) =>
                        patchSkill(skill.id, { proficient: e.target.checked })
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="checkbox"
                      checked={Boolean(entry?.advantage)}
                      onChange={(e) =>
                        patchSkill(skill.id, { advantage: e.target.checked })
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={entry?.extraBonus ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        patchSkill(skill.id, {
                          extraBonus: raw ? Number(raw) : undefined,
                        });
                      }}
                      className="w-16 border px-1 py-0.5 text-sm outline-none"
                      style={fieldStyle}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-2 py-1 font-semibold text-[var(--color-crimson)]">
                    {totalLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionListEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: CustomMonsterActionForm[];
  onChange: (next: CustomMonsterActionForm[]) => void;
}) {
  function updateItem(id: string, patch: Partial<CustomMonsterActionForm>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <section
      className="rounded border p-4"
      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3
          className="text-sm text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          {title}
        </h3>
        <button
          type="button"
          onClick={() => onChange([...items, emptyCustomMonsterAction()])}
          className="border px-2 py-1 text-xs text-[var(--color-ink)]"
          style={fieldStyle}
        >
          + Adicionar
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-[var(--color-ink-soft)]">Nenhuma entrada ainda.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="border p-3"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-[var(--color-ink-soft)]">
                  {title} {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-[var(--color-crimson)]"
                >
                  Remover
                </button>
              </div>
              <label className="mb-2 block text-xs text-[var(--color-ink-soft)]">
                Nome
                <input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
                  style={fieldStyle}
                  placeholder="Ex.: Mordida"
                />
              </label>
              <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <label className="block text-xs text-[var(--color-ink-soft)]">
                  Ataque (+)
                  <input
                    value={item.attackBonus ?? ""}
                    onChange={(e) =>
                      updateItem(item.id, { attackBonus: e.target.value })
                    }
                    className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
                    style={fieldStyle}
                    placeholder="+5"
                  />
                </label>
                <label className="block text-xs text-[var(--color-ink-soft)]">
                  Dano
                  <input
                    value={item.damage ?? ""}
                    onChange={(e) => updateItem(item.id, { damage: e.target.value })}
                    className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
                    style={fieldStyle}
                    placeholder="2d6+3 cortante"
                  />
                </label>
                <label className="block text-xs text-[var(--color-ink-soft)]">
                  CD
                  <input
                    value={item.saveDc ?? ""}
                    onChange={(e) => updateItem(item.id, { saveDc: e.target.value })}
                    className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
                    style={fieldStyle}
                    placeholder="14"
                  />
                </label>
                <label className="block text-xs text-[var(--color-ink-soft)]">
                  Salvaguarda
                  <select
                    value={item.saveAbility ?? ""}
                    onChange={(e) =>
                      updateItem(item.id, {
                        saveAbility: e.target.value as CustomMonsterActionForm["saveAbility"],
                      })
                    }
                    className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
                    style={fieldStyle}
                  >
                    <option value="">—</option>
                    {ABILITIES.map((ability) => (
                      <option key={ability.id} value={ability.id}>
                        {ability.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-xs text-[var(--color-ink-soft)]">
                Descrição / efeito
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, { description: e.target.value })
                  }
                  rows={3}
                  className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
                  style={fieldStyle}
                  placeholder="Texto completo da ação, como no manual..."
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export type MonsterFormValue = {
  name: string;
  avatar: string | null;
  sheet: CustomMonsterSheet;
};

type MonsterFormProps = {
  initial: MonsterFormValue;
  submitLabel: string;
  busy?: boolean;
  onSubmit: (value: MonsterFormValue) => void | Promise<void>;
  onCancel: () => void;
};

export function MonsterForm({
  initial,
  submitLabel,
  busy = false,
  onSubmit,
  onCancel,
}: MonsterFormProps) {
  const [name, setName] = useState(initial.name);
  const [avatar, setAvatar] = useState<string | null>(initial.avatar);
  const [avatarUrlDraft, setAvatarUrlDraft] = useState("");
  const [sheet, setSheet] = useState<CustomMonsterSheet>(() =>
    normalizeSheetInput(initial.sheet)
  );
  const fileRef = useRef<HTMLInputElement>(null);

  function patchSheet(patch: Partial<CustomMonsterSheet>) {
    setSheet((prev) => ({ ...prev, ...patch }));
  }

  function patchAbility(key: keyof CustomMonsterSheet["abilities"], value: string) {
    const num = Number(value);
    setSheet((prev) => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [key]: Number.isFinite(num) ? num : 0,
      },
    }));
  }

  async function handleFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await readImageAsDataUrl(file, 512);
      setAvatar(dataUrl);
    } catch {
      window.alert("Não foi possível ler a imagem.");
    }
  }

  function applyAvatarUrl() {
    const url = avatarUrlDraft.trim();
    if (!url) return;
    setAvatar(url);
    setAvatarUrlDraft("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      window.alert("Informe o nome do monstro.");
      return;
    }
    await onSubmit({ name: name.trim(), avatar, sheet });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section
        className="rounded border p-4"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <h3
          className="mb-3 text-sm text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          Identidade
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs text-[var(--color-ink-soft)] sm:col-span-2">
            Nome do monstro
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
              required
            />
          </label>
          <label className="block text-xs text-[var(--color-ink-soft)]">
            Tipo
            <input
              value={sheet.creatureType ?? ""}
              onChange={(e) => patchSheet({ creatureType: e.target.value })}
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
              placeholder="morte-viva, dragão..."
            />
          </label>
          <label className="block text-xs text-[var(--color-ink-soft)]">
            Tamanho
            <select
              value={sheet.size ?? "Medium"}
              onChange={(e) =>
                patchSheet({ size: e.target.value as MonsterSize })
              }
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
            >
              {SIZES.map((size) => (
                <option key={size} value={size}>
                  {SIZE_LABELS[size]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="h-24 w-24 border object-cover"
              style={{ borderColor: "var(--color-border)" }}
            />
          ) : (
            <div
              className="flex h-24 w-24 items-center justify-center border text-xs text-[var(--color-ink-soft)]"
              style={{ borderColor: "var(--color-border)" }}
            >
              Sem foto
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="border px-3 py-1.5 text-sm text-[var(--color-ink)]"
              style={fieldStyle}
            >
              Enviar imagem
            </button>
            <div className="flex gap-2">
              <input
                value={avatarUrlDraft}
                onChange={(e) => setAvatarUrlDraft(e.target.value)}
                placeholder="Ou cole o link da imagem"
                className="min-w-0 flex-1 border px-2 py-1.5 text-sm outline-none"
                style={fieldStyle}
              />
              <button
                type="button"
                onClick={applyAvatarUrl}
                className="shrink-0 border px-2 py-1.5 text-sm"
                style={fieldStyle}
              >
                Usar link
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="rounded border p-4"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <h3
          className="mb-3 text-sm text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          Combate
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs text-[var(--color-ink-soft)]">
            Classe de armadura (CA)
            <input
              value={sheet.ac}
              onChange={(e) => patchSheet({ ac: e.target.value })}
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
              placeholder="15 (armadura natural)"
            />
          </label>
          <label className="block text-xs text-[var(--color-ink-soft)]">
            Pontos de vida
            <input
              value={sheet.hp}
              onChange={(e) => patchSheet({ hp: e.target.value })}
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
              placeholder="93"
            />
          </label>
          <label className="block text-xs text-[var(--color-ink-soft)] sm:col-span-2">
            Fórmula de PV (opcional)
            <input
              value={sheet.hpFormula ?? ""}
              onChange={(e) => patchSheet({ hpFormula: e.target.value })}
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
              placeholder="11d10 + 33"
            />
          </label>
          <label className="block text-xs text-[var(--color-ink-soft)]">
            Deslocamento (chão)
            <input
              value={sheet.speedWalk ?? ""}
              onChange={(e) => patchSheet({ speedWalk: e.target.value })}
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
              placeholder="9 m"
            />
          </label>
          <label className="block text-xs text-[var(--color-ink-soft)]">
            Voo
            <input
              value={sheet.speedFly ?? ""}
              onChange={(e) => patchSheet({ speedFly: e.target.value })}
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
              placeholder="6 m (planar)"
            />
          </label>
          <label className="block text-xs text-[var(--color-ink-soft)] sm:col-span-2">
            Outros deslocamentos
            <input
              value={sheet.speedOther ?? ""}
              onChange={(e) => patchSheet({ speedOther: e.target.value })}
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
              placeholder="natação: 12 m"
            />
          </label>
          <label className="block text-xs text-[var(--color-ink-soft)]">
            Desafio (ND)
            <input
              value={sheet.cr ?? ""}
              onChange={(e) => patchSheet({ cr: e.target.value })}
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
              placeholder="5"
            />
          </label>
        </div>
      </section>

      <section
        className="rounded border p-4"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <h3
          className="mb-3 text-sm text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          Atributos
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {ABILITY_KEYS.map(([key, label]) => (
            <label key={key} className="block text-xs text-[var(--color-ink-soft)]">
              {label}
              <input
                type="number"
                value={sheet.abilities[key]}
                onChange={(e) => patchAbility(key, e.target.value)}
                className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
                style={fieldStyle}
              />
            </label>
          ))}
        </div>
      </section>

      <section
        className="rounded border p-4"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <h3
          className="mb-3 text-sm text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          Perfil
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs text-[var(--color-ink-soft)] sm:col-span-2">
            Salvaguardas (texto livre)
            <input
              value={sheet.savingThrows ?? ""}
              onChange={(e) => patchSheet({ savingThrows: e.target.value })}
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
              placeholder="Des +2, Sab +2"
            />
          </label>
          <OptionMultiSelect
            label="Resistências a dano"
            options={MONSTER_DAMAGE_TYPES}
            selected={normalizeMonsterOptionList(sheet.damageResistances)}
            onChange={(damageResistances) => patchSheet({ damageResistances })}
          />
          <OptionMultiSelect
            label="Imunidades a dano"
            options={MONSTER_DAMAGE_TYPES}
            selected={normalizeMonsterOptionList(sheet.damageImmunities)}
            onChange={(damageImmunities) => patchSheet({ damageImmunities })}
          />
          <OptionMultiSelect
            label="Imunidades a condições"
            options={DND_CONDITIONS.map((c) => c.name)}
            selected={normalizeMonsterOptionList(sheet.conditionImmunities)}
            onChange={(conditionImmunities) => patchSheet({ conditionImmunities })}
          />
          <OptionMultiSelect
            label="Idiomas"
            options={MONSTER_LANGUAGES}
            selected={normalizeMonsterOptionList(sheet.languages)}
            onChange={(languages) => patchSheet({ languages })}
          />
          <label className="block text-xs text-[var(--color-ink-soft)] sm:col-span-2">
            Sentidos
            <input
              value={sheet.senses ?? ""}
              onChange={(e) => patchSheet({ senses: e.target.value })}
              className="mt-0.5 w-full border px-2 py-1.5 text-sm outline-none"
              style={fieldStyle}
              placeholder="visão no escuro 18 m"
            />
          </label>
        </div>
      </section>

      <section
        className="rounded border p-4"
        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <h3
          className="mb-3 text-sm text-[var(--color-ink)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          Perícias
        </h3>
        <MonsterSkillsEditor
          sheet={sheet}
          onChangeProficiencies={(skillProficiencies) =>
            patchSheet({ skillProficiencies })
          }
        />
      </section>

      <ActionListEditor
        title="Características"
        items={sheet.traits}
        onChange={(traits) => patchSheet({ traits })}
      />
      <ActionListEditor
        title="Ações"
        items={sheet.actions}
        onChange={(actions) => patchSheet({ actions })}
      />
      <ActionListEditor
        title="Reações"
        items={sheet.reactions ?? []}
        onChange={(reactions) => patchSheet({ reactions })}
      />
      <ActionListEditor
        title="Ações lendárias"
        items={sheet.legendaryActions ?? []}
        onChange={(legendaryActions) => patchSheet({ legendaryActions })}
      />

      <div className="flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
        <RibbonButton type="submit" disabled={busy}>
          {busy ? "Salvando…" : submitLabel}
        </RibbonButton>
        <button
          type="button"
          onClick={onCancel}
          className="border px-4 py-2 text-sm text-[var(--color-ink-muted)]"
          style={fieldStyle}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
