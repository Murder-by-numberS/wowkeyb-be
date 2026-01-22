import jwt from 'jsonwebtoken';

import Logger from '../utils/logger.js'
import User from '../models/user.js';

const PingService = {

  ping: async (req, res) => {

    const { token, access_level: clientAccessLevel } = req.body;

    // Check if token is provided
    if (!token) {
      Logger.warn('Ping - No token provided');
      return res.status(401).send({ code: "TOK003", message: 'Token is required' });
    }

    try {
      Logger.info(`Ping - ${token}`);
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      const { user_id } = decoded;

      if (!user_id) {
        return res.status(401).send({ code: "TOK003", message: 'Token is not valid' });
      }

      // Fetch the actual user from database to get true access_level
      const user = await User.findById(user_id).select('access_level username email');

      if (!user) {
        Logger.warn(`Ping - User not found for id: ${user_id}`);
        return res.status(401).send({ code: "USER001", message: 'User not found' });
      }

      const actualAccessLevel = user.access_level || 1;

      // Check if client is trying to claim a higher access level than they have
      if (clientAccessLevel !== undefined && clientAccessLevel > actualAccessLevel) {
        Logger.warn(`Ping - User ${user.username} (${user_id}) attempted to claim access_level ${clientAccessLevel} but actual is ${actualAccessLevel}`);
      }

      // Always return the actual access_level from database
      // This ensures the frontend syncs with the true value
      return res.status(200).json({
        data: 'OK',
        access_level: actualAccessLevel
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        Logger.warn('Ping - Token expired');
        return res.status(401).json({ message: 'Token expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        Logger.warn('Ping - Invalid token');
        return res.status(401).json({ message: 'Invalid token' });
      }
      Logger.error('Ping - Unexpected error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

}

export default PingService
