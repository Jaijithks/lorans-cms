export const errorHandler = (err, req, res, next) => {
  console.error('========== GLOBAL ERROR HANDLER ==========');
  console.error(err);

  // Ensure CORS headers are attached even on error responses
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Server error';

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(err.errors || {}).map((error) => error.message),
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large',
    });
  }

  if (status === 415) {
    return res.status(415).json({
      success: false,
      message: err.message || 'Unsupported media type',
    });
  }

  return res.status(status).json({
    success: false,
    message,
    error: err.name || 'Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

