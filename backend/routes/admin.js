import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { generateStaffID } from '../helpers/generateStaffID.js';

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

    // Generate a unique staffID for the headteacher
    const staffID = await generateStaffID();

    // Create the headteacher user with active status and needsPasswordChange flag
    const headteacher = await User.create({
      username,
      password: hashedPassword,
      role: 'headteacher',
      isActive: true, // Ensure headteacher is set to active
      staffID, // Assign generated staffID
      needsPasswordChange: true // Set flag for password change after first login
    });

    // Deactivate the super admin
    await superAdmin.update({ superAdminActive: false });

    res.status(201).json({
      message: 'Headteacher created, Super Admin deactivated.',
      headteacher: {
        username: headteacher.username,
        role: headteacher.role,
        isActive: headteacher.isActive,
        staffID: headteacher.staffID, // Include staffID in response
      },
    });
  } catch (error) {
    console.error('Error creating headteacher:', error);
    res.status(500).json({ message: 'Error creating headteacher.' });
  }
});


// route to change password
router.post('/change-password', async (req, res) => {
  const { staffID, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { staffID } });
    if (!user || user.role !== 'headteacher') {
      return res.status(404).json({ message: 'Headteacher not found' });
    }

    // Check if the headteacher is required to change the password
    if (!user.needsPasswordChange) {
      return res.status(400).json({ message: 'Password change is not required' });
    }

    // Verify old password
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and set needsPasswordChange to false
    await user.update({ 
      password: hashedPassword,
      needsPasswordChange: false, // No longer need to change the password
    });

    res.status(200).json({ message: 'Password successfully updated' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
