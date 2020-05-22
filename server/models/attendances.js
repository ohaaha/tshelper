let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let attendanceSchema = new Schema({
  "sid": String,
  "name": String,
  "status": Number,
  "tid": String,
  "time": String,
  "sname": String
});

module.exports = mongoose.model('attendance', attendanceSchema);
