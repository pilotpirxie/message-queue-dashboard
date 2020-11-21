const {sqs} = require('./config/aws');
const config = require('./config/config');
const {spawn} = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const qs = require('querystring')

let timeout = 60000;
let interpreter = '/bin/sh';

function process(message) {
  return new Promise((resolve, reject) => {

    axios.put(`${config.API_HOST}/api/messages`, qs.stringify({
      uuid: message.MessageId,
      body: message.Body,
      status: 'PENDING',
    }));

    const subProcess = spawn(interpreter, ['script.sh'], {
      cwd: path.join(__dirname, 'workdir'),
      timeout,
    });

    const output = [];

    subProcess.stdout.on('data', (data) => {
      console.log(data.toString());
      output.push(data.toString());
    });

    subProcess.stderr.on('data', (data) => {
      console.log(data.toString());
      output.push(data.toString());
    });

    subProcess.on('close', (code) => {
      if (code === 0) {
        axios.put(`${config.API_HOST}/api/messages`, qs.stringify({
          uuid: message.MessageId,
          body: message.Body,
          status: 'SUCCESS',
          logs: output.join('')
        })).then(() => {
          resolve(output.join(''));
        });
      } else {
        axios.put(`${config.API_HOST}/api/messages`, qs.stringify({
          uuid: message.MessageId,
          body: message.Body,
          status: 'ERROR',
          logs: output.join('')
        })).then(() => {
          reject(output.join(''));
        });
      }
    });

  })
}

(async () => {
  while (true) {
    try {
      const {Messages} = await sqs.receiveMessage({
        QueueUrl: config.SQS.QUEUE_URL,
        WaitTimeSeconds: config.SQS.CONNECTION_WAIT_TIME_SECONDS,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: config.SQS.MESSAGE_VISIBILITY_TIMEOUT
      }).promise();

      if (Messages) {
        const message = Messages[0];

        if (fs.existsSync(path.join(__dirname, '/workdir'))) {
          fs.rmdirSync(path.join(__dirname, '/workdir'), {
            recursive: true
          });
          fs.mkdirSync(path.join(__dirname, '/workdir'));
        }
        const processConfigResponse = await axios.get(`${config.API_HOST}/api/config`);
        const processConfig = processConfigResponse.data;
        interpreter = processConfig.interpreter;
        timeout = processConfig.timeout;
        fs.writeFileSync(path.join(__dirname, '/workdir/', '/script.sh'), processConfig.script.replace(/(\r)/gm, ""), {
          encoding: 'utf8'
        });

        const result = await process(message);
        console.log(result);

        await sqs.deleteMessage({
          QueueUrl: config.SQS.QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle
        }).promise();
      }
    } catch (e) {
      console.log(e);
      continue;
    }
  }

})();
