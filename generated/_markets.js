/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('_markets', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    transaction_fee: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    default_hashed_username: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    default_hashed_secret_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    default_hashed_special_key: {
      type: DataTypes.STRING(255),
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
    tableName: '_markets'
  });
};
