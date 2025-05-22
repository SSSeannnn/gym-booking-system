const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/userModel');
const Class = require('../src/models/classModel'); // 假设课程模型在这里
// const jwt = require('jsonwebtoken'); // 如果不需要在测试中解码token，可以不导入
// const jwtConfig = require('../src/config/jwt.config'); // 同上

const ADMIN_EMAIL = 'classtestadmin@example.com';
const ADMIN_PASSWORD = 'adminpassword123';

describe('Class API Endpoints', () => {
  let adminToken;
  let instructorId; // 假设课程需要一个教练ID

  beforeAll(async () => {
    // 清理并注册 admin 测试用户
    await User.deleteMany({ email: ADMIN_EMAIL });
    // 注册一个普通用户作为教练（如果需要）
    // 或者直接用 admin 用户作为教练，取决于您的业务逻辑
    const instructorUser = await User.findOneAndUpdate(
      { email: 'instructor-class@example.com' },
      { email: 'instructor-class@example.com', password: 'password123', role: 'instructor' }, // 假设有 'instructor' 角色
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    instructorId = instructorUser._id;

    await request(app)
      .post('/api/auth/register')
      .send({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      });
    adminToken = loginRes.body.data.token;

    // 清理之前可能创建的同名测试课程
    await Class.deleteMany({ name: 'Test Class for API' });
  }, 15000); // 增加 beforeAll 的超时时间

  describe('POST /api/classes', () => {
    it('should create a new class when authenticated as admin with all required fields', async () => {
      const res = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Class for API',
          description: 'A comprehensive test description for the class.',
          durationMinutes: 60,
          instructor: instructorId.toString(), // 使用之前创建的教练ID
          maxCapacity: 25 // 假设这是必填字段
          // 添加其他课程模型中定义的必填字段
        });

      // 调试日志，可以根据需要开启或关闭
      // if (res.status !== 201) {
      //   console.log('Create class response body:', res.body);
      // }

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Class for API');
      expect(res.body.data.instructor.toString()).toBe(instructorId.toString());
      expect(res.body.data.maxCapacity).toBe(25);
    }, 10000);

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ // 发送一个缺少字段的请求，例如缺少 name
          description: 'A class missing its name.',
          durationMinutes: 60,
          instructor: instructorId.toString(),
          maxCapacity: 25
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      // 期望有具体的错误信息，例如: expect(res.body.message).toContain('Name is required');
    }, 10000);

    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .post('/api/classes')
        .send({
          name: 'Unauthorized Class',
          description: 'Attempt to create without token.',
          durationMinutes: 30,
          instructor: instructorId.toString(),
          maxCapacity: 10
        });
      expect(res.status).toBe(401); // 或 403，取决于您的 authMiddleware 实现
    }, 10000);

    it('should return 403 if token is for a non-admin user', async () => {
      // 先注册并登录一个普通用户
      await User.deleteMany({ email: 'customer-class@example.com' });
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'customer-class@example.com', password: 'password123', role: 'customer' });
      const customerLoginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'customer-class@example.com', password: 'password123' });
      const customerToken = customerLoginRes.body.data.token;

      const res = await request(app)
        .post('/api/classes')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Forbidden Class',
          description: 'Attempt to create with customer token.',
          durationMinutes: 45,
          instructor: instructorId.toString(),
          maxCapacity: 15
        });
      expect(res.status).toBe(403);
      await User.deleteOne({ email: 'customer-class@example.com' }); // 清理
    }, 10000);
  });

  afterAll(async () => {
    // 清理测试数据
    await User.deleteMany({ email: ADMIN_EMAIL });
    await User.deleteMany({ email: 'instructor-class@example.com' });
    await Class.deleteMany({ name: 'Test Class for API' });
    await Class.deleteMany({ name: 'Unauthorized Class' }); // 如果有可能被创建的话
    await Class.deleteMany({ name: 'Forbidden Class' });   // 如果有可能被创建的话
    await mongoose.connection.close();
  });
});