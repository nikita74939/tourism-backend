const express = require('express');
const router = express.Router();
const { 
  getAllCurrencies, 
  getCurrencyByCode, 
  convertCurrency 
} = require('../controllers/currencyController');

/**
 * @route   GET /api/currencies
 * @desc    Get all currencies
 * @access  Public
 */
router.get('/', getAllCurrencies);

/**
 * @route   GET /api/currencies/convert
 * @desc    Convert currency
 * @access  Public
 */
router.get('/convert', convertCurrency);

/**
 * @route   GET /api/currencies/:code
 * @desc    Get currency by code
 * @access  Public
 */
router.get('/:code', getCurrencyByCode);

module.exports = router;