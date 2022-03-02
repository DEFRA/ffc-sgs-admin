
module.exports = (sequelize, DataTypes) => {
  const entity = sequelize.define('businessprocesses', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    grant_type: { type: DataTypes.STRING },
    nextid: { type: DataTypes.BIGINT },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'businessprocesses'
  })

  entity.associate = function (models) {
    entity.belongsTo(models.businessprocesses, {
      foreignKey: 'nextid',
      as: 'businessprocess'
    })
  }
  return entity
}
