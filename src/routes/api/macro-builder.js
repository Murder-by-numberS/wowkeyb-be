import express from 'express';
import {
    getTemplates,
    generateMacro,
    getConditionalSuggestions,
    detectType
} from '../../controllers/macro/macro-builder.js';
import { body } from 'express-validator';

const router = express.Router();

// Get all available macro templates
router.get('/templates', getTemplates);

// Get conditional suggestions based on ability type
router.get('/suggestions', getConditionalSuggestions);

// Detect ability type from name/description
router.get('/detect-type', detectType);

// Generate a macro based on user preferences
router.post('/generate', [
    body('spell_name')
        .optional()
        .isString()
        .withMessage('Spell name must be a string'),
    body('spellName')
        .optional()
        .isString()
        .withMessage('Spell name must be a string'),
    body('template_type')
        .optional()
        .isString()
        .withMessage('Template type must be a string'),
    body('templateType')
        .optional()
        .isString()
        .withMessage('Template type must be a string'),
    body('ability_id')
        .optional()
        .isMongoId()
        .withMessage('Invalid ability ID'),
    body('abilityId')
        .optional()
        .isMongoId()
        .withMessage('Invalid ability ID'),
    body('ability_type')
        .optional()
        .isString()
        .withMessage('Ability type must be a string'),
    body('abilityType')
        .optional()
        .isString()
        .withMessage('Ability type must be a string'),
    body('wow_class')
        .optional()
        .isString()
        .withMessage('Class must be a string'),
    body('wowClass')
        .optional()
        .isString()
        .withMessage('Class must be a string'),
    body('custom_options')
        .optional()
        .isObject()
        .withMessage('Custom options must be an object'),
    body('customOptions')
        .optional()
        .isObject()
        .withMessage('Custom options must be an object')
], generateMacro);

export default router;

