// cart.js

const cartKey = 'shoppingCart';

function getCart() {
  const cartJson = localStorage.getItem(cartKey);
  return cartJson ? JSON.parse(cartJson) : [];
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function addToCart(item) {
  let cart = getCart();
  const existingItemIndex = cart.findIndex(i => i.id === item.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart(cart);
}

function removeFromCart(itemId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== itemId);
  saveCart(cart);
}

function updateQuantity(itemId, quantity) {
  if (quantity < 1) return; // Or handle removal if quantity is 0

  let cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === itemId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity = quantity;
    saveCart(cart);
  }
}

function clearCart() {
  saveCart([]);
}

function getCartTotal() {
    let cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0); // Assuming each item has a 'price' property
}

function getCartItemCount() {
    return getCart().reduce((total, item) => total + item.quantity, 0);
}


window.cartManager = {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartTotal,
  getCartItemCount
};
