import { Router } from 'express';
import adminRoutes from './admin.js';
import teacherRoutes from './teacherRoutes.js';  // Import teacherRoutes
import { login } from '../controllers/adminController.js';

const router = Router();

router.post('/login', login);   // Login route
router.use('/admin', adminRoutes);   // Admin-specific routes like creating headteacher
router.use('/teacher', teacherRoutes);   // Teacher-specific routes like creating teacher

// Home route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the School Management System API' });
});

export default router;
