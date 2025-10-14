/**
 * Tests for macro-commands utility
 */

import {
  isValidCommand,
  isMetacommand,
  isDisabledCommand,
  getCommandCategory,
  isCommandValidForClass,
  getCommandSuggestions,
  getCommandDescription,
  COMBAT_COMMANDS,
  PET_COMMANDS,
  ALL_COMMANDS
} from '../macro-commands.js';

describe('Macro Commands Utility', () => {
  describe('isValidCommand', () => {
    test('should return true for valid combat commands', () => {
      expect(isValidCommand('cast')).toBe(true);
      expect(isValidCommand('use')).toBe(true);
      expect(isValidCommand('castsequence')).toBe(true);
    });

    test('should return true for valid targeting commands', () => {
      expect(isValidCommand('target')).toBe(true);
      expect(isValidCommand('assist')).toBe(true);
      expect(isValidCommand('focus')).toBe(true);
    });

    test('should return true for valid pet commands', () => {
      expect(isValidCommand('petattack')).toBe(true);
      expect(isValidCommand('petfollow')).toBe(true);
    });

    test('should return false for invalid commands', () => {
      expect(isValidCommand('invalidcommand')).toBe(false);
      expect(isValidCommand('csat')).toBe(false); // typo
      expect(isValidCommand('')).toBe(false);
      expect(isValidCommand(null)).toBe(false);
    });

    test('should be case insensitive', () => {
      expect(isValidCommand('CAST')).toBe(true);
      expect(isValidCommand('Cast')).toBe(true);
      expect(isValidCommand('cAsT')).toBe(true);
    });

    test('should handle whitespace', () => {
      expect(isValidCommand('  cast  ')).toBe(true);
      expect(isValidCommand('target ')).toBe(true);
    });
  });

  describe('isMetacommand', () => {
    test('should return true for valid metacommands', () => {
      expect(isMetacommand('show')).toBe(true);
      expect(isMetacommand('showtooltip')).toBe(true);
    });

    test('should return false for regular commands', () => {
      expect(isMetacommand('cast')).toBe(false);
      expect(isMetacommand('target')).toBe(false);
    });

    test('should return false for invalid metacommands', () => {
      expect(isMetacommand('showwtooltip')).toBe(false); // typo
      expect(isMetacommand('')).toBe(false);
    });
  });

  describe('isDisabledCommand', () => {
    test('should return true for deprecated commands', () => {
      expect(isDisabledCommand('usetalents')).toBe(true);
      expect(isDisabledCommand('petaggressive')).toBe(true);
    });

    test('should return false for active commands', () => {
      expect(isDisabledCommand('cast')).toBe(false);
      expect(isDisabledCommand('petattack')).toBe(false);
    });
  });

  describe('getCommandCategory', () => {
    test('should return correct category for combat commands', () => {
      expect(getCommandCategory('cast')).toBe('combat');
      expect(getCommandCategory('use')).toBe('combat');
      expect(getCommandCategory('castsequence')).toBe('combat');
    });

    test('should return correct category for targeting commands', () => {
      expect(getCommandCategory('target')).toBe('targeting');
      expect(getCommandCategory('focus')).toBe('targeting');
    });

    test('should return correct category for pet commands', () => {
      expect(getCommandCategory('petattack')).toBe('pet');
      expect(getCommandCategory('petfollow')).toBe('pet');
    });

    test('should return null for invalid commands', () => {
      expect(getCommandCategory('invalidcommand')).toBe(null);
      expect(getCommandCategory('')).toBe(null);
    });
  });

  describe('isCommandValidForClass', () => {
    test('should allow pet commands for hunter', () => {
      expect(isCommandValidForClass('petattack', 'hunter')).toBe(true);
      expect(isCommandValidForClass('petfollow', 'hunter')).toBe(true);
    });

    test('should allow pet commands for warlock', () => {
      expect(isCommandValidForClass('petattack', 'warlock')).toBe(true);
    });

    test('should not allow pet commands for mage', () => {
      expect(isCommandValidForClass('petattack', 'warrior')).toBe(false);
      expect(isCommandValidForClass('petfollow', 'rogue')).toBe(false);
    });

    test('should allow non-pet commands for all classes', () => {
      expect(isCommandValidForClass('cast', 'warrior')).toBe(true);
      expect(isCommandValidForClass('target', 'priest')).toBe(true);
      expect(isCommandValidForClass('use', 'hunter')).toBe(true);
    });

    test('should allow all commands when no class specified', () => {
      expect(isCommandValidForClass('petattack', null)).toBe(true);
      expect(isCommandValidForClass('cast', null)).toBe(true);
    });
  });

  describe('getCommandSuggestions', () => {
    test('should return matching commands', () => {
      const suggestions = getCommandSuggestions('cast');
      expect(suggestions).toContain('cast');
      expect(suggestions).toContain('castsequence');
      expect(suggestions).toContain('castrandom');
    });

    test('should return limited results', () => {
      const suggestions = getCommandSuggestions('t', 5);
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    test('should return empty array for no matches', () => {
      const suggestions = getCommandSuggestions('zzz');
      expect(suggestions).toEqual([]);
    });

    test('should return empty array for empty input', () => {
      const suggestions = getCommandSuggestions('');
      expect(suggestions).toEqual([]);
    });

    test('should be case insensitive', () => {
      const suggestions = getCommandSuggestions('CAST');
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('getCommandDescription', () => {
    test('should return description for known commands', () => {
      expect(getCommandDescription('cast')).toBeTruthy();
      expect(getCommandDescription('target')).toBeTruthy();
      expect(getCommandDescription('petattack')).toBeTruthy();
    });

    test('should return null for unknown commands', () => {
      expect(getCommandDescription('unknowncommand')).toBe(null);
    });

    test('should be case insensitive', () => {
      expect(getCommandDescription('CAST')).toBeTruthy();
      expect(getCommandDescription('Cast')).toBeTruthy();
    });
  });

  describe('Command Arrays', () => {
    test('COMBAT_COMMANDS should contain key commands', () => {
      expect(COMBAT_COMMANDS).toContain('cast');
      expect(COMBAT_COMMANDS).toContain('use');
      expect(COMBAT_COMMANDS).toContain('castsequence');
    });

    test('PET_COMMANDS should contain key commands', () => {
      expect(PET_COMMANDS).toContain('petattack');
      expect(PET_COMMANDS).toContain('petfollow');
      expect(PET_COMMANDS).toContain('petstay');
    });

    test('ALL_COMMANDS should include commands from all categories', () => {
      expect(ALL_COMMANDS).toContain('cast');
      expect(ALL_COMMANDS).toContain('target');
      expect(ALL_COMMANDS).toContain('petattack');
      expect(ALL_COMMANDS).toContain('invite');
      expect(ALL_COMMANDS).toContain('guildinfo');
    });

    test('ALL_COMMANDS should not have duplicates', () => {
      const unique = [...new Set(ALL_COMMANDS)];
      expect(unique.length).toBe(ALL_COMMANDS.length);
    });
  });
});

