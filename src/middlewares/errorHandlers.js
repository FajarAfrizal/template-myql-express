const flaverr = require('flaverr');
const logger = require('../helpers/logger');
const ENV = process.env.NODE_ENV;

const notFound = (req, _res, next) => {
  const error = flaverr('E_NOT_FOUND', Error(`Not found - ${req.originalUrl}`));
  return next(error);
};

const errorStack = (error, _req, res, _next) => {
  let statusCode;

  if (error.name === 'SequelizeUniqueConstraintError') {
    error.code = 'E_DUPLICATE';
    error.name = 'Duplicate entry';
    error.message = error.errors[0].message;
  }

  switch (error.code) {
    case 'E_BAD_REQUEST':
      statusCode = 400;
      break;

    case 'E_CORS':
      statusCode = 403;
      break;

    case 'E_DUPLICATE':
      statusCode = 409;
      break;

    case 'E_NOT_FOUND':
      statusCode = 404;
      break;

    case 'E_UNAUTHORIZED':
      statusCode = 401;
      break;

    case 'E_FORBIDDEN':
      statusCode = 403;
      break;

    case 'E_VALIDATION':
      statusCode = 422;
      break;

    default:
      error.code = 'E_INTERNAL_SERVER';
      statusCode = 500;
      break;
  }

  if (ENV !== 'test') {
    logger('error', 'Server', error.message, error.stack);
  }

  res.status(statusCode);
  return res.json({
    statusCode,
    code: error.code,
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? 'Hello' : error.stack,
  });
};

module.exports = { notFound, errorStack };
