module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    reviewId: { type: DataTypes.INTEGER, allowNull: false },
    parentId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    tableName: 'comments'
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'userId' });
    Comment.belongsTo(models.StoryReview, { foreignKey: 'reviewId' });
    Comment.belongsTo(models.Comment, { as: 'Parent', foreignKey: 'parentId' });
    Comment.hasMany(models.Comment, { as: 'Replies', foreignKey: 'parentId' });
  };

  return Comment;
};