
const Sequelize = require("sequelize");
const sequelize = require("../configs/database");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


// Import models
db.User = require("./userModel")(sequelize, Sequelize.DataTypes);
db.Like = require("./likeModel")(sequelize, Sequelize.DataTypes);
db.Comment = require("./commentModel")(sequelize, Sequelize.DataTypes);
db.Conversation = require("./conversationModel")(sequelize, Sequelize.DataTypes);
db.StoryReviewImage = require("./imageModel")(sequelize, Sequelize.DataTypes);
db.Message = require("./messageModel")(sequelize, Sequelize.DataTypes);
db.StoryReview = require("./storyReviewModel")(sequelize, Sequelize.DataTypes);


// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;