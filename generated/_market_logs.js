/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('_market_logs', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    resource_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: '_resources',
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
    order_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    symbol: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    value: {
      type: DataTypes.FLOAT,
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
    },
    action: {
      type: DataTypes.STRING(11),
      allowNull: true
    }
  }, {
    tableName: '_market_logs'
  });
};
