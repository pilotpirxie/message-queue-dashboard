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
 * Call SQS for a message
 *
 * @type {function}
 */
const receiveMessage = sqs.receiveMessage({
  MaxNumberOfMessages: 1,
  QueueUrl: config.SQS.QUEUE_URL,
  WaitTimeSeconds: config.SQS.CONNECTION_WAIT_TIME_SECONDS,
  VisibilityTimeout: config.SQS.MESSAGE_VISIBILITY_TIMEOUT,
}).promise;

/**
 * Call SQS to delete a message
 *
 * @param ReceiptHandle
 * @returns {function}
 */
const deleteMessage = (ReceiptHandle) => sqs.deleteMessage({
  QueueUrl: config.SQS.QUEUE_URL,
  ReceiptHandle,
}).promise;

module.exports = {
  sqs,
  AWS,
  receiveMessage,
  deleteMessage,
};
