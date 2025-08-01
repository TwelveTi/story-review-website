const express = require('express');
const route = express.Router();
const StoryReviewController = require('../controllers/storyReviewController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const upload = require('../middlewares/uploadMiddleware');

route.use(AuthMiddleware.verifyToken); 

route.post('/',upload.array('images', 5), StoryReviewController.createReview);
route.get('/', StoryReviewController.getReviews);
route.get('/:id', StoryReviewController.getReviewById);
route.put('/:id',upload.array('images', 5),StoryReviewController.updateReview);
route.delete('/:id',StoryReviewController.deleteReview);

module.exports = route;
