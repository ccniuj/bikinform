var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var mongo = require('mongodb');
var mongoose = require('mongoose');
var compute = require('./compute');

var app = express();

if(app.settings.env == 'development') {
  mongoose.connect('mongodb://localhost:27017/bikinform')
} else {
  mongoose.connect(process.env.MONGOLAB_URI)
}
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DB connected');
});
var youbike_schema = mongoose.Schema({
  raw: String,
  timestamp: String
});
Youbike = mongoose.model('youbike_collection', youbike_schema);

var file_name = 'test';
var fs = require('fs');
// set scheduler, download data and transfer to json
var exec = require('child_process').exec;
var cmd = 'wget http://data.taipei/youbike -O ' + file_name + '.gz && gunzip ' + file_name + '.gz -f';
// var collection = db.get('youbikecollection');
// var youbike_data = {};

var CronJob = require('cron').CronJob;
new CronJob('1 * * * * *', function() {
  exec(cmd, function(error, stdout, stderr) {
    // command output is in stdout
    // console.log(stdout);
    if (fs.existsSync(file_name)) {
      fs.readFile(file_name, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        var test = new Youbike({ raw: data, timestamp: new Date() });
        test.save(function (err, s) {
          if (err) return console.error(err);
        });
      });
    }
  });
  Youbike.find({}, null, {sort: {timestamp: 1}}, function (err, docs) {
    compute.difference_btw_n_minutes(docs, 10);
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
