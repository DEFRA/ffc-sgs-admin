module.exports = (sequelize, DataTypes) => {
  return sequelize.define('applicationnotes', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    appref: {
      type: DataTypes.STRING
    },
    note: { type: DataTypes.STRING },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'applicationnotes'
  })
}
