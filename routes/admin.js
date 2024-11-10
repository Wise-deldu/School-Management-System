import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

const router = express.Router();

// Route to create headteacher
router.post('/create-headteacher', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the active super admin
    const superAdmin = await User.findOne({ where: { role: 'super-admin', superAdminActive: true } });
    if (!superAdmin) {
      return res.status(403).json({ message: 'Super Admin access required to create a headteacher.' });
    }

    // Hash the headteacher's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the headteacher user with active status
    const headteacher = await User.create({
      username,
      password: hashedPassword,
      role: 'headteacher',
      isActive: true, // Ensure headteacher is set to active
    });

    // Deactivate the super admin
    await superAdmin.update({ superAdminActive: false });

    res.status(201).json({
      message: 'Headteacher created, Super Admin deactivated.',
      headteacher: {
        username: headteacher.username,
        role: headteacher.role,
        isActive: headteacher.isActive,
      },
    });
  } catch (error) {
    console.error('Error creating headteacher:', error);
    res.status(500).json({ message: 'Error creating headteacher.' });
  }
});

export default router;
