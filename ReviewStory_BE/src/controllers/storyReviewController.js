const multer = require('multer');
const StoryReviewService = require('../services/storyReviewService');
const ApiResponse = require('../utils/ApiResponse');

class StoryReviewController {
  async createReview(req, res) {
  try {
    const { content, groupId } = req.body;
    const userId = req.user.id;
    const files = req.files || []; 

    if (files.length === 0) {
      return ApiResponse.error(res, 'Vui lòng thêm ít nhất 1 ảnh cho bài viết', 401);
    }


    if (files.some(file => !file.mimetype.startsWith('image/'))) {
      return ApiResponse.error(res, 'Chỉ chấp nhận file hình ảnh', 401);
    }


    const newReview = await StoryReviewService.createReview(userId, content, files, groupId);


    const io = req.app.get('io');
    if (groupId) {
      io.to(`group_${groupId}`).emit('new-review', newReview);
    } else {
      io.to('home_room').emit('new-review', newReview);
    }

    return ApiResponse.success(res, 'Tạo bài viết thành công', newReview);
  } catch (error) {
    if (error instanceof multer.MulterError || error.message.includes('Chỉ chấp nhận file hình ảnh')) {
      return ApiResponse.error(res, error.message, 401);
    }
    return ApiResponse.error(res, error.message, 500);
  }
}

  async getReviews(req, res) {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const result = await StoryReviewService.getReviews(offset, limit);

      return ApiResponse.success(res, 'Lấy danh sách bài viết thành công', result);
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  }
  async getReviewById(req, res) {
  try {
    const { id } = req.params;
    const review = await StoryReviewService.getReviewById(id);
    if (!review) {
      return ApiResponse.error(res, 'Bài viết không tồn tại', 404);
    }
    return ApiResponse.success(res, 'Lấy chi tiết bài viết thành công', review);
  } catch (error) {
    return ApiResponse.error(res, error.message, 500);
  }
}


  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.id;
      const files = req.files || []; // Nếu không có file thì là mảng rỗng

      // Validate file nếu có upload
      if (files.length > 0) {
        if (files.some(file => !file.mimetype.startsWith('image/'))) {
          return ApiResponse.error(res, 'Chỉ chấp nhận file hình ảnh', 401);
        }
      }

      const updatedReview = await StoryReviewService.updateReview(userId, id, content, files);

      return ApiResponse.success(res, 'Cập nhật bài viết thành công', updatedReview);
    } catch (error) {
      if (error instanceof multer.MulterError || error.message.includes('Chỉ chấp nhận file hình ảnh')) {
        return ApiResponse.error(res, error.message, 401);
      }
      return ApiResponse.error(res, error.message, 500);
    }
  }

  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await StoryReviewService.deleteReview(userId, id);

      return ApiResponse.success(res, 'Xóa bài viết thành công');
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  }
}

module.exports = new StoryReviewController();
