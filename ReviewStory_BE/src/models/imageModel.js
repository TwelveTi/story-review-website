module.exports = (sequelize, DataTypes) => {
  const StoryReviewImage = sequelize.define('StoryReviewImage', {
    reviewId: { type: DataTypes.INTEGER, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'story_review_images'
  });

  StoryReviewImage.associate = (models) => {
    StoryReviewImage.belongsTo(models.StoryReview, { foreignKey: 'reviewId' });
  };

  return StoryReviewImage;
};
