import { check } from 'express-validator'

export const validateAuth = [
  check('email').isEmail(),
  check('password', 'Password must contain 10 characters, 1 lowercase, 1 uppercase, 1 numeric and 1 special character.')
    .optional()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/, 'g'),
];

export const validateRegister = [
  check('username').isLength({ min: 8 }),
  check('email').isEmail(),
  check('password', 'Password must contain 10 characters, 1 lowercase, 1 uppercase, 1 numeric and 1 special character.')
    .optional()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/, 'g'),
];

export const validateConfirm = [
  check('confirmCode').isString()
]

export const validateGetUser = [
  check('id').notEmpty()
]

export const validateNewPassword = [
  check('np', 'Password must contain 10 characters, 1 lowercase, 1 uppercase, 1 numeric and 1 special character.')
    .optional()
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/, 'g'),
];

export const validateChangePassword = [
  check('op', 'Password must contain 10 characters, 1 lowercase, 1 uppercase, 1 numeric and 1 special character.')
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/, 'g'),
  check('np', 'Password must contain 10 characters, 1 lowercase, 1 uppercase, 1 numeric and 1 special character.')
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/, 'g')
];

export const validateSaveSetting = [
  check('theme').isString().optional(),
  check('scheme').isString().optional()
];
