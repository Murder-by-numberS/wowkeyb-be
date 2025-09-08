import { Router } from "express";
import AuthnMiddleware from "../../middlewares/authn.js";
import * as VersionsController from '../../controllers/version/versions.js';

const router = new Router();

// Public routes (no authentication required)
router.get('/', VersionsController.getVersions);
router.get('/latest', VersionsController.getLatestVersion);
router.get('/:version_id', VersionsController.getVersion);

// Protected routes (authentication required)
router.use(AuthnMiddleware.authenticateToken);
router.post('/', VersionsController.createVersion);
router.put('/:version_id', VersionsController.updateVersion);
router.delete('/:version_id', VersionsController.deleteVersion);

export default router;
