const express = require('express');
const path = require('path');
const createError = require('http-errors');
const db = require('./db/db.js');

const passport = require('passport');
// const csrf = require('csurf'); 

var session = require('express-session');
var helmet = require('helmet'); 
var rateLimit = require('express-rate-limit');

var indexRouter = require('./routes/index');
var shopRouter = require('./routes/shop');

var bcloginRouter = require('./routes/bclogin');
const authenticityCheckRouter = require('./routes/authenticityCheck');

var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

var dashboardRouter = require('./routes/dashboard');
var productsRouter = require('./routes/products');
var productDetailsRouter = require('./routes/product-details');
var cartRouter = require('./routes/cart');
var entityDirectoryRouter = require('./routes/entity-directory');

var ordersRouter = require('./routes/orders');
var orderDetailsRouter = require('./routes/order-details');
var addressesRouter = require('./routes/addresses');
var profileRouter = require('./routes/profile');
var paymentMethodsRouter = require('./routes/paymentMethods'); // Assuming you have a paymentMethods route

var adminDashboardRouter = require('./routes/adminDashboard');
var adminOrdersRouter = require('./routes/adminOrders');
var adminOrderDetailsRouter = require('./routes/adminOrderDetails');
var adminPtsIndexRouter = require('./routes/adminPtsIndex');
var adminPtsEditRouter = require('./routes/adminPtsEdit');
var entitiesIndexRouter = require('./routes/entitiesIndex');
var entitiesFormRouter = require('./routes/entitiesForm');
var categoriesIndexRouter = require('./routes/categoriesIndex');
var deliveryZonesIndexRouter = require('./routes/deliveryZonesIndex'); // Assuming you have a delivery zones index route

var shippingRouter = require('./routes/shipping');
var paymentRouter = require('./routes/payment');
var reviewRouter = require('./routes/review');

// var googleRouter = require('./routes/auth/google');

var app = express();
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3000/register', 'http://localhost:3000y/account/dashboard'], // Replace with your allowed domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400,
};
app.use(cors(corsOptions));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Disable caching for all responses REVIEW
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize Passport and session
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret', // Use environment variable for session secret
  resave: false, // Set to false to avoid unnecessary session resaving
  saveUninitialized: false, // Set to false to avoid saving uninitialized sessions
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Set secure to true in production
    httpOnly: true, 
    sameSite: 'strict' 
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Use CSRF protection middleware
// app.use(csrf());

// Make CSRF token available in views
// app.use(function(req, res, next) {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

// Define routes
app.use('/', indexRouter);
app.use('/shop', shopRouter);

app.use('/bclogin', bcloginRouter);
app.use('/authenticityCheck', authenticityCheckRouter);

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/products', productsRouter);
app.use('/product-details', productDetailsRouter);
app.use('/cart', cartRouter);
app.use('/entity-directory', entityDirectoryRouter);

app.use('/account/dashboard', dashboardRouter);
app.use('/account/orders', ordersRouter);
app.use('/account/order-details', orderDetailsRouter);
app.use('/account/addresses', addressesRouter);
app.use('/account/profile', profileRouter);
app.use('/account/paymentMethods', paymentMethodsRouter);

app.use('/admin/adminDashboard', adminDashboardRouter);
app.use('/admin/adminOrders', adminOrdersRouter);
app.use('/admin/orders/adminOrderDetails', adminOrderDetailsRouter);
app.use('/admin/products/adminPtsIndex', adminPtsIndexRouter);
app.use('/admin/products/adminPtsEdit', adminPtsEditRouter);
app.use('/admin/entitiesIndex', entitiesIndexRouter);
app.use('/admin/entitiesForm', entitiesFormRouter);
app.use('/admin/categoriesIndex', categoriesIndexRouter);
app.use('/admin/deliveryZonesIndex', deliveryZonesIndexRouter);

app.use('/checkout/shipping', shippingRouter);
app.use('/checkout/payment', paymentRouter);
app.use('/checkout/review', reviewRouter);

// app.use('/auth/google', googleRouter);


// Handle 404 errors
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Redirect to external URL for blockchain register route
app.get("/bcregister", (_, res) => {
  res.redirect(301, 'https://www.veworld.net/')
})

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sqlite3 = require('sqlite3').verbose();
require('dotenv/config');

var hpp = require('hpp');
const { profile } = require('console');
// require('./config/passport')(passport);

app.use(logger('dev'));
app.use(cookieParser());




app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
app.use(hpp());

app.use((req, res, next) => {
  // Assuming the user in the session is stored
  res.locals.user = req.session.user || null;
  next();
});

module.exports = app;

// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   const sql = 'INSERT INTO entities (email, password) VALUES (?, ?)';
//   db.query(sql, email, password, (err) => {
//     if (err) return res.status(500).json({ message: 'Database error' });
//     res.status(200).json({ message: 'Thank you for contacting us!' });
//   });
// });

app.post('/account/dashboard', (req, res) => {
    const { firstName, lastName, email, phone, password, passwordConfirm } = req.body;
    const sql = 'INSERT INTO entities (firstName, lastName, email, phone, password, passwordConfirm) VALUES (?, ?, ?, ?, ?, ?)';
    const parameters = [firstName, lastName, email, phone, password, passwordConfirm];

    db.query(sql, parameters, (err) => {
        // Record the query execution
        recordDatabaseQuery({
            sql: sql,
            parameters: parameters,
            status: err ? 'error' : 'success'
        });

        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(200).json({ message: 'Thank you for contacting us!' });
    });
});


app.get('/login', function (_req, res) {
  console.log('Executing query:');
  // On request of this page initiating SQL query. Assumes that the object initialization is done above.
  const selectQuery = 'SELECT * FROM Entities WHERE FirstName = "A"';
  console.log('Executing query:', selectQuery);

  db.query(selectQuery, function select(error, results, _fields) {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      console.log('No data found for the query.');
      // Render the template with empty data alert
      return res.render('/account/dashboard');
    }

    console.log('Query results:', results);
    res.status(200).send('Query executed successfully.');
  });
});
// app.get('/dashboard', (req, res) => {

//   res.redirect('/dashboard', { title: 'Dashboard' });
// }
// );

