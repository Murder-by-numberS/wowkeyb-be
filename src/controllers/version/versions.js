import Version from '../../models/version.js';
import Logger from '../../utils/logger.js';

/**
 * Helper function to get the latest version by semantic version number
 * @returns {Promise<Object>} The latest version document
 */
async function getLatestVersionBySemanticVersion() {
  const allVersions = await Version.find({});
  if (allVersions.length === 0) {
    return null;
  }

  // Sort versions by semantic version number (highest first)
  return allVersions.sort((a, b) => {
    const aParts = a.game_version.split('.').map(Number);
    const bParts = b.game_version.split('.').map(Number);

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      if (aPart > bPart) return -1;
      if (aPart < bPart) return 1;
    }
    return 0;
  })[0];
}

/**
 * Get all versions
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getVersions = async (req, res, next) => {
  try {
    Logger.info('Getting all versions');

    const versions = await Version.find().sort({ createdAt: -1 });

    res.status(200).send(versions);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single version by ID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getVersion = async (req, res, next) => {
  try {
    const { version_id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(version_id);
    if (!isValidObjectId) {
      return res.status(400).send({ message: 'Invalid version ID format' });
    }

    const version = await Version.findById(version_id);

    if (!version) {
      return res.status(404).send({ message: 'Version not found' });
    }

    return res.status(200).send(version);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new version
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const createVersion = async (req, res, next) => {
  try {
    Logger.info('Creating new version');

    const { game_version } = req.body;

    if (!game_version) {
      return res.status(400).send({ message: 'game_version is required' });
    }

    // Check if version already exists
    const existingVersion = await Version.findOne({ game_version });
    if (existingVersion) {
      return res.status(409).send({ message: 'Version already exists' });
    }

    const newVersion = await Version.create({ game_version });

    return res.status(201).send(newVersion);
  } catch (error) {
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
 * Update an existing version
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const updateVersion = async (req, res, next) => {
  try {
    const { version_id } = req.params;
    const { game_version } = req.body;

    // Check if the ID is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(version_id);
    if (!isValidObjectId) {
      return res.status(400).send({ message: 'Invalid version ID format' });
    }

    const version = await Version.findById(version_id);

    if (!version) {
      return res.status(404).send({ message: 'Version not found' });
    }

    if (!game_version) {
      return res.status(400).send({ message: 'game_version is required' });
    }

    // Check if the new version name already exists (excluding current version)
    const existingVersion = await Version.findOne({
      game_version,
      _id: { $ne: version_id }
    });
    if (existingVersion) {
      return res.status(409).send({ message: 'Version name already exists' });
    }

    const updatedVersion = await Version.findByIdAndUpdate(
      version_id,
      { game_version },
      { new: true }
    );

    return res.status(200).send(updatedVersion);
  } catch (error) {
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
 * Delete a version
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const deleteVersion = async (req, res, next) => {
  try {
    const { version_id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(version_id);
    if (!isValidObjectId) {
      return res.status(400).send({ message: 'Invalid version ID format' });
    }

    const version = await Version.findById(version_id);
    if (!version) {
      return res.status(404).send({ message: 'Version not found' });
    }

    await Version.findByIdAndDelete(version_id);

    return res.status(200).send({
      message: 'Version deleted',
      versionId: version_id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the latest version
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const getLatestVersion = async (req, res, next) => {
  try {
    Logger.info('Getting latest version');

    const latestVersion = await getLatestVersionBySemanticVersion();

    if (!latestVersion) {
      return res.status(404).send({ message: 'No versions found' });
    }

    return res.status(200).send(latestVersion);
  } catch (error) {
    next(error);
  }
};
