const AWS = require('aws-sdk');
const config = require('./config');

/**
 * Set AWS credentials
 */
AWS.config.update({
  region: config.SQS.REGION,
  accessKeyId: config.SQS.ACCESS_KEY_ID,
  secretAccessKey: config.SQS.SECRET_ACCESS_KEY,
});

/**
 * AWS SQS handler
 * @type {SQS}
 */
const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  endpoint: config.SQS.ENDPOINT,
});

/**
 * Set retention period to match
 * this one in config file
 */
sqs.setQueueAttributes({
  QueueUrl: config.SQS.QUEUE_URL,
  Attributes: {
    MessageRetentionPeriod: config.SQS.MESSAGE_RETENTION_PERIOD.toString(),
  },
}).promise().then(() => {
  // eslint-disable-next-line no-console
  console.log('Set message retention period');
}).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
});

module.exports = {
  sqs,
  AWS,
};
