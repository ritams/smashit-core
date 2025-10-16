import 'dotenv/config';
import mongoose from 'mongoose';

import app from './src/server.js';
import { createLogger } from './src/logger.js';

const logger = createLogger('app');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smashit';
    await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('PORT environment variable is required');
}

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});