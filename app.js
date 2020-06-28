var createError = require('http-errors');
var mongoose = require('mongoose');
var cloudinary = require('cloudinary').v2
var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var MediaRoute = require('./routes/media');
// var usersRouter = require('./routes/users');

var app = express();

// mongoose.connect('mongodb+srv://root:root@cluster0-bljag.mongodb.net/videoapp?retryWrites=true&w=majority', {
//     promiseLibrary: require('bluebird'),
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// }).then(() =>  console.log('connection successful'))
//   .catch((err) => console.error(err));

cloudinary.config({ 
  cloud_name: 'mayconxhh', 
  api_key: '427942691184476', 
  api_secret: 'vbEzyC89Hx9KPIWjhgAER_z__4c'
});

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});

// app.use('/', function(req, res){
//   return res
//           .status(200)
//           .send({
//             success:false
//           });
// })
app.use('/api', MediaRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
