let express = require('express');
let router = express.Router();
let Problem = require('../models/problems');
let change = require('../public/javascripts/changeTimeFormat');
let token = require('../public/javascripts/token');

// 获取问题列表
router.get("/", (req, res, next) => {
  let key = req.query.search;
  let myToken = req.get("Authorization");
  let problem;
  token.checkToken(myToken).then((val) => {
    if(key.match(/^[ ]*$/)) {
      problem = Problem.find().sort({'time': -1});
    } else {
      problem = Problem.find({
        $or: [{"question": {'$regex': key, $options: '$i'}}]
      }).sort({'time': -1});
    }
    problem.exec((err, doc)=>{
      if(err) {
        res.json({
          status: 1,
          msg: err.message
        });
      } else {
        if (doc) {
          let solved = [];
          let unsolved = [];
          doc.forEach((item)=>{
            item.time = change.toTime(item.time);
            if(item.answer.length == 0) {
              unsolved.push(item);
            } else {
              solved.push(item);
            }
          });
          res.json({
            status: 0,
            msg: val,
            result: {
              solved: solved,
              unsolved: unsolved
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
// 回答问题
router.post("/response", (req, res, next) => {
  let answerContent = req.body.content;
  let questionID = req.body.num;
  let myToken = req.get("Authorization");
  token.checkToken(myToken).then((val) => {
    Problem.updateOne({_id: questionID}, {
      $push: {answer: answerContent}
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
          val: val,
          msg: '回答成功',
          result: doc
        });
      }
    })
  }).catch((err) => {
    res.json({
      status: 2,
      msg: err,
      result: ''
    });
  })
});

// 添加问题
router.post("/addQuestion", (req, res, next) => {
  let questionContent = req.body.content;
  let localDate = new Date();
  let myToken = req.get("Authorization");

  token.checkToken(myToken).then((val) => {
    Problem.create({
      sid: val,
      question: questionContent,
      time: change.toTimestamp(localDate.toLocaleString())
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
          msg: '成功添加',
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
// 获取我的疑问
router.get('/myproblems', (req, res, next) => {
  let myToken = req.get("Authorization");
  token.checkToken(myToken).then((val) => {
    let myProblems = Problem.find({sid: val}).sort({'time': -1});
    myProblems.exec((err, doc) => {
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
module.exports = router;
