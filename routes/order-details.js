var express = require('express');
var router = express.Router();


// route should be /account/
router.get('/', function(req, res, next) {
  res.render('order-details', { title: 'Order-details' });
});

module.exports = router;