const express = require('express');
const route = express.Router();
const CommentController = require('../controllers/commentController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

// Áp dụng xác thực cho toàn bộ route comment
route.use(AuthMiddleware.verifyToken);


route.post('/', CommentController.createComment); 
route.get('/:reviewId', CommentController.getComments); 
route.put('/:id', CommentController.updateComment); 
route.delete('/:id', CommentController.deleteComment); 

module.exports = route;
