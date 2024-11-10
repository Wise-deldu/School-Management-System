import { Router } from 'express';
import userRoutes from './userRoutes.js';
import adminRoutes from './admin.js';

const router = Router();

router.use('/users', userRoutes);    // e.g., Login route
router.use('/admin', adminRoutes);   // Admin-specific routes like creating headteacher

// Home route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the School Management System API' });
});

export default router;
