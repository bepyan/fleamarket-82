const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'us-cdbr-east-02.cleardb.com',
  port: 3306, 
  user: 'babe7a2c1e0cf9',
  password: '2a46784d',
  database: 'heroku_0f596b863ebaca4',
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