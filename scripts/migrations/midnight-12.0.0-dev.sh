#!/bin/bash

# Midnight (12.0.0) Ability Migration - Development Environment
# This script copies abilities from The War Within (11.x) to Midnight (12.0.0)
# Removed abilities are excluded, renamed abilities are handled

echo "🌙 Running Midnight ability migration on DEVELOPMENT..."
echo ""

node --env-file .env.development src/scripts/seeds/abilities/seedMidnightAbilityChanges.js
