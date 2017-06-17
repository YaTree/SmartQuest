var express = require('express');
var router = express.Router();



var db = require('../queries');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource 11');
});

router.post('/authenticate',db.checkUser);

module.exports = router;
