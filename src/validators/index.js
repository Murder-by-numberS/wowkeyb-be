import { validationResult } from 'express-validator';

import * as UserValidators from './users';
import * as AbilityValidators from './abilities';

const validationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(422).json(validationErrors);
  }

  next();
};

export {
  AbilityValidators,
  UserValidators,
  validationErrors
};
