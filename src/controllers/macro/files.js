import { validationResult } from "express-validator";
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
      save_to_history = true
    } = req.body;

    // Validate inputs
    if (!macro_ids || !Array.isArray(macro_ids) || macro_ids.length === 0) {
      return res.status(400).json({ message: 'macro_ids array is required' });
    }

    if (!file_type || !['account', 'character'].includes(file_type)) {
      return res.status(400).json({ message: 'Invalid file_type. Must be "account" or "character"' });
    }

    if (file_type === 'character' && !character_class) {
      return res.status(400).json({ message: 'character_class is required for character-specific macro files' });
    }

    // Fetch macros from database
    const macros = await Macro.find({
      _id: { $in: macro_ids },
      user_id: decoded.user_id
    }).populate('icon', 'fdid name cloudfrontUrl');

    if (macros.length === 0) {
      return res.status(404).json({ message: 'No macros found with provided IDs' });
    }

    // Filter by class if character-specific
    const filteredMacros = filterMacrosByClass(macros, file_type === 'character' ? character_class : null);

    if (filteredMacros.length === 0) {
      return res.status(400).json({
        message: `No macros found for class ${character_class}. Character-specific files can only contain macros for that class or generic macros.`
      });
    }

    // Validate macros for generation
    const validation = validateMacrosForGeneration(filteredMacros);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Macros validation failed',
        errors: validation.errors
      });
    }

    // Prepare macros (ensure icons are populated)
    const preparedMacros = await prepareMacrosForGeneration(filteredMacros);

    // Generate file content
    const fileContent = await generateMacroFileContent(preparedMacros);

    // Generate file name
    const fileName = generateMacroFileName(file_type, character_class, character_name);

    // Upload to S3
    const s3Upload = await uploadMacroFileToS3(fileName, fileContent, decoded.user_id);

    // Save to download history if requested
    let fileRecord = null;
    if (save_to_history === true || save_to_history === 'true') {
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
        character_name
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
    const files = await File.find(query)
      .sort({ downloaded_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('macro_ids', 'name class spec');

    // Transform for response
    const transformedDownloads = files.map(file => ({
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
      source: file.source,
      item_count: file.item_count,
      macro_ids: file.macro_ids ? file.macro_ids.map(m => m._id || m) : [],
      macros: file.macro_ids ? file.macro_ids.map(m => ({
        id: m._id || m,
        name: m.name,
        class: m.class
      })) : []
    }));

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

    // Find the file record
    const fileRecord = await File.findOne({
      _id: id,
      user_id: decoded.user_id,
      download_type: 'macro_file'
    });

    if (!fileRecord) {
      return res.status(404).json({ message: 'Download record not found' });
    }

    // Increment download count
    await fileRecord.incrementDownloadCount();

    // Use CloudFront URL if available, otherwise generate S3 presigned URL
    const downloadUrl = fileRecord.cloudfront_url || await getPresignedDownloadUrl(fileRecord.s3_path, 3600);

    Logger.info(`Re-download URL generated for: ${fileRecord.file_name}`);

    return res.status(200).json({
      message: 'Download URL generated successfully',
      file: {
        id: fileRecord._id,
        file_name: fileRecord.file_name,
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
    Logger.info('Viewing macro file');
    const { id } = req.params;
    const { decoded } = req;

    // Validate user is authenticated
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the file record
    const fileRecord = await File.findOne({
      _id: id,
      user_id: decoded.user_id,
      download_type: 'macro_file'
    });

    if (!fileRecord) {
      return res.status(404).json({ message: 'File record not found' });
    }

    // Get file content from S3
    const fileContent = await getMacroFileFromS3(fileRecord.s3_path);

    Logger.info(`File content retrieved for: ${fileRecord.file_name}`);

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

