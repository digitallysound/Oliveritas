var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('deliveryZonesIndex', { title: 'Delivery Zones Index' });
});

module.exports = router;