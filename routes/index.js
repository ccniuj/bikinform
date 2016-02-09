var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	Youbike.find(function (err, docs) {
    if (err) return console.error(err);
    res.render('index', {
      "data" : docs
    });
  });
});

module.exports = router;
