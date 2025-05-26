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

describe('预约系统测试', () => {
  let testUser;
  let testToken;
  let testSchedule;
  let testBooking;

  beforeAll(async () => {
    // 确保数据库连接
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // 清理可能存在的测试数据
    await User.deleteMany({ email: 'test@example.com' });
    await Schedule.deleteMany({});
    await Booking.deleteMany({});

    // 创建测试用户
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      role: 'customer'
    });

    // 获取测试用户的token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    testToken = loginResponse.body.data.token;

    // 创建测试排班
    testSchedule = await Schedule.create({
      classId: new mongoose.Types.ObjectId(),
      instructorId: new mongoose.Types.ObjectId(),
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明天
      endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
      maxCapacity: 10,
      currentBookings: 0,
      room: 'Test Room'
    });

    // 创建测试预约
    testBooking = await Booking.create({
      userId: testUser._id,
      scheduleId: testSchedule._id,
      status: 'confirmed'
    });
  }, 30000);

  afterAll(async () => {
    // 清理测试数据
    await User.deleteMany({});
    await Schedule.deleteMany({});
    await Booking.deleteMany({});
    await mongoose.connection.close();
  });

  describe('DELETE /api/bookings/:bookingId', () => {
    it('应该成功取消自己的预约', async () => {
      const response = await request(app)
        .delete(`/api/bookings/${testBooking._id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('预约已成功取消');
      expect(response.body.data.status).toBe('cancelled');

      // 验证排班可用名额已更新
      const updatedSchedule = await Schedule.findById(testSchedule._id);
      expect(updatedSchedule.currentBookings).toBe(0);
    });

    it('未登录用户应该无法取消预约', async () => {
      await request(app)
        .delete(`/api/bookings/${testBooking._id}`)
        .expect(401);
    });

    it('应该无法取消不存在的预约', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/bookings/${nonExistentId}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('预约不存在');
    });

    it('应该无法取消其他用户的预约', async () => {
      // 创建另一个用户
      const otherUser = await User.create({
        email: 'other@example.com',
        password: 'password123',
        role: 'customer'
      });

      // 获取另一个用户的token
      const otherLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'other@example.com',
          password: 'password123'
        });

      const otherToken = otherLoginResponse.body.data.token;

      const response = await request(app)
        .delete(`/api/bookings/${testBooking._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('无权操作此预约');

      // 清理另一个用户
      await User.deleteOne({ _id: otherUser._id });
    });

    it('应该无法取消已取消的预约', async () => {
      // 先取消预约
      await Booking.findByIdAndUpdate(testBooking._id, { status: 'cancelled' });

      const response = await request(app)
        .delete(`/api/bookings/${testBooking._id}`)
        .set('Authorization', `Bearer ${testToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('只能取消已确认的预约');
    });
  });
});