const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

// Load environment variables
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@campusdekho.ai' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      console.log('Email:', existingAdmin.email);
      process.exit(0);
    }

    // Create new admin
    const admin = await Admin.create({
      email: 'admin@campusdekho.ai',
      password: 'admin123456',
      role: 'admin'
    });

    console.log('\n🎉 Admin created successfully!\n');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123456');
    console.log('\n⚠️  IMPORTANT: Please change the password after first login!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the function
createAdmin();
