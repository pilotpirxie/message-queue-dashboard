const { receiveMessage, deleteMessage } = require('../config/aws');

const { clearWorkdir, writeScript } = require('./filesystem');
const { getConfig, validateMessage } = require('./api');
const processMessage = require('./processMessage');

/**
 * Listen for an SQS message
 * @returns {Promise<void>}
 */
async function listener() {
  while (true) {
    try {
      const { Messages } = await receiveMessage();
      if (!Messages || Messages.length === 0) continue;

      const message = Messages[0];
      const messageResponse = await validateMessage(message.MessageId);
      const messageData = messageResponse.data;

      if (messageData && !messageData.completed_at) {
        clearWorkdir();
        const configResponse = await getConfig();
        const { script, timeout, interpreter } = configResponse.data;
        writeScript(script);

        await processMessage(message, interpreter, timeout);
        clearWorkdir();
      }

      await deleteMessage(message.ReceiptHandle);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }
}

module.exports = listener;
