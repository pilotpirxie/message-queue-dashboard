const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
  extname: '.hbs',
  partialsDir: ['views/partials/', 'views/accounts/partials'],
});
app.set('trust proxy', 1);
app.engine('hbs', hbs.engine);
app.set('port', process.env.PORT || 3000);
app.disable('x-powered-by');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(app.get('port'), () => {
  try {
    console.info(`App is listening on http://localhost:${app.get('port')}`);
  } catch (err) {
    console.warn('App is listening but ip address information are unavailable');
    console.error(err);
  }
});
