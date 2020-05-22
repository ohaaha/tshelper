let express = require('express');
let router = express.Router();
let Project = require('../models/projects');
let change = require('../public/javascripts/changeTimeFormat');
let token = require('../public/javascripts/token');
/*
学生端
 */
router.get("/", (req, res, next) => {
  let key = req.query.search;
  let project;
  let myToken = req.get("Authorization");
  token.checkToken(myToken).then((val) => {
    if (key.match(/^[ ]*$/)) {
      project = Project.find()
    } else {
      project = Project.find({
        $or: [{"name": {'$regex': key, $options: '$i'}}]
      });
    }
    let pro = project.find({last_id: ""}).sort({'time': -1});
    pro.exec((err, doc) => {
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
            sid: val,
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
// 申请项目
router.post('/apply', (req, res, next) => {
  let id = req.body.id;
  let myToken = req.get("Authorization");
  token.checkToken(myToken).then((val) => {
    Project.find({sid: val}, (err, doc) => {
      if (err) {
        res.json({
          status: 3,
          msg: err.message,
          result: ''
        });
      } else {
        if (doc.length > 10) {
          res.json({
            status: 1,
            msg: '申请项目过多',
            result: doc
          })
        } else {
          Project.updateOne({_id: id}, {
            $push: {sid: val}
          }, (err, doc) => {
            if (err) {
              res.json({
                status: 1,
                msg: err.message,
                result: ''
              });
            } else {
              res.json({
                status: 0,
                msg: '申请成功',
                result: doc
              });
            }
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
// 获取用户申请的项目
router.get('/myprojects', (req, res, next) => {
  let have = [];
  let nohave = [];
  let myToken = req.get("Authorization");
  token.checkToken(myToken).then((val) => {
    let project = Project.find({sid: val}).sort({time: -1});
    project.exec((err, doc) => {
      if (err) {
        res.json({
          status: 1,
          msg: err.message
        });
      } else {
        if (doc) {
          doc.forEach((item) => {
            if (val === item.last_id) {
              have.push(item);
            } else if (item.last_id == "") {
              nohave.push(item);
            }
            item.time = change.toTime(item.time);
          });
          res.json({
            status: 0,
            msg: '',
            result: {
              have,
              nohave
            }
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
// 取消申请的项目
router.post('/cancelproject', (req, res, next) => {
  let id = req.body.id;

  let myToken = req.get("Authorization");
  token.checkToken(myToken).then((val) => {
    Project.updateOne({_id: id}, {
      $pull: {sid: val}
    }, (err, doc) => {
      if (err) {
        res.json({
          status: 1,
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: 0,
          msg: '取消成功',
          result: doc
        });
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
router.get('/teacher', (req, res, next) => {
  let tid = req.cookies.tid;
  let project = Project.aggregate([
    {
      $lookup: {
        from: "students",
        localField: "last_id",
        foreignField: "sid",
        as: "stu"
      }
    }
  ]).sort({time: -1});
  project.exec((err, doc) => {
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      });
    } else {
      let newdoc = [];
      let snamearr = [];
      doc.forEach((item) => {
        if(item.tid == tid) {
          newdoc.push(item);
          if(item.stu.length > 0) {
            snamearr.push(item.stu[0].sname);
          } else {
            snamearr.push('暂无');
          }
        }
      });
      res.json({
        status: 0,
        msg: '获取成功',
        result: {
          doc: newdoc,
          sname: snamearr
        }
      });
    }
  })
});
// 添加项目
router.post('/addproject', (req, res, next) => {
  let pname = req.body.pname,
    plimit = req.body.plimit,
    ptel = req.body.ptel,
    tid = req.cookies.tid,
    prequire = req.body.prequire;
  let localDate = new Date();

  Project.create({
    name: pname,
    limit: plimit,
    tid: tid,
    tel: ptel,
    require: prequire,
    last_id: '',
    time: change.toTimestamp(localDate.toLocaleString())
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
        msg: '成功添加',
        result: doc
      });
    }
  })
});
// 撤销项目
router.post('/delproject', (req, res, next) => {
  let id = req.body.id;

  Project.deleteOne({_id: id}, (err, doc) => {
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      });
    } else {
      res.json({
        status: 0,
        msg: '撤销成功',
        result: doc
      });
    }
  });
});
// 编辑项目
router.post('/editproject', (req, res, next) => {
  let pname = req.body.prname,
    plimit = req.body.prlimit,
    ptel = req.body.prtel,
    id = req.body.id,
    prequire = req.body.prrequire;
  Project.updateOne({_id: id}, {$set: {
      name: pname,
      limit: plimit,
      tel: ptel,
      require: prequire
    }
  }, (err, doc) => {
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
// 获取申请项目的信息
router.get('/applylist', (req, res, next) => {
  let id = req.query.id;
  let tid = req.cookies.tid;
  let project = Project.aggregate([
    {
      $lookup: {
        from: "students",
        localField: "sid",
        foreignField: "sid",
        as: "stu"
      }
    }
  ]).sort({time: -1});
  project.exec((err, doc) => {
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      });
    } else {
      let jsonarr = [];
      if(id == '全部') {
        doc.forEach((item) => {
          if (item.stu.length > 0 && item.tid == tid && item.last_id == '') {
            item.stu.forEach((item2) => {
              let jsonobj = {};
              jsonobj.pname = item.name;
              jsonobj.applysname = item2.sname;
              jsonobj.applysid = item2.sid;
              jsonobj.id = item._id;
              jsonarr.push(jsonobj);
            })
          }
        })
      } else {
        doc.forEach((item) => {
          if (item.stu.length > 0 && item.tid == tid && item.last_id == '' && item._id==id) {
            item.stu.forEach((item2) => {
              let jsonobj = {};
              jsonobj.pname = item.name;
              jsonobj.applysname = item2.sname;
              jsonobj.applysid = item2.sid;
              jsonobj.id = item._id;
              jsonarr.push(jsonobj);
            })
          }
        })
      }
      res.json({
        status: 0,
        msg: '编辑成功',
        result:  jsonarr
      });
    }
  })
});
// 获取项目名称
router.get('/getname', (req, res, next) => {
  let tid = req.cookies.tid;
  let project = Project.find({tid, tid, last_id: ''}).sort({time: -1});
  let proName = [{pname: '全部'}];
  project.exec((err, doc) => {
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      });
    } else {
      doc.forEach((item) => {
        let pro = {};
        pro.pname = item.name;
        pro.id = item._id;
        proName.push(pro);
      })
      res.json({
        status: 0,
        msg: '获取成功',
        result: proName
      });
    }
  });
});
// 教师对申请人的操作
router.post('/applyopt', (req, res, next) => {
  let id = req.body.id,
    flag = req.body.flag,
    sid = req.body.sid,
    project;
  if(flag == 0) {
    project = Project.updateOne({_id: id}, {$set: {last_id: sid}});
  } else {
    project = Project.updateOne({_id: id}, {$pull: {sid: sid}});
  }
  project.exec((err, doc) => {
    if(err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
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
