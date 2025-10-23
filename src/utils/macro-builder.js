/**
 * WoW Macro Builder System
 * Provides intelligent macro generation, templates, and conditional suggestions
 * based on spell type, class, and intended use case
 */

/**
 * Macro template types
 */
export const MACRO_TEMPLATES = {
    MOUSEOVER: 'mouseover',
    FOCUS: 'focus',
    SELF_CAST: 'self_cast',
    ARENA_123: 'arena_123',
    DEFENSIVE: 'defensive',
    OFFENSIVE: 'offensive',
    PET_ASSIST: 'pet_assist',
    CASTSEQUENCE: 'castsequence',
    MODIFIED_KEYS: 'modified_keys',
    STOP_CAST: 'stop_cast'
};

/**
 * Spell/Ability types for smart conditional generation
 */
export const ABILITY_TYPES = {
    HEAL: 'heal',
    DAMAGE: 'damage',
    BUFF: 'buff',
    DEBUFF: 'debuff',
    DISPEL: 'dispel',
    UTILITY: 'utility',
    DEFENSIVE_COOLDOWN: 'defensive_cooldown',
    OFFENSIVE_COOLDOWN: 'offensive_cooldown',
    CC: 'crowd_control',
    MOVEMENT: 'movement'
};

/**
 * Common WoW macro conditionals
 */
export const CONDITIONALS = {
    // Target conditionals
    MOUSEOVER: 'mouseover',
    TARGET: 'target',
    FOCUS: 'focus',
    PLAYER: 'player',
    PET: 'pet',
    PARTY1: 'party1',
    PARTY2: 'party2',
    ARENA1: 'arena1',
    ARENA2: 'arena2',
    ARENA3: 'arena3',

    // State conditionals
    HELP: 'help',           // Friendly target
    HARM: 'harm',           // Enemy target
    DEAD: 'dead',
    NODEAD: 'nodead',
    EXISTS: 'exists',
    NOEXISTS: 'noexists',

    // Combat conditionals
    COMBAT: 'combat',
    NOCOMBAT: 'nocombat',

    // Modifier keys
    MOD_SHIFT: 'mod:shift',
    MOD_CTRL: 'mod:ctrl',
    MOD_ALT: 'mod:alt',
    NOMOD: 'nomod',

    // Stance/Form
    STANCE: 'stance',
    FORM: 'form',
    STEALTH: 'stealth',
    NOSTEALTH: 'nostealth'
};

/**
 * Generate a mouseover macro with smart conditionals
 * @param {string} spellName - Name of the spell
 * @param {string} abilityType - Type of ability (heal, damage, etc.)
 * @param {object} options - Additional options
 * @returns {string} Generated macro text
 */
export function generateMouseoverMacro(spellName, abilityType = ABILITY_TYPES.DAMAGE, options = {}) {
    const {
        includeTooltip = true,
        fallbackToTarget = true,
        fallbackToPlayer = false
    } = options;

    let macro = '';

    // Add tooltip
    if (includeTooltip) {
        macro += `#showtooltip ${spellName}\n`;
    }

    // Generate conditional based on ability type
    if (abilityType === ABILITY_TYPES.HEAL) {
        // Healing spell - target friendly units
        macro += `/cast [@mouseover,help,nodead][] ${spellName}`;
        if (fallbackToPlayer) {
            // If no mouseover or target, cast on self
            macro = `/cast [@mouseover,help,nodead][@player] ${spellName}`;
        }
    } else if (abilityType === ABILITY_TYPES.DAMAGE || abilityType === ABILITY_TYPES.DEBUFF) {
        // Damage/Debuff - target enemies
        macro += `/cast [@mouseover,harm,nodead][] ${spellName}`;
    } else if (abilityType === ABILITY_TYPES.BUFF) {
        // Buff - target friendly units or self
        if (fallbackToPlayer) {
            macro += `/cast [@mouseover,help][@player] ${spellName}`;
        } else {
            macro += `/cast [@mouseover,help][] ${spellName}`;
        }
    } else if (abilityType === ABILITY_TYPES.DISPEL) {
        // Dispel - target friendly units
        macro += `/cast [@mouseover,help,nodead][] ${spellName}`;
    } else {
        // Default - just mouseover with fallback to target
        macro += `/cast [@mouseover,nodead][] ${spellName}`;
    }

    return macro;
}

/**
 * Generate a focus macro
 * @param {string} spellName - Name of the spell
 * @param {object} options - Additional options
 * @returns {string} Generated macro text
 */
export function generateFocusMacro(spellName, options = {}) {
    const {
        includeTooltip = true,
        fallbackToTarget = true,
        modifierKey = null // 'shift', 'ctrl', 'alt'
    } = options;

    let macro = '';

    if (includeTooltip) {
        macro += `#showtooltip ${spellName}\n`;
    }

    if (modifierKey) {
        // Use modifier to cast on focus, normal cast on target
        macro += `/cast [mod:${modifierKey},@focus,exists,nodead][] ${spellName}`;
    } else {
        // Always cast on focus if exists, fallback to target
        if (fallbackToTarget) {
            macro += `/cast [@focus,exists,nodead][] ${spellName}`;
        } else {
            macro += `/cast [@focus,exists,nodead] ${spellName}`;
        }
    }

    return macro;
}

/**
 * Generate an arena targeting macro
 * @param {string} spellName - Name of the spell
 * @param {object} options - Additional options
 * @returns {string} Generated macro text
 */
export function generateArenaMacro(spellName, options = {}) {
    const { includeTooltip = true } = options;

    let macro = '';

    if (includeTooltip) {
        macro += `#showtooltip ${spellName}\n`;
    }

    // Shift for arena1, Ctrl for arena2, Alt for arena3, no mod for target
    macro += `/cast [mod:shift,@arena1,exists,nodead][mod:ctrl,@arena2,exists,nodead][mod:alt,@arena3,exists,nodead][] ${spellName}`;

    return macro;
}

/**
 * Generate a self-cast macro
 * @param {string} spellName - Name of the spell
 * @param {object} options - Additional options
 * @returns {string} Generated macro text
 */
export function generateSelfCastMacro(spellName, options = {}) {
    const {
        includeTooltip = true,
        modifierKey = null // 'shift', 'ctrl', 'alt' - if specified, only self-cast with modifier
    } = options;

    let macro = '';

    if (includeTooltip) {
        macro += `#showtooltip ${spellName}\n`;
    }

    if (modifierKey) {
        // Self-cast with modifier, normal cast otherwise
        macro += `/cast [mod:${modifierKey},@player][] ${spellName}`;
    } else {
        // Always self-cast
        macro += `/cast [@player] ${spellName}`;
    }

    return macro;
}

/**
 * Generate a castsequence macro
 * @param {string[]} spells - Array of spell names in sequence
 * @param {object} options - Additional options
 * @returns {string} Generated macro text
 */
export function generateCastSequenceMacro(spells, options = {}) {
    const {
        includeTooltip = true,
        resetCondition = 'target', // 'target', 'combat', 'alt', '15' (seconds), etc.
        includeAutoAttack = false
    } = options;

    let macro = '';

    if (includeTooltip) {
        macro += `#showtooltip\n`;
    }

    const sequenceText = spells.join(', ');
    macro += `/castsequence reset=${resetCondition} ${sequenceText}`;

    if (includeAutoAttack) {
        macro += '\n/startattack';
    }

    return macro;
}

/**
 * Generate a modified key macro (different spells for different modifiers)
 * @param {object} spellMap - Object mapping modifiers to spells
 * @param {object} options - Additional options
 * @returns {string} Generated macro text
 */
export function generateModifiedKeyMacro(spellMap, options = {}) {
    const { includeTooltip = true } = options;
    // spellMap example: { shift: 'Fireball', ctrl: 'Frostbolt', alt: 'Arcane Blast', none: 'Fire Blast' }

    let macro = '';

    if (includeTooltip) {
        macro += `#showtooltip\n`;
    }

    const conditions = [];

    if (spellMap.shift) {
        conditions.push(`[mod:shift] ${spellMap.shift}`);
    }
    if (spellMap.ctrl) {
        conditions.push(`[mod:ctrl] ${spellMap.ctrl}`);
    }
    if (spellMap.alt) {
        conditions.push(`[mod:alt] ${spellMap.alt}`);
    }
    if (spellMap.none) {
        conditions.push(`${spellMap.none}`);
    }

    macro += `/cast ${conditions.join('; ')}`;

    return macro;
}

/**
 * Generate a stop casting macro (for instant casts)
 * @param {string} spellName - Name of the spell
 * @param {object} options - Additional options
 * @returns {string} Generated macro text
 */
export function generateStopCastMacro(spellName, options = {}) {
    const {
        includeTooltip = true,
        includeAutoAttack = false
    } = options;

    let macro = '';

    if (includeTooltip) {
        macro += `#showtooltip ${spellName}\n`;
    }

    macro += `/stopcasting\n`;
    macro += `/cast ${spellName}`;

    if (includeAutoAttack) {
        macro += '\n/startattack';
    }

    return macro;
}

/**
 * Generate a pet assist macro
 * @param {string} spellName - Name of the spell (optional)
 * @param {object} options - Additional options
 * @returns {string} Generated macro text
 */
export function generatePetAssistMacro(spellName = null, options = {}) {
    const { includeTooltip = true } = options;

    let macro = '';

    if (includeTooltip && spellName) {
        macro += `#showtooltip ${spellName}\n`;
    }

    macro += `/petattack\n`;

    if (spellName) {
        macro += `/cast ${spellName}`;
    }

    macro += '\n/startattack';

    return macro;
}

/**
 * Generate smart conditionals based on ability type and class
 * @param {string} abilityType - Type of ability
 * @param {string} wowClass - WoW class (optional)
 * @returns {object} Suggested conditionals and explanation
 */
export function suggestConditionals(abilityType, wowClass = null) {
    const suggestions = {
        conditionals: [],
        explanation: '',
        examples: []
    };

    switch (abilityType) {
        case ABILITY_TYPES.HEAL:
            suggestions.conditionals = ['mouseover,help,nodead', 'target,help,nodead', 'player'];
            suggestions.explanation = 'Healing spells should target friendly units that are alive. Mouseover is ideal for quick targeting.';
            suggestions.examples = [
                { type: 'Mouseover with self-cast fallback', macro: '[@mouseover,help,nodead][@player]' },
                { type: 'Mouseover with target fallback', macro: '[@mouseover,help,nodead][]' },
                { type: 'Self-cast only', macro: '[@player]' }
            ];
            break;

        case ABILITY_TYPES.DAMAGE:
            suggestions.conditionals = ['mouseover,harm,nodead', 'target,harm,nodead', 'focus,harm,nodead'];
            suggestions.explanation = 'Damage spells should target hostile units. Mouseover allows quick target switching without losing current target.';
            suggestions.examples = [
                { type: 'Mouseover with target fallback', macro: '[@mouseover,harm,nodead][]' },
                { type: 'Focus target with modifier', macro: '[mod:shift,@focus,harm,nodead][]' },
                { type: 'Arena targeting', macro: '[mod:shift,@arena1][mod:ctrl,@arena2][]' }
            ];
            break;

        case ABILITY_TYPES.BUFF:
            suggestions.conditionals = ['mouseover,help', 'target,help', 'player'];
            suggestions.explanation = 'Buffs can be cast on friendly units. Self-cast fallback is common for personal buffs.';
            suggestions.examples = [
                { type: 'Mouseover with self-cast', macro: '[@mouseover,help][@player]' },
                { type: 'Self-cast with modifier', macro: '[mod:shift,@player][]' }
            ];
            break;

        case ABILITY_TYPES.DEBUFF:
            suggestions.conditionals = ['mouseover,harm,nodead', 'target,harm,nodead', 'focus,harm,nodead'];
            suggestions.explanation = 'Debuffs should target hostile units.';
            suggestions.examples = [
                { type: 'Mouseover', macro: '[@mouseover,harm,nodead][]' },
                { type: 'Focus target', macro: '[@focus,harm,nodead][]' }
            ];
            break;

        case ABILITY_TYPES.DISPEL:
            suggestions.conditionals = ['mouseover,help,nodead', 'target,help,nodead', 'player'];
            suggestions.explanation = 'Dispels should target friendly units that need cleansing.';
            suggestions.examples = [
                { type: 'Mouseover', macro: '[@mouseover,help,nodead][]' },
                { type: 'Party members', macro: '[@mouseover,help,nodead][@party1][@party2][]' }
            ];
            break;

        case ABILITY_TYPES.DEFENSIVE_COOLDOWN:
            suggestions.conditionals = ['player'];
            suggestions.explanation = 'Defensive cooldowns are typically self-cast.';
            suggestions.examples = [
                { type: 'Self-cast', macro: '[@player]' },
                { type: 'Self-cast with mouseover fallback', macro: '[@mouseover,help][@player]' }
            ];
            break;

        case ABILITY_TYPES.CC:
            suggestions.conditionals = ['mouseover,harm,nodead', 'focus,harm,nodead', 'arena1', 'arena2', 'arena3'];
            suggestions.explanation = 'Crowd control abilities benefit from focus and arena targeting.';
            suggestions.examples = [
                { type: 'Focus with modifier', macro: '[mod:shift,@focus,harm,nodead][]' },
                { type: 'Arena targeting', macro: '[mod:shift,@arena1][mod:ctrl,@arena2][]' }
            ];
            break;

        default:
            suggestions.conditionals = ['mouseover,nodead', 'target'];
            suggestions.explanation = 'General utility spells work with mouseover for convenience.';
            suggestions.examples = [
                { type: 'Mouseover', macro: '[@mouseover,nodead][]' }
            ];
    }

    return suggestions;
}

/**
 * Detect ability type from name/description
 * @param {string} abilityName - Name of the ability
 * @param {string} description - Description of the ability
 * @returns {string} Detected ability type
 */
export function detectAbilityType(abilityName = '', description = '') {
    const name = abilityName.toLowerCase();
    const desc = description.toLowerCase();
    const combined = `${name} ${desc}`;

    // Healing
    if (combined.match(/heal|restore|health|regenerat|mend|renew|rejuvenat/)) {
        return ABILITY_TYPES.HEAL;
    }

    // Dispel
    if (combined.match(/dispel|cleanse|purify|remove|cure/)) {
        return ABILITY_TYPES.DISPEL;
    }

    // Buffs
    if (combined.match(/buff|fortitude|blessing|shield|ward|armor|intellect|stamina|increase/)) {
        return ABILITY_TYPES.BUFF;
    }

    // Defensive cooldowns
    if (combined.match(/barrier|wall|shield wall|ice block|divine shield|pain suppression|ironbark/)) {
        return ABILITY_TYPES.DEFENSIVE_COOLDOWN;
    }

    // Crowd Control
    if (combined.match(/polymorph|fear|stun|silence|incapacitate|disorient|cyclone|hex|sap/)) {
        return ABILITY_TYPES.CC;
    }

    // Debuffs
    if (combined.match(/curse|corruption|poison|disease|weaken|slow|root/)) {
        return ABILITY_TYPES.DEBUFF;
    }

    // Damage (default for offensive abilities)
    if (combined.match(/damage|strike|blast|bolt|shot|attack|hit|destroy|kill|fire|frost|shadow|arcane/)) {
        return ABILITY_TYPES.DAMAGE;
    }

    return ABILITY_TYPES.UTILITY;
}

/**
 * Get all available macro templates with descriptions
 * @returns {array} Array of template objects
 */
export function getAvailableTemplates() {
    return [
        {
            type: MACRO_TEMPLATES.MOUSEOVER,
            name: 'Mouseover',
            description: 'Cast spell on mouseover target without losing current target',
            useCase: 'Quick targeting for heals, damage, or utility spells',
            icon: '🖱️'
        },
        {
            type: MACRO_TEMPLATES.FOCUS,
            name: 'Focus Target',
            description: 'Cast spell on focus target while maintaining main target',
            useCase: 'Multi-target scenarios, keeping CC on one target while DPSing another',
            icon: '🎯'
        },
        {
            type: MACRO_TEMPLATES.SELF_CAST,
            name: 'Self-Cast',
            description: 'Always cast spell on yourself',
            useCase: 'Buffs, heals, or defensive abilities that you use on yourself',
            icon: '👤'
        },
        {
            type: MACRO_TEMPLATES.ARENA_123,
            name: 'Arena 1-2-3',
            description: 'Quick targeting for arena opponents using modifier keys',
            useCase: 'PvP arena matches - Shift=Arena1, Ctrl=Arena2, Alt=Arena3',
            icon: '⚔️'
        },
        {
            type: MACRO_TEMPLATES.CASTSEQUENCE,
            name: 'Cast Sequence',
            description: 'Cast multiple spells in order with each button press',
            useCase: 'Rotation sequences, buff chains, or ability combos',
            icon: '🔄'
        },
        {
            type: MACRO_TEMPLATES.MODIFIED_KEYS,
            name: 'Modified Keys',
            description: 'Different spells based on modifier keys (Shift/Ctrl/Alt)',
            useCase: 'Consolidate related abilities on one button',
            icon: '⌨️'
        },
        {
            type: MACRO_TEMPLATES.STOP_CAST,
            name: 'Stop Cast',
            description: 'Cancel current cast and immediately use instant ability',
            useCase: 'Interrupt your own cast to use instant CC or defensive',
            icon: '⏹️'
        },
        {
            type: MACRO_TEMPLATES.PET_ASSIST,
            name: 'Pet Assist',
            description: 'Send pet to attack and start auto-attack',
            useCase: 'Pet classes - combines pet attack with your attack',
            icon: '🐾'
        }
    ];
}

/**
 * Generate a custom macro with user-selected options
 * @param {string} spellName - Name of the spell
 * @param {string} abilityType - Type of ability (heal, damage, etc.)
 * @param {object} options - Custom options from user
 * @returns {string} Generated macro text
 */
export function generateCustomMacro(spellName, abilityType = ABILITY_TYPES.DAMAGE, options = {}) {
    const {
        includeTooltip = true,
        targetModifier = null,
        conditionals = [],
        keyModifiers = []
    } = options;

    let macro = '';

    // Add tooltip (no leading space)
    if (includeTooltip) {
        macro += `#showtooltip ${spellName}\n`;
    }

    // Build the cast command with conditionals
    let castCommand = '/cast';

    // Add conditionals if any
    if (conditionals.length > 0 || targetModifier) {
        castCommand += ' [';

        // Add target modifier first
        if (targetModifier) {
            castCommand += `@${targetModifier}`;
        }

        // Add conditionals
        if (conditionals.length > 0) {
            if (targetModifier) {
                castCommand += ', ';
            }
            castCommand += conditionals.join(', ');
        }

        castCommand += ']';
    }

    // Add key modifiers
    if (keyModifiers.length > 0) {
        if (conditionals.length > 0 || targetModifier) {
            castCommand += ';';
        } else {
            castCommand += ' [';
        }

        castCommand += keyModifiers.join(', ');

        if (!targetModifier && conditionals.length === 0) {
            castCommand += ']';
        }
    }

    // Add the spell name
    castCommand += ` ${spellName}`;

    macro += castCommand;

    return macro;
}

/**
 * Build a complete macro based on user preferences
 * @param {object} params - Macro building parameters
 * @returns {object} Generated macro and metadata
 */
export function buildMacro(params) {
    const {
        spellName,
        templateType,
        abilityType = null,
        wowClass = null,
        customOptions = {}
    } = params;

    let macro = '';
    let generatedTags = [];
    let explanation = '';

    const detectedType = abilityType || detectAbilityType(spellName);

    switch (templateType) {
        case MACRO_TEMPLATES.MOUSEOVER:
            macro = generateMouseoverMacro(spellName, detectedType, customOptions);
            generatedTags = ['mouseover', 'targeting'];
            explanation = `Mouseover macro for ${spellName}. Casts on mouseover target, falls back to current target.`;
            break;

        case MACRO_TEMPLATES.FOCUS:
            macro = generateFocusMacro(spellName, customOptions);
            generatedTags = ['focus', 'targeting'];
            explanation = `Focus target macro for ${spellName}. Casts on focus target if it exists.`;
            break;

        case MACRO_TEMPLATES.SELF_CAST:
            macro = generateSelfCastMacro(spellName, customOptions);
            generatedTags = ['self-cast'];
            explanation = `Self-cast macro for ${spellName}. Always casts on yourself.`;
            break;

        case MACRO_TEMPLATES.ARENA_123:
            macro = generateArenaMacro(spellName, customOptions);
            generatedTags = ['arena', 'pvp', 'targeting'];
            explanation = `Arena targeting macro for ${spellName}. Use Shift for Arena1, Ctrl for Arena2, Alt for Arena3.`;
            break;

        case MACRO_TEMPLATES.STOP_CAST:
            macro = generateStopCastMacro(spellName, customOptions);
            generatedTags = ['stop-cast', 'instant'];
            explanation = `Stop-cast macro for ${spellName}. Cancels current cast and uses this ability immediately.`;
            break;

        case MACRO_TEMPLATES.PET_ASSIST:
            macro = generatePetAssistMacro(spellName, customOptions);
            generatedTags = ['pet', 'combat'];
            explanation = `Pet assist macro. Sends pet to attack and starts your auto-attack.`;
            break;

        case 'custom':
            macro = generateCustomMacro(spellName, detectedType, customOptions);
            generatedTags = ['custom'];
            explanation = `Custom macro for ${spellName} with user-selected options.`;
            break;

        default:
            macro = `#showtooltip ${spellName}\n/cast ${spellName}`;
            generatedTags = [];
            explanation = `Basic macro for ${spellName}.`;
    }

    // Add ability type tag
    if (detectedType) {
        generatedTags.push(detectedType);
    }

    // Get conditional suggestions
    const suggestions = suggestConditionals(detectedType, wowClass);

    return {
        macro,
        tags: generatedTags,
        explanation,
        abilityType: detectedType,
        suggestions
    };
}

export default {
    MACRO_TEMPLATES,
    ABILITY_TYPES,
    CONDITIONALS,
    generateMouseoverMacro,
    generateFocusMacro,
    generateArenaMacro,
    generateSelfCastMacro,
    generateCastSequenceMacro,
    generateModifiedKeyMacro,
    generateStopCastMacro,
    generatePetAssistMacro,
    generateCustomMacro,
    suggestConditionals,
    detectAbilityType,
    getAvailableTemplates,
    buildMacro
};

