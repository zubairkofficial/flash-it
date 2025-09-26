'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Avoid duplicates
    const exists = await queryInterface.rawSelect(
      'subscription-plans',
      { where: { plan_type: 'free' } },
      ['id'],
    );

    if (!exists) {
      await queryInterface.bulkInsert('subscription-plans', [
        {
          plan_type: 'free',
          price: 0, // DECIMAL(10,2) is fine with number 0
          // ARRAY(TEXT) in Postgres accepts a JS array directly:
          features: ['Basic access', 'Limited usage', 'Community support'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          plan_type: 'pro',
          price: 15, // DECIMAL(10,2) is fine with number 0
          // ARRAY(TEXT) in Postgres accepts a JS array directly:
          features: [
            'Basic access',
            'Limited usage',
            'Community support',
            'more features',
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          plan_type: 'team',
          price: 30, // DECIMAL(10,2) is fine with number 0
          // ARRAY(TEXT) in Postgres accepts a JS array directly:
          features: [
            'Basic access',
            'Limited usage',
            'Community support',
            'more features',
            'more and more features',
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('subscription-plans', {
      plan_type: 'FREE',
    });
  },
};
