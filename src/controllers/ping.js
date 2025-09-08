import jwt from 'jsonwebtoken';

import Logger from '../utils/logger.js'

const PingService = {

  ping: async (req, res) => {

    const { token } = req.body;

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
        return res.status(401).json({ message: 'Token expired' });
      }
      throw error;
    }
  }

}

export default PingService
