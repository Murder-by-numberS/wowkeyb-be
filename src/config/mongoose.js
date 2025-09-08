import mongoose from 'mongoose';

import config from './config.js';
import Logger from '../utils/logger.js';

// Only connect to MongoDB if DATABASE_URI is provided
if (config.databaseURI) {
  mongoose.connect(config.databaseURI, {}); //uncomment for db access

  const db = mongoose.connection;
  db.on('error', () => {
    Logger.error(`Error connecting to MongoDB @ ${config.databaseURI}`);
  });

  db.once('connecting', () => {
    Logger.info(`Connecting to MongoDB @ ${config.databaseURI}`);
  });

  db.once('connected', () => {
    Logger.info(`Connected to MongoDB @ ${config.databaseURI}`);
  });
} else {
  Logger.warn('DATABASE_URI not provided, skipping MongoDB connection');
}

export default mongoose;
