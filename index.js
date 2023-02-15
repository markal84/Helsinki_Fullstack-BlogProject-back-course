const app = require('./app');
const logger = require('./utilis/logger');
const config = require('./utilis/config');

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
