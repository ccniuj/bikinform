var pry = require('pryjs')
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bikinform')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connected');
	// var kittySchema = mongoose.Schema({
 //    sno: String
 //  });
  var youbike_schema = mongoose.Schema({
    raw: String,
    timestamp: String
  });
  var Youbike = mongoose.model('youbike_collection', youbike_schema);

  // var silence = new Kitten({ name: 'Silence' });
  // console.log(silence.name); // 'Silence'
  // silence.save(function (err, s) {
    // if (err) return console.error(err);
    // fluffy.speak();
  // });
  Youbike.find(function (err, doc) {
    if (err) return console.error(err);
    data = JSON.parse(doc[0]['raw'])['retVal']
  })
});
eval(pry.it);
