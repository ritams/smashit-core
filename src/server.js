import express from 'express';

const app = express();

// Middleware for JSON parsing
app.use(express.json());

/**
 * Handles GET request to the root path.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/', (req, res) => {
  res.send('Hello from smashit-core!');
});

// Export the app
export default app;
