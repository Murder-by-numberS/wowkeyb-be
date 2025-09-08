//packages
import express from 'express';
import helmet from "helmet";
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
//config
import { Config } from './config/index.js';

import Logger from './utils/logger.js';

//routes
import routes from './routes/index.js';

const app = express();
const port = Config.appPort;

// app.use(bearerToken());
app.use(cors());
app.use(bodyParser.json());

// Add compression middleware for response optimization
app.use(compression());

app.use(helmet())

// Add response caching middleware
app.use((req, res, next) => {
  // Cache GET requests for 5 minutes
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300');
  }
  // Cache static data for longer periods
  if (req.path.includes('/abilities') || req.path.includes('/versions')) {
    res.set('Cache-Control', 'public, max-age=1800'); // 30 minutes
  }
  next();
});

// Middleware to log HTTP requests
app.use((req, res, next) => {
  Logger.http(`${req.method} ${req.url}`);
  next();
});

routes(app);

// eslint-disable-next-line no-unused-vars
const server = app.listen(port, () => {
  console.log(`Wowkeyb listening on port ${port}`)
})
