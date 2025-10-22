import jwt from 'jsonwebtoken';

import Logger from '../utils/logger.js'

const PingService = {

  ping: async (req, res) => {

    const { token } = req.body;

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

      return res.status(200).json({ data: 'OK' });
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
