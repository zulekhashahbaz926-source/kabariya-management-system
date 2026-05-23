// Global Express Error Handling Middleware

const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler Log]:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    path: req.originalUrl,
    method: req.method
  });

  // Handle SQLite constraint violations (e.g. Unique constraints)
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    let field = 'Field';
    if (err.message.includes('users.email')) field = 'Email address';
    else if (err.message.includes('users.username')) field = 'Username';
    
    return res.status(400).json({
      success: false,
      errorType: 'DATABASE_CONSTRAINT',
      message: `${field} already exists. Please choose another one.`
    });
  }

  // Handle Validation errors (Simulated custom throw)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      errorType: 'VALIDATION_ERROR',
      message: err.message
    });
  }

  // Handle Payment Simulation failures
  if (err.name === 'PaymentError') {
    return res.status(402).json({
      success: false,
      errorType: 'PAYMENT_REQUIRED',
      message: err.message
    });
  }

  // Handle AI response failures
  if (err.name === 'AIServiceError') {
    return res.status(502).json({
      success: false,
      errorType: 'AI_PROVIDER_ERROR',
      message: 'AI Service failed to reply. Returning fallback response: ' + err.message
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    errorType: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected internal error occurred. Our engineers have been notified.'
  });
};

module.exports = errorHandler;
