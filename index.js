const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const logger = require('./utilis/logger');
const config = require('./utilis/config');
const mongoose = require('mongoose');

logger.info('connecting to database');

mongoose.set('strictQuery', true);

mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info('connected to database');
});

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
