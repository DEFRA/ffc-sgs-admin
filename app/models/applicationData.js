
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('applications', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true
    },
    reference: {
      type: DataTypes.STRING,
      primaryKey: true,
      set (val) {
        this.setDataValue('reference', val.toUpperCase())
      }
    },
    grant_type: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    data: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'applications'
  })
}
