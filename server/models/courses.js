let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let courseSchema = new Schema({
  "cid": String,
  "cname": String,
  "ctime": Number,
  "len": Number,
  "tid": String,
  "start": Number,
  "addr": String
});

module.exports = mongoose.model('course', courseSchema);
