/**
 * Macro Builder Controller
 * Endpoints for intelligent macro generation and suggestions
 */

import Logger from '../../utils/logger.js';
import {
    getAvailableTemplates,
    buildMacro,
    detectAbilityType,
    suggestConditionals,
    ABILITY_TYPES
} from '../../utils/macro-builder.js';
import { Ability } from '../../models/index.js';

/**
 * Get all available macro templates
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getTemplates = async (req, res) => {
    try {
        const templates = getAvailableTemplates();

        return res.status(200).json({
            message: 'Macro templates retrieved successfully',
            templates
        });
    } catch (error) {
        Logger.error('Error getting macro templates:', error);
        return res.status(500).json({ message: 'Error retrieving macro templates' });
    }
};

/**
 * Generate a macro based on user preferences
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const generateMacro = async (req, res) => {
    try {
        const {
            spell_name,
            spellName, // Support both snake_case and camelCase
            template_type,
            templateType,
            ability_id,
            abilityId,
            ability_type,
            abilityType,
            wow_class,
            wowClass,
            custom_options,
            customOptions
        } = req.body;

        // Normalize parameter names
        const finalSpellName = spell_name || spellName;
        const finalTemplateType = template_type || templateType;
        const finalAbilityId = ability_id || abilityId;
        const finalAbilityType = ability_type || abilityType;
        const finalWowClass = wow_class || wowClass;
        const finalCustomOptions = custom_options || customOptions || {};

        if (!finalSpellName) {
            return res.status(400).json({ message: 'Spell name is required' });
        }

        if (!finalTemplateType) {
            return res.status(400).json({ message: 'Template type is required' });
        }

        let detectedAbilityType = finalAbilityType;
        let abilityData = null;

        // If ability ID provided, fetch ability data for better suggestions
        if (finalAbilityId) {
            try {
                abilityData = await Ability.findById(finalAbilityId);
                if (abilityData) {
                    // Use ability name and description to detect type
                    detectedAbilityType = detectedAbilityType || detectAbilityType(
                        abilityData.name,
                        abilityData.description || ''
                    );
                }
            } catch (err) {
                Logger.warn('Could not fetch ability data:', err);
            }
        }

        // Build the macro
        const result = buildMacro({
            spellName: finalSpellName,
            templateType: finalTemplateType,
            abilityType: detectedAbilityType,
            wowClass: finalWowClass,
            customOptions: finalCustomOptions
        });

        Logger.info('Generated macro:', {
            spellName: finalSpellName,
            templateType: finalTemplateType,
            abilityType: result.abilityType,
            tags: result.tags
        });

        return res.status(200).json({
            message: 'Macro generated successfully',
            macro_text: result.macro,
            suggested_tags: result.tags,
            explanation: result.explanation,
            ability_type: result.abilityType,
            suggestions: result.suggestions,
            ability: abilityData ? {
                id: abilityData._id,
                name: abilityData.name,
                icon: abilityData.icon
            } : null
        });

    } catch (error) {
        Logger.error('Error generating macro:', error);
        return res.status(500).json({
            message: 'Error generating macro',
            error: error.message
        });
    }
};

/**
 * Get conditional suggestions based on ability type
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getConditionalSuggestions = async (req, res) => {
    try {
        const {
            ability_type,
            abilityType,
            ability_id,
            abilityId,
            wow_class,
            wowClass
        } = req.query;

        const finalAbilityType = ability_type || abilityType;
        const finalAbilityId = ability_id || abilityId;
        const finalWowClass = wow_class || wowClass;

        let detectedType = finalAbilityType;

        // If ability ID provided, detect type from ability data
        if (finalAbilityId && !detectedType) {
            try {
                const ability = await Ability.findById(finalAbilityId);
                if (ability) {
                    detectedType = detectAbilityType(ability.name, ability.description || '');
                }
            } catch (err) {
                Logger.warn('Could not fetch ability for type detection:', err);
            }
        }

        if (!detectedType) {
            detectedType = ABILITY_TYPES.UTILITY; // Default
        }

        const suggestions = suggestConditionals(detectedType, finalWowClass);

        return res.status(200).json({
            message: 'Conditional suggestions retrieved successfully',
            ability_type: detectedType,
            suggestions
        });

    } catch (error) {
        Logger.error('Error getting conditional suggestions:', error);
        return res.status(500).json({ message: 'Error retrieving suggestions' });
    }
};

/**
 * Detect ability type from name/description
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const detectType = async (req, res) => {
    try {
        const {
            spell_name,
            spellName,
            description,
            ability_id,
            abilityId
        } = req.query;

        const finalSpellName = spell_name || spellName;
        const finalAbilityId = ability_id || abilityId;

        let name = finalSpellName || '';
        let desc = description || '';

        // If ability ID provided, fetch ability data
        if (finalAbilityId) {
            try {
                const ability = await Ability.findById(finalAbilityId);
                if (ability) {
                    name = ability.name;
                    desc = ability.description || '';
                }
            } catch (err) {
                Logger.warn('Could not fetch ability for type detection:', err);
            }
        }

        const detectedType = detectAbilityType(name, desc);
        const suggestions = suggestConditionals(detectedType);

        return res.status(200).json({
            message: 'Ability type detected successfully',
            spell_name: name,
            ability_type: detectedType,
            suggestions
        });

    } catch (error) {
        Logger.error('Error detecting ability type:', error);
        return res.status(500).json({ message: 'Error detecting ability type' });
    }
};

export default {
    getTemplates,
    generateMacro,
    getConditionalSuggestions,
    detectType
};

