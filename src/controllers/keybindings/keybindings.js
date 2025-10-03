import mongoose from 'mongoose';
import Keybinding from '../../models/keybinding.js';
import Version from '../../models/version.js';
import Ability from '../../models/ability.js';
import { presentOne, presentMany } from '../../presenters/keybindings.js';
import Logger from '../../utils/logger.js';
import { generateRandomClassDetails } from '../ability/abilities.js';

/**
 * Helper function to get the latest version by semantic version number
 * @returns {Promise<Object>} The latest version document
 */
async function getLatestVersionBySemanticVersion() {
  const allVersions = await Version.find({});
  if (allVersions.length === 0) {
    return null;
  }

  Logger.info(`Found ${allVersions.length} versions:`, allVersions.map(v => ({
    id: v._id.toString(),
    game_version: v.game_version,
    createdAt: v.createdAt
  })));

  // Sort versions by semantic version number (highest first)
  const sortedVersions = allVersions.sort((a, b) => {
    const aParts = a.game_version.split('.').map(Number);
    const bParts = b.game_version.split('.').map(Number);

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      if (aPart > bPart) return -1;
      if (aPart < bPart) return 1;
    }
    return 0;
  });

  Logger.info(`Sorted versions:`, sortedVersions.map(v => ({
    id: v._id.toString(),
    game_version: v.game_version,
    createdAt: v.createdAt
  })));

  const latest = sortedVersions[0];
  Logger.info(`Selected latest version:`, {
    id: latest._id.toString(),
    game_version: latest.game_version,
    createdAt: latest.createdAt
  });

  return latest;
}


/**
 * Get keybindings for the user
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getKeybindings = async (req, res, next) => {
  try {

    Logger.info('Getting Keybindings');
    Logger.info('Request query params:', req.query);
    Logger.info('Request headers cache-control:', req.headers['cache-control']);

    const { user_id } = req.decoded;

    const keybindings = await Keybinding.find({ user_id })
      .populate('version', 'game_version')
      .select('name class spec hero_talent version is_public createdAt duplication_count keybinds deleted_at')
      .limit(100) // Prevent runaway queries
      .lean(); // Use lean() for better performance

    // Check if any soft-deleted keybindings are being returned
    const softDeletedCount = keybindings.filter(kb => kb.deleted_at).length;
    if (softDeletedCount > 0) {
      Logger.error(`WARNING: ${softDeletedCount} soft-deleted keybindings are being returned for user ${user_id}`);
      Logger.error('Soft-deleted keybindings:', keybindings.filter(kb => kb.deleted_at).map(kb => ({
        id: kb._id,
        name: kb.name,
        deletedAt: kb.deleted_at
      })));
    }

    Logger.info(`Retrieved ${keybindings.length} keybindings for user ${user_id} (${softDeletedCount} soft-deleted)`);

    // Log all keybinding IDs and versions for debugging
    Logger.info('Keybinding IDs and versions being returned:', keybindings.map(kb => ({
      id: kb._id.toString(),
      name: kb.name,
      version: kb.version?.game_version,
      versionId: kb.version?._id?.toString(),
      deletedAt: kb.deleted_at
    })));

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
      .select('name class spec hero_talent version createdAt duplication_count keybinds')
      .limit(500) // Limit for home page performance
      .lean(); // Use lean() for better performance

    // Group keybindings by class
    const classGroups = keybindings.reduce((acc, keybinding) => {
      const className = keybinding.class; // Use the class name as-is (lowercase)
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
 * Get popular keybindings (public endpoint)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getPopularKeybindings = async (req, res, next) => {
  try {
    Logger.info('Getting Popular Keybindings');

    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get public keybindings sorted by popularity (duplication count)
    const keybindings = await Keybinding.find({ is_public: true })
      .populate('version', 'game_version')
      .select('name class spec hero_talent version createdAt duplication_count keybinds is_public created_by')
      .sort({ duplication_count: -1, createdAt: -1 }) // Sort by duplication count desc, then by creation date desc
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    Logger.info(`Retrieved ${keybindings.length} popular keybindings`);
    res.status(200).json(keybindings);
  } catch (error) {
    Logger.error('Error retrieving popular keybindings:', error);
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
    console.log('updateKeybinding - keybinds being updated:', req.body.keybinds?.length);
    console.log('updateKeybinding - keybinds details:', req.body.keybinds?.map(kb => ({
      key: kb.key,
      spellName: kb.spell?.name,
      spellId: kb.spell?.spell_id || kb.spell?.spellId
    })));

    const updatedKeybinding = await Keybinding.findOneAndUpdate(
      { _id: keybinding_id },
      req.body,
      { new: true }
    ).populate('version');

    console.log('updateKeybinding - updated keybinding keybinds:', updatedKeybinding.keybinds?.length);
    console.log('updateKeybinding - updated keybinding keybinds details:', updatedKeybinding.keybinds?.map(kb => ({
      key: kb.key,
      spellName: kb.spell?.name,
      spellId: kb.spell?.spell_id
    })));

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
      const latestVersion = await getLatestVersionBySemanticVersion();
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
            description: keybind.spell.description || null,
            icon: keybind.spell.icon || null,
            name: keybind.spell.name || null,
            spell_id: keybind.spell.spellId?.toString() || keybind.spell.spell_id || null
          }
        };

        // Validate required fields
        if (!processedKeybind.key) {
          console.error('Missing required key in keybind:', keybind);
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

    // Include the random class details in the response so frontend knows what class was selected
    const response = presentOne(populatedKeybinding);
    response.randomClassDetails = classDetails;

    return res.status(200).send(response);
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
    Logger.info(`Attempting to delete keybinding: ${keybinding_id}`);

    // Check if the ID is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(keybinding_id);
    if (!isValidObjectId) {
      Logger.error(`Invalid keybinding ID format: ${keybinding_id}`);
      return res.status(400).send({ message: 'Invalid keybinding ID format' });
    }

    // First check if the keybinding exists at all (including soft-deleted ones)
    const rawKeybinding = await Keybinding.collection.findOne({ _id: new mongoose.Types.ObjectId(keybinding_id) });
    Logger.info(`Raw database lookup result:`, {
      found: !!rawKeybinding,
      id: keybinding_id,
      deletedAt: rawKeybinding?.deleted_at,
      userId: rawKeybinding?.user_id?.toString()
    });

    if (!rawKeybinding) {
      Logger.error(`Keybinding not found in database: ${keybinding_id}`);
      return res.status(404).send({ message: 'Keybinding not found' });
    }

    // Check if already soft-deleted
    if (rawKeybinding.deleted_at) {
      Logger.info(`Keybinding ${keybinding_id} is already soft-deleted at ${rawKeybinding.deleted_at}`);
      return res.status(200).send({
        message: 'Keybinding is already deleted',
        keybindingId: keybinding_id,
        alreadyDeleted: true
      });
    }

    // Verify ownership
    if (rawKeybinding.user_id?.toString() !== req.decoded.user_id) {
      Logger.error(`Unauthorized deletion attempt:`, {
        keybindingUserId: rawKeybinding.user_id?.toString(),
        requestingUserId: req.decoded.user_id
      });
      return res.status(403).send({ message: 'Not authorized to delete this keybinding' });
    }

    // Get the keybinding data for response (using raw data since it's not soft-deleted)
    const keybindingData = {
      keybindingId: rawKeybinding._id.toString(),
      name: rawKeybinding.name,
      userId: rawKeybinding.user_id?.toString(),
      class: rawKeybinding.class,
      spec: rawKeybinding.spec,
      heroTalent: rawKeybinding.hero_talent,
      version: rawKeybinding.version,
      isPublic: rawKeybinding.is_public,
      createdAt: rawKeybinding.createdAt,
      keybinds: rawKeybinding.keybinds || []
    };

    // Soft delete by setting deleted_at timestamp
    const updateResult = await Keybinding.findByIdAndUpdate(keybinding_id, { deleted_at: new Date() });
    Logger.info(`Soft delete update result:`, {
      keybindingId: keybinding_id,
      updateResult: !!updateResult,
      deletedAt: new Date()
    });

    // Verify the keybinding is now soft-deleted by checking if it's excluded from normal queries
    const verifyKeybinding = await Keybinding.findOne({ _id: keybinding_id });
    Logger.info(`Verification after soft delete:`, {
      keybindingId: keybinding_id,
      found: !!verifyKeybinding,
      deletedAt: verifyKeybinding?.deleted_at,
      isProperlySoftDeleted: !verifyKeybinding // Should be null if properly soft-deleted
    });

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
    const keybinding = await Keybinding.findOne({ _id: keybinding_id, includeDeleted: true });
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
    const keybinding = await Keybinding.findOne({ _id: keybinding_id, includeDeleted: true }).populate('version');
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

    console.log('Original keybinding found:', {
      id: originalKeybinding._id,
      name: originalKeybinding.name,
      keybindsCount: originalKeybinding.keybinds?.length
    });

    // Convert mongoose document to plain object
    const originalData = originalKeybinding.toObject();

    console.log('Original data after toObject:', {
      id: originalData._id,
      name: originalData.name,
      keybindsCount: originalData.keybinds?.length,
      keybinds: originalData.keybinds?.map(kb => ({
        key: kb.key,
        spellName: kb.spell?.name,
        spellId: kb.spell?.spell_id
      }))
    });

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

    console.log('Original keybinding keybinds count:', originalData.keybinds?.length);
    console.log('Original keybinding keybinds:', originalData.keybinds?.map(kb => ({
      key: kb.key,
      spellName: kb.spell?.name,
      spellId: kb.spell?.spell_id
    })));

    // Create a deep copy of the keybinding
    const duplicatedKeybinding = {
      name: newName,
      class: originalData.class,
      spec: originalData.spec,
      hero_talent: originalData.hero_talent,
      version: originalData.version,
      is_public: false,
      user_id: req.decoded?.user_id || null,
      keybinds: originalData.keybinds?.map((keybind, index) => {
        console.log(`Processing keybind ${index + 1}/${originalData.keybinds.length}:`, JSON.stringify(keybind, null, 2));

        // Validate keybind has required fields
        if (!keybind.key) {
          console.error(`Keybind ${index + 1} missing key field:`, keybind);
          return null;
        }
        if (!keybind.spell) {
          console.error(`Keybind ${index + 1} missing spell field:`, keybind);
          return null;
        }
        if (!keybind.spell.name) {
          console.error(`Keybind ${index + 1} missing spell.name:`, keybind);
          return null;
        }

        // Log keybind processing
        console.log(`Processing keybind ${index + 1}: key="${keybind.key}", spell="${keybind.spell?.name}"`);

        // Create a complete copy of the keybind
        const newKeybind = {
          key: keybind.key,
          spell: {
            description: keybind.spell.description || '',
            icon: keybind.spell.icon || '',
            name: keybind.spell.name,
            spell_id: keybind.spell.spell_id || keybind.spell.spellId || ''
          }
        };

        console.log(`Created new keybind ${index + 1}:`, JSON.stringify(newKeybind, null, 2));
        return newKeybind;
      }).filter(keybind => keybind !== null) || []
    };

    console.log('Duplicated keybinding keybinds count:', duplicatedKeybinding.keybinds?.length);
    console.log('Duplicated keybinding keybinds:', duplicatedKeybinding.keybinds?.map(kb => ({
      key: kb.key,
      spellName: kb.spell?.name,
      spellId: kb.spell?.spell_id
    })));

    console.log('Creating duplicated keybinding:', {
      name: duplicatedKeybinding.name,
      keybindsCount: duplicatedKeybinding.keybinds?.length,
      keybinds: JSON.stringify(duplicatedKeybinding.keybinds, null, 2)
    });

    console.log('About to create keybinding with data:', JSON.stringify(duplicatedKeybinding, null, 2));

    let createdKeybinding;
    try {
      createdKeybinding = await Keybinding.create(duplicatedKeybinding);
      console.log('Successfully created keybinding:', createdKeybinding._id);
    } catch (createError) {
      console.error('Error during Keybinding.create():', createError);
      console.error('Create error details:', {
        name: createError.name,
        message: createError.message,
        errors: createError.errors
      });
      throw createError;
    }

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
      deleted_at: { $ne: null },
      includeDeleted: true
    })
      .populate('version', 'game_version')
      .select('name class spec hero_talent version createdAt deleted_at keybinds')
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

    // Get the latest version by semantic version number
    const latestVersion = await getLatestVersionBySemanticVersion();
    if (!latestVersion) {
      return res.status(400).send({ message: 'No versions available' });
    }

    Logger.info(`Latest version found:`, {
      id: latestVersion._id.toString(),
      game_version: latestVersion.game_version,
      createdAt: latestVersion.createdAt
    });

    // Check if already on latest version
    Logger.info(`Version comparison:`, {
      keybindingVersionId: keybinding.version?._id?.toString(),
      latestVersionId: latestVersion._id.toString(),
      keybindingVersion: keybinding.version?.game_version,
      latestVersion: latestVersion.game_version,
      areEqual: keybinding.version?._id?.toString() === latestVersion._id.toString()
    });

    if (keybinding.version?._id?.toString() === latestVersion._id.toString()) {
      Logger.info(`Keybinding ${keybinding_id} is already on latest version ${latestVersion.game_version}`);
      return res.status(200).send({
        message: 'Keybinding is already on the latest version',
        latestVersion: latestVersion.game_version,
        removedKeybindsCount: 0
      });
    }

    let removedKeybindsCount = 0;
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

      Logger.info(`Found ${validAbilities.length} valid abilities for ${keybinding.class} ${keybinding.spec} ${keybinding.hero_talent} in version ${latestVersion.game_version}`);
      Logger.info(`Class abilities: ${classAbilities.length}, Spec abilities: ${specAbilities.length}, Hero talent abilities: ${heroTalentAbilities.length}`);

      // Create a set of valid spell IDs for quick lookup
      const validSpellIds = new Set(validAbilities.map(ability => ability.spell_id));

      // Filter out keybinds for abilities that don't exist in the latest version
      Logger.info(`Original keybinds count: ${keybinding.keybinds.length}`);
      updatedKeybinds = keybinding.keybinds.filter(keybind => {
        const spellId = keybind.spell?.spell_id;
        const isValid = validSpellIds.has(spellId);

        if (!isValid) {
          Logger.info(`Removing keybind for spell ${spellId} (${keybind.spell?.name}) from keybinding ${keybinding_id} - not available in version ${latestVersion.game_version}`);
          removedKeybindsCount++;
        } else {
          Logger.info(`Keeping keybind for spell ${spellId} (${keybind.spell?.name})`);
        }

        return isValid;
      });
      Logger.info(`Filtered keybinds count: ${updatedKeybinds.length}`);

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

    Logger.info(`Updated keybinding data:`, {
      id: updatedKeybinding._id,
      name: updatedKeybinding.name,
      class: updatedKeybinding.class,
      spec: updatedKeybinding.spec,
      hero_talent: updatedKeybinding.hero_talent,
      version: updatedKeybinding.version?.game_version,
      keybindsCount: updatedKeybinds.length
    });

    Logger.info(`Successfully migrated keybinding ${keybinding_id} to version ${latestVersion.game_version}`);

    const presentedKeybinding = presentOne(updatedKeybinding);

    Logger.info(`Presented keybinding data:`, {
      keybindingId: presentedKeybinding.keybindingId,
      name: presentedKeybinding.name,
      class: presentedKeybinding.class,
      spec: presentedKeybinding.spec,
      heroTalent: presentedKeybinding.heroTalent,
      version: presentedKeybinding.version,
      keybindsCount: presentedKeybinding.keybinds?.length
    });

    return res.status(200).send({
      message: 'Keybinding migrated successfully',
      keybinding: presentedKeybinding,
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

    // Get the latest version by semantic version number
    const latestVersion = await getLatestVersionBySemanticVersion();
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
