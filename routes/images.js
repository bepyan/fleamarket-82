var express = require('express');
const pool = require('../config/dbinfo')
var router = express.Router();


/* 이미지 업로드 */
router.post("/upload", async (req, res, next) => {
  
  var urlBasket = req.body.urlBasket;
  var board_id = req.body.board_id;

  console.log(urlBasket)
  console.log(board_id)

  var sqlQuery = 'UPDATE party.boards SET images=? where id=?'
  var sqlData = [urlBasket, board_id]

  const conn = await pool.getConnection();

  try {
    const data = await conn.query(sqlQuery, sqlData);

    await conn.commit();
    return res.json(data);
  } catch (error) {
    console.log(err, "image insert가 수행되지 않았습니다.");
    conn.rollback();
  } finally {
    conn.release(); // pool에 connection 반납
  }
});
module.exports = router;

   