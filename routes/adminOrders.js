var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('adminOrders', { title: 'Admin Orders' });
});

module.exports = router;