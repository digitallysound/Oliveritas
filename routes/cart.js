const express = require('express');
const router = express.Router();

router.get('/cart', (req, res) => {
  // Recupera i dati del carrello, ad esempio da una sessione o un database
  const cartItems = req.session.cartItems || [];
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  res.render('cart', {
    cartItems: cartItems,
    cartTotal: cartTotal
  });
});

module.exports = router;
