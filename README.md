# wowkeyb-be

## Soft Delete Functionality

The keybindings model now supports soft delete functionality, which allows keybindings to be "deleted" without actually removing them from the database. This provides the ability to restore keybindings if needed.

### Features

- **Soft Delete**: Keybindings are marked as deleted with a `deleted_at` timestamp instead of being permanently removed
- **Automatic Filtering**: All queries automatically exclude soft-deleted keybindings unless explicitly requested
- **Restore Functionality**: Soft-deleted keybindings can be restored
- **Permanent Delete**: Option to permanently delete keybindings when needed
- **Migration Support**: Scripts to migrate existing data

### API Endpoints

#### Soft Delete a Keybinding
```
DELETE /api/keybindings/:keybinding_id
```
Marks a keybinding as deleted by setting `deleted_at` timestamp.

#### Restore a Soft-Deleted Keybinding
```
POST /api/keybindings/:keybinding_id/restore
```
Restores a soft-deleted keybinding by removing the `deleted_at` timestamp.

#### Permanently Delete a Keybinding
```
DELETE /api/keybindings/:keybinding_id/permanent
```
Permanently removes a keybinding from the database (cannot be restored).

#### Get Soft-Deleted Keybindings
```
GET /api/keybindings/deleted
```
Returns all soft-deleted keybindings for the authenticated user.

### Database Migration

To add the `deleted_at` field to existing keybindings, run the migration script:

```bash
# Development
npm run migrate-soft-delete:dev

# Staging
npm run migrate-soft-delete:staging

# Production
npm run migrate-soft-delete:prod
```

### Model Changes

The `Keybinding` model now includes:
- `deleted_at`: Date field that stores the deletion timestamp (null if not deleted)
- Pre-find middleware that automatically excludes soft-deleted documents from queries

### Usage Notes

- All existing API endpoints automatically exclude soft-deleted keybindings
- Only the owner of a keybinding can delete, restore, or permanently delete it
- Soft-deleted keybindings are not included in public listings or search results
- The `duplicateKeybinding` function only works with non-deleted keybindings

## Version Management

The system now supports game version management for keybindings. Each keybinding is associated with a specific game version.

### Version Migration

#### Migrate All User Keybindings to Latest Version
```
POST /api/keybindings/migrate-to-latest
```
Migrates all keybindings for the authenticated user to the latest available version.

**Response:**
```json
{
  "message": "Keybindings migrated successfully",
  "latestVersion": "11.1.7",
  "migratedCount": 5
}
```

#### Migrate Specific Keybinding to Specific Version
```
POST /api/keybindings/:keybinding_id/migrate
Body: { "version_id": "version_object_id" }
```
Migrates a specific keybinding to a specified version.

**Response:**
```json
{
  "message": "Keybinding migrated successfully",
  "keybinding": { /* keybinding data */ },
  "targetVersion": "11.1.7"
}
```

### Creating New Versions

To create a new game version (e.g., 11.1.7):

```bash
# Development
npm run create-version-117:dev

# Staging
npm run create-version-117:staging

# Production
npm run create-version-117:prod
```

### Version API Endpoints

#### Get All Versions
```
GET /api/versions
```

#### Get Latest Version
```
GET /api/versions/latest
```

#### Get Specific Version
```
GET /api/versions/:version_id
```

#### Create New Version (Admin)
```
POST /api/versions
Body: { "game_version": "11.1.7" }
```

#### Update Version (Admin)
```
PUT /api/versions/:version_id
Body: { "game_version": "11.1.8" }
```

#### Delete Version (Admin)
```
DELETE /api/versions/:version_id
```

## Ability Management

The system now supports comprehensive ability management with version tracking. Each ability is associated with a specific game version and class/spec combination.

### Ability Model Features

- **Version Tracking**: All abilities are tied to specific game versions
- **Class & Spec Support**: Abilities can be class-wide or spec-specific
- **Hero Talent Support**: Future support for hero talent abilities
- **Rich Metadata**: Includes cooldowns, ranges, costs, and level requirements
- **Active/Inactive Status**: Abilities can be marked as inactive for deprecated spells

### Ability Types

1. **Class Abilities**: Available to all specializations of a class
2. **Spec Abilities**: Only available to specific specializations
3. **Hero Talent Abilities**: Available based on hero talent choices (future)

### Seeding Abilities

To seed paladin abilities for the current version:

```bash
# Development
npm run seed-paladin-abilities:dev

# Staging
npm run seed-paladin-abilities:staging

# Production
npm run seed-paladin-abilities:prod
```

### Ability Data Structure

```json
{
  "_id": "ability_object_id",
  "name": "Crusader Strike",
  "spell_id": "35395",
  "description": "Strike the target for Physical damage.",
  "icon": "https://wow.zamimg.com/images/wow/icons/large/spell_holy_crusaderstrike.png",
  "class": "paladin",
  "spec": null,
  "hero_talent": null,
  "ability_type": "class",
  "game_version": "version_object_id",
  "is_active": true,
  "level_required": 1,
  "cooldown": 6,
  "range": 5,
  "cost": "None",
  "cost_amount": 0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Key Improvements Over Previous System

1. **Version Control**: Abilities are versioned, allowing for patch-specific changes
2. **Accurate Spell IDs**: Updated to current game spell IDs
3. **Comprehensive Coverage**: Includes all core paladin abilities from the [Warcraft Wiki](https://warcraft.wiki.gg/wiki/Paladin_abilities#Specializations)
4. **Rich Metadata**: Cooldowns, ranges, costs, and level requirements
5. **Scalable Structure**: Ready for other classes and future expansions

### Ability API Endpoints

#### Get Abilities by Game Version (Recommended)
```
GET /api/abilities/:wowClass/:spec/:heroTalent/:gameVersion
```
Returns abilities for the specified class, spec, and hero talent using a specific game version.

**Examples:**
```
GET /api/abilities/paladin/holy/herald-of-the-sun/11.1.0
GET /api/abilities/paladin/holy/herald-of-the-sun/10.2.5
GET /api/abilities/warrior/arms/colossus/11.1.7
```

#### Get Abilities (Latest Version)
```
GET /api/abilities/:wowClass/:spec/:heroTalent/latest
```
Returns abilities for the specified class, spec, and hero talent using the latest game version.

**Example:**
```
GET /api/abilities/paladin/holy/herald-of-the-sun/latest
```

#### Get Abilities by Version ID (Legacy)
```
GET /api/abilities/:wowClass/:spec/:heroTalent/version/:versionId
```
Returns abilities for the specified class, spec, and hero talent using a specific version ID.

**Example:**
```
GET /api/abilities/paladin/holy/herald-of-the-sun/version/685b68b193b0b9e5ee2f2fe8
```

#### Response Format
```json
[
  {
    "id": "ability_object_id",
    "spellId": "35395",
    "name": "Crusader Strike",
    "description": "Strike the target for Physical damage.",
    "icon": "https://wow.zamimg.com/images/wow/icons/large/spell_holy_crusaderstrike.png",
    "class": "paladin",
    "spec": null,
    "heroTalent": null,
    "abilityType": "class",
    "levelRequired": 1,
    "cooldown": 6,
    "range": 5,
    "cost": "None",
    "costAmount": 0,
    "gameVersion": "11.1.0"
  }
]
```

#### URL Parameter Validation

- **wowClass**: Must be a valid class (deathknight, demonhunter, druid, evoker, hunter, mage, monk, paladin, priest, rogue, shaman, warlock, warrior)
- **spec**: Must be a valid spec for the selected class
- **heroTalent**: Must be a valid hero talent for the selected spec
- **gameVersion**: Must be in format `X.Y.Z` (e.g., `11.1.0`, `10.2.5`) or `latest`

**Example Valid URLs:**
```
/api/abilities/paladin/holy/herald-of-the-sun/11.1.0
/api/abilities/warrior/arms/colossus/10.2.5
/api/abilities/mage/fire/frostfire/latest
```

### Key Improvements Over Previous System

1. **Version Control**: Abilities are versioned, allowing for patch-specific changes
2. **Accurate Spell IDs**: Updated to current game spell IDs
3. **Comprehensive Coverage**: Includes all core paladin abilities from the [Warcraft Wiki](https://warcraft.wiki.gg/wiki/Paladin_abilities#Specializations)
4. **Rich Metadata**: Cooldowns, ranges, costs, and level requirements
5. **Scalable Structure**: Ready for other classes and future expansions
6. **Database-Driven**: No longer relies on static data files
7. **Version-Specific Queries**: Can retrieve abilities for any game version
