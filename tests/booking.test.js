const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/userModel');
const Class = require('../src/models/classModel');
const Schedule = require('../src/models/scheduleModel');
const Booking = require('../src/models/bookingModel');

const ADMIN_EMAIL = 'admin-for-booking@example.com';
const ADMIN_PASSWORD = 'adminpassword123';
const INSTRUCTOR_EMAIL = 'bookingtestinst@example.com';
const INSTRUCTOR_PASSWORD = 'instpassword123';
const CUSTOMER_EMAILS = [
  'bookingtestcustomer1@example.com',
  'bookingtestcustomer2@example.com',
  'bookingtestcustomer3@example.com',
  'bookingtestcustomer4@example.com',
  'bookingtestcustomer5@example.com',
  'bookingtestcustomer6@example.com',
];
const CUSTOMER_PASSWORD = 'customerpassword123';

describe('Booking API Endpoints', () => {
  let adminToken;
  let customerTokens = [];
  let testClassIdForBooking;
  let testScheduleIdForBooking;
  let instructorId;

  beforeAll(async () => {
    // 清理并注册 admin、instructor、6个customer 测试用户
    await User.deleteMany({ email: ADMIN_EMAIL });
    await User.deleteMany({ email: INSTRUCTOR_EMAIL });
    for (const email of CUSTOMER_EMAILS) {
      await User.deleteMany({ email });
    }
    await request(app)
      .post('/api/auth/register')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
    await request(app)
      .post('/api/auth/register')
      .send({ email: INSTRUCTOR_EMAIL, password: INSTRUCTOR_PASSWORD, role: 'instructor' });
    for (const email of CUSTOMER_EMAILS) {
      await request(app)
        .post('/api/auth/register')
        .send({ email, password: CUSTOMER_PASSWORD, role: 'customer' });
    }
    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    adminToken = adminLoginRes.body.data.token;
    customerTokens = [];
    for (const email of CUSTOMER_EMAILS) {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email, password: CUSTOMER_PASSWORD });
      customerTokens.push(loginRes.body.data.token);
    }
    // 获取instructorId
    const instructorUser = await User.findOne({ email: INSTRUCTOR_EMAIL });
    instructorId = instructorUser._id.toString();
    // 创建课程
    await Class.deleteMany({ name: 'Booking Test Class' });
    const classRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Booking Test Class',
        description: 'Booking Test Class Description',
        durationMinutes: 60,
        instructor: instructorId
      });
    if (!classRes.body.data || !classRes.body.data._id) {
      throw new Error('Class creation failed for booking tests.');
    }
    testClassIdForBooking = classRes.body.data._id;
    // 创建排班
    await Schedule.deleteMany({ classId: testClassIdForBooking });
    const now = new Date();
    const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    const scheduleRes = await request(app)
      .post('/api/schedules')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        classId: testClassIdForBooking,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        maxCapacity: 5,
        room: 'Booking Test Room'
      });
    if (!scheduleRes.body.data || !scheduleRes.body.data._id) {
      throw new Error('Schedule creation failed for booking tests.');
    }
    testScheduleIdForBooking = scheduleRes.body.data._id;
  }, 20000);

  describe('POST /api/bookings', () => {
    // 在每个预订测试前，清理该用户对该排班的任何已有预订
    beforeEach(async () => {
      if (testScheduleIdForBooking) {
        await Booking.deleteMany({ scheduleId: testScheduleIdForBooking });
      }
    });
    
    it('should create a new booking for an available schedule slot', async () => {
        if (!testScheduleIdForBooking || customerTokens.length === 0) {
            throw new Error("Cannot run test: testScheduleIdForBooking or customerTokens is not defined.");
          }
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerTokens[0]}`)
        .send({
          scheduleId: testScheduleIdForBooking
        });

      // if (res.status !== 201) {
      //   console.log("Create booking response body:", res.body);
      // }
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('confirmed'); // 或您的API定义的成功状态
      expect(res.body.data.scheduleId).toBe(testScheduleIdForBooking);
    }, 10000);

    it('should fail to create a booking if the schedule slot is full', async () => {
      if (!testScheduleIdForBooking || customerTokens.length < 6) {
        throw new Error("Cannot run test: testScheduleIdForBooking or customerTokens is not defined.");
      }
      // 前5个用户依次预订
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/bookings')
          .set('Authorization', `Bearer ${customerTokens[i]}`)
          .send({ scheduleId: testScheduleIdForBooking });
      }
      // 第6个用户尝试预订，应该会失败 (因为容量是5)
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerTokens[5]}`)
        .send({ scheduleId: testScheduleIdForBooking });
      expect(res.status).toBe(400); // 课程已满
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('课程已满');
    }, 20000);

    it('should return 401 if no token is provided', async () => {
      if (!testScheduleIdForBooking) {
        throw new Error("Cannot run test: testScheduleIdForBooking is not defined.");
      }
      const res = await request(app)
        .post('/api/bookings')
        .send({ scheduleId: testScheduleIdForBooking });
      expect(res.status).toBe(401);
    }, 10000);
  });

  afterAll(async () => {
    await User.deleteMany({ email: ADMIN_EMAIL });
    await User.deleteMany({ email: INSTRUCTOR_EMAIL });
    for (const email of CUSTOMER_EMAILS) {
      await User.deleteMany({ email });
    }
    if (testClassIdForBooking) {
      await Schedule.deleteMany({ classId: testClassIdForBooking });
      await Class.deleteMany({ _id: testClassIdForBooking });
    }
    if (testScheduleIdForBooking) {
      await Booking.deleteMany({ scheduleId: testScheduleIdForBooking });
      await Schedule.deleteMany({ _id: testScheduleIdForBooking });
    }
    await mongoose.connection.close();
  });
});