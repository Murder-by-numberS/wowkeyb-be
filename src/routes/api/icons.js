import { Router } from 'express';
import * as IconController from '../../controllers/icon/icons.js';

const router = new Router();

/**
 * GET /api/icons/test
 * Test endpoint to check if icons exist in database
 */
router.get('/test', IconController.testIcons);

/**
 * GET /api/icons
 * Get all icons with pagination and filtering
 */
router.get('/', IconController.getIcons);

/**
 * GET /api/icons/search
 * Search icons using model's search method
 */
router.get('/search', IconController.searchIcons);

/**
 * GET /api/icons/popular
 * Get popular icons using model's method
 */
router.get('/popular', IconController.getPopularIcons);

/**
 * GET /api/icons/filename/:filename
 * Get icon by original filename
 */
router.get('/filename/:filename', IconController.getIconByFilename);

/**
 * GET /api/icons/:id
 * Get a specific icon by ID
 */
router.get('/:id', IconController.getIconById);

/**
 * POST /api/icons/:id/usage
 * Increment usage count for an icon
 */
router.post('/:id/usage', IconController.incrementIconUsage);

/**
 * GET /api/icons/validate/:iconId
 * Validate and find working URLs for a specific icon ID
 */
router.get('/validate/:iconId', IconController.validateIcon);

/**
 * POST /api/icons/validate-url
 * Validate a specific icon URL
 */
router.post('/validate-url', IconController.validateIconUrl);

export default router;
