#!/usr/bin/env node

/**
 * Demo script showcasing the Macro Command Validation System
 * Run: node src/utils/demo-macro-validation.js
 */

import {
  validateMacroCommands,
  validateMacroForClass,
  generateMacroTags,
  extractMacroCommands,
  generateValidationReport
} from './macro-commands.examples.js';

console.log('═══════════════════════════════════════════════════════');
console.log('   WoW Macro Command Validation System - Demo');
console.log('═══════════════════════════════════════════════════════\n');

// Example 1: Valid Macro
console.log('📋 Example 1: Valid Macro');
console.log('─────────────────────────────────────────────────────\n');

const validMacro = `#showtooltip Fireball
/cast Fireball
/startattack`;

console.log('Macro:');
console.log(validMacro);
console.log('\nValidation Results:');
const valid1 = validateMacroCommands(validMacro);
console.log('✅ Errors:', valid1.errors.length);
console.log('⚠️  Warnings:', valid1.warnings.length);
console.log('🏷️  Auto-generated tags:', generateMacroTags(validMacro).join(', '));
console.log('\n');

// Example 2: Macro with Errors
console.log('📋 Example 2: Macro with Command Errors');
console.log('─────────────────────────────────────────────────────\n');

const invalidMacro = `#showwtooltip
/csat Fireball
/targetenemy
/usetalents`;

console.log('Macro:');
console.log(invalidMacro);
console.log('\nValidation Results:');
const valid2 = validateMacroCommands(invalidMacro);
console.log('❌ Errors:', valid2.errors.length);
if (valid2.errors.length > 0) {
  valid2.errors.forEach(err => {
    console.log(`   Line ${err.line}: ${err.message}`);
    if (err.suggestions && err.suggestions.length > 0) {
      console.log(`   💡 Suggestions: ${err.suggestions.join(', ')}`);
    }
  });
}
console.log('⚠️  Warnings:', valid2.warnings.length);
if (valid2.warnings.length > 0) {
  valid2.warnings.forEach(warn => {
    console.log(`   Line ${warn.line}: ${warn.message}`);
  });
}
console.log('\n');

// Example 3: Class-Specific Validation
console.log('📋 Example 3: Class-Specific Validation');
console.log('─────────────────────────────────────────────────────\n');

const petMacro = `/petattack
/cast Fireball
/petfollow`;

console.log('Macro:');
console.log(petMacro);
console.log('\nValidating for Warrior (no pet):');
const classWarnings = validateMacroForClass(petMacro, 'warrior');
console.log('⚠️  Warnings:', classWarnings.length);
classWarnings.forEach(warn => {
  console.log(`   Line ${warn.line}: ${warn.message}`);
});

console.log('\nValidating for Hunter (has pet):');
const hunterWarnings = validateMacroForClass(petMacro, 'hunter');
console.log('✅ Warnings:', hunterWarnings.length, '(Pet commands are valid for hunter)');
console.log('\n');

// Example 4: Command Extraction
console.log('📋 Example 4: Command Extraction & Analysis');
console.log('─────────────────────────────────────────────────────\n');

const complexMacro = `#showtooltip
/castsequence reset=target Immolate, Conflagrate, Incinerate
/petattack
/startattack`;

console.log('Macro:');
console.log(complexMacro);
console.log('\nExtracted Commands:');
const extracted = extractMacroCommands(complexMacro);
console.log(`   Metacommands: ${extracted.metacommands.length}`);
extracted.metacommands.forEach(cmd => {
  console.log(`      #${cmd.command} ${cmd.args}`);
});
console.log(`   Slash Commands: ${extracted.slashCommands.length}`);
extracted.slashCommands.forEach(cmd => {
  console.log(`      /${cmd.command} (${cmd.category}) ${cmd.args}`);
});
console.log(`   Invalid: ${extracted.invalid.length}`);
console.log('\n🏷️  Auto-generated tags:', generateMacroTags(complexMacro).join(', '));
console.log('\n');

// Example 5: Comprehensive Report
console.log('📋 Example 5: Comprehensive Validation Report');
console.log('─────────────────────────────────────────────────────\n');

const report = generateValidationReport(validMacro, 'mage');
console.log('Report for valid macro:');
console.log(`   Valid: ${report.isValid ? '✅ Yes' : '❌ No'}`);
console.log(`   Total Lines: ${report.summary.totalLines}`);
console.log(`   Commands: ${report.summary.commandCount}`);
console.log(`   Metacommands: ${report.summary.metacommandCount}`);
console.log(`   Errors: ${report.summary.errorCount}`);
console.log(`   Warnings: ${report.summary.warningCount}`);
console.log(`   Suggested Tags: ${report.suggestedTags.join(', ')}`);

console.log('\n═══════════════════════════════════════════════════════');
console.log('   Phase 1 Command Reference: Complete! ✅');
console.log('═══════════════════════════════════════════════════════\n');

console.log('Next Steps:');
console.log('  • Phase 2: Integrate validation into API validators');
console.log('  • Phase 3: Add command parsing to controllers');
console.log('  • Phase 4: Implement enhanced features (auto-tagging, etc.)');
console.log('\nSee docs/MACRO_COMMANDS.md for full documentation.\n');

