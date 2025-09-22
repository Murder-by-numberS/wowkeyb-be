import Logger from '../../utils/logger.js';
import { validationResult } from "express-validator";
import Ability from '../../models/ability.js';
import Version from '../../models/version.js';

import deathknight from './death-knight.js';
import demonhunter from './demon-hunter.js';
import druid from './druid.js';
import evoker from './evoker.js';
import hunter from './hunter.js';
import mage from './mage.js';
import paladin from './paladin.js';
import priest from './priest.js';
import rogue from './rogue.js';
import shaman from './shaman.js';
import warlock from './warlock.js';
import warrior from './warrior.js';

const classes = {
  deathknight,
  demonhunter,
  druid,
  evoker,
  hunter,
  mage,
  paladin,
  priest,
  shaman,
  rogue,
  warlock,
  warrior
}

export const getAbilities = async (req, res) => {
  try {
    console.log('Retrieving abilities', req.params);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const statusCode = 400;
      Logger.error('Validation errors in getAbilities:', {
        errors: errors.array(),
        params: req.params,
        url: req.url,
        statusCode: statusCode
      });
      return res.status(statusCode).json({ errors: errors.array() });
    }

    const { wowClass, spec, heroTalent, version } = req.params;

    Logger.info(`Retrieving ${wowClass} ${spec} ${heroTalent} abilities`);

    // Determine which version to use
    let targetVersion;
    if (version && version !== 'latest') {
      // Get specific version
      targetVersion = await Version.findById(version);
      if (!targetVersion) {
        return res.status(400).send({ message: 'Invalid version ID' });
      }
    } else {
      // Get the latest version
      targetVersion = await Version.findOne().sort({ createdAt: -1 });
      if (!targetVersion) {
        return res.status(400).send({ message: 'No versions available' });
      }
    }

    // Build query for abilities
    const query = {
      class: wowClass,
      game_version: targetVersion._id,
      is_active: true
    };

    // Get class abilities (spec is null)
    const classAbilities = await Ability.find({
      ...query,
      spec: null,
      ability_type: 'class'
    }).populate('game_version');

    // Get spec abilities
    const specAbilities = await Ability.find({
      ...query,
      spec: spec,
      ability_type: 'spec'
    }).populate('game_version');

    // Get hero talent abilities (if hero talent is specified)
    let heroTalentAbilities = [];
    if (heroTalent && heroTalent !== 'null') {
      heroTalentAbilities = await Ability.find({
        ...query,
        hero_talent: heroTalent,
        ability_type: 'hero_talent'
      }).populate('game_version');
    }

    // Combine all abilities
    const abilities = [
      ...classAbilities,
      ...specAbilities,
      ...heroTalentAbilities
    ];

    // Transform to match the expected format
    const transformedAbilities = abilities.map(ability => ({
      id: ability._id,
      spellId: ability.spell_id,
      name: ability.name,
      description: ability.description,
      icon: ability.icon,
      class: ability.class,
      spec: ability.spec,
      heroTalent: ability.hero_talent,
      abilityType: ability.ability_type,
      levelRequired: ability.level_required,
      cooldown: ability.cooldown,
      range: ability.range,
      cost: ability.cost,
      costAmount: ability.cost_amount,
      gameVersion: ability.game_version.game_version
    })).sort((a, b) => a.name.localeCompare(b.name));

    Logger.info(`Retrieved ${transformedAbilities.length} abilities for ${wowClass} ${spec} ${heroTalent} (version: ${targetVersion.game_version})`);

    return res.status(200).send(transformedAbilities);
  } catch (error) {
    Logger.error('Error retrieving abilities:', error);
    return res.status(500).send({ message: 'Error retrieving abilities' });
  }
}

/**
 * Get abilities for a specific version
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAbilitiesByVersion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const statusCode = 400;
      Logger.error('Validation errors in getAbilitiesByVersion:', {
        errors: errors.array(),
        params: req.params,
        url: req.url,
        statusCode: statusCode
      });
      return res.status(statusCode).json({ errors: errors.array() });
    }

    const { wowClass, spec, heroTalent, versionId } = req.params;

    Logger.info(`Retrieving ${wowClass} ${spec} ${heroTalent} abilities for version ${versionId}`);

    // Verify version exists
    const version = await Version.findById(versionId);
    if (!version) {
      return res.status(400).send({ message: 'Invalid version ID' });
    }

    // Build query for abilities
    const query = {
      class: wowClass,
      game_version: versionId,
      is_active: true
    };

    // Get class abilities (spec is null)
    const classAbilities = await Ability.find({
      ...query,
      spec: null,
      ability_type: 'class'
    }).populate('game_version');

    // Get spec abilities
    const specAbilities = await Ability.find({
      ...query,
      spec: spec,
      ability_type: 'spec'
    }).populate('game_version');

    // Get hero talent abilities (if hero talent is specified)
    let heroTalentAbilities = [];
    if (heroTalent && heroTalent !== 'null') {
      heroTalentAbilities = await Ability.find({
        ...query,
        hero_talent: heroTalent,
        ability_type: 'hero_talent'
      }).populate('game_version');
    }

    // Combine all abilities
    const abilities = [
      ...classAbilities,
      ...specAbilities,
      ...heroTalentAbilities
    ];

    // Transform to match the expected format
    const transformedAbilities = abilities.map(ability => ({
      id: ability._id,
      spellId: ability.spell_id,
      name: ability.name,
      description: ability.description,
      icon: ability.icon,
      class: ability.class,
      spec: ability.spec,
      heroTalent: ability.hero_talent,
      abilityType: ability.ability_type,
      levelRequired: ability.level_required,
      cooldown: ability.cooldown,
      range: ability.range,
      cost: ability.cost,
      costAmount: ability.cost_amount,
      gameVersion: ability.game_version.game_version
    })).sort((a, b) => a.name.localeCompare(b.name));

    Logger.info(`Retrieved ${transformedAbilities.length} abilities for ${wowClass} ${spec} ${heroTalent} (version: ${version.game_version})`);

    return res.status(200).send(transformedAbilities);
  } catch (error) {
    Logger.error('Error retrieving abilities by version:', error);
    return res.status(500).send({ message: 'Error retrieving abilities' });
  }
}

export const getAbilitiesByGameVersion = async (req, res) => {
  try {
    console.log('Retrieving abilities by game version', req.params);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const statusCode = 400;
      Logger.error('Validation errors in getAbilitiesByGameVersion:', {
        errors: errors.array(),
        params: req.params,
        url: req.url,
        statusCode: statusCode
      });
      return res.status(statusCode).json({ errors: errors.array() });
    }

    const { wowClass, spec, heroTalent, gameVersion } = req.params;

    Logger.info(`Retrieving ${wowClass} ${spec} ${heroTalent} abilities for game version ${gameVersion}`);

    // Find the version by game_version string
    const targetVersion = await Version.findOne({ game_version: gameVersion });
    if (!targetVersion) {
      return res.status(400).send({ message: `Game version ${gameVersion} not found` });
    }

    // Build query for abilities
    const query = {
      class: wowClass,
      game_version: targetVersion._id,
      is_active: true
    };

    // Get class abilities (spec is null)
    const classAbilities = await Ability.find({
      ...query,
      spec: null,
      ability_type: 'class'
    }).populate('game_version');

    // Get spec abilities
    const specAbilities = await Ability.find({
      ...query,
      spec: spec,
      ability_type: 'spec'
    }).populate('game_version');

    // Get hero talent abilities (if hero talent is specified)
    let heroTalentAbilities = [];
    if (heroTalent && heroTalent !== 'null') {
      heroTalentAbilities = await Ability.find({
        ...query,
        hero_talent: heroTalent,
        ability_type: 'hero_talent'
      }).populate('game_version');
    }

    // Combine all abilities
    const abilities = [
      ...classAbilities,
      ...specAbilities,
      ...heroTalentAbilities
    ];

    // Transform to match the expected format
    const transformedAbilities = abilities.map(ability => ({
      id: ability._id,
      spellId: ability.spell_id,
      name: ability.name,
      description: ability.description,
      icon: ability.icon,
      class: ability.class,
      spec: ability.spec,
      heroTalent: ability.hero_talent,
      abilityType: ability.ability_type,
      levelRequired: ability.level_required,
      cooldown: ability.cooldown,
      range: ability.range,
      cost: ability.cost,
      costAmount: ability.cost_amount,
      gameVersion: ability.game_version.game_version
    })).sort((a, b) => a.name.localeCompare(b.name));

    Logger.info(`Retrieved ${transformedAbilities.length} abilities for ${wowClass} ${spec} ${heroTalent} (version: ${targetVersion.game_version})`);

    return res.status(200).send(transformedAbilities);
  } catch (error) {
    Logger.error('Error retrieving abilities by game version:', error);
    return res.status(500).send({ message: 'Error retrieving abilities' });
  }
}

export const getAbilitiesLatest = async (req, res) => {
  try {
    console.log('Retrieving abilities for latest version', req.params);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const statusCode = 400;
      Logger.error('Validation errors in getAbilitiesLatest:', {
        errors: errors.array(),
        params: req.params,
        url: req.url,
        statusCode: statusCode
      });
      return res.status(statusCode).json({ errors: errors.array() });
    }

    const { wowClass, spec, heroTalent } = req.params;

    Logger.info(`Retrieving ${wowClass} ${spec} ${heroTalent} abilities for latest version`);

    // Get the latest version
    const targetVersion = await Version.findOne().sort({ createdAt: -1 });
    if (!targetVersion) {
      return res.status(400).send({ message: 'No versions available' });
    }

    // Build query for abilities
    const query = {
      class: wowClass,
      game_version: targetVersion._id,
      is_active: true
    };

    // Get class abilities (spec is null)
    const classAbilities = await Ability.find({
      ...query,
      spec: null,
      ability_type: 'class'
    }).populate('game_version');

    // Get spec abilities
    const specAbilities = await Ability.find({
      ...query,
      spec: spec,
      ability_type: 'spec'
    }).populate('game_version');

    // Get hero talent abilities (if hero talent is specified)
    let heroTalentAbilities = [];
    if (heroTalent && heroTalent !== 'null') {
      heroTalentAbilities = await Ability.find({
        ...query,
        hero_talent: heroTalent,
        ability_type: 'hero_talent'
      }).populate('game_version');
    }

    // Combine all abilities
    const abilities = [
      ...classAbilities,
      ...specAbilities,
      ...heroTalentAbilities
    ];

    // Transform to match the expected format
    const transformedAbilities = abilities.map(ability => ({
      id: ability._id,
      spellId: ability.spell_id,
      name: ability.name,
      description: ability.description,
      icon: ability.icon,
      class: ability.class,
      spec: ability.spec,
      heroTalent: ability.hero_talent,
      abilityType: ability.ability_type,
      levelRequired: ability.level_required,
      cooldown: ability.cooldown,
      range: ability.range,
      cost: ability.cost,
      costAmount: ability.cost_amount,
      gameVersion: ability.game_version.game_version
    })).sort((a, b) => a.name.localeCompare(b.name));

    Logger.info(`Retrieved ${transformedAbilities.length} abilities for ${wowClass} ${spec} ${heroTalent} (latest version: ${targetVersion.game_version})`);

    return res.status(200).send(transformedAbilities);
  } catch (error) {
    Logger.error('Error retrieving abilities for latest version:', error);
    return res.status(500).send({ message: 'Error retrieving abilities' });
  }
}

export const getAbilitiesFlexible = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const statusCode = 400;
      Logger.error('Validation errors in getAbilitiesFlexible:', {
        errors: errors.array(),
        query: req.query,
        url: req.url,
        statusCode: statusCode
      });
      return res.status(statusCode).json({ errors: errors.array() });
    }

    const {
      gameVersion,
      class: wowClass,
      spec,
      heroTalent,
      page = 1,
      limit = 20,
      columnName,
      columnClass,
      columnSpec,
      columnHeroTalent,
      columnDescription,
      filterMode = 'inclusion'
    } = req.query;

    Logger.info(`Retrieving abilities with ${filterMode} filters: gameVersion=${gameVersion}, class=${wowClass}, spec=${spec}, heroTalent=${heroTalent}, columnName=${columnName}, columnClass=${columnClass}, columnSpec=${columnSpec}, columnHeroTalent=${columnHeroTalent}, columnDescription=${columnDescription}`);

    // Determine which version to use
    let targetVersion;
    if (gameVersion && gameVersion !== 'latest') {
      // Get specific version by game_version string
      targetVersion = await Version.findOne({ game_version: gameVersion });
      if (!targetVersion) {
        return res.status(400).send({ message: `Game version ${gameVersion} not found` });
      }
    } else {
      // Get the latest version
      targetVersion = await Version.findOne().sort({ createdAt: -1 });
      if (!targetVersion) {
        return res.status(400).send({ message: 'No versions available' });
      }
    }

    // Build base query for version and active status
    const baseQuery = {
      game_version: targetVersion._id,
      is_active: true
    };

    let query;

    if (filterMode === 'exact') {
      // Exact matching mode: build a single query with all specified filters
      query = { ...baseQuery };

      // Add main filters (for context) - only if no column filters override them
      if (wowClass && !columnClass) query.class = wowClass;
      if (spec && !columnSpec) query.spec = spec;
      if (heroTalent && !columnHeroTalent) query.hero_talent = heroTalent;

      // Add column filters (exact matching) - these take precedence over main filters
      if (columnName) query.name = { $regex: columnName, $options: 'i' }; // Case-insensitive partial match
      if (columnClass) query.class = columnClass;
      if (columnSpec) query.spec = columnSpec;
      if (columnHeroTalent) query.hero_talent = columnHeroTalent;
      if (columnDescription) query.description = { $regex: columnDescription, $options: 'i' }; // Case-insensitive partial match

    } else {
      // Inclusion mode (default): build inclusion queries based on what filters are provided
      const inclusionQueries = [];

      if (wowClass) {
        // If class is specified, we want to include:
        // 1. Core class abilities (spec=null, ability_type='class')
        // 2. Spec abilities for the selected spec (if spec is provided)
        // 3. Hero talent abilities for the selected hero talent (if hero talent is provided)

        // Always include core class abilities for the selected class
        inclusionQueries.push({
          ...baseQuery,
          class: wowClass,
          spec: null,
          ability_type: 'class'
        });

        // If spec is provided, include spec abilities
        if (spec) {
          inclusionQueries.push({
            ...baseQuery,
            class: wowClass,
            spec: spec,
            ability_type: 'spec'
          });
        }

        // If hero talent is provided, include hero talent abilities
        if (heroTalent) {
          inclusionQueries.push({
            ...baseQuery,
            class: wowClass,
            hero_talent: heroTalent,
            ability_type: 'hero_talent'
          });
        }
      } else {
        // If no class is specified, just use the base query (show all abilities)
        inclusionQueries.push(baseQuery);
      }

      // Use $or to combine all inclusion queries
      query = inclusionQueries.length > 1 ? { $or: inclusionQueries } : inclusionQueries[0];
    }


    // Get total count for pagination
    const totalCount = await Ability.countDocuments(query);

    // Calculate pagination values
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get abilities based on inclusion filters with pagination
    const abilities = await Ability.find(query)
      .populate('game_version', 'game_version')
      .select('name spell_id description icon class spec hero_talent ability_type level_required cooldown range cost cost_amount')
      .skip(skip)
      .limit(limitNum)
      .sort({ name: 1 })
      .lean(); // Use lean() for better performance

    // Transform to match the expected format and filter out empty values
    const transformedAbilities = abilities.map(ability => {
      const transformed = {
        id: ability._id,
        spellId: ability.spell_id,
        name: ability.name,
        description: ability.description,
        icon: ability.icon,
        abilityType: ability.ability_type,
        gameVersion: ability.game_version.game_version
      };

      // Always include these fields (even if null)
      transformed.class = ability.class;
      transformed.spec = ability.spec;
      transformed.heroTalent = ability.hero_talent;

      // Only add optional fields that have values
      if (ability.level_required) transformed.levelRequired = ability.level_required;
      if (ability.cooldown) transformed.cooldown = ability.cooldown;
      if (ability.range) transformed.range = ability.range;
      if (ability.cost) transformed.cost = ability.cost;
      if (ability.cost_amount) transformed.costAmount = ability.cost_amount;

      return transformed;
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    Logger.info(`Retrieved ${transformedAbilities.length} abilities with ${filterMode} filters (version: ${targetVersion.game_version}, page: ${pageNum}/${totalPages})`);

    return res.status(200).send({
      abilities: transformedAbilities,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNum
      }
    });
  } catch (error) {
    Logger.error('Error retrieving abilities with flexible filters:', error);
    return res.status(500).send({ message: 'Error retrieving abilities' });
  }
}

export const generateRandomClassDetails = () => {
  // Get random class
  const classNames = Object.keys(classes);
  const randomClass = classNames[Math.floor(Math.random() * classNames.length)];

  // Get random spec for the selected class
  const specs = Object.keys(classes[randomClass].specAbilities);
  const randomSpec = specs[Math.floor(Math.random() * specs.length)];

  // Get random hero talent for the spec
  const heroTalents = Object.keys(classes[randomClass].specAbilities[randomSpec])
    .filter(key => key !== 'abilities'); // Filter out the 'abilities' key
  const randomHeroTalent = heroTalents[Math.floor(Math.random() * heroTalents.length)];

  return {
    class: randomClass,
    spec: randomSpec,
    heroTalent: randomHeroTalent
  };
}
