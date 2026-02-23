import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

import Config from '../../config/config.js';
import Logger from "../../utils/logger.js";
import { generateCode, saltRounds } from "../../utils/util.js"
//email
import { sendEmailWithTemplate } from '../email/email.js';
import { USER_EMAIL_TEMPLATE_NAMES } from '../email/emails/user.js';

import { User, UserSetting, Token, Keybinding } from '../../models/index.js'

import { presentMany } from '../../presenters/keybindings.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const login = async (req, res) => {
  Logger.verbose('Inside Login');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    Logger.error(`We have Errors: ${JSON.stringify(errors.array(), null, 2)}`)
    return res.status(422).json({ error: errors.array() });
  }
  const { email, password } = req.body;
  Logger.info(`User trying to login... email: ${email}`);
  try {
    const query = {
      email: email.toLowerCase()
    }

    const user = await User.findOne(query);

    if (!user) {
      Logger.error('User Not Found');
      return res
        .status(400)
        .json({ code: "USER004", message: "Error Logging In User" });
    }

    if (!user.confirmed) {
      Logger.error('User Not Confirmed');
      return res
        .status(400)
        .json({ code: "USER005", message: "User Not Confirmed" });
    }

    // Handle both old and new field names for backward compatibility
    const encryptedPassword = user.encrypted_password || user.encryptedPassword;

    if (!encryptedPassword) {
      Logger.error('No password found for user');
      return res
        .status(400)
        .json({ code: "USER004", message: "Error Logging In User" });
    }

    // Auto-migrate old field names to new ones if needed
    const needsMigration = user.encryptedPassword && !user.encrypted_password;
    if (needsMigration) {
      Logger.info(`Auto-migrating user ${user._id} from old field names to new ones`);
      const migrationFields = {};

      if (user.encryptedPassword) migrationFields.encrypted_password = user.encryptedPassword;
      if (user.passwordChangedAt) migrationFields.password_changed_at = user.passwordChangedAt;
      if (user.accessLevel) migrationFields.access_level = user.accessLevel;
      if (user.confirmCode) migrationFields.confirm_code = user.confirmCode;
      if (user.resetCode) migrationFields.reset_code = user.resetCode;
      if (user.resetPassword !== undefined) migrationFields.reset_password = user.resetPassword;
      if (user.resetTime) migrationFields.reset_time = user.resetTime;

      await User.updateOne({ _id: user._id }, migrationFields);
      Logger.info(`Auto-migration completed for user ${user._id}`);
    }

    const valid = await bcrypt.compare(password, encryptedPassword);

    if (!valid) {
      Logger.error('Invalid Password');
      return res
        .status(400)
        .json({ code: "USER004", message: "Error Logging In User" }); // don't reveal wrong password
    }

    let userSettings = await UserSetting.findOne({ user_id: user._id });

    if (!userSettings) {
      //create settings
      let defaultSettings = {
        scheme: "light",
        user_id: user._id,
      };

      userSettings = await UserSetting.create(defaultSettings);

    }

    Logger.verbose(`Logging in user ${email} with access_level ${user.access_level}`);

    const token = jwt.sign(
      {
        accessLevel: user.access_level,
        user_id: user._id
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION });
    console.log('token', token);
    //store token in db
    await Token.create({ user_id: user._id, token, token_type: 'verification' });

    //get keybindings
    const keybindings = await Keybinding.find({ user_id: user._id }).populate('version');

    // Convert snake_case to camelCase for frontend
    const userResponse = {
      _id: user._id,
      email: user.email,
      username: user.username,
      confirmed: user.confirmed,
      description: user.description,
      favoriteClass: user.favorite_class,
      access_level: user.access_level,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    //return with user model, token and user settings
    const payload = {
      user: userResponse,
      token,
      userSettings,
      keybindings: presentMany(keybindings)
    }

    return res.status(200).send(payload);
  } catch (e) {
    console.log(e);
    Logger.error(`Error Logging In User with email - ${email}`)
    return res
      .status(500)
      .json({ code: "USER004", message: "Error Logging In User" });
  }
}

export const register = async (req, res) => {
  Logger.verbose('Inside Register');

  const {
    username,
    email,
    password
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }

  try {
    let users = await User.find({ email: email.toLowerCase() });

    if (users.length > 0) {
      Logger.error("Duplicate Email");
      return res
        .status(400)
        .json({ code: "USER001", message: "Duplicate User" });

    }

    users = await User.find({ username: username.toLowerCase() });

    if (users.length > 0) {
      Logger.error("Duplicate Username");
      return res
        .status(400)
        .json({ code: "USER001", message: "Duplicate User" });

    }
    console.log('about to hash')
    //hash the password
    const passwordSalt = await bcrypt.genSalt(saltRounds);
    const encrypted_password = await bcrypt.hash(password, passwordSalt);
    const confirm_code = generateCode();
    // store the emails and usernames all lowercase
    const newUser = {
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      encrypted_password,
      confirm_code
    };

    Logger.verbose(`Creating User with email: ${email} and username: ${username}`)
    //create new user
    const createdUser = await User.create(newUser);
    if (!createdUser) {
      Logger.error(`Error Registering user with email - ${email}`)
      return res
        .status(500)
        .json({ code: "USER002", message: "Error Creating User" });
    }

    const data = {
      email: createdUser.email,
      link: `${Config.feURL}/confirmation?confirmCode=${confirm_code}`,
    };

    const to = createdUser.email;

    sendEmailWithTemplate(USER_EMAIL_TEMPLATE_NAMES.registerUser, to, data);

    console.log('after sent email')
    let message = 'User created';
    return res.status(200).send({ message });
  } catch (e) {
    Logger.error(`Error Registering user with email - ${email}`)
    return res
      .status(500)
      .json({ code: "USER002", message: "Error Creating User" });
  }
}

export const confirmUser = async (req, res) => {
  try {
    Logger.verbose('Inside Confirm User');
    console.log('req.body', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() });
    }

    const { confirmCode } = req.body;
    const user = await User.find({ confirm_code: confirmCode })

    if (!user || user.length != 1) {
      Logger.error('User Not Found');
      return res
        .status(400)
        .json({ code: "USER003", message: "Error Confirming User" });
    }

    if (user[0].confirmed === true) {
      Logger.error('User is already confirmed');
      return res
        .status(400)
        .json({ code: "USER010", message: "Invalid Confirm Code" });
    }

    const updatedUser = await User.updateOne({ _id: user[0]._id }, { confirmed: true });

    if (!updatedUser) {
      Logger.error(`Error Updating User ${user.email}`);
      return res
        .status(400)
        .json({ code: "USER003", message: "Error Confirming User" });
    }

    let message = 'Account Confirmed';
    return res.status(200).send({ message });
  } catch (e) {
    Logger.error('Error Confirming User');
    return res
      .status(500)
      .json({ code: "USER003", message: "Error Confirming User" });
  }
}
//TODO:
//refreshAccessToken
export const refreshAccessToken = async (req, res) => {
  Logger.info('Inside - refreshAccessToken');

  try {
    // Get the access token
    const { accessToken } = req.body;

    const verifiedToken = jwt.verify(accessToken, process.env.TOKEN_SECRET);

    if (!verifiedToken) {
      Logger.error('Invalid Token');
      return res.status(401).json({ err: "Invalid Token!" });
    }

    const { user_id } = verifiedToken;

    //find the user
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      Logger.error(`Could not find user ${user_id}`);
      return res.status(401).json({ err: "Invalid Token!" });
    }

    let settingsQuery = {
      user_id: user._id,
    };

    //find the settings
    let userSettings = await UserSetting.findOne(settingsQuery);

    if (!userSettings) {
      //create settings

      let defaultSettings = {
        scheme: "light",
        user_id: user._id,
      };
      // If user logged in successfully we return user, token, and settings as response
      userSettings = await UserSetting.create(defaultSettings);
    }

    const token = jwt.sign(
      {
        accessLevel: user.access_level,
        user_id: user._id
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION });

    //store token in db
    await Token.create({ user_id: user._id, token, token_type: 'verification' });

    Logger.info('Refreshed Token Successfully');

    //get keybindings
    const keybindings = await Keybinding.find({ user_id: user._id }).populate('version');

    // Convert snake_case to camelCase for frontend
    const userResponse = {
      _id: user._id,
      email: user.email,
      username: user.username,
      confirmed: user.confirmed,
      description: user.description,
      favoriteClass: user.favorite_class,
      access_level: user.access_level,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    //return with user model, token and user settings
    const payload = {
      user: userResponse,
      token,
      userSettings,
      keybindings: presentMany(keybindings)
    }

    return res.status(200).send(payload);
  } catch (e) {
    Logger.error('Error Refreshing Token')
    return res
      .status(500)
      .json({ code: "TOK002", message: "Error Refreshing Token" });
  }
}

//forgotPassword
export const forgotPassword = async (req, res) => {

  const { email } = req.body;

  Logger.info(`User forgot password... email: ${email}`);

  try {

    //generate code
    //find user check
    let emailFound = await User.find({ email });

    //Don't tell them an email doesn't exist
    if (!emailFound || emailFound.length < 1) {
      Logger.info("EMAIL001 - Email not found.");
      let message = `forgot password ${email}`;
      return res.status(200).json(message);
    }

    Logger.debug("email is found");
    // debug
    Logger.debug(`user id  ${emailFound[0]._id}`);
    Logger.debug(`emailFound array: ${emailFound}`);

    let user = emailFound[0];
    Logger.verbose(`user: ${user}`);

    let newCode = generateCode();
    Logger.info(`newCode ${newCode}`);
    //get date
    const now = new Date();

    //can remove
    Logger.info(`date: ${now}`);

    let updatedUser = await User.updateOne(
      { _id: user._id },
      {
        reset_code: newCode,
        reset_password: true,
        reset_time: now,
      }
    );

    Logger.verbose(`user updated ${updatedUser}`);

    Logger.verbose(`user.email = ${user.email}`);
    Logger.verbose(`user.username =  ${user.username}`);
    Logger.verbose(`user.reset_code = ${newCode}`);

    let resetLink = `${Config.feURL}/reset-password?rc=${newCode}`;
    Logger.info(`resetLink = ${resetLink}`);
    const data = {
      email: user.email,
      resetLink
    };
    console.log('data', data);

    const to = user.email;

    sendEmailWithTemplate(USER_EMAIL_TEMPLATE_NAMES.resetPassword, to, data);

    let message = `forgot password ${email}`;

    return res.status(200).json(message);
  }
  catch (e) {
    Logger.error('Error Processing Forgot Password')
    return res
      .status(500)
      .json({ code: "TOK002", message: "Error Processing Forgot Password" });
  }
};

export const setNewPassword = async (req, res) => {

  console.log('inside setNewPassword');

  const errors = validationResult(req);
  console.log('errors', errors.array());
  if (!errors.isEmpty()) {
    Logger.error(`We have Errors: ${JSON.stringify(errors.array(), null, 2)}`)
    return res.status(422).json({ error: errors.array() });
  }

  try {
    const newPassword = req.body.np;
    const resetCode = req.body.rc; // reset code

    console.log('req.body', req.body);

    const users = await User.find({ reset_code: resetCode });

    if (!users || users.length === 0) {
      Logger.error('User Not Found');
      return res
        .status(400)
        .json({ code: "USER006", message: "Error Resetting User Password" });
    }

    if (users.length > 1) {
      Logger.error('Duplicate Reset Codes');
      //uh oh
      return res
        .status(400)
        .json({ code: "USER009", message: "Duplicate Reset Code" });
    }
    const user = users[0]; //should be first

    if (user.reset_password === false) {
      return res
        .status(400)
        .json({ code: "USER011", message: "Reset Code Already Used" });
    }

    Logger.info(`Setting new password for user ${user._id}`);

    const now = new Date();
    const TWENTYFOUR_HOURS = 60 * 60 * 1000 * 24;

    if (!(now - user.reset_time < TWENTYFOUR_HOURS)) {
      Logger.error('Reset Time is Invalid');
      return res
        .status(400)
        .json({ code: "USER0008", message: "Reset Code has expired." });
    }

    //hash the password
    const passwordSalt = await bcrypt.genSalt(saltRounds);
    const encrypted_password = await bcrypt.hash(newPassword, passwordSalt);

    await User.updateOne({ _id: user._id }, {
      encrypted_password,
      reset_password: false,
      password_changed_at: new Date()
    });

    Logger.info('Reset Password Successful');

    //send email
    const data = {
      email: user.email,
    };
    console.log('data', data);

    const to = user.email;

    sendEmailWithTemplate(USER_EMAIL_TEMPLATE_NAMES.resetPasswordConfirm, to, data);

    return res
      .status(200)
      .json({ reset: true, message: "Reset Successful" });

  } catch (e) {
    Logger.error('Error Creating New Password')
    return res
      .status(500)
      .json({ code: "USER007", message: "Error Creating New Password" });
  }

}

export const googleSignIn = async (req, res) => {
  Logger.verbose('Inside Google Sign-In');

  try {
    const { credential } = req.body;

    if (!credential) {
      return res
        .status(400)
        .json({ code: "GOOGLE001", message: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, email_verified } = payload;

    if (!email_verified) {
      return res
        .status(400)
        .json({ code: "GOOGLE002", message: "Google email not verified" });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      if (!user.google_id) {
        user.google_id = googleId;
        user.auth_provider = user.encrypted_password ? user.auth_provider : 'google';
        user.confirmed = true;
        await user.save();
        Logger.info(`Linked Google account to existing user ${user._id}`);
      }
    } else {
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');

      let uniqueUsername = username;
      let suffix = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${username}_${suffix}`;
        suffix++;
      }

      user = await User.create({
        email: email.toLowerCase(),
        username: uniqueUsername,
        google_id: googleId,
        auth_provider: 'google',
        confirmed: true,
      });

      Logger.info(`Created new Google user ${user._id} with username ${uniqueUsername}`);
    }

    let userSettings = await UserSetting.findOne({ user_id: user._id });

    if (!userSettings) {
      userSettings = await UserSetting.create({
        scheme: "light",
        user_id: user._id,
      });
    }

    const token = jwt.sign(
      {
        accessLevel: user.access_level,
        user_id: user._id
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION }
    );

    await Token.create({ user_id: user._id, token, token_type: 'verification' });

    const keybindings = await Keybinding.find({ user_id: user._id }).populate('version');

    const userResponse = {
      _id: user._id,
      email: user.email,
      username: user.username,
      confirmed: user.confirmed,
      description: user.description,
      favoriteClass: user.favorite_class,
      access_level: user.access_level,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    const responsePayload = {
      user: userResponse,
      token,
      userSettings,
      keybindings: presentMany(keybindings)
    };

    return res.status(200).send(responsePayload);
  } catch (e) {
    Logger.error(`Error in Google Sign-In: ${e.message}`);
    return res
      .status(500)
      .json({ code: "GOOGLE003", message: "Error signing in with Google" });
  }
};

export const changePassword = async (req, res) => {

  Logger.info('inside changePassword');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    Logger.error(`We have Errors: ${JSON.stringify(errors.array(), null, 2)}`)
    return res.status(422).json({ error: errors.array() });
  }

  try {

    const { decoded: { user_id } } = req;

    const user = await User.findById(user_id);

    if (!user) {
      Logger.error('User Not Found');
      return res
        .status(400)
        .json({ code: "USER012", message: "Error Changing Password" });
    }

    const oldPassword = req.body.op; // old password
    const newPassword = req.body.np;

    if (oldPassword === newPassword) {
      Logger.error('Passwords are the same');
      return res
        .status(400)
        .json({ code: "USER013", message: "Error Changing Password: Passwords are the same." });
    }

    //make sure its the right old password
    // Handle both old and new field names for backward compatibility
    const encryptedPassword = user.encrypted_password || user.encryptedPassword;

    if (!encryptedPassword) {
      Logger.error('No password found for user');
      return res
        .status(400)
        .json({ code: "USER013", message: "Error Changing Password: No password found" });
    }

    // Auto-migrate old field names to new ones if needed
    const needsMigration = user.encryptedPassword && !user.encrypted_password;
    if (needsMigration) {
      Logger.info(`Auto-migrating user ${user._id} from old field names to new ones`);
      const migrationFields = {};

      if (user.encryptedPassword) migrationFields.encrypted_password = user.encryptedPassword;
      if (user.passwordChangedAt) migrationFields.password_changed_at = user.passwordChangedAt;
      if (user.accessLevel) migrationFields.access_level = user.accessLevel;
      if (user.confirmCode) migrationFields.confirm_code = user.confirmCode;
      if (user.resetCode) migrationFields.reset_code = user.resetCode;
      if (user.resetPassword !== undefined) migrationFields.reset_password = user.resetPassword;
      if (user.resetTime) migrationFields.reset_time = user.resetTime;

      await User.updateOne({ _id: user._id }, migrationFields);
      Logger.info(`Auto-migration completed for user ${user._id}`);
    }

    const valid = await bcrypt.compare(oldPassword, encryptedPassword);

    if (!valid) {
      Logger.error('Invalid Password');
      return res
        .status(400)
        .json({ code: "USER012", message: "Error Changing Password" });
    }

    Logger.info(`Setting new password for user ${user._id}`);

    const passwordSalt = await bcrypt.genSalt(saltRounds);
    const encrypted_password = await bcrypt.hash(newPassword, passwordSalt);

    user.encrypted_password = encrypted_password;
    user.password_changed_at = new Date();
    await user.save();

    Logger.info('Change Password Successful');

    //send email
    const data = {
      email: user.email,
    };
    console.log('data', data);

    const to = user.email;

    sendEmailWithTemplate(USER_EMAIL_TEMPLATE_NAMES.changePassword, to, data);

    return res.status(200).json({
      changed: true,
      message: "Change Password Successful",
      passwordChangedAt: user.password_changed_at
    });

  } catch (e) {
    Logger.error('Error Changing Password')
    return res
      .status(500)
      .json({ code: "USER012", message: "Error Changing Password" });
  }

}
