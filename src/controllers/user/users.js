import { validationResult } from "express-validator";
import Logger from '../../utils/logger.js';
import { User, UserSetting } from '../../models/index.js'

//TODO
export const getUsers = async (req, res) => {
  let message = { data: 'OK' };
  return res.status(200).send(message);
}

//mongo _id
export const getUser = async (req, res) => {
  Logger.info('Inside getUser');
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    Logger.error(`We have Errors: ${JSON.stringify(errors.array(), null, 2)}`)
    return res.status(422).json({ error: errors.array() });
  }

  const { id } = req.query;

  try {
    const user = await User.findOne({ _id: id }).populate('organizations');

    // let message = { data: 'OK' };
    Logger.debug(`sending back user ${user}`);
    return res.status(200).send(user);
  }
  catch (e) {
    Logger.error(`Error getting user ${id}`);
    return res.status(500).json(e.message);
  }
  // return res.status(200).send(message);
}

export const saveSetting = async (req, res) => {

  Logger.info('Inside saveSetting');
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    Logger.error(`We have Errors: ${JSON.stringify(errors.array(), null, 2)}`)
    return res.status(422).json({ error: errors.array() });
  }

  const { decoded } = req;

  const { theme, scheme, favoriteClass } = req.body;
  
  // Update UserSetting for theme and scheme
  const userSettingPayload = {
    ...(theme && { theme }),
    ...(scheme && { scheme })
  };
  
  // Update User model for favorite_class (convert camelCase to snake_case)
  const userPayload = {
    ...(favoriteClass !== undefined && { favorite_class: favoriteClass })
  };
  
  console.log('updatePayload - userSetting:', userSettingPayload, 'user:', userPayload);
  
  try {
    // Update UserSetting if there are theme/scheme changes
    if (Object.keys(userSettingPayload).length > 0) {
      await UserSetting.updateOne({ user_id: decoded.user_id }, userSettingPayload);
    }
    
    // Update User if there are favorite_class changes
    if (Object.keys(userPayload).length > 0) {
      await User.findByIdAndUpdate(decoded.user_id, userPayload);
    }

    return res.status(200).send({ message: 'Settings Updated' });
  }
  catch (e) {
    Logger.error(`Error saving setting for user ${decoded.user_id}`);
    return res.status(500).json(e.message);
  }
}

export const updateProfile = async (req, res) => {
  Logger.info('Inside updateProfile');
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    Logger.error(`We have Errors: ${JSON.stringify(errors.array(), null, 2)}`)
    return res.status(422).json({ error: errors.array() });
  }

  const { decoded } = req;
  const { description, username, favorite_class } = req.body;

  const updatePayload = {
    ...(description !== undefined && { description }),
    ...(username !== undefined && { username }),
    ...(favorite_class !== undefined && { favorite_class })
  }

  console.log('updatePayload', updatePayload);
  try {
    // Check if username is being changed and if it's already taken
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: decoded.user_id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.user_id,
      updatePayload,
      { new: true, select: 'email username description favorite_class createdAt updatedAt' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Convert snake_case to camelCase for frontend
    const userResponse = {
      _id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      description: updatedUser.description,
      favoriteClass: updatedUser.favorite_class,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    return res.status(200).send({
      message: 'Profile Updated',
      user: userResponse
    });
  }
  catch (e) {
    Logger.error(`Error updating profile for user ${decoded.user_id}`);
    return res.status(500).json(e.message);
  }
}
