const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk'); // Or your chosen PayPal library

// Configure PayPal sandbox environment (replace with your credentials)
const clientId = 'ATpocRQjzDess3TpwxynXBL14_pSfhW2ifK2TwaC9Tx8W9Z6wZa-3Iskr5XjVH62yGqln2s4edSrgtSx';
const clientSecret = 'EOovNtHfPOAoj7A8WHqU_Na3vPwmsRTd-t1qGcRS--SnDJwNS2Bxxe6vKw9TYHZ2taNhO6gJMJLT8kaN';

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret); // Or LiveEnvironment for production
const client = new paypal.core.PayPalHttpClient(environment);
router.use(express.json()); // For parsing JSON request bodies

router.get('/message', (req, res) => {
    res.json({ message: 'Hello from the backend!    ' });
  });

// --- Payment Creation ---
router.post('/create-payment', async (req, res) => {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR', // Or your currency
                    value: req.body.amount, // Get amount from request
                },
            }],
        });

        const order = await client.execute(request);
        res.json({ orderID: order.result.id, status: order.result.status });  // Send back the PayPal order ID
    } catch (error) {
        console.error('Error creating PayPal order:', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

router.post('/capture-payment', async (req, res) => {
    try {
        const { orderID } = req.body; // Extract orderID from request body
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});
        const capture = await client.execute(request);
        console.log("payment result", capture.result)
        res.json({ success: capture.result.status === 'COMPLETED', details: capture.result, status: capture.result.status });
    } catch (error) {
        console.error('Error capturing PayPal payment:', error);
        res.status(500).json({ success: false, error: 'Failed to capture payment' });
    }
});

module.exports = router;
