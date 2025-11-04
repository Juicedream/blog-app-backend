/**
 * Node Modules
 */
import config from '@/config';
import { timeStamp } from 'console';
import { Router } from 'express';

/**
 * Routes
 */
import authRoutes from '@/routes/v1/auth'

const router = Router();

/**
 * Root route
 */

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    docs: config.DOCS,
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);




export default router;