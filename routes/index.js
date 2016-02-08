var express = require('express');
var router = express.Router();

// if(app.settings.env == 'development') {
//   // var db = monk('localhost:27017/bikinform');
//   mongoose.connect('mongodb://localhost:27017/bikinform')
// } else {
//   // var db = monk('heroku_mjsmdz94:e5pukcp5fijttg1l3qcjiqd9gr@ds059135.mongolab.com:59135/heroku_mjsmdz94');
//   mongoose.connect(process.env.MONGOLAB_URI)
// }

/* GET home page. */
router.get('/', function(req, res, next) {
  // var db = req.db;
  // var youbike = req.youbike;
  // var youbike = new Youbike({ sno: '0001' });
  // var collection = db.get('youbikecollection');
  // collection.find({},{},function(e,docs){
  //   res.render('index', {
  //     "data" : docs
  //   });
  // });
	Youbike.find(function (err, docs) {
    if (err) return console.error(err);
    console.log(docs);
    res.render('index', {
      "data" : docs
    });
  });
});

module.exports = router;
