import { Router } from "express";
import * as ProfileController from '../../controllers/user/profile.js';

const router = new Router();

// Public routes - no authentication required
router.get('/:username', ProfileController.getUserProfile);
router.get('/:username/keybindings', ProfileController.getUserKeybindings);
router.get('/:username/macros', ProfileController.getUserMacros);

export default router;

