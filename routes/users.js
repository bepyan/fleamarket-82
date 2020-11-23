var express = require('express');
var router = express.Router();
const pool = require('../config/dbinfo')

/* GET users listing. */

router.get('/login', async (req, res) => {
  //req.query => {id: id, password: password}
  var sql = 'SELECT id, pw, nickname ,school FROM users WHERE id = ?'
  const conn = await pool.getConnection()
  try {
    const result = await conn.query(sql, [req.query.id])
    await conn.commit()
    // result => [[TextRow { id: 'test', password: 'asdf', nickname: '시험맨' }], ...]
    // 해당 아이디가 없을 때
    if(!result[0].length)
        return res.json({success: false, message: "해당 아이디가 없습니다"})
    // 비밀번호가 틀릴 때
    if(result[0][0].pw!== req.query.password)
        return res.json({success: false, message:"비밀번호가 틀렸습니다"})
      
    return res.json({success: true, nickname: result[0][0].nickname, school: result[0][0].school})
  
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})

/* 회원가입 */
router.post('/register', async (req, res, next) => {
  var data = req.body
  var sql = 'INSERT INTO users set ?'
  var sqlData = { 
    id: data.id, 
    pw: data.pw, 
    nickname: data.nickName,
    name:data.name,
    phone: data.phone,
    address: data.address,
    birth: data.birth,
    school: data.school,
    level:0,
    responseRate:0 
  }
  const conn = await pool.getConnection()
  try {
    await conn.query(sql, sqlData)
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

router.get('/register', async (req, res) => {
  var id = req.query.id;
  // 아이디 존재하면 1 없으면 0
  // 닉네임 존재하면 1 없으면 0
  var sql = 'SELECT EXISTS (SELECT id FROM users WHERE id =\"' + id + '\") AS STATE;' 
  const conn = await pool.getConnection()
  try {
    const data = await conn.query(sql)
    await conn.commit()
    return res.json(data[0])
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})

/* 유저 키워드 조회 */
router.get('/keywords', async (req, res) => {

  var sql = 'SELECT * FROM keywords WHERE user_id = ?'
  const conn = await pool.getConnection()
  try {
    const keywords = await conn.query(sql, req.query.user_id)
    await conn.commit()
    return res.json({keywords: keywords})
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})

/* 유저 키워드 등록 */
router.post('/keywords/register', async (req, res) => {

  var sql = 'INSERT INTO keywords SET ?'
  const params = {
    id: null, 
    user_id: req.body.user_id,
    keyword: req.body.keyword
  }
  const conn = await pool.getConnection()
  try {
    await conn.query(sql, params)
    await conn.commit()
    return res.json({})
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})

/* 유저 키워드 삭제 */
router.post('/keywords/delete', async (req, res) => {

  var sql = 'DELETE FROM keywords WHERE id = ?'
  const conn = await pool.getConnection()
  try {
    await conn.query(sql, req.body.id)
    await conn.commit()
    return res.json({})
  } catch (err) {
    console.log(err)
    conn.rollback()
    return res.status(500).json(err)
  } finally {
    conn.release()
  }
})
module.exports = router;