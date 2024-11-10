import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js'; // Import configured sequelize instance

class User extends Model {}

// Define the User model
User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.ENUM('super-admin', 'headteacher', 'teacher', 'student'),
      allowNull: false,
      defaultValue: 'student',
    },
    superAdminActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Used to control if the super-admin is currently active',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    hooks: {
      beforeCreate: async (user) => {
        if (user.role === 'super-admin') {
          user.superAdminActive = true; // Activate super-admin on creation
        }
      },
    },
  }
);

export default User;