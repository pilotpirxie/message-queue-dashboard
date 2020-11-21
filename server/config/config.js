module.exports = {
  DB: {
    NAME: 'consumer',
    USER: 'postgres',
    PASS: 'mysecretpassword',
    HOST: 'localhost',
    PORT: 5432,
  },
  SQS: {
    QUEUE_URL: 'http://localhost:9324/queue/default',
    ENDPOINT: 'http://localhost:9324',
    REGION: 'eu-west-1',
    ACCESS_KEY_ID: '...',
    SECRET_ACCESS_KEY: '...',
    MESSAGE_VISIBILITY_TIMEOUT: 10 * 60,
    MESSAGE_PROCESSING_TIMEOUT: 2 * 60,
  }
}
