/**
 * Node modules
 */
import { v2 as cloudinary } from 'cloudinary';
/**
 * Custom Modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';
import User from '@/models/user';
/**
 * Types
 */
import type { Request, Response } from 'express';

const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { blogId } = req.params;

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId)
      .select('author banner.publicId')
      .lean()
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });

      return;
    }

    if (blog.author !== userId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permission',
      });
      logger.warn('A user tried to delete a blog without permission', {
        userId,
      });

      return;
    }
    // delete cloudinary image
    await cloudinary.uploader.destroy(blog.banner.publicId);

    logger.info('Blog Banner deleted successfully from Cloudinary', {
        publicId: blog.banner.publicId
    });
    
    //delete blog from database
    await Blog.deleteOne({ _id: blogId });
    logger.info('Blog Banner deleted successfully from database', blogId);

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while deleting a blog', err);
  }
};

export default deleteBlog;
