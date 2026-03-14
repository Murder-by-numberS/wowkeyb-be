import { getClassLabel, getSpecLabel, getHeroTalentLabel } from '../utils/class-spec-hero-catalog.js';

const toTitleCase = (str) => {
  if (!str) return str;

  // Special cases for class names
  const specialCases = {
    'demonhunter': 'Demon Hunter',
    'deathknight': 'Death Knight',
  };

  if (specialCases[str]) return specialCases[str];

  const words = str.split('-');
  return words
    .map((word, index) => {
      const lowerWord = word.toLowerCase();
      // Don't capitalize 'of' and 'the' unless they're the first word
      if (index > 0 && (lowerWord === 'of' || lowerWord === 'the')) {
        return lowerWord;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

const mapToData = (keybinding) => ({
  keybindingId: keybinding._id || null,
  name: toTitleCase(keybinding.name) || null,
  userId: keybinding.user_id?._id || keybinding.user_id || null,
  creatorUsername: keybinding.user_id?.username || null,
  class: getClassLabel(keybinding.class) || null,
  spec: getSpecLabel(keybinding.spec) || null,
  heroTalent: getHeroTalentLabel(keybinding.hero_talent) || null,
  version: keybinding.version || null,
  isPublic: keybinding.is_public || false,
  createdAt: keybinding.createdAt || null,
  keybinds: (keybinding.keybinds || []).map(keybind => ({
    key: keybind.key || null,
    spell: {
      description: keybind.spell?.description || null,
      icon: keybind.spell?.icon || null,
      name: keybind.spell?.name || null,
      spellId: keybind.spell?.spell_id || null,
      sourceSpellId: keybind.spell?.source_spell_id || null,
      sourceSpellName: keybind.spell?.source_spell_name || null,
      actionType: keybind.spell?.action_type || null,
      isMacro: keybind.spell?.is_macro || false,
      macroId: keybind.spell?.macro_id || null,
      macroText: keybind.spell?.macro_text || null
    },
    barId: keybind.bar_id || null,
    slotIndex: keybind.slot_index ?? null
  })),
  layout: keybinding.layout ? {
    bars: (keybinding.layout.bars || []).map((bar) => {
      const { slot_keys, ...rest } = bar;
      return {
        ...rest,
        slotKeys: slot_keys || []
      };
    }),
    barMode: keybinding.layout.bar_mode || 'custom',
    screenWidth: keybinding.layout.screen_width ?? 2560,
    screenHeight: keybinding.layout.screen_height ?? 1440,
    barGap: keybinding.layout.bar_gap ?? 16
  } : null
})

export const presentOne = (keybinding) => {
  return {
    ...mapToData(keybinding)
  }
}

export const presentMany = (keybindings) => {
  return keybindings.map(presentOne);
}
