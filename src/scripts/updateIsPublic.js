// updateIsPublic.js
import mongoose from 'mongoose';
import Keybinding from '../models/keybinding.js';
import Config from '../config/config.js';

async function updateIsPublic() {
  try {
    // Connect to MongoDB
    await mongoose.connect(Config.databaseURI);
    console.log('Connected to MongoDB');

    // Update keybindings with user_id to is_public: false
    const privateResult = await Keybinding.updateMany(
      { user_id: { $exists: true, $ne: null } },
      { $set: { is_public: false } }
    );

    // Update keybindings without user_id to is_public: true
    const publicResult = await Keybinding.updateMany(
      { $or: [{ user_id: null }, { user_id: { $exists: false } }] },
      { $set: { is_public: true } }
    );

    console.log(`Updated ${privateResult.modifiedCount} private keybindings`);
    console.log(`Updated ${publicResult.modifiedCount} public keybindings`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateIsPublic();