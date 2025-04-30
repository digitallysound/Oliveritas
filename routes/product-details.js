var express = require('express');
var router = express.Router();


// route should be /account/
router.get('/', function(req, res, next) {
  res.render('product-details', { title: 'Product details' });
});

module.exports = router;