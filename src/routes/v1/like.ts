/**
 * Node modules
 */
import { Router } from 'express';
import { param } from 'express-validator';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';
/**
 * Controllers
*/
import likeBlog  from '@/controllers/v1/like/like_blog';
import unLikeBlog from '@/controllers/v1/like/unlike_blog';


const router = Router();

router.post(
    '/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    param('blogId')
        .isMongoId()
        .withMessage('Invalid blog ID'),
    validationError,
    likeBlog
);

router.delete(
    '/blog/:blogId',
    authenticate,
    authorize(['admin', 'user']),
    param('blogId')
        .isMongoId()
        .withMessage('Invalid blog ID'),
        validationError,
        unLikeBlog
)



export default router;