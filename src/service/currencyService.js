const { Currency } = require('../models');

/**
 * Service untuk handle currency conversion logic
 */

/**
 * Convert amount from one currency to another
 */
const convertAmount = async (fromCode, toCode, amount) => {
  try {
    const fromCurrency = await Currency.findOne({
      where: { code: fromCode.toUpperCase() }
    });

    const toCurrency = await Currency.findOne({
      where: { code: toCode.toUpperCase() }
    });

    if (!fromCurrency || !toCurrency) {
      throw new Error('Currency not found');
    }

    // Convert through IDR
    const amountInIDR = parseFloat(amount) * parseFloat(fromCurrency.rate_to_idr);
    const convertedAmount = amountInIDR / parseFloat(toCurrency.rate_to_idr);

    return {
      from: fromCode.toUpperCase(),
      to: toCode.toUpperCase(),
      original_amount: parseFloat(amount),
      converted_amount: Math.round(convertedAmount * 100) / 100,
      rate: Math.round((parseFloat(fromCurrency.rate_to_idr) / parseFloat(toCurrency.rate_to_idr)) * 10000) / 10000
    };
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
};

/**
 * Get exchange rate between two currencies
 */
const getExchangeRate = async (fromCode, toCode) => {
  try {
    const fromCurrency = await Currency.findOne({
      where: { code: fromCode.toUpperCase() }
    });

    const toCurrency = await Currency.findOne({
      where: { code: toCode.toUpperCase() }
    });

    if (!fromCurrency || !toCurrency) {
      throw new Error('Currency not found');
    }

    const rate = parseFloat(fromCurrency.rate_to_idr) / parseFloat(toCurrency.rate_to_idr);

    return {
      from: fromCode.toUpperCase(),
      to: toCode.toUpperCase(),
      rate: Math.round(rate * 10000) / 10000
    };
  } catch (error) {
    console.error('Error getting exchange rate:', error);
    throw error;
  }
};

/**
 * Update currency rates (can be called from external API)
 */
const updateCurrencyRates = async (rates) => {
  try {
    // rates should be an object like: { USD: 15000, EUR: 17000, JPY: 110 }
    for (const [code, rate] of Object.entries(rates)) {
      await Currency.upsert({
        code: code.toUpperCase(),
        rate_to_idr: rate
      });
    }

    console.log('Currency rates updated successfully');
  } catch (error) {
    console.error('Error updating currency rates:', error);
    throw error;
  }
};

module.exports = {
  convertAmount,
  getExchangeRate,
  updateCurrencyRates
};