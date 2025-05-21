const express = require('express');
const app = express();

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: '欢迎使用健身房预订系统 API' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
});

module.exports = app; 