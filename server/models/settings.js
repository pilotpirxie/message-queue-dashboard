// eslint-disable-next-line func-names
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('settings', {
    key: {
      type: DataTypes.STRING(),
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING(),
      allowNull: false,
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
    tableName: 'settings',
  });
};
