/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('_resources', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    balance_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: '_balances',
        key: 'id'
      }
    },
    buy_strategy_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: '_strategies',
        key: 'id'
      }
    },
    sell_strategy_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: '_strategies',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    final_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    final_state: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    wave_length: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    trend_alpha: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    smooth_period: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    forecast_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    sell_margin: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    buy_margin: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    short_period: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    long_period: {
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
    },
    demo_balance: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: '_resources'
  });
};
