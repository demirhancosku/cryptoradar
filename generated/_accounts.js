/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('_accounts', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    telegram_on: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    bot_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    chat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    created_at: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: '_accounts'
  });
};
