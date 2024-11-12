import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const login = async (req, res) => {
  const { firstname, lastname, password } = req.body; // Adjusted to use firstname and lastname
  try {
    // Search for user based on firstname and lastname
    const user = await User.findOne({ 
      where: { firstname, lastname } 
    });

    // Check if the user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the headteacher needs to change their password
    if (user.role === 'headteacher' && user.needsPasswordChange) {
      return res.status(200).json({ 
        message: 'Password change required',
        needsPasswordChange: true
      });
    }

    // Generate JWT token if login is successful and password change is not required
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};