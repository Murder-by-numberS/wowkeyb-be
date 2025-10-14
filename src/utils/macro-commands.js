/**
 * WoW Macro Commands Reference
 * Based on: https://wowpedia.fandom.com/wiki/Macro_commands
 * 
 * This module provides comprehensive reference data for all World of Warcraft macro commands,
 * organized by category for validation, parsing, and autocomplete features.
 */

/**
 * Combat-related commands
 * These commands are used for casting spells, using items, and controlling combat actions
 */
export const COMBAT_COMMANDS = [
  'cancelaura',        // Cancels (turns off) an aura you have
  'cancelqueuedspell', // Cancels casting of the spell you have in the queue
  'cancelform',        // Cancels your current shapeshift form
  'cast',              // Uses the stated spell or item (conflict in names goes to spell)
  'castrandom',        // Casts a random spell or uses a random item from the given list
  'castsequence',      // Casts the given spells in sequential order
  'changeactionbar',   // Changes your current action bar page
  'startattack',       // Turns on auto-attack
  'stopattack',        // Turns off auto-attack
  'stopcasting',       // Stops casting or channeling
  'stopspelltarget',   // Cancel the spell or ability currently being targeted
  'swapactionbar',     // Swaps between two given action bars
  'use',               // Use the stated item or spell (conflict in names goes to item)
  'usetoy',            // Use a toy
  'userandom'          // Casts a random spell or uses a random item from the given list
];

/**
 * Targeting commands
 * These commands control target selection and focus targets
 */
export const TARGETING_COMMANDS = [
  'assist',            // Targets a player's target
  'clearfocus',        // Clears the current focus target
  'cleartarget',       // Clears the current target
  'focus',             // Set a focus target
  'target',            // Target the given unit by name
  'targetexact',       // Target the unit by exact name match
  'targetenemy',       // Cycle through nearby hostile units (no name matching)
  'targetenemyplayer', // Cycle through nearby hostile players (no name matching)
  'targetfriend',      // Cycle through nearby friendly units (no name matching)
  'targetfriendplayer',// Cycle through nearby friendly players (no name matching)
  'targetparty',       // Cycle through nearby party members (no name matching)
  'targetraid',        // Cycle through nearby raid members (no name matching)
  'targetlastenemy',   // Target the last attackable unit you had selected
  'targetlastfriend',  // Target the last friendly unit you had selected
  'targetlasttarget'   // Sets your current target to the last unit you had selected
];

/**
 * Pet commands
 * These commands control pet behavior and abilities
 */
export const PET_COMMANDS = [
  'petassist',         // Sets pet to assist mode
  'petattack',         // Sends pet to attack currently selected target
  'petautocastoff',    // Turn off autocast for a pet spell
  'petautocaston',     // Turn on autocast for a pet spell
  'petautocasttoggle', // Toggle autocast for a pet spell
  'petdefensive',      // Set pet to defensive
  'petdismiss',        // Dismiss your pet
  'petfollow',         // Set pet to follow you
  'petmoveto',         // Set pet to move to and stay at a hover-targeted location
  'petpassive',        // Set pet to passive mode
  'petstay'            // Set pet to stay where it is at
];

/**
 * Party and Raid commands
 * These commands manage party/raid groups, loot, and markers
 */
export const PARTY_RAID_COMMANDS = [
  'clearworldmarker',  // Clears world markers
  'invite',            // Invites a player to your party or raid
  'ffa',               // Sets the loot method for your raid/party to Free-For-All
  'group',             // Sets the loot method for your raid/party to Group Loot
  'master',            // Sets the loot method for your raid/party to Master Loot
  'mainassist',        // Set the main assist
  'mainassistoff',     // Clears the current Main Assist
  'maintank',          // Set the main tank
  'maintankoff',       // Clears the current Main Tank
  'promote',           // Promotes the given member to Party or Raid leader
  'raidinfo',          // Shows you what instances you are saved to, along with the Instance ID
  'readycheck',        // Performs a ready check in your raid or party
  'requestinvite',     // Request to be invited to the specified group
  'targetmarker',      // Sets or clears a target marker from your current target
  'threshold',         // Sets the loot threshold to apply loot rules
  'uninvite',          // Removes a player from your current party or raid
  'worldmarker'        // Allows placement of world markers
];

/**
 * Guild commands
 * These commands manage guild operations
 */
export const GUILD_COMMANDS = [
  'guilddemote',       // Demotes a guild-member
  'guilddisband',      // Disbands a guild
  'guildinfo',         // Displays information about your guild
  'guildinvite',       // Invites a player to join your guild
  'guildleader',       // Makes another guild member the new Guild Master
  'guildquit',         // Removes your character from your current guild
  'guildmotd',         // Sets the guild Message of the Day
  'guildpromote',      // Promotes a guild member to the next higher rank
  'guildroster',       // Opens the Guild window
  'guildremove'        // Removes a member of your guild from your guild
];

/**
 * PvP commands
 * These commands are related to player versus player combat
 */
export const PVP_COMMANDS = [
  'duel',              // Challenge another player to a duel
  'forfeit',           // Forfeit a duel
  'pvp',               // Sets whether or not you are attackable by other players
  'wargame'            // Starts a War Game
];

/**
 * System commands
 * These commands control client-side settings and system functions
 */
export const SYSTEM_COMMANDS = [
  'console',           // Allows user to view or change global client-side options
  'click',             // Simulate a mouse click on a button
  'disableaddons',     // Disables all addons and reloads the UI
  'enableaddons',      // Enables all addons and reloads the UI
  'help',              // Displays a help message with some basic commands
  'logout',            // Logs your character out of the game
  'macrohelp',         // Displays a help message about creating and using macros
  'played',            // Displays information about your character's time logged in
  'quit',              // Exits the game
  'random',            // Generates a random number
  'reload',            // Reloads the User Interface
  'script',            // Runs a block of LUA code
  'stopmacro',         // Stop processing the current macro
  'time',              // Displays the current time
  'timetest',          // Used for benchmarking, also shows FPS
  'who'                // Shows you a list of people matching filtering options
];

/**
 * Chat and communication commands
 * Includes channel commands and emotes
 */
export const CHAT_COMMANDS = [
  // Channel commands
  'say', 's',          // Say (local chat)
  'yell', 'y',         // Yell
  'whisper', 'w', 'tell', 't', // Whisper/tell to a player
  'reply', 'r',        // Reply to last whisper
  'emote', 'e', 'me',  // Emote
  'party', 'p',        // Party chat
  'raid', 'ra',        // Raid chat
  'raidwarning', 'rw', // Raid warning
  'instance', 'i',     // Instance chat
  'guild', 'g',        // Guild chat
  'officer', 'o',      // Officer chat
  'battleground', 'bg',// Battleground chat
  'channel', 'c',      // Custom channel
  'join',              // Join a channel
  'leave', 'chatleave',// Leave a channel
  'chatlist',          // List channels
  'chatinvite',        // Invite to channel
  'chanskick',         // Kick from channel
];

/**
 * Emote commands
 * These commands perform character emotes (animations and/or chat messages)
 * Symbols: + = broadcasts to nearby players, % = has sound effect, @ = usable while mounted
 */
export const EMOTE_COMMANDS = [
  'afk', 'away',
  'angry', 'mad',
  'apologize', 'sorry',
  'applaud', 'applause', 'bravo',
  'arm', 'armstretch',
  'attacktarget',
  'awe',
  'backpack',
  'badfeeling',
  'bark',
  'bashful',
  'beckon', 'come',
  'beg',
  'belch', 'burp',
  'bite',
  'bleed',
  'blink',
  'blood',
  'blow', 'kiss',
  'blush',
  'boggle',
  'bonk', 'doh',
  'bored',
  'bounce',
  'bow',
  'brandish',
  'brb',
  'breath',
  'brow',
  'bye', 'goodbye', 'farewell',
  'cackle',
  'calm',
  'challenge',
  'charge',
  'charm',
  'cheer',
  'chew', 'eat', 'feast',
  'chicken', 'flap', 'strut',
  'chuckle',
  'chug',
  'clap',
  'cold',
  'comfort',
  'commend',
  'confused',
  'congrats', 'grats',
  'congratulate',
  'cough',
  'coverears',
  'cower', 'fear',
  'crack', 'knuckles',
  'cringe',
  'crossarms',
  'cry', 'sob', 'weep',
  'cuddle', 'spoon',
  'curious',
  'curtsey',
  'dance',
  'ding',
  'disagree',
  'disappointment', 'disappointed', 'frown',
  'doubt',
  'drink', 'shindig',
  'drool',
  'duck',
  'embarrass',
  'encourage',
  'enemy',
  'excited', 'talkex',
  'eye',
  'eyebrow',
  'eyeroll', 'rolleyes',
  'facepalm', 'palm',
  'faint',
  'fart',
  'fidget', 'impatient',
  'fist', 'shakefist',
  'flee', 'retreat',
  'flex', 'strong',
  'flirt',
  'flop',
  'followme',
  'food', 'hungry', 'pizza',
  'gasp',
  'gaze',
  'giggle',
  'glad', 'happy', 'yay',
  'glare',
  'gloat',
  'glower',
  'go',
  'going',
  'golfclap',
  'greet', 'greetings',
  'grin', 'wicked', 'wickedly',
  'groan',
  'grovel', 'peon',
  'growl',
  'guffaw',
  'hail',
  'headache',
  'healme',
  'hello', 'hi',
  'helpme',
  'hiccup',
  'highfive',
  'hiss',
  'holdhand',
  'holdit', 'object', 'objection',
  'holler', 'shout',
  'hug',
  'hurry',
  'idea',
  'inc', 'incoming',
  'insult',
  'introduce',
  'jealous',
  'jk',
  'kneel',
  'laugh', 'lol',
  'lavish', 'praise',
  'lay', 'laydown', 'lie', 'liedown',
  'lick',
  'listen',
  'look',
  'lost',
  'love',
  'luck',
  'map',
  'massage',
  'mercy',
  'moan',
  'mock',
  'moo',
  'moon',
  'mountspecial',
  'mourn',
  'mutter',
  'nervous',
  'no',
  'nod', 'yes',
  'nosepick', 'pick',
  'oom',
  'openfire',
  'pack',
  'panic',
  'pat',
  'peer',
  'pest', 'shoo',
  'pet',
  'pinch',
  'pity',
  'plead',
  'point',
  'poke',
  'ponder',
  'pounce',
  'pout',
  'pray',
  'promise',
  'proud',
  'pulse',
  'punch',
  'purr',
  'puzzled',
  'question', 'talkq',
  'raise', 'volunteer',
  'rasp',
  'rawr', 'roar',
  'rdy', 'ready',
  'read',
  'rear', 'shake',
  'regret',
  'revenge',
  'rofl',
  'rude',
  'ruffle',
  'sad',
  'salute',
  'scared',
  'scoff',
  'scold',
  'scowl',
  'scratch', 'cat', 'catty',
  'search',
  'sexy',
  'shifty',
  'shimmy',
  'shiver',
  'shush', 'silence',
  'shudder',
  'shy',
  'sigh',
  'signal',
  'silly',
  'sing',
  'sit',
  'slap',
  'sleep',
  'smell', 'stink',
  'smack',
  'smile',
  'smirk',
  'snap',
  'snarl',
  'sneak',
  'sneeze',
  'snicker',
  'sniff',
  'snort',
  'snub',
  'soothe',
  'spit',
  'squeal',
  'stand',
  'stare',
  'surprised',
  'surrender',
  'suspicious',
  'sweat',
  'talk',
  'tap',
  'taunt',
  'tease',
  'thank', 'thanks', 'ty',
  'think',
  'thirsty',
  'threaten', 'doom', 'wrath',
  'tickle',
  'tired',
  'train',
  'truce',
  'twiddle',
  'unused',
  'veto',
  'victory',
  'violin',
  'wait',
  'warn',
  'wave',
  'welcome',
  'whine',
  'whistle',
  'wink',
  'woot',
  'work',
  'yawn'
];

/**
 * Metacommands (prefixed with #)
 * These affect the button's appearance on the action bar
 */
export const METACOMMANDS = [
  'show',              // Affects the button's icon on the Action Bar
  'showtooltip'        // Affects the button's icon and tooltip on the Action Bar
];

/**
 * Disabled/deprecated commands
 * These are recognized by WoW but don't perform any actions anymore
 */
export const DISABLED_COMMANDS = [
  'usetalents',        // Change to a different dual spec (deprecated)
  'petaggressive'      // Aggressive AI was replaced with assist (deprecated in 4.2)
];

/**
 * All valid slash commands (without the / prefix)
 * This is a flat array of all commands for quick validation
 */
export const ALL_COMMANDS = [
  ...COMBAT_COMMANDS,
  ...TARGETING_COMMANDS,
  ...PET_COMMANDS,
  ...PARTY_RAID_COMMANDS,
  ...GUILD_COMMANDS,
  ...PVP_COMMANDS,
  ...SYSTEM_COMMANDS,
  ...CHAT_COMMANDS,
  ...EMOTE_COMMANDS
];

/**
 * Command categories mapping
 * Maps each command to its category for classification and filtering
 */
export const COMMAND_CATEGORIES = {
  combat: COMBAT_COMMANDS,
  targeting: TARGETING_COMMANDS,
  pet: PET_COMMANDS,
  party_raid: PARTY_RAID_COMMANDS,
  guild: GUILD_COMMANDS,
  pvp: PVP_COMMANDS,
  system: SYSTEM_COMMANDS,
  chat: CHAT_COMMANDS,
  emote: EMOTE_COMMANDS
};

/**
 * Pet classes
 * Classes that have pet commands available
 */
export const PET_CLASSES = [
  'hunter',
  'warlock',
  'deathknight',
  'mage',      // water elemental
  'shaman',    // elementals
  'priest'     // shadowfiend/mindbender
];

/**
 * Check if a command is valid
 * @param {string} command - Command name (without / prefix)
 * @returns {boolean} True if the command is valid
 */
export function isValidCommand(command) {
  if (!command) return false;
  const normalizedCommand = command.toLowerCase().trim();
  return ALL_COMMANDS.includes(normalizedCommand);
}

/**
 * Check if a command is a metacommand
 * @param {string} command - Command name (without # prefix)
 * @returns {boolean} True if it's a metacommand
 */
export function isMetacommand(command) {
  if (!command) return false;
  const normalizedCommand = command.toLowerCase().trim();
  return METACOMMANDS.includes(normalizedCommand);
}

/**
 * Check if a command is disabled/deprecated
 * @param {string} command - Command name (without / prefix)
 * @returns {boolean} True if the command is disabled
 */
export function isDisabledCommand(command) {
  if (!command) return false;
  const normalizedCommand = command.toLowerCase().trim();
  return DISABLED_COMMANDS.includes(normalizedCommand);
}

/**
 * Get the category for a command
 * @param {string} command - Command name (without / prefix)
 * @returns {string|null} Category name or null if not found
 */
export function getCommandCategory(command) {
  if (!command) return null;
  const normalizedCommand = command.toLowerCase().trim();
  
  for (const [category, commands] of Object.entries(COMMAND_CATEGORIES)) {
    if (commands.includes(normalizedCommand)) {
      return category;
    }
  }
  return null;
}

/**
 * Check if a command is valid for a specific class
 * @param {string} command - Command name (without / prefix)
 * @param {string} wowClass - WoW class name
 * @returns {boolean} True if the command is valid for the class
 */
export function isCommandValidForClass(command, wowClass) {
  if (!command || !wowClass) return true; // Allow if no class specified
  
  const normalizedCommand = command.toLowerCase().trim();
  const normalizedClass = wowClass.toLowerCase().trim();
  
  // Check if it's a pet command
  if (PET_COMMANDS.includes(normalizedCommand)) {
    return PET_CLASSES.includes(normalizedClass);
  }
  
  // All other commands are valid for all classes
  return true;
}

/**
 * Get command suggestions based on partial input
 * @param {string} partial - Partial command name
 * @param {number} limit - Maximum number of suggestions
 * @returns {string[]} Array of matching command names
 */
export function getCommandSuggestions(partial, limit = 10) {
  if (!partial) return [];
  
  const normalized = partial.toLowerCase().trim();
  const matches = ALL_COMMANDS.filter(cmd => cmd.startsWith(normalized));
  
  return matches.slice(0, limit);
}

/**
 * Get command description
 * @param {string} command - Command name (without / prefix)
 * @returns {string|null} Command description or null if not found
 */
export function getCommandDescription(command) {
  const descriptions = {
    // Combat
    'cancelaura': 'Cancels (turns off) an aura you have',
    'cancelqueuedspell': 'Cancels casting of the spell you have in the queue',
    'cancelform': 'Cancels your current shapeshift form',
    'cast': 'Uses the stated spell or item (spell priority)',
    'castrandom': 'Casts a random spell or uses a random item from the list',
    'castsequence': 'Casts the given spells in sequential order',
    'changeactionbar': 'Changes your current action bar page',
    'startattack': 'Turns on auto-attack',
    'stopattack': 'Turns off auto-attack',
    'stopcasting': 'Stops casting or channeling',
    'use': 'Use the stated item or spell (item priority)',
    'usetoy': 'Use a toy from your toy collection',
    
    // Targeting
    'assist': "Targets a player's target",
    'clearfocus': 'Clears the current focus target',
    'cleartarget': 'Clears the current target',
    'focus': 'Set a focus target',
    'target': 'Target the given unit by name',
    'targetexact': 'Target the unit by exact name match',
    'targetenemy': 'Cycle through nearby hostile units',
    'targetfriend': 'Cycle through nearby friendly units',
    'targetlasttarget': 'Sets your target to the last unit you had selected',
    
    // Pet
    'petattack': 'Sends pet to attack currently selected target',
    'petfollow': 'Set pet to follow you',
    'petstay': 'Set pet to stay at current location',
    'petdefensive': 'Set pet to defensive mode',
    'petpassive': 'Set pet to passive mode',
    'petassist': 'Sets pet to assist mode',
    
    // Metacommands
    'show': "Affects the button's icon on the Action Bar",
    'showtooltip': "Affects the button's icon and tooltip on the Action Bar"
  };
  
  const normalized = command.toLowerCase().trim();
  return descriptions[normalized] || null;
}

export default {
  COMBAT_COMMANDS,
  TARGETING_COMMANDS,
  PET_COMMANDS,
  PARTY_RAID_COMMANDS,
  GUILD_COMMANDS,
  PVP_COMMANDS,
  SYSTEM_COMMANDS,
  CHAT_COMMANDS,
  EMOTE_COMMANDS,
  METACOMMANDS,
  DISABLED_COMMANDS,
  ALL_COMMANDS,
  COMMAND_CATEGORIES,
  PET_CLASSES,
  isValidCommand,
  isMetacommand,
  isDisabledCommand,
  getCommandCategory,
  isCommandValidForClass,
  getCommandSuggestions,
  getCommandDescription
};

