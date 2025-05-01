async function initiatePayPal() {
   // const csrfToken = document.querySelector('input[name="_csrf"]').value;
    try {
      // 1. Call your backend to create a PayPal payment
      const response = await fetch('/checkout/payment/create-payment', {  // Use the correct backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
     //   headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({
          /* Order details here (e.g., amount, items) */
          amount: 10.00,  
          currency: 'EUR'
        }),
      });
  
      const data = await response.json();
  
      if (data.orderID) {
        // Call the onApprove function to capture the payment
        onApprove(data.orderID);
      } else {
        // Handle errors (e.g., display an error message to the user)
        console.error('PayPal payment creation failed:', data.error);
        alert('Payment could not be initiated. Please try again.');
      }
  
    } catch (error) {
      console.error('Error during PayPal initiation:', error);
      alert('An error occurred. Please try again later.');
    }
  }
  
  // 2. Handle the payment approval (capture)
  async function onApprove(orderID) {
   // const csrfToken = document.querySelector('input[name="_csrf"]').value;
    try {
      const response = await fetch('/checkout/payment/capture-payment', { // Replace with your endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
      //  headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
          orderID: orderID,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('Payment successful! Thank you for your order.');
        // Redirect to an order confirmation page, etc.
        window.location.href = '/order-confirmation';
      } else {
        alert('Payment failed.');
        // Handle failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error during payment execution:', error);
      alert('An error occurred during payment processing.');
    }
  }