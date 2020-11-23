var express = require('express');
const pool = require('../config/dbinfo')
var router = express.Router();

/* GET mypages listing. */

// 내 정보 가져오기
router.get('/profile', async (req, res, next) => {
    
    var id = req.query.id
    var sqlQuery = 'SELECT * FROM users WHERE id =\"' + id + '\"'

    const conn = await pool.getConnection()
    try {
        const result = await conn.query(sqlQuery)
        await conn.commit() 
        return res.json(result[0])
    } catch (err) {
        return res.status(500).json(err)
    }finally {
        conn.release()
    }
})


// 내 판매목록 불러오기 (판매중 0, 예약중 1, 거래완료 2)
router.get('/mysell', async (req, res, next) => {
    var user_id = req.query.user_id
    var sqlQuery = 'SELECT id, title, images, price, state FROM boards WHERE seller_id=\"' + user_id + '\"'
    
    const conn = await pool.getConnection()
    try {

        const result = await conn.query(sqlQuery)
        await conn.commit() 
        return res.json(result[0])

    } catch (err) {
        return res.status(500).json(err)
    }finally {
        conn.release()
    }
})


// 내 구매목록 불러오기
router.get('/mybuy', async (req, res, next) => {
    
    var user_id = req.query.user_id //구매자 id = 현재 내 id
    var sqlQuery = 'SELECT boards.id, boards.title, boards.images, board_price, contracts.contractDate FROM contracts, boards WHERE contracts.board_id = boards.id and buyer_id = \"'+ user_id + '\"'
    
    const conn = await pool.getConnection()
    try {
        const result = await conn.query(sqlQuery)
        await conn.commit() 
        return res.json(result[0])
    } catch (err) {
        return res.status(500).json(err)
    }finally {
        conn.release()
    }
})


// 내 위시리스트 불러오기
router.get('/mywish', async (req, res, next) => {
 
    var user_id = req.query.user_id
    var sqlQuery = 'SELECT board_id, title, images, price, state FROM boards, wishes WHERE boards.id = wishes.board_id and wishes.user_id=\"' + user_id + '\"'
   
    const conn = await pool.getConnection()
    try {
        const result = await conn.query(sqlQuery)
        await conn.commit() 
        return res.json(result[0])
    } catch (err) {
        return res.status(500).json(err)
    }finally {
        conn.release()
    }
})

//내정보수정
router.post('/updateinfo', async (req, res, next) => {

    var id = req.body.id
    var nickname = req.body.nickname
    var address = req.body.address
    var school = req.body.school
    //var image = req.body.image

    var sqlQuery = 'UPDATE users SET users.nickname=?, users.address=?,users.school=? WHERE users.id=?'
    var sqlData = [nickname, address,school,id]

    const conn = await pool.getConnection({multipleStatements: true})

    try {
        const data = await conn.query(sqlQuery,sqlData)
        await conn.commit() 
        return res.json(data)
    } catch (err) {
        console.log(err,"내정보가 수정되지 않음")
        conn.rollback()
        return res.status(500).json(err)
    } finally {
        conn.release()
    }
})

/* 회원탈퇴가능한지 유효성검사, 결과가 1이상이면 회원탈퇴불가 */
router.get('/deleteinfovalid', async(req,res) =>{
    var user_id = req.query.user_id
    var sql = 'SELECT count(*) as count FROM contracts WHERE (buyer_id =\"'+ user_id +'\" OR seller_id=\"'+ user_id +'\") AND state NOT IN (0,4,7,11);'

    const conn = await pool.getConnection()
    try {
        const result = await conn.query(sql)
        await conn.commit() 
        return res.json(result[0])
    } catch (err) {
        conn.rollback()
        return res.status(500).json(err)
    }finally {
        conn.release()
    }
})

//회원탈퇴, 다중쿼리 (연결된 모든 외래키값을 null로 바꾼다)
router.post('/deleteinfo', async (req, res, next) => {

    var id = req.body.id

    var sql1 = 'update boards set seller_id=null where seller_id = \"'+ id +'\";'
    var sql2 = 'update contracts set seller_id=null where seller_id = \"'+ id +'\";'
    var sql3 = 'update contracts set buyer_id=null where buyer_id = \"'+ id +'\";'
    var sql4 = 'update chats set seller_id=null where seller_id = \"'+ id +'\";'
    var sql5 = 'update chats set buyer_id=null where buyer_id = \"'+ id +'\";'
    var sql6 = 'update chatlogs set user_id=null where user_id= \"'+ id +'\";'
    var sql7 = 'update wishes set user_id=null where user_id= \"'+ id +'\";'
    var sqlQuery ='DELETE FROM party.users WHERE id=\"'+id+'\";'

    const conn = await pool.getConnection()

    try {
        const data = await conn.query(sql1 + sql2 + sql3 + sql4 + sql5 + sql6 + sql7 + sqlQuery)
        await conn.commit()
        return res.json(data)
    } catch (err) {
        console.log(err,"내정보가 삭제되지 않음")
        return res.status(500).json(err)
    } finally {
        conn.release()
    }
})

/* 회원탈퇴시에 거래전인 게시물 모두 삭제 */
router.post('/deleteuserboard', async (req, res, next) => {
    var id = req.body.id
    var sql ='DELETE FROM boards WHERE seller_id=\"'+ id +'\" AND state=0'
    const conn = await pool.getConnection()

    try {
        const data = await conn.query(sql)
        await conn.commit()
        return res.json(data)
    } catch (err) {
        console.log(err,"내 게시글 삭제되지 않음")
        return res.status(500).json(err)
    } finally {
        conn.release()
    }
})

module.exports = router;

