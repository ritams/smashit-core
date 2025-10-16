import app from './src/server.js';

const server = app.listen(0, () => {
  const port = server.address().port;
  fetch(`http://localhost:${port}/`)
    .then(res => res.text())
    .then(text => {
      if (text === 'Hello from smashit-core!') {
        console.log('Test passed: Server responds correctly');
      } else {
        console.log('Test failed: Unexpected response:', text);
      }
      server.close();
    })
    .catch(err => {
      console.error('Test error:', err);
      server.close();
    });
});
