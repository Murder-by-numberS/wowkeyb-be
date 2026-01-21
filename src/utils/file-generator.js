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

        // Log incoming macro data for debugging
        Logger.debug(`generateMacroFile called with ${macros?.length || 0} macros`);
        for (let i = 0; i < (macros?.length || 0); i++) {
            const m = macros[i];
            Logger.debug(`Incoming macro [${i}]:`, {
                _id: m._id?.toString(),
                name: m.name,
                nameType: typeof m.name,
                nameIsNull: m.name === null,
                nameIsUndefined: m.name === undefined,
                nameIsEmptyString: m.name === '',
                macro_text: m.macro_text?.substring(0, 50),
                macro_textType: typeof m.macro_text,
                macro_textLength: m.macro_text?.length || 0,
                class: m.class,
                ability: m.ability ? (typeof m.ability === 'object' ? m.ability?.name || m.ability?._id : m.ability) : null,
                icon: m.icon ? (typeof m.icon === 'object' ? m.icon?.fdid || m.icon?._id : m.icon) : null,
                is_active: m.is_active,
                deletedAt: m.deletedAt,
                // Check if it's a Mongoose document or plain object
                isMongooseDoc: typeof m.toObject === 'function',
                // Get all own property names
                ownKeys: Object.keys(m._doc || m).filter(k => !k.startsWith('$'))
            });
        }

        for (const macro of macros) {
            // Validate required fields
            // Use a fallback name if missing (e.g., "Unnamed Macro" or ID)
            let macroName = macro.name;
            
            // Log detailed info about the macro.name field
            Logger.debug(`Checking macro name for ${macro._id}:`, {
                rawName: macro.name,
                nameFromDoc: macro._doc?.name,
                nameType: typeof macro.name,
                macroNameVar: macroName,
                willUseFallback: !macroName || macroName.trim() === ''
            });
            
            if (!macroName || macroName.trim() === '') {
                // Try multiple fallback strategies
                const textPreview = (macro.macro_text || '').substring(0, 30).trim();
                const macroId = macro._id?.toString() || '';
                const lastSix = macroId.slice(-6);
                
                // Strategy 1: Use macro text if available (clean it up)
                if (textPreview) {
                    // Remove common macro commands for cleaner name
                    const cleaned = textPreview
                        .replace(/^#showtooltip\s*/i, '')
                        .replace(/^\/cast\s*/i, '')
                        .replace(/^\/use\s*/i, '')
                        .replace(/\[.*?\]/g, '') // Remove conditions
                        .trim();
                    if (cleaned && cleaned.length > 0) {
                        macroName = cleaned.substring(0, 30);
                    }
                }
                
                // Strategy 2: If we have an ability reference, try to get ability name
                if ((!macroName || macroName.trim() === '') && macro.ability) {
                    // If ability is populated, use its name
                    if (typeof macro.ability === 'object' && macro.ability.name) {
                        macroName = macro.ability.name;
                    } else if (typeof macro.ability === 'string') {
                        // Could fetch ability name if needed, but for now use fallback
                        macroName = `Ability_${macro.ability.substring(0, 8)}`;
                    }
                }
                
                // Strategy 3: Use class name if available
                if ((!macroName || macroName.trim() === '') && macro.class) {
                    const className = macro.class.charAt(0).toUpperCase() + macro.class.slice(1);
                    macroName = `${className} Macro`;
                }
                
                // Strategy 4: Final fallback - use ID
                if (!macroName || macroName.trim() === '') {
                    // Try to use the last 6 characters of the ID, or full ID, or at least something
                    if (macroId && macroId.length >= 6) {
                        macroName = `Macro_${lastSix}`;
                    } else if (macroId) {
                        macroName = `Macro_${macroId}`;
                    } else if (macro._id) {
                        // Last resort - use the full ObjectId as string
                        const idStr = macro._id.toString();
                        macroName = `Macro_${idStr.slice(-6)}`;
                    } else {
                        macroName = 'Unnamed Macro';
                    }
                }
                
                Logger.warn(`Macro ${macro._id} missing name, using fallback: "${macroName}"`, {
                    macroId: macro._id,
                    macroIdString: macroId,
                    lastSix: lastSix,
                    originalName: macro.name,
                    macroText: macro.macro_text?.substring(0, 50),
                    hasAbility: !!macro.ability,
                    abilityName: typeof macro.ability === 'object' ? macro.ability?.name : undefined,
                    abilityType: typeof macro.ability,
                    class: macro.class,
                    allFields: Object.keys(macro).filter(k => !k.startsWith('_') && k !== 'toJSON' && k !== 'toObject'),
                    macroObject: JSON.stringify({
                        id: macro._id?.toString(),
                        name: macro.name,
                        macro_text: macro.macro_text?.substring(0, 100),
                        class: macro.class,
                        ability: typeof macro.ability === 'object' ? { id: macro.ability._id, name: macro.ability.name } : macro.ability
                    })
                });
            }
            const macroText = macro.macro_text || '';
            
            Logger.info(`Processing macro for file generation:`, {
                id: macro._id,
                name: macroName,
                originalName: macro.name || '(none)',
                hasText: !!macroText,
                textLength: macroText?.length || 0
            });
            
            // Allow macros with empty text (they'll just show the header)
            // but log a warning
            if (!macroText || macroText.trim() === '') {
                Logger.warn(`Macro "${macroName}" has no text content`, { id: macro._id });
            }

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
                        Logger.warn(`Could not fetch icon for macro ${macroName}:`, error);
                    }
                }
            }

            // Generate the header line
            const headerLine = `VER 3 ${wowMacroId} "${macroName}" "${iconFdid}"`;
            lines.push(headerLine);

            // Add macro text (each line)
            // If macroText is empty, still add END (valid empty macro)
            if (macroText && macroText.trim() !== '') {
                const macroTextLines = macroText.split('\n');
                for (const line of macroTextLines) {
                    lines.push(line);
                }
            }

            // Add END marker (always add, even for empty macros)
            lines.push('END');
        }
        
        Logger.info(`Generated file content from ${macros.length} macros. Total lines: ${lines.length}`);
        
        // Add a final empty line (WoW macro files typically end with newline)
        // For blank files, ensure we have at least some content for proper file handling
        let fileContent = lines.join('\n');
        if (fileContent.trim() === '') {
            // Blank file - this should only happen if no macros were processed
            Logger.warn(`Generated blank file content - no macros were processed. Input macros: ${macros.length}`);
            if (macros.length > 0) {
                Logger.error('Macros were provided but none were processed:', macros.map(m => ({
                    id: m._id,
                    name: m.name,
                    hasText: !!m.macro_text
                })));
            }
            fileContent = '\n';
        } else {
            fileContent = fileContent + '\n';
        }

        Logger.info(`Generated macro file with ${macros?.length || 0} macros, content length: ${fileContent.length}`);
        return fileContent;
    } catch (error) {
        Logger.error('Error generating macro file:', error);
        Logger.error('Error stack:', error.stack);
        if (macros && Array.isArray(macros)) {
            Logger.error('Macros being processed:', macros.map(m => ({ id: m._id, name: m.name, hasText: !!m.macro_text })));
        } else {
            Logger.error('Macros being processed: (empty or invalid)');
        }
        throw new Error(`Failed to generate macro file: ${error.message}`);
    }
};

/**
 * Generate file name for macro export
 * Uses WoW's native format: macros-cache.txt
 *
 * @param {string} fileType - 'account' or 'character' (kept for API compatibility)
 * @param {string|null} characterClass - The character class (kept for API compatibility)
 * @param {string|null} characterName - Optional character name (kept for API compatibility)
 * @returns {string} The generated file name
 */
export const generateMacroFileName = (fileType, characterClass = null, characterName = null) => {
    return 'macros-cache.txt';
};

/**
 * WoW Macro File Limits
 * Based on Blizzard's interface restrictions:
 * - Account-wide: 120 macros maximum
 * - Character-specific: 30 macros maximum per character
 */
export const MACRO_FILE_LIMITS = {
    ACCOUNT_WIDE: 120,      // Maximum macros in account-wide macro file
    CHARACTER_SPECIFIC: 30  // Maximum character-specific macros in character macro file
};

/**
 * Validate macros before generating file
 * Ensures all macros have required fields and respects WoW limits
 *
 * @param {Array<Object>} macros - Array of macro objects
 * @param {string} fileType - 'account' or 'character'
 * @returns {Object} Validation result
 */
export const validateMacrosForGeneration = (macros, fileType = 'account') => {
    const errors = [];
    const warnings = [];

    // Allow empty macro arrays - blank files are valid
    if (!macros || macros.length === 0) {
        return { isValid: true, errors: [], warnings: [] };
    }

    // Validate macro count limits based on file type
    if (fileType === 'account') {
        if (macros.length > MACRO_FILE_LIMITS.ACCOUNT_WIDE) {
            errors.push(
                `Account-wide macro files cannot exceed ${MACRO_FILE_LIMITS.ACCOUNT_WIDE} macros. ` +
                `You have selected ${macros.length} macros.`
            );
        }
    } else if (fileType === 'character') {
        // Count class-specific macros (excluding account-wide/null class macros)
        const classSpecificMacros = macros.filter(m => m.class !== null && m.class !== undefined);
        
        if (classSpecificMacros.length > MACRO_FILE_LIMITS.CHARACTER_SPECIFIC) {
            errors.push(
                `Character-specific macro files cannot exceed ${MACRO_FILE_LIMITS.CHARACTER_SPECIFIC} class-specific macros. ` +
                `You have selected ${classSpecificMacros.length} class-specific macros. ` +
                `Account-wide macros are included in this count.`
            );
        }
        
        // Warn if total macros exceed a reasonable limit (even if class-specific count is OK)
        if (macros.length > MACRO_FILE_LIMITS.CHARACTER_SPECIFIC + 50) {
            warnings.push(
                `Large file detected: ${macros.length} total macros. ` +
                `WoW character macro slots are limited to ${MACRO_FILE_LIMITS.CHARACTER_SPECIFIC} class-specific macros.`
            );
        }
    }

    // Validate individual macro fields
    for (let i = 0; i < macros.length; i++) {
        const macro = macros[i];

        if (!macro.name || macro.name.trim() === '') {
            errors.push(`Macro at index ${i} is missing a name`);
        }

        if (!macro.macro_text || (typeof macro.macro_text === 'string' && macro.macro_text.trim() === '')) {
            errors.push(`Macro "${macro.name || `at index ${i}`}" is missing macro text`);
        }

        // Validate macro text length (WoW limit is 255 characters)
        if (macro.macro_text && typeof macro.macro_text === 'string' && macro.macro_text.length > 255) {
            errors.push(`Macro "${macro.name}" exceeds 255 character limit (${macro.macro_text.length} characters)`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
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

    Logger.debug(`prepareMacrosForGeneration called with ${macros?.length || 0} macros`);

    for (const macro of macros) {
        // Log before spreading - check if Mongoose document
        const isMongooseDoc = typeof macro.toObject === 'function';
        Logger.debug(`Preparing macro for generation:`, {
            _id: macro._id?.toString(),
            name: macro.name,
            nameFromDoc: macro._doc?.name,
            nameType: typeof macro.name,
            isMongooseDoc,
            macro_text: macro.macro_text?.substring(0, 50),
            macro_textFromDoc: macro._doc?.macro_text?.substring(0, 50)
        });
        
        // If it's a Mongoose document, use toObject() to get all fields properly
        const macroData = isMongooseDoc ? macro.toObject() : macro;
        const preparedMacro = { ...macroData };
        
        Logger.debug(`After spreading macro data:`, {
            _id: preparedMacro._id?.toString(),
            name: preparedMacro.name,
            nameType: typeof preparedMacro.name,
            macro_text: preparedMacro.macro_text?.substring(0, 50)
        });

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

        Logger.debug(`Final prepared macro:`, {
            _id: preparedMacro._id?.toString(),
            name: preparedMacro.name,
            macro_text: preparedMacro.macro_text?.substring(0, 50),
            hasIcon: !!preparedMacro.icon
        });

        preparedMacros.push(preparedMacro);
    }

    Logger.debug(`prepareMacrosForGeneration returning ${preparedMacros.length} macros`);
    return preparedMacros;
};

