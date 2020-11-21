const sql = require('../config/sequelize');
const Messages = require('./messages')(sql.connection, sql.dataTypes);

module.exports = {
  Messages
}
