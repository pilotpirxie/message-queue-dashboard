module.exports = function (sequelize, DataTypes) {
  return sequelize.define('messages', {
    id: {
      type: DataTypes.INTEGER(11),
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
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    logs: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    consumer: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER(11),
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
