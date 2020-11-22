const { Sequelize } = require('sequelize');
const config = require('./config');

/**
 * Connection handler
 *
 * @type {Sequelize | Model<any, *> | Transaction | BelongsTo<Model, Model>}
 */
const sql = new Sequelize(
  config.DB.NAME,
  config.DB.USER,
  config.DB.PASS,
  {
    dialect: 'postgres',
    host: config.DB.HOST,
    port: config.DB.PORT,
    define: {
      underscored: true,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_unicode_ci',
      },
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

/**
 * Check if connection with db is established correctly
 *
 * @param connection
 * @param callback
 */
function testConnection(connection = sql, callback = () => {}) {
  connection.authenticate().then(() => {
    // eslint-disable-next-line no-console
    console.info('Connection has been established successfully');
    callback();
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
}

module.exports = {
  testConnection,
  connection: sql,
  dataTypes: Sequelize.DataTypes,
};
