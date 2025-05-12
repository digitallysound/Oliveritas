var express = require('express');
var router = express.Router();
const db = require('../db/db.js'); // Ensure the database connection is correct
const cors = require('cors'); // Import the cors middleware
router.use(cors());
console.log('--- Loading register.js router ---'); // Add this log

// --- Middleware ---
// Ensure these are placed *before* any routes that need to parse request bodies.
// If express.json() is applied globally in app.js before mounting this router,
// applying it here again is redundant but usually harmless.
// If it's *only* applied here, it MUST be before the routes below.
router.use(express.json()); // Parses incoming requests with JSON payloads
router.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
console.log('--- Middleware (json, urlencoded) applied in register.js ---'); // Add this log

// --- Routes ---

// GET route for rendering the registration page
router.get('/', function (_req, res) { 
  console.log('--- GET / route handler entered ---'); // Log entry
  res.render('register', { title: 'Register' });
});

// POST route for handling registration via API call from EJS
// Double-check how this router is mounted in your main app.js file.
// The combination of the app.use() path and this router.post() path must equal '/account'.
router.post('/account/dashboard', async function (req, res) { 
     console.log('--- POST /account route handler entered ---'); // Entry log

    // Check if req.body exists and is populated
    if (!req.body || Object.keys(req.body).length === 0) {
        console.error('Error: Request body is empty or not parsed correctly.');
        console.error('Verify `express.json()` middleware placement and `Content-Type` header.');
        return res.status(400).json({ error: 'Invalid request: No data received.' });
    }
    
    console.log('Received request body:', req.body); // Log the received body

    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
        console.error('Validation Error: Missing required fields in request body.'); 
        console.log(`firstName: ${firstName}, lastName: ${lastName}, email: ${email}, password: ${password ? '***' : undefined}`);
        return res.status(400).json({ error: 'All fields (firstName, lastName, email, password) are required.' });
    }

    console.log('Data validated successfully. Proceeding with database insertion.');
    const insertQuery = 'INSERT INTO Entities (FirstName, LastName, PrimaryEmail, password) VALUES (?, ?, ?, ?)';

    try {
        // Insert data into the database
        console.log('Executing database query:', insertQuery);
        
        await db.promise().query(insertQuery, [firstName, lastName, email, password]);
        console.log('Database query successful. User registered.'); 
        res.status(200).json({ message: 'Registration successful' }); // Respond with success
    } catch (err) {
        console.error('Database Insertion Error:', err); // Log the specific database error
        res.status(500).json({ error: 'An internal server error occurred while processing your registration.' }); // Respond with generic server error
    }});

// Remove or comment out the other POST '/' route if it's conflicting or not needed
/*
router.post('/', async function (req, res) { 
  // ... (This route might conflict if app.js mounts this router at '/')
});
*/

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load .env variables
 
// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD  // App password (NOT your Gmail password)
  }
  
});
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD exists:', process.env.EMAIL_PASSWORD);
 
module.exports = router;

  // console.log('--- GET /login route handler in routes/login.js entered ---'); // Add this log
  // console.log('Executing query:');
  // const selectQuery = 'INSERT INTO Entities (FirstName) VALUES ("XXXX")';
  // console.log('Executing query:', selectQuery);

  // db.query(selectQuery, function select(error, results, _fields) {
  //   if (error) {
  //     console.error('Database error:', error);
  //     // Consider rendering an error page or sending JSON
  //     return res.status(500).render('error', { message: 'Database error', error: process.env.NODE_ENV !== 'production' ? error : {} });
  //   }

  //   if (results.length === 0) {
  //     console.log('No data found for the query.');
  //     // Redirecting or rendering here depends on your app flow
  //     // **IMPORTANT**: Avoid leading slash if 'views/account/dashboard.ejs' exists
  //     return res.render('account/dashboard'); // Assuming you want to render the dashboard view
  //   } else {
  //     console.log('Query results:', results);
  //     // Sending a simple text response might not be what you want for a login GET request.
  //     // Usually, you'd render a login form.
  //     // For testing, this is okay:
  //     res.status(200).send('Query executed successfully (from routes/login.js). Data logged to console.');
  //     // Or render the login page:
  //     // res.render('login', { title: 'Login Page' }); // Example rendering
  //   }
  // });