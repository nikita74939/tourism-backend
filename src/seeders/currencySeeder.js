const { Currency } = require('../models');
const { testConnection } = require('../config/database');

const currencies = [
  {
    code: 'IDR',
    rate_to_idr: 1.0000
  },
  {
    code: 'USD',
    rate_to_idr: 15600.0000
  },
  {
    code: 'EUR',
    rate_to_idr: 17200.0000
  },
  {
    code: 'GBP',
    rate_to_idr: 19800.0000
  },
  {
    code: 'JPY',
    rate_to_idr: 105.0000
  },
  {
    code: 'SGD',
    rate_to_idr: 11600.0000
  },
  {
    code: 'MYR',
    rate_to_idr: 3500.0000
  },
  {
    code: 'THB',
    rate_to_idr: 450.0000
  },
  {
    code: 'AUD',
    rate_to_idr: 10200.0000
  },
  {
    code: 'CNY',
    rate_to_idr: 2150.0000
  }
];

const seedCurrencies = async () => {
  try {
    console.log('🌱 Starting currency seeder...');

    await testConnection();

    // Clear existing data (optional)
    await Currency.destroy({ where: {} });
    console.log('🗑️  Cleared existing currencies');

    // Insert new data
    const result = await Currency.bulkCreate(currencies);
    console.log(`✅ Successfully seeded ${result.length} currencies`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding currencies:', error);
    process.exit(1);
  }
};

// Run seeder
seedCurrencies();