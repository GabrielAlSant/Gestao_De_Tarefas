var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var taskRouter = require('./routes/task');
var userRouter = require('./routes/user');
var commentRouter = require('./routes/comment');
var logRouter = require('./routes/log');

var app = express();



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', userRouter);
app.use('/task', taskRouter);
app.use('/comment', commentRouter);
app.use('/log', logRouter);


app.use(function(req, res, next) {
});


module.exports = app;
