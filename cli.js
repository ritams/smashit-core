import app from './src/server.js';
import { createLogger } from './src/logger.js';

const logger = createLogger('cli');

const server = app.listen(0, () => {
  const port = server.address().port;
  fetch(`http://localhost:${port}/`)
    .then(res => res.text())
    .then(text => {
      if (text === 'Hello from smashit-core!') {
        logger.info('Test passed: Server responds correctly');
      } else {
        logger.error(`Test failed: Unexpected response: ${text}`);
      }
      server.close();
    })
    .catch(err => {
      logger.error(`Test error: ${err.message}`);
      server.close();
    });
});
