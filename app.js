const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const  db  = require('./src/models');

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

const { notFound, errorStack } = require('./src/middlewares/errorHandlers');


const routes = require('./src/routes');


const v1 = '/api/v1';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', 'views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.send('welcome to api v1');
})



app.use('/', routes);

app.use(notFound);
app.use(errorStack);

module.exports = app;
