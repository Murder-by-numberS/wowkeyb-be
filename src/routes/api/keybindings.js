import { Router } from "express";

import AuthnMiddleware from "../../middlewares/authn.js";

import * as KeybindingsController from '../../controllers/keybindings/keybindings.js';
import { validateGetKeybindings, validateGetKeybinding, validateUpdateKeybinding, validateCreateKeybinding } from '../../validators/keybindings.js'

const router = new Router();

router.get('/home',
  KeybindingsController.getHomeKeybindings)

router.get('/',
  validateGetKeybindings,
  AuthnMiddleware.decode,
  KeybindingsController.getKeybindings)
router.get('/deleted',
  validateGetKeybindings,
  AuthnMiddleware.decode,
  KeybindingsController.getDeletedKeybindings)
router.get('/:keybinding_id',
  validateGetKeybinding,
  AuthnMiddleware.decode,
  KeybindingsController.getKeybinding)
router.post('/',
  validateCreateKeybinding,
  AuthnMiddleware.decode,
  KeybindingsController.createKeybinding)
router.post('/:keybinding_id/duplicate',
  validateGetKeybinding,
  AuthnMiddleware.decode,
  KeybindingsController.duplicateKeybinding)
router.put('/:keybinding_id',
  validateUpdateKeybinding,
  AuthnMiddleware.decode,
  KeybindingsController.updateKeybinding)
router.use(AuthnMiddleware.authenticateToken)
router.delete('/:keybinding_id',
  validateGetKeybinding,
  AuthnMiddleware.decode,
  KeybindingsController.deleteKeybinding)
router.post('/:keybinding_id/restore',
  validateGetKeybinding,
  AuthnMiddleware.decode,
  KeybindingsController.restoreKeybinding)
router.delete('/:keybinding_id/permanent',
  validateGetKeybinding,
  AuthnMiddleware.decode,
  KeybindingsController.permanentlyDeleteKeybinding)
router.post('/:keybinding_id/migrate-to-latest',
  validateGetKeybinding,
  AuthnMiddleware.decode,
  KeybindingsController.migrateKeybindingToLatestVersion)
router.post('/:keybinding_id/migrate',
  validateGetKeybinding,
  AuthnMiddleware.decode,
  KeybindingsController.migrateKeybindingToVersion)

export default router;
