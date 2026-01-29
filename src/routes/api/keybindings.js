import { Router } from "express";

import AuthnMiddleware from "../../middlewares/authn.js";

import * as KeybindingsController from '../../controllers/keybindings/keybindings.js';
import { validateGetKeybindings, validateGetKeybinding, validateUpdateKeybinding, validateCreateKeybinding } from '../../validators/keybindings.js'

const router = new Router();

router.get('/home',
  KeybindingsController.getHomeKeybindings)

router.get('/',
  validateGetKeybindings,
  AuthnMiddleware.authenticateToken,
  KeybindingsController.getKeybindings)
router.get('/deleted',
  validateGetKeybindings,
  AuthnMiddleware.authenticateToken,
  KeybindingsController.getDeletedKeybindings)
router.get('/:keybinding_id',
  validateGetKeybinding,
  AuthnMiddleware.decode,
  KeybindingsController.getKeybinding)
router.post('/',
  validateCreateKeybinding,
  AuthnMiddleware.authenticateToken,
  KeybindingsController.createKeybinding)
router.post('/:keybinding_id/duplicate',
  validateGetKeybinding,
  AuthnMiddleware.authenticateToken,
  KeybindingsController.duplicateKeybinding)
router.put('/:keybinding_id',
  validateUpdateKeybinding,
  AuthnMiddleware.authenticateToken,
  KeybindingsController.updateKeybinding)
router.delete('/:keybinding_id',
  validateGetKeybinding,
  AuthnMiddleware.authenticateToken,
  KeybindingsController.deleteKeybinding)
router.use(AuthnMiddleware.authenticateToken)
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
  AuthnMiddleware.authenticateToken,
  KeybindingsController.migrateKeybindingToLatestVersion)
router.post('/:keybinding_id/migrate',
  validateGetKeybinding,
  AuthnMiddleware.authenticateToken,
  KeybindingsController.migrateKeybindingToVersion)
router.get('/:keybinding_id/versions',
  validateGetKeybinding,
  AuthnMiddleware.decode,
  KeybindingsController.getKeybindingVersions)
router.post('/:keybinding_id/copy-to-version',
  validateGetKeybinding,
  AuthnMiddleware.authenticateToken,
  KeybindingsController.copyKeybindingToVersion)

export default router;
