var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('youbikecollection');
  collection.find({},{},function(e,docs){
    res.render('index', {
      "data" : docs
    });
  });
});

module.exports = router;
