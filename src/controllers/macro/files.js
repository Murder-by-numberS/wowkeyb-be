import { validationResult } from "express-validator";
import mongoose from 'mongoose';
import Logger from '../../utils/logger.js';
import { Macro, Version, User, File } from '../../models/index.js';
import {
  parseMacroFile,
  validateMacrosForClass,
  resolveIconFromFdid
} from '../../utils/file-parser.js';
import {
  generateMacroFile as generateMacroFileContent,
  generateMacroFileName,
  validateMacrosForGeneration,
  filterMacrosByClass,
  prepareMacrosForGeneration
} from '../../utils/file-generator.js';
import {
  uploadMacroFileToS3,
  uploadUserMacroFile,
  getPresignedDownloadUrl,
  getMacroFileFromS3
} from '../../utils/s3-macro-helper.js';

/**
 * Helper function to get the latest version by semantic version number
 * @returns {Promise<Object>} The latest version document
 */
async function getLatestVersionBySemanticVersion() {
  const allVersions = await Version.find({});
  if (allVersions.length === 0) {
    return null;
  }

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
 * Upload a WoW macro file and parse it to create macros
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const uploadMacroFile = async (req, res) => {
  try {
    Logger.info('Uploading macro file');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      Logger.error('Validation errors in uploadMacroFile:', errors.array());
      return res.status(422).json({ errors: errors.array() });
    }

    const { decoded } = req;

    // Validate user is authenticated
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify user exists
    const user = await User.findById(decoded.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const {
      file_type,
      character_class,
      game_version,
      create_macros = true
    } = req.body;

    // Validate file type
    if (!file_type || !['account', 'character'].includes(file_type)) {
      return res.status(400).json({ message: 'Invalid file_type. Must be "account" or "character"' });
    }

    // If character-specific, class is required
    if (file_type === 'character' && !character_class) {
      return res.status(400).json({ message: 'character_class is required for character-specific macro files' });
    }

    // Parse the file content
    const fileContent = req.file.buffer.toString('utf-8');
    const parsedMacros = parseMacroFile(fileContent);

    if (parsedMacros.length === 0) {
      return res.status(400).json({ message: 'No macros found in file' });
    }

    // Validate macros for class if character-specific
    let classValidation = { errors: [], warnings: [], isValid: true };
    if (file_type === 'character' && character_class) {
      classValidation = validateMacrosForClass(parsedMacros, character_class);

      if (!classValidation.isValid) {
        return res.status(400).json({
          message: 'Macro file contains macros for wrong class',
          errors: classValidation.errors,
          warnings: classValidation.warnings
        });
      }
    }

    // Upload original file to S3
    const s3Upload = await uploadUserMacroFile(
      req.file.buffer,
      req.file.originalname,
      decoded.user_id
    );

    // Get game version
    let version;
    if (game_version) {
      version = await Version.findById(game_version);
      if (!version) {
        return res.status(400).json({ message: 'Invalid game version' });
      }
    } else {
      version = await getLatestVersionBySemanticVersion();
      if (!version) {
        return res.status(500).json({ message: 'No game versions available' });
      }
    }

    // Record the upload in File collection first (so we can reference it in macros)
    const file = new File({
      user_id: decoded.user_id,
      source: 'upload',
      download_type: 'macro_file',
      file_name: req.file.originalname,
      file_type,
      s3_path: s3Upload.s3_path,
      cloudfront_url: s3Upload.cloudfront_url,
      macro_ids: [],
      item_count: parsedMacros.length,
      character_class: file_type === 'character' ? character_class : null
    });

    await file.save();

    // Create macros if requested
    const createdMacros = [];
    if (create_macros === true || create_macros === 'true') {
      for (const parsedMacro of parsedMacros) {
        try {
          // Resolve icon from FDID
          const icon = await resolveIconFromFdid(parsedMacro.icon_fdid);

          // Create macro in database with file reference
          const macro = new Macro({
            name: parsedMacro.name,
            description: `Imported from ${req.file.originalname}`,
            class: file_type === 'character' ? character_class : null,
            spec: null,
            game_version: version._id,
            show_tooltip: parsedMacro.show_tooltip,
            macro_text: parsedMacro.macro_text,
            icon: icon ? icon._id : null,
            tags: ['imported'],
            is_public: false,
            user_id: decoded.user_id,
            file_id: file._id
          });

          await macro.save();
          createdMacros.push(macro);
        } catch (error) {
          Logger.error(`Error creating macro "${parsedMacro.name}":`, error);
          // Continue with other macros
        }
      }

      // Update file record with created macro IDs
      file.macro_ids = createdMacros.map(m => m._id);
      await file.save();
    }

    Logger.info(`Macro file uploaded successfully: ${parsedMacros.length} macros, ${createdMacros.length} created`);

    return res.status(201).json({
      message: 'Macro file uploaded successfully',
      upload: {
        id: file._id,
        file_name: req.file.originalname,
        file_type,
        character_class,
        s3_path: s3Upload.s3_path,
        cloudfront_url: s3Upload.cloudfront_url,
        macros_parsed: parsedMacros.length,
        macros_created: createdMacros.length,
        uploaded_at: file.downloaded_at
      },
      validation: classValidation,
      created_macros: createdMacros.map(m => ({
        id: m._id,
        name: m.name,
        class: m.class,
        macro_text: m.macro_text
      }))
    });

  } catch (error) {
    Logger.error('Error uploading macro file:', error);
    return res.status(500).json({ message: 'Error uploading macro file', error: error.message });
  }
};

/**
 * Create or update a macro file (save macros without generating S3 file)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const saveMacroFile = async (req, res) => {
  try {
    Logger.info('Saving macro file');
    const { decoded } = req;

    // Validate user is authenticated
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const {
      file_id,
      macro_ids = [],
      file_type = 'account',
      character_class = null,
      character_name = null,
      file_name = null
    } = req.body;

    // Validate inputs
    if (!macro_ids || !Array.isArray(macro_ids)) {
      return res.status(400).json({ message: 'macro_ids must be an array' });
    }

    if (!['account', 'character'].includes(file_type)) {
      return res.status(400).json({ message: 'Invalid file_type. Must be "account" or "character"' });
    }

    if (file_type === 'character' && !character_class) {
      return res.status(400).json({ message: 'character_class is required for character-specific macro files' });
    }

    let fileRecord = null;

    if (file_id) {
      // Update existing file
      fileRecord = await File.findOne({
        _id: file_id,
        user_id: decoded.user_id
      });

      if (!fileRecord) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Verify macros belong to user or are public
      if (macro_ids.length > 0) {
        const macros = await Macro.find({
          _id: { $in: macro_ids },
          $or: [
            { user_id: decoded.user_id },
            { is_public: true }
          ]
        });

        if (macros.length < macro_ids.length) {
          return res.status(400).json({ message: 'Some macros not found or not accessible' });
        }
      }

      // Update file
      // Check if file type or class changed before updating (for file name regeneration)
      const originalFileType = fileRecord.file_type;
      const originalCharacterClass = fileRecord.character_class;
      const newCharacterClass = file_type === 'character' ? character_class : null;
      const typeChanged = originalFileType !== file_type;
      const classChanged = originalCharacterClass !== newCharacterClass;

      fileRecord.macro_ids = macro_ids;
      fileRecord.item_count = macro_ids.length;
      fileRecord.file_type = file_type;
      fileRecord.character_class = newCharacterClass;
      fileRecord.character_name = character_name || fileRecord.character_name;

      // Regenerate file name if file_type or character_class changed, unless explicitly provided
      if (file_name) {
        fileRecord.file_name = file_name;
      } else if (typeChanged || classChanged) {
        fileRecord.file_name = generateMacroFileName(file_type, character_class, fileRecord.character_name);
      }

      await fileRecord.save();
    } else {
      // Create new file
      const fileName = file_name || generateMacroFileName(file_type, character_class, character_name);

      // Verify macros belong to user or are public
      if (macro_ids.length > 0) {
        const macros = await Macro.find({
          _id: { $in: macro_ids },
          $or: [
            { user_id: decoded.user_id },
            { is_public: true }
          ]
        });

        if (macros.length < macro_ids.length) {
          return res.status(400).json({ message: 'Some macros not found or not accessible' });
        }
      }

      fileRecord = new File({
        user_id: decoded.user_id,
        source: 'generated',
        download_type: 'macro_file',
        file_name: fileName,
        file_type,
        s3_path: '', // No S3 file yet
        cloudfront_url: null,
        macro_ids: macro_ids,
        item_count: macro_ids.length,
        character_class: file_type === 'character' ? character_class : null,
        character_name,
        download_count: 0
      });

      await fileRecord.save();
    }

    // Populate macro details for response
    // Need to manually populate to bypass Mongoose filters (include inactive/deleted macros)
    const file = await File.findById(fileRecord._id);
    let populatedMacros = [];
    if (file && file.macro_ids && file.macro_ids.length > 0) {
      const macroIds = file.macro_ids.map((m) => m._id || m);
      populatedMacros = await Macro.find({
        _id: { $in: macroIds },
        includeInactive: true,
        includeDeleted: true
      }).lean().select('_id name class spec macro_text icon ability');
      file.macro_ids = populatedMacros;
    }
    const populatedFile = file;

    Logger.info(`Saved macro file: ${fileRecord.file_name} with ${macro_ids.length} macros`);

    return res.status(200).json({
      message: 'Macro file saved successfully',
      file: {
        id: populatedFile._id,
        file_name: populatedFile.file_name,
        file_type: populatedFile.file_type,
        character_class: populatedFile.character_class,
        character_name: populatedFile.character_name,
        macro_count: populatedFile.item_count,
        macros: populatedMacros.length > 0 ? populatedMacros.map((m) => ({
          id: m._id,
          name: m.name || '(no name)',
          class: m.class || null,
          macro_text: m.macro_text || null
        })) : [],
        created_at: populatedFile.createdAt,
        updated_at: populatedFile.updatedAt
      }
    });

  } catch (error) {
    Logger.error('Error saving macro file:', error);
    return res.status(500).json({ message: 'Error saving macro file', error: error.message });
  }
};

/**
 * Create a macro file
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createMacroFile = async (req, res) => {
  try {
    Logger.info('Creating macro file');
    const { decoded } = req;

    // Validate user is authenticated
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const {
      file_type = 'account',
      character_class = null,
      character_name = null,
      file_name = null
    } = req.body;

    // Validate file type
    if (!['account', 'character'].includes(file_type)) {
      return res.status(400).json({ message: 'Invalid file_type. Must be "account" or "character"' });
    }

    if (file_type === 'character' && !character_class) {
      return res.status(400).json({ message: 'character_class is required for character-specific macro files' });
    }

    // Generate file name if not provided
    const fileName = file_name || generateMacroFileName(file_type, character_class, character_name);

    // Create file record (no S3 upload yet, no macros)
    const newFile = new File({
      user_id: decoded.user_id,
      source: 'generated',
      download_type: 'macro_file',
      file_name: fileName,
      file_type,
      s3_path: '', // Will be set when file is generated/downloaded
      cloudfront_url: null,
      macro_ids: [],
      item_count: 0,
      character_class: file_type === 'character' ? character_class : null,
      character_name,
      download_count: 0
    });

    await newFile.save();

    Logger.info(`Created macro file: ${fileName}`);

    return res.status(201).json({
      message: 'Macro file created successfully',
      file: {
        id: newFile._id,
        file_name: newFile.file_name,
        file_type: newFile.file_type,
        character_class: newFile.character_class,
        character_name: newFile.character_name,
        macro_count: 0,
        macros: [],
        created_at: newFile.createdAt,
        updated_at: newFile.updatedAt
      }
    });

  } catch (error) {
    Logger.error('Error creating macro file:', error);
    return res.status(500).json({ message: 'Error creating macro file', error: error.message });
  }
};

/**
 * Generate and download a macro file from selected macros
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const generateMacroFile = async (req, res) => {
  try {
    Logger.info('Generating macro file');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      Logger.error('Validation errors in generateMacroFile:', errors.array());
      return res.status(422).json({ errors: errors.array() });
    }

    const { decoded } = req;

    // Validate user is authenticated
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const {
      macro_ids,
      file_type,
      character_class,
      character_name,
      file_id = null // Optional: ID of existing file to update
    } = req.body;

    // Validate inputs
    // Allow empty macro_ids array for blank files
    if (!macro_ids || !Array.isArray(macro_ids)) {
      return res.status(400).json({ message: 'macro_ids must be an array' });
    }

    if (!file_type || !['account', 'character'].includes(file_type)) {
      return res.status(400).json({ message: 'Invalid file_type. Must be "account" or "character"' });
    }

    if (file_type === 'character' && !character_class) {
      return res.status(400).json({ message: 'character_class is required for character-specific macro files' });
    }

    // Fetch macros from database - allow user's own macros OR public macros
    // If macro_ids is empty, create a blank file (no macros)
    let macros = [];
    if (macro_ids.length > 0) {
      macros = await Macro.find({
        _id: { $in: macro_ids },
        $or: [
          { user_id: decoded.user_id },
          { is_public: true }
        ]
      }).populate('icon', 'fdid name cloudfrontUrl')
        .populate('ability', 'name');

      // Warn if some macros were not found (might be due to permissions or non-existent IDs)
      if (macros.length < macro_ids.length) {
        const foundIds = macros.map(m => m._id.toString());
        const missingIds = macro_ids.filter(id => !foundIds.includes(id.toString()));
        Logger.warn(`Some macros were not found or are not accessible: ${missingIds.join(', ')}`);
      }

      // If no macros were found but IDs were provided, return error
      if (macros.length === 0) {
        return res.status(404).json({ message: 'No macros found with provided IDs' });
      }
    }

    // Filter by class if character-specific
    const filteredMacros = filterMacrosByClass(macros, file_type === 'character' ? character_class : null);

    // Allow empty filteredMacros for blank files (no error)
    // Only error if macros were requested but none matched the class filter
    if (macro_ids.length > 0 && filteredMacros.length === 0) {
      return res.status(400).json({
        message: `No macros found for class ${character_class}. Character-specific files can only contain macros for that class or generic macros.`
      });
    }

    // Validate macros for generation (including WoW file limits)
    const validation = validateMacrosForGeneration(filteredMacros, file_type);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Macros validation failed',
        errors: validation.errors,
        warnings: validation.warnings || []
      });
    }

    // Log warnings if any
    if (validation.warnings && validation.warnings.length > 0) {
      Logger.warn('Macro file generation warnings:', validation.warnings);
    }

    // Prepare macros (ensure icons are populated)
    const preparedMacros = await prepareMacrosForGeneration(filteredMacros);

    // Generate file content
    const fileContent = await generateMacroFileContent(preparedMacros);

    // Generate file name
    const fileName = generateMacroFileName(file_type, character_class, character_name);

    // Upload to S3
    const s3Upload = await uploadMacroFileToS3(fileName, fileContent, decoded.user_id);

    // Check if we're updating an existing file or creating a new one
    let fileRecord = null;
    if (file_id) {
      // Update existing file
      fileRecord = await File.findOne({
        _id: file_id,
        user_id: decoded.user_id
      });

      if (!fileRecord) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Update the file with generated content
      fileRecord.file_name = fileName;
      fileRecord.s3_path = s3Upload.s3_path;
      fileRecord.cloudfront_url = s3Upload.cloudfront_url;
      fileRecord.macro_ids = filteredMacros.map(m => m._id);
      fileRecord.item_count = filteredMacros.length;
      fileRecord.character_class = file_type === 'character' ? character_class : null;
      fileRecord.character_name = character_name;
      fileRecord.download_count = (fileRecord.download_count || 0) + 1;
      if (!fileRecord.downloaded_at) {
        fileRecord.downloaded_at = new Date();
      }
      fileRecord.last_downloaded_at = new Date();

      await fileRecord.save();
    } else {
      // Create new file record
      fileRecord = new File({
        user_id: decoded.user_id,
        source: 'generated',
        download_type: 'macro_file',
        file_name: fileName,
        file_type,
        s3_path: s3Upload.s3_path,
        cloudfront_url: s3Upload.cloudfront_url,
        macro_ids: filteredMacros.map(m => m._id),
        item_count: filteredMacros.length,
        character_class: file_type === 'character' ? character_class : null,
        character_name,
        download_count: 1,
        downloaded_at: new Date(),
        last_downloaded_at: new Date()
      });

      await fileRecord.save();
    }

    // Use CloudFront URL if available, otherwise generate S3 presigned URL
    const downloadUrl = s3Upload.cloudfront_url || await getPresignedDownloadUrl(s3Upload.s3_path, 3600);

    Logger.info(`Generated macro file: ${fileName} with ${filteredMacros.length} macros`);

    return res.status(200).json({
      message: 'Macro file generated successfully',
      file: {
        id: fileRecord?._id,
        file_name: fileName,
        file_type,
        character_class,
        download_url: downloadUrl,
        s3_path: s3Upload.s3_path,
        cloudfront_url: s3Upload.cloudfront_url,
        macro_count: filteredMacros.length,
        macros: filteredMacros.map(m => ({
          id: m._id,
          name: m.name,
          class: m.class
        }))
      }
    });

  } catch (error) {
    Logger.error('Error generating macro file:', error);
    return res.status(500).json({ message: 'Error generating macro file', error: error.message });
  }
};

/**
 * Get user's download history
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getDownloadHistory = async (req, res) => {
  try {
    Logger.info('Getting download history');
    const { decoded } = req;

    // Validate user is authenticated
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const {
      file_type,
      character_class,
      limit = 50,
      page = 1
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    const query = {
      user_id: decoded.user_id,
      download_type: 'macro_file'
    };
    if (file_type) query.file_type = file_type;
    if (character_class) query.character_class = character_class;

    // Get total count
    const totalCount = await File.countDocuments(query);

    // Get files
    // Use includeInactive and includeDeleted flags to bypass Mongoose filters for macros
    // Files can reference inactive/deleted macros, so we need to see them
    const files = await File.find(query)
      .sort({ downloaded_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Manually populate macro_ids to bypass the default filters
    // The Mongoose middleware filters out inactive/deleted macros, but files can reference them
    for (const file of files) {
      // Get the original macro_ids array (they might be ObjectIds, not populated yet)
      const originalMacroIds = file.macro_ids || [];
      const macroIds = originalMacroIds.map((m) => m._id || m);

      Logger.info(`File ${file.file_name} (${file._id}):`, {
        item_count: file.item_count,
        originalMacroIdsLength: originalMacroIds.length,
        macroIds,
        macroIdsLength: macroIds.length,
        hasMacroIds: !!file.macro_ids,
        macroIdsType: Array.isArray(file.macro_ids) ? 'array' : typeof file.macro_ids
      });

      if (macroIds && macroIds.length > 0) {
        // Use lean() to get plain objects, then query with bypass flags
        const macros = await Macro.find({
          _id: { $in: macroIds },
          includeInactive: true,
          includeDeleted: true
        }).lean().select('_id name class spec macro_text icon ability');

        Logger.info(`File ${file.file_name}: Found ${macros.length} macros out of ${macroIds.length} requested`, {
          foundMacros: macros.map(m => ({ id: m._id, name: m.name || '(no name)' }))
        });

        // Store both the IDs and the populated macro objects
        file.originalMacroIds = macroIds; // Keep original IDs
        file.macro_ids = macros; // Store populated macros
      } else {
        file.originalMacroIds = [];
        file.macro_ids = [];
      }
    }

    // Transform for response
    const transformedDownloads = files.map(file => {
      // Use originalMacroIds for macro_ids array, and populated macros for macros array
      const macroIds = file.originalMacroIds || (file.macro_ids ? file.macro_ids.map(m => m._id || m) : []);
      const populatedMacros = file.macro_ids || [];

      Logger.info(`Transforming file ${file.file_name}:`, {
        macroIds,
        macroIdsLength: macroIds.length,
        populatedMacrosLength: populatedMacros.length,
        item_count: file.item_count
      });

      return {
        id: file._id,
        file_name: file.file_name,
        file_type: file.file_type,
        character_class: file.character_class,
        character_name: file.character_name,
        s3_path: file.s3_path,
        cloudfront_url: file.cloudfront_url,
        macro_count: file.item_count,
        download_count: file.download_count,
        downloaded_at: file.downloaded_at,
        last_downloaded_at: file.last_downloaded_at,
        created_at: file.createdAt,
        updated_at: file.updatedAt,
        source: file.source,
        item_count: file.item_count,
        macro_ids: macroIds,
        macros: populatedMacros.length > 0 ? populatedMacros.map(m => ({
          id: m._id || m,
          name: m.name || '(no name)',
          class: m.class || null,
          macro_text: m.macro_text || null
        })) : []
      };
    });

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    Logger.info(`Retrieved ${transformedDownloads.length} downloads`);

    return res.status(200).json({
      downloads: transformedDownloads,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    Logger.error('Error getting download history:', error);
    return res.status(500).json({ message: 'Error retrieving download history' });
  }
};

/**
 * Re-download a previously generated macro file
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const redownloadMacroFile = async (req, res) => {
  try {
    Logger.info('Re-downloading macro file');
    const { id } = req.params;
    const { decoded } = req;

    // Validate user is authenticated
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the file record (don't populate, we'll fetch macros manually)
    let fileRecord = await File.findOne({
      _id: id,
      user_id: decoded.user_id,
      download_type: 'macro_file'
    });

    if (!fileRecord) {
      return res.status(404).json({ message: 'Download record not found' });
    }

    // Always generate from database macros and upload to S3 (even if S3 exists)
    // This ensures the download always reflects the current database state
    Logger.info(`Generating file from database macros for download: ${fileRecord.file_name}`);

    // Fetch macros from database
    const macroIds = fileRecord.macro_ids && fileRecord.macro_ids.length > 0
      ? fileRecord.macro_ids.map((m) => m._id || m)
      : [];

    if (macroIds.length === 0) {
      return res.status(400).json({
        message: 'File has no macros yet. Please add macros to the file first.'
      });
    }

    // Use raw MongoDB collection to bypass Mongoose middleware filters
    const macroCollection = Macro.collection;
    const objectIds = macroIds.map(id => {
      if (typeof id === 'string') {
        return new mongoose.Types.ObjectId(id);
      }
      return id;
    });

    const rawMacros = await macroCollection.find({
      _id: { $in: objectIds }
    }).toArray();

    Logger.info(`Raw MongoDB query found ${rawMacros.length} macros for download`);

    // Convert raw MongoDB documents to Mongoose documents and populate references
    const macros = [];
    for (const rawMacro of rawMacros) {
      const macro = new Macro(rawMacro);
      macro.isNew = false;

      // Manually populate references
      if (rawMacro.icon) {
        try {
          const Icon = mongoose.model('Icon');
          const iconDoc = await Icon.findById(rawMacro.icon);
          if (iconDoc) {
            macro.icon = iconDoc;
          }
        } catch (e) {
          Logger.warn(`Failed to populate icon for macro ${rawMacro._id}:`, e.message);
        }
      }
      if (rawMacro.ability) {
        try {
          const Ability = mongoose.model('Ability');
          const abilityDoc = await Ability.findById(rawMacro.ability);
          if (abilityDoc) {
            macro.ability = abilityDoc;
          }
        } catch (e) {
          Logger.warn(`Failed to populate ability for macro ${rawMacro._id}:`, e.message);
        }
      }
      macros.push(macro);
    }

    if (macros.length === 0) {
      return res.status(400).json({
        message: 'No macros found for this file.'
      });
    }

    // Prepare and generate file content from database macros
    const preparedMacros = await prepareMacrosForGeneration(macros);
    const fileContent = await generateMacroFileContent(preparedMacros);

    // Upload to S3 (create new file or overwrite existing)
    const s3Upload = await uploadMacroFileToS3(fileRecord.file_name, fileContent, decoded.user_id);

    // Update file record with S3 info
    fileRecord.s3_path = s3Upload.s3_path;
    fileRecord.cloudfront_url = s3Upload.cloudfront_url || null;

    // Increment download count and set dates
    fileRecord.download_count = (fileRecord.download_count || 0) + 1;
    if (!fileRecord.downloaded_at) {
      fileRecord.downloaded_at = new Date();
    }
    fileRecord.last_downloaded_at = new Date();
    await fileRecord.save();

    // Always use presigned URL for downloads (more secure and reliable)
    // CloudFront URLs may have access restrictions
    if (!fileRecord.s3_path || fileRecord.s3_path === '') {
      Logger.error(`Cannot generate download URL: file ${fileRecord.file_name} has no S3 path`);
      return res.status(500).json({ message: 'File has no S3 path. Please try again.' });
    }

    const downloadUrl = await getPresignedDownloadUrl(fileRecord.s3_path, 3600);
    Logger.info(`Generated presigned URL for download: ${fileRecord.file_name}, s3_path: ${fileRecord.s3_path}`);

    Logger.info(`Re-download URL generated for: ${fileRecord.file_name}`);

    return res.status(200).json({
      message: 'Download URL generated successfully',
      file: {
        id: fileRecord._id,
        file_name: 'macros-cache.txt',
        file_type: fileRecord.file_type,
        character_class: fileRecord.character_class,
        character_name: fileRecord.character_name,
        download_url: downloadUrl,
        cloudfront_url: fileRecord.cloudfront_url,
        macro_count: fileRecord.item_count,
        download_count: fileRecord.download_count
      }
    });

  } catch (error) {
    Logger.error('Error re-downloading macro file:', error);
    return res.status(500).json({ message: 'Error generating download URL' });
  }
};

/**
 * View file content (returns file content directly)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const viewMacroFile = async (req, res) => {
  try {
    Logger.info('Viewing macro file (generating on-demand from database, not using S3)');
    const { id } = req.params;
    const { decoded } = req;

    // Validate user is authenticated
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the file record (don't populate macro_ids here, we'll fetch them manually)
    const fileRecord = await File.findOne({
      _id: id,
      user_id: decoded.user_id,
      download_type: 'macro_file'
    });

    if (!fileRecord) {
      return res.status(404).json({ message: 'File record not found' });
    }

    // Always generate content on-demand from database macros (never use S3 for viewing)
    // Get macro IDs
    const macroIds = fileRecord.macro_ids && fileRecord.macro_ids.length > 0
      ? fileRecord.macro_ids.map((m) => m._id || m)
      : [];

    Logger.info(`Viewing file: ${fileRecord.file_name}, macro_ids:`, macroIds);

    if (!macroIds || macroIds.length === 0) {
      Logger.warn(`File ${fileRecord.file_name} has no macro_ids. Raw macro_ids:`, fileRecord.macro_ids);
      return res.status(400).json({
        message: 'File has no macros yet. Please add macros to the file first.'
      });
    }

    Logger.info(`Generating file content on-demand for viewing: ${fileRecord.file_name}, looking for ${macroIds.length} macros`);

    // Fetch macros from database (fetch all fields, including inactive/deleted ones)
    // Files can reference inactive/deleted macros, so we need to bypass the default filters
    // Use the MongoDB collection directly to bypass Mongoose middleware filters
    const macroCollection = Macro.collection;
    const objectIds = macroIds.map(id => {
      if (typeof id === 'string') {
        return new mongoose.Types.ObjectId(id);
      }
      return id;
    });

    const rawMacros = await macroCollection.find({
      _id: { $in: objectIds }
    }).toArray();

    Logger.info(`Raw MongoDB query found ${rawMacros.length} macros for IDs:`, macroIds);

    if (rawMacros.length === 0) {
      Logger.error(`No macros found in MongoDB collection for IDs:`, macroIds);
    } else {
      Logger.info(`Raw macros found:`, rawMacros.map(m => ({
        _id: m._id?.toString(),
        name: m.name,
        is_active: m.is_active,
        deletedAt: m.deletedAt
      })));
    }

    // Convert raw MongoDB documents to Mongoose documents and populate references
    const macros = [];
    for (const rawMacro of rawMacros) {
      // Log the raw MongoDB document for debugging
      Logger.debug(`Raw macro from MongoDB (viewMacroFile):`, {
        _id: rawMacro._id?.toString(),
        name: rawMacro.name,
        nameType: typeof rawMacro.name,
        nameIsNull: rawMacro.name === null,
        nameIsUndefined: rawMacro.name === undefined,
        macro_text: rawMacro.macro_text?.substring(0, 50),
        macro_textType: typeof rawMacro.macro_text,
        class: rawMacro.class,
        is_active: rawMacro.is_active,
        deletedAt: rawMacro.deletedAt,
        allFields: Object.keys(rawMacro)
      });

      // Create Mongoose document from raw data
      const macro = new Macro(rawMacro);
      macro.isNew = false; // Mark as existing document

      // Log after Mongoose document creation
      Logger.debug(`After Mongoose conversion (viewMacroFile):`, {
        _id: macro._id?.toString(),
        name: macro.name,
        nameFromDoc: macro._doc?.name,
        macro_text: macro.macro_text?.substring(0, 50),
        macro_textFromDoc: macro._doc?.macro_text?.substring(0, 50)
      });

      // Manually populate references using the model directly
      if (rawMacro.icon) {
        try {
          const Icon = mongoose.model('Icon');
          const iconDoc = await Icon.findById(rawMacro.icon);
          if (iconDoc) {
            macro.icon = iconDoc;
          }
        } catch (e) {
          Logger.warn(`Failed to populate icon for macro ${rawMacro._id}:`, e.message);
        }
      }
      if (rawMacro.ability) {
        try {
          const Ability = mongoose.model('Ability');
          const abilityDoc = await Ability.findById(rawMacro.ability);
          if (abilityDoc) {
            macro.ability = abilityDoc;
          }
        } catch (e) {
          Logger.warn(`Failed to populate ability for macro ${rawMacro._id}:`, e.message);
        }
      }
      macros.push(macro);
    }

    Logger.info(`Found ${macros.length} macros for file ${fileRecord.file_name}. Expected ${macroIds.length}.`, {
      macroIds,
      foundMacros: macros.map(m => ({
        id: m._id,
        name: m.name || '(NULL/MISSING)',
        hasName: !!m.name,
        nameValue: m.name,
        hasText: !!m.macro_text,
        macro_text: m.macro_text || '(NULL/MISSING)',
        allFields: Object.keys(m).filter(k => !k.startsWith('_') && k !== 'toJSON' && k !== 'toObject')
      }))
    });

    if (macros.length === 0) {
      Logger.error(`No macros found for file ${fileRecord.file_name}. Searched for macro IDs:`, macroIds);
      return res.status(400).json({
        message: 'No macros found for this file.'
      });
    }

    // Prepare macros (ensure icons are populated)
    const preparedMacros = await prepareMacrosForGeneration(macros);

    // Generate file content
    const fileContent = await generateMacroFileContent(preparedMacros);

    Logger.info(`Generated file content for viewing: ${fileRecord.file_name}`, {
      contentLength: fileContent?.length || 0,
      contentPreview: fileContent?.substring(0, 100) || '(no content)',
      isBlank: !fileContent || fileContent.trim().length === 0
    });

    // Return content directly to frontend (don't upload to S3 - that only happens on download)
    return res.status(200).json({
      message: 'File content retrieved successfully',
      file: {
        id: fileRecord._id,
        file_name: fileRecord.file_name,
        content: fileContent
      }
    });

  } catch (error) {
    Logger.error('Error viewing macro file:', error);
    return res.status(500).json({ message: 'Error retrieving file content' });
  }
};

/**
 * Delete a download record from history
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteDownloadRecord = async (req, res) => {
  try {
    Logger.info('Deleting download record');
    const { id } = req.params;
    const { decoded } = req;

    // Validate user is authenticated
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find and delete the file record
    const fileRecord = await File.findOneAndDelete({
      _id: id,
      user_id: decoded.user_id,
      download_type: 'macro_file'
    });

    if (!fileRecord) {
      return res.status(404).json({ message: 'Download record not found' });
    }

    Logger.info(`Deleted download record: ${fileRecord.file_name}`);

    return res.status(200).json({
      message: 'Download record deleted successfully'
    });

  } catch (error) {
    Logger.error('Error deleting download record:', error);
    return res.status(500).json({ message: 'Error deleting download record' });
  }
};

