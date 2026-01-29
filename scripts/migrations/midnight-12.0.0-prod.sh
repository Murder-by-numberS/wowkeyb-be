#!/bin/bash

# Midnight (12.0.0) Ability Migration - Production Environment
# This script copies abilities from The War Within (11.x) to Midnight (12.0.0)
# Removed abilities are excluded, renamed abilities are handled

echo "⚠️  WARNING: You are about to run the Midnight ability migration on PRODUCTION!"
echo ""
read -p "Are you sure you want to continue? (y/N): " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "🌙 Running Midnight ability migration on PRODUCTION..."
echo ""

node --env-file .env.production src/scripts/seeds/abilities/seedMidnightAbilityChanges.js
