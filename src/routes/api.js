import { Router } from "express";

import AuthRouter from './api/auth.js'
import PingRouter from './api/ping.js'

import AbilitiesRouter from './api/abilities.js'
import AbilityRouter from './api/ability.js'

import UserRouter from './api/user.js'
import KeybindingsRouter from './api/keybindings.js'
import VersionsRouter from './api/versions.js'

import AuthnMiddleware from '../middlewares/authn.js';

const router = new Router();
// https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg
//auth
router
  .use('/auth', AuthRouter)
  .use('/abilities', AbilitiesRouter)
  .use('/abilities', AbilityRouter)

  .use(PingRouter)

  //user
  .use('/user', UserRouter)

  //keybindings
  .use('/keybindings', KeybindingsRouter)

  //versions
  .use('/versions', VersionsRouter)

export default router;
