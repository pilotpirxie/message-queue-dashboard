// eslint-disable-next-line func-names
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('messages', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    logs: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    processing_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()'),
    },
  }, {
    tableName: 'messages',
  });
};
