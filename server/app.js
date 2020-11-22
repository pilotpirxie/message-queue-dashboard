const express = require('express');

const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const joi = require('joi');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const moment = require('moment');
const sql = require('./config/sequelize');
const { Messages, Settings } = require('./models');
const handlebarsHelpers = require('./config/handlebars');
const validation = require('./config/validation');
const { sqs } = require('./config/aws');
const config = require('./config/config');

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

app.get('/', async (req, res) => {
  res.redirect('/messages/');
});

app.get('/messages/:messageId?', [validation({
  params: {
    messageId: joi.number().optional(),
  },
})], async (req, res, next) => {
  try {
    await Messages.update({
      status: 'CANCEL',
    }, {
      where: {
        status: ['WAITING', 'PENDING'],
        created_at: {
          [Op.lte]: moment().subtract(config.SQS.MESSAGE_RETENTION_PERIOD, 'seconds'),
        },
      },
    });

    const messages = await Messages.findAll({
      raw: true,
      limit: 500,
      attributes: ['id', 'uuid', 'created_at', 'status', 'name'],
      order: [['created_at', 'DESC']],
    });

    const message = req.params.messageId ? (await Messages.findOne({
      where: {
        id: +req.params.messageId,
      },
      raw: true,
    })) : null;

    return res.render('home', {
      messages,
      message,
      messageId: +req.params.messageId,
    });
  } catch (e) {
    return next(e);
  }
});

app.get('/settings', async (req, res, next) => {
  try {
    const settings = await Settings.findAll({
      raw: true,
    });

    const script = settings.find((el) => el.key === 'script');
    const timeout = settings.find((el) => el.key === 'timeout');
    const interpreter = settings.find((el) => el.key === 'interpreter');

    return res.render('settings', {
      script,
      timeout,
      interpreter,
    });
  } catch (e) {
    return next(e);
  }
});

app.post('/settings', [validation({
  body: {
    interpreter: joi.string().required(),
    timeout: joi.string().required(),
    script: joi.string().required(),
  },
})], async (req, res, next) => {
  try {
    await Settings.update({
      value: req.body.interpreter,
    }, {
      where: {
        key: 'interpreter',
      },
    });

    await Settings.update({
      value: req.body.timeout,
    }, {
      where: {
        key: 'timeout',
      },
    });

    await Settings.update({
      value: req.body.script,
    }, {
      where: {
        key: 'script',
      },
    });

    return res.redirect('/settings');
  } catch (e) {
    return next(e);
  }
});

app.post('/messages', [validation({
  body: {
    body: joi.string().required(),
    name: joi.string().allow('').optional(),
  },
})], async (req, res, next) => {
  try {
    const sqsMessage = await sqs.sendMessage({
      MessageBody: req.body.body,
      QueueUrl: config.SQS.QUEUE_URL,
    }).promise();

    const message = await Messages.create({
      uuid: sqsMessage.MessageId,
      status: 'WAITING',
      name: req.body.name || undefined,
      body: req.body.body,
    });

    return res.redirect(`/messages/${message.id}`);
  } catch (e) {
    return next(e);
  }
});

app.put('/api/messages', [validation({
  body: {
    uuid: joi.string().required(),
    body: joi.string().required(),
    status: joi.valid('WAITING', 'PENDING', 'SUCCESS', 'ERROR').required(),
    name: joi.string().optional(),
    logs: joi.string().allow('').optional(),
  },
})], async (req, res, next) => {
  try {
    const searchMessage = await Messages.findOne({
      where: {
        uuid: req.body.uuid.trim(),
        completed_at: null,
      },
    });

    if (searchMessage) {
      await searchMessage.update({
        status: req.body.status,
        body: req.body.body,
        processing_at: req.body.status === 'PENDING' && searchMessage.status !== 'PENDING' ? moment() : undefined,
        completed_at: req.body.status === 'SUCCESS' || req.body.status === 'ERROR' ? moment() : undefined,
        logs: req.body.logs || undefined,
      });
    } else {
      await Messages.create({
        uuid: req.body.uuid,
        status: req.body.status,
        name: req.body.name || undefined,
        body: req.body.body,
        logs: req.body.logs || undefined,
      });
    }

    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

app.get('/api/config', async (req, res, next) => {
  try {
    const settings = await Settings.findAll({
      raw: true,
    });

    const script = settings.find((el) => el.key === 'script');
    const timeout = settings.find((el) => el.key === 'timeout');
    const interpreter = settings.find((el) => el.key === 'interpreter');

    return res.json({
      script: script.value,
      timeout: timeout.value,
      interpreter: interpreter.value,
    });
  } catch (e) {
    return next(e);
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
