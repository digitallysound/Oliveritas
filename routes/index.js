var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const walletConnected = !!req.session.ethAddress;
  res.render('index', { title: 'Home', walletConnected });
});

module.exports = router;
