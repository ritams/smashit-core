import 'dotenv/config';

import app from './src/server.js';
import { createLogger } from './src/logger.js';

const logger = createLogger('app');

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('PORT environment variable is required');
}

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});