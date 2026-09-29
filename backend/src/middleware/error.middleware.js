const config = require('../config/config');

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

const errorHandler = (err, req, res, next) => {

  // MySQL: duplicate entry (unique constraint)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A user with this email already exists.',
    });
  }

  // MySQL: foreign key constraint failure
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist.',
    });
  }

  // MySQL: data too long / bad enum value
  if (err.code === 'ER_DATA_TOO_LONG' || err.code === 'ER_BAD_NULL_ERROR') {
    return res.status(400).json({
      success: false,
      message: 'Invalid value provided for one of the fields.',
    });
  }

  // MySQL: truncated incorrect value (bad enum)
  if (err.code === 'WARN_DATA_TRUNCATED' || err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
    return res.status(400).json({
      success: false,
      message: 'Invalid status or priority value.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message =
    config.nodeEnv === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
