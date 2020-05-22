let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let teacherSchema = new Schema({
  "tid": String,
  "tpwd": String,
  "projectId": Array,
  "tname": String
});

module.exports = mongoose.model('teacher', teacherSchema);
