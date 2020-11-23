var express = require('express');
var router = express.Router();
const pool = require('../config/dbinfo')

/* TOP5 검색어 조회 */
router.get('/', async (req, res) => {
    // req.query.limit
    var sql = 'SELECT text FROM search_db ORDER BY hit DESC LIMIT 0, 5'
    const conn = await pool.getConnection()
    try {
        const searches = await conn.query(sql)
        await conn.commit()
        return res.json({searches: searches})
    } catch (err) {
        console.log(err)
        conn.rollback()
        return res.status(500).json(err)
    } finally {
        conn.release()
    } 
})
/* 검색어 입력 */
router.post('/', async (req, res) => {
    // req.body = {text} 
    var sql = 'SELECT EXISTS (SELECT * FROM search_db WHERE text = ?) as exist'
    var insert = 'INSERT INTO search_db VALUES(null, ?, 1)'
    var update = 'UPDATE search_db SET hit = hit+1 WHERE text = ?'
    
    const conn = await pool.getConnection()
    try {
        const exist = (await conn.query(sql, [req.body.text]))[0][0].exist
        await conn.commit()
        await conn.query(exist ? update : insert, [req.body.text])
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