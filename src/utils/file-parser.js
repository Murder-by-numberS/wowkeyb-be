import Logger from './logger.js';
import { Icon } from '../models/index.js';

/**
 * Parse a WoW macro cache file and extract individual macros
 * Format: VER 3 [hex_id] "[name]" "[icon_fdid]"
 *
 * @param {string} fileContent - The raw content of the macro file
 * @returns {Array<Object>} Array of parsed macro objects
 */
export const parseMacroFile = (fileContent) => {
  try {
    if (!fileContent || typeof fileContent !== 'string') {
      Logger.warn('parseMacroFile received empty or non-string content');
      return [];
    }

    Logger.info(`parseMacroFile received content length: ${fileContent.length}`);
    const preview = fileContent.slice(0, 200).replace(/\s+/g, ' ').trim();
    Logger.debug(`parseMacroFile preview: ${preview}`);

    const lines = fileContent.split('\n');
    const macros = [];
    let currentMacro = null;
    let macroBody = [];

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const line = rawLine.replace(/\r$/, '');

      // Check for macro header: VER 3 [hex_id] "[name]" "[icon_fdid]"
      const headerMatch = line.match(/^VER\s+3\s+([0-9A-Fa-f]+)\s+"([^"]+)"\s+"([^"]+)"$/);

      if (headerMatch) {
        Logger.debug(`parseMacroFile header matched for macro: ${headerMatch[2]}`);
        // If we have a previous macro, save it
        if (currentMacro) {
          currentMacro.macro_text = macroBody.join('\n').trim();
          macros.push(currentMacro);
          macroBody = [];
        }

        // Start a new macro
        currentMacro = {
          wow_macro_id: headerMatch[1], // The hex ID from WoW
          name: headerMatch[2],
          icon_fdid: headerMatch[3],
          show_tooltip: false
        };
      } else if (line.trim() === 'END') {
        // End of current macro
        if (currentMacro) {
          currentMacro.macro_text = macroBody.join('\n').trim();

          // Check if macro has #showtooltip
          if (currentMacro.macro_text.toLowerCase().includes('#showtooltip')) {
            currentMacro.show_tooltip = true;
          }

          macros.push(currentMacro);
          currentMacro = null;
          macroBody = [];
        }
      } else if (currentMacro && line.trim()) {
        // Add line to current macro body
        macroBody.push(line);
      }
    }

    // Handle case where file doesn't end with END
    if (currentMacro) {
      currentMacro.macro_text = macroBody.join('\n').trim();
      if (currentMacro.macro_text.toLowerCase().includes('#showtooltip')) {
        currentMacro.show_tooltip = true;
      }
      macros.push(currentMacro);
    }

    Logger.info(`Parsed ${macros.length} macros from file`);
    if (macros.length > 0) {
      Logger.debug(
        `parseMacroFile parsed macros: ${macros.map((macro) => macro.name).join(', ')}`
      );
    }
    return macros;
  } catch (error) {
    Logger.error('Error parsing macro file:', error);
    throw new Error('Failed to parse macro file');
  }
};

/**
 * Detect the class from macro content
 * Looks for class-specific abilities and spells
 *
 * @param {string} macroText - The macro text content
 * @returns {string|null} The detected class or null
 */
export const detectClassFromMacro = (macroText) => {
  const lowerText = macroText.toLowerCase();

  // Class-specific spell patterns
  const classPatterns = {
    paladin: [
      'crusader strike', 'judgment', 'holy light', 'flash of light',
      'divine shield', 'blessing of', 'avenging wrath', 'holy shock',
      'lay on hands', 'cleanse', 'beacon', 'word of glory', 'divine toll',
      'intercession', 'holy prism', 'barrier of faith', 'holy bulwark'
    ],
    priest: [
      'power word: shield', 'flash heal', 'holy nova', 'prayer of mending',
      'desperate prayer', 'fade', 'smite', 'penance', 'shadow mend',
      'mind blast', 'mind flay', 'vampiric touch', 'shadowfiend',
      'psychic scream', 'dispersion', 'void form'
    ],
    warrior: [
      'mortal strike', 'execute', 'bloodthirst', 'raging blow',
      'shield slam', 'revenge', 'heroic strike', 'charge',
      'intervene', 'die by the sword', 'enraged regeneration',
      'sweeping strikes', 'whirlwind', 'bladestorm', 'avatar'
    ],
    mage: [
      'fireball', 'frostbolt', 'arcane blast', 'arcane missiles',
      'ice lance', 'pyroblast', 'flurry', 'fire blast',
      'blink', 'invisibility', 'time warp', 'polymorph',
      'combustion', 'icy veins', 'arcane power', 'mirror image'
    ],
    warlock: [
      'shadow bolt', 'incinerate', 'drain soul', 'agony',
      'corruption', 'unstable affliction', 'immolate', 'conflagrate',
      'chaos bolt', 'summon', 'soul fire', 'haunt',
      'dark soul', 'infernal', 'doomguard', 'healthstone'
    ],
    hunter: [
      'kill command', 'cobra shot', 'aimed shot', 'steady shot',
      'kill shot', 'raptor strike', 'multi-shot', 'barrage',
      'bestial wrath', 'aspect of the', 'feign death', 'mend pet',
      'dire beast', 'stampede', 'explosive shot', 'volley'
    ],
    rogue: [
      'sinister strike', 'eviscerate', 'mutilate', 'dispatch',
      'backstab', 'ambush', 'hemorrhage', 'envenom',
      'kidney shot', 'vanish', 'evasion', 'cloak of shadows',
      'shadow dance', 'vendetta', 'blade flurry', 'pistol shot'
    ],
    druid: [
      'moonfire', 'sunfire', 'wrath', 'starfire', 'starsurge',
      'shred', 'rake', 'rip', 'ferocious bite', 'mangle',
      'thrash', 'swipe', 'regrowth', 'rejuvenation', 'wild growth',
      'tranquility', 'incarnation', 'barkskin', 'ironbark'
    ],
    shaman: [
      'lightning bolt', 'lava burst', 'chain lightning', 'earth shock',
      'flame shock', 'stormstrike', 'lava lash', 'crash lightning',
      'healing wave', 'healing surge', 'chain heal', 'riptide',
      'spirit wolf', 'hex', 'bloodlust', 'heroism', 'earth elemental'
    ],
    monk: [
      'tiger palm', 'blackout kick', 'rising sun kick', 'fists of fury',
      'keg smash', 'breath of fire', 'spinning crane kick',
      'renewing mist', 'soothing mist', 'vivify', 'essence font',
      'storm, earth, and fire', 'invoke', 'fortifying brew', 'roll'
    ],
    deathknight: [
      'death strike', 'obliterate', 'frost strike', 'scourge strike',
      'festering strike', 'marrowrend', 'heart strike', 'death coil',
      'death and decay', 'army of the dead', 'raise dead',
      'anti-magic shell', 'icebound fortitude', 'death grip', 'chains of ice'
    ],
    demonhunter: [
      'demon\'s bite', 'chaos strike', 'blade dance', 'eye beam',
      'shear', 'fracture', 'soul cleave', 'spirit bomb',
      'metamorphosis', 'blur', 'darkness', 'spectral sight',
      'vengeful retreat', 'fel rush', 'infernal strike', 'sigil'
    ],
    evoker: [
      'living flame', 'azure strike', 'disintegrate', 'pyre',
      'emerald blossom', 'verdant embrace', 'dream breath',
      'fire breath', 'eternity surge', 'deep breath', 'hover',
      'soar', 'time dilation', 'stasis', 'prescience', 'ebon might'
    ]
  };

  // Count matches for each class
  const classMatches = {};
  for (const [className, patterns] of Object.entries(classPatterns)) {
    classMatches[className] = 0;
    for (const pattern of patterns) {
      if (lowerText.includes(pattern)) {
        classMatches[className]++;
      }
    }
  }

  // Find the class with the most matches
  let maxMatches = 0;
  let detectedClass = null;
  for (const [className, count] of Object.entries(classMatches)) {
    if (count > maxMatches) {
      maxMatches = count;
      detectedClass = className;
    }
  }

  return maxMatches > 0 ? detectedClass : null;
};

/**
 * Validate that macros in a file match the expected class
 *
 * @param {Array<Object>} parsedMacros - Array of parsed macro objects
 * @param {string} expectedClass - The expected class for character-specific macros
 * @returns {Object} Validation result with errors and warnings
 */
export const validateMacrosForClass = (parsedMacros, expectedClass) => {
  const errors = [];
  const warnings = [];

  if (!expectedClass) {
    // No class specified, so this is an account-wide macro file
    return { errors, warnings, isValid: true };
  }

  for (const macro of parsedMacros) {
    const detectedClass = detectClassFromMacro(macro.macro_text);

    if (detectedClass && detectedClass !== expectedClass) {
      errors.push({
        macroName: macro.name,
        message: `Macro "${macro.name}" appears to be for ${detectedClass}, but file is for ${expectedClass}`,
        detectedClass,
        expectedClass
      });
    } else if (!detectedClass) {
      warnings.push({
        macroName: macro.name,
        message: `Could not determine class for macro "${macro.name}". It may be a generic macro.`
      });
    }
  }

  return {
    errors,
    warnings,
    isValid: errors.length === 0
  };
};

/**
 * Resolve icon reference from FDID
 *
 * @param {string} iconFdid - The FDID of the icon
 * @returns {Promise<Object|null>} The icon object or null
 */
export const resolveIconFromFdid = async (iconFdid) => {
  try {
    // Try to find icon by FDID
    const icon = await Icon.findByFdid(parseInt(iconFdid));

    if (icon) {
      Logger.info(`Found icon for FDID ${iconFdid}: ${icon.name}`);
      return icon;
    }

    Logger.warn(`No icon found for FDID ${iconFdid}`);
    return null;
  } catch (error) {
    Logger.error(`Error resolving icon for FDID ${iconFdid}:`, error);
    return null;
  }
};

/**
 * Generate a random WoW macro ID (hex format)
 * WoW uses 16-character hex IDs
 *
 * @returns {string} A random hex ID
 */
export const generateWowMacroId = () => {
  const randomBytes = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  );
  return randomBytes.join('').toUpperCase();
};

