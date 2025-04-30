var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('adminDashboard', { title: 'Admin Dashboard' });
});

module.exports = router;