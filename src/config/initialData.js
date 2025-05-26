const MembershipPlan = require('../models/membershipPlanModel');

const initializeMembershipPlans = async () => {
  try {
    // 检查是否已存在会员计划
    const existingPlans = await MembershipPlan.find();
    if (existingPlans.length > 0) {
      console.log('会员计划已存在，跳过初始化');
      return;
    }

    // 创建默认会员计划
    const plans = [
      {
        name: '周度会员',
        durationDays: 7,
        price: 30,
        description: '适合短期健身计划的会员',
        features: [
          '无限次课程预约',
          '基础器械使用',
          '免费储物柜使用'
        ]
      },
      {
        name: '月度会员',
        durationDays: 30,
        price: 100,
        description: '最受欢迎的会员计划',
        features: [
          '无限次课程预约',
          '所有器械使用',
          '免费储物柜使用',
          '免费毛巾服务',
          '专属会员活动'
        ]
      },
      {
        name: '年度会员',
        durationDays: 365,
        price: 1000,
        description: '最具性价比的长期会员计划',
        features: [
          '无限次课程预约',
          '所有器械使用',
          '免费储物柜使用',
          '免费毛巾服务',
          '专属会员活动',
          '私人教练指导（每月2次）',
          '免费体测服务（每季度1次）'
        ]
      }
    ];

    await MembershipPlan.insertMany(plans);
    console.log('会员计划初始化成功');
  } catch (error) {
    console.error('会员计划初始化失败:', error);
  }
};

module.exports = {
  initializeMembershipPlans
}; 