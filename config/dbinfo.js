const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'us-cdbr-east-02.cleardb.com',
  port: 3306, 
  user: 'bfef00667d3e5c',
  password: '5b7aaea4',
  database: 'heroku_f731eb1b594831b',
  connectionLimit: 100,
  dateStrings:'date',
  multipleStatements: true,
})

// const pool = mysql.createPool({
//   host: 'localhost',
//   port: 3306, 
//   user: 'root',
//   password: 'asdf',
//   database: 'party',
//   connectionLimit: 100,
//   dateStrings:'date',
//   multipleStatements: true,
// })


module.exports = pool