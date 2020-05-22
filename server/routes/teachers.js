let express = require('express');
let router = express.Router();
let md5 = require('md5-node');
let Teacher = require('../models/teachers');

// 登录
router.post("/login", (req, res, next) => {
  let password = req.body.tpwd;
  let tid = req.body.tid;
  Teacher.findOne({tid: tid, tpwd: md5(password)}, (err, doc)=>{
    if(err) {
      res.json({
        status: 1,
        msg: "数据库错误"
      });
    } else {
      if (doc) {
        res.cookie('tid', doc.tid, {
          path: '/',
          maxAge: 1000*60*60*4
        });
        res.cookie('tname', doc.tname, {
          path: '/',
          maxAge: 1000*60*60*24
        });
        res.json({
          status: 0,
          msg: '登录成功',
          result: doc.tname
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
// 检查是否登录
router.get('/checkLogin', (req, res, next) => {
  if(req.cookies.tid) {
    res.json({
      status: 0,
      msg: '',
      result: req.cookies.tname || ''
    });
  } else {
    res.json({
      status: 1,
      msg: '未登录',
      result: ''
    });
  }
});
// 登出
router.post('/logout', (req, res, next) => {
  res.cookie("userId", '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: 0,
    msg: '',
    result: ''
  });
});
module.exports = router;
