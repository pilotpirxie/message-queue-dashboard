module.exports = {
  SQS: {
    /**
     * SQS Queue Url
     */
    QUEUE_URL: 'http://localhost:9324/queue/default',
    /**
     * SQS Host
     */
    ENDPOINT: 'http://localhost:9324',
    /**
     * AWS Region
     */
    REGION: 'eu-west-1',
    /**
     * AWS Access Key
     */
    ACCESS_KEY_ID: '...',
    /**
     * AWS Secret Key
     */
    SECRET_ACCESS_KEY: '...',
    /**
     * Duration, when message is
     * not visible for other consumers
     */
    MESSAGE_VISIBILITY_TIMEOUT: 2 * 60,
    /**
     * Pooling timeout
     */
    CONNECTION_WAIT_TIME_SECONDS: 20,
  },
  /**
   * Web server host
   */
  API_HOST: 'http://localhost:3000',
  /**
   * Processing working directory
   */
  WORKDIR: 'workdir',
  /**
   * Script file for processing
   */
  SCRIPT_FILE: 'script.sh',
};
