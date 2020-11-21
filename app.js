const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const sql = require('./config/sequelize');
const {Messages} = require('./models');
const handlebarsHelpers = require('./config/handlebars');

const hbs = exphbs.create({
  helpers: handlebarsHelpers,
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

sql.testConnection();

app.get('/', async (req, res) => {
  try {
    const messages = await Messages.findAll({
      raw: true,
      limit: 100,
      order: [['created_at', 'DESC']]
    });
    console.log(messages);
    res.render('home', {
      messages
    });
  } catch (e) {
    next(e);
  }
});

app.listen(app.get('port'), () => {
  try {
    console.info(`App is listening on http://localhost:${app.get('port')}`);
  } catch (err) {
    console.warn('App is listening but ip address information are unavailable');
    console.error(err);
  }
});
