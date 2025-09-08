import jwt from 'jsonwebtoken';
import Logger from '../utils/logger.js';

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
        if (!user_id) {
          return res.status(401).send({ code: "TOK003", message: 'Token is not valid' });
        }

        req.decoded = decoded;
      } catch (err) {
        Logger.error(err);
        return res.status(401).send({ code: "TOK003", message: 'Token is not valid' });
      }
    }

    next();
  }
}

export default AuthnMiddleware;
