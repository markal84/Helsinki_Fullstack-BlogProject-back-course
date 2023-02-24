const logger = require('./logger');

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  // console.log(authorization);
  if (authorization && authorization.startsWith('Bearer ')) {
    // use substring method to remove first 7 chars from result string
    req.token = authorization.substring(7);
    // console.log('request token is', req.token);
  }
  return next();
};

// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expaired' });
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor
};
