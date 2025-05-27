const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./src/models/userModel');

const MONGODB_URI = 'mongodb+srv://sean73282:sean73282@cluster0.ez9yhas.mongodb.net/gym-booking?retryWrites=true&w=majority&appName=Cluster0';

async function createAdminUser() {
  try {
    // 连接到数据库
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 创建管理员用户
    const adminUser = new User({
      username: 'admin',
      email: 'admin@gym.com',
      password: 'admin123',
      role: 'admin'
    });

    // 保存用户（密码会在保存时自动加密）
    await adminUser.save();
    console.log('Admin user created successfully');

    // 断开数据库连接
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdminUser(); 