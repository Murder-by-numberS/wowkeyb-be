import { Router } from "express";

import * as AbilityController from '../../controllers/ability/abilities.js';
import { validateGetAbilities } from '../../validators/abilities.js';

const router = new Router();

// Route for latest version (e.g., /abilities/paladin/holy/herald-of-the-sun/latest)
router.get('/:wowClass/:spec/:heroTalent/latest',
  validateGetAbilities,
  AbilityController.getAbilitiesLatest)

// Legacy route with version ID (e.g., /abilities/paladin/holy/herald-of-the-sun/version/64f1234567890abcdef12345)
router.get('/:wowClass/:spec/:heroTalent/version/:versionId',
  validateGetAbilities,
  AbilityController.getAbilitiesByVersion)

// Route with game version in path (e.g., /abilities/paladin/holy/herald-of-the-sun/11.1.0)
router.get('/:wowClass/:spec/:heroTalent/:gameVersion',
  validateGetAbilities,
  AbilityController.getAbilitiesByGameVersion)

export default router;
