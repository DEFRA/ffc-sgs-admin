
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('equipments', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    amount: { type: DataTypes.NUMBER },
    quantity: { type: DataTypes.INTEGER },
    grant_type: { type: DataTypes.STRING },
    categoryid: { type: DataTypes.BIGINT },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'equipments'
  })
}
