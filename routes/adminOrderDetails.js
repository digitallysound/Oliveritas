var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('adminOrderDetails', { title: 'Admin Order Details' });
});

module.exports = router;