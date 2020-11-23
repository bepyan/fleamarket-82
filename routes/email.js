var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const ejs = require('ejs');

/* 학교 이메일 코드인증 */
router.get('/', (req, res, next) => {

  res.send('respond with a resource');
  // 클라이언트에서 받은 코드와 이메일

  var codekey = req.query.codekey; 
  var id= req.query.id;
  var email= req.query.email;

  ejs.renderFile('./views/email.ejs', {authCode : codekey }, (err, data) => {
    if(err)
      return console.log(err)

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shguswl34@gmail.com',
        pass: 'apdkfl44@@'
      }
    });
    // 
    var mailOptions = {
      from: 'shguswl34@gmail.com',
      to: id+'@'+email,
      subject: '[팔이피플 메일이 도착했습니다!]',
      html: data
    }

    transporter.sendMail(mailOptions, (err, info) => console.log(err ? err : 'Email sent: ' + info.response))
  })
})
module.exports = router;
