
//--------------------------------------------------------//
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser');
var app = express();
//-------------------------------------------------------//
/* 기본 셋팅 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('etag');

/* API 설계 ROUTER 연결 */
app.use('/', require('./routes/index'))
app.use('/board', require('./routes/board'))
app.use('/users', require('./routes/users'))
app.use('/images',require('./routes/images'))
app.use('/chat',require('./routes/chat'))
app.use('/contract',require('./routes/contract'))
app.use('/mypages',require('./routes/mypages'))
app.use('/search',require('./routes/search'))
//app.use('/contract',require('./routes/contract'))
app.use('/email',require('./routes/email'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

/* 404 에러 */
app.use(function(req, res, next) {
  next(createError(404));
});

/* 에러 핸들러 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;