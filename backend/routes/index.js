import { Router } from 'express';
import adminRoutes from './admin.js';
import { login } from '../controllers/userController.js';

const router = Router();

router.post('/login', login);   // e.g., Login route
router.use('/admin', adminRoutes);   // Admin-specific routes like creating headteacher


// Home route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the School Management System API' });
});

export default router;
