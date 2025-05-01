var express = require('express');
var router = express.Router();
const db = require('../db/db.js'); // Make sure path is correct


// route should be /account/
// router.get('/', function(req, res, next) {
//   res.render('register', { title: 'Register' });
// });

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get('/', function (_req, res) { 
  // Render the registration page (assuming you have a view for it)
  res.render('register', { title: 'Register' });
});

router.post('/', async function (req, res) { 
  const { firstName, lastName, email, password } = req.body;
  console.log('Received data:', req.body); // Log the received data for debugging

  const insertQuery = 'INSERT INTO Entities (FirstName, LastName, PrimaryEmail, password) VALUES (?, ?, ?, ?)';

  try {
    // Use a promise-based query method
    await db.promise().query(insertQuery, [firstName, lastName, email, password]);
    res.render('register', { title: 'Register', success: 'Thank you for registering!', error: null });
  } catch (err) {
    console.error('Database error:', err); // Log the error for debugging
    res.render('register', { title: 'Register', success: null, error: 'An error occurred while processing your registration.' });
  }
});

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