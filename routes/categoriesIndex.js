var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('categoriesIndex', { title: 'Admin Products Edit' });
});

module.exports = router;