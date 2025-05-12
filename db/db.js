const mysql = require('mysql2');
 
// Create connection pool
const connection = mysql.createConnection({
  host: 'johnc740.sg-host.com',   // Use '127.0.0.1' or your MySQL host
  user: 'utm5xo9km8zjo',   // Replace with your MySQL username
  password: 'TEST@test', // Replace with your MySQL password
  database: 'dbgifl5cl6f4og'   // Replace with your MySQL database name
});
 
const pingDatabase = () => {
  connection.query('SELECT 1', (err, results) => {
    if (err) {
      console.error('Error pinging database:', err);
    } else {
      console.log('Database ping successful');
    }
  });
};


// Connect to database
connection.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  
  // Set up interval for the keepAlive
  setInterval(pingDatabase, 60000);

  console.log('Connected to MySQL database');
});
 
module.exports = connection;