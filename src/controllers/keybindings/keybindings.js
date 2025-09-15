import Keybinding from '../../models/keybinding.js';
import Version from '../../models/version.js';
import Ability from '../../models/ability.js';
import { presentOne, presentMany } from '../../presenters/keybindings.js';
import Logger from '../../utils/logger.js';
import { generateRandomClassDetails } from '../ability/abilities.js';


/**
 * Get keybindings for the user
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getKeybindings = async (req, res, next) => {
  try {

    Logger.info('Getting Keybindings');

    const { user_id } = req.decoded;

    const keybindings = await Keybinding.find({ user_id })
      .populate('version', 'game_version')
      .select('name class spec version is_public createdAt duplication_count')
      .limit(100) // Prevent runaway queries
      .lean(); // Use lean() for better performance

    res.status(200).send(presentMany(keybindings));
  } catch (error) {
    next(error);
  }
};

/**
 * Get keybindings for the home page
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getHomeKeybindings = async (req, res, next) => {
  try {
    Logger.info('Getting Home Keybindings');

    // Get all public keybindings with limits
    const keybindings = await Keybinding.find({ is_public: true })
      .populate('version', 'game_version')
      .select('name class spec version createdAt duplication_count')
      .limit(500) // Limit for home page performance
      .lean(); // Use lean() for better performance

    // Group keybindings by class
    const classGroups = keybindings.reduce((acc, keybinding) => {
      const className = keybinding.class.charAt(0).toUpperCase() + keybinding.class.slice(1);
      if (!acc[className]) {
        acc[className] = {
          recent: [],
          popular: []
        };
      }
      acc[className].recent.push(keybinding);
      return acc;
    }, {});

    // Sort recent by creation date and limit to 5 per class
    // Sort popular by duplication count and limit to 5 per class
    const result = Object.entries(classGroups).reduce((acc, [className, data]) => {
      acc[className] = {
        recent: presentMany(data.recent
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 5)),
        popular: presentMany(data.recent
          .sort((a, b) => (b.duplication_count || 0) - (a.duplication_count || 0))
          .slice(0, 5))
      };
      return acc;
    }, {});

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Save/update an existing keybinding
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateKeybinding = async (req, res, next) => {
  try {
    const { keybinding_id } = req.params;

    // Find the keybinding (automatically excludes soft-deleted ones due to middleware)
    const keybinding = await Keybinding.findById(keybinding_id).populate('version');

    if (!keybinding) {
      return res.status(404).send({ message: 'Keybinding not found' });
    }

    // If keybinding has a user_id, verify ownership
    if (keybinding.user_id) {
      const { decoded } = req;
      if (!decoded || !decoded.user_id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const keybindingUserId = keybinding.user_id.toString();
      if (keybindingUserId !== decoded.user_id) {
        Logger.error('User is not authorized to update this keybinding');
        return res.status(403).json({ message: 'Not authorized to modify this keybinding' });
      }
    }

    if ('isPublic' in req.body) {
      req.body.is_public = req.body.isPublic;
      delete req.body.isPublic;
    }

    req.body.hero_talent = req.body.heroTalent;
    delete req.body.heroTalent;

    // Normalize class field if it exists
    if (req.body.class !== undefined) {
      const normalizedClass = req.body.class.toLowerCase().replace(/\s+/g, '');

      //if the class is not the same as the keybinding class, remove keybinds
      if (normalizedClass !== keybinding.class) {
        req.body.keybinds = [];
      }
      req.body.class = normalizedClass;
    }

    if (req.body.spec !== undefined) {
      let normalizedSpec = req.body.spec.toLowerCase();

      if (normalizedSpec === 'beast mastery') {
        normalizedSpec = 'beast-mastery';
      }

      //if the spec is not the same as the keybinding spec, remove keybinds
      if (normalizedSpec !== keybinding.spec) {
        req.body.keybinds = [];
      }
      req.body.spec = normalizedSpec;
    }

    if (req.body.hero_talent !== undefined) {
      let normalizedHeroTalent = req.body.hero_talent.toLowerCase();

      //if there is a space in the hero_talent, replace it with a dash
      if (normalizedHeroTalent.includes(' ')) {
        normalizedHeroTalent = normalizedHeroTalent.replace(/\s+/g, '-');
      }

      //if the hero_talent is not the same as the keybinding hero_talent, remove keybinds
      if (normalizedHeroTalent !== keybinding.hero_talent) {
        req.body.keybinds = [];
      }
      req.body.hero_talent = normalizedHeroTalent;
    }

    if (req.body.keybinds) {
      req.body.keybinds = req.body.keybinds.map(keybind => {
        if (keybind.spell.spellId) {
          keybind.spell.spell_id = keybind.spell.spellId.toString();
          delete keybind.spell.spellId;
        }
        return keybind;
      })
    }

    // Handle version update
    if (req.body.version) {
      // Check if the version exists
      const version = await Version.findById(req.body.version);
      if (!version) {
        return res.status(400).send({ message: 'Invalid version ID' });
      }
    }

    console.log('after req.body', req.body);
    const updatedKeybinding = await Keybinding.findOneAndUpdate(
      { _id: keybinding_id },
      req.body,
      { new: true }
    ).populate('version');

    return res.status(200).send(presentOne(updatedKeybinding));
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new keybinding
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const createKeybinding = async (req, res, next) => {
  try {
    Logger.info('Creating Keybinding');

    const randomClass = generateRandomClassDetails();

    if (req.body?.spec === 'beast mastery') {
      req.body.spec = 'beast-mastery';
    }

    // Validate version if provided
    let versionId = null;
    if (req.body?.version) {
      // Check if the version exists
      const version = await Version.findById(req.body.version);
      if (!version) {
        return res.status(400).send({ message: 'Invalid version ID' });
      }
      versionId = req.body.version;
    } else {
      // Get the latest version if none provided
      const latestVersion = await Version.findOne().sort({ createdAt: -1 });
      if (!latestVersion) {
        return res.status(400).send({ message: 'No versions available. Please create a version first.' });
      }
      versionId = latestVersion._id;
    }

    // If duplicating an existing keybinding
    if (req.body.duplicate_from) {
      await incrementDuplicationCount(req.body.duplicate_from);
    }

    const classDetails = (req.body?.class && req.body?.spec && req.body?.heroTalent) ? {
      class: req.body.class.toLowerCase().replace(/\s+/g, ''),
      spec: req.body.spec.toLowerCase(),
      heroTalent: req.body.heroTalent.toLowerCase().replace(/\s+/g, '-')
    } : randomClass;

    // Process keybinds if they exist
    let processedKeybinds = [];
    if (req.body?.keybinds && Array.isArray(req.body.keybinds)) {
      console.log('Processing keybinds:', req.body.keybinds);
      processedKeybinds = req.body.keybinds.map(keybind => {
        // Ensure all required fields are present
        if (!keybind.spell) {
          console.error('Missing spell object in keybind:', keybind);
          return null;
        }

        const processedKeybind = {
          key: keybind.key || null,
          spell: {
            key: keybind.spell.key || null,
            description: keybind.spell.description || null,
            icon: keybind.spell.icon || null,
            name: keybind.spell.name || null,
            spell_id: keybind.spell.spellId?.toString() || keybind.spell.spell_id || null
          }
        };

        // Validate required fields
        if (!processedKeybind.spell.key) {
          console.error('Missing required spell.key in keybind:', keybind);
          return null;
        }

        return processedKeybind;
      }).filter(keybind => keybind !== null); // Remove any invalid keybinds

      console.log('Processed keybinds:', processedKeybinds);
    }

    const newKeybinding = {
      name: req.body?.name || 'New Keybinding',
      class: classDetails.class,
      spec: classDetails.spec,
      hero_talent: classDetails.heroTalent,
      version: versionId,
      is_public: req.decoded?.user_id ? false : true,
      user_id: req.decoded?.user_id || null,
      keybinds: processedKeybinds
    }

    console.log('Creating new keybinding with data:', newKeybinding);
    const createdKeybinding = await Keybinding.create(newKeybinding);

    // Populate version information for the response
    const populatedKeybinding = await Keybinding.findById(createdKeybinding._id).populate('version');

    return res.status(200).send(presentOne(populatedKeybinding));
  } catch (error) {
    console.error('Error creating keybinding:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }
};

/**
 * Delete a keybinding (soft delete)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const deleteKeybinding = async (req, res, next) => {
  try {
    const { keybinding_id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(keybinding_id);
    if (!isValidObjectId) {
      return res.status(400).send({ message: 'Invalid keybinding ID format' });
    }

    // Find the keybinding first to verify ownership (including soft-deleted ones)
    const keybinding = await Keybinding.findOne({ _id: keybinding_id }).setOptions({ includeDeleted: true }).populate('version');
    if (!keybinding) {
      return res.status(404).send({ message: 'Keybinding not found' });
    }

    // Check if already soft-deleted
    if (keybinding.deleted_at) {
      return res.status(400).send({ message: 'Keybinding is already deleted' });
    }

    // Verify ownership
    if (keybinding.user_id?.toString() !== req.decoded.user_id) {
      return res.status(403).send({ message: 'Not authorized to delete this keybinding' });
    }

    // Get the keybinding data before soft-deleting
    const keybindingData = presentOne(keybinding);

    // Soft delete by setting deleted_at timestamp
    await Keybinding.findByIdAndUpdate(keybinding_id, { deleted_at: new Date() });

    return res.status(200).send({
      message: 'Keybinding deleted',
      keybindingId: keybinding_id,
      deletedKeybinding: keybindingData // Include the full keybinding data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Restore a soft-deleted keybinding
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const restoreKeybinding = async (req, res, next) => {
  try {
    const { keybinding_id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(keybinding_id);
    if (!isValidObjectId) {
      return res.status(400).send({ message: 'Invalid keybinding ID format' });
    }

    // Find the keybinding including soft-deleted ones
    const keybinding = await Keybinding.findOne({ _id: keybinding_id }).setOptions({ includeDeleted: true });
    if (!keybinding) {
      return res.status(404).send({ message: 'Keybinding not found' });
    }

    // Check if not soft-deleted
    if (!keybinding.deleted_at) {
      return res.status(400).send({ message: 'Keybinding is not deleted' });
    }

    // Verify ownership
    if (keybinding.user_id?.toString() !== req.decoded.user_id) {
      return res.status(403).send({ message: 'Not authorized to restore this keybinding' });
    }

    // Restore by removing deleted_at timestamp
    const restoredKeybinding = await Keybinding.findByIdAndUpdate(
      keybinding_id,
      { deleted_at: null },
      { new: true }
    ).populate('version');

    return res.status(200).send({
      message: 'Keybinding restored',
      keybindingId: keybinding_id,
      restoredKeybinding: presentOne(restoredKeybinding)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Permanently delete a keybinding (hard delete)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const permanentlyDeleteKeybinding = async (req, res, next) => {
  try {
    const { keybinding_id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(keybinding_id);
    if (!isValidObjectId) {
      return res.status(400).send({ message: 'Invalid keybinding ID format' });
    }

    // Find the keybinding including soft-deleted ones
    const keybinding = await Keybinding.findOne({ _id: keybinding_id }).setOptions({ includeDeleted: true }).populate('version');
    if (!keybinding) {
      return res.status(404).send({ message: 'Keybinding not found' });
    }

    // Verify ownership
    if (keybinding.user_id?.toString() !== req.decoded.user_id) {
      return res.status(403).send({ message: 'Not authorized to permanently delete this keybinding' });
    }

    // Get the keybinding data before permanently deleting
    const keybindingData = presentOne(keybinding);

    // Permanently delete the keybinding
    await Keybinding.findByIdAndDelete(keybinding_id);

    return res.status(200).send({
      message: 'Keybinding permanently deleted',
      keybindingId: keybinding_id,
      deletedKeybinding: keybindingData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single keybinding
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getKeybinding = async (req, res, next) => {
  try {
    const { keybinding_id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(keybinding_id);
    if (!isValidObjectId) {
      return res.status(400).send({ message: 'Invalid keybinding ID format' });
    }

    // Find the keybinding (automatically excludes soft-deleted ones due to middleware)
    const keybinding = await Keybinding.findById(keybinding_id).populate('version');

    if (!keybinding) {
      return res.status(404).send({ message: 'Keybinding not found' });
    }

    console.log('Authorization check:', {
      keybindingId: keybinding._id,
      isPublic: keybinding.is_public,
      keybindingUserId: keybinding.user_id?.toString(),
      requestingUserId: req.decoded?.user_id,
      types: {
        keybindingUserIdType: typeof keybinding.user_id,
        requestingUserIdType: typeof req.decoded?.user_id
      }
    });

    // If the keybinding is private, require authentication
    if (!keybinding.is_public) {
      if (!req.decoded?.user_id) {
        return res.status(401).send({ message: 'Authentication required' });
      }

      if (keybinding.user_id?.toString() !== req.decoded.user_id) {
        console.log('Access denied - keybinding is private and user is not the owner');
        return res.status(403).send({ message: 'Not authorized to access this keybinding' });
      }
    }

    console.log('Access granted to keybinding');

    return res.status(200).send(presentOne(keybinding));
  } catch (error) {
    next(error);
  }
};

/**
 * Increment the duplication count for a keybinding
 * @param {string} keybindingId - The ID of the keybinding to increment
 */
export const incrementDuplicationCount = async (keybindingId) => {
  try {
    await Keybinding.findByIdAndUpdate(
      keybindingId,
      { $inc: { duplication_count: 1 } }
    );
  } catch (error) {
    Logger.error('Error incrementing duplication count:', error);
  }
};

/**
 * Duplicate an existing keybinding
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const duplicateKeybinding = async (req, res, next) => {
  try {
    const { keybinding_id } = req.params;
    Logger.info(`Duplicating keybinding: ${keybinding_id}`);

    // Find the original keybinding (automatically excludes soft-deleted ones due to middleware)
    const originalKeybinding = await Keybinding.findById(keybinding_id);
    if (!originalKeybinding) {
      return res.status(404).send({ message: 'Keybinding not found' });
    }

    // Convert mongoose document to plain object
    const originalData = originalKeybinding.toObject();

    // Find existing copies of this keybinding (automatically excludes soft-deleted ones)
    const baseName = originalData.name;
    const copyRegex = new RegExp(`^${baseName} \\(Copy(?: \\d+)?\\)$`);
    const existingCopies = await Keybinding.find({
      name: copyRegex,
      user_id: req.decoded?.user_id
    });

    // Determine the next copy number
    let copyNumber = 1;
    if (existingCopies.length > 0) {
      const numbers = existingCopies.map(copy => {
        const match = copy.name.match(/\(Copy (\d+)\)$/);
        return match ? parseInt(match[1]) : 1;
      });
      copyNumber = Math.max(...numbers) + 1;
    }

    // Create the new name
    const newName = copyNumber === 1
      ? `${baseName} (Copy)`
      : `${baseName} (Copy ${copyNumber})`;

    console.log('Original keybinding:', {
      id: originalData._id,
      name: originalData.name,
      keybindsCount: originalData.keybinds?.length,
      keybinds: JSON.stringify(originalData.keybinds, null, 2)
    });

    // Create a deep copy of the keybinding
    const duplicatedKeybinding = {
      name: newName,
      class: originalData.class,
      spec: originalData.spec,
      hero_talent: originalData.hero_talent,
      version: originalData.version,
      is_public: false,
      user_id: req.decoded?.user_id || null,
      keybinds: originalData.keybinds?.map(keybind => {
        console.log('Processing keybind:', JSON.stringify(keybind, null, 2));

        // Create a complete copy of the keybind
        const newKeybind = {
          key: keybind.key,
          spell: {
            key: keybind.key,
            description: keybind.spell.description,
            icon: keybind.spell.icon,
            name: keybind.spell.name,
            spell_id: keybind.spell.spell_id
          }
        };

        console.log('Created new keybind:', JSON.stringify(newKeybind, null, 2));
        return newKeybind;
      }) || []
    };

    console.log('Creating duplicated keybinding:', {
      name: duplicatedKeybinding.name,
      keybindsCount: duplicatedKeybinding.keybinds?.length,
      keybinds: JSON.stringify(duplicatedKeybinding.keybinds, null, 2)
    });

    const createdKeybinding = await Keybinding.create(duplicatedKeybinding);

    // Populate version information for the response
    const populatedKeybinding = await Keybinding.findById(createdKeybinding._id).populate('version');

    // Increment the duplication count of the original keybinding
    await incrementDuplicationCount(keybinding_id);

    return res.status(200).send(presentOne(populatedKeybinding));
  } catch (error) {
    console.error('Error duplicating keybinding:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).send({
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }
};

/**
 * Get soft-deleted keybindings for the user
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getDeletedKeybindings = async (req, res, next) => {
  try {
    Logger.info('Getting Deleted Keybindings');

    const { user_id } = req.decoded;

    // Find soft-deleted keybindings for the user
    const deletedKeybindings = await Keybinding.find({
      user_id,
      deleted_at: { $ne: null }
    })
      .setOptions({ includeDeleted: true })
      .populate('version', 'game_version')
      .select('name class spec version createdAt deleted_at')
      .limit(50) // Limit deleted keybindings
      .lean();

    res.status(200).send(presentMany(deletedKeybindings));
  } catch (error) {
    next(error);
  }
};

/**
 * Migrate a specific keybinding to the latest version
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const migrateKeybindingToLatestVersion = async (req, res, next) => {
  try {
    const { keybinding_id } = req.params;

    Logger.info(`Migrating keybinding ${keybinding_id} to latest version`);

    // Check if the keybinding ID is valid
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(keybinding_id);
    if (!isValidObjectId) {
      return res.status(400).send({ message: 'Invalid keybinding ID format' });
    }

    // Find the keybinding
    const keybinding = await Keybinding.findById(keybinding_id).populate('version');
    if (!keybinding) {
      return res.status(404).send({ message: 'Keybinding not found' });
    }

    // Verify ownership
    if (keybinding.user_id?.toString() !== req.decoded.user_id) {
      return res.status(403).send({ message: 'Not authorized to modify this keybinding' });
    }

    // Get the latest version
    const latestVersion = await Version.findOne().sort({ createdAt: -1 });
    if (!latestVersion) {
      return res.status(400).send({ message: 'No versions available' });
    }

    // Check if already on latest version
    if (keybinding.version?._id?.toString() === latestVersion._id.toString()) {
      return res.status(200).send({
        message: 'Keybinding is already on the latest version',
        latestVersion: latestVersion.game_version,
        removedKeybindsCount: 0
      });
    }

    let removedKeybindsCount = 0;
    const originalKeybindsCount = keybinding.keybinds?.length || 0;
    let updatedKeybinds = keybinding.keybinds || [];

    if (keybinding.keybinds && keybinding.keybinds.length > 0) {
      // Get all valid abilities for this class/spec/hero_talent in the latest version
      const abilityQuery = {
        class: keybinding.class,
        game_version: latestVersion._id,
        is_active: true
      };

      // Get class abilities
      const classAbilities = await Ability.find({
        ...abilityQuery,
        spec: null,
        ability_type: 'class'
      });

      // Get spec abilities
      const specAbilities = await Ability.find({
        ...abilityQuery,
        spec: keybinding.spec,
        ability_type: 'spec'
      });

      // Get hero talent abilities
      let heroTalentAbilities = [];
      if (keybinding.hero_talent) {
        heroTalentAbilities = await Ability.find({
          ...abilityQuery,
          hero_talent: keybinding.hero_talent,
          ability_type: 'hero_talent'
        });
      }

      // Combine all valid abilities
      const validAbilities = [
        ...classAbilities,
        ...specAbilities,
        ...heroTalentAbilities
      ];

      // Create a set of valid spell IDs for quick lookup
      const validSpellIds = new Set(validAbilities.map(ability => ability.spell_id));

      // Filter out keybinds for abilities that don't exist in the latest version
      updatedKeybinds = keybinding.keybinds.filter(keybind => {
        const spellId = keybind.spell?.spell_id;
        const isValid = validSpellIds.has(spellId);

        if (!isValid) {
          Logger.info(`Removing keybind for spell ${spellId} (${keybind.spell?.name}) from keybinding ${keybinding_id} - not available in version ${latestVersion.game_version}`);
          removedKeybindsCount++;
        }

        return isValid;
      });

      Logger.info(`Removed ${removedKeybindsCount} invalid keybinds from keybinding ${keybinding_id}`);
    }

    // Update the keybinding to the latest version
    const updatedKeybinding = await Keybinding.findByIdAndUpdate(
      keybinding_id,
      {
        version: latestVersion._id,
        keybinds: updatedKeybinds
      },
      { new: true }
    ).populate('version');

    Logger.info(`Successfully migrated keybinding ${keybinding_id} to version ${latestVersion.game_version}`);

    return res.status(200).send({
      message: 'Keybinding migrated successfully',
      keybinding: presentOne(updatedKeybinding),
      latestVersion: latestVersion.game_version,
      removedKeybindsCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Migrate keybindings to the latest version
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const migrateKeybindingsToLatestVersion = async (req, res, next) => {
  try {
    Logger.info('Migrating keybindings to latest version');

    const { user_id } = req.decoded;

    // Get the latest version
    const latestVersion = await Version.findOne().sort({ createdAt: -1 });
    if (!latestVersion) {
      return res.status(400).send({ message: 'No versions available' });
    }

    // Get all keybindings for the user that are not already on the latest version
    const keybindingsToMigrate = await Keybinding.find({
      user_id,
      version: { $ne: latestVersion._id }
    }).populate('version');

    if (keybindingsToMigrate.length === 0) {
      return res.status(200).send({
        message: 'All keybindings are already on the latest version',
        latestVersion: latestVersion.game_version,
        migratedCount: 0,
        removedKeybindsCount: 0
      });
    }

    let totalRemovedKeybinds = 0;
    let migratedCount = 0;

    // Process each keybinding individually to clean up invalid keybinds
    for (const keybinding of keybindingsToMigrate) {
      let hasChanges = false;
      const originalKeybindsCount = keybinding.keybinds?.length || 0;

      if (keybinding.keybinds && keybinding.keybinds.length > 0) {
        // Get all valid abilities for this class/spec/hero_talent in the latest version
        const abilityQuery = {
          class: keybinding.class,
          game_version: latestVersion._id,
          is_active: true
        };

        // Get class abilities
        const classAbilities = await Ability.find({
          ...abilityQuery,
          spec: null,
          ability_type: 'class'
        });

        // Get spec abilities
        const specAbilities = await Ability.find({
          ...abilityQuery,
          spec: keybinding.spec,
          ability_type: 'spec'
        });

        // Get hero talent abilities
        let heroTalentAbilities = [];
        if (keybinding.hero_talent) {
          heroTalentAbilities = await Ability.find({
            ...abilityQuery,
            hero_talent: keybinding.hero_talent,
            ability_type: 'hero_talent'
          });
        }

        // Combine all valid abilities
        const validAbilities = [
          ...classAbilities,
          ...specAbilities,
          ...heroTalentAbilities
        ];

        // Create a set of valid spell IDs for quick lookup
        const validSpellIds = new Set(validAbilities.map(ability => ability.spell_id));

        // Filter out keybinds for abilities that don't exist in the latest version
        const filteredKeybinds = keybinding.keybinds.filter(keybind => {
          const spellId = keybind.spell?.spell_id;
          const isValid = validSpellIds.has(spellId);

          if (!isValid) {
            Logger.info(`Removing keybind for spell ${spellId} (${keybind.spell?.name}) from keybinding ${keybinding._id} - not available in version ${latestVersion.game_version}`);
            totalRemovedKeybinds++;
          }

          return isValid;
        });

        // Update the keybinding if keybinds were removed
        if (filteredKeybinds.length !== originalKeybindsCount) {
          keybinding.keybinds = filteredKeybinds;
          hasChanges = true;

          Logger.info(`Removed ${originalKeybindsCount - filteredKeybinds.length} invalid keybinds from keybinding ${keybinding._id}`);
        }
      }

      // Update the keybinding to the latest version (and save any keybind changes)
      await Keybinding.findByIdAndUpdate(
        keybinding._id,
        {
          version: latestVersion._id,
          ...(hasChanges && { keybinds: keybinding.keybinds })
        }
      );

      migratedCount++;
    }

    Logger.info(`Migrated ${migratedCount} keybindings to version ${latestVersion.game_version}, removed ${totalRemovedKeybinds} invalid keybinds`);

    return res.status(200).send({
      message: 'Keybindings migrated successfully',
      latestVersion: latestVersion.game_version,
      migratedCount,
      removedKeybindsCount: totalRemovedKeybinds
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Migrate a specific keybinding to a specific version
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const migrateKeybindingToVersion = async (req, res, next) => {
  try {
    const { keybinding_id } = req.params;
    const { version_id } = req.body;

    Logger.info(`Migrating keybinding ${keybinding_id} to version ${version_id}`);

    // Check if the keybinding ID is valid
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(keybinding_id);
    if (!isValidObjectId) {
      return res.status(400).send({ message: 'Invalid keybinding ID format' });
    }

    // Check if the version ID is valid
    const isValidVersionId = /^[0-9a-fA-F]{24}$/.test(version_id);
    if (!isValidVersionId) {
      return res.status(400).send({ message: 'Invalid version ID format' });
    }

    // Find the keybinding
    const keybinding = await Keybinding.findById(keybinding_id);
    if (!keybinding) {
      return res.status(404).send({ message: 'Keybinding not found' });
    }

    // Verify ownership
    if (keybinding.user_id?.toString() !== req.decoded.user_id) {
      return res.status(403).send({ message: 'Not authorized to modify this keybinding' });
    }

    // Check if the version exists
    const version = await Version.findById(version_id);
    if (!version) {
      return res.status(404).send({ message: 'Version not found' });
    }

    // Update the keybinding to the new version
    const updatedKeybinding = await Keybinding.findByIdAndUpdate(
      keybinding_id,
      { version: version_id },
      { new: true }
    ).populate('version');

    Logger.info(`Successfully migrated keybinding ${keybinding_id} to version ${version.game_version}`);

    return res.status(200).send({
      message: 'Keybinding migrated successfully',
      keybinding: presentOne(updatedKeybinding),
      targetVersion: version.game_version
    });
  } catch (error) {
    next(error);
  }
};
