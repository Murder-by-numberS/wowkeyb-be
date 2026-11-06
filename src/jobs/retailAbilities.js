import Ability from '../models/ability.js';
import Version from '../models/version.js';
import {
  CLASS_ENUM,
  SPEC_BY_CLASS,
  normalizeClassValue,
  normalizeHeroTalentValue,
  normalizeSpecValue,
} from '../utils/class-spec-hero-catalog.js';
import { compareGameVersions, fetchRetailWowVersion } from './retailWowVersion.js';

const TALENTS_URL = 'https://www.raidbots.com/static/data/live/talents.json';
const ICON_BASE = 'https://wow.zamimg.com/images/wow/icons/large';

// Raidbots labels these as active talent nodes, but they are passive effects.
// They are not buttons, so they do not belong on the keyboard.
const PASSIVE_SPELL_IDS = new Set([
  '385633', // Auras of the Resolute
  '403208', // Draconic Attunements
  '426115', // Demoniac
  '115069', // Stagger
  '322960', // Fortifying Brew: Determination
]);

function iconUrl(icon) {
  const name = String(icon || '').trim();
  if (!name) {
    return `${ICON_BASE}/inv_misc_questionmark.jpg`;
  }
  return `${ICON_BASE}/${name}.jpg`;
}

function heroNamesBySubTree(specRecord) {
  const names = new Map();
  for (const node of specRecord.subTreeNodes || []) {
    for (const entry of node.entries || []) {
      if (entry?.traitSubTreeId && entry.name) {
        names.set(entry.traitSubTreeId, normalizeHeroTalentValue(entry.name));
      }
    }
  }
  return names;
}

function pushActiveSpell(target, seen, entry, placement) {
  if (!entry || entry.type !== 'active' || !entry.spellId || !entry.name) {
    return false;
  }
  const spellId = String(entry.spellId);
  if (PASSIVE_SPELL_IDS.has(spellId)) {
    return false;
  }
  const key = `${placement.className}|${spellId}`;
  if (seen.has(key)) {
    return false;
  }
  seen.add(key);
  target.push({
    spell_id: spellId,
    name: String(entry.name).trim(),
    description: `${String(entry.name).trim()}.`,
    icon: iconUrl(entry.icon),
    class: placement.className,
    spec: placement.spec,
    hero_talent: placement.heroTalent,
    ability_type: placement.abilityType,
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: null,
    cost_amount: 0,
    is_active: true,
  });
  return true;
}

export function collectRetailAbilities(trees) {
  const abilities = [];
  const seen = new Set();
  let skipped = 0;
  const classNodesSeen = new Set();

  for (const specRecord of trees || []) {
    const className = normalizeClassValue(specRecord.className);
    const specName = normalizeSpecValue(specRecord.specName);
    if (!className || !CLASS_ENUM.includes(className)) {
      skipped += (specRecord.classNodes || []).length;
      continue;
    }

    const specAllowed = Boolean(specName && (SPEC_BY_CLASS[className] || []).includes(specName));
    const heroes = heroNamesBySubTree(specRecord);

    if (!classNodesSeen.has(className)) {
      classNodesSeen.add(className);
      for (const node of specRecord.classNodes || []) {
        for (const entry of node.entries || []) {
          pushActiveSpell(abilities, seen, entry, {
            className,
            spec: null,
            heroTalent: null,
            abilityType: 'class',
          });
        }
      }
    }

    if (!specAllowed) {
      skipped += (specRecord.specNodes || []).length + (specRecord.heroNodes || []).length;
      continue;
    }

    for (const node of specRecord.specNodes || []) {
      for (const entry of node.entries || []) {
        pushActiveSpell(abilities, seen, entry, {
          className,
          spec: specName,
          heroTalent: null,
          abilityType: 'spec',
        });
      }
    }

    for (const node of specRecord.heroNodes || []) {
      const heroTalent = heroes.get(node.subTreeId);
      if (!heroTalent) {
        skipped += 1;
        continue;
      }
      for (const entry of node.entries || []) {
        pushActiveSpell(abilities, seen, entry, {
          className,
          spec: null,
          heroTalent,
          abilityType: 'hero_talent',
        });
      }
    }
  }

  return { abilities, skipped };
}

export async function fetchRetailTalentTrees() {
  const response = await fetch(TALENTS_URL);
  if (!response.ok) {
    throw new Error(`Talent tree request failed: ${response.status}`);
  }
  const trees = await response.json();
  if (!Array.isArray(trees) || trees.length === 0) {
    throw new Error('Talent tree file did not include any specs');
  }
  return trees;
}

async function versionForRetail() {
  const retail = await fetchRetailWowVersion();
  const versions = await Version.find({});
  const match = versions.find((version) => version.game_version === retail.gameVersion);
  versions.sort((left, right) => compareGameVersions(right.game_version, left.game_version));
  return { retail, version: match || null, latest: versions[0] || null };
}

/**
 * Add active spells from the live talent trees when the current retail
 * version does not already have that class and spell id.
 */
export async function syncRetailAbilities({ dryRun = false } = {}) {
  const { retail, version } = await versionForRetail();
  if (!version) {
    return {
      created: false,
      gameVersion: retail.gameVersion,
      build: retail.build,
      reason: 'Retail version is not in the database yet',
      checked: 0,
      added: 0,
      existing: 0,
      skipped: 0,
    };
  }

  const trees = await fetchRetailTalentTrees();
  const { abilities, skipped } = collectRetailAbilities(trees);
  const stored = await Ability.find({
    game_version: version._id,
    includeInactive: true,
  }).select('class spell_id');
  const have = new Set(stored.map((ability) => `${ability.class}|${ability.spell_id}`));
  const missing = abilities.filter((ability) => !have.has(`${ability.class}|${ability.spell_id}`));

  if (!dryRun && missing.length > 0) {
    const docs = missing.map((ability) => ({
      ...ability,
      game_version: version._id,
    }));
    for (let index = 0; index < docs.length; index += 200) {
      await Ability.insertMany(docs.slice(index, index + 200), { ordered: true });
    }
  }

  return {
    created: missing.length > 0 && !dryRun,
    dryRun,
    gameVersion: retail.gameVersion,
    build: retail.build,
    checked: abilities.length,
    added: dryRun ? 0 : missing.length,
    pending: missing.length,
    existing: abilities.length - missing.length,
    skipped,
    sample: missing.slice(0, 20).map((ability) => `${ability.class}:${ability.name}`),
  };
}
