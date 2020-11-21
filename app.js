const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const sql = require('./config/sequelize');
const {Messages} = require('./models');
const handlebarsHelpers = require('./config/handlebars');
const joi = require('joi');
const validation = require('./config/validation');

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
  res.redirect('/messages/');
});

app.get('/messages/:messageId?', [validation({
  params: {
    messageId: joi.number().optional()
  }
})], async (req, res, next) => {
  try {
    const messages = await Messages.findAll({
      raw: true,
      limit: 100,
      order: [['created_at', 'DESC']]
    });

    const message = req.params.messageId ? (await Messages.findOne({
      where: {
        id: +req.params.messageId
      },
      raw: true,
    })) : null;

    res.render('home', {
      messages,
      message
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
