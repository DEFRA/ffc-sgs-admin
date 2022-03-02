
module.exports = (sequelize, DataTypes) => {
  const applicationstages = sequelize.define('applicationstages', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    appref: { type: DataTypes.STRING },
    stageid: {
      type: DataTypes.BIGINT
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    status: DataTypes.STRING,
    sla: DataTypes.STRING,
    assignedTo: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'applicationstages'
  })

  applicationstages.associate = function (models) {
    applicationstages.belongsTo(models.stages, {
      foreignKey: 'stageid',
      as: 'stage'
    })
    applicationstages.hasMany(models.applicationstageresponses, {
      foreignKey: 'applicationstageid',
      as: 'applicationstageresponses'
    })
  }
  return applicationstages
}
