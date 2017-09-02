/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('_alarms', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    resource_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: '_resources',
        key: 'id'
      }
    },
    max: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    min: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: '_alarms'
  });
};
