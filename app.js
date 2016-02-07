var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var mongo = require('mongodb');
var monk = require('monk');
var app = express();

if(app.settings.env == 'development') {
  var db = monk('localhost:27017/bikinform');
} else {
  // var db = monk('heroku_mjsmdz94:e5pukcp5fijttg1l3qcjiqd9gr@ds059135.mongolab.com:59135/heroku_mjsmdz94');
}

console.log(app.settings.env);

var file_name = 'test';
var fs = require('fs');
// set scheduler, download data and transfer to json
var exec = require('child_process').exec;
var cmd = 'wget http://data.taipei/youbike -O ' + file_name + '.gz && gunzip ' + file_name + '.gz -f';
var collection = db.get('youbikecollection');
var youbike_data = {};

var CronJob = require('cron').CronJob;
new CronJob('1 * * * * *', function() {
  // console.log('You will see this message every minute');
  exec(cmd, function(error, stdout, stderr) {
    console.log("Run the command");
    // command output is in stdout
    // console.log(stdout);
    if (fs.existsSync(file_name)) {
      fs.readFile(file_name, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        youbike_data = JSON.parse(data);
        collection.insert(youbike_data);
        // console.log(youbike_data);
        // console.log('output')
        // eval(pry.it)
      });
    }
  });
}, null, true, 'America/Los_Angeles');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
