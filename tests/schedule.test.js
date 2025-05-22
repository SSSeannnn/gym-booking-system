const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/userModel');
const Class = require('../src/models/classModel'); // 引入Class模型
const Schedule = require('../src/models/scheduleModel'); // 引入Schedule模型

const ADMIN_EMAIL_SCHEDULE = 'scheduletestadmin@example.com';
const ADMIN_PASSWORD_SCHEDULE = 'adminpassword123';
const INSTRUCTOR_EMAIL = 'scheduletestinst@example.com';
const INSTRUCTOR_PASSWORD = 'instpassword123';

describe('Schedule API Endpoints', () => {
  let adminToken;
  let testClassId;
  let instructorId;

  beforeAll(async () => {
    // 清理并注册 admin 测试用户
    await User.deleteMany({ email: ADMIN_EMAIL_SCHEDULE });
    await User.deleteMany({ email: INSTRUCTOR_EMAIL });
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: ADMIN_EMAIL_SCHEDULE,
        password: ADMIN_PASSWORD_SCHEDULE,
        role: 'admin'
      });
    console.log('注册响应:', registerRes.body);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: ADMIN_EMAIL_SCHEDULE,
        password: ADMIN_PASSWORD_SCHEDULE
      });
    console.log('登录响应:', loginRes.body);
    adminToken = loginRes.body.data.token;

    // 注册instructor用户并获取其id
    await request(app)
      .post('/api/auth/register')
      .send({
        email: INSTRUCTOR_EMAIL,
        password: INSTRUCTOR_PASSWORD,
        role: 'instructor'
      });
    const instructorUser = await User.findOne({ email: INSTRUCTOR_EMAIL });
    instructorId = instructorUser._id.toString();

    // 创建一个测试课程（只传递必填字段）
    await Class.deleteMany({ name: 'Test Class for Schedule' });
    const classRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Class for Schedule',
        description: 'Schedule Test Class Description',
        durationMinutes: 60,
        instructor: instructorId
      });
    console.log('创建课程响应:', classRes.body);

    if (classRes.body.data && classRes.body.data._id) {
      testClassId = classRes.body.data._id;
      console.log('测试课程ID:', testClassId);
    } else {
      console.error('创建课程失败:', classRes.body);
      throw new Error('创建课程失败，无法继续测试');
    }
  }, 20000);

  describe('POST /api/schedules', () => {
    it('should create a new schedule for a class if admin', async () => {
      if (!testClassId) {
        throw new Error('测试课程ID未定义，无法继续测试');
      }

      const now = new Date();
      const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const res = await request(app)
        .post('/api/schedules')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          classId: testClassId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          maxCapacity: 15,
          room: 'Test Room 1'
        });
      
      console.log('创建排班响应:', res.body);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.classId).toBe(testClassId);
      expect(res.body.data.maxCapacity).toBe(15);
    }, 10000);
  });

  describe('GET /api/schedules', () => {
    beforeAll(async () => {
      if (!testClassId || !adminToken) {
        console.warn('跳过排班创建：缺少测试课程ID或管理员token');
        return;
      }

      const now = new Date();
      const schedulesData = [
        {
          classId: testClassId,
          startTime: new Date(now.getTime() + 25 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 26 * 60 * 60 * 1000),
          maxCapacity: 5,
          room: 'Test Room 2'
        },
        {
          classId: testClassId,
          startTime: new Date(now.getTime() + 27 * 60 * 60 * 1000),
          endTime: new Date(now.getTime() + 28 * 60 * 60 * 1000),
          maxCapacity: 8,
          room: 'Test Room 3'
        }
      ];

      for (const data of schedulesData) {
        const res = await request(app)
          .post('/api/schedules')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(data);
        console.log('创建测试排班响应:', res.body);
      }
    });

    it('should get all schedules', async () => {
      const res = await request(app)
        .get('/api/schedules')
        .set('Authorization', `Bearer ${adminToken}`);

      console.log('获取排班列表响应:', res.body);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    }, 10000);
  });

  afterAll(async () => {
    // 清理测试数据
    await User.deleteMany({ email: ADMIN_EMAIL_SCHEDULE });
    await User.deleteMany({ email: INSTRUCTOR_EMAIL });
    if (testClassId) {
      await Schedule.deleteMany({ classId: testClassId });
      await Class.deleteMany({ _id: testClassId });
    }
    await mongoose.connection.close();
  });
});

