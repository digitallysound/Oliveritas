// var express = require('express');
// var router = express.Router();


// // route should be /account/
// router.get('/', function(req, res, next) {
//   res.render('login', { title: 'Login' });
// });

// module.exports = router;


// ./routes/login.js
const express = require('express');
const router = express.Router();
const db = require('../db/db.js'); // Make sure path is correct

// Handle GET requests to '/login'
router.get('/', function (_req, res) { // Note: path is '/' because it's relative to '/login' mount point
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
});

// Add handlers for POST /login etc. here if needed

module.exports = router;