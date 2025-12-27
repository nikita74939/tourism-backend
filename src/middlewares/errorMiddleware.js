const { error } = require('../utils/response');

/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return error(res, 'Validation error', 400, errors);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return error(res, 'Duplicate entry', 409, err.errors[0]?.message);
  }

  // Sequelize foreign key error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return error(res, 'Invalid reference', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return error(res, 'Authentication failed', 401);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  return error(res, message, statusCode);
};

/**
 * 404 Not Found handler
 */
const notFoundMiddleware = (req, res) => {
  return error(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = {
  errorMiddleware,
  notFoundMiddleware
};