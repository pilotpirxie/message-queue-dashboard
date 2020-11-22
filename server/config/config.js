module.exports = {
  DB: {
    /**
     * Postgres db name
     */
    NAME: 'consumer',
    /**
     * Db username
     */
    USER: 'postgres',
    /**
     * User password to db
     */
    PASS: 'mysecretpassword',
    /**
     * Potgres host
     */
    HOST: 'localhost',
    /**
     * Postgres port
     */
    PORT: 5432,
  },
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
     * Timeout for message retention
     */
    MESSAGE_RETENTION_PERIOD: 30 * 60,
  },
};
