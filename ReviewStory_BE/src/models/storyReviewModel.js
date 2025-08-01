module.exports = (sequelize, DataTypes) => {
  const StoryReview = sequelize.define('StoryReview', {
    content: { type: DataTypes.TEXT, allowNull: false },
    isReported: { type: DataTypes.BOOLEAN, defaultValue: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'story_reviews'
  });

  StoryReview.associate = (models) => {
    StoryReview.belongsTo(models.User, { foreignKey: 'userId' });
    StoryReview.hasMany(models.Comment, { foreignKey: 'reviewId' });
    StoryReview.hasMany(models.StoryReviewImage, { foreignKey: 'reviewId', as: 'Images' });
  };

  return StoryReview;
};