module.exports = {
  SQS: {
    QUEUE_URL: 'http://localhost:9324/queue/default',
    ENDPOINT: 'http://localhost:9324',
    REGION: 'eu-west-1',
    ACCESS_KEY_ID: '...',
    SECRET_ACCESS_KEY: '...',
    MESSAGE_VISIBILITY_TIMEOUT: 2 * 60,
    CONNECTION_WAIT_TIME_SECONDS: 20
  },
  API_HOST: 'http://localhost:3000'
}
