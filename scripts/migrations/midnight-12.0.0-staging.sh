#!/bin/bash

# Midnight (12.0.0) Ability Migration - Staging Environment
# This script copies abilities from The War Within (11.x) to Midnight (12.0.0)
# Removed abilities are excluded, renamed abilities are handled

echo "🌙 Running Midnight ability migration on STAGING..."
echo ""

node --env-file .env.staging src/scripts/seeds/abilities/seedMidnightAbilityChanges.js
