module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    fullname: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' },
    refreshToken: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'users'
  });

  User.associate = (models) => {
    User.hasMany(models.StoryReview, { foreignKey: 'userId' });
    User.hasMany(models.Comment, { foreignKey: 'userId' });
    User.hasMany(models.Like, { foreignKey: 'userId' });
    User.hasMany(models.Conversation, { foreignKey: 'user1Id', as: 'ConversationsAsUser1' });
    User.hasMany(models.Conversation, { foreignKey: 'user2Id', as: 'ConversationsAsUser2' });
    User.hasMany(models.Message, { foreignKey: 'senderId' });
  };

  return User;
};