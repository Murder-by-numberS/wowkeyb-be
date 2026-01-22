import jwt from 'jsonwebtoken';
import Logger from '../utils/logger.js';
import User from '../models/user.js';

// Admin access level constant
const ADMIN_ACCESS_LEVEL = 9;

const AuthnMiddleware = {

  authenticateToken: (req, res, next) => {
    let token = req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token) {

      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }

      try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const { user_id } = decoded;

        if (!user_id) {
          return res.status(401).send({ code: "TOK003", message: 'Token is not valid' });
        }

        req.decoded = decoded;
        req.token = token;
        next();
      } catch (err) {
        Logger.error(err);
        return res.status(401).send({ code: "TOK003", message: 'Token is not valid' });
      }
    } else {
      Logger.info('Not Authorized. Kicking User Out');
      return res.status(401).send({ code: "TOK004", message: 'Not Authorized' });
    }
  },
  decode: (req, res, next) => {
    let token = req.headers['authorization'];

    // if token is present, decode it
    if (token) {
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }

      try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const { user_id } = decoded;
        if (user_id) {
          req.decoded = decoded;
        }
        // If no user_id, just continue without setting req.decoded
      } catch (err) {
        Logger.error(err);
        // Don't return error for invalid tokens in decode middleware
        // Just continue without setting req.decoded
      }
    }

    next();
  },

  /**
   * Middleware to check if user has admin access level
   * Must be used after authenticateToken middleware
   */
  requireAdmin: async (req, res, next) => {
    try {
      const userId = req.decoded?.user_id;

      if (!userId) {
        return res.status(401).send({ code: "AUTH001", message: 'Authentication required' });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send({ code: "USER001", message: 'User not found' });
      }

      if (user.access_level < ADMIN_ACCESS_LEVEL) {
        Logger.warn(`User ${userId} attempted admin action without admin privileges`);
        return res.status(403).send({ code: "AUTH002", message: 'Admin access required' });
      }

      // Attach user to request for later use
      req.user = user;
      next();
    } catch (err) {
      Logger.error('Error in admin middleware:', err);
      return res.status(500).send({ code: "AUTH003", message: 'Error checking admin status' });
    }
  }
}

export default AuthnMiddleware;
export { ADMIN_ACCESS_LEVEL };
