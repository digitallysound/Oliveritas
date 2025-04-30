var express = require('express');
var router = express.Router();


// route should be /account/
router.get('/', function(req, res, next) {
  res.render('entity-directory', { title: 'Entitities Directory' });
});

module.exports = router;