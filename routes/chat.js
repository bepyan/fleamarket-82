var express = require('express');
var router = express.Router();
const pool = require('../config/dbinfo')

/* 채팅방 조회 */
router.get('/', async (req, res) => {
    // req.query: {id, type}
    // type 'all': 전체  'shopping': 구매  'selling': 판매
    //var sql = 'SELECT * FROM chats WHERE seller_id = ? OR buyer_id = ?'
    var sql = "SELECT distinct chats.id, chats.seller_id, chats.buyer_id, chats.board_id, chats.state, chats.updateTime, chats.unread, boards.title, boards.price, boards.images " 
    + "FROM chats, boards WHERE (chats.board_id = boards.id AND (chats.seller_id = ? OR chats.buyer_id=?)) ORDER BY chats.updateTime DESC"
    const seller_id = req.query.type==='shopping' ?  -1 : req.query.id
    const buyer_id = req.query.type==='selling' ?  -1 : req.query.id
    const params =  [seller_id, buyer_id]
    
    const conn = await pool.getConnection()
    try {
        const chats = await conn.query(sql, params)
        await conn.commit()
        return res.json({chats: chats})
    } catch (err) {
        console.log(err)
        conn.rollback()
        return res.status(500).json(err)
    } finally {
        conn.release()
    } 
})


router.post('/new', async (req, res) => {
    // id, seller_id, buyer_id, board_id, state, updateTime, unread
    var existSQL = 'SELECT EXISTS (SELECT * FROM chats WHERE seller_id=? and buyer_id=? and board_id=?) as exist'
    var sql = 'INSERT INTO chats VALUES(null, ?, ?, ?, 0, now(), 1) '
    const body = req.body
    const params = [body.seller_id, body.buyer_id, body.board_id]
    const conn = await pool.getConnection()
    try {
        const exist = (await conn.query(existSQL, params))[0][0].exist
        await conn.commit()
        if(exist)
            return res.json({success: false, message: '이미 채팅방이 존재합니다.'})
        await conn.query(sql, params)
        await conn.commit()
        return res.json({success: true})
    } catch (err) {
        console.log(err)
        conn.rollback()
        return res.status(500).json(err)
    } finally {
        conn.release()
    }
})


/* 채팅방 메시지 조회 */
router.get('/chatlog', async (req, res) => {
    // req.query: {id: room.id}
      var sql = 'SELECT * FROM chatlogs WHERE chat_id = ? ORDER BY sendTime ASC'
      const conn = await pool.getConnection()

      try {
          const chatlog = await conn.query(sql, req.query.id)
          
          await conn.commit()
          return res.json({chatlog: chatlog})
      } catch (err) {
          console.log(err)
          conn.rollback()
          return res.status(500).json(err)
      } finally {
          conn.release()
      } 
})

/* 채팅방 메시지 */
// 채팅방 state도 동시에 바꿔주기
// type 0: 일반 메시지 1: 구매요청 2: 구매수락 3: 물품구매 4: 구매확정 5: 거래완료 10: 거래취소
   
router.post('/chatlog', async (req, res) => {
    // req.query: {id: room.id}
    // id, chat_id, user_id, contents, sendTime, type
    const body = req.body
    const sql = 'INSERT INTO chatlogs VALUES(null,?,?,?,now(),?)'
    const params = [body.chat_id, body.user_id, body.contents, body.type]

    const getAddress = 'SELECT address FROM users WHERE id = "' + body.user_id + '"';
    const sendAddress = 'INSERT INTO chatlogs VALUES(null,?,?,?,now(),0)'

    const STATE = body.type === 0 || body.type === 20 ? "" : ' state=' + body.type +','
    const sql2 = 'UPDATE chats SET' + STATE + ' updateTime=now(), unread=1 WHERE id = ?'
    const params2 = [body.chat_id]

    const sql3 = 'SELECT * FROM chats WHERE id = ' + body.chat_id

    const conn = await pool.getConnection()
    try {
        await conn.query(sql, params)
        if(body.type === 3){
            const address = (await conn.query(getAddress))[0][0].address
            await conn.query(sendAddress, [body.chat_id, body.user_id, ' 나의 주소: ' + address]) 
        }
        await conn.query(sql2, params2)
        const room = await conn.query(sql3)
        await conn.commit()
        return res.json({room})
    } catch (err) {
        console.log(err)
        conn.rollback()
        return res.status(500).json(err)
    } finally {
        conn.release()
    } 
})

/* 채팅방 읽음 표시 */
router.post('/updateRead', async(req, res)=>{
    // req.body = {chat_id: chat_id}
    // unread  1: 않읽음  0: 읽음
    var sql = 'UPDATE chats SET unread = ? WHERE id = ?'
    const conn = await pool.getConnection()
    const param = [0, req.body.chat_id]
    
    try {
        await conn.query(sql, param)
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

/* 채팅방나가기 */
router.post('/exit', async (req, res) => {
    const body = req.body
    var sql = ''
    var out = null
    if(body.type === 'seller'){
        sql = 'UPDATE chats SET seller_id=? WHERE id = ?'
    } else if (body.type === 'buyer'){
        sql = 'UPDATE chats SET buyer_id=? WHERE id = ?'
    }
      const params = [out, body.id]
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

/* 채팅시간 가져오는 함수 */
router.get('/chatTime', async (req,res) =>{

    const chat_id = req.query.chat_id
    const sql = 'SELECT user_id, sendTime FROM chatlogs WHERE chat_id='+chat_id+' ORDER BY sendTime DESC LIMIT 0,2'
    
    const conn = await pool.getConnection()
    try {
        const result = await conn.query(sql)
        await conn.commit() 
        return res.json(result[0])
    } catch (err) {
        return res.status(500).json(err)
    }finally {
        conn.release()
    }

})

/* 점수 올리는 함수 */
router.post('/chatScore',async (req,res) =>{

    const user_id = req.body.user_id
    const sql = 'UPDATE users SET responseRate = responseRate + 0.05 WHERE id=\"'+user_id+'\"'
    const conn = await pool.getConnection()
    try {
        const result = await conn.query(sql)
   
        await conn.commit() 
        return res.json(result[0])
    } catch (err) {
        return res.status(500).json(err)
    }finally {
        conn.release()
    }
})

/* 레벨 다루는 함수 */
router.post('/updatelevel', async (req,res) =>{

    const room_state = req.body.room_state
    const chat_id = req.body.chat_id

    var sql = ''
    var operator = ''
    //거래 정상완료시 10 상승
    if (room_state==4) operator = '+10'
    //거래 취소시 5 하락
    else if (room_state==7) operator = '-5'

    var sql1 = 'update users set level=level'+ operator +' where id=(select distinct seller_id from contracts where chat_id='+ chat_id +');'
    var sql2 = 'update users set level=level'+ operator + ' where id=(select distinct buyer_id from contracts where chat_id='+ chat_id +');'
    
    if (room_state==4) sql=sql1+sql2
    else if (room_state==7) sql=sql2
  
    const conn = await pool.getConnection()
    try {
        const result = await conn.query(sql)
        await conn.commit() 
        return res.json(result[0])
    } catch (err) {
        return res.status(500).json(err)
    }finally {
        conn.release()
    }
})

module.exports = router;
