var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('adminPtsEdit', { title: 'Admin Products Edit' });
});

module.exports = router;