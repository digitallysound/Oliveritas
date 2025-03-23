var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var sqlite3 = require('sqlite3').verbose();

router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/', function(req, res, next) {
  let db = new sqlite3.Database('./database.sqlite');
  const { username, password, address } = req.body;
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      return next(err);
    }
    db.run(`INSERT INTO users (username, password, address) VALUES (?, ?, ?)`, [username, hash, address], function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.render('register', { title: 'Register', error: 'Username already exists' });
        } else {
          return next(err);
        }
      }
      res.redirect('/login');
    });
  });

  db.close();
});

module.exports = router;
