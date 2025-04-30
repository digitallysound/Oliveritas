var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('adminPtsIndex', { title: 'Admin Products Index' });
});

module.exports = router;