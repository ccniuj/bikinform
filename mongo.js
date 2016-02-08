var pry = require('pryjs')
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bikinform')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connected');
	var kittySchema = mongoose.Schema({
    sno: String
  });
  var Kitten = mongoose.model('Kitten', kittySchema);
  var silence = new Kitten({ name: 'Silence' });
  console.log(silence.name); // 'Silence'
  silence.save(function (err, s) {
    if (err) return console.error(err);
    // fluffy.speak();
  });
  Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
  })
});
