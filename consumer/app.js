const listener = require('./controllers/listener');

listener().then(() => {
  // eslint-disable-next-line no-console
  console.log('Listener closed.');
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
});
