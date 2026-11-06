import Version from '../models/version.js';
import Ability from '../models/ability.js';

const RETAIL_VERSIONS_URL = 'https://us.version.battle.net/v2/products/wow/versions';

export function parseRetailVersionFile(body) {
  const lines = String(body || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && !line.startsWith('Region!'));

  const usRow = lines.find((line) => line.startsWith('us|')) || lines[0];
  if (!usRow) {
    throw new Error('Retail version file had no region rows');
  }

  const versionsName = usRow.split('|')[5];
  if (!versionsName) {
    throw new Error('Retail version file is missing VersionsName');
  }

  const parts = versionsName.split('.');
  if (parts.length < 3 || parts.slice(0, 3).some((part) => !/^\d+$/.test(part))) {
    throw new Error(`Unexpected retail VersionsName: ${versionsName}`);
  }

  return {
    gameVersion: parts.slice(0, 3).join('.'),
    build: parts[3] || null,
    versionsName
  };
}

export function compareGameVersions(left, right) {
  const a = String(left || '').split('.').map((part) => Number(part) || 0);
  const b = String(right || '').split('.').map((part) => Number(part) || 0);
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    const aPart = a[index] || 0;
    const bPart = b[index] || 0;
    if (aPart > bPart) return 1;
    if (aPart < bPart) return -1;
  }
  return 0;
}

export async function fetchRetailWowVersion() {
  const response = await fetch(RETAIL_VERSIONS_URL);
  if (!response.ok) {
    throw new Error(`Retail version request failed: ${response.status}`);
  }
  const body = await response.text();
  return parseRetailVersionFile(body);
}

async function latestStoredVersion() {
  const versions = await Version.find({});
  versions.sort((left, right) => compareGameVersions(right.game_version, left.game_version));
  return versions[0] || null;
}

function abilityCopy(ability, targetVersionId) {
  return {
    spell_id: ability.spell_id,
    name: ability.name,
    description: ability.description,
    icon: ability.icon,
    class: ability.class,
    spec: ability.spec,
    hero_talent: ability.hero_talent,
    ability_type: ability.ability_type,
    level_required: ability.level_required,
    cooldown: ability.cooldown,
    range: ability.range,
    cost: ability.cost,
    cost_amount: ability.cost_amount,
    is_active: ability.is_active,
    game_version: targetVersionId
  };
}

async function copyAbilities(sourceVersion, targetVersion) {
  const existingAbilities = await Ability.countDocuments({
    game_version: targetVersion._id,
    includeInactive: true
  });
  if (existingAbilities > 0) {
    return existingAbilities;
  }
  if (!sourceVersion) {
    return 0;
  }

  const sourceAbilities = await Ability.find({
    game_version: sourceVersion._id,
    includeInactive: true
  });
  if (sourceAbilities.length === 0) {
    return 0;
  }

  await Ability.insertMany(
    sourceAbilities.map((ability) => abilityCopy(ability, targetVersion._id)),
    { ordered: true }
  );
  return sourceAbilities.length;
}

/**
 * Create a game version when live retail is newer than anything stored,
 * and copy the previous version's ability catalog onto it.
 */
export async function syncRetailWowVersion() {
  const retail = await fetchRetailWowVersion();
  const latest = await latestStoredVersion();

  if (latest && compareGameVersions(retail.gameVersion, latest.game_version) <= 0) {
    return {
      created: false,
      gameVersion: retail.gameVersion,
      build: retail.build,
      latest: latest.game_version,
      copied: 0
    };
  }

  let version = await Version.findOne({ game_version: retail.gameVersion });
  const created = !version;
  if (!version) {
    version = await Version.create({ game_version: retail.gameVersion });
  }

  const source = latest && compareGameVersions(latest.game_version, retail.gameVersion) < 0
    ? latest
    : null;
  const copied = await copyAbilities(source, version);

  return {
    created,
    gameVersion: retail.gameVersion,
    build: retail.build,
    latest: latest?.game_version || null,
    copied,
    source: source?.game_version || null
  };
}
