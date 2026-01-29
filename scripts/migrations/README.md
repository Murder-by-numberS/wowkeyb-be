# Database Migrations

This folder contains shell scripts for running database migrations across different environments.

## Midnight (12.0.0) Ability Migration

Migrates abilities from The War Within (11.x) to Midnight (12.0.0).

### What it does:
- Creates version 12.0.0 in the database
- Copies all active abilities from the latest 11.x version to 12.0.0
- **Excludes** abilities that were removed in Midnight (100+ abilities pruned)
- **Renames** abilities that changed names (e.g., Devouring Plague → Shadow Word: Madness)

### Usage:

```bash
# Development
./scripts/migrations/midnight-12.0.0-dev.sh

# Staging
./scripts/migrations/midnight-12.0.0-staging.sh

# Production (includes confirmation prompt)
./scripts/migrations/midnight-12.0.0-prod.sh
```

### Manual Run:

You can also run the script directly with the appropriate env file:

```bash
node --env-file .env.development src/scripts/seeds/abilities/seedMidnightAbilityChanges.js
node --env-file .env.staging src/scripts/seeds/abilities/seedMidnightAbilityChanges.js
node --env-file .env.production src/scripts/seeds/abilities/seedMidnightAbilityChanges.js
```

### Documentation:

See `docs/MIDNIGHT_12.0_ABILITY_CHANGES.md` for the complete list of:
- Removed abilities (by class/spec)
- Renamed abilities
- New abilities to add manually
