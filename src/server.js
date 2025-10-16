import express from 'express';
import { createLogger } from './logger.js';
import bookingRepo from './data/repositories/BookingRepository.js';
import userRepo from './data/repositories/UserRepository.js';

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

/**
 * Create a new booking.
 * POST /bookings
 */
app.post('/bookings', async (req, res) => {
  try {
    const { userId, name, date, status } = req.body;
    if (!userId || !name || !date) {
      return res.status(400).json({ error: 'userId, name, and date are required' });
    }
    const booking = await bookingRepo.create({ userId, name, date, status });
    logger.info(`Booking created: ${booking._id}`);
    res.status(201).json(booking);
  } catch (error) {
    logger.error(`Error creating booking: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Fetch all bookings.
 * GET /bookings
 */
app.get('/bookings', async (req, res) => {
  try {
    const bookings = await bookingRepo.findAll();
    logger.info('Fetched all bookings');
    res.json(bookings);
  } catch (error) {
    logger.error(`Error fetching bookings: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Fetch a booking by ID.
 * GET /bookings/:id
 */
app.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await bookingRepo.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    logger.info(`Fetched booking: ${req.params.id}`);
    res.json(booking);
  } catch (error) {
    logger.error(`Error fetching booking: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update a booking by ID.
 * PUT /bookings/:id
 */
app.put('/bookings/:id', async (req, res) => {
  try {
    const { name, date, status } = req.body;
    const booking = await bookingRepo.update(req.params.id, { name, date, status });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    logger.info(`Updated booking: ${req.params.id}`);
    res.json(booking);
  } catch (error) {
    logger.error(`Error updating booking: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete a booking by ID.
 * DELETE /bookings/:id
 */
app.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await bookingRepo.delete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    logger.info(`Deleted booking: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting booking: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the app
export default app;
