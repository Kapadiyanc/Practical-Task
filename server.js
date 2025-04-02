const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression')
const helmet = require('helmet')

const dbConnection = require('./config/db');
const { sequelize } = require('sequelize');
const routes = require('./routes/routes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet())
app.use(compression())

app.use(cors());
app.use(logger('combined'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.get('/', (req, res) => res.status(200).send('Welcome'))
app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/api', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
