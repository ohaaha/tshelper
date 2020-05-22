let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let leaveSchema = new Schema({
  "sid": String,
  "name": String,
  "status": Number,
  "reason": String,
  "time": String,
  "tid": String
});

module.exports = mongoose.model('leave', leaveSchema);
