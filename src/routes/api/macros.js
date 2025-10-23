import express from 'express';
import {
  createMacro,
  getMacros,
  getMacro,
  updateMacro,
  deleteMacro,
  restoreMacro,
  duplicateMacro,
  getMyMacros,
  getDeletedMacros,
  getPopularMacros,
  getMacrosByTags,
  getMacrosByAbility,
  incrementUsageCount,
  validateMacroText
} from '../../controllers/macro/macros.js';
import {
  validateCreateMacro,
  validateUpdateMacro,
  validateGetMacro,
  validateDeleteMacro,
  validateDuplicateMacro,
  validateGetMacros,
  validateGetMyMacros,
  validateGetPopularMacros,
  validateGetMacrosByTags,
  validateGetMacrosByAbility
} from '../../validators/macro.validator.js';
import AuthnMiddleware from '../../middlewares/authn.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', validateGetMacros, getMacros);
router.get('/popular', validateGetPopularMacros, getPopularMacros);
router.get('/by-tags', validateGetMacrosByTags, getMacrosByTags);
router.get('/by-ability', validateGetMacrosByAbility, getMacrosByAbility);
router.get('/:id', validateGetMacro, getMacro);
router.post('/:id/usage', incrementUsageCount);
router.post('/validate', validateMacroText); // Real-time validation endpoint

// Protected routes (authentication required)
router.post('/', AuthnMiddleware.authenticateToken, validateCreateMacro, createMacro);
router.get('/my/list', AuthnMiddleware.authenticateToken, validateGetMyMacros, getMyMacros);
router.get('/my/deleted', AuthnMiddleware.authenticateToken, validateGetMyMacros, getDeletedMacros);
router.put('/:id', AuthnMiddleware.authenticateToken, validateUpdateMacro, updateMacro);
router.delete('/:id', AuthnMiddleware.authenticateToken, validateDeleteMacro, deleteMacro);
router.post('/:id/restore', AuthnMiddleware.authenticateToken, validateDeleteMacro, restoreMacro);
router.post('/:id/duplicate', AuthnMiddleware.authenticateToken, validateDuplicateMacro, duplicateMacro);

export default router;
