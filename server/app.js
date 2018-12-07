const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const helmet = require('helmet');
const compression = require('compression');
const indexRouter = require('./routes/index');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.enable('trust proxy');
app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * routing
 */

app.use('/', indexRouter);

// 404
app.use((req, res, next) => {
    next(createError(404));
});

// error
app.use((err, req, res, next) => {
    console.log(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
