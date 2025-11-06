/**
 * Custom Modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';
import Like from '@/models/like';
/**
 * Types
 */
import type { Request, Response } from 'express';

const unLikeBlog = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params;
  const userId = req.userId;
  try {
    const blog = await Blog.findById(blogId).select('likesCount').exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });

      return;
    }
    const existingLike = await Like.findOne({ blogId, userId }).lean().exec();
    console.log(existingLike);
    if (!existingLike) {
      res.status(400).json({
        code: 'BadRequest',
        message: 'You already unliked or have not liked this blog',
      });
      return;
    }


    await Like.deleteOne({ blogId, userId });
    blog.likesCount--;
    await blog.save();
    logger.info('Blog unliked successfully by', {
      userId,
      blogId,
      likesCount: blog.likesCount,
    });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while unliking a blog', err);
  }
};

export default unLikeBlog;
