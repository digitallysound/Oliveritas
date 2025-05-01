var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('get-access-token', { title: 'access-token' });
});

module.exports = router;