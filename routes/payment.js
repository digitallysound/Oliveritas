
const axios = require('axios');

var express = require('express');
var router = express.Router();
const cors = require('cors'); // Import the cors middleware


const paypal = require('@paypal/checkout-server-sdk'); // Or your chosen PayPal library

// Configure PayPal sandbox environment (replace with your credentials)
const clientId = 'ATpocRQjzDess3TpwxynXBL14_pSfhW2ifK2TwaC9Tx8W9Z6wZa-3Iskr5XjVH62yGqln2s4edSrgtSx';
const clientSecret = 'EOovNtHfPOAoj7A8WHqU_Na3vPwmsRTd-t1qGcRS--SnDJwNS2Bxxe6vKw9TYHZ2taNhO6gJMJLT8kaN';
const apiUrl ='https://api.sandbox.paypal.com/';


const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret); // Or LiveEnvironment for production
const client = new paypal.core.PayPalHttpClient(environment);
router.use(express.json()); // For parsing JSON request bodies

// Enable CORS for all routes
router.use(cors());

router.get('/', function(req, res, next) {
  res.render('payment', { title: 'Payment' });
});


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

        if (capture.result.status === 'COMPLETED') {
            // Fetch order details to get shipping address and line items
            const orderDetailsRequest = new paypal.orders.OrdersGetRequest(orderID);
            const orderDetails = await client.execute(orderDetailsRequest);

            const shippingAddress = orderDetails.result.purchase_units[0].shipping.address;
            const lineItems = orderDetails.result.purchase_units[0].items || []; // Use items if available, otherwise empty array

            // Ensure JSON response with correct header
            res.status(200).json({  // Explicitly set status code and use json()
                success: true,
                details: capture.result,
                status: capture.result.status,
                shippingAddress: shippingAddress,
                lineItems: lineItems,
                orderID: orderID 
            });
        } else {
            // Ensure JSON response with correct header
            res.status(200).json({ success: false, details: capture.result, status: capture.result.status }); // Explicitly set status code and use json()
        }
    } catch (error) {
        console.error('Error capturing PayPal payment:', error);
        res.status(500).json({ success: false, error: 'Failed to capture payment' });
    }
});

// --- Get Order Details ---
router.get('/order-details/:orderID', async (req, res) => {
  try {
      const orderID = req.params.orderID;
      const orderDetailsRequest = new paypal.orders.OrdersGetRequest(orderID);
      const orderDetails = await client.execute(orderDetailsRequest);
      
      res.status(200).json(orderDetails.result); // Send the full JSON response
  } catch (error) {
      console.error('Error fetching PayPal order details:', error);
      res.status(500).json({ error: 'Failed to fetch order details' });
  }
});



const getAccessToken = async () => {
  const url = apiUrl+'v1/oauth2/token';
  const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
  };
  const data = 'grant_type=client_credentials';

  try {
      const response = await axios.post(url, data, { headers });
      return response.data;
  } catch (error) {
      console.error('Error fetching access token:', error);
      throw new Error('Failed to fetch access token');
  }
};

router.get('/get-access-token', async (req, res) => {
  try {
      const tokenData = await getAccessToken();
      res.status(200).json(tokenData);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

    
 // --- Get Subscription Details ---

 router.get('/subscription-details/:subscriptionID', async (req, res) => {
        try {
        const tokenData = await getAccessToken();
            const subscriptionID = req.params.subscriptionID;
            const url = apiUrl+'v1/billing/subscriptions/'+subscriptionID;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            };
    
            const response = await axios.get(url, { headers });
            console.log(response.data);
            res.status(200).json(response.data); // Send the full JSON response
        } catch (error) {
            console.error('Error fetching PayPal subscription details:', error);
            res.status(500).json({ error: 'Failed to fetch subscription details' });
        }
    });
    



module.exports = router;
