import { Router } from "express";

import * as AbilityController from '../../controllers/ability/abilities.js';
import { validateGetAbilitiesFlexible } from '../../validators/abilities.js';

const router = new Router();

// Flexible endpoint for abilities with query parameters
// GET /abilities?gameVersion=11.1.7&class=Death Knight&spec=Blood&heroTalent=Deathbringer
router.get('/',
    validateGetAbilitiesFlexible,
    AbilityController.getAbilitiesFlexible
);

export default router;
