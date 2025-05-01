var express = require('express');
var router = express.Router();


// route should be /account/
router.get('/', function(req, res, next) {
  res.render('account-order-details', { title: 'account-order-details' });
});

module.exports = router;