var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('bclogin', { title: 'Blockchain Login' });
});

router.post('/wallet-login', (req, res) => {
  const { ethAddress } = req.body;
  if (ethAddress) {
    req.session.ethAddress = ethAddress;
    return res.json({ message: 'Wallet address stored' });
  }
  return res.status(400).json({ error: 'No wallet address provided' });
});

module.exports = router;
