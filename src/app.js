const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/database');
const { initializeMembershipPlans } = require('./config/initialData');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/users', userRoutes);

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Gym Booking System API' });
});

// 错误处理
app.use(errorHandler);

// 连接数据库并初始化数据
const initializeApp = async () => {
  try {
    await connectDB();
    await initializeMembershipPlans();
    console.log('Database connected and data initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
};

initializeApp();

module.exports = app; 