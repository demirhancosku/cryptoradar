/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('_balances', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: '_accounts',
        key: 'id'
      }
    },
    market_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: '_markets',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    symbol: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hashed_username: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hashed_secret_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hashed_special_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
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
    tableName: '_balances'
  });
};
