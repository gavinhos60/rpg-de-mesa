import { useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type {
    CharacterFormData,
    ClassSpellSelection,
    Spell,
} from "../../types/character";
import { DND_CLASSES } from "../../data/dnd/classes";
import { getAsiMilestones } from "../../data/dnd/classFeatures";
import { ABILITIES, getAbilityModifier } from "../../data/dnd/abilities";
import { getFinalAbilities } from "../../data/dnd/characterStats";
import { getProficiencyBonus } from "../../data/dnd/rules";
import { SPELL_SCHOOLS, getSpell } from "../../data/dnd/spells";
import { getSpellDetail } from "../../data/dnd/spellDetails";
import {
    emptyClassSelection,
    getAlwaysPreparedSpells,
    getCasterKind,
    getClassSpellList,
    getCombinedSpellSlots,
    getSpellLimits,
    getSpellcastingAbility,
    getTalentSpellClass,
    getTalentSpellOptions,
    isPreferredSchool,
} from "../../data/dnd/spellcasting";

interface CharacterSpellsProps {
    data: CharacterFormData;
    onChange: Dispatch<SetStateAction<CharacterFormData>>;
}

const cinzel = { fontFamily: "'Cinzel', serif" } as const;
const card = { backgroundColor: "var(--color-surface)", borderColor: "var(--color-border-strong)" };

export function CharacterSpells({ data, onChange }: CharacterSpellsProps) {
    const [levelFilter, setLevelFilter] = useState<"all" | number>("all");

    const abilities = getFinalAbilities(data);
    const totalLevel = data.classes.reduce((total, item) => total + item.level, 0) || 1;
    const proficiencyBonus = getProficiencyBonus(totalLevel);
    const slots = getCombinedSpellSlots(data.classes);

    const casterEntries = useMemo(() => {
        return data.classes.flatMap((selection) => {
            const abilityId = getSpellcastingAbility(selection.classId, selection.subclassId);
            const limits = abilityId
                ? getSpellLimits(
                    selection.classId,
                    selection.level,
                    selection.subclassId,
                    abilities[abilityId]
                )
                : undefined;

            if (!limits || limits.kind === "none") {
                return [];
            }

            if (limits.cantrips === 0 && limits.maxSpellLevel === 0 && !limits.pact) {
                return [];
            }

            const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);

            return [{
                selection,
                limits,
                abilityId,
                name: characterClass?.name ?? selection.classId,
                list: getClassSpellList(selection.classId, selection.subclassId),
                alwaysPrepared: getAlwaysPreparedSpells(
                    selection.subclassId,
                    selection.level,
                    { featureChoices: data.featureChoices }
                ),
            }];
        });
    }, [abilities, data.classes]);

    const talentListClass = getTalentSpellClass(data.talentId, data.talentChoices);
    const talentOptions = getTalentSpellOptions(data.talentId, talentListClass);
    const hasTalentSpells =
        data.talentId === "magic-initiate" ||
        data.talentId === "ritual-caster" ||
        data.talentId === "spell-sniper";
    const validAsiKeys = new Set(
        getAsiMilestones(data.classes).map((milestone) => milestone.key)
    );
    const asiSpellFeats = Object.entries(data.asiSelections).flatMap(
        ([key, selection]) => {
            if (
                !validAsiKeys.has(key) ||
                selection.kind !== "feat" ||
                !["magic-initiate", "ritual-caster", "spell-sniper"].includes(
                    selection.featId
                )
            ) {
                return [];
            }

            const listClass = getTalentSpellClass(
                selection.featId,
                selection.featChoices
            );

            return [{
                key,
                featId: selection.featId,
                options: getTalentSpellOptions(selection.featId, listClass),
            }];
        }
    );

    useEffect(() => {
        onChange((previous) => {
            const finalAbilities = getFinalAbilities(previous);
            let changed = false;
            const byClass = { ...previous.spells.byClass };

            for (const classId of Object.keys(byClass)) {
                const stillCaster = previous.classes.some((selection) => {
                    return selection.classId === classId &&
                        getCasterKind(selection.classId, selection.subclassId) !== "none";
                });

                if (!stillCaster) {
                    delete byClass[classId];
                    changed = true;
                }
            }

            for (const entry of previous.classes) {
                const abilityId = getSpellcastingAbility(entry.classId, entry.subclassId);
                const limits = abilityId
                    ? getSpellLimits(entry.classId, entry.level, entry.subclassId, finalAbilities[abilityId])
                    : undefined;

                if (!limits) {
                    continue;
                }

                const list = getClassSpellList(entry.classId, entry.subclassId);
                const allowed = new Set(list.map((spell) => spell.id));
                const current = byClass[entry.classId] ?? emptyClassSelection();
                let next: ClassSpellSelection = {
                    cantrips: current.cantrips.filter((id) =>
                        allowed.has(id) && (getSpell(id)?.level ?? 1) === 0
                    ),
                    known: current.known.filter((id) => {
                        const spell = getSpell(id);
                        return Boolean(
                            spell &&
                            allowed.has(id) &&
                            spell.level > 0 &&
                            spell.level <= Math.max(limits.maxSpellLevel, ...limits.arcanumLevels)
                        );
                    }),
                    prepared: current.prepared.filter((id) => {
                        const spell = getSpell(id);
                        return Boolean(
                            spell &&
                            allowed.has(id) &&
                            spell.level > 0 &&
                            spell.level <= limits.maxSpellLevel
                        );
                    }),
                };

                if (entry.subclassId === "arcane-trickster" && limits.cantrips > 0) {
                    if (!next.cantrips.includes("mage-hand")) {
                        next = {
                            ...next,
                            cantrips: ["mage-hand", ...next.cantrips.filter((id) => id !== "mage-hand")],
                        };
                    }
                }

                next = { ...next, cantrips: next.cantrips.slice(0, limits.cantrips) };

                if (limits.known !== null && limits.kind === "pact") {
                    const regular = next.known.filter((id) => (getSpell(id)?.level ?? 0) <= 5);
                    const arcanum = next.known.filter((id) => {
                        const level = getSpell(id)?.level ?? 0;
                        return limits.arcanumLevels.includes(level);
                    });
                    const uniqueArcanum = limits.arcanumLevels.flatMap((level) => {
                        const match = arcanum.find((id) => getSpell(id)?.level === level);
                        return match ? [match] : [];
                    });

                    next = {
                        ...next,
                        known: [...regular.slice(0, limits.known), ...uniqueArcanum],
                    };
                } else if (limits.known !== null) {
                    next = { ...next, known: next.known.slice(0, limits.known) };
                }

                if (limits.prepared !== null) {
                    next = { ...next, prepared: next.prepared.slice(0, limits.prepared) };
                }

                const same =
                    JSON.stringify(current) === JSON.stringify(next) &&
                    Boolean(byClass[entry.classId]);

                if (!same) {
                    byClass[entry.classId] = next;
                    changed = true;
                }
            }

            const options = getTalentSpellOptions(
                previous.talentId,
                getTalentSpellClass(previous.talentId, previous.talentChoices)
            );
            const talentAllowedCantrips = new Set(options.cantrips.map((spell) => spell.id));
            const talentAllowedSpells = new Set(options.spells.map((spell) => spell.id));
            const talent = {
                cantrips: previous.spells.talent.cantrips.filter((id) => talentAllowedCantrips.has(id)),
                spells: previous.spells.talent.spells.filter((id) => talentAllowedSpells.has(id)),
            };

            if (
                JSON.stringify(talent) !== JSON.stringify(previous.spells.talent)
            ) {
                changed = true;
            }

            if (!changed) {
                return previous;
            }

            return {
                ...previous,
                spells: { ...previous.spells, byClass, talent },
            };
        });
    }, [data.classes, data.talentId, data.talentChoices, onChange]);

    function updateClassSelection(
        classId: string,
        updater: (current: ClassSpellSelection) => ClassSpellSelection
    ) {
        onChange((previous) => {
            const current = previous.spells.byClass[classId] ?? emptyClassSelection();

            return {
                ...previous,
                spells: {
                    ...previous.spells,
                    byClass: {
                        ...previous.spells.byClass,
                        [classId]: updater(current),
                    },
                },
            };
        });
    }

    function updateFeatSpells(
        key: string,
        field: "cantrips" | "spells",
        spellId: string,
        limit: number
    ) {
        onChange((previous) => {
            const current = previous.spells.byFeat[key] ?? {
                cantrips: [],
                spells: [],
            };

            return {
                ...previous,
                spells: {
                    ...previous.spells,
                    byFeat: {
                        ...previous.spells.byFeat,
                        [key]: {
                            ...current,
                            [field]: toggleId(current[field], spellId, limit),
                        },
                    },
                },
            };
        });
    }

    function toggleId(list: string[], id: string, limit: number, locked: string[] = []): string[] {
        if (locked.includes(id)) {
            return list;
        }

        if (list.includes(id)) {
            return list.filter((item) => item !== id);
        }

        if (list.length >= limit) {
            return list;
        }

        return [...list, id];
    }

    function formatModifier(value: number): string {
        return value >= 0 ? `+${value}` : `${value}`;
    }

    if (
        casterEntries.length === 0 &&
        !hasTalentSpells &&
        asiSpellFeats.length === 0
    ) {
        return (
            <div className="border p-8 text-center" style={card}>
                <p className="text-[var(--color-ink)]" style={cinzel}>
                    Este personagem ainda não conjura magias
                </p>
                <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                    Escolha uma classe conjuradora, um arquétipo como Cavaleiro Arcano
                    ou Trapaceiro Arcano, ou um talento como Iniciado em Magia.
                </p>
            </div>
        );
    }

    const warlock = casterEntries.find((entry) => entry.limits.kind === "pact");

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                    Magias
                </h2>
                <p className="mt-2 text-[var(--color-ink-muted)]">
                    Truques, magias conhecidas ou preparadas e espaços seguem o PHB 2014.
                    Cada classe usa apenas a própria lista, salvo talentos e listas expandidas.
                </p>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {slots.length > 0 && (
                    <div className="border p-4 sm:col-span-2" style={card}>
                        <p className="text-sm text-[var(--color-ink-muted)]">Espaços de magia</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {slots.map((count, index) => (
                                <span
                                    key={index}
                                    className="border px-2 py-1 text-sm"
                                    style={{ borderColor: "var(--color-border)" }}
                                >
                                    {index + 1}º: {count}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {warlock?.limits.pact && (
                    <div className="border p-4" style={card}>
                        <p className="text-sm text-[var(--color-ink-muted)]">Magia do Pacto</p>
                        <p className="mt-1 text-xl text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            {warlock.limits.pact.count} espaço(s) de {warlock.limits.pact.level}º
                        </p>
                    </div>
                )}
                {casterEntries.map((entry) => {
                    const modifier = getAbilityModifier(abilities[entry.abilityId]);
                    const abilityName = ABILITIES.find((item) => item.id === entry.abilityId)?.shortName;

                    return (
                        <div key={`${entry.selection.classId}-dc`} className="border p-4" style={card}>
                            <p className="text-sm text-[var(--color-ink-muted)]">{entry.name}</p>
                            <p className="mt-1 text-[var(--color-ink)]" style={cinzel}>
                                CD {8 + proficiencyBonus + modifier} • Ataque {formatModifier(proficiencyBonus + modifier)}
                            </p>
                            <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{abilityName}</p>
                        </div>
                    );
                })}
            </div>

            {casterEntries.map((entry) => {
                const selected = data.spells.byClass[entry.selection.classId] ?? emptyClassSelection();
                const cantrips = entry.list.filter((spell) => spell.level === 0);
                const leveled = entry.list.filter((spell) =>
                    spell.level > 0 &&
                    spell.level <= Math.max(entry.limits.maxSpellLevel, ...entry.limits.arcanumLevels)
                );
                const visibleLeveled = leveled.filter((spell) =>
                    levelFilter === "all" || spell.level === levelFilter
                );
                const maxVisible = Math.max(entry.limits.maxSpellLevel, ...entry.limits.arcanumLevels, 0);

                return (
                    <section key={entry.selection.classId} className="mb-10">
                        <h3 className="mb-2 text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            {entry.name}
                        </h3>
                        <p className="mb-4 text-sm text-[var(--color-ink-muted)]">
                            {entry.limits.spellbook
                                ? "O mago grava magias no grimório e prepara uma seleção diária."
                                : entry.limits.prepared !== null
                                    ? "Magias preparadas a partir da lista da classe. Magias de domínio ou juramento não contam no limite."
                                    : "Magias conhecidas da lista da classe."}
                        </p>

                        {entry.limits.cantrips > 0 && (
                            <Picker
                                title="Truques"
                                counter={`${selected.cantrips.length} / ${entry.limits.cantrips}`}
                                spells={cantrips}
                                selected={selected.cantrips}
                                locked={
                                    entry.selection.subclassId === "arcane-trickster"
                                        ? ["mage-hand"]
                                        : []
                                }
                                onToggle={(spellId) => {
                                    updateClassSelection(entry.selection.classId, (current) => ({
                                        ...current,
                                        cantrips: toggleId(
                                            current.cantrips,
                                            spellId,
                                            entry.limits.cantrips,
                                            entry.selection.subclassId === "arcane-trickster"
                                                ? ["mage-hand"]
                                                : []
                                        ),
                                    }));
                                }}
                            />
                        )}

                        {entry.limits.known !== null && entry.limits.known > 0 && (
                            <>
                                <LevelFilters
                                    maxLevel={maxVisible}
                                    value={levelFilter}
                                    onChange={setLevelFilter}
                                />
                                <Picker
                                    title={entry.limits.spellbook ? "Grimório" : "Magias conhecidas"}
                                    counter={
                                        entry.limits.kind === "pact"
                                            ? `${selected.known.filter((id) => (getSpell(id)?.level ?? 0) <= 5).length} / ${entry.limits.known}`
                                            : `${selected.known.length} / ${entry.limits.known}`
                                    }
                                    spells={visibleLeveled}
                                    selected={selected.known}
                                    locked={[]}
                                    onToggle={(spellId) => {
                                        const spell = getSpell(spellId);
                                        if (!spell) return;

                                        updateClassSelection(entry.selection.classId, (current) => {
                                            if (current.known.includes(spellId)) {
                                                return {
                                                    ...current,
                                                    known: current.known.filter((id) => id !== spellId),
                                                    prepared: current.prepared.filter((id) => id !== spellId),
                                                };
                                            }

                                            if (entry.limits.kind === "pact" && spell.level >= 6) {
                                                if (!entry.limits.arcanumLevels.includes(spell.level)) {
                                                    return current;
                                                }

                                                if (current.known.some((id) => getSpell(id)?.level === spell.level)) {
                                                    return current;
                                                }

                                                return {
                                                    ...current,
                                                    known: [...current.known, spellId],
                                                };
                                            }

                                            const regularCount = entry.limits.kind === "pact"
                                                ? current.known.filter((id) =>
                                                    (getSpell(id)?.level ?? 0) <= 5
                                                ).length
                                                : current.known.length;

                                            if (regularCount >= (entry.limits.known ?? 0)) {
                                                return current;
                                            }

                                            const offSchool = current.known.filter((id) =>
                                                !isPreferredSchool(entry.selection.subclassId, id)
                                            ).length;

                                            if (
                                                (entry.selection.subclassId === "eldritch-knight" ||
                                                    entry.selection.subclassId === "arcane-trickster") &&
                                                !isPreferredSchool(entry.selection.subclassId, spellId) &&
                                                offSchool >= 2
                                            ) {
                                                return current;
                                            }

                                            return {
                                                ...current,
                                                known: [...current.known, spellId],
                                            };
                                        });
                                    }}
                                />
                            </>
                        )}

                        {entry.limits.known === null && entry.limits.prepared !== null && entry.limits.prepared > 0 && (
                            <>
                                <LevelFilters
                                    maxLevel={entry.limits.maxSpellLevel}
                                    value={levelFilter}
                                    onChange={setLevelFilter}
                                />
                                <Picker
                                    title="Magias preparadas"
                                    counter={`${selected.prepared.length} / ${entry.limits.prepared}`}
                                    spells={visibleLeveled.filter((spell) =>
                                        spell.level <= entry.limits.maxSpellLevel &&
                                        !entry.alwaysPrepared.includes(spell.id)
                                    )}
                                    selected={selected.prepared}
                                    locked={[]}
                                    onToggle={(spellId) => {
                                        updateClassSelection(entry.selection.classId, (current) => ({
                                            ...current,
                                            prepared: toggleId(
                                                current.prepared,
                                                spellId,
                                                entry.limits.prepared ?? 0
                                            ),
                                        }));
                                    }}
                                />
                            </>
                        )}

                        {entry.limits.spellbook && entry.limits.prepared !== null && entry.limits.prepared > 0 && (
                            <Picker
                                title="Preparadas hoje"
                                counter={`${selected.prepared.length} / ${entry.limits.prepared}`}
                                spells={leveled.filter((spell) => selected.known.includes(spell.id))}
                                selected={selected.prepared}
                                locked={[]}
                                onToggle={(spellId) => {
                                    updateClassSelection(entry.selection.classId, (current) => ({
                                        ...current,
                                        prepared: toggleId(
                                            current.prepared,
                                            spellId,
                                            entry.limits.prepared ?? 0
                                        ),
                                    }));
                                }}
                            />
                        )}

                        {entry.alwaysPrepared.length > 0 && (
                            <Picker
                                title="Sempre preparadas"
                                counter={String(entry.alwaysPrepared.length)}
                                spells={entry.alwaysPrepared
                                    .map((id) => getSpell(id))
                                    .filter((spell): spell is Spell => Boolean(spell))}
                                selected={entry.alwaysPrepared}
                                locked={entry.alwaysPrepared}
                                onToggle={() => undefined}
                            />
                        )}
                    </section>
                );
            })}

            {hasTalentSpells && (
                <section>
                    <h3 className="mb-2 text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                        Magias do talento
                    </h3>
                    <p className="mb-4 text-sm text-[var(--color-ink-muted)]">
                        {data.talentId === "magic-initiate" &&
                            "Dois truques e uma magia de 1º nível da lista escolhida. A magia de 1º nível pode ser conjurada uma vez por descanso longo sem espaço."}
                        {data.talentId === "ritual-caster" &&
                            "Duas magias de 1º nível com a propriedade ritual, da lista de clérigo ou mago."}
                        {data.talentId === "spell-sniper" &&
                            "Um truque que exige jogada de ataque, de bardo, clérigo, druida, feiticeiro, bruxo ou mago."}
                    </p>

                    {data.talentId === "magic-initiate" && !getTalentSpellClass(data.talentId, data.talentChoices) && (
                        <p className="mb-4 text-sm text-[var(--color-crimson)]">
                            Escolha a classe de conjuração do talento na etapa Identidade.
                        </p>
                    )}

                    {talentOptions.cantrips.length > 0 && (
                        <Picker
                            title="Truques do talento"
                            counter={`${data.spells.talent.cantrips.length} / ${data.talentId === "spell-sniper" ? 1 : 2}`}
                            spells={talentOptions.cantrips}
                            selected={data.spells.talent.cantrips}
                            locked={[]}
                            onToggle={(spellId) => {
                                onChange((previous) => ({
                                    ...previous,
                                    spells: {
                                        ...previous.spells,
                                        talent: {
                                            ...previous.spells.talent,
                                            cantrips: toggleId(
                                                previous.spells.talent.cantrips,
                                                spellId,
                                                data.talentId === "spell-sniper" ? 1 : 2
                                            ),
                                        },
                                    },
                                }));
                            }}
                        />
                    )}

                    {talentOptions.spells.length > 0 && (
                        <Picker
                            title="Magias do talento"
                            counter={`${data.spells.talent.spells.length} / ${data.talentId === "ritual-caster" ? 2 : 1}`}
                            spells={talentOptions.spells}
                            selected={data.spells.talent.spells}
                            locked={[]}
                            onToggle={(spellId) => {
                                onChange((previous) => ({
                                    ...previous,
                                    spells: {
                                        ...previous.spells,
                                        talent: {
                                            ...previous.spells.talent,
                                            spells: toggleId(
                                                previous.spells.talent.spells,
                                                spellId,
                                                data.talentId === "ritual-caster" ? 2 : 1
                                            ),
                                        },
                                    },
                                }));
                            }}
                        />
                    )}
                </section>
            )}

            {asiSpellFeats.map((feat) => {
                const selected = data.spells.byFeat[feat.key] ?? {
                    cantrips: [],
                    spells: [],
                };
                const cantripLimit = feat.featId === "spell-sniper" ? 1 : 2;
                const spellLimit = feat.featId === "ritual-caster" ? 2 : 1;
                const featName =
                    feat.featId === "magic-initiate"
                        ? "Iniciado em Magia"
                        : feat.featId === "ritual-caster"
                            ? "Conjurador de Rituais"
                            : "Atirador de Magia";

                return (
                    <section key={feat.key} className="mt-8 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
                        <h3 className="mb-2 text-lg text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>
                            {featName} — {feat.key.replace(":", " nível ")}
                        </h3>

                        {feat.options.cantrips.length === 0 &&
                            feat.options.spells.length === 0 && (
                                <p className="mb-4 text-sm text-[var(--color-crimson)]">
                                    Complete as escolhas desse talento na etapa Atributos.
                                </p>
                            )}

                        <Picker
                            title="Truques do talento"
                            counter={`${selected.cantrips.length} / ${cantripLimit}`}
                            spells={feat.options.cantrips}
                            selected={selected.cantrips}
                            locked={[]}
                            onToggle={(spellId) =>
                                updateFeatSpells(
                                    feat.key,
                                    "cantrips",
                                    spellId,
                                    cantripLimit
                                )
                            }
                        />
                        <Picker
                            title="Magias do talento"
                            counter={`${selected.spells.length} / ${spellLimit}`}
                            spells={feat.options.spells}
                            selected={selected.spells}
                            locked={[]}
                            onToggle={(spellId) =>
                                updateFeatSpells(
                                    feat.key,
                                    "spells",
                                    spellId,
                                    spellLimit
                                )
                            }
                        />
                    </section>
                );
            })}
        </div>
    );
}

function LevelFilters({
    maxLevel,
    value,
    onChange,
}: {
    maxLevel: number;
    value: "all" | number;
    onChange: (value: "all" | number) => void;
}) {
    if (maxLevel < 1) {
        return null;
    }

    const levels: Array<"all" | number> = ["all"];
    for (let level = 1; level <= maxLevel; level += 1) {
        levels.push(level);
    }

    return (
        <div className="mb-3 flex flex-wrap gap-2">
            {levels.map((level) => (
                <button
                    key={String(level)}
                    type="button"
                    onClick={() => onChange(level)}
                    className="border px-3 py-1 text-sm"
                    style={{
                        borderColor: value === level ? "var(--color-crimson-deep)" : "var(--color-border)",
                        backgroundColor: value === level ? "var(--color-crimson)" : "var(--color-parchment)",
                        color: value === level ? "var(--color-parchment)" : "var(--color-ink)",
                    }}
                >
                    {level === "all" ? "Todos" : `${level}º`}
                </button>
            ))}
        </div>
    );
}

function Picker({
    title,
    counter,
    spells,
    selected,
    locked,
    onToggle,
}: {
    title: string;
    counter: string;
    spells: Spell[];
    selected: string[];
    locked: string[];
    onToggle: (spellId: string) => void;
}) {
    if (spells.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-4">
                <h4 className="text-[var(--color-ink)]" style={{ ...cinzel, fontWeight: 600 }}>{title}</h4>
                <span
                    className="px-3 py-1.5 text-sm"
                    style={{ ...cinzel, backgroundColor: "var(--color-crimson)", color: "var(--color-ink-inverse)" }}
                >
                    {counter}
                </span>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
                {spells.map((spell) => (
                    <PickerOption
                        key={spell.id}
                        spell={spell}
                        isSelected={selected.includes(spell.id)}
                        isLocked={locked.includes(spell.id)}
                        onToggle={() => onToggle(spell.id)}
                    />
                ))}
            </div>
        </div>
    );
}

function PickerOption({
    spell,
    isSelected,
    isLocked,
    onToggle,
}: {
    spell: Spell;
    isSelected: boolean;
    isLocked: boolean;
    onToggle: () => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const detail = getSpellDetail(spell.id);

    return (
        <div
            className="border"
            style={{
                backgroundColor: isSelected ? "var(--color-surface)" : "var(--color-parchment)",
                borderColor: isSelected ? "var(--color-crimson)" : "var(--color-border)",
            }}
        >
            <div className="flex items-start">
                <button
                    type="button"
                    disabled={isLocked}
                    onClick={onToggle}
                    className="flex flex-1 items-center justify-between gap-3 p-3 text-left disabled:opacity-80"
                >
                    <span>
                        <span className="block text-[var(--color-ink)]" style={cinzel}>{spell.name}</span>
                        <span className="text-xs text-[var(--color-ink-soft)]">
                            {spell.level === 0 ? "Truque" : `${spell.level}º`} • {SPELL_SCHOOLS[spell.school]}
                            {spell.ritual ? " • Ritual" : ""}
                            {spell.attack ? " • Ataque" : ""}
                        </span>
                        {spell.description && (
                            <span className="mt-1 block text-xs italic leading-5 text-[var(--color-ink-muted)]">
                                {spell.description}
                            </span>
                        )}
                    </span>
                    <span className="text-sm text-[var(--color-crimson)]">
                        {isLocked ? "Fixo" : isSelected ? "✓" : "+"}
                    </span>
                </button>
                {detail && (
                    <button
                        type="button"
                        onClick={() => setExpanded((current) => !current)}
                        aria-expanded={expanded}
                        aria-label={expanded ? "Recolher descrição" : "Ver descrição completa"}
                        className="mr-2 mt-3 flex h-7 w-7 shrink-0 items-center justify-center border text-xs text-[var(--color-crimson)] transition-transform"
                        style={{
                            borderColor: "var(--color-border)",
                            transform: expanded ? "rotate(180deg)" : "none",
                        }}
                    >
                        ▾
                    </button>
                )}
            </div>

            {detail && expanded && (
                <div className="border-t px-3 py-3" style={{ borderColor: "#C09A5A" }}>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                        <span style={cinzel}>Conjuração</span> {detail.castingTime} •{" "}
                        <span style={cinzel}>Alcance</span> {detail.range} •{" "}
                        <span style={cinzel}>Componentes</span> {detail.components} •{" "}
                        <span style={cinzel}>Duração</span> {detail.duration}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]">{detail.text}</p>
                    {detail.higherLevels && (
                        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-muted)]">
                            <span className="text-[var(--color-crimson)]" style={cinzel}>
                                Em níveis superiores.
                            </span>{" "}
                            {detail.higherLevels}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
