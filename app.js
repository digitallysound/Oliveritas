const express = require('express');
const path = require('path');
const createError = require('http-errors');

const passport = require('passport');
const csrf = require('csurf'); 

var session = require('express-session');
var helmet = require('helmet'); 
var rateLimit = require('express-rate-limit');
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
const authenticityCheckRouter = require('./routes/authenticityCheck');
// var googleRouter = require('./routes/auth/google');
// var facebookRouter = require('./routes/auth/facebook');

var app = express();

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
app.use(csrf());

// Make CSRF token available in views
app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Define routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/authenticityCheck', authenticityCheckRouter);
// app.use('/auth/google', googleRouter);
// app.use('/auth/facebook', facebookRouter);

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

// Redirect to external URL for /register route
app.get("/register", (_, res) => {
  res.redirect(301, 'https://www.veworld.net/')
})

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sqlite3 = require('sqlite3').verbose();
require('dotenv/config');

var hpp = require('hpp');
// require('./config/passport')(passport);

app.use(logger('dev'));
app.use(cookieParser());

var db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  address TEXT,
  order_details TEXT
)`, (err) => {
  if (err) {
    console.error('Error creating users table:', err.message);
  }
});

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
app.use(hpp());


module.exports = app;