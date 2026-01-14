import { body, query, param } from 'express-validator';

// Valid WoW classes
const VALID_CLASSES = [
    'deathknight',
    'demonhunter',
    'druid',
    'evoker',
    'hunter',
    'mage',
    'monk',
    'paladin',
    'priest',
    'rogue',
    'shaman',
    'warlock',
    'warrior'
];

/**
 * Validator for uploading macro file
 */
export const validateUploadMacroFile = [
    body('file_type')
        .notEmpty()
        .withMessage('file_type is required')
        .isIn(['account', 'character'])
        .withMessage('file_type must be either "account" or "character"'),

    body('character_class')
        .optional()
        .isIn(VALID_CLASSES)
        .withMessage('Invalid character class'),

    body('game_version')
        .optional()
        .isMongoId()
        .withMessage('game_version must be a valid MongoDB ID'),

    body('create_macros')
        .optional()
        .isBoolean()
        .withMessage('create_macros must be a boolean')
];

/**
 * Validator for generating macro file
 */
export const validateGenerateMacroFile = [
    body('macro_ids')
        .notEmpty()
        .withMessage('macro_ids is required')
        .isArray({ min: 1 })
        .withMessage('macro_ids must be a non-empty array'),

    body('macro_ids.*')
        .isMongoId()
        .withMessage('Each macro_id must be a valid MongoDB ID'),

    body('file_type')
        .notEmpty()
        .withMessage('file_type is required')
        .isIn(['account', 'character'])
        .withMessage('file_type must be either "account" or "character"'),

    body('character_class')
        .optional()
        .isIn(VALID_CLASSES)
        .withMessage('Invalid character class'),

    body('character_name')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 50 })
        .withMessage('character_name must be a string with max 50 characters'),

    body('save_to_history')
        .optional()
        .isBoolean()
        .withMessage('save_to_history must be a boolean')
];

/**
 * Validator for getting download history
 */
export const validateGetDownloadHistory = [
    query('file_type')
        .optional()
        .isIn(['account', 'character'])
        .withMessage('file_type must be either "account" or "character"'),

    query('character_class')
        .optional()
        .isIn(VALID_CLASSES)
        .withMessage('Invalid character class'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('limit must be between 1 and 100'),

    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('page must be at least 1')
];

/**
 * Validator for redownloading or deleting a download record
 */
export const validateDownloadRecordId = [
    param('id')
        .notEmpty()
        .withMessage('Download record ID is required')
        .isMongoId()
        .withMessage('Download record ID must be a valid MongoDB ID')
];

