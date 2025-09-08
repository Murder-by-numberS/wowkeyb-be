import Logger from '../utils/logger.js'
import mongoose from '../config/mongoose.js'
import Config from '../config/config.js';

const HealthService = {

  health: async (req, res) => {
    Logger.info('Health');
    const dbStatus = mongoose && mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';
    const available = dbStatus === 'UP';

    // Return 200 even if database is not connected for App Runner health checks
    return res.status(200).json({
      data: available ? 'OK' : 'OK_NO_DB',
      dbStatus: dbStatus
    });
  },

  status: async (req, res) => {
    Logger.info('Status');

    const dbStatus = mongoose && mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';
    const version = Config.appVersion;

    return res.status(200).json({ dbStatus, version });
  },

}

export default HealthService
