/**
 * Usage Examples for macro-commands utility
 *
 * This file demonstrates practical applications of the macro command reference
 * for validation, parsing, and enhancing the macro system.
 */

import {
  isValidCommand,
  isMetacommand,
  isDisabledCommand,
  getCommandCategory,
  isCommandValidForClass,
  getCommandSuggestions,
  getCommandDescription
} from './macro-commands.js';

/**
 * Example 1: Basic Command Validation
 * Validate individual commands in a macro
 */
export function validateMacroCommands(macroText) {
  const lines = macroText.split('\n');
  const errors = [];
  const warnings = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('--')) {
      return;
    }

    // Check for slash commands
    if (trimmed.startsWith('/')) {
      const commandMatch = trimmed.match(/^\/(\w+)/);
      if (commandMatch) {
        const command = commandMatch[1];

        if (!isValidCommand(command)) {
          // Check if it's a disabled command
          if (isDisabledCommand(command)) {
            warnings.push({
              line: index + 1,
              command,
              message: `Command '/${command}' is deprecated and no longer works`,
              suggestion: null
            });
          } else {
            // Try to find suggestions
            const suggestions = getCommandSuggestions(command.substring(0, 3), 3);
            errors.push({
              line: index + 1,
              command,
              message: `Invalid command '/${command}'`,
              suggestions: suggestions.length > 0 ? suggestions : null
            });
          }
        }
      }
    }

    // Check for metacommands
    if (trimmed.startsWith('#')) {
      const commandMatch = trimmed.match(/^#(\w+)/);
      if (commandMatch) {
        const command = commandMatch[1];

        if (!isMetacommand(command)) {
          errors.push({
            line: index + 1,
            command,
            message: `Invalid metacommand '#${command}'`,
            suggestions: command.includes('show') ? ['show', 'showtooltip'] : null
          });
        }
      }
    }
  });

  return { errors, warnings };
}

/**
 * Example 2: Class-Specific Validation
 * Check if commands are appropriate for the specified class
 */
export function validateMacroForClass(macroText, wowClass) {
  const lines = macroText.split('\n');
  const warnings = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('/')) {
      const commandMatch = trimmed.match(/^\/(\w+)/);
      if (commandMatch) {
        const command = commandMatch[1];

        if (isValidCommand(command) && !isCommandValidForClass(command, wowClass)) {
          warnings.push({
            line: index + 1,
            command,
            message: `Command '/${command}' is not available for ${wowClass}`,
            detail: 'This command requires a pet class (Hunter, Warlock, Death Knight, etc.)'
          });
        }
      }
    }
  });

  return warnings;
}

/**
 * Example 3: Auto-tagging System
 * Automatically generate tags based on commands used in macro
 */
export function generateMacroTags(macroText) {
  const lines = macroText.split('\n');
  const tags = new Set();

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.startsWith('/')) {
      const commandMatch = trimmed.match(/^\/(\w+)/);
      if (commandMatch) {
        const command = commandMatch[1];
        const category = getCommandCategory(command);

        if (category) {
          // Add category as tag
          tags.add(category);

          // Add specific tags for certain commands
          if (command === 'castsequence') {
            tags.add('sequence');
          }
          if (command.includes('target')) {
            tags.add('targeting');
          }
          if (command.startsWith('pet')) {
            tags.add('pet');
          }
          if (['startattack', 'stopattack'].includes(command)) {
            tags.add('auto-attack');
          }
        }
      }
    }
  });

  return Array.from(tags);
}

/**
 * Example 4: Extract Command Information
 * Parse macro to extract structured command data
 */
export function extractMacroCommands(macroText) {
  const lines = macroText.split('\n');
  const commands = {
    metacommands: [],
    slashCommands: [],
    emotes: [],
    invalid: []
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) return;

    // Parse metacommands
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^#(\w+)(.*)$/);
      if (match) {
        const [, command, args] = match;
        if (isMetacommand(command)) {
          commands.metacommands.push({
            line: index + 1,
            command,
            args: args.trim(),
            description: getCommandDescription(command)
          });
        } else {
          commands.invalid.push({
            line: index + 1,
            text: trimmed,
            reason: 'Invalid metacommand'
          });
        }
      }
    }

    // Parse slash commands
    else if (trimmed.startsWith('/')) {
      const match = trimmed.match(/^\/(\w+)(.*)$/);
      if (match) {
        const [, command, args] = match;
        const category = getCommandCategory(command);

        if (isValidCommand(command)) {
          const commandInfo = {
            line: index + 1,
            command,
            args: args.trim(),
            category,
            description: getCommandDescription(command)
          };

          if (category === 'emote') {
            commands.emotes.push(commandInfo);
          } else {
            commands.slashCommands.push(commandInfo);
          }
        } else {
          commands.invalid.push({
            line: index + 1,
            text: trimmed,
            reason: isDisabledCommand(command) ? 'Deprecated command' : 'Unknown command',
            suggestions: getCommandSuggestions(command.substring(0, 3), 3)
          });
        }
      }
    }
  });

  return commands;
}

/**
 * Example 5: Autocomplete Suggestions
 * Generate autocomplete suggestions for macro editor
 */
export function getAutocompleteSuggestions(currentLine, cursorPosition) {
  const textBeforeCursor = currentLine.substring(0, cursorPosition);

  // Check for slash command
  const slashMatch = textBeforeCursor.match(/\/(\w*)$/);
  if (slashMatch) {
    const partial = slashMatch[1];
    const suggestions = getCommandSuggestions(partial, 15);

    return suggestions.map(cmd => ({
      text: cmd,
      displayText: `/${cmd}`,
      description: getCommandDescription(cmd),
      category: getCommandCategory(cmd),
      type: 'command'
    }));
  }

  // Check for metacommand
  const metaMatch = textBeforeCursor.match(/#(\w*)$/);
  if (metaMatch) {
    const partial = metaMatch[1].toLowerCase();
    const suggestions = ['show', 'showtooltip'].filter(cmd =>
      cmd.startsWith(partial)
    );

    return suggestions.map(cmd => ({
      text: cmd,
      displayText: `#${cmd}`,
      description: getCommandDescription(cmd),
      type: 'metacommand'
    }));
  }

  return [];
}

/**
 * Example 6: Detailed Validation Report
 * Generate a comprehensive validation report
 */
export function generateValidationReport(macroText, wowClass = null) {
  const basicValidation = validateMacroCommands(macroText);
  const classValidation = wowClass ? validateMacroForClass(macroText, wowClass) : [];
  const commands = extractMacroCommands(macroText);
  const tags = generateMacroTags(macroText);

  return {
    isValid: basicValidation.errors.length === 0,
    summary: {
      totalLines: macroText.split('\n').length,
      commandCount: commands.slashCommands.length,
      metacommandCount: commands.metacommands.length,
      errorCount: basicValidation.errors.length,
      warningCount: basicValidation.warnings.length + classValidation.length
    },
    validation: {
      errors: basicValidation.errors,
      warnings: [...basicValidation.warnings, ...classValidation]
    },
    commands,
    suggestedTags: tags
  };
}

// Example usage demonstrations
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('=== Macro Commands Utility Examples ===\n');

  // Example macro text
  const exampleMacro = `#showtooltip
/cast Fireball
/target Enemy
/startattack`;

  const badMacro = `#showwtooltip
/csat Fireball
/targetenemy
/petattack`;

  console.log('Example 1: Valid Macro');
  console.log('Macro text:', exampleMacro);
  console.log('Validation:', validateMacroCommands(exampleMacro));
  console.log('');

  console.log('Example 2: Invalid Macro');
  console.log('Macro text:', badMacro);
  console.log('Validation:', validateMacroCommands(badMacro));
  console.log('');

  console.log('Example 3: Auto-tags');
  console.log('Generated tags:', generateMacroTags(exampleMacro));
  console.log('');

  console.log('Example 4: Command Extraction');
  console.log('Extracted commands:', extractMacroCommands(exampleMacro));
  console.log('');

  console.log('Example 5: Autocomplete for "/cas"');
  console.log('Suggestions:', getAutocompleteSuggestions('/cas', 4));
  console.log('');

  console.log('Example 6: Full Validation Report');
  console.log('Report:', JSON.stringify(generateValidationReport(badMacro, 'warrior'), null, 2));
}

export default {
  validateMacroCommands,
  validateMacroForClass,
  generateMacroTags,
  extractMacroCommands,
  getAutocompleteSuggestions,
  generateValidationReport
};

