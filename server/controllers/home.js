const { Router } = require('express');
const joi = require('joi');
const { Op } = require('sequelize');
const moment = require('moment');
const { Messages, Settings } = require('../models');
const validation = require('../config/validation');
const { sqs } = require('../config/aws');
const config = require('../config/config');

const router = Router();

/**
 * Redirect from index to messages view
 */
router.get('/', async (req, res) => {
  res.redirect('/messages/');
});

/**
 * Get home page
 *
 * @apiParam {number} messageId Message id
 */
router.get('/messages/:messageId?', [validation({
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

/**
 * Send new message to the queue and register in db
 *
 * @apiParam {string} body Message body
 * @apiParam {string} name Message name
 */
router.post('/messages', [validation({
  body: {
    body: joi.string().required(),
    name: joi.string().allow('').optional(),
  },
})], async (req, res, next) => {
  try {
    JSON.parse(req.body.body);

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

/**
 * Get settings page
 */
router.get('/settings', async (req, res, next) => {
  try {
    const settings = await Settings.findAll({
      raw: true,
    });

    const script = settings.find((el) => el.key === 'script');
    const timeout = settings.find((el) => el.key === 'timeout');
    const interpreter = settings.find((el) => el.key === 'interpreter');

    return res.render('settings', {
      script: script.value || '',
      timeout: timeout.value || '',
      interpreter: interpreter.value || '',
    });
  } catch (e) {
    return next(e);
  }
});

/**
 * Save new settings
 *
 * @apiParam {string} interpreter
 * @apiParam {number} timeout
 * @apiParam {string} script
 */
router.post('/settings', [validation({
  body: {
    interpreter: joi.string().required(),
    timeout: joi.number().required(),
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

module.exports = router;
