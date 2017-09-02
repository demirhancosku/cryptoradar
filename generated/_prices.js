/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('_prices', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    symbol: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    market_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    ask: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    bid: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    timestamp: {
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
    tableName: '_prices'
  });
};
