module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    targetId: { type: DataTypes.INTEGER, allowNull: false },
    targetType: { type: DataTypes.ENUM('review', 'comment'), allowNull: false }
  }, {
    tableName: 'likes'
  });

  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Like;
};