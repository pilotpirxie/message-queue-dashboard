const AWS = require('aws-sdk');
const config = require('./config');

AWS.config.update({
  region: config.SQS.REGION,
  accessKeyId: config.SQS.ACCESS_KEY_ID,
  secretAccessKey: config.SQS.SECRET_ACCESS_KEY
});

const sqs = new AWS.SQS({
  apiVersion: '2012-11-05',
  endpoint: config.SQS.ENDPOINT
});

module.exports = {
  sqs,
  AWS
}
