/**
 * Custom modules
 */
import { logger } from '@/lib/winston';
import { v2 as cloudinary } from 'cloudinary';
/**
 * Models
 */
import User from '@/models/user';
import Blog from '@/models/blog';

/**
 * Types
 */
import type { Request, Response } from 'express';

const deleteCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    //deleting blogs from database and banner image from Cloudinary
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();
    const publicIds = blogs.map(({banner}) => banner.publicId );

    await cloudinary.api.delete_resources(publicIds);

    logger.info('Multiple Blog Banner Images deleted successfully from Cloudinary', {
      publicIds
    });

    await Blog.deleteMany({ author: userId });

    logger.info('Multiple Blogs deleted successfully deleted from Database', {
      userId,
      blogs
    });

    await User.deleteOne({ _id: userId });

    res.sendStatus(204);

    logger.info('A user account has been deleted', {
      userId,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while deleting current user', err);
  }
};

export default deleteCurrentUser;
