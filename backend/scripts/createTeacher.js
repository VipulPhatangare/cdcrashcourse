const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
require('dotenv').config();

const createTeacher = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database...');

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email: 'teacher@campusdekho.ai' });

    if (existingTeacher) {
      console.log('Teacher already exists!');
      console.log('Email:', existingTeacher.email);
      process.exit(0);
    }

    // Create new teacher
    const teacher = await Teacher.create({
      name: 'Campus Dekho Teacher',
      email: 'teacher@campusdekho.ai',
      password: 'Teacher@123',
      subject: 'General',
      phone: ''
    });

    console.log('✅ Teacher created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', teacher.email);
    console.log('Password: Teacher@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTeacher();
