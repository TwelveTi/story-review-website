const db = require('../models');

class CommentService {
  async createComment(userId, content, reviewId, parentId = null) {
    const newComment = await db.Comment.create({
      content,
      userId,
      reviewId,
      parentId
    });

    const fullComment = await db.Comment.findByPk(newComment.id, {
      include: [{ model: db.User, attributes: ['id', 'fullname', 'username'] }]
    });

    return fullComment;
  }

  async getCommentsByReviewId(reviewId) {
    const comments = await db.Comment.findAll({
      where: { reviewId, parentId: null },
      include: [
        { model: db.User, attributes: ['id', 'fullname', 'username'] },
        { model: db.Comment, as: 'Replies', include: [{ model: db.User, attributes: ['id', 'fullname', 'username'] }] }
      ],
      order: [['createdAt', 'ASC']]
    });

    return comments;
  }

  async updateComment(userId, commentId, content) {
    const comment = await db.Comment.findByPk(commentId);
    if (!comment) throw new Error('Bình luận không tồn tại');
    if (comment.userId !== userId) throw new Error('Không có quyền chỉnh sửa bình luận này');

    comment.content = content;
    await comment.save();

    return comment;
  }

  async deleteComment(userId, commentId) {
    const comment = await db.Comment.findByPk(commentId);
    if (!comment) throw new Error('Bình luận không tồn tại');
    if (comment.userId !== userId) throw new Error('Không có quyền xóa bình luận này');

    await comment.destroy();
  }
}

module.exports = new CommentService();
