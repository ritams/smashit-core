import express from 'express';
import cors from 'cors';
import { createLogger } from './logger.js';
import bookingRepo from './data/repositories/BookingRepository.js';
import userRepo from './data/repositories/UserRepository.js';
import spaceRepo from './data/repositories/SpaceRepository.js';
import organizationRepo from './data/repositories/OrganizationRepository.js';

const logger = createLogger('server');

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Enable CORS
app.use(cors());

/**
 * Handles GET request to the root path.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.send('Hello from smashit-core!');
});

// API Key authentication middleware for protected routes
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }
  next();
});

/**
 * Create a new user.
 * POST /users
 */
app.post('/users', async (req, res) => {
  try {
    const { name, username, email, userId, isAdmin, organizationId } = req.body;
    if (!name || !username || !email || !userId) {
      return res.status(400).json({ error: 'name, username, email, and userId are required' });
    }
    // Check if organization exists if provided
    if (organizationId) {
      const organization = await organizationRepo.findById(organizationId);
      if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
      }
    }
    const user = await userRepo.create({ name, username, email, userId, isAdmin, organization: organizationId });
    // Add user to organization's users array if organizationId provided
    if (organizationId) {
      const organization = await organizationRepo.findById(organizationId);
      organization.users.push(user._id);
      await organization.save();
    }
    logger.info(`User created: ${user._id}`);
    res.status(201).json(user);
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Fetch all users.
 * GET /users
 */
app.get('/users', async (req, res) => {
  try {
    const users = await userRepo.findAll();
    logger.info('Fetched all users');
    res.json(users);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Fetch a user by ID.
 * GET /users/:id
 */
app.get('/users/:id', async (req, res) => {
  try {
    const user = await userRepo.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    logger.info(`Fetched user: ${req.params.id}`);
    res.json(user);
  } catch (error) {
    logger.error(`Error fetching user: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update a user by ID.
 * PUT /users/:id
 */
app.put('/users/:id', async (req, res) => {
  try {
    const { name, username, email, userId, isAdmin, organizationId } = req.body;
    const user = await userRepo.update(req.params.id, { name, username, email, userId, isAdmin, organization: organizationId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    logger.info(`Updated user: ${req.params.id}`);
    res.json(user);
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete a user by ID.
 * DELETE /users/:id
 */
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await userRepo.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Remove user from organization's users array
    if (user.organization) {
      const organization = await organizationRepo.findById(user.organization);
      if (organization) {
        organization.users.pull(user._id);
        await organization.save();
      }
    }
    await userRepo.delete(req.params.id);
    logger.info(`Deleted user: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create a new organization.
 * POST /organizations
 */
app.post('/organizations', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    const organization = await organizationRepo.create({ name, description });
    logger.info(`Organization created: ${organization._id}`);
    res.status(201).json(organization);
  } catch (error) {
    logger.error(`Error creating organization: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Fetch all organizations.
 * GET /organizations
 */
app.get('/organizations', async (req, res) => {
  try {
    const organizations = await organizationRepo.findAll();
    logger.info('Fetched all organizations');
    res.json(organizations);
  } catch (error) {
    logger.error(`Error fetching organizations: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Fetch an organization by ID.
 * GET /organizations/:id
 */
app.get('/organizations/:id', async (req, res) => {
  try {
    const organization = await organizationRepo.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    logger.info(`Fetched organization: ${req.params.id}`);
    res.json(organization);
  } catch (error) {
    logger.error(`Error fetching organization: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update an organization by ID.
 * PUT /organizations/:id
 */
app.put('/organizations/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const organization = await organizationRepo.update(req.params.id, { name, description });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    logger.info(`Updated organization: ${req.params.id}`);
    res.json(organization);
  } catch (error) {
    logger.error(`Error updating organization: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete an organization by ID.
 * DELETE /organizations/:id
 */
app.delete('/organizations/:id', async (req, res) => {
  try {
    const organization = await organizationRepo.delete(req.params.id);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    logger.info(`Deleted organization: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting organization: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create a new space.
 * POST /spaces
 */
app.post('/spaces', async (req, res) => {
  try {
    const { name, description, maxBookings, organizationId } = req.body;
    if (!name || !maxBookings || !organizationId) {
      return res.status(400).json({ error: 'name, maxBookings, and organizationId are required' });
    }
    // Check if organization exists
    const organization = await organizationRepo.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    const space = await spaceRepo.create({ name, description, maxBookings, organization: organizationId });
    // Add space to organization's spaces array
    organization.spaces.push(space._id);
    await organization.save();
    logger.info(`Space created: ${space._id}`);
    res.status(201).json(space);
  } catch (error) {
    logger.error(`Error creating space: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Fetch all spaces.
 * GET /spaces
 */
app.get('/spaces', async (req, res) => {
  try {
    const spaces = await spaceRepo.findAll();
    logger.info('Fetched all spaces');
    res.json(spaces);
  } catch (error) {
    logger.error(`Error fetching spaces: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Fetch a space by ID.
 * GET /spaces/:id
 */
app.get('/spaces/:id', async (req, res) => {
  try {
    const space = await spaceRepo.findById(req.params.id);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    logger.info(`Fetched space: ${req.params.id}`);
    res.json(space);
  } catch (error) {
    logger.error(`Error fetching space: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update a space by ID.
 * PUT /spaces/:id
 */
app.put('/spaces/:id', async (req, res) => {
  try {
    const { name, description, maxBookings } = req.body;
    const space = await spaceRepo.update(req.params.id, { name, description, maxBookings });
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    logger.info(`Updated space: ${req.params.id}`);
    res.json(space);
  } catch (error) {
    logger.error(`Error updating space: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete a space by ID.
 * DELETE /spaces/:id
 */
app.delete('/spaces/:id', async (req, res) => {
  try {
    const space = await spaceRepo.findById(req.params.id);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    // Remove space from organization's spaces array
    if (space.organization) {
      const organization = await organizationRepo.findById(space.organization);
      if (organization) {
        organization.spaces.pull(space._id);
        await organization.save();
      }
    }
    await spaceRepo.delete(req.params.id);
    logger.info(`Deleted space: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting space: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create a new booking.
 * POST /bookings
 */
app.post('/bookings', async (req, res) => {
  try {
    const { userId, spaceId, name, date, status } = req.body;
    if (!userId || !spaceId || !name || !date) {
      return res.status(400).json({ error: 'userId, spaceId, name, and date are required' });
    }
    // Check if space exists and max bookings not exceeded
    const space = await spaceRepo.findById(spaceId);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    const existingBookings = await bookingRepo.findBySpaceId(spaceId);
    if (existingBookings.length >= space.maxBookings) {
      return res.status(400).json({ error: 'Maximum bookings reached for this space' });
    }
    const booking = await bookingRepo.create({ userId, spaceId, name, date, status });
    // Add booking to space's bookings array
    space.bookings.push(booking._id);
    await space.save();
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
    const booking = await bookingRepo.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    // Remove booking from space's bookings array
    const space = await spaceRepo.findById(booking.spaceId);
    if (space) {
      space.bookings.pull(booking._id);
      await space.save();
    }
    await bookingRepo.delete(req.params.id);
    logger.info(`Deleted booking: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting booking: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the app
export default app;
