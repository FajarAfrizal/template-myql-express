const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();


require('dotenv').config();
const logger = require('./src/helpers/logger');
const { notFound, errorStack } = require('./src/middlewares/errorHandlers');


const  db  = require('./src/models');
const port = process.env.PORT || '3000';
const host = process.env.HOST || '0.0.0.0';


app.listen(port);
logger('info', 'Server', `Server is listening on: http://${host}:${port}`);

const routes = require('./src/routes');
const v1 = '/api/v1';


app.use(morgan('dev'));
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
