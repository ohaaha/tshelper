let express = require('express');
let router = express.Router();
let md5 = require('md5-node');
const mongoose = require('mongoose');
let Student = require('../models/students');
let token = require('../public/javascripts/token');


// 连接mongodb
mongoose.connect('mongodb://rhd:970812@127.0.0.1:27017/tshelper', {
  useNewUrlParser:true,
  useUnifiedTopology: true
}, function(err){
  if(err){
    console.log('Connection Error:' + err)
  }else{
    console.log('Connection success!')
  }
})
// 登录
router.post("/login", (req, res, next) => {
  let password = req.body.pwd;
  let xh = req.body.xh;
  let myToken = token.createToken(xh);
  Student.findOne({sid: xh, spwd: md5(password)}, (err, doc)=>{
    if(err) {
      res.json({
        status: 1,
        msg: "数据库错误"
      });
    } else {
      if (doc) {
        res.json({
          status: 0,
          msg: '登录成功',
          token: myToken,
          result: doc
        });
      } else {
        res.json({
          status: 1,
          msg: "密码或者学号错误"
        });
      }
    }
  });
});
// 检查token是否过期
router.post('/checktoken', (req, res, next) => {
  let myToken = req.get("Authorization");
  token.checkToken(myToken).then((val) => {
    res.json({
      status: 0,
      msg: val,
      result: ''
    })
  }).catch((err) => {
    res.json({
      status: 1,
      msg: err,
      result: ''
    })
  });
});
// 获取课程表
router.get('/getlesson', (req, res, next) => {
  let myToken = req.get("Authorization");
  token.checkToken(myToken).then((val) => {
    let stu = Student.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "cidarr",
          foreignField: "cid",
          as: "course"
        }
      }
    ]);
    stu.exec((err, doc) => {
      if (err) {
        res.json({
          status: 1,
          msg: err.message,
          result: ''
        });
      } else {
        let lesson = [];
        doc.forEach((item) => {
          if(item.sid == val) {
            lesson = item.course;
          }
        })
        res.json({
          status: 0,
          msg: '获取成功',
          result: lesson
        })
      }
    })
  }).catch((err) => {
    res.json({
      status: 1,
      msg: err,
      result: ''
    })
  });
});

module.exports = router;
