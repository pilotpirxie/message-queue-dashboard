const { Router } = require('express');
const joi = require('joi');
const moment = require('moment');
const { Messages, Settings } = require('../models');
const validation = require('../config/validation');

const router = Router();

router.put('/messages', [validation({
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

router.get('/config', async (req, res, next) => {
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

module.exports = router;
