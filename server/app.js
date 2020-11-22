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

app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', 1);
app.engine('hbs', hbs.engine);
app.set('port', process.env.PORT || 3000);
app.disable('x-powered-by');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.set('view engine', 'hbs');
sql.testConnection();

app.use('/', require('./controllers/home'));
app.use('/api', require('./controllers/api'));

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
