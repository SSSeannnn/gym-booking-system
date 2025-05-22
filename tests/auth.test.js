const request = require('supertest');
const app = require('../src/app'); // 假设 app.js 在 src 目录下
const mongoose = require('mongoose');
const User = require('../src/models/userModel'); // 假设 userModel.js 在 src/models 目录下

describe('Authentication API Endpoints', () => {
  // 在所有测试开始前连接数据库 (如果 app.js 没有自动连接的话)
  // Mongoose 通常在 app.js 或 server.js 中已经连接，这里可能不需要重复连接
  // 但为了测试的独立性，有时会单独处理。
  // 我们假设 Mongoose 的连接由应用本身在启动时管理。

  beforeAll(async () => {
    // 清理可能存在的测试用户，避免唯一索引冲突
    // 确保数据库已连接才能执行此操作
    try {
      await User.deleteMany({ email: 'test@example.com' });
      await User.deleteMany({ email: 'test-login@example.com' }); // 为登录测试准备不同的用户
    } catch (error) {
      // console.error("Error cleaning up users before auth tests:", error);
      // 如果数据库尚未连接，这里可能会出错，但通常测试框架的 app 初始化会处理连接
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          // role 默认为 'customer'，可以不显式发送，除非想测试指定 role
        });
      expect(res.status).toBe(201); // 201 Created 通常更适合注册成功
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.user.role).toBe('customer'); // 验证默认角色
      expect(res.body.data.token).toBeDefined(); // 注册后通常会返回 token
    }, 10000); // 增加超时时间

    it('should fail to register with an existing email', async () => {
      // 先注册一个用户
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'existing@example.com', password: 'password123' });
      // 尝试用相同 email 再次注册
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'existing@example.com', password: 'anotherpassword' });
      expect(res.status).toBe(400); // 或 409 Conflict
      expect(res.body.success).toBe(false);
      // 期望有具体的错误信息，例如: expect(res.body.message).toContain('Email already exists');
      await User.deleteOne({ email: 'existing@example.com' }); // 清理
    }, 10000);
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // 为登录测试创建一个用户
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test-login@example.com',
          password: 'password123',
          role: 'customer'
        });
    });

    it('should login an existing user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-login@example.com',
          password: 'password123'
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test-login@example.com');
      expect(res.body.data.token).toBeDefined();
    }, 10000);

    it('should fail to login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-login@example.com',
          password: 'wrongpassword'
        });
      expect(res.status).toBe(401); // Unauthorized
      expect(res.body.success).toBe(false);
      // 期望有具体的错误信息
    }, 10000);

    it('should fail to login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      expect(res.status).toBe(401); // Unauthorized
      expect(res.body.success).toBe(false);
      // 期望有具体的错误信息
    }, 10000);
  });

  afterAll(async () => {
    // 清理测试数据
    await User.deleteMany({ email: 'test@example.com' });
    await User.deleteMany({ email: 'test-login@example.com' });
    // 关闭数据库连接，确保 Jest 能正常退出
    // 如果 mongoose 连接在 app.js 中管理，并且在应用关闭时会自动关闭，这里可能不需要手动关闭。
    // 但显式关闭通常是更安全的做法，以避免 Jest 报 "open handles" 错误。
    await mongoose.connection.close();
  });
});