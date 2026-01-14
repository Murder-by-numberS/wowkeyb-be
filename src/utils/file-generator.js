import Logger from './logger.js';
import { Icon } from '../models/index.js';
import { generateWowMacroId } from './file-parser.js';

/**
 * Generate a WoW macro cache file from an array of macros
 * Format: VER 3 [hex_id] "[name]" "[icon_fdid]"
 *
 * @param {Array<Object>} macros - Array of macro objects from database
 * @param {Object} options - Generation options
 * @returns {Promise<string>} The generated macro file content
 */
export const generateMacroFile = async (macros, options = {}) => {
    try {
        const lines = [];

        for (const macro of macros) {
            // Get the WoW macro ID (generate if not exists)
            const wowMacroId = macro.wow_macro_id || generateWowMacroId();

            // Get icon FDID
            let iconFdid = '0';
            if (macro.icon) {
                // If icon is populated object
                if (typeof macro.icon === 'object' && macro.icon.fdid) {
                    iconFdid = macro.icon.fdid.toString();
                }
                // If icon is just an ID, fetch it
                else if (typeof macro.icon === 'string') {
                    try {
                        const iconDoc = await Icon.findById(macro.icon);
                        if (iconDoc && iconDoc.fdid) {
                            iconFdid = iconDoc.fdid.toString();
                        }
                    } catch (error) {
                        Logger.warn(`Could not fetch icon for macro ${macro.name}:`, error);
                    }
                }
            }

            // Generate the header line
            const headerLine = `VER 3 ${wowMacroId} "${macro.name}" "${iconFdid}"`;
            lines.push(headerLine);

            // Add macro text (each line)
            const macroTextLines = macro.macro_text.split('\n');
            for (const line of macroTextLines) {
                lines.push(line);
            }

            // Add END marker
            lines.push('END');
        }

        // Add a final empty line (WoW macro files typically end with newline)
        const fileContent = lines.join('\n') + '\n';

        Logger.info(`Generated macro file with ${macros.length} macros`);
        return fileContent;
    } catch (error) {
        Logger.error('Error generating macro file:', error);
        throw new Error('Failed to generate macro file');
    }
};

/**
 * Generate file name for macro export
 *
 * @param {string} fileType - 'account' or 'character'
 * @param {string|null} characterClass - The character class (for character-specific)
 * @param {string|null} characterName - Optional character name
 * @returns {string} The generated file name
 */
export const generateMacroFileName = (fileType, characterClass = null, characterName = null) => {
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');

    if (fileType === 'account') {
        return `macros-cache-account-${timestamp}.txt`;
    } else {
        const classPrefix = characterClass ? characterClass : 'character';
        const namePrefix = characterName ? `${characterName}-` : '';
        return `macros-cache-${namePrefix}${classPrefix}-${timestamp}.txt`;
    }
};

/**
 * Validate macros before generating file
 * Ensures all macros have required fields
 *
 * @param {Array<Object>} macros - Array of macro objects
 * @returns {Object} Validation result
 */
export const validateMacrosForGeneration = (macros) => {
    const errors = [];

    if (!macros || macros.length === 0) {
        errors.push('No macros provided for file generation');
        return { isValid: false, errors };
    }

    for (let i = 0; i < macros.length; i++) {
        const macro = macros[i];

        if (!macro.name || macro.name.trim() === '') {
            errors.push(`Macro at index ${i} is missing a name`);
        }

        if (!macro.macro_text || macro.macro_text.trim() === '') {
            errors.push(`Macro "${macro.name || `at index ${i}`}" is missing macro text`);
        }

        // Validate macro text length (WoW limit is 255 characters)
        if (macro.macro_text && macro.macro_text.length > 255) {
            errors.push(`Macro "${macro.name}" exceeds 255 character limit (${macro.macro_text.length} characters)`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Filter macros by class for character-specific export
 *
 * @param {Array<Object>} macros - Array of all macros
 * @param {string} characterClass - The character class to filter by
 * @returns {Array<Object>} Filtered macros
 */
export const filterMacrosByClass = (macros, characterClass) => {
    if (!characterClass) {
        // Return all macros if no class specified (account-wide)
        return macros;
    }

    return macros.filter(macro => {
        // Include macros that match the class or are class-agnostic (null class)
        return macro.class === characterClass || macro.class === null || macro.class === undefined;
    });
};

/**
 * Prepare macros for file generation by populating icon data
 *
 * @param {Array<Object>} macros - Array of macro objects
 * @returns {Promise<Array<Object>>} Macros with populated icon data
 */
export const prepareMacrosForGeneration = async (macros) => {
    const preparedMacros = [];

    for (const macro of macros) {
        const preparedMacro = { ...macro };

        // Ensure icon is populated
        if (macro.icon && typeof macro.icon === 'string') {
            try {
                const iconDoc = await Icon.findById(macro.icon);
                if (iconDoc) {
                    preparedMacro.icon = iconDoc;
                }
            } catch (error) {
                Logger.warn(`Could not populate icon for macro ${macro.name}:`, error);
            }
        }

        preparedMacros.push(preparedMacro);
    }

    return preparedMacros;
};

