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
  userId: keybinding.user_id || null,
  class: toTitleCase(keybinding.class) || null,
  spec: toTitleCase(keybinding.spec) || null,
  heroTalent: toTitleCase(keybinding.hero_talent) || null,
  version: keybinding.populated('version') ? keybinding.version : keybinding.version || null,
  isPublic: keybinding.is_public || false,
  createdAt: keybinding.createdAt || null,
  keybinds: (keybinding.keybinds || []).map(keybind => ({
    key: keybind.key || null,
    spell: {
      key: keybind.spell.key || null,
      description: keybind.spell.description || null,
      icon: keybind.spell.icon || null,
      name: keybind.spell.name || null,
      spellId: keybind.spell.spell_id || null
    }
  }))
})

export const presentOne = (keybinding) => {
  return {
    ...mapToData(keybinding)
  }
}

export const presentMany = (keybindings) => {
  return keybindings.map(presentOne);
}
