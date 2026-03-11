const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@campusdekho.ai' });
    
    if (existingAdmin) {
      console.log('❌ Admin already exists!');
      console.log('Email:', existingAdmin.email);
      process.exit(0);
    }
    
    // Create new admin
    const admin = await Admin.create({
      email: 'admin@campusdekho.ai',
      password: 'Admin@123',
      role: 'admin'
    });
    
    console.log('✅ Admin created successfully!');
    console.log('');
    console.log('Admin Credentials:');
    console.log('==================');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123');
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
