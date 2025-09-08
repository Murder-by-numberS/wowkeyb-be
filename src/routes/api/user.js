import { Router } from "express";

import AuthnMiddleware from "../../middlewares/authn.js";

import * as UserController from '../../controllers/user/users.js';
import { validateGetUser, validateSaveSetting } from '../../validators/users.js'

const router = new Router();
router.use(AuthnMiddleware.authenticateToken)
router.get('/',
  validateGetUser,
  UserController.getUser)
router.put('/setting',
  validateSaveSetting,
  UserController.saveSetting)

export default router;
