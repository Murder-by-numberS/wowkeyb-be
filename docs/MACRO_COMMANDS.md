# WoW Macro Commands Reference System

## Overview

This document describes the Macro Commands Reference System implemented in Phase 1 of macro command validation. This system provides comprehensive data and utilities for validating, parsing, and enhancing WoW macros.

## Source

All command data is sourced from [Wowpedia Macro Commands](https://wowpedia.fandom.com/wiki/Macro_commands), the authoritative reference for World of Warcraft macro commands.

## Files

### Core Module
- **`src/utils/macro-commands.js`** - Main command reference and utility functions
- **`src/utils/macro-commands.examples.js`** - Practical usage examples and higher-level functions
- **`src/utils/__tests__/macro-commands.test.js`** - Comprehensive test suite

## Command Categories

The system organizes commands into the following categories:

### 1. Combat Commands
Commands for casting spells, using items, and controlling combat actions:
- `cast`, `use`, `castsequence`, `castrandom`
- `startattack`, `stopattack`, `stopcasting`
- `cancelaura`, `cancelform`
- And more...

### 2. Targeting Commands
Commands for selecting and managing targets:
- `target`, `targetexact`, `targetenemy`, `targetfriend`
- `focus`, `clearfocus`, `cleartarget`
- `assist`, `targetlasttarget`
- And more...

### 3. Pet Commands
Commands for controlling combat pets:
- `petattack`, `petfollow`, `petstay`
- `petdefensive`, `petpassive`, `petassist`
- `petautocaston`, `petautocastoff`
- And more...

**Note**: Pet commands are only valid for certain classes (Hunter, Warlock, Death Knight, Mage, Shaman, Priest).

### 4. Party/Raid Commands
Commands for managing groups:
- `invite`, `uninvite`, `promote`
- `readycheck`, `raidinfo`
- `targetmarker`, `worldmarker`
- Loot management: `ffa`, `group`, `master`, `threshold`

### 5. Guild Commands
Commands for guild management:
- `guildinvite`, `guildremove`, `guildquit`
- `guildpromote`, `guilddemote`
- `guildmotd`, `guildinfo`

### 6. PvP Commands
Commands for player versus player combat:
- `duel`, `forfeit`
- `pvp`, `wargame`

### 7. System Commands
Client-side system commands:
- `reload`, `logout`, `quit`
- `random`, `time`, `played`
- `console`, `script`

### 8. Chat & Emote Commands
Communication commands including:
- Channel commands: `say`, `yell`, `party`, `raid`, `guild`, `whisper`
- 200+ emote commands: `wave`, `dance`, `cheer`, etc.

### 9. Metacommands
Special commands that affect action bar appearance (prefixed with `#`):
- `#show` - Controls the button's icon
- `#showtooltip` - Controls icon and tooltip

## Core Functions

### Validation Functions

#### `isValidCommand(command)`
Checks if a command is valid.

```javascript
import { isValidCommand } from './utils/macro-commands.js';

isValidCommand('cast');      // true
isValidCommand('target');    // true
isValidCommand('invalid');   // false
```

#### `isMetacommand(command)`
Checks if a command is a metacommand.

```javascript
isMetacommand('showtooltip'); // true
isMetacommand('cast');        // false
```

#### `isDisabledCommand(command)`
Checks if a command is deprecated/disabled.

```javascript
isDisabledCommand('usetalents');    // true (deprecated)
isDisabledCommand('petaggressive'); // true (deprecated)
```

#### `isCommandValidForClass(command, wowClass)`
Checks if a command is valid for a specific class.

```javascript
isCommandValidForClass('petattack', 'hunter');  // true
isCommandValidForClass('petattack', 'warrior'); // false
isCommandValidForClass('cast', 'mage');         // true
```

### Information Functions

#### `getCommandCategory(command)`
Returns the category of a command.

```javascript
getCommandCategory('cast');      // 'combat'
getCommandCategory('target');    // 'targeting'
getCommandCategory('petattack'); // 'pet'
```

#### `getCommandDescription(command)`
Returns a description of what a command does.

```javascript
getCommandDescription('cast');
// "Uses the stated spell or item (spell priority)"
```

#### `getCommandSuggestions(partial, limit)`
Returns command suggestions based on partial input.

```javascript
getCommandSuggestions('cas', 5);
// ['cast', 'castrandom', 'castsequence', 'cancelaura', 'cancelform']
```

## Advanced Usage Examples

### Example 1: Validate a Macro

```javascript
import { validateMacroCommands } from './utils/macro-commands.examples.js';

const macro = `#showtooltip
/cast Fireball
/startattack`;

const result = validateMacroCommands(macro);
// { errors: [], warnings: [] }
```

### Example 2: Detect Invalid Commands

```javascript
const badMacro = `#showwtooltip
/csat Fireball`;

const result = validateMacroCommands(badMacro);
// {
//   errors: [
//     { line: 1, command: 'showwtooltip', message: '...' },
//     { line: 2, command: 'csat', message: '...', suggestions: ['cast', ...] }
//   ],
//   warnings: []
// }
```

### Example 3: Class-Specific Validation

```javascript
import { validateMacroForClass } from './utils/macro-commands.examples.js';

const macro = `/petattack
/cast Fireball`;

const warnings = validateMacroForClass(macro, 'warrior');
// [{ line: 1, command: 'petattack', message: 'Command not available for warrior' }]
```

### Example 4: Auto-Generate Tags

```javascript
import { generateMacroTags } from './utils/macro-commands.examples.js';

const macro = `/castsequence Fireball, Frostbolt
/petattack
/targetenemy`;

const tags = generateMacroTags(macro);
// ['combat', 'sequence', 'pet', 'targeting']
```

### Example 5: Extract Command Information

```javascript
import { extractMacroCommands } from './utils/macro-commands.examples.js';

const macro = `#showtooltip
/cast Fireball
/startattack`;

const commands = extractMacroCommands(macro);
// {
//   metacommands: [{ line: 1, command: 'showtooltip', ... }],
//   slashCommands: [
//     { line: 2, command: 'cast', category: 'combat', ... },
//     { line: 3, command: 'startattack', category: 'combat', ... }
//   ],
//   emotes: [],
//   invalid: []
// }
```

### Example 6: Autocomplete Suggestions

```javascript
import { getAutocompleteSuggestions } from './utils/macro-commands.examples.js';

const suggestions = getAutocompleteSuggestions('/cas', 4);
// [
//   { text: 'cast', displayText: '/cast', description: '...', type: 'command' },
//   { text: 'castrandom', displayText: '/castrandom', ... },
//   ...
// ]
```

### Example 7: Comprehensive Validation Report

```javascript
import { generateValidationReport } from './utils/macro-commands.examples.js';

const macro = `#showtooltip Fireball
/cast Fireball
/startattack`;

const report = generateValidationReport(macro, 'mage');
// {
//   isValid: true,
//   summary: { totalLines: 3, commandCount: 2, errorCount: 0, ... },
//   validation: { errors: [], warnings: [] },
//   commands: { ... },
//   suggestedTags: ['combat'],
//   quality: { total: 100, grade: 'A', ... },
//   recommendations: ['...']
// }
```

## Integration Roadmap

### ✅ Phase 1: Command Reference (Complete)
- Created comprehensive command database
- Implemented validation utilities
- Built example usage patterns
- Added test coverage

### 🔜 Phase 2: Basic Validation (Next)
Integration points:
1. Update `src/validators/macro.validator.js` to use command validation
2. Add custom validator for `macro_text` field
3. Return helpful error messages with suggestions

### 🔜 Phase 3: Command Parsing & Analysis
Integration points:
1. Parse macro text in controller before saving
2. Store parsed command data (optional structured field)
3. Enable search by command type
4. Auto-generate tags based on commands used

### 🔜 Phase 4: Enhanced Features
Possible enhancements:
1. **Auto-tagging**: Automatically tag macros based on commands
2. **Smart Search**: "Find macros that use castsequence"
3. **Frontend Autocomplete**: Real-time command suggestions
4. **Macro Analytics**: Track popular commands
5. **Quality Scoring**: Rate macro quality
6. **Similar Macros**: Find macros with similar command patterns

## Usage in Validators

### Example: Add to Macro Validator

```javascript
// In src/validators/macro.validator.js
import { validateMacroCommands } from '../utils/macro-commands.examples.js';

body('macro_text')
  .custom((value) => {
    const validation = validateMacroCommands(value);
    
    if (validation.errors.length > 0) {
      const errorMessages = validation.errors.map(err => 
        `Line ${err.line}: ${err.message}`
      ).join('; ');
      throw new Error(errorMessages);
    }
    
    return true;
  })
  .withMessage('Macro contains invalid commands');
```

## Usage in Controllers

### Example: Auto-Generate Tags

```javascript
// In src/controllers/macro/macros.js
import { generateMacroTags } from '../../utils/macro-commands.examples.js';

export const createMacro = async (req, res) => {
  // ... existing code ...
  
  // Auto-generate tags if not provided
  if (!tags || tags.length === 0) {
    tags = generateMacroTags(macro_text);
  }
  
  // ... continue with macro creation ...
};
```

## Testing

Run the test suite:

```bash
npm test src/utils/__tests__/macro-commands.test.js
```

Run the examples:

```bash
node src/utils/macro-commands.examples.js
```

## API Reference

See inline JSDoc comments in `src/utils/macro-commands.js` for complete API documentation.

## Contributing

When adding new commands or categories:

1. Update the appropriate command array in `macro-commands.js`
2. Add tests to `macro-commands.test.js`
3. Update this documentation
4. Verify changes against [Wowpedia](https://wowpedia.fandom.com/wiki/Macro_commands)

## Notes

- All commands are case-insensitive
- Metacommands use `#` prefix, all others use `/` prefix
- Pet commands are only valid for pet classes
- Some commands are deprecated but still recognized for warning purposes
- The 255 character limit for macros is enforced at the model level

## References

- [Wowpedia: Macro Commands](https://wowpedia.fandom.com/wiki/Macro_commands)
- [Wowpedia: Making a Macro](https://wowpedia.fandom.com/wiki/Making_a_macro)
- [Wowpedia: Macro Conditionals](https://wowpedia.fandom.com/wiki/Macro_conditionals)

