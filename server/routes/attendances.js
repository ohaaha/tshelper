let express = require('express');
let router = express.Router();
let Attendance = require('../models/attendances');
let change = require('../public/javascripts/changeTimeFormat');
let token = require('../public/javascripts/token');

// 获取学生上课状况
router.get('/', (req, res, next) => {
  let myToken = req.get("Authorization");

  token.checkToken(myToken).then((val) => {
    let attendances = Attendance.find({sid: val}).sort({time: -1});
    attendances.exec((err, doc) => {
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

/*
教师端
 */
router.post('/attenstatus', (req, res, next) => {
  let status = req.body.status,
    sid = req.body.sid,
    name = req.body.name,
    tid = req.cookies.tid,
    sname = req.body.sname,
    localDate = new Date();
  let list = [];
  for(let i=0; i<sid.length; i++) {
    let newlist = {};
    newlist.sid = sid[i];
    newlist.name = name;
    newlist.tid = tid;
    newlist.sname = sname[i];
    newlist.time = change.toTimestamp(localDate.toLocaleString());
    newlist.status = status[i];
    list.push(newlist);
  }
  Attendance.insertMany(list, (err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      });
    } else {
      res.json({
        status: 0,
        msg: '上传成功',
        result: doc
      })
    }
  })
});
// 加载本堂课的记录
router.get('/loadatten', (req, res, next) => {
  let sid = req.query.sid,
    name = req.query.name,
    tid = req.cookies.tid,
    localDate = new Date(),
    attendance;
  if(sid == '') {
    attendance = Attendance.find({name: name, tid: tid}).sort({time: -1});
  } else {
    attendance = Attendance.find({name: name, tid: tid, sid: sid}).sort({time: -1});
  }
  attendance.exec((err, doc) => {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      });
    } else {
      let newdoc = [];
      if (doc) {
        doc.forEach((item) => {
          if(change.toTime(item.time).substr(0, 10) ==
            change.toTime(change.toTimestamp(localDate.toLocaleString())).substr(0, 10)) {
            newdoc.push(item);
          }
        })
        res.json({
          status: 0,
          msg: '',
          result: newdoc
        });
      }
    }
  })
});
// 改变学生出勤情况
router.post('/changestatus', (req, res, next) => {
  let id = req.body.id,
    status = req.body.status,
    attendance;
  if(status == 2) {
    attendance = Attendance.deleteOne({_id: id});
  } else {
    attendance = Attendance.updateOne({_id: id}, {$set: {status: status}});
  }
  attendance.exec((err, doc) => {
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: 0,
        msg: '编辑成功',
        result: doc
      });
    }
  });
});
module.exports = router;
