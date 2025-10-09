import { body, param, query } from 'express-validator';

// Validation for creating a macro
export const validateCreateMacro = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters')
        .trim(),

    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters')
        .trim(),

    body('class')
        .optional()
        .isIn(['deathknight', 'demonhunter', 'druid', 'evoker', 'hunter', 'mage', 'monk', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior'])
        .withMessage('Invalid class')
        .custom((value, { req }) => {
            // If ability is specified, class is required
            if (req.body.ability && !value) {
                throw new Error('Class is required when specifying an ability');
            }
            return true;
        }),

    body('spec')
        .optional()
        .isString()
        .withMessage('Spec must be a string'),

    body('hero_talent')
        .optional()
        .isString()
        .withMessage('Hero talent must be a string'),

    body('game_version')
        .optional()
        .isMongoId()
        .withMessage('Invalid game version ID'),

    body('ability')
        .optional()
        .isMongoId()
        .withMessage('Invalid ability ID'),

    body('macro_text')
        .notEmpty()
        .withMessage('Macro text is required')
        .isLength({ max: 255 })
        .withMessage('Macro text cannot exceed 255 characters')
        .trim(),

    body('icon')
        .optional()
        .isMongoId()
        .withMessage('Icon must be a valid icon ID'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
        .custom((tags) => {
            if (tags && tags.length > 0) {
                for (const tag of tags) {
                    if (typeof tag !== 'string' || tag.length > 50) {
                        throw new Error('Each tag must be a string with maximum 50 characters');
                    }
                }
            }
            return true;
        }),

    body('is_public')
        .optional()
        .isBoolean()
        .withMessage('is_public must be a boolean')
];

// Validation for updating a macro
export const validateUpdateMacro = [
    param('id')
        .isMongoId()
        .withMessage('Invalid macro ID'),

    body('name')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters')
        .trim(),

    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters')
        .trim(),

    body('class')
        .optional()
        .isIn(['deathknight', 'demonhunter', 'druid', 'evoker', 'hunter', 'mage', 'monk', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior'])
        .withMessage('Invalid class')
        .custom((value, { req }) => {
            // If ability is specified, class is required
            if (req.body.ability && !value) {
                throw new Error('Class is required when specifying an ability');
            }
            return true;
        }),

    body('spec')
        .optional()
        .isString()
        .withMessage('Spec must be a string'),

    body('hero_talent')
        .optional()
        .isString()
        .withMessage('Hero talent must be a string'),

    body('game_version')
        .optional()
        .isMongoId()
        .withMessage('Invalid game version ID'),

    body('ability')
        .optional()
        .isMongoId()
        .withMessage('Invalid ability ID'),

    body('macro_text')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Macro text cannot exceed 255 characters')
        .trim(),

    body('icon')
        .optional()
        .isMongoId()
        .withMessage('Icon must be a valid icon ID'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
        .custom((tags) => {
            if (tags && tags.length > 0) {
                for (const tag of tags) {
                    if (typeof tag !== 'string' || tag.length > 50) {
                        throw new Error('Each tag must be a string with maximum 50 characters');
                    }
                }
            }
            return true;
        }),

    body('is_public')
        .optional()
        .isBoolean()
        .withMessage('is_public must be a boolean')
];

// Validation for getting a single macro
export const validateGetMacro = [
    param('id')
        .isMongoId()
        .withMessage('Invalid macro ID')
];

// Validation for deleting a macro
export const validateDeleteMacro = [
    param('id')
        .isMongoId()
        .withMessage('Invalid macro ID')
];

// Validation for duplicating a macro
export const validateDuplicateMacro = [
    param('id')
        .isMongoId()
        .withMessage('Invalid macro ID')
];

// Validation for getting macros with pagination
export const validateGetMacros = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('class')
        .optional()
        .custom((value) => {
            if (value === null || value === 'null' || value === '') {
                return true; // Allow null/empty values
            }
            const validClasses = ['deathknight', 'demonhunter', 'druid', 'evoker', 'hunter', 'mage', 'monk', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior'];
            if (!validClasses.includes(value)) {
                throw new Error('Invalid class');
            }
            return true;
        }),

    query('spec')
        .optional()
        .isString()
        .withMessage('Spec must be a string'),

    query('hero_talent')
        .optional()
        .isString()
        .withMessage('Hero talent must be a string'),

    query('game_version')
        .optional()
        .isMongoId()
        .withMessage('Invalid game version ID'),

    query('ability')
        .optional()
        .isMongoId()
        .withMessage('Invalid ability ID'),

    query('tags')
        .optional()
        .isString()
        .withMessage('Tags must be a comma-separated string'),

    query('is_public')
        .optional()
        .isBoolean()
        .withMessage('is_public must be a boolean'),

    query('created_by')
        .optional()
        .isMongoId()
        .withMessage('Invalid created_by ID'),

    query('search')
        .optional()
        .isString()
        .withMessage('Search must be a string'),

    query('sort_by')
        .optional()
        .isIn(['name', 'created_at', 'updated_at', 'usage_count', 'rating'])
        .withMessage('Invalid sort_by field'),

    query('sort_order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('sort_order must be asc or desc')
];

// Validation for getting user's own macros
export const validateGetMyMacros = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('class')
        .optional()
        .custom((value) => {
            if (value === null || value === 'null' || value === '') {
                return true; // Allow null/empty values
            }
            const validClasses = ['deathknight', 'demonhunter', 'druid', 'evoker', 'hunter', 'mage', 'monk', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior'];
            if (!validClasses.includes(value)) {
                throw new Error('Invalid class');
            }
            return true;
        }),

    query('spec')
        .optional()
        .isString()
        .withMessage('Spec must be a string'),

    query('hero_talent')
        .optional()
        .isString()
        .withMessage('Hero talent must be a string'),

    query('game_version')
        .optional()
        .isMongoId()
        .withMessage('Invalid game version ID'),

    query('ability')
        .optional()
        .isMongoId()
        .withMessage('Invalid ability ID'),

    query('tags')
        .optional()
        .isString()
        .withMessage('Tags must be a comma-separated string'),

    query('is_public')
        .optional()
        .isBoolean()
        .withMessage('is_public must be a boolean'),

    query('search')
        .optional()
        .isString()
        .withMessage('Search must be a string'),

    query('sort_by')
        .optional()
        .isIn(['name', 'created_at', 'updated_at', 'usage_count', 'rating'])
        .withMessage('Invalid sort_by field'),

    query('sort_order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('sort_order must be asc or desc')
];

// Validation for getting popular macros
export const validateGetPopularMacros = [
    query('game_version')
        .optional()
        .isString()
        .withMessage('Game version must be a string'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50')
];

// Validation for getting macros by tags
export const validateGetMacrosByTags = [
    query('tags')
        .notEmpty()
        .withMessage('Tags parameter is required')
        .isString()
        .withMessage('Tags must be a comma-separated string'),

    query('game_version')
        .optional()
        .isString()
        .withMessage('Game version must be a string'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50')
];

// Validation for getting macros by ability
export const validateGetMacrosByAbility = [
    query('ability_id')
        .notEmpty()
        .withMessage('ability_id parameter is required')
        .isMongoId()
        .withMessage('Invalid ability ID'),

    query('game_version')
        .optional()
        .isString()
        .withMessage('Game version must be a string'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50')
];
