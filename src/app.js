//packages
import express from 'express';
import helmet from "helmet";
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
//config
import { Config } from './config/index.js';

import Logger from './utils/logger.js';

// Import mongoose to establish database connection
import './config/mongoose.js';

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
  // Disable caching for dynamic user data that changes frequently
  if (req.path.includes('/keybindings') || req.path.includes('/abilities') || req.path.includes('/versions') || req.path.includes('/macros')) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  } else if (req.method === 'GET') {
    // Cache other GET requests for 5 minutes
    res.set('Cache-Control', 'public, max-age=300');
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
