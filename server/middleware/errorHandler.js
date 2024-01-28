const authErrorHandler = (err, req, res, next) => {
  if (err.errors && err.errors.name) {
    return res
      .status(400)
      .json({ message: err.errors.name.properties.message, stack: err.stack });
  }

  if (err.errors && err.errors.email) {
    return res
      .status(400)
      .json({ message: err.errors.email.properties.message, stack: err.stack });
  }

  if (err.errors && err.errors.password) {
    return res.status(400).json({
      message: err.errors.password.properties.message,
      stack: err.stack,
    });
  }

  // If email is not unique (email has already been registered)

  if (err.code === 11000) {
    return res.status(400).json({
      message: 'User with email already registered, please login',
      stack: err.stack,
    });
  }

  // For other operational errors that are thrown or internal server errors
  res
    .status(res.statusCode || 500)
    .json({ message: err.message, stack: err.stack });
};

const postErrorHandler = (err, req, res, next) => {
  const { statusCode } = res;

  if (err.errors && err.errors.postMessage) {
    return res.status(400).json({
      message: err.errors.postMessage.properties.message,
      stack: err.stack,
    });
  }

  res
    .status(statusCode || 500)
    .json({ message: err.message, stack: err.stack });
};

module.exports = { authErrorHandler, postErrorHandler };
