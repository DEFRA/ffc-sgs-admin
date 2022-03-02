
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('grants', {
    key: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: { type: DataTypes.STRING },
    data: DataTypes.STRING,
    grant_type: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    maxgrantamount: { type: DataTypes.NUMBER },
    mingrantamount: { type: DataTypes.NUMBER },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'grants'
  })
}
