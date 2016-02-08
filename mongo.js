var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/bikinform');
var pry = require('pryjs')
var collection = db.get('fuckcollection');
// collection.insert({'test':1});

collection.insert({
  "test" : 1
}, function (err, doc) {
  if (err) {
    eval(pry.it);
    // If it failed, return error
    console.log("There was a problem adding the information to the database.");
  }
  else {
    // And forward to success page
    console.log("success");
  }
});