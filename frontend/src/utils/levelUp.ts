import type { CharacterFormData } from "../types/character";
import { DND_CLASSES } from "../data/dnd/classes";
import {
  getAsiMilestones,
  type AsiMilestone,
} from "../data/dnd/classFeatures";
import {
  getUnlockedClassAbilities,
  type ClassAbility,
} from "../data/dnd/classAbilities";
import { getFinalAbilities } from "../data/dnd/characterStats";
import {
  emptyClassSelection,
  getAlwaysPreparedSpells,
  getSpellLimits,
  getSpellcastingAbility,
} from "../data/dnd/spellcasting";
import { getSpell } from "../data/dnd/spells";
import {
  getFourElementsDisciplineLimit,
  getSelectedElementalDisciplines,
} from "../data/dnd/elementalDisciplines";
import { getAllWarlockChoicesIssues } from "../data/dnd/warlockPact";
import { getClassFeatureChoiceIssues } from "../data/dnd/classFeatureChoices";
import { DND_TALENTS } from "../data/dnd/talents";
import {
  canAdvanceLevel,
  MAX_CHARACTER_LEVEL,
  xpForLevel,
} from "../data/dnd/xpTable";

function filled(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

function filledUnique(values: string[], count: number): boolean {
  const chosen = values.slice(0, count).filter((value) => filled(value));
  return chosen.length === count && new Set(chosen).size === count;
}

export function getTotalLevel(data: CharacterFormData): number {
  return data.classes.reduce((total, item) => total + item.level, 0) || 1;
}

export function canLevelUpCharacter(data: CharacterFormData): boolean {
  const totalLevel = getTotalLevel(data);
  const xp = data.xp ?? xpForLevel(totalLevel);
  return canAdvanceLevel(totalLevel, xp);
}

export function applyClassLevelIncrease(
  data: CharacterFormData,
  classIndex: number
): CharacterFormData {
  const classes = data.classes.map((selection, index) =>
    index === classIndex
      ? { ...selection, level: selection.level + 1 }
      : selection
  );

  return { ...data, classes };
}

export function needsSubclassChoice(
  selection: CharacterFormData["classes"][number]
): boolean {
  if (filled(selection.subclassId)) {
    return false;
  }
  const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);
  if (!characterClass?.subclasses.length) {
    return false;
  }
  return characterClass.subclasses.some(
    (subclass) => selection.level >= subclass.level
  );
}

export function getNewAbilitiesAtClassLevel(
  classId: string,
  subclassId: string,
  classLevel: number
): ClassAbility[] {
  return getUnlockedClassAbilities(classId, subclassId, classLevel).filter(
    (ability) => ability.level === classLevel
  );
}

export function getNewAsiMilestones(
  before: CharacterFormData,
  after: CharacterFormData
): AsiMilestone[] {
  const beforeKeys = new Set(getAsiMilestones(before.classes).map((m) => m.key));
  return getAsiMilestones(after.classes).filter((m) => !beforeKeys.has(m.key));
}

export function getLevelUpIssues(
  before: CharacterFormData,
  after: CharacterFormData
): string[] {
  const issues: string[] = [];
  const abilities = getFinalAbilities(after);

  after.classes.forEach((selection) => {
    if (needsSubclassChoice(selection)) {
      const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);
      issues.push(
        `Escolha a subclasse de ${characterClass?.name ?? selection.classId}.`
      );
    }
  });

  getNewAsiMilestones(before, after).forEach((milestone, index) => {
    const selection = after.asiSelections[milestone.key];
    if (!selection) {
      issues.push(`Defina a melhoria de habilidade ${index + 1}.`);
      return;
    }

    if (selection.kind === "ability") {
      const needed = selection.mode === "single" ? 1 : 2;
      if (!filledUnique(selection.abilities, needed)) {
        issues.push(`Escolha os atributos da melhoria ${index + 1}.`);
      }
      return;
    }

    if (!filled(selection.featId)) {
      issues.push(`Selecione o talento da melhoria ${index + 1}.`);
      return;
    }

    const feat = DND_TALENTS.find((item) => item.id === selection.featId);
    if (feat?.choices?.length) {
      for (const choice of feat.choices) {
        const values = (selection.featChoices[choice.id] ?? []).filter((value) =>
          filled(value)
        );
        if (values.length < choice.count) {
          issues.push(`Complete as escolhas do talento da melhoria ${index + 1}.`);
          break;
        }
      }
    }
  });

  const beforeLimits = new Map<string, ReturnType<typeof getSpellLimits>>();
  before.classes.forEach((selection) => {
    const abilityId = getSpellcastingAbility(selection.classId, selection.subclassId);
    if (!abilityId) return;
    beforeLimits.set(
      selection.classId,
      getSpellLimits(
        selection.classId,
        selection.level,
        selection.subclassId,
        getFinalAbilities(before)[abilityId]
      )
    );
  });

  after.classes.forEach((selection) => {
    const abilityId = getSpellcastingAbility(selection.classId, selection.subclassId);
    if (!abilityId) return;

    const prev = beforeLimits.get(selection.classId);
    const limits = getSpellLimits(
      selection.classId,
      selection.level,
      selection.subclassId,
      abilities[abilityId]
    );

    if (!limits || limits.kind === "none") return;
    if (limits.cantrips === 0 && limits.maxSpellLevel === 0 && !limits.pact) {
      return;
    }

    const selected = after.spells.byClass[selection.classId] ?? emptyClassSelection();
    const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);
    const name = characterClass?.name ?? selection.classId;
    const alwaysPrepared = getAlwaysPreparedSpells(
      selection.subclassId,
      selection.level,
      { featureChoices: after.featureChoices }
    );

    const prevCantrips = prev?.cantrips ?? 0;
    if (limits.cantrips > prevCantrips && selected.cantrips.length < limits.cantrips) {
      issues.push(`Escolha os truques de ${name}.`);
    }

    if (limits.known !== null && limits.known > 0) {
      const prevKnown = prev?.known ?? 0;
      const regularKnown = selected.known.filter(
        (id) => !limits.arcanumLevels.includes(getSpell(id)?.level ?? 0)
      ).length;

      if (limits.known > prevKnown && regularKnown < limits.known) {
        issues.push(
          limits.spellbook
            ? `Grave as magias no grimório de ${name}.`
            : `Escolha as magias conhecidas de ${name}.`
        );
      }
    }

    if (limits.prepared !== null && limits.prepared > 0) {
      const prevPrepared = prev?.prepared ?? 0;
      const prepared = selected.prepared.filter(
        (id) => !alwaysPrepared.includes(id)
      ).length;

      if (limits.prepared > prevPrepared && prepared < limits.prepared) {
        issues.push(`Prepare as magias de ${name}.`);
      }
    }

    if (limits.kind === "pact") {
      limits.arcanumLevels.forEach((level) => {
        const hadArcanum = (prev?.arcanumLevels ?? []).includes(level);
        if (!hadArcanum) {
          const hasArcanum = selected.known.some((id) => getSpell(id)?.level === level);
          if (!hasArcanum) {
            issues.push(`Escolha o Arcano Místico de ${level}º círculo.`);
          }
        }
      });
    }
  });

  after.classes.forEach((selection) => {
    if (
      selection.classId !== "monk" ||
      selection.subclassId !== "way-of-four-elements"
    ) {
      return;
    }

    const beforeMonk = before.classes.find((item) => item.classId === "monk");
    const prevLimit = beforeMonk
      ? getFourElementsDisciplineLimit(beforeMonk.level)
      : 0;
    const limit = getFourElementsDisciplineLimit(selection.level);
    const selected = getSelectedElementalDisciplines(after.featureChoices);

    if (limit > prevLimit && selected.length < limit) {
      issues.push(
        `Escolha ${limit} disciplina${limit === 1 ? "" : "s"} do Discípulo dos Elementos.`
      );
    }
  });

  after.classes.forEach((selection) => {
    if (selection.classId !== "warlock") return;

    const beforeWarlock = before.classes.find((item) => item.classId === "warlock");

    getAllWarlockChoicesIssues(after, selection.level).forEach((issue) => {
      const beforeIssues = getAllWarlockChoicesIssues(before, beforeWarlock?.level ?? selection.level);
      if (!beforeIssues.includes(issue)) {
        issues.push(issue);
      }
    });
  });

  getClassFeatureChoiceIssues(after).forEach((issue) => {
    if (!getClassFeatureChoiceIssues(before).includes(issue)) {
      issues.push(issue);
    }
  });

  if (getTotalLevel(after) > MAX_CHARACTER_LEVEL) {
    issues.push("O personagem já atingiu o nível máximo.");
  }

  return issues;
}

export function levelUpEligibleClassIndices(data: CharacterFormData): number[] {
  if (getTotalLevel(data) >= MAX_CHARACTER_LEVEL) return [];
  return data.classes.map((_, index) => index);
}

export function getAvailableNewClassIds(data: CharacterFormData): string[] {
  if (getTotalLevel(data) >= MAX_CHARACTER_LEVEL) return [];
  const taken = new Set(data.classes.map((selection) => selection.classId));
  return DND_CLASSES.filter((characterClass) => !taken.has(characterClass.id)).map(
    (characterClass) => characterClass.id
  );
}

export function applyNewClass(
  data: CharacterFormData,
  classId: string
): CharacterFormData {
  const characterClass = DND_CLASSES.find((item) => item.id === classId);
  if (!characterClass) {
    return data;
  }

  const spells = { ...data.spells, byClass: { ...data.spells.byClass } };
  if (!spells.byClass[classId]) {
    spells.byClass[classId] = emptyClassSelection();
  }

  return {
    ...data,
    classes: [
      ...data.classes,
      { classId, level: 1, subclassId: "" },
    ],
    spells,
  };
}

export function getLeveledClassLabel(
  selection: CharacterFormData["classes"][number]
): string {
  const characterClass = DND_CLASSES.find((item) => item.id === selection.classId);
  const subclass = characterClass?.subclasses.find(
    (item) => item.id === selection.subclassId
  );
  const base = characterClass?.name ?? selection.classId;
  return subclass ? `${base} (${subclass.name})` : base;
}
