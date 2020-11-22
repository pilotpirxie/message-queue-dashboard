const { Router } = require('express');
const joi = require('joi');
const moment = require('moment');
const { Messages, Settings } = require('../models');
const validation = require('../config/validation');

const router = Router();

/**
 * Update existing message data if not completed
 *
 * @apiParam {string} uuid Message id
 * @apiParam {string} body Message body
 * @apiParam {string} status Processing status
 * @apiParam {string} logs Processing logs
 */
router.put('/messages', [validation({
  body: {
    uuid: joi.string().required(),
    body: joi.string().required(),
    status: joi.valid('WAITING', 'PENDING', 'SUCCESS', 'ERROR').required(),
    logs: joi.string().allow('').optional(),
  },
})], async (req, res, next) => {
  try {
    const {
      uuid, body, status, logs,
    } = req.body;

    const searchMessage = await Messages.findOne({
      where: {
        uuid: uuid.trim(),
        completed_at: null,
      },
    });

    if (!searchMessage) return res.sendStatus(404);

    await searchMessage.update({
      status,
      body,
      processing_at: status === 'PENDING' && searchMessage.status !== 'PENDING' ? moment() : undefined,
      completed_at: status === 'SUCCESS' || status === 'ERROR' ? moment() : undefined,
      logs: logs || undefined,
    });

    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

/**
 * Register new message
 *
 * @apiParam {string} uuid Message id
 * @apiParam {string} body Message body
 * @apiParam {string} status Processing status
 * @apiParam {string} name Message name
 * @apiParam {string} logs Processing logs
 */
router.post('/messages', [validation({
  body: {
    uuid: joi.string().required(),
    body: joi.string().required(),
    status: joi.valid('WAITING', 'PENDING', 'SUCCESS', 'ERROR').required(),
    name: joi.string().optional(),
    logs: joi.string().allow('').optional(),
  },
})], async (req, res, next) => {
  try {
    await Messages.create({
      uuid: req.body.uuid,
      status: req.body.status,
      body: req.body.body,
      name: req.body.name || undefined,
      logs: req.body.logs || undefined,
    });

    return res.sendStatus(200);
  } catch (e) {
    return next(e);
  }
});

/**
 * Get config
 */
router.get('/config', async (req, res, next) => {
  try {
    const settings = await Settings.findAll({
      raw: true,
    });

    const script = settings.find((el) => el.key === 'script');
    const timeout = settings.find((el) => el.key === 'timeout');
    const interpreter = settings.find((el) => el.key === 'interpreter');

    return res.json({
      script: script.value || '',
      timeout: timeout.value || '',
      interpreter: interpreter.value || '',
    });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
