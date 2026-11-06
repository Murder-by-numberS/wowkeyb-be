import mongoose from 'mongoose';
import { pathToFileURL } from 'url';
import Version from '../models/version.js';
import Ability from '../models/ability.js';
import Config from '../config/config.js';

const GAME_VERSION = '12.1.5';
const SOURCE_GAME_VERSION = '12.0.0';

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

/**
 * Create Midnight 12.1.5 and copy the 12.0.0 ability catalog into it
 * when the new version has no abilities yet.
 */
async function createVersion1215() {
  try {
    console.log(`Creating version ${GAME_VERSION}...`);
    await mongoose.connect(Config.databaseURI);
    console.log('Connected to database');

    let version = await Version.findOne({ game_version: GAME_VERSION });
    if (version) {
      console.log(`Version ${GAME_VERSION} already exists (${version._id})`);
    } else {
      version = await Version.create({ game_version: GAME_VERSION });
      console.log(`Created version: ${version.game_version} (${version._id})`);
    }

    const existingAbilities = await Ability.countDocuments({
      game_version: version._id,
      includeInactive: true
    });
    if (existingAbilities > 0) {
      console.log(`${GAME_VERSION} already has ${existingAbilities} abilities, skipping copy`);
      return;
    }

    const source = await Version.findOne({ game_version: SOURCE_GAME_VERSION });
    if (!source) {
      console.log(`Source version ${SOURCE_GAME_VERSION} was not found, so no abilities were copied`);
      return;
    }

    const sourceAbilities = await Ability.find({
      game_version: source._id,
      includeInactive: true
    });
    if (sourceAbilities.length === 0) {
      console.log(`Source version ${SOURCE_GAME_VERSION} has no abilities to copy`);
      return;
    }

    const copies = sourceAbilities.map((ability) => abilityCopy(ability, version._id));
    await Ability.insertMany(copies, { ordered: true });
    console.log(`Copied ${copies.length} abilities from ${SOURCE_GAME_VERSION} to ${GAME_VERSION}`);
  } catch (error) {
    console.error('Script failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createVersion1215();
}

export default createVersion1215;
