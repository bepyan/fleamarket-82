var express = require('express');
const pool = require('../config/dbinfo')
var router = express.Router();


  //tradeNum을 통해 받아오기
  router.get("/", async (req, res, next) => {
    
  
    var data = req.query.tradeNum;
  

    var sqlQuery = 'SELECT * FROM contracts WHERE id =\"' + data + '\";'
    
    const conn = await pool.getConnection();
  
    try {
      const data = await conn.query(sqlQuery);
      await conn.commit();
      
      return res.json(data);
    } catch (err) {
      console.log(err);
      conn.rollback();
    } finally {
      conn.release(); // pool에 connection 반납
    }
  });

router.get("/user", async (req, res, next) => {
  
          var chat_id = req.query.chat_id;
          var board_id=req.query.board_id;
          var sqlQuery = 'SELECT *  FROM contracts where chat_id =\"' + chat_id + '\" AND board_id =\"' + board_id + '\";'
          const conn = await pool.getConnection();
          try {
            const data = await conn.query(sqlQuery);
            await conn.commit();
            return res.json(data);
          } catch (error) {
            console.log(err);
            conn.rollback();
          } finally {
            conn.release(); 
          }
});


  router.get("/board", async (req, res, next) => { // 계약 등록을 위해 받아오기
    

    var sql1 = 'SELECT * FROM boards WHERE id = ' + req.query.board_id +';'
    var sql2= 'SELECT * FROM chats WHERE id = ' + req.query.chat_id +';'
   const conn = await pool.getConnection()
    try {
      const data=await conn.query(sql1+sql2);
      await conn.commit()
      return res.json(data)
    } catch (err) {
      console.log(err)
      conn.rollback()
      return res.status(500).json(err)
    } finally {
      conn.release()
    }
  });



  router.post('/contract', async (req, res, next) => {
 
    var data = req.body;
    var chat_id=data.contract.chat_id;
    var board_id = data.contract.board_id;
    var board_price = data.contract.price;
    var seller_id = data.contract.seller_id;   
    var buyer_id = data.contract.buyer_id;   
     var sqlQuery = 'INSERT INTO contracts (chat_id,board_id,board_price,seller_id,buyer_id,state) VALUES(?,?,?,?,?,1)';
     var sqlData = [chat_id,board_id,board_price,seller_id,buyer_id];

     const conn = await pool.getConnection()
     try {
       await conn.query(sqlQuery,sqlData)
       await conn.commit() 
       return res.json({ success: true })
   
     } catch (err) {  
      console.log(err)
       return res.status(500).json(err)
     }
   
   })



   router.get("/contract", async (req, res, next) => { // 계약 등록을 위해 받아오기
  

    
    var sqlQuery='SELECT * FROM contracts ORDER BY id DESC LIMIT 1;';

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
  });

  router.get('/state', async (req, res) => {
    // req.query: {tradeNum: tradeNum  }
    
    var sql1 = 'UPDATE  contracts SET state ='+ req.query.state + ' WHERE id = ' + req.query.tradeNum +';'
    var sql2 = 'UPDATE boards SET state ='+ req.query.state + ' WHERE id ='+ req.query.board_id +';'
    
    const conn = await pool.getConnection()


    try {
      await conn.query(sql1+sql2);
      await conn.commit()
      return res.json({ success: true })
    } catch (err) {
      console.log(err)
      conn.rollback()
      return res.status(500).json(err)
    } finally {
      conn.release()
    }
  })




module.exports = router;



