const MembershipPlan = require('../models/membershipPlanModel');

const initializeMembershipPlans = async () => {
  try {
    // Check if plans already exist
    const existingPlans = await MembershipPlan.find();
    if (existingPlans.length > 0) {
      console.log('Membership plans already exist, skipping initialization');
      return;
    }

    // Create default membership plans
    const plans = [
      {
        name: 'Weekly Plan',
        durationDays: 7,
        price: 30,
        description: 'Perfect for short-term fitness goals',
        features: [
          'Unlimited class bookings',
          'Basic equipment access',
          'Free locker usage'
        ]
      },
      {
        name: 'Monthly Plan',
        durationDays: 30,
        price: 100,
        description: 'Our most popular membership plan',
        features: [
          'Unlimited class bookings',
          'Full equipment access',
          'Free locker usage',
          'Free towel service',
          'Exclusive member events'
        ]
      },
      {
        name: 'Annual Plan',
        durationDays: 365,
        price: 1000,
        description: 'Best value for long-term commitment',
        features: [
          'Unlimited class bookings',
          'Full equipment access',
          'Free locker usage',
          'Free towel service',
          'Exclusive member events',
          'Personal trainer sessions (2 per month)',
          'Free fitness assessment (quarterly)'
        ]
      }
    ];

    await MembershipPlan.insertMany(plans);
    console.log('Membership plans initialized successfully');
  } catch (error) {
    console.error('Failed to initialize membership plans:', error);
  }
};

module.exports = {
  initializeMembershipPlans
}; 