const axios = require('axios');
const qs = require('querystring');
const config = require('../config/config.js');

module.exports = {
  /**
   * Get processing config
   *
   * @returns {Promise<*>}
   */
  async getConfig() {
    return axios.get(`${config.API_HOST}/api/config`);
  },

  /**
   * Validate message
   * @param {string} messageId
   * @returns {Promise<AxiosResponse<any>>}
   */
  async validateMessage(messageId) {
    return axios.get(`${config.API_HOST}/api/messages/${messageId}`);
  },

  /**
   * Send PENDING status about message
   *
   * @param {object} message
   * @param {array} logs
   * @returns {Promise<AxiosResponse<any>>}
   */
  async sendPending(message, logs = []) {
    return axios.put(`${config.API_HOST}/api/messages`, qs.stringify({
      uuid: message.MessageId,
      body: message.Body,
      status: 'PENDING',
      logs: logs.join(''),
    }));
  },

  /**
   * Mark message as completed
   *
   * @param {object} message
   * @param {array} logs
   * @param {string} status
   * @returns {Promise<AxiosResponse<any>>}
   */
  async setComplete(message, logs = [], status = 'SUCCESS') {
    return axios.put(`${config.API_HOST}/api/messages`, qs.stringify({
      uuid: message.MessageId,
      body: message.Body,
      logs: logs.join(''),
      status,
    }));
  },
};
