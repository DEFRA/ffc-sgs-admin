
module.exports = (sequelize, DataTypes) => {
  const stages = sequelize.define('stages', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    nextid: { type: DataTypes.BIGINT },
    businessprocessid: { type: DataTypes.BIGINT },
    usergroups: { type: DataTypes.STRING },
    isstart: { type: DataTypes.BOOLEAN },
    active: { type: DataTypes.BOOLEAN },
    grant_type: { type: DataTypes.STRING, allowNull: false },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'stages'
  })

  stages.associate = function (models) {
    stages.belongsTo(models.usergroups, {
      foreignKey: 'usergroups',
      as: 'usergroup'
    })
    stages.belongsTo(models.businessprocesses, {
      foreignKey: 'businessprocessid',
      as: 'businessprocess'
    })
    stages.hasMany(models.applicationstages, {
      foreignKey: 'stageid',
      as: 'applicationstages'
    })
  }
  return stages
}
