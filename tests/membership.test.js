const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/userModel');
const MembershipPlan = require('../src/models/membershipPlanModel');

describe('会员系统测试', () => {
  let testUser;
  let testToken;
  let testPlan;

  beforeAll(async () => {
    // 确保数据库连接
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // 创建测试会员计划
    testPlan = await MembershipPlan.create({
      name: '测试月度会员',
      durationDays: 30,
      price: 99,
      description: '测试用月度会员计划',
      features: ['基础功能'],
      isActive: true
    });

    // 创建测试用户
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      role: 'customer',
      membership: {
        status: 'active',
        type: 'monthly',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        planId: testPlan._id,
        autoRenew: true
      }
    });

    // 获取测试用户的token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    testToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    // 清理测试数据
    await User.deleteMany({});
    await MembershipPlan.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/memberships/plans', () => {
    it('应该返回所有可用的会员计划', async () => {
      const response = await request(app)
        .get('/api/memberships/plans')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('price');
    });
  });

  describe('GET /api/memberships/me/membership', () => {
    it('应该返回当前用户的会员状态', async () => {
      const response = await request(app)
        .get('/api/memberships/me/membership')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'active');
      expect(response.body.data).toHaveProperty('type', 'monthly');
      expect(response.body.data).toHaveProperty('endDate');
    });

    it('未登录用户应该无法访问会员状态', async () => {
      await request(app)
        .get('/api/memberships/me/membership')
        .expect(401);
    });
  });

  describe('POST /api/memberships/me/membership/cancel', () => {
    it('应该成功取消会员订阅', async () => {
      const response = await request(app)
        .post('/api/memberships/me/membership/cancel')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.membership).toHaveProperty('status', 'cancelled');
      expect(response.body.data.membership).toHaveProperty('autoRenew', false);
    });

    it('未登录用户应该无法取消会员订阅', async () => {
      await request(app)
        .post('/api/memberships/me/membership/cancel')
        .expect(401);
    });
  });

  describe('POST /api/memberships/me/membership/renew', () => {
    it('应该成功续订会员', async () => {
      const response = await request(app)
        .post('/api/memberships/me/membership/renew')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ planId: testPlan._id })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.membership).toHaveProperty('status', 'active');
      expect(response.body.data.membership).toHaveProperty('autoRenew', true);
      expect(response.body.data.membership).toHaveProperty('planId', testPlan._id.toString());
    });

    it('使用无效的会员计划ID应该返回错误', async () => {
      const response = await request(app)
        .post('/api/memberships/me/membership/renew')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ planId: 'invalid_plan_id' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('无效的会员计划');
    });

    it('未登录用户应该无法续订会员', async () => {
      await request(app)
        .post('/api/memberships/me/membership/renew')
        .send({ planId: testPlan._id })
        .expect(401);
    });
  });
}); 