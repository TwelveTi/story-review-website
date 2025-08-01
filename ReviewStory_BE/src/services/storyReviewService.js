const db = require('../models');
const cloudinary = require('../configs/cloudinary');
const sharp = require('sharp');

class StoryReviewService {
  async createReview(userId, content, files) {
    if (!content) throw new Error('Content is required');
    if (!files || files.length === 0) throw new Error('At least one image is required');

    // Resize & Upload all images to Cloudinary
    const uploadPromises = files.map(async (file) => {
      const resizedBuffer = await sharp(file.buffer)
        .resize(1080, 1080, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toBuffer();

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }).end(resizedBuffer);
      });
    });

    const uploadResults = await Promise.allSettled(uploadPromises);
    const successfulUploads = uploadResults.filter(r => r.status === 'fulfilled').map(r => r.value);
    if (successfulUploads.length === 0) throw new Error('Failed to upload images');

    // Create StoryReview
    const newReview = await db.StoryReview.create({ content, userId });

    // Create StoryReviewImage
    const imageRecords = successfulUploads.map(url => ({ reviewId: newReview.id, imageUrl: url }));
    await db.StoryReviewImage.bulkCreate(imageRecords);

    return await db.StoryReview.findByPk(newReview.id, {
      include: [
        { model: db.StoryReviewImage, as: 'Images' },
        { model: db.User, attributes: ['id', 'username'] }
      ]
    });
  }

  async getReviews(offset = 0, limit = 10) {
    const { count, rows } = await db.StoryReview.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.StoryReviewImage, as: 'Images' },
        { model: db.User, attributes: ['id', 'username'] }
      ]
    });
    return { total: count, reviews: rows };
  }

 async getReviewById(id) {
  const review = await db.StoryReview.findOne({
    where: { id },
    include: [
      {
        model: db.User,
        attributes: ['id', 'fullname', 'username']
      },
      {
        model: db.StoryReviewImage,
        as: 'Images',
        attributes: ['id', 'imageUrl']
      },
      {
        model: db.Comment,
        as: 'Comments',
        include: [
          {
            model: db.User,
            attributes: ['id', 'fullname', 'username']
          },
          {
            model: db.Comment,  // Replies
            as: 'Replies',
            include: [{
              model: db.User,
              attributes: ['id', 'fullname', 'username']
            }]
          }
        ]
      }
    ]
  });

  return review;
}


  async updateReview(userId, reviewId, content, files) {
    const review = await db.StoryReview.findByPk(reviewId, {
      include: [{ model: db.StoryReviewImage, as: 'Images' }]
    });
    if (!review) throw new Error('Review not found');
    if (review.userId !== userId) throw new Error('Not authorized to edit this review');

    // Update content
    review.content = content || review.content;
    await review.save();

    // If has new images, delete old ones & upload new
    if (files && files.length > 0) {
      // Delete old images from Cloudinary
      await Promise.allSettled(
        review.Images.map(img => {
          const publicId = img.imageUrl.split('/').pop().split('.')[0];
          return cloudinary.uploader.destroy(publicId);
        })
      );

      // Delete old image records
      await db.StoryReviewImage.destroy({ where: { reviewId } });

      // Upload new images
      const uploadPromises = files.map(async (file) => {
        const resizedBuffer = await sharp(file.buffer)
          .resize(1080, 1080, { fit: 'inside' })
          .jpeg({ quality: 80 })
          .toBuffer();

        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
            if (err) return reject(err);
            resolve(result.secure_url);
          }).end(resizedBuffer);
        });
      });

      const uploadResults = await Promise.allSettled(uploadPromises);
      const successfulUploads = uploadResults.filter(r => r.status === 'fulfilled').map(r => r.value);

      const newImageRecords = successfulUploads.map(url => ({ reviewId: review.id, imageUrl: url }));
      await db.StoryReviewImage.bulkCreate(newImageRecords);
    }

    return await db.StoryReview.findByPk(reviewId, {
      include: [
        { model: db.StoryReviewImage, as: 'Images' },
        { model: db.User, attributes: ['id', 'username'] }
      ]
    });
  }

  async deleteReview(userId, reviewId) {
    const review = await db.StoryReview.findByPk(reviewId, {
      include: [{ model: db.StoryReviewImage, as: 'Images' }]
    });
    if (!review) throw new Error('Review not found');
    if (review.userId !== userId) throw new Error('Not authorized to delete this review');

    // Delete images from Cloudinary
    await Promise.allSettled(
      review.Images.map(img => {
        const publicId = img.imageUrl.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(publicId);
      })
    );

    // Delete records in DB
    await db.StoryReviewImage.destroy({ where: { reviewId } });
    await db.Comment.destroy({ where: { reviewId } });
    await db.StoryReview.destroy({ where: { id: reviewId } });
  }
}

module.exports = new StoryReviewService();