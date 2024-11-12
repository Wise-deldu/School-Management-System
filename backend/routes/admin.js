import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { generateStaffID } from '../helpers/generateStaffID.js';
import { generateTemporaryPassword } from '../helpers/generateTemporaryPassword.js';
import { sendEmail } from '../helpers/sendEmail.js';
import validator from 'validator';

const router = express.Router();

// Route to create headteacher
router.post('/create-headteacher', async (req, res) => {
  try {
    const { firstname, middlename, lastname, gender, contact, email } = req.body;

    // Log req.body for debugging
    console.log('Request Body:', req.body);

    // Validate required fields
    if (!firstname || !lastname || !gender || !contact || !email) {
      return res.status(400).json({ message: 'All fields except middlename are required.' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Find the active super admin
    const superAdmin = await User.findOne({ where: { role: 'super-admin', superAdminActive: true } });
    if (!superAdmin) {
      return res.status(403).json({ message: 'Super Admin access required to create a headteacher.' });
    }

    // Generate a unique staffID for the headteacher
    const staffID = await generateStaffID();

    // Generate a temporary password for the headteacher
    const temporaryPassword = generateTemporaryPassword();

    // Hash the temporary password
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Create the headteacher user with active status and needsPasswordChange flag
    const headteacher = await User.create({
      firstname,
      middlename,
      lastname,
      gender,
      contact,
      email,
      password: hashedPassword,
      role: 'headteacher',
      isActive: true,
      staffID,
      needsPasswordChange: true,
    });

    // Deactivate the super admin
    await superAdmin.update({ superAdminActive: false });

    // Send an email to the headteacher with their staffID and temporary password
    const emailSubject = 'Headteacher Account Created';
    const emailMessage = `
      Dear ${headteacher.firstname} ${headteacher.lastname},

      Your headteacher account has been successfully created.
      - Staff ID: ${headteacher.staffID}
      - Temporary Password: ${temporaryPassword}

      Please change your password upon your first login.

      Best regards,
      School Management System
    `;

    // Ensure email is properly extracted from req.body
    console.log('Sending email to:', email);

    // Validate email before sending
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required.' });
    }

    // Send the email to the headteacher
    await sendEmail(email, emailSubject, emailMessage);

    // Send response with created headteacher details
    res.status(201).json({
      message: 'Headteacher created, Super Admin deactivated, and email sent.',
      headteacher: {
        firstname: headteacher.firstname,
        middlename: headteacher.middlename,
        lastname: headteacher.lastname,
        gender: headteacher.gender,
        contact: headteacher.contact,
        email: headteacher.email,
        staffID: headteacher.staffID,
        role: headteacher.role,
        isActive: headteacher.isActive,
      },
    });
  } catch (error) {
    console.error('Error creating headteacher:', error);

    // Error handling for specific cases, like failed email sending
    if (error.message.includes('Email sending failed')) {
      return res.status(500).json({ message: 'Failed to send email to headteacher.' });
    }

    res.status(500).json({ message: 'Error creating headteacher.' });
  }
});

// Route to change password
router.post('/change-password', async (req, res) => {
  const { staffID, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { staffID } });
    if (!user || user.role !== 'headteacher') {
      return res.status(404).json({ message: 'Headteacher not found' });
    }

    if (!user.needsPasswordChange) {
      return res.status(400).json({ message: 'Password change is not required' });
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashedPassword,
      needsPasswordChange: false,
    });

    res.status(200).json({ message: 'Password successfully updated' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to create a teacher by the headteacher
router.post('/create-teacher', async (req, res) => {
  try {
    const { firstname, middlename, lastname, gender, contact, email, class: teacherClass } = req.body;

    const headteacher = await User.findOne({ where: { role: 'headteacher', email: req.user.email }});
    if (!headteacher) {
      return res.status(403).json({ message: 'Only the headteacher can add teachers.' });
    }

    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    const staffID = await generateStaffID();

    const teacher = await User.create({
      firstname,
      middlename,
      lastname,
      class: teacherClass,
      gender,
      contact,
      email,
      password: hashedPassword,
      role: 'teacher',
      isActive: true,
      staffID,
      needsPasswordChange: true,
    });

    const emailSubject = 'Your Teacher Account Created';
    const emailMessage = `
      Dear ${teacher.firstname} ${teacher.lastname},

      Your teacher account has been successfully created.
      - Staff ID: ${teacher.staffID}
      - Temporary Password: ${temporaryPassword}

      Please change your password upon your first login.

      Best regards,
      School Management System
    `;
    await sendEmail(teacher.email, emailSubject, emailMessage);

    res.status(201).json({
      message: 'Teacher created successfully and email sent.',
      teacher: {
        firstname: teacher.firstname,
        lastname: teacher.lastname,
        staffID: teacher.staffID,
        role: teacher.role,
        needsPasswordChange: teacher.needsPasswordChange,
      },
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ message: 'Error creating teacher.' });
  }
});

export default router;
