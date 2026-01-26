import { Router } from 'express';
import * as AdminController from '../../controllers/admin/admin.js';
import AuthnMiddleware from '../../middlewares/authn.js';

const router = new Router();

// All admin routes require authentication and admin access
const adminMiddleware = [
  AuthnMiddleware.authenticateToken,
  AuthnMiddleware.requireAdmin
];

// ==================== DASHBOARD ====================
router.get('/dashboard/stats', adminMiddleware, AdminController.getDashboardStats);

// ==================== USERS ====================
router.get('/users', adminMiddleware, AdminController.getUsers);
router.get('/users/:userId', adminMiddleware, AdminController.getUserById);
router.put('/users/:userId/access-level', adminMiddleware, AdminController.updateUserAccessLevel);

// ==================== ABILITIES ====================
router.get('/abilities', adminMiddleware, AdminController.getAbilitiesAdmin);
router.put('/abilities/:abilityId/toggle-active', adminMiddleware, AdminController.toggleAbilityActive);

// ==================== VERSIONS ====================
router.get('/versions', adminMiddleware, AdminController.getVersionsAdmin);
router.post('/versions', adminMiddleware, AdminController.createVersion);
router.post('/versions/copy-abilities', adminMiddleware, AdminController.copyAbilitiesFromVersion);
router.delete('/versions/:versionId', adminMiddleware, AdminController.deleteVersion);

// ==================== KEYBINDINGS ====================
router.get('/keybindings', adminMiddleware, AdminController.getKeybindingsAdmin);
router.post('/keybindings/:keybindingId/restore', adminMiddleware, AdminController.restoreKeybinding);
router.delete('/keybindings/:keybindingId/permanent', adminMiddleware, AdminController.permanentDeleteKeybinding);

// ==================== MACROS ====================
router.get('/macros', adminMiddleware, AdminController.getMacrosAdmin);
router.post('/macros/:macroId/restore', adminMiddleware, AdminController.restoreMacro);
router.delete('/macros/:macroId/permanent', adminMiddleware, AdminController.permanentDeleteMacro);

// ==================== SUPPORT TICKETS ====================
router.get('/support-tickets', adminMiddleware, AdminController.getSupportTickets);
router.get('/support-tickets/:ticketId', adminMiddleware, AdminController.getSupportTicketById);
router.post('/support-tickets/:ticketId/comment', adminMiddleware, AdminController.addTicketComment);
router.get('/support-tickets/:ticketId/transitions', adminMiddleware, AdminController.getTicketTransitions);
router.post('/support-tickets/:ticketId/transition', adminMiddleware, AdminController.transitionTicket);

export default router;
