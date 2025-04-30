var express = require('express');
var router = express.Router();


// route should be /account/
router.get('/', function(req, res, next) {
  res.render('orders', { title: 'Orders' });
});

module.exports = router;