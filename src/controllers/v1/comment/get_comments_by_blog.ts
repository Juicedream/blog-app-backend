/**
 * Custom Modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';
import Comment from '@/models/comment';
/**
 * Types
 */
import type { Request, Response } from 'express';


const getCommentsByBlog = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params;
  const userId = req.userId;
  try {
    const blog = await Blog.findById(blogId).select('_id').lean().exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });

      return;
    }
    const allComments = await Comment.find({ blogId }).sort({ createdAt: -1 }).lean().exec();

    logger.info(`All comments for blogId:${blogId} fetched successfully.`, {
     allComments,
    });

    res.status(200).json({
        allComments,
    })
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while getting comments on a blog', err);
  }
};

export default getCommentsByBlog;
