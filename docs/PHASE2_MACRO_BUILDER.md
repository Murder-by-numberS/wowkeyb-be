# Phase 2: Intelligent Macro Builder & Validation

## Overview

Phase 2 adds **intelligent macro generation and real-time validation** to help users create better macros. The system can:
- Generate macros from templates (mouseover, focus, arena, etc.)
- Detect ability types and suggest appropriate conditionals
- Validate macros in real-time as users type
- Auto-generate tags based on macro content
- Provide quality scores and suggestions

## New API Endpoints

### Macro Builder Endpoints (`/api/macro-builder`)

#### 1. GET `/api/macro-builder/templates`
Get all available macro templates.

**Response:**
```json
{
  "message": "Macro templates retrieved successfully",
  "templates": [
    {
      "type": "mouseover",
      "name": "Mouseover",
      "description": "Cast spell on mouseover target without losing current target",
      "useCase": "Quick targeting for heals, damage, or utility spells",
      "icon": "🖱️"
    },
    {
      "type": "focus",
      "name": "Focus Target",
      "description": "Cast spell on focus target while maintaining main target",
      "useCase": "Multi-target scenarios, keeping CC on one target while DPSing another",
      "icon": "🎯"
    }
    // ... more templates
  ]
}
```

#### 2. POST `/api/macro-builder/generate`
Generate a macro based on user preferences.

**Request Body:**
```json
{
  "spell_name": "Fireball",
  "template_type": "mouseover",
  "ability_id": "60a1234567890abcdef12345", // Optional
  "ability_type": "damage", // Optional: heal, damage, buff, debuff, etc.
  "wow_class": "mage", // Optional
  "custom_options": { // Optional
    "includeTooltip": true,
    "fallbackToPlayer": false
  }
}
```

**Response:**
```json
{
  "message": "Macro generated successfully",
  "macro_text": "#showtooltip Fireball\n/cast [@mouseover,harm,nodead][] Fireball",
  "suggested_tags": ["mouseover", "targeting", "damage"],
  "explanation": "Mouseover macro for Fireball. Casts on mouseover target, falls back to current target.",
  "ability_type": "damage",
  "suggestions": {
    "conditionals": ["mouseover,harm,nodead", "target,harm,nodead", "focus,harm,nodead"],
    "explanation": "Damage spells should target hostile units...",
    "examples": [
      {
        "type": "Mouseover with target fallback",
        "macro": "[@mouseover,harm,nodead][]"
      }
    ]
  }
}
```

#### 3. GET `/api/macro-builder/suggestions`
Get conditional suggestions based on ability type.

**Query Parameters:**
- `ability_type` - Type of ability (heal, damage, buff, etc.)
- `ability_id` - Ability ID (will auto-detect type)
- `wow_class` - WoW class (optional)

**Response:**
```json
{
  "message": "Conditional suggestions retrieved successfully",
  "ability_type": "heal",
  "suggestions": {
    "conditionals": ["mouseover,help,nodead", "target,help,nodead", "player"],
    "explanation": "Healing spells should target friendly units that are alive...",
    "examples": [
      {
        "type": "Mouseover with self-cast fallback",
        "macro": "[@mouseover,help,nodead][@player]"
      },
      {
        "type": "Mouseover with target fallback",
        "macro": "[@mouseover,help,nodead][]"
      }
    ]
  }
}
```

#### 4. GET `/api/macro-builder/detect-type`
Detect ability type from name/description.

**Query Parameters:**
- `spell_name` - Name of the spell
- `description` - Description (optional)
- `ability_id` - Ability ID (optional)

**Response:**
```json
{
  "message": "Ability type detected successfully",
  "spell_name": "Flash Heal",
  "ability_type": "heal",
  "suggestions": {
    // ... suggestions for heal type
  }
}
```

### Enhanced Macro Endpoints (`/api/macros`)

#### 5. POST `/api/macros/validate`
Real-time validation for macro editor (public endpoint).

**Request Body:**
```json
{
  "macro_text": "#showtooltip\n/cast Fireball",
  "class": "mage" // Optional
}
```

**Response:**
```json
{
  "message": "Macro validated successfully",
  "validation": {
    "errors": [],
    "warnings": [],
    "quality": {
      "total": 90,
      "grade": "A",
      "issues": [],
      "suggestions": ["Consider adding #showtooltip for better action bar integration"]
    },
    "is_valid": true
  },
  "suggested_tags": ["combat"]
}
```

#### 6. Enhanced POST `/api/macros`
Create macro now includes validation info and auto-tagging.

**Response (Enhanced):**
```json
{
  "message": "Macro created successfully",
  "macro": {
    // ... existing macro fields
  },
  "validation": {
    "errors": [],
    "warnings": [],
    "quality": {
      "total": 100,
      "grade": "A",
      "issues": [],
      "suggestions": []
    },
    "is_valid": true
  }
}
```

## Macro Templates

### 1. Mouseover Template
**Use Case:** Cast spells on mouseover target without losing current target

**Generated for Healing Spell:**
```
#showtooltip Flash Heal
/cast [@mouseover,help,nodead][@player] Flash Heal
```

**Generated for Damage Spell:**
```
#showtooltip Fireball
/cast [@mouseover,harm,nodead][] Fireball
```

### 2. Focus Template
**Use Case:** Cast on focus target while maintaining main target

**Generated:**
```
#showtooltip Polymorph
/cast [@focus,exists,nodead][] Polymorph
```

**With Modifier:**
```
#showtooltip Polymorph
/cast [mod:shift,@focus,exists,nodead][] Polymorph
```

### 3. Arena 1-2-3 Template
**Use Case:** Quick PvP arena targeting

**Generated:**
```
#showtooltip Polymorph
/cast [mod:shift,@arena1,exists,nodead][mod:ctrl,@arena2,exists,nodead][mod:alt,@arena3,exists,nodead][] Polymorph
```

### 4. Self-Cast Template
**Use Case:** Always cast on yourself

**Generated:**
```
#showtooltip Power Word: Shield
/cast [@player] Power Word: Shield
```

**With Modifier (self-cast with shift, normal cast otherwise):**
```
#showtooltip Power Word: Shield
/cast [mod:shift,@player][] Power Word: Shield
```

### 5. Cast Sequence Template
**Use Case:** Rotation or combo sequences

**Generated:**
```
#showtooltip
/castsequence reset=target Immolate, Conflagrate, Incinerate
/startattack
```

### 6. Modified Keys Template
**Use Case:** Different spells on same button

**Generated:**
```
#showtooltip
/cast [mod:shift] Fireball; [mod:ctrl] Frostbolt; [mod:alt] Arcane Blast; Fire Blast
```

### 7. Stop Cast Template
**Use Case:** Cancel current cast for instant ability

**Generated:**
```
#showtooltip Counterspell
/stopcasting
/cast Counterspell
```

### 8. Pet Assist Template
**Use Case:** Send pet to attack with your attack

**Generated:**
```
#showtooltip
/petattack
/cast Kill Command
/startattack
```

## Ability Types & Smart Conditionals

### Detected Ability Types

1. **Heal** - Healing spells
   - Keywords: heal, restore, health, regenerate, mend, renew
   - Suggested: `[@mouseover,help,nodead][@player]`

2. **Damage** - Damage spells
   - Keywords: damage, strike, blast, bolt, shot, attack
   - Suggested: `[@mouseover,harm,nodead][]`

3. **Buff** - Buff spells
   - Keywords: buff, fortitude, blessing, shield, ward, armor
   - Suggested: `[@mouseover,help][@player]`

4. **Debuff** - Debuff/DoT spells
   - Keywords: curse, corruption, poison, disease, weaken
   - Suggested: `[@mouseover,harm,nodead][]`

5. **Dispel** - Dispel/cleanse spells
   - Keywords: dispel, cleanse, purify, remove, cure
   - Suggested: `[@mouseover,help,nodead][]`

6. **Defensive Cooldown** - Defensive abilities
   - Keywords: barrier, wall, shield wall, ice block
   - Suggested: `[@player]`

7. **Crowd Control** - CC abilities
   - Keywords: polymorph, fear, stun, silence, incapacitate
   - Suggested: `[mod:shift,@focus][]` or arena targeting

8. **Utility** - General utility
   - Default for unknown types

## Frontend Integration Examples

### Example 1: Macro Builder UI

```typescript
// Get available templates
const templates = await fetch('/api/macro-builder/templates');

// User selects template and spell
const result = await fetch('/api/macro-builder/generate', {
  method: 'POST',
  body: JSON.stringify({
    spell_name: 'Flash Heal',
    template_type: 'mouseover',
    wow_class: 'priest'
  })
});

// Use generated macro
const { macro_text, suggested_tags, explanation } = await result.json();
```

### Example 2: Real-Time Validation

```typescript
// In macro editor component
const validateMacro = debounce(async (text: string, wowClass: string) => {
  const response = await fetch('/api/macros/validate', {
    method: 'POST',
    body: JSON.stringify({
      macro_text: text,
      class: wowClass
    })
  });

  const { validation, suggested_tags } = await response.json();

  // Show errors/warnings in UI
  displayValidation(validation);

  // Suggest tags
  suggestTags(suggested_tags);
}, 500);
```

### Example 3: Smart Suggestions

```typescript
// When user enters a spell name
const getSuggestions = async (spellName: string, abilityId: string) => {
  const response = await fetch(
    `/api/macro-builder/suggestions?ability_id=${abilityId}`
  );

  const { suggestions } = await response.json();

  // Show conditional suggestions
  displaySuggestions(suggestions.examples);
};
```

## Features

### ✅ Non-Blocking Validation
- Users can still save macros with errors/warnings
- Validation provides helpful feedback, not restrictions
- Suggestions improve macro quality without forcing changes

### ✅ Auto-Tagging
- Automatically generates tags based on commands used
- Mouseover macros → "mouseover", "targeting"
- Pet commands → "pet"
- Combat commands → "combat", "auto-attack"
- Sequences → "sequence"

### ✅ Quality Scoring
- Grades macros from A-F (0-100 points)
- Deducts points for:
  - Invalid commands (-20 per error)
  - Deprecated commands (-10 per warning)
  - Class-inappropriate commands (-15 per warning)
- Provides improvement suggestions

### ✅ Smart Conditional Generation
- Detects ability type from name/description
- Suggests appropriate conditionals:
  - Heals target friendly units
  - Damage targets enemies
  - Buffs can self-cast
  - CC benefits from focus/arena targeting

### ✅ Template Library
- 8 common macro templates
- Customizable options per template
- Context-aware generation based on ability type

## Benefits

### For Users:
- **Faster Macro Creation** - Templates generate common patterns instantly
- **Better Macros** - Smart conditionals based on ability type
- **Learn WoW Macros** - See examples and understand conditionals
- **Catch Mistakes** - Real-time validation prevents typos
- **Discover Features** - Learn about mouseover, focus, arena targeting

### For System:
- **Better Data Quality** - Auto-tagged and validated macros
- **Improved Search** - Tags enable better filtering
- **User Engagement** - Interactive builder keeps users in-app
- **Community Growth** - High-quality macros improve reputation

## Example User Flows

### Flow 1: Quick Mouseover Macro
1. User clicks "Create Macro" → "Use Template"
2. Selects "Mouseover" template
3. Enters spell name "Flash Heal"
4. System detects it's a heal → suggests `[@mouseover,help,nodead][@player]`
5. User clicks "Generate"
6. Macro is created with auto-tags: ["mouseover", "targeting", "heal"]

### Flow 2: Fix Invalid Macro
1. User types: `/csat Fireball`
2. Real-time validation shows: "Line 1: Invalid command '/csat'"
3. Suggestion: "Did you mean /cast?"
4. User clicks suggestion
5. Macro auto-corrects to: `/cast Fireball`

### Flow 3: Learn About Conditionals
1. User selects spell "Polymorph"
2. Clicks "Get Suggestions"
3. System shows:
   - "This is a crowd control ability"
   - "Suggested: Focus target with modifier"
   - Example: `[mod:shift,@focus,exists,nodead][]`
4. User learns about focus targeting

## API Response Examples

### Example: Healing Spell Generation
```json
POST /api/macro-builder/generate
{
  "spell_name": "Rejuvenation",
  "template_type": "mouseover",
  "wow_class": "druid"
}

Response:
{
  "macro_text": "#showtooltip Rejuvenation\n/cast [@mouseover,help,nodead][@player] Rejuvenation",
  "suggested_tags": ["mouseover", "targeting", "heal"],
  "explanation": "Mouseover macro for Rejuvenation. Casts on mouseover friendly target, falls back to self-cast.",
  "ability_type": "heal",
  "suggestions": {
    "conditionals": ["mouseover,help,nodead", "target,help,nodead", "player"],
    "explanation": "Healing spells should target friendly units that are alive. Mouseover is ideal for quick targeting.",
    "examples": [
      {
        "type": "Mouseover with self-cast fallback",
        "macro": "[@mouseover,help,nodead][@player]"
      },
      {
        "type": "Mouseover with target fallback",
        "macro": "[@mouseover,help,nodead][]"
      }
    ]
  }
}
```

### Example: Validation with Errors
```json
POST /api/macros/validate
{
  "macro_text": "#showwtooltip\n/csat Fireball",
  "class": "mage"
}

Response:
{
  "validation": {
    "errors": [
      {
        "line": 1,
        "command": "showwtooltip",
        "message": "Invalid metacommand '#showwtooltip'",
        "suggestions": ["show", "showtooltip"]
      },
      {
        "line": 2,
        "command": "csat",
        "message": "Invalid command '/csat'",
        "suggestions": null
      }
    ],
    "warnings": [],
    "quality": {
      "total": 60,
      "grade": "D",
      "issues": [
        {
          "severity": "error",
          "count": 2,
          "message": "2 invalid command(s) found"
        }
      ]
    },
    "is_valid": false
  },
  "suggested_tags": ["combat"]
}
```

## Testing

Test the macro builder:
```bash
# Get templates
curl http://localhost:3000/api/macro-builder/templates

# Generate a mouseover heal macro
curl -X POST http://localhost:3000/api/macro-builder/generate \
  -H "Content-Type: application/json" \
  -d '{"spell_name": "Flash Heal", "template_type": "mouseover"}'

# Validate a macro
curl -X POST http://localhost:3000/api/macros/validate \
  -H "Content-Type: application/json" \
  -d '{"macro_text": "#showtooltip\\n/cast Fireball"}'
```

## Files Added/Modified

### New Files:
- `src/utils/macro-builder.js` - Macro generation and templating system
- `src/controllers/macro/macro-builder.js` - API controllers for macro builder
- `src/routes/api/macro-builder.js` - Routes for macro builder endpoints
- `docs/PHASE2_MACRO_BUILDER.md` - This documentation

### Modified Files:
- `src/controllers/macro/macros.js` - Added validation, auto-tagging, validateMacroText
- `src/routes/api/macros.js` - Added /validate endpoint
- `src/routes/api.js` - Registered macro-builder routes

## Next Steps: Phase 3

Potential Phase 3 enhancements:
1. **Macro Analytics** - Track popular templates and commands
2. **Community Templates** - Users can share custom templates
3. **Visual Macro Builder** - Drag-drop conditional builder
4. **Macro Testing** - Simulate macro execution
5. **Import/Export** - Import from WoW, export to addon format

---

**Status**: ✅ Phase 2 Complete - Ready for Frontend Integration

