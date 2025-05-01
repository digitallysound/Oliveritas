var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('subscriptionOrderDetails', { title: 'Admin subscription Details' });
});

module.exports = router;