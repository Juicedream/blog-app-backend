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

const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    //deleting blogs from database and banner image from Cloudinary
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();
    const publicIds = blogs.map(({ banner }) => banner.publicId);

    await cloudinary.api.delete_resources(publicIds);

    logger.info(
      'Multiple Blog Banner Images deleted successfully from Cloudinary',
      {
        publicIds,
      },
    );

    await Blog.deleteMany({ author: userId });

    logger.info('Multiple Blogs deleted successfully deleted from Database', {
      userId,
      blogs,
    });

    // deleting user
    const user = await User.findById(userId).select('-__v').exec();
    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    await User.deleteOne({ _id: userId });

    logger.info('A User has been deleted successfully', { userId, user });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while deleting user by id', err);
  }
};

export default deleteUserById;
