const CommentService = require('../services/commentService');
const ApiResponse = require('../utils/ApiResponse');

class CommentController {
  async createComment(req, res) {
    try {
      const { content, reviewId, parentId } = req.body;
      const userId = req.user.id;

      const newComment = await CommentService.createComment(userId, content, reviewId, parentId);

      // Emit tới Room bài viết
      const io = req.app.get('io');
      io.to(`review_comment_${reviewId}`).emit('receive_comment', newComment);

      return ApiResponse.success(res, 'Bình luận thành công', newComment);
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  async getComments(req, res) {
    try {
      const { reviewId } = req.params;
      const comments = await CommentService.getCommentsByReviewId(reviewId);
      return ApiResponse.success(res, 'Lấy danh sách bình luận thành công', comments);
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      const updatedComment = await CommentService.updateComment(userId, id, content);
      return ApiResponse.success(res, 'Cập nhật bình luận thành công', updatedComment);
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }

  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await CommentService.deleteComment(userId, id);
      return ApiResponse.success(res, 'Xóa bình luận thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message, 401);
    }
  }
}

module.exports = new CommentController();
