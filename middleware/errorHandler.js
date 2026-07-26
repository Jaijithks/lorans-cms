export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server error';

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large',
    });
  }

  if (err.status === 415) {
    return res.status(415).json({
      success: false,
      message: 'Unsupported media type',
    });
  }

  return res.status(status).json({
    success: false,
    message,
  });
};
