let express = require('express');
let router = express.Router();
let Leave = require('../models/leaves');
let Student = require('../models/students');
let change = require('../public/javascripts/changeTimeFormat');
let token = require('../public/javascripts/token');

// 获取学生的请假信息
router.get('/', (req, res, next) => {
  let myToken = req.get("Authorization");
  token.checkToken(myToken).then((val) => {
    let leaves = Leave.find({sid: val}).sort({time: -1});
    leaves.exec((err, doc) => {
      if (err) {
        res.json({
          status: 1,
          msg: err.message
        });
      } else {
        if (doc) {
          doc.forEach((item) => {
            item.time = change.toTime(item.time);
          });
          res.json({
            status: 0,
            msg: '',
            result: doc
          });
        }
      }
    });
  }).catch((err) => {
    res.json({
      status: 2,
      msg: err,
      result: ''
    });
  })
});
// 请假
router.post('/askleave', (req, res, next) => {
  let date = req.body.date,
    cname = req.body.cname,
    tid = req.body.tid,
    reason = req.body.reason,
    myToken = req.get("Authorization");
  token.checkToken(myToken).then((val) => {
    Leave.create({
      time: change.toTimestamp(date),
      name: cname,
      tid: tid,
      reason: reason,
      status: 0,
      sid: val
    } ,(err, doc) => {
      if(err) {
        res.json({
          status: 1,
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: 0,
          msg: '发送成功',
          result: doc
        });
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
/*

教师端

 */
// 获取请假信息
router.get('/teacher', (req, res, next) => {
  let tid = req.cookies.tid;
  let sid = req.query.sid,
    name = req.query.name,
    leave,
    time = req.query.time;
  if(sid.match(/^[ ]*$/) && name.match(/^[ ]*$/)) {
    leave = Leave.find({tid: tid, status: 0}).sort({time: -1});
  } else if (!sid.match(/^[ ]*$/) && name.match(/^[ ]*$/)) {
    leave = Leave.find({tid: tid, sid: sid, status: 0}).sort({time: -1});
  } else if (sid.match(/^[ ]*$/) && !name.match(/^[ ]*$/)) {
    leave = Leave.find({tid: tid, name:{$regex: eval(`/^${name}$/i`)}, status: 0}).sort({time: -1});
  } else if (!sid.match(/^[ ]*$/) && !name.match(/^[ ]*$/)) {
    leave = Leave.find({tid: tid, sid: sid, name: name, status: 0}).sort({time: -1});
  }
  leave.exec((err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      });
    } else {
      doc.forEach((item)=>{
        item.time = change.toTime(item.time);
      });
      if (time.match(/^[ ]*$/)) {
        res.json({
          status: 0,
          msg: '',
          result: doc
        });
      } else {
        let leaveList = [];
        doc.forEach((item) => {
          if (item.time.substr(0, 10) == time) {
            leaveList.push(item)
          }
        })
        res.json({
          status: 0,
          msg: '',
          result: leaveList
        });
      }
    }
  })
});
// 同意或者拒绝请假
router.post('/operate', (req, res, next) => {
  let id = req.body.id,
    status = req.body.flag,
    localDate = new Date();
  Leave.updateOne({_id: id}, {status: status, time: change.toTimestamp(localDate.toLocaleString())}, (err, doc) => {
    if(err) {
      res.json({
        status: 1,
        msg: err.message
      });
    } else {
      res.json({
        status: 0,
        msg: '操作成功',
        result: doc
      });
    }
  })
});
// 所选的操作
router.post('/seloperate', (req, res, next) => {
  let status = req.body.status,
    selArr = req.body.selarr,
    localDate = new Date();

  Leave.updateMany({_id: {$in: selArr}}, {status: status, time:
      change.toTimestamp(localDate.toLocaleString())}, (err, doc) => {
    if(err) {
      res.json({
        status: 1,
        msg: err.message
      });
    } else {
      res.json({
        status: 0,
        msg: '操作成功',
        result: doc
      });
    }
  })
});
module.exports = router;
