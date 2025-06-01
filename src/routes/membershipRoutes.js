const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const {
  getMembershipPlansHandler,
  getMembershipStatusHandler,
  cancelMembershipHandler,
  renewMembershipHandler,
  getCurrentUserMembershipHandler
} = require('../controllers/membershipController');

// 获取所有可用的会员计划（公开接口）
router.get('/plans', getMembershipPlansHandler);

// 获取当前用户的会员状态（需要登录）
router.get('/me/membership', authenticate, getCurrentUserMembershipHandler);

// 取消会员订阅（需要登录）
router.post('/me/membership/cancel', authenticate, cancelMembershipHandler);

// 续订会员（需要登录）
router.post('/me/membership/renew', authenticate, renewMembershipHandler);

// 兼容前端API，添加 /me/cancel 路由
router.post('/me/cancel', authenticate, cancelMembershipHandler);

// 兼容前端API，添加 /me/renew 路由
router.post('/me/renew', authenticate, renewMembershipHandler);

module.exports = router; 