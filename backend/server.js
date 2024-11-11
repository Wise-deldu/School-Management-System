import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import routes from './routes/index.js';
import User from './models/user.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;

app.use(express.json());
app.use('/', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

export default async function seedSuperAdmin() {
  try {
    console.log('Checking for super admin user...');
    const superAdmin = await User.findOne({ where: { role: 'super-admin' } });
    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
      await User.create({
        username: process.env.SUPER_ADMIN_USERNAME,
        password: hashedPassword,
        role: 'super-admin',
        superAdminActive: true,
      });
      console.log('Super admin user created.');
    } else {
      console.log('Super admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding super admin:', error);
  }
}

// Start the server
const startServer = async () => {
  await seedSuperAdmin();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
};

startServer();
