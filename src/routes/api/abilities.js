import { Router } from "express";

import * as AbilityController from '../../controllers/ability/abilities.js';
import { validateGetAbilitiesFlexible, validateUpdateAbility } from '../../validators/abilities.js';
import AuthnMiddleware from '../../middlewares/authn.js';

const router = new Router();

// Flexible endpoint for abilities with query parameters
// GET /abilities?gameVersion=11.1.7&class=Death Knight&spec=Blood&heroTalent=Deathbringer
router.get('/',
    validateGetAbilitiesFlexible,
    AbilityController.getAbilitiesFlexible
);

// Get a single ability by ID
// GET /abilities/:abilityId
router.get('/:abilityId',
    AbilityController.getAbilityById
);

// Update an ability by ID (Admin only)
// PUT /abilities/:abilityId
router.put('/:abilityId',
    AuthnMiddleware.authenticateToken,
    AuthnMiddleware.requireAdmin,
    validateUpdateAbility,
    AbilityController.updateAbility
);

export default router;
