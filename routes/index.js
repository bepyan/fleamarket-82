var express = require('express');
var router = express.Router();
const pool = require('../config/dbinfo')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', async (req, res, next) => {
  var sqlQuery = 'SELECT * FROM test'
  const conn = await pool.getConnection();

  try {
    const data = await conn.query(sqlQuery);
    await conn.commit();
    return res.json(data);
  } catch (error) {
    console.log(err);
    conn.rollback();
  } finally {
    conn.release(); // pool에 connection 반납
  }
  return res.json(data);
})

module.exports = router;
