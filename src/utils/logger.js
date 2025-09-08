import { createLogger, format, transports } from 'winston';

import Config from '../config/config.js';

console.log(`Logger Level set to ${Config.logLevel}`);

/*
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
*/

// const Logger = createLogger({
//   // levels: {
//   //   error: 0,
//   //   warn: 1,
//   //   info: 2,
//   //   http: 3,
//   //   verbose: 4,
//   //   debug: 5,
//   //   silly: 6
//   // },
//   level: process.env.LOG_LEVEL || 'info',
//   format: format.combine(
//     // format.colorize(),
//     format.timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss'
//     }),
//     format.errors({ stack: true }),
//     format.splat(),
//     format.json()
//   ),
//   defaultMeta: { service: Config.appName },
//   transports: [
//     new transports.Console()
//   ]
// });


// Optimize logging for production
const isProduction = Config.nodeEnv === 'production';
const logLevel = isProduction ? 'warn' : (Config.logLevel || 'info');

const Logger = createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  },
  level: logLevel,
  format: format.combine(
    // format.colorize(), // Disabled for production performance
    format.timestamp({
      format: isProduction ? 'YYYY-MM-DDTHH:mm:ss.SSSZ' : 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    isProduction ? format.json() : format.combine(format.colorize(), format.simple())
  ),
  defaultMeta: { service: Config.appName },
  transports: [
    new transports.Console({
      silent: isProduction && logLevel === 'error' // Only log errors in production if level is error
    }),
  ]
});
export default Logger;
