module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    conversationId: { type: DataTypes.INTEGER, allowNull: false },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false }
  }, {
    tableName: 'messages'
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Conversation, { foreignKey: 'conversationId' });
    Message.belongsTo(models.User, { foreignKey: 'senderId' });
  };

  return Message;
};