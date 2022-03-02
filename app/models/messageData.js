
module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define('messages', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    subject: { type: DataTypes.STRING },
    data: { type: DataTypes.STRING },
    appref: { type: DataTypes.STRING, allowNull: false },
    grant_type: { type: DataTypes.STRING, allowNull: false },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'messages'
  })

  messages.associate = function (models) {
    messages.belongsTo(models.applications, {
      foreignKey: 'appref',
      as: 'application'
    })
  }
  return messages
}
