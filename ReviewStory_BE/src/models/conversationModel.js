module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    user1Id: { type: DataTypes.INTEGER, allowNull: false },
    user2Id: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'conversations'
  });

  Conversation.associate = (models) => {
    Conversation.hasMany(models.Message, { foreignKey: 'conversationId' });
    Conversation.belongsTo(models.User, { as: 'User1', foreignKey: 'user1Id' });
    Conversation.belongsTo(models.User, { as: 'User2', foreignKey: 'user2Id' });
  };

  return Conversation;
};