const sql = require('../config/sequelize');
const Messages = require('./messages')(sql.connection, sql.dataTypes);
const Settings = require('./settings')(sql.connection, sql.dataTypes);

module.exports = {
  Messages,
  Settings,
};
