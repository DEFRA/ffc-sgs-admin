module.exports = (sequelize, DataTypes) => {
  const entity = sequelize.define('applicationstageresponses', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    applicationstageid: {
      type: DataTypes.BIGINT
    },
    remark: { type: DataTypes.STRING },
    activity: { type: DataTypes.STRING },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'applicationstageresponses'
  })

  entity.associate = function (models) {
    entity.belongsTo(models.applicationstages, {
      foreignKey: 'applicationstageid',
      as: 'applicationstage'
    })
  }
  return entity
}
