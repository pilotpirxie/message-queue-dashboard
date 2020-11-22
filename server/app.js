const express = require('express');

const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const sql = require('./config/sequelize');
const handlebarsHelpers = require('./config/handlebars');

const hbs = exphbs.create({
  helpers: handlebarsHelpers,
  extname: '.hbs',
  partialsDir: ['views/partials/', 'views/accounts/partials'],
});

app.set('trust proxy', 1);
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);
app.disable('x-powered-by');

sql.testConnection();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/', require('./controllers/home'));
app.use('/api', require('./controllers/api'));

app.use('*', (req, res) => {
  res.redirect('/messages/?404');
});

// eslint-disable-next-line no-unused-vars
app.use('*', (err, req, res, next) => {
  if (err) {
    console.error(err);
    res.redirect('/messages/?500');
  }
});

app.listen(app.get('port'), () => {
  try {
    // eslint-disable-next-line no-console
    console.info(`App is listening on http://localhost:${app.get('port')}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('App is listening but ip address information are unavailable');
    // eslint-disable-next-line no-console
    console.error(err);
  }
});
