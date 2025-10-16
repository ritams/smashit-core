import express from 'express';
import { createLogger } from './logger.js';

const logger = createLogger('server');

const app = express();

// Middleware for JSON parsing
app.use(express.json());

/**
 * Handles GET request to the root path.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.send('Hello from smashit-core!');
});

// Export the app
export default app;
