/**
 * Standardized API response format
 */

const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const error = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

const created = (res, data = null, message = 'Resource created successfully') => {
  return success(res, data, message, 201);
};

const badRequest = (res, message = 'Bad request', errors = null) => {
  return error(res, message, 400, errors);
};

const unauthorized = (res, message = 'Unauthorized') => {
  return error(res, message, 401);
};

const notFound = (res, message = 'Resource not found') => {
  return error(res, message, 404);
};

module.exports = {
  success,
  error,
  created,
  badRequest,
  unauthorized,
  notFound
};