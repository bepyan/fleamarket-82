var express = require('express');
var router = express.Router();
const pool = require('../config/dbinfo')

/* 게시물 조회 (SHOW_CNT개수 만큼만) */
router.get('/', async (req, res) => {
  // req.query: {start_idx, cnt, type, align, desc, user_id, school, search} 
  // align: time, view  
  // type: all, wish, mine, purchased
  // desc: 0, 1
  // viewNoContract: 0, 1
  const query = req.query
  var myschool = '(SELECT * FROM boards, (SELECT id as u_id FROM users WHERE school ="' + query.school +'") as school WHERE boards.seller_id = school.u_id) as boards'
  const boards = query.school === '' ? 'boards' : myschool

  var wish = boards+', (SELECT * FROM wishes WHERE user_id = "' + query.user_id +'") as wish WHERE boards.id = wish.board_id'
  var mine = '(SELECT * FROM boards WHERE seller_id = "' + query.user_id +'") as boards'
  var purchased = boards + ', (SELECT board_id as b_id FROM contracts WHERE buyer_id ="'+query.user_id+'" AND (state=4 OR state = 10 OR state = 11)) as mybuy WHERE id = mybuy.b_id'
  const type = {'all': boards, 'wish': wish, 'mine': mine, 'purchased': purchased}
  const FROM = type[query.type]

  const SEARCH = ((query.type === 'wish' || query.type === 'purchased') ? " AND " : " WHERE ") + "title LIKE '%" + query.search + "%' "
  const ORDERBY = {'time': 'editDateTime', 'view': 'hit'}
  const DESC = query.desc === 'true' ? ' DESC' : ' ASC'
  const STATE = query.viewNoContract === 'true'? 'AND boards.state < 2' : ''

  var sql = 'SELECT * FROM ' + FROM + SEARCH + STATE + ' ORDER BY ' + ORDERBY[query.align] + DESC + ' LIMIT ?, ? '
  const params = [parseInt(query.start_idx), parseInt(query.cnt)]
  const conn = await pool.getConnection()
  try {
    const boards = await conn.query(sql, params)
    await conn.commit()
    return res.json({boards: boards})
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  } 
})
/* 게시물 게시 */
router.post('/upload', async (req, res) => {
  // req.body = { seller_id, title, price, contents, images }
  // id, seller_id, title, images, contents, price, state, editDateTime,hit
  var sql = 'INSERT INTO boards VALUES(null,?,?,?,?,?,0,now(),0)'
  const params = [req.body.seller_id, req.body.title, req.body.images, req.body.contents,req.body.price]
 
  const conn = await pool.getConnection()
  try {
    await conn.query(sql, params)
    await conn.commit()
    return res.json()
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})

/* 게시물 수정 */
router.post('/edit', async (req, res) => {
  // req.body = { board_id, title, price, contents, images }
  const body = req.body
  var sql = 'UPDATE boards SET title=?, price=?, contents=?, images=?, editDateTime=now() WHERE id = ?;'
  const params = [body.title, body.price, body.contents, body.images, body.board_id]
  
  const conn = await pool.getConnection()
  try {
    await conn.query(sql, params)
    await conn.commit()
    return res.json()
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})

/* 조회수 올리기 */
router.get('/hit', async (req, res) => {
  // IP당 시간단위로(ex 1시간) 조회수 올릴 수 있도록
  // req.query: {id: id}
  var sql = 'UPDATE boards SET hit = hit+1 WHERE id = ?'
  const conn = await pool.getConnection()
  try {
    await conn.query(sql, req.query.id)
    await conn.commit()
    return res.json()
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})

/* 목록에 이미지 가져오기 */
router.get('/images', async (req, res) => {
  // req.query: {id: id}
  // SELECT id, pw, nickname FROM users WHERE id = ?
  var sql = 'SELECT images FROM boards WHERE id = ? '
  const conn = await pool.getConnection()
  try {
    const result = await conn.query(sql, req.query.id)
    await conn.commit()
    return res.json(result[0])
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})

/* 게시물 찜상태 여부 가져오기 */
router.get('/wish', async (req, res) => {
  // req.query: {board_id, user_id}
  var sql = 'SELECT EXISTS (SELECT * FROM wishes WHERE board_id = ? AND user_id = ?) as exist;'
  const params = [req.query.board_id, req.query.user_id]
  
  const conn = await pool.getConnection()
  try {
    const isWish = (await conn.query(sql, params))[0][0].exist
    await conn.commit()
    return res.json({isWish: isWish})
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})

/* 게시물 찜하기 on-off */
router.post('/wish', async (req, res) => {
  // req.body = {isWish, board_id, user_id}
  var insert = 'INSERT INTO wishes VALUES(null, ?, ?);'
  var del = 'DELETE FROM wishes WHERE board_id = ? AND user_id = ?;'
  const params = [req.body.board_id, req.body.user_id]
 
  const conn = await pool.getConnection()
  try {
    await conn.query(req.body.isWish ? del : insert, params)
    await conn.commit()
    return res.json()
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})

/* 20 - 해당 게시물의 판매자 정보 가져오기 */
router.get('/sellerInfo', async (req, res) => {
  
  const board_id = req.query.board_id
  var sql = 'SELECT users.id, responseRate, level FROM users, boards WHERE boards.seller_id = users.id AND boards.id=' + board_id;
  const conn = await pool.getConnection()
  try {
    const result = await conn.query(sql)
    await conn.commit()
    return res.json(result[0])
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})


/* 22- 리턴받았을 때 숫자따라 쿼리바뀌고, 게시물삭제 */
router.post('/deleteboard', async (req, res) => {

  var board_id = req.body.board_id
 
  // 삭제가능한가
  var validResult = 'SELECT state FROM boards WHERE id =' + board_id
  var delete0 = 'delete from wishes where board_id='+board_id 
                +';delete from boards where id ='+board_id
  var delete1 = 'update contracts set board_id = null where board_id='+board_id
                +';update chats set board_id = null where board_id ='+board_id+';delete from wishes where board_id='+board_id
                +';delete from wishes where board_id='+board_id
                +';delete from boards where id='+board_id
  var sql = ''
  console.log(validResult)
  const conn = await pool.getConnection()
  try {
      const data = (await conn.query(validResult))[0][0].state
      console.log(data)
      await conn.commit()
      if (data==0) sql = delete0;
      else if (data==1 || data == 7 || data == 11) sql = delete1;
      else sql = validResult;
      console.log(sql)
      await conn.query(sql)
      return res.json(data)
  } catch (err) {
      console.log(err)
      return res.status(500).json(err)
  } finally {
      conn.release()
  }
  
})


module.exports = router;