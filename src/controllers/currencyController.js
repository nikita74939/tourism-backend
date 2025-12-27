const { Currency } = require('../models');
const { success, badRequest, notFound } = require('../utils/response');

/**
 * Get all currencies
 */
const getAllCurrencies = async (req, res, next) => {
  try {
    const currencies = await Currency.findAll({
      order: [['code', 'ASC']]
    });

    return success(res, currencies, 'Currencies retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get currency by code
 */
const getCurrencyByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    const currency = await Currency.findOne({
      where: { code: code.toUpperCase() }
    });

    if (!currency) {
      return notFound(res, 'Currency not found');
    }

    return success(res, currency, 'Currency retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Convert currency
 */
const convertCurrency = async (req, res, next) => {
  try {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
      return badRequest(res, 'From currency, to currency, and amount are required');
    }

    const fromCurrency = await Currency.findOne({
      where: { code: from.toUpperCase() }
    });

    const toCurrency = await Currency.findOne({
      where: { code: to.toUpperCase() }
    });

    if (!fromCurrency) {
      return notFound(res, `Currency ${from.toUpperCase()} not found`);
    }

    if (!toCurrency) {
      return notFound(res, `Currency ${to.toUpperCase()} not found`);
    }

    // Convert through IDR
    const amountInIDR = parseFloat(amount) * parseFloat(fromCurrency.rate_to_idr);
    const convertedAmount = amountInIDR / parseFloat(toCurrency.rate_to_idr);

    const result = {
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount: parseFloat(amount),
      converted_amount: Math.round(convertedAmount * 100) / 100,
      rate: Math.round((parseFloat(fromCurrency.rate_to_idr) / parseFloat(toCurrency.rate_to_idr)) * 10000) / 10000
    };

    return success(res, result, 'Currency converted successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCurrencies,
  getCurrencyByCode,
  convertCurrency
};