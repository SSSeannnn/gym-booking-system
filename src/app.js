const express = require('express');
const app = express();
const connectDB = require('./config/database');

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: '欢迎使用健身房预订系统 API' });
});

// 错误处理中间件 - 必须放在所有路由之后
const errorHandler = require('./middlewares/errorMiddleware');
app.use(errorHandler);

// 连接数据库
connectDB();

module.exports = app; 