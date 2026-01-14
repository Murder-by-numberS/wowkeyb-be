import { Router } from "express";

import AuthRouter from './api/auth.js'
import PingRouter from './api/ping.js'

import AbilitiesRouter from './api/abilities.js'
import AbilityRouter from './api/ability.js'

import UserRouter from './api/user.js'
import ProfileRouter from './api/profile.js'
import KeybindingsRouter from './api/keybindings.js'
import VersionsRouter from './api/versions.js'
import MacrosRouter from './api/macros.js'
import MacroBuilderRouter from './api/macro-builder.js'
import FilesRouter from './api/files.js'
import WagoIconsRouter from './api/wago-icons.js'
import IconsRouter from './api/icons.js'
import SupportRouter from './api/support.js'

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

  //profile (public user profiles)
  .use('/profile', ProfileRouter)

  //keybindings
  .use('/keybindings', KeybindingsRouter)

  //versions
  .use('/versions', VersionsRouter)

  //macros
  .use('/macros', MacrosRouter)

  //macro-builder
  .use('/macro-builder', MacroBuilderRouter)

  //files (upload/download/export files)
  .use('/files', FilesRouter)

  //wago-icons
  .use('/wago-icons', WagoIconsRouter)

  //icons
  .use('/icons', IconsRouter)

  //support
  .use('/support', SupportRouter)

export default router;
