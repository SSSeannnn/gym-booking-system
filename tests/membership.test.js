const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/userModel');
const MembershipPlan = require('../src/models/membershipPlanModel');

describe('Membership System Tests', () => {
  let testUser;
  let testToken;
  let testPlan;

  beforeAll(async () => {
    // Ensure database connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Create test membership plan
    testPlan = await MembershipPlan.create({
      name: 'Test Monthly Membership',
      durationDays: 30,
      price: 99,
      description: 'Test monthly membership plan',
      features: ['Basic features'],
      isActive: true
    });

    // Create test user
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

    // Get test user's token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    testToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await MembershipPlan.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/memberships/plans', () => {
    it('should return all available membership plans', async () => {
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
    it('should return the current user\'s membership status', async () => {
      const response = await request(app)
        .get('/api/memberships/me/membership')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('status', 'active');
      expect(response.body.data).toHaveProperty('type', 'monthly');
      expect(response.body.data).toHaveProperty('endDate');
    });

    it('unauthenticated users should not be able to access membership status', async () => {
      await request(app)
        .get('/api/memberships/me/membership')
        .expect(401);
    });
  });

  describe('POST /api/memberships/me/membership/cancel', () => {
    it('should successfully cancel membership subscription', async () => {
      const response = await request(app)
        .post('/api/memberships/me/membership/cancel')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.membership).toHaveProperty('status', 'cancelled');
      expect(response.body.data.membership).toHaveProperty('autoRenew', false);
    });

    it('unauthenticated users should not be able to cancel membership subscription', async () => {
      await request(app)
        .post('/api/memberships/me/membership/cancel')
        .expect(401);
    });
  });

  describe('POST /api/memberships/me/membership/renew', () => {
    it('should successfully renew membership', async () => {
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

    it('should return an error when using an invalid membership plan ID', async () => {
      const response = await request(app)
        .post('/api/memberships/me/membership/renew')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ planId: 'invalid_plan_id' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid membership plan');
    });

    it('unauthenticated users should not be able to renew membership', async () => {
      await request(app)
        .post('/api/memberships/me/membership/renew')
        .send({ planId: testPlan._id })
        .expect(401);
    });
  });
}); 