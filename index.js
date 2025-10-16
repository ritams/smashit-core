import 'dotenv/config';

import app from './src/server.js';

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('PORT environment variable is required');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});