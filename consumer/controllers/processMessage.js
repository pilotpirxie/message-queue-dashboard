const { spawn } = require('child_process');
const path = require('path');
const config = require('../config/config');
const { sendPending, setComplete } = require('./api');

/**
 * Write logs to stdout, output log array
 * and send to the remote server
 *
 * @param {string} data
 * @param {object} message
 * @param {array} logsOutput
 */
function processLogData(data, message, logsOutput = []) {
  // eslint-disable-next-line no-console
  console.log(data.toString());
  logsOutput.push(data.toString());
  sendPending(message, logsOutput);
}

/**
 * Spawn new process and run script
 *
 * @param {string} interpreter
 * @param {number} timeout
 * @returns {ChildProcessWithoutNullStreams}
 */
function spawnProcess(interpreter, timeout) {
  return spawn(interpreter, [config.SCRIPT_FILE], {
    cwd: path.join(__dirname, 'workdir'),
    timeout,
  });
}

/**
 * Process received message
 *
 * @param {object} message
 * @param {string} interpreter
 * @param {number} timeout
 * @returns {Promise<unknown>}
 */
function processMessage(message, interpreter, timeout) {
  return new Promise((resolve, reject) => {
    sendPending(message);

    const subProcess = spawnProcess(interpreter, timeout);

    const logsOutput = [];

    subProcess.stdout.on('data', (data) => processLogData(data, message, logsOutput));
    subProcess.stderr.on('data', (data) => processLogData(data, message, logsOutput));

    subProcess.on('close', (code) => {
      if (code === 0) setComplete(message, logsOutput, 'SUCCESS').then(() => resolve());
      else setComplete(message, logsOutput, 'SUCCESS').then(() => reject());
    });
  });
}

module.exports = processMessage;
